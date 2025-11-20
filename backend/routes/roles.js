import express from 'express';
import { Role, Permission } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import logger from '../config/logger.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requireRole('Admin'), async (req, res) => {
    try {
        const roles = await Role.findAll({
            include: ['permissions'],
        });

        res.json({
            success: true,
            data: roles,
        });
    } catch (error) {
        logger.error('Get roles error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching roles',
        });
    }
});

router.post('/', requireRole('Admin'), async (req, res) => {
    try {
        const role = await Role.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Role created successfully',
            data: role,
        });
    } catch (error) {
        logger.error('Create role error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating role',
        });
    }
});

router.put('/:id/permissions', requireRole('Admin'), async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found',
            });
        }

        const permissions = await Permission.findAll({
            where: { id: req.body.permission_ids },
        });

        await role.setPermissions(permissions);

        res.json({
            success: true,
            message: 'Role permissions updated successfully',
            data: await role.reload({ include: ['permissions'] }),
        });
    } catch (error) {
        logger.error('Update role permissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating role permissions',
        });
    }
});

export default router;
