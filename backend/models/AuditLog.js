import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'User who performed the action, null for system actions',
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'create, read, update, delete, login, logout, etc.',
    },
    resource_type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Model/table name',
    },
    resource_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    old_values: {
        type: DataTypes.JSONB,
    },
    new_values: {
        type: DataTypes.JSONB,
    },
    ip_address: {
        type: DataTypes.STRING,
    },
    user_agent: {
        type: DataTypes.TEXT,
    },
    endpoint: {
        type: DataTypes.STRING,
    },
    method: {
        type: DataTypes.STRING,
    },
    status_code: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'audit_logs',
    indexes: [
        { fields: ['user_id'] },
        { fields: ['resource_type', 'resource_id'] },
        { fields: ['action'] },
        { fields: ['created_at'] },
    ],
});

export default AuditLog;
