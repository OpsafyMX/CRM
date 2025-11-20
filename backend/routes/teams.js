import express from 'express';
import { Team } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import logger from '../config/logger.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requirePermission('teams:read'), async (req, res) => {
    try {
        const teams = await Team.findAll({
            include: [
                { association: 'manager', attributes: ['id', 'first_name', 'last_name'] },
                { association: 'members', attributes: ['id', 'first_name', 'last_name', 'email'] },
            ],
        });

        res.json({
            success: true,
            data: teams,
        });
    } catch (error) {
        logger.error('Get teams error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching teams',
        });
    }
});

router.post('/', requirePermission('teams:create'), async (req, res) => {
    try {
        const team = await Team.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Team created successfully',
            data: team,
        });
    } catch (error) {
        logger.error('Create team error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating team',
        });
    }
});

export default router;
