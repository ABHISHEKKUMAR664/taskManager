# Task Manager

A modern task management application built with Next.js 15, React 19, and TypeScript. Features project organization, task status management, user authentication, and a responsive Material-UI interface.

## Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone and install**
   ```bash
   git clone https://github.com/ABHISHEKKUMAR664/TaskManager.git
   cd TaskManager
   pnpm install
   ```

2. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add:
   JWT_SECRET=your-secure-jwt-secret-key-at-least-32-characters-long
   ```

3. **Start development server**
   ```bash
   pnpm dev
   # Open http://localhost:3000
   ```

### Default Test Users
```bash
Username: abhishek    Password: abhishek
Username: hello       Password: hello
Username: 123         Password: 123
```

## Features

- **User Authentication** - JWT-based secure login/signup
- **Project Management** - Create, edit, and delete projects
- **Task Management** - Full CRUD operations for tasks
- **Status System** - Todo, In Progress, Done with visual indicators
- **Status Transitions** - Easy drag-and-drop or click to change task status
- **Confirmation Dialogs** - Safe deletion with user confirmation
- **Responsive Design** - Works on desktop and mobile
- **Modern UI** - Material-UI components with Tailwind CSS
- **File-based Storage** - Simple JSON file database
- **Security Best Practices** - Environment-based secrets, input validation

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript 5.x
- **UI Library**: Material-UI v7.2.0
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Authentication**: JWT (jsonwebtoken)
- **Notifications**: React Toastify
- **Package Manager**: pnpm
- **Development**: Turbopack
- **Data Storage**: File-based JSON database
- **Security**: Environment-based configuration, security headers

## Project Structure

```
src/app/
├── api/                    # API Routes
│   ├── auth/              # Authentication endpoints
│   ├── projects/          # Project CRUD operations
│   └── tasks/             # Task CRUD operations
├── components/            # React Components
│   ├── dashboard/         # Dashboard components
│   ├── projects/          # Project management
│   ├── tasks/             # Task management
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── store/                 # Zustand state management
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
├── dashboard/             # Dashboard page
├── login/                 # Login page
├── layout.tsx             # Root layout
└── page.tsx              # Home page
data/                      # JSON file database
├── users.json            # User accounts
├── projects.json         # Project data
└── tasks.json            # Task data
```

## Usage

1. **Login** with existing credentials or **Sign Up** for a new account
2. **Create a Project** using the "Add Project" button
3. **Add Tasks** to your project with the "Add Task" button
4. **Manage Tasks** by changing status (Todo > In Progress > Done)
5. **Edit/Delete** projects and tasks using hover actions

### Task Status System
- **Todo** - New tasks waiting to be started
- **In Progress** - Tasks currently being worked on  
- **Done** - Completed tasks

## Development

### Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Development Features
- **Hot Reload** - Instant updates during development
- **TypeScript** - Full type safety with strict mode
- **ESLint** - Code quality checks and formatting
- **Turbopack** - Ultra-fast bundling
- **Security Headers** - Automatic security middleware
- **File-based Routing** - Next.js App Router conventions

## Production Deployment

### Environment Setup
```bash
# .env.local
JWT_SECRET=your-production-secret-at-least-32-characters-long
NODE_ENV=production
```

### Build and Deploy
```bash
pnpm build
pnpm start
```

### Deployment Platforms
- **Vercel** (Recommended): `vercel` command or GitHub integration
- **Netlify**: Connect GitHub repo, set environment variables
- **Railway**: Connect GitHub repo, configure environment
- **Docker**: Node.js 18+ container with pnpm

## API Documentation

### Authentication
```bash
POST /api/auth/signin       # Login
POST /api/auth/signup       # Register
```

### Projects
```bash
GET    /api/projects        # List projects
POST   /api/projects        # Create project
PUT    /api/projects        # Update project
DELETE /api/projects        # Delete project
```

### Tasks
```bash
GET    /api/tasks           # List tasks
POST   /api/tasks           # Create task
PUT    /api/tasks           # Update task
DELETE /api/tasks           # Delete task
```

All endpoints require `Authorization: Bearer <token>` header (except auth endpoints).

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## License

MIT License

## Author

**Abhishek Kumar** - [@ABHISHEKKUMAR664](https://github.com/ABHISHEKKUMAR664)

---

**Happy Task Managing!**
