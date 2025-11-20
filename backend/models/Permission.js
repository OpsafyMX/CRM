import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Permission = sequelize.define('Permission', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'e.g., contacts:create, deals:read, users:delete',
    },
    resource: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Resource name: contacts, deals, tasks, users, etc.',
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Action: create, read, update, delete, export, etc.',
    },
    description: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'permissions',
    indexes: [
        { fields: ['resource', 'action'] },
    ],
});

export default Permission;
