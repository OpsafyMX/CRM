import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Workflow = sequelize.define('Workflow', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    trigger_type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'record_created, record_updated, record_deleted, time_based, manual',
    },
    trigger_resource: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Model name: contact, deal, task, etc.',
    },
    conditions: {
        type: DataTypes.JSONB,
        defaultValue: [],
        comment: 'Array of condition objects',
    },
    actions: {
        type: DataTypes.JSONB,
        defaultValue: [],
        comment: 'Array of action objects',
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    created_by: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    execution_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    last_executed_at: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'workflows',
    indexes: [
        { fields: ['trigger_type', 'trigger_resource'] },
        { fields: ['is_active'] },
    ],
});

export default Workflow;
