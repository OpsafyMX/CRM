import express from 'express';
import { Workflow } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import logger from '../config/logger.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requirePermission('workflows:read'), async (req, res) => {
    try {
        const workflows = await Workflow.findAll({
            include: [{ association: 'creator', attributes: ['id', 'first_name', 'last_name'] }],
            order: [['created_at', 'DESC']],
        });

        res.json({
            success: true,
            data: workflows,
        });
    } catch (error) {
        logger.error('Get workflows error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching workflows',
        });
    }
});

router.post('/', requirePermission('workflows:create'), async (req, res) => {
    try {
        const workflowData = {
            ...req.body,
            created_by: req.user.id,
        };

        const workflow = await Workflow.create(workflowData);

        res.status(201).json({
            success: true,
            message: 'Workflow created successfully',
            data: workflow,
        });
    } catch (error) {
        logger.error('Create workflow error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating workflow',
        });
    }
});

router.patch('/:id/activate', requirePermission('workflows:update'), async (req, res) => {
    try {
        const workflow = await Workflow.findByPk(req.params.id);

        if (!workflow) {
            return res.status(404).json({
                success: false,
                message: 'Workflow not found',
            });
        }

        await workflow.update({ is_active: true });

        res.json({
            success: true,
            message: 'Workflow activated successfully',
            data: workflow,
        });
    } catch (error) {
        logger.error('Activate workflow error:', error);
        res.status(500).json({
            success: false,
            message: 'Error activating workflow',
        });
    }
});

router.patch('/:id/deactivate', requirePermission('workflows:update'), async (req, res) => {
    try {
        const workflow = await Workflow.findByPk(req.params.id);

        if (!workflow) {
            return res.status(404).json({
                success: false,
                message: 'Workflow not found',
            });
        }

        await workflow.update({ is_active: false });

        res.json({
            success: true,
            message: 'Workflow deactivated successfully',
            data: workflow,
        });
    } catch (error) {
        logger.error('Deactivate workflow error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deactivating workflow',
        });
    }
});

export default router;
