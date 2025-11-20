import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    due_date: {
        type: DataTypes.DATE,
    },
    priority: {
        type: DataTypes.STRING,
        defaultValue: 'medium',
        comment: 'low, medium, high',
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
        comment: 'pending, in-progress, completed, cancelled',
    },
    assigned_to: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    completed_at: {
        type: DataTypes.DATE,
    },
    related_to_type: {
        type: DataTypes.STRING,
        comment: 'contact, deal, etc.',
    },
    related_to_id: {
        type: DataTypes.UUID,
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    custom_fields: {
        type: DataTypes.JSONB,
        defaultValue: {},
    },
}, {
    tableName: 'tasks',
    indexes: [
        { fields: ['assigned_to'] },
        { fields: ['status'] },
        { fields: ['priority'] },
        { fields: ['due_date'] },
        { fields: ['related_to_type', 'related_to_id'] },
    ],
});

export default Task;
