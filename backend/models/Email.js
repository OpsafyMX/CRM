import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EmailTemplate = sequelize.define('EmailTemplate', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    body_html: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    body_text: {
        type: DataTypes.TEXT,
    },
    variables: {
        type: DataTypes.JSONB,
        defaultValue: [],
        comment: 'Available template variables',
    },
    category: {
        type: DataTypes.STRING,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    created_by: {
        type: DataTypes.UUID,
        allowNull: false,
    },
}, {
    tableName: 'email_templates',
});

const EmailLog = sequelize.define('EmailLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    template_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    from_email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    to_email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cc: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    bcc: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    body_html: {
        type: DataTypes.TEXT,
    },
    body_text: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
        comment: 'pending, sent, failed, bounced',
    },
    sent_at: {
        type: DataTypes.DATE,
    },
    error_message: {
        type: DataTypes.TEXT,
    },
    sent_by: {
        type: DataTypes.UUID,
    },
    related_to_type: {
        type: DataTypes.STRING,
    },
    related_to_id: {
        type: DataTypes.UUID,
    },
}, {
    tableName: 'email_logs',
    indexes: [
        { fields: ['status'] },
        { fields: ['to_email'] },
        { fields: ['sent_by'] },
        { fields: ['related_to_type', 'related_to_id'] },
    ],
});

export { EmailTemplate, EmailLog };
