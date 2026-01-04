# GitHub Copilot Instructions for rad-ai

## Project Overview

This is a radiology AI assistant application built as a monorepo with separate client and server workspaces. The application helps manage radiology reports, patient data, and provides AI-powered analysis using OpenAI.

## Project Structure

- **Root**: Monorepo managed with npm workspaces
- **client/**: React + Vite + TypeScript frontend application
- **server/**: Express + TypeScript backend API
- **`.github/`**: GitHub configuration and workflows

## Tech Stack

### Client (Frontend)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with PostCSS
- **State Management**: @tanstack/react-query for server state
- **Routing**: react-router-dom
- **UI Components**: Custom components with Material-UI patterns, lucide-react icons
- **Forms**: react-hook-form
- **Animations**: framer-motion
- **Notifications**: sonner (toast notifications)

### Server (Backend)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **AI Integration**: OpenAI API
- **File Upload**: multer
- **PDF Processing**: pdf-parse
- **Environment Config**: dotenv

## Coding Standards

### TypeScript
- Use TypeScript for all new code (`.ts` and `.tsx` files)
- Enable strict mode (already configured in `tsconfig.json`)
- Always define proper types; avoid `any` unless absolutely necessary
- Use ES2020+ features and ESNext modules
- Prefer named exports over default exports for better refactoring

### Code Style
- Use double quotes for strings in TypeScript/JavaScript
- No semicolons required (not enforced by ESLint)
- Use arrow functions for React components and callbacks
- Import React hooks from "react" (not as default import)
- React components do not require `import React` (JSX transform enabled)

### ESLint
- Client has ESLint configured with `@eslint/js` and `eslint-plugin-react`
- Run linting with: `npm run lint` (at root or in client workspace)
- Maximum warnings allowed: 0 (enforced with `--max-warnings=0`)
- Rule: `react/react-in-jsx-scope` is disabled (not needed with new JSX transform)

## File Organization

### Client Structure
- `src/pages/`: Page components (one per route)
- `src/components/`: Reusable UI components
- `src/lib/`: Utility functions, API client, configurations
- `src/types/`: TypeScript type definitions and interfaces
- `src/assets/`: Static assets

### Server Structure
- `src/models/`: Mongoose models (User, Patient, RadiologyReport, TreatmentRecord)
- `src/routes/`: Express route handlers (auth, patients, reports, treatments, ai)
- `src/middleware/`: Express middleware (error-handler, etc.)
- `src/lib/`: Utility functions (db connection, console-ninja logging)
- `src/types/`: TypeScript type definitions
- `uploads/`: File upload directory (excluded from git)

## Development Commands

### Root Level
- `npm run dev`: Start both client and server in development mode
- `npm run build`: Build both client and server for production
- `npm run lint`: Lint both client and server code

### Client Workspace
- `npm run dev --workspace client`: Start Vite dev server
- `npm run build --workspace client`: Build for production
- `npm run preview --workspace client`: Preview production build
- `npm run lint --workspace client`: Run ESLint

### Server Workspace
- `npm run dev --workspace server`: Start server with tsx watch mode
- `npm run build --workspace server`: Compile TypeScript to JavaScript
- `npm run start --workspace server`: Run compiled server (production)

## Security Best Practices

### Critical Rules
- **NEVER** hardcode API keys, passwords, or secrets in source code
- Always use environment variables for sensitive configuration (`.env` files)
- `.env` files are git-ignored; use `.env.example` as templates
- Validate and sanitize all user inputs before processing
- Use bcryptjs for password hashing (already implemented)
- Implement proper authentication middleware for protected routes
- Use CORS appropriately (currently enabled for development)

### Environment Variables
- Client: `VITE_API_URL` for API endpoint configuration
- Server: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, etc.
- Always document required environment variables in `.env.example`

## Database & Models

- Use Mongoose schemas with proper TypeScript types
- Models: User, Patient, RadiologyReport, TreatmentRecord
- Always validate data at the model level using Mongoose validators
- Use proper indexing for frequently queried fields

## API Design

- RESTful API patterns with Express routers
- Routes organized by resource: `/api/auth`, `/api/patients`, `/api/reports`, `/api/treatments`, `/api/ai`
- Use proper HTTP status codes (200, 201, 400, 401, 404, 500)
- Implement centralized error handling with `errorHandler` middleware
- Return consistent JSON response structures

## Frontend Patterns

- Use React Query for all server data fetching and caching
- Query keys should be descriptive arrays: `["patients"]`, `["reports", patientId]`
- Use custom hooks for reusable logic
- Prefer functional components with hooks over class components
- Use TypeScript interfaces for props and state
- Implement proper loading and error states for async operations
- Use `toast` from sonner for user notifications

## Testing

- Currently no test framework is configured
- When adding tests, prefer Jest for unit tests and React Testing Library for component tests
- Test files should be colocated with source files or in `__tests__` directories

## Docker & Deployment

- Server has a Dockerfile for containerization
- Docker image publishing workflow: `.github/workflows/docker-publish.yml`
- Uses legacy Docker builder (BuildKit disabled due to npm ci issues)
- Images published to GitHub Container Registry (ghcr.io)

## Dependencies

- Use `npm install` for adding dependencies
- Update `package.json` in the appropriate workspace (client or server)
- Run `npm install` at root to update workspace dependencies
- Keep dependencies up to date, but test thoroughly after updates

## Logging

- Server uses custom `ConsoleNinja` utility for logging
- Client uses `consoleNinja` utility for debug logging
- Always log errors with context for debugging

## Git Workflow

- Protected directories in `.gitignore`: `node_modules`, `.env`, `dist/`, `uploads/`
- Use descriptive commit messages
- Keep commits focused and atomic

## AI Integration

- OpenAI API integration for report analysis
- Handle API errors gracefully
- Implement rate limiting and error retry logic
- Document AI prompt engineering patterns

## Performance Considerations

- Lazy load routes and components when appropriate
- Use React Query's caching to minimize API calls
- Optimize bundle size with proper code splitting
- Use Vite's built-in optimizations for production builds

## Accessibility

- Use semantic HTML elements
- Ensure proper ARIA labels for interactive elements
- Test keyboard navigation
- Provide meaningful alt text for images

## When Working on Issues

- Understand the full context before making changes
- Make minimal, surgical changes to fix issues
- Update relevant documentation if behavior changes
- Test changes locally before committing
- Consider backward compatibility
- Follow existing patterns and conventions in the codebase
