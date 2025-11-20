import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'crm_system',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: process.env.DB_DIALECT || 'postgres',
        logging: (msg) => logger.debug(msg),
        pool: {
            max: parseInt(process.env.DB_POOL_MAX) || 10,
            min: parseInt(process.env.DB_POOL_MIN) || 0,
            acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
            idle: parseInt(process.env.DB_POOL_IDLE) || 10000,
        },
        define: {
            timestamps: true,
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
);

// Test database connection
export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        logger.info('✅ Database connection established successfully');
        return true;
    } catch (error) {
        logger.error('❌ Unable to connect to database:', error);
        return false;
    }
};

export default sequelize;
