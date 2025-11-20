import express from 'express';
import { body } from 'express-validator';
import { Deal, Contact, Activity } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { validate } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';
import logger from '../config/logger.js';

const router = express.Router();

router.use(authenticate);

/**
 * @route   GET /api/v1/deals
 * @desc    Get all deals
 * @access  Private (deals:read)
 */
router.get('/', requirePermission('deals:read'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const { stage, priority } = req.query;

        const where = {};

        // Filter by ownership
        const userRoles = req.user.roles?.map(r => r.name) || [];
        if (!userRoles.includes('Admin')) {
            where.owner_id = req.user.id;
        }

        if (stage) {
            where.stage = stage;
        }

        if (priority) {
            where.priority = priority;
        }

        const { rows: deals, count } = await Deal.findAndCountAll({
            where,
            include: [
                { association: 'owner', attributes: ['id', 'first_name', 'last_name', 'email'] },
                { association: 'contact', attributes: ['id', 'first_name', 'last_name', 'company'] },
            ],
            limit,
            offset,
            order: [['created_at', 'DESC']],
        });

        res.json({
            success: true,
            data: {
                deals,
                pagination: {
                    page,
                    limit,
                    total: count,
                    pages: Math.ceil(count / limit),
                },
            },
        });
    } catch (error) {
        logger.error('Get deals error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching deals',
        });
    }
});

/**
 * @route   POST /api/v1/deals
 * @desc    Create new deal
 * @access  Private (deals:create)
 */
router.post(
    '/',
    requirePermission('deals:create'),
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('value').optional().isFloat({ min: 0 }).withMessage('Value must be a positive number'),
    ],
    validate,
    async (req, res) => {
        try {
            const dealData = {
                ...req.body,
                owner_id: req.user.id,
            };

            const deal = await Deal.create(dealData);

            await Activity.create({
                type: 'deal_created',
                title: `Created deal: ${deal.title}`,
                user_id: req.user.id,
                related_to_type: 'deal',
                related_to_id: deal.id,
            });

            res.status(201).json({
                success: true,
                message: 'Deal created successfully',
                data: deal,
            });
        } catch (error) {
            logger.error('Create deal error:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating deal',
            });
        }
    }
);

/**
 * @route   GET /api/v1/deals/:id
 * @desc    Get deal by ID
 * @access  Private (deals:read)
 */
router.get('/:id', requirePermission('deals:read'), async (req, res) => {
    try {
        const deal = await Deal.findByPk(req.params.id, {
            include: [
                { association: 'owner', attributes: ['id', 'first_name', 'last_name', 'email'] },
                { association: 'contact' },
            ],
        });

        if (!deal) {
            return res.status(404).json({
                success: false,
                message: 'Deal not found',
            });
        }

        const userRoles = req.user.roles?.map(r => r.name) || [];
        if (!userRoles.includes('Admin') && deal.owner_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this deal',
            });
        }

        res.json({
            success: true,
            data: deal,
        });
    } catch (error) {
        logger.error('Get deal error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching deal',
        });
    }
});

/**
 * @route   PUT /api/v1/deals/:id
 * @desc    Update deal
 * @access  Private (deals:update)
 */
router.put('/:id', requirePermission('deals:update'), async (req, res) => {
    try {
        const deal = await Deal.findByPk(req.params.id);

        if (!deal) {
            return res.status(404).json({
                success: false,
                message: 'Deal not found',
            });
        }

        const userRoles = req.user.roles?.map(r => r.name) || [];
        if (!userRoles.includes('Admin') && deal.owner_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this deal',
            });
        }

        const oldStage = deal.stage;
        delete req.body.owner_id;

        await deal.update(req.body);

        // Log stage change
        if (req.body.stage && oldStage !== req.body.stage) {
            await Activity.create({
                type: 'deal_stage_changed',
                title: `Deal "${deal.title}" moved from ${oldStage} to ${deal.stage}`,
                user_id: req.user.id,
                related_to_type: 'deal',
                related_to_id: deal.id,
            });
        } else {
            await Activity.create({
                type: 'deal_updated',
                title: `Updated deal: ${deal.title}`,
                user_id: req.user.id,
                related_to_type: 'deal',
                related_to_id: deal.id,
            });
        }

        res.json({
            success: true,
            message: 'Deal updated successfully',
            data: deal,
        });
    } catch (error) {
        logger.error('Update deal error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating deal',
        });
    }
});

/**
 * @route   DELETE /api/v1/deals/:id
 * @desc    Delete deal
 * @access  Private (deals:delete)
 */
router.delete('/:id', requirePermission('deals:delete'), async (req, res) => {
    try {
        const deal = await Deal.findByPk(req.params.id);

        if (!deal) {
            return res.status(404).json({
                success: false,
                message: 'Deal not found',
            });
        }

        const userRoles = req.user.roles?.map(r => r.name) || [];
        if (!userRoles.includes('Admin') && deal.owner_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this deal',
            });
        }

        const dealTitle = deal.title;
        await deal.destroy();

        await Activity.create({
            type: 'deal_deleted',
            title: `Deleted deal: ${dealTitle}`,
            user_id: req.user.id,
        });

        res.json({
            success: true,
            message: 'Deal deleted successfully',
        });
    } catch (error) {
        logger.error('Delete deal error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting deal',
        });
    }
});

export default router;
