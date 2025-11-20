import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import logger from '../config/logger.js';

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Authorization header required.',
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user
            const user = await User.findByPk(decoded.userId, {
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
                    message: 'User not found. Invalid token.',
                });
            }

            if (!user.is_active) {
                return res.status(401).json({
                    success: false,
                    message: 'User account is deactivated.',
                });
            }

            // Attach user to request
            req.user = user;

            // Extract permissions for easy access
            req.userPermissions = new Set();
            user.roles?.forEach(role => {
                role.permissions?.forEach(permission => {
                    req.userPermissions.add(permission.name);
                });
            });

            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired. Please login again.',
                });
            }

            logger.error('JWT verification error:', err);
            return res.status(401).json({
                success: false,
                message: 'Invalid token.',
            });
        }
    } catch (error) {
        logger.error('Authentication middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication.',
        });
    }
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
export const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    // Try to authenticate but don't fail if invalid
    await authenticate(req, res, (err) => {
        if (err) {
            return next();
        }
        next();
    });
};

/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );
};
