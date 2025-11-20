# CRM System Backend

Enterprise-grade backend API for the CRM System built with Node.js, Express, and PostgreSQL.

## Features

✅ **RESTful API** with versioning (v1)  
✅ **JWT Authentication** with refresh tokens  
✅ **Role-Based Access Control (RBAC)** with granular permissions  
✅ **Comprehensive Audit Logging** for all operations  
✅ **Workflow Automation** engine  
✅ **Email Integration** with templates  
✅ **Team Management** with hierarchies  
✅ **Swagger API Documentation**  
✅ **Security** (Helmet, CORS, Rate Limiting)  

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Logging**: Winston
- **Email**: Nodemailer
- **Documentation**: Swagger

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crm_system
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 3. Create PostgreSQL Database

```bash
# Using psql
psql -U postgres
CREATE DATABASE crm_system;
\q
```

Or using createdb:

```bash
createdb crm_system
```

### 4. Initialize Database

The database tables will be created automatically when you first run the server. Then seed with initial data:

```bash
npm run seed
```

This creates:
- Default roles: Admin, Sales Manager, Salesperson, Marketing, Support
- All permissions for resources
- Default admin user: `admin@crm.com` / `admin123`

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

Once the server is running, visit:

- **Health Check**: `http://localhost:3000/health`
- **API Health**: `http://localhost:3000/api/v1/health`
- **Swagger Docs**: `http://localhost:3000/api-docs` (Coming soon)

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout

### Users & Roles

- `GET /api/v1/users` - List users (Admin only)
- `POST /api/v1/users` - Create user (Admin only)
- `PUT /api/v1/users/:id/roles` - Assign roles (Admin only)
- `GET /api/v1/roles` - List roles (Admin only)
- `POST /api/v1/roles` - Create role (Admin only)
- `PUT /api/v1/roles/:id/permissions` - Update role permissions (Admin only)

### Contacts

- `GET /api/v1/contacts` - List contacts
- `POST /api/v1/contacts` - Create contact
- `GET /api/v1/contacts/:id` - Get contact
- `PUT /api/v1/contacts/:id` - Update contact
- `DELETE /api/v1/contacts/:id` - Delete contact

### Deals

- `GET /api/v1/deals` - List deals
- `POST /api/v1/deals` - Create deal
- `GET /api/v1/deals/:id` - Get deal
- `PUT /api/v1/deals/:id` - Update deal
- `DELETE /api/v1/deals/:id` - Delete deal

### Tasks

- `GET /api/v1/tasks` - List tasks
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks/:id` - Get task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

### Activities

- `GET /api/v1/activities` - List activities
- `POST /api/v1/activities` - Create activity

### Teams

- `GET /api/v1/teams` - List teams
- `POST /api/v1/teams` - Create team

### Workflows

- `GET /api/v1/workflows` - List workflows
- `POST /api/v1/workflows` - Create workflow
- `PATCH /api/v1/workflows/:id/activate` - Activate workflow
- `PATCH /api/v1/workflows/:id/deactivate` - Deactivate workflow

### Emails

- `GET /api/v1/emails/templates` - List email templates
- `POST /api/v1/emails/templates` - Create template
- `POST /api/v1/emails/send` - Send email
- `GET /api/v1/emails/logs` - View email logs

### Audit Logs

- `GET /api/v1/audit/logs` - List audit logs (Admin/Auditor only)
- `GET /api/v1/audit/logs/:id` - Get audit log details

## Default Roles & Permissions

### Admin
- Full access to all resources
- User and role management
- System configuration

### Sales Manager
- Full CRUD on contacts, deals, tasks
- View teams and reports
- Manage team members

### Salesperson
- Create/edit own contacts and deals
- Manage own tasks
- View assigned activities

### Marketing
- Manage contacts
- Send emails and manage templates
- View reports

### Support
- View contacts
- Create and manage tasks
- Log activities

## Security Features

- **JWT Authentication**: Secure token-based auth
- **RBAC**: Granular permission system
- **Password Hashing**: bcrypt with configurable rounds
- **Rate Limiting**: Prevent brute force attacks
- **Helmet**: Security headers
- **CORS**: Configurable cross-origin access
- **Input Validation**: express-validator on all endpoints
- **Audit Logging**: Track all system changes

## Database Schema

Key tables:
- `users` - User accounts
- `roles` - Role definitions
- `permissions` - Permission definitions
- `user_roles` - User-role assignments
- `role_permissions` - Role-permission assignments
- `contacts` - Contact management
- `deals` - Sales pipeline
- `tasks` - Task tracking
- `activities` - Activity timeline
- `teams` - Team organization
- `workflows` - Automation rules
- `email_templates` - Email templates
- `email_logs` - Email delivery tracking
- `audit_logs` - Comprehensive audit trail

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with initial data
- `npm test` - Run tests (Coming soon)

## Environment Variables

See `.env.example` for all available configuration options.

## Logging

Logs are written to:
- Console (development)
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only

## Project Structure

```
backend/
├── config/           # Configuration files
│   ├── database.js   # Sequelize setup
│   └── logger.js     # Winston logger
├── middleware/       # Express middleware
│   ├── auth.js       # JWT authentication
│   ├── rbac.js       # Permission checks
│   ├── audit.js      # Audit logging
│   └── errorHandler.js
├── models/           # Sequelize models
│   ├── User.js
│   ├── Role.js
│   ├── Permission.js
│   ├── Contact.js
│   ├── Deal.js
│   ├── Task.js
│   └── index.js      # Model associations
├── routes/           # API routes
│   ├── auth.js
│   ├── users.js
│   ├── contacts.js
│   ├── deals.js
│   ├── tasks.js
│   └── ...
├── scripts/          # Utility scripts
│   └── seed.js       # Database seeding
├── .env.example      # Environment template
├── package.json
└── server.js         # Main entry point
```

## Troubleshooting

### Database Connection Issues

If you can't connect to PostgreSQL:

1. Check PostgreSQL is running:
```bash
# Windows
pg_ctl status

# Linux/Mac
sudo service postgresql status
```

2. Verify credentials in `.env`
3. Ensure database exists: `createdb crm_system`

### Port Already in Use

If port 3000 is in use, change in `.env`:
```env
PORT=3001
```

## Development

### Adding New Permissions

Edit `scripts/seed.js` and run:
```bash
npm run seed
```

### Creating Custom Roles

Use the Admin panel or API:
```bash
POST /api/v1/roles
{
  "name": "Custom Role",
  "description": "Description"
}
```

## License

MIT

---

**Need Help?** Check the main project README or contact the development team.
