import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Deal = sequelize.define('Deal', {
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
    value: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'USD',
    },
    stage: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'lead',
        comment: 'lead, qualified, proposal, negotiation, closed-won, closed-lost',
    },
    probability: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100,
        },
    },
    expected_close_date: {
        type: DataTypes.DATE,
    },
    actual_close_date: {
        type: DataTypes.DATE,
    },
    contact_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    priority: {
        type: DataTypes.STRING,
        defaultValue: 'medium',
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    custom_fields: {
        type: DataTypes.JSONB,
        defaultValue: {},
    },
    lost_reason: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'deals',
    indexes: [
        { fields: ['stage'] },
        { fields: ['owner_id'] },
        { fields: ['contact_id'] },
        { fields: ['expected_close_date'] },
    ],
});

export default Deal;
