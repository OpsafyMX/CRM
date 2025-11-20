import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import logger from './config/logger.js';
import { testConnection } from './config/database.js';
import { initializeModels } from './models/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { auditLog } from './middleware/audit.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import roleRoutes from './routes/roles.js';
import contactRoutes from './routes/contacts.js';
import dealRoutes from './routes/deals.js';
import taskRoutes from './routes/tasks.js';
import activityRoutes from './routes/activities.js';
import teamRoutes from './routes/teams.js';
import workflowRoutes from './routes/workflows.js';
import emailRoutes from './routes/emails.js';
import auditRoutes from './routes/audit.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
    }));
}

// Audit logging for all requests
app.use(auditLog());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

app.get(`/api/${API_VERSION}/health`, (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        version: API_VERSION,
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/roles`, roleRoutes);
app.use(`/api/${API_VERSION}/contacts`, contactRoutes);
app.use(`/api/${API_VERSION}/deals`, dealRoutes);
app.use(`/api/${API_VERSION}/tasks`, taskRoutes);
app.use(`/api/${API_VERSION}/activities`, activityRoutes);
app.use(`/api/${API_VERSION}/teams`, teamRoutes);
app.use(`/api/${API_VERSION}/workflows`, workflowRoutes);
app.use(`/api/${API_VERSION}/emails`, emailRoutes);
app.use(`/api/${API_VERSION}/audit`, auditRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
    try {
        logger.info('Starting CRM Backend Server...');

        // Test database connection
        const dbConnected = await testConnection();
        if (!dbConnected) {
            logger.error('Failed to connect to database. Exiting...');
            process.exit(1);
        }

        // Initialize models (associations)
        await initializeModels();
        logger.info('✅ Database models initialized');

        // Start server
        app.listen(PORT, () => {
            logger.info(`✅ Server is running on port ${PORT}`);
            logger.info(`📡 API available at http://localhost:${PORT}/api/${API_VERSION}`);
            logger.info(`🏥 Health check at http://localhost:${PORT}/health`);
            logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

// Start the server
startServer();

export default app;
