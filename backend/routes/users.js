import express from 'express';
import { User, Role } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, requirePermission } from '../middleware/rbac.js';
import logger from '../config/logger.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requirePermission('users:read'), async (req, res) => {
    try {
        const users = await User.findAll({
            include: ['roles'],
            order: [['created_at', 'DESC']],
        });

        res.json({
            success: true,
            data: users,
        });
    } catch (error) {
        logger.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
        });
    }
});

router.post('/', requireRole('Admin'), async (req, res) => {
    try {
        const user = await User.create(req.body);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user,
        });
    } catch (error) {
        logger.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
        });
    }
});

router.put('/:id/roles', requireRole('Admin'), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const roles = await Role.findAll({
            where: { id: req.body.role_ids },
        });

        await user.setRoles(roles);

        res.json({
            success: true,
            message: 'User roles updated successfully',
            data: await user.reload({ include: ['roles'] }),
        });
    } catch (error) {
        logger.error('Update user roles error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user roles',
        });
    }
});

export default router;
