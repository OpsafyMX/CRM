import express from 'express';
import { body, query } from 'express-validator';
import { Contact, Activity } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { validate } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';
import logger from '../config/logger.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/contacts
 * @desc    Get all contacts (filtered by permissions)
 * @access  Private (contacts:read)
 */
router.get(
    '/',
    requirePermission('contacts:read'),
    [
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
        query('search').optional().isString(),
        query('status').optional().isString(),
    ],
    validate,
    async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const { search, status } = req.query;

            // Build where clause
            const where = {};

            // Filter by ownership (non-admins see only their contacts)
            const userRoles = req.user.roles?.map(r => r.name) || [];
            if (!userRoles.includes('Admin')) {
                where.owner_id = req.user.id;
            }

            // Search filter
            if (search) {
                where[Op.or] = [
                    { first_name: { [Op.iLike]: `%${search}%` } },
                    { last_name: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } },
                    { company: { [Op.iLike]: `%${search}%` } },
                ];
            }

            if (status) {
                where.status = status;
            }

            const { rows: contacts, count } = await Contact.findAndCountAll({
                where,
                include: [{ association: 'owner', attributes: ['id', 'first_name', 'last_name', 'email'] }],
                limit,
                offset,
                order: [['created_at', 'DESC']],
            });

            res.json({
                success: true,
                data: {
                    contacts,
                    pagination: {
                        page,
                        limit,
                        total: count,
                        pages: Math.ceil(count / limit),
                    },
                },
            });
        } catch (error) {
            logger.error('Get contacts error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching contacts',
            });
        }
    }
);

/**
 * @route   POST /api/v1/contacts
 * @desc    Create new contact
 * @access  Private (contacts:create)
 */
router.post(
    '/',
    requirePermission('contacts:create'),
    [
        body('first_name').notEmpty().withMessage('First name is required'),
        body('last_name').notEmpty().withMessage('Last name is required'),
        body('email').optional().isEmail().withMessage('Valid email is required'),
    ],
    validate,
    async (req, res) => {
        try {
            const contactData = {
                ...req.body,
                owner_id: req.user.id, // Set current user as owner
            };

            const contact = await Contact.create(contactData);

            // Log activity
            await Activity.create({
                type: 'contact_created',
                title: `Created contact: ${contact.first_name} ${contact.last_name}`,
                user_id: req.user.id,
                related_to_type: 'contact',
                related_to_id: contact.id,
            });

            res.status(201).json({
                success: true,
                message: 'Contact created successfully',
                data: contact,
            });
        } catch (error) {
            logger.error('Create contact error:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating contact',
            });
        }
    }
);

/**
 * @route   GET /api/v1/contacts/:id
 * @desc    Get contact by ID
 * @access  Private (contacts:read)
 */
router.get('/:id', requirePermission('contacts:read'), async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id, {
            include: [
                { association: 'owner', attributes: ['id', 'first_name', 'last_name', 'email'] },
                { association: 'deals' },
            ],
        });

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            });
        }

        // Check ownership (non-admins can only view their own contacts)
        const userRoles = req.user.roles?.map(r => r.name) || [];
        if (!userRoles.includes('Admin') && contact.owner_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this contact',
            });
        }

        res.json({
            success: true,
            data: contact,
        });
    } catch (error) {
        logger.error('Get contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact',
        });
    }
});

/**
 * @route   PUT /api/v1/contacts/:id
 * @desc    Update contact
 * @access  Private (contacts:update)
 */
router.put('/:id', requirePermission('contacts:update'), async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            });
        }

        // Check ownership
        const userRoles = req.user.roles?.map(r => r.name) || [];
        if (!userRoles.includes('Admin') && contact.owner_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this contact',
            });
        }

        // Don't allow changing owner
        delete req.body.owner_id;

        await contact.update(req.body);

        // Log activity
        await Activity.create({
            type: 'contact_updated',
            title: `Updated contact: ${contact.first_name} ${contact.last_name}`,
            user_id: req.user.id,
            related_to_type: 'contact',
            related_to_id: contact.id,
        });

        res.json({
            success: true,
            message: 'Contact updated successfully',
            data: contact,
        });
    } catch (error) {
        logger.error('Update contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating contact',
        });
    }
});

/**
 * @route   DELETE /api/v1/contacts/:id
 * @desc    Delete contact
 * @access  Private (contacts:delete)
 */
router.delete('/:id', requirePermission('contacts:delete'), async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            });
        }

        // Check ownership
        const userRoles = req.user.roles?.map(r => r.name) || [];
        if (!userRoles.includes('Admin') && contact.owner_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this contact',
            });
        }

        const contactName = `${contact.first_name} ${contact.last_name}`;
        await contact.destroy();

        // Log activity
        await Activity.create({
            type: 'contact_deleted',
            title: `Deleted contact: ${contactName}`,
            user_id: req.user.id,
        });

        res.json({
            success: true,
            message: 'Contact deleted successfully',
        });
    } catch (error) {
        logger.error('Delete contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting contact',
        });
    }
});

export default router;
