import sequelize from '../config/database.js';
import { Role, Permission, User } from '../models/index.js';
import logger from '../config/logger.js';

/**
 * Seed script to populate database with initial roles, permissions, and admin user
 */

const permissions = [
    // Contact permissions
    { name: 'contacts:create', resource: 'contacts', action: 'create', description: 'Create contacts' },
    { name: 'contacts:read', resource: 'contacts', action: 'read', description: 'View contacts' },
    { name: 'contacts:update', resource: 'contacts', action: 'update', description: 'Update contacts' },
    { name: 'contacts:delete', resource: 'contacts', action: 'delete', description: 'Delete contacts' },

    // Deal permissions
    { name: 'deals:create', resource: 'deals', action: 'create', description: 'Create deals' },
    { name: 'deals:read', resource: 'deals', action: 'read', description: 'View deals' },
    { name: 'deals:update', resource: 'deals', action: 'update', description: 'Update deals' },
    { name: 'deals:delete', resource: 'deals', action: 'delete', description: 'Delete deals' },

    // Task permissions
    { name: 'tasks:create', resource: 'tasks', action: 'create', description: 'Create tasks' },
    { name: 'tasks:read', resource: 'tasks', action: 'read', description: 'View tasks' },
    { name: 'tasks:update', resource: 'tasks', action: 'update', description: 'Update tasks' },
    { name: 'tasks:delete', resource: 'tasks', action: 'delete', description: 'Delete tasks' },

    // Activity permissions
    { name: 'activities:create', resource: 'activities', action: 'create', description: 'Create activities' },
    { name: 'activities:read', resource: 'activities', action: 'read', description: 'View activities' },

    // User permissions
    { name: 'users:create', resource: 'users', action: 'create', description: 'Create users' },
    { name: 'users:read', resource: 'users', action: 'read', description: 'View users' },
    { name: 'users:update', resource: 'users', action: 'update', description: 'Update users' },
    { name: 'users:delete', resource: 'users', action: 'delete', description: 'Delete users' },

    // Role permissions
    { name: 'roles:create', resource: 'roles', action: 'create', description: 'Create roles' },
    { name: 'roles:read', resource: 'roles', action: 'read', description: 'View roles' },
    { name: 'roles:update', resource: 'roles', action: 'update', description: 'Update roles' },
    { name: 'roles:delete', resource: 'roles', action: 'delete', description: 'Delete roles' },

    // Team permissions
    { name: 'teams:create', resource: 'teams', action: 'create', description: 'Create teams' },
    { name: 'teams:read', resource: 'teams', action: 'read', description: 'View teams' },
    { name: 'teams:update', resource: 'teams', action: 'update', description: 'Update teams' },
    { name: 'teams:delete', resource: 'teams', action: 'delete', description: 'Delete teams' },

    // Workflow permissions
    { name: 'workflows:create', resource: 'workflows', action: 'create', description: 'Create workflows' },
    { name: 'workflows:read', resource: 'workflows', action: 'read', description: 'View workflows' },
    { name: 'workflows:update', resource: 'workflows', action: 'update', description: 'Update workflows' },
    { name: 'workflows:delete', resource: 'workflows', action: 'delete', description: 'Delete workflows' },

    // Email permissions
    { name: 'emails:create', resource: 'emails', action: 'create', description: 'Create email templates' },
    { name: 'emails:read', resource: 'emails', action: 'read', description: 'View emails' },
    { name: 'emails:send', resource: 'emails', action: 'send', description: 'Send emails' },

    // Report permissions
    { name: 'reports:read', resource: 'reports', action: 'read', description: 'View reports' },
];

const roles = [
    {
        name: 'Admin',
        description: 'Full system access with all permissions',
        is_system: true,
        permissions: 'ALL', // Will get all permissions
    },
    {
        name: 'Sales Manager',
        description: 'Manage sales team, deals, and contacts',
        is_system: true,
        permissions: [
            'contacts:create', 'contacts:read', 'contacts:update', 'contacts:delete',
            'deals:create', 'deals:read', 'deals:update', 'deals:delete',
            'tasks:create', 'tasks:read', 'tasks:update', 'tasks:delete',
            'activities:create', 'activities:read',
            'teams:read',
            'reports:read',
        ],
    },
    {
        name: 'Salesperson',
        description: 'Manage own deals and contacts',
        is_system: true,
        permissions: [
            'contacts:create', 'contacts:read', 'contacts:update',
            'deals:create', 'deals:read', 'deals:update',
            'tasks:create', 'tasks:read', 'tasks:update',
            'activities:create', 'activities:read',
        ],
    },
    {
        name: 'Marketing',
        description: 'Manage marketing campaigns and contacts',
        is_system: true,
        permissions: [
            'contacts:create', 'contacts:read', 'contacts:update',
            'emails:create', 'emails:read', 'emails:send',
            'activities:create', 'activities:read',
            'reports:read',
        ],
    },
    {
        name: 'Support',
        description: 'View contacts and create tasks',
        is_system: true,
        permissions: [
            'contacts:read',
            'tasks:create', 'tasks:read', 'tasks:update',
            'activities:create', 'activities:read',
        ],
    },
];

const seedDatabase = async () => {
    try {
        logger.info('🌱 Starting database seeding...');

        // Create all permissions
        logger.info('Creating permissions...');
        const createdPermissions = await Promise.all(
            permissions.map(perm =>
                Permission.findOrCreate({
                    where: { name: perm.name },
                    defaults: perm,
                })
            )
        );
        logger.info(`✅ Created ${createdPermissions.length} permissions`);

        // Get all permissions for admin role
        const allPermissions = await Permission.findAll();

        // Create roles and assign permissions
        logger.info('Creating roles...');
        for (const roleData of roles) {
            const [role, created] = await Role.findOrCreate({
                where: { name: roleData.name },
                defaults: {
                    name: roleData.name,
                    description: roleData.description,
                    is_system: roleData.is_system,
                },
            });

            // Assign permissions
            if (roleData.permissions === 'ALL') {
                await role.setPermissions(allPermissions);
                logger.info(`✅ Assigned all permissions to ${roleData.name}`);
            } else {
                const rolePermissions = await Permission.findAll({
                    where: { name: roleData.permissions },
                });
                await role.setPermissions(rolePermissions);
                logger.info(`✅ Assigned ${rolePermissions.length} permissions to ${roleData.name}`);
            }
        }

        // Create default admin user
        logger.info('Creating default admin user...');
        const [adminUser, adminCreated] = await User.findOrCreate({
            where: { email: 'admin@crm.com' },
            defaults: {
                email: 'admin@crm.com',
                password: 'admin123', // Will be hashed by model hook
                first_name: 'Admin',
                last_name: 'User',
                is_active: true,
            },
        });

        if (adminCreated) {
            const adminRole = await Role.findOne({ where: { name: 'Admin' } });
            await adminUser.addRole(adminRole);
            logger.info('✅ Created admin user: admin@crm.com / admin123');
        } else {
            logger.info('Admin user already exists');
        }

        logger.info('🎉 Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        logger.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seed
seedDatabase();
