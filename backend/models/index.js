import sequelize from '../config/database.js';
import User from './User.js';
import Role from './Role.js';
import Permission from './Permission.js';
import Contact from './Contact.js';
import Deal from './Deal.js';
import Task from './Task.js';
import Activity from './Activity.js';
import AuditLog from './AuditLog.js';
import Team from './Team.js';
import Workflow from './Workflow.js';
import { EmailTemplate, EmailLog } from './Email.js';

// Many-to-Many: Users <-> Roles
const UserRole = sequelize.define('UserRole', {}, {
    tableName: 'user_roles',
    timestamps: false,
});

User.belongsToMany(Role, { through: UserRole, as: 'roles' });
Role.belongsToMany(User, { through: UserRole, as: 'users' });

// Many-to-Many: Roles <-> Permissions
const RolePermission = sequelize.define('RolePermission', {}, {
    tableName: 'role_permissions',
    timestamps: false,
});

Role.belongsToMany(Permission, { through: RolePermission, as: 'permissions' });
Permission.belongsToMany(Role, { through: RolePermission, as: 'roles' });

// Many-to-Many: Users <-> Teams
const TeamMember = sequelize.define('TeamMember', {
    role: {
        type: sequelize.Sequelize.STRING,
        defaultValue: 'member',
        comment: 'member, lead, manager',
    },
}, {
    tableName: 'team_members',
});

User.belongsToMany(Team, { through: TeamMember, as: 'teams' });
Team.belongsToMany(User, { through: TeamMember, as: 'members' });

// User hierarchical relationships
User.belongsTo(User, { as: 'manager', foreignKey: 'manager_id' });
User.hasMany(User, { as: 'subordinates', foreignKey: 'manager_id' });

// Contact relationships
Contact.belongsTo(User, { as: 'owner', foreignKey: 'owner_id' });
User.hasMany(Contact, { as: 'contacts', foreignKey: 'owner_id' });

// Deal relationships
Deal.belongsTo(Contact, { as: 'contact', foreignKey: 'contact_id' });
Contact.hasMany(Deal, { as: 'deals', foreignKey: 'contact_id' });

Deal.belongsTo(User, { as: 'owner', foreignKey: 'owner_id' });
User.hasMany(Deal, { as: 'deals', foreignKey: 'owner_id' });

// Task relationships
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assigned_to' });
Task.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
User.hasMany(Task, { as: 'assignedTasks', foreignKey: 'assigned_to' });
User.hasMany(Task, { as: 'createdTasks', foreignKey: 'created_by' });

// Activity relationships
Activity.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
User.hasMany(Activity, { as: 'activities', foreignKey: 'user_id' });

// Audit log relationships
AuditLog.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
User.hasMany(AuditLog, { as: 'auditLogs', foreignKey: 'user_id' });

// Team relationships
Team.belongsTo(User, { as: 'manager', foreignKey: 'manager_id' });
Team.belongsTo(Team, { as: 'parentTeam', foreignKey: 'parent_team_id' });
Team.hasMany(Team, { as: 'subTeams', foreignKey: 'parent_team_id' });

// Workflow relationships
Workflow.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });

// Email relationships
EmailTemplate.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
EmailLog.belongsTo(EmailTemplate, { as: 'template', foreignKey: 'template_id' });
EmailLog.belongsTo(User, { as: 'sender', foreignKey: 'sent_by' });

// Initialize all models
const initializeModels = async () => {
    await sequelize.sync({ alter: false }); // Use migrations instead of sync in production
};

export {
    sequelize,
    User,
    Role,
    Permission,
    UserRole,
    RolePermission,
    Contact,
    Deal,
    Task,
    Activity,
    AuditLog,
    Team,
    TeamMember,
    Workflow,
    EmailTemplate,
    EmailLog,
    initializeModels,
};
