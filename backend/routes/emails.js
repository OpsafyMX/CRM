import express from 'express';
import { EmailTemplate, EmailLog } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import logger from '../config/logger.js';

const router = express.Router();

router.use(authenticate);

router.get('/templates', requirePermission('emails:read'), async (req, res) => {
    try {
        const templates = await EmailTemplate.findAll({
            where: { is_active: true },
        });

        res.json({
            success: true,
            data: templates,
        });
    } catch (error) {
        logger.error('Get email templates error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching email templates',
        });
    }
});

router.post('/templates', requirePermission('emails:create'), async (req, res) => {
    try {
        const templateData = {
            ...req.body,
            created_by: req.user.id,
        };

        const template = await EmailTemplate.create(templateData);

        res.status(201).json({
            success: true,
            message: 'Email template created successfully',
            data: template,
        });
    } catch (error) {
        logger.error('Create email template error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating email template',
        });
    }
});

router.post('/send', requirePermission('emails:send'), async (req, res) => {
    try {
        // TODO: Implement email sending with nodemailer
        // For now, just log the email

        const emailLogData = {
            ...req.body,
            sent_by: req.user.id,
            status: 'pending',
        };

        const emailLog = await EmailLog.create(emailLogData);

        logger.info(`Email queued for sending to: ${req.body.to_email}`);

        res.status(202).json({
            success: true,
            message: 'Email queued for sending',
            data: emailLog,
        });
    } catch (error) {
        logger.error('Send email error:', error);
        res.status(500).json({
            success: false,
            message: 'Error queuing email',
        });
    }
});

router.get('/logs', requirePermission('emails:read'), async (req, res) => {
    try {
        const logs = await EmailLog.findAll({
            limit: 100,
            order: [['created_at', 'DESC']],
        });

        res.json({
            success: true,
            data: logs,
        });
    } catch (error) {
        logger.error('Get email logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching email logs',
        });
    }
});

export default router;
