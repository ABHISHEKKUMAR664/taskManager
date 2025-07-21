# Task Manager

A modern, full-featured task management application built with Next.js 15, React 19, and TypeScript. Features include project organization, Jira-like task status management, user authentication, and a responsive Material-UI interface.

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
A modern, full-featured task management application built with Next.js 15, React 19, and TypeScript. Features include project organization, Task status management, user authentication, and a responsive Material-UI interface.

## ✨ Features

- 🔐 **User Authentication** - JWT-based secure login/signup
- 📁 **Project Management** - Create, edit, and delete projects
- ✅ **Task Management** - Full CRUD operations for tasks
- 🎯 **Status System** - Todo, In Progress, Done with visual indicators
- 🔄 **Status Transitions** - Easy drag-and-drop or click to change task status
- 🗑️ **Confirmation Dialogs** - Safe deletion with user confirmation
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Modern UI** - Material-UI components with Tailwind CSS
- 💾 **File-based Storage** - Simple JSON file database
- 🔒 **Security Best Practices** - Environment-based secrets, input validation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript 5.x
- **UI Library**: Material-UI (MUI) v7.2.0
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Authentication**: JWT (jsonwebtoken)
- **Notifications**: React Toastify
- **Package Manager**: pnpm
- **Development**: Turbopack for fast development builds
- **Data Storage**: File-based JSON database
- **Security**: Environment-based configuration, security headers

## Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ABHISHEKKUMAR664/TaskManager.git
   cd TaskManager
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your settings:
   ```bash
   # JWT Secret - IMPORTANT: Change this in production!
   JWT_SECRET=your-secure-jwt-secret-key-at-least-32-characters-long
   ```

4. **Initialize data (optional)**
   - Default users will be created automatically
   - Or create your own in `data/users.json`

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
src/
├── app/                     # Next.js 13+ App Directory
│   ├── api/                 # API Routes (Next.js App Router)
│   │   ├── auth/           # Authentication endpoints
│   │   │   ├── signin/     # POST /api/auth/signin
│   │   │   │   └── route.ts
│   │   │   └── signup/     # POST /api/auth/signup
│   │   │       └── route.ts
│   │   ├── projects/       # Project CRUD operations
│   │   │   └── route.ts    # GET, POST, PUT, DELETE /api/projects
│   │   └── tasks/          # Task CRUD operations
│   │       └── route.ts    # GET, POST, PUT, DELETE /api/tasks
│   ├── components/         # React Components
│   │   ├── AuthForm.tsx    # Login/Signup form component
│   │   ├── dashboard/      # Dashboard-specific components
│   │   │   └── DashboardHeader.tsx
│   │   ├── projects/       # Project management components
│   │   │   ├── AddProjectDialog.tsx
│   │   │   ├── EditProjectDialog.tsx
│   │   │   └── ProjectList.tsx
│   │   ├── tasks/          # Task management components
│   │   │   ├── AddTaskDialog.tsx
│   │   │   ├── EditTaskDialog.tsx
│   │   │   └── TaskList.tsx
│   │   └── ui/             # Reusable UI components
│   │       ├── TaskStatusChip.tsx
│   │       └── TaskStatusFilter.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useActionVisibility.ts
│   │   └── useDashboard.ts
│   ├── store/              # Zustand state management
│   │   ├── useAuthStore.ts
│   │   ├── useProjectStore.ts
│   │   └── useTaskStore.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   └── taskStatus.ts
│   ├── dashboard/          # Dashboard page
│   │   └── page.tsx
│   ├── login/              # Login page
│   │   └── page.tsx
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Home page (auth redirect)
│   └── globals.css        # Global styles
├── lib/                    # Shared libraries
│   ├── data.ts            # DataManager - centralized data operations
│   └── security.ts        # Security utilities & JWT helpers
├── data/                   # JSON file-based database
│   ├── users.json         # User accounts & authentication
│   ├── projects.json      # Project data by user
│   ├── tasks.json         # Task data by user
│   ├── *.json.template    # Data structure templates
│   └── README.md          # Data schema documentation
├── middleware.ts           # Next.js middleware for security headers
├── .env.local             # Environment variables (not in git)
└── .env.local.example     # Environment template
```

## Authentication

### Default Test Users
```bash
Username: abhishek    Password: abhishek
Username: hello       Password: hello
Username: 123         Password: 123
```

### Creating New Users
1. Use the signup form in the application
2. Or manually add to `data/users.json`:
   ```json
   {
     "username": {
       "username": "username",
       "password": "password",
       "createdAt": "2025-01-01T00:00:00.000Z"
     }
   }
   ```

## Usage

### Getting Started
1. **Login** with existing credentials or **Sign Up** for a new account
2. **Create a Project** using the "Add Project" button
3. **Add Tasks** to your project with the "Add Task" button
4. **Manage Tasks** by changing status (Todo → In Progress → Done)
5. **Edit/Delete** projects and tasks using hover actions

### Task Status System
- **Todo** - New tasks waiting to be started
- **In Progress** - Tasks currently being worked on  
- **Done** - Completed tasks

### Keyboard Shortcuts
- Click task status chips to change status
- Hover over items to reveal edit/delete actions
- Use confirmation dialogs for safe deletion

## Development

### Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Package Management
pnpm install      # Install dependencies
pnpm add <pkg>    # Add new package
```

### Development Features
- **Hot Reload** - Instant updates during development
- **TypeScript** - Full type safety with strict mode
- **ESLint** - Code quality checks and formatting
- **Turbopack** - Ultra-fast bundling (faster than Webpack)
- **Security Headers** - Automatic security middleware
- **File-based Routing** - Next.js App Router conventions

### Architecture Highlights

**DataManager Pattern:**
- Centralized data operations in `src/lib/data.ts`
- Automatic data migration for backward compatibility
- Type-safe operations with TypeScript

**Security Implementation:**
- Environment-based JWT secrets
- Automatic token validation middleware
- Security headers via Next.js middleware
- Input validation and sanitization

**Component Architecture:**
- Modular component structure with clear separation
- Custom hooks for complex state logic
- Material-UI integration with Tailwind CSS
- Responsive design patterns

## Production Deployment

### Environment Configuration
1. **Update JWT Secret**
   ```bash
   # .env.local or your deployment platform
   JWT_SECRET=your-production-secret-at-least-32-characters-long
   NODE_ENV=production
   ```

2. **Build the application**
   ```bash
   pnpm build
   ```

3. **Start production server**
   ```bash
   pnpm start
   ```

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# JWT_SECRET=your-production-secret
```

#### Other Platforms
- **Netlify**: Use `pnpm build` and deploy `/.next` folder
- **Railway**: Connect GitHub repo, set environment variables
- **Digital Ocean**: Use App Platform with Node.js preset
- **Docker**: Create Dockerfile with Node.js 18+ and pnpm

### Security Checklist
- Update `JWT_SECRET` for production (minimum 32 characters)
- Enable HTTPS (handled automatically by most platforms)
- Set up proper CORS policies if needed
- Configure environment variables on deployment platform
- Enable security headers (included via middleware)
- Set up monitoring and error tracking (Sentry, LogRocket, etc.)
- Configure database backups (for file-based storage)

### Performance Optimization
- Static generation where possible (already configured)
- API route optimization with proper caching headers
- Image optimization (if images are added later)
- Bundle analysis: `pnpm build && npx @next/bundle-analyzer`

## API Documentation

All API endpoints follow REST conventions and require authentication (except auth endpoints).

### Authentication Endpoints
```bash
POST /api/auth/signin       # User login
POST /api/auth/signup       # User registration
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "jwt_token_string",
  "username": "string"
}
```

### Projects API
```bash
GET    /api/projects        # Get user's projects
POST   /api/projects        # Create new project
PUT    /api/projects        # Update existing project
DELETE /api/projects        # Delete project
```

**Headers Required:**
```
Authorization: Bearer <jwt_token>
```

**Project Operations:**
- **GET**: Returns `{ projects: Project[] }`
- **POST**: Body `{ name: string }` → Returns `{ project: Project }`
- **PUT**: Body `{ id: string, name: string }` → Returns `{ success: boolean }`
- **DELETE**: Body `{ id: string }` → Returns `{ success: boolean }`

### Tasks API
```bash
GET    /api/tasks           # Get tasks (optionally filtered by project)
POST   /api/tasks           # Create new task
PUT    /api/tasks           # Update task (title, status, etc.)
DELETE /api/tasks           # Delete task
```

**Task Operations:**
- **GET**: Query param `?projectId=123` → Returns `{ tasks: Task[] }`
- **POST**: Body `{ projectId: string, title: string, status?: "todo"|"inprogress"|"done" }`
- **PUT**: Body `{ id: string, title?: string, status?: string, completed?: boolean }`
- **DELETE**: Body `{ id: string }`

### Error Responses
```json
{
  "error": "Error message string"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `409` - Conflict (e.g., user already exists)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Abhishek Kumar**
- GitHub: [@ABHISHEKKUMAR664](https://github.com/ABHISHEKKUMAR664)

## Acknowledgments

- Next.js team for the amazing framework
- Material-UI for beautiful components
- React team for the excellent library
- All contributors and testers

---

**Happy Task Managing!**
