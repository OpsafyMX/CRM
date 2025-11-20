import express from 'express';
import { body } from 'express-validator';
import { User } from '../models/index.js';
import { generateToken, generateRefresh Token } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import logger from '../config/logger.js';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('first_name').notEmpty().withMessage('First name is required'),
        body('last_name').notEmpty().withMessage('Last name is required'),
    ],
    validate,
    async (req, res) => {
        try {
            const { email, password, first_name, last_name, phone } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'User with this email already exists',
                });
            }

            // Create user (password will be hashed by model hook)
            const user = await User.create({
                email,
                password,
                first_name,
                last_name,
                phone,
            });

            // Generate tokens
            const token = generateToken(user.id);
            const refreshToken = generateRefreshToken(user.id);

            logger.info(`New user registered: ${email}`);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: user.toJSON(),
                    token,
                    refreshToken,
                },
            });
        } catch (error) {
            logger.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Error registering user',
            });
        }
    }
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    validate,
    async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({
                where: { email },
                include: [
                    {
                        association: 'roles',
                        include: ['permissions'],
                    },
                ],
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                });
            }

            // Check if user is active
            if (!user.is_active) {
                return res.status(401).json({
                    success: false,
                    message: 'Your account has been deactivated. Contact administrator.',
                });
            }

            // Verify password
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                });
            }

            // Update last login
            await user.update({ last_login: new Date() });

            // Generate tokens
            const token = generateToken(user.id);
            const refreshToken = generateRefreshToken(user.id);

            logger.info(`User logged in: ${email}`);

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: user.toJSON(),
                    token,
                    refreshToken,
                },
            });
        } catch (error) {
            logger.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Error logging in',
            });
        }
    }
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
import { authenticate } from '../middleware/auth.js';

router.get('/me', authenticate, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                user: req.user.toJSON(),
                permissions: Array.from(req.userPermissions),
            },
        });
    } catch (error) {
        logger.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
        });
    }
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (client should delete token)
 * @access  Private
 */
router.post('/logout', authenticate, async (req, res) => {
    try {
        logger.info(`User logged out: ${req.user.email}`);

        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        logger.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging out',
        });
    }
});

export default router;
