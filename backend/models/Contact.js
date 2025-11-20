import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Contact = sequelize.define('Contact', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true,
        },
    },
    phone: {
        type: DataTypes.STRING,
    },
    company: {
        type: DataTypes.STRING,
    },
    position: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.TEXT,
    },
    city: {
        type: DataTypes.STRING,
    },
    state: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING,
    },
    postal_code: {
        type: DataTypes.STRING,
    },
    website: {
        type: DataTypes.STRING,
    },
    linkedin: {
        type: DataTypes.STRING,
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    notes: {
        type: DataTypes.TEXT,
    },
    custom_fields: {
        type: DataTypes.JSONB,
        defaultValue: {},
    },
    owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'User who owns this contact',
    },
    lead_source: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active',
    },
}, {
    tableName: 'contacts',
    indexes: [
        { fields: ['email'] },
        { fields: ['company'] },
        { fields: ['owner_id'] },
        { fields: ['status'] },
    ],
});

export default Contact;
