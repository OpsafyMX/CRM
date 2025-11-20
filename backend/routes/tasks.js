import express from 'express';
import { Task, Activity } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import logger from '../config/logger.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requirePermission('tasks:read'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const where = {};
        const userRoles = req.user.roles?.map(r => r.name) || [];

        // Non-admins see only tasks assigned to them
        if (!userRoles.includes('Admin')) {
            where.assigned_to = req.user.id;
        }

        if (req.query.status) {
            where.status = req.query.status;
        }

        if (req.query.priority) {
            where.priority = req.query.priority;
        }

        const { rows: tasks, count } = await Task.findAndCountAll({
            where,
            include: [
                { association: 'assignee', attributes: ['id', 'first_name', 'last_name'] },
                { association: 'creator', attributes: ['id', 'first_name', 'last_name'] },
            ],
            limit,
            offset,
            order: [['due_date', 'ASC']],
        });

        res.json({
            success: true,
            data: {
                tasks,
                pagination: {
                    page,
                    limit,
                    total: count,
                    pages: Math.ceil(count / limit),
                },
            },
        });
    } catch (error) {
        logger.error('Get tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tasks',
        });
    }
});

router.post('/', requirePermission('tasks:create'), async (req, res) => {
    try {
        const taskData = {
            ...req.body,
            created_by: req.user.id,
            assigned_to: req.body.assigned_to || req.user.id,
        };

        const task = await Task.create(taskData);

        await Activity.create({
            type: 'task_created',
            title: `Created task: ${task.title}`,
            user_id: req.user.id,
            related_to_type: 'task',
            related_to_id: task.id,
        });

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task,
        });
    } catch (error) {
        logger.error('Create task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating task',
        });
    }
});

router.get('/:id', requirePermission('tasks:read'), async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id, {
            include: [
                { association: 'assignee' },
                { association: 'creator' },
            ],
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        const userRoles = req.user.roles?.map(r => r.name) || [];
        if (!userRoles.includes('Admin') && task.assigned_to !== req.user.id && task.created_by !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this task',
            });
        }

        res.json({
            success: true,
            data: task,
        });
    } catch (error) {
        logger.error('Get task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching task',
        });
    }
});

router.put('/:id', requirePermission('tasks:update'), async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        const userRoles = req.user.roles?.map(r => r.name) || [];
        if (!userRoles.includes('Admin') && task.assigned_to !== req.user.id && task.created_by !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this task',
            });
        }

        await task.update(req.body);

        if (req.body.status === 'completed') {
            await task.update({ completed_at: new Date() });
        }

        await Activity.create({
            type: 'task_updated',
            title: `Updated task: ${task.title}`,
            user_id: req.user.id,
            related_to_type: 'task',
            related_to_id: task.id,
        });

        res.json({
            success: true,
            message: 'Task updated successfully',
            data: task,
        });
    } catch (error) {
        logger.error('Update task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating task',
        });
    }
});

router.delete('/:id', requirePermission('tasks:delete'), async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        const userRoles = req.user.roles?.map(r => r.name) || [];
        if (!userRoles.includes('Admin') && task.created_by !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this task',
            });
        }

        const taskTitle = task.title;
        await task.destroy();

        await Activity.create({
            type: 'task_deleted',
            title: `Deleted task: ${taskTitle}`,
            user_id: req.user.id,
        });

        res.json({
            success: true,
            message: 'Task deleted successfully',
        });
    } catch (error) {
        logger.error('Delete task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting task',
        });
    }
});

export default router;
