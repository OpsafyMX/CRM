import express from 'express';
import { AuditLog } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import logger from '../config/logger.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('Admin', 'Auditor'));

router.get('/logs', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;

        const where = {};

        if (req.query.user_id) {
            where.user_id = req.query.user_id;
        }

        if (req.query.action) {
            where.action = req.query.action;
        }

        if (req.query.resource_type) {
            where.resource_type = req.query.resource_type;
        }

        const { rows: logs, count } = await AuditLog.findAndCountAll({
            where,
            include: [
                { association: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] },
            ],
            limit,
            offset,
            order: [['created_at', 'DESC']],
        });

        res.json({
            success: true,
            data: {
                logs,
                pagination: {
                    page,
                    limit,
                    total: count,
                    pages: Math.ceil(count / limit),
                },
            },
        });
    } catch (error) {
        logger.error('Get audit logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching audit logs',
        });
    }
});

router.get('/logs/:id', async (req, res) => {
    try {
        const log = await AuditLog.findByPk(req.params.id, {
            include: [{ association: 'user' }],
        });

        if (!log) {
            return res.status(404).json({
                success: false,
                message: 'Audit log not found',
            });
        }

        res.json({
            success: true,
            data: log,
        });
    } catch (error) {
        logger.error('Get audit log error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching audit log',
        });
    }
});

export default router;
