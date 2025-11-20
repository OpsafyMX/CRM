import { AuditLog } from '../models/index.js';
import logger from '../config/logger.js';

/**
 * Middleware to log all API requests to audit log
 */
export const auditLog = (action = null) => {
    return async (req, res, next) => {
        // Store original methods
        const originalJson = res.json;
        const originalSend = res.send;

        // Capture response data
        let responseBody = null;
        let statusCode = null;

        res.json = function (body) {
            responseBody = body;
            statusCode = res.statusCode;
            return originalJson.call(this, body);
        };

        res.send = function (body) {
            responseBody = body;
            statusCode = res.statusCode;
            return originalSend.call(this, body);
        };

        // Wait for response to complete
        res.on('finish', async () => {
            try {
                // Only log successful mutations (POST, PUT, PATCH, DELETE)
                const shouldLog = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);

                if (!shouldLog) return;

                // Determine resource type from route
                const pathParts = req.path.split('/').filter(Boolean);
                const resourceType = pathParts[pathParts.length - 2] || pathParts[pathParts.length - 1];

                // Get resource ID from params or response
                const resourceId = req.params.id || responseBody?.data?.id || null;

                // Determine action
                let auditAction = action;
                if (!auditAction) {
                    const methodActionMap = {
                        POST: 'create',
                        PUT: 'update',
                        PATCH: 'update',
                        DELETE: 'delete',
                    };
                    auditAction = methodActionMap[req.method] || 'action';
                }

                // Create audit log entry
                await AuditLog.create({
                    user_id: req.user?.id || null,
                    action: auditAction,
                    resource_type: resourceType,
                    resource_id: resourceId,
                    old_values: req.oldValues || null, // Set by controller if needed
                    new_values: responseBody?.data || null,
                    ip_address: req.ip || req.connection.remoteAddress,
                    user_agent: req.get('user-agent'),
                    endpoint: req.originalUrl,
                    method: req.method,
                    status_code: statusCode,
                });
            } catch (error) {
                logger.error('Audit logging error:', error);
                // Don't fail the request if audit logging fails
            }
        });

        next();
    };
};

/**
 * Attach old values to request for update operations
 */
export const captureOldValues = (resource) => {
    return (req, res, next) => {
        if (resource && (req.method === 'PUT' || req.method === 'PATCH')) {
            req.oldValues = resource.toJSON();
        }
        next();
    };
};
