import express from 'express';
import { Activity } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import logger from '../config/logger.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requirePermission('activities:read'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;

        const where = {};

        if (req.query.type) {
            where.type = req.query.type;
        }

        if (req.query.user_id) {
            where.user_id = req.query.user_id;
        }

        const { rows: activities, count } = await Activity.findAndCountAll({
            where,
            include: [
                { association: 'user', attributes: ['id', 'first_name', 'last_name', 'avatar'] },
            ],
            limit,
            offset,
            order: [['created_at', 'DESC']],
        });

        res.json({
            success: true,
            data: {
                activities,
                pagination: {
                    page,
                    limit,
                    total: count,
                    pages: Math.ceil(count / limit),
                },
            },
        });
    } catch (error) {
        logger.error('Get activities error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching activities',
        });
    }
});

router.post('/', requirePermission('activities:create'), async (req, res) => {
    try {
        const activityData = {
            ...req.body,
            user_id: req.user.id,
        };

        const activity = await Activity.create(activityData);

        res.status(201).json({
            success: true,
            message: 'Activity logged successfully',
            data: activity,
        });
    } catch (error) {
        logger.error('Create activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating activity',
        });
    }
});

export default router;
