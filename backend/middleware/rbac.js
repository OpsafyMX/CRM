import logger from '../config/logger.js';

/**
 * Check if user has specific permission
 */
export const requirePermission = (...permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.',
            });
        }

        // Check if user has at least one of the required permissions
        const hasPermission = permissions.some(permission =>
            req.userPermissions.has(permission)
        );

        if (!hasPermission) {
            logger.warn(`User ${req.user.email} attempted to access resource without permission: ${permissions.join(', ')}`);
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action.',
                required_permissions: permissions,
            });
        }

        next();
    };
};

/**
 * Check if user has specific role
 */
export const requireRole = (...roleNames) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.',
            });
        }

        // Check if user has at least one of the required roles
        const userRoles = req.user.roles?.map(role => role.name) || [];
        const hasRole = roleNames.some(roleName => userRoles.includes(roleName));

        if (!hasRole) {
            logger.warn(`User ${req.user.email} attempted to access resource without role: ${roleNames.join(', ')}`);
            return res.status(403).json({
                success: false,
                message: 'You do not have the required role to perform this action.',
                required_roles: roleNames,
            });
        }

        next();
    };
};

/**
 * Check if user owns the resource or has admin role
 * Usage: requireOwnership('owner_id') or requireOwnership('assigned_to')
 */
export const requireOwnership = (ownerField = 'owner_id') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.',
            });
        }

        // Admin can access all resources
        const userRoles = req.user.roles?.map(role => role.name) || [];
        if (userRoles.includes('Admin')) {
            return next();
        }

        // Check if resource exists in request
        const resource = req.resource; // Resource should be attached by controller
        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found.',
            });
        }

        // Check ownership
        if (resource[ownerField] !== req.user.id) {
            logger.warn(`User ${req.user.email} attempted to access resource owned by another user`);
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to access this resource.',
            });
        }

        next();
    };
};

/**
 * Check if user can access resource based on team membership
 */
export const requireTeamAccess = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.',
        });
    }

    // Admin can access all
    const userRoles = req.user.roles?.map(role => role.name) || [];
    if (userRoles.includes('Admin')) {
        return next();
    }

    const resource = req.resource;
    if (!resource) {
        return res.status(404).json({
            success: false,
            message: 'Resource not found.',
        });
    }

    // Check if user belongs to the same team as resource owner
    // This is a simplified check - expand based on your team hierarchy needs
    const userTeams = await req.user.getTeams();
    const resourceOwner = await resource.getOwner({ include: ['teams'] });

    const sharedTeams = userTeams.filter(userTeam =>
        resourceOwner.teams?.some(ownerTeam => ownerTeam.id === userTeam.id)
    );

    if (sharedTeams.length === 0 && resource.owner_id !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: 'You do not have permission to access this resource.',
        });
    }

    next();
};

/**
 * Check if user is manager (can access subordinate data)
 */
export const requireManagerAccess = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.',
        });
    }

    const userRoles = req.user.roles?.map(role => role.name) || [];
    if (userRoles.includes('Admin')) {
        return next();
    }

    const resource = req.resource;
    if (!resource) {
        return res.status(404).json({
            success: false,
            message: 'Resource not found.',
        });
    }

    // Check if user is the manager of resource owner
    const resourceOwner = await resource.getOwner();
    if (resourceOwner.manager_id === req.user.id || resource.owner_id === req.user.id) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource.',
    });
};
