import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Activity = sequelize.define('Activity', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'email, call, meeting, note, task_completed, deal_created, etc.',
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'User who performed the activity',
    },
    related_to_type: {
        type: DataTypes.STRING,
        comment: 'contact, deal, task, etc.',
    },
    related_to_id: {
        type: DataTypes.UUID,
    },
    metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
        comment: 'Additional data specific to activity type',
    },
}, {
    tableName: 'activities',
    indexes: [
        { fields: ['user_id'] },
        { fields: ['type'] },
        { fields: ['related_to_type', 'related_to_id'] },
        { fields: ['created_at'] },
    ],
});

export default Activity;
