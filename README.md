# Car Showcase Application

A modern web application for showcasing and managing cars built with Next.js 15, TypeScript, and Tailwind CSS.

## Project Structure

The project follows the Next.js 15 recommended directory structure:

```
/
├── src/
│   ├── app/              # App routes and pages
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility libraries
│   │   ├── api/          # API integrations
│   │   ├── hooks/        # Custom React hooks
│   │   ├── providers/    # Context providers
│   │   ├── redux/        # Redux state management
│   │   └── types/        # Type definitions
│   ├── utils/            # Utility functions
│   └── constants/        # Constants and configuration
├── public/               # Static assets
├── backend/              # Backend server code (NestJS)
└── ...config files
```

## Import Conventions

All imports should use absolute paths with the `@/` prefix:

```typescript
// Correct
import { Component } from '@/components/Component';
import { someUtil } from '@/utils';
import { CONSTANTS } from '@/constants';

// Incorrect
import { Component } from '../../components/Component';
import { someUtil } from '../utils';
```

## Features

- Car browsing and filtering
- User authentication
- File upload and management
- Vehicle registration
- Responsive design

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Create a `.env.local` file with the necessary environment variables
4. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## Backend

The backend service is built with NestJS and includes:

- Authentication (JWT)
- File management
- User management

To run the backend separately:
```bash
cd backend
npm install
npm run start:dev
```

## Component Guidelines

- Use functional components with TypeScript
- Follow the naming convention: PascalCase for components
- Place shared components in `src/components/`
- Place page-specific components in `src/app/[page]/_components/`

## Key Dependencies

- **Next.js 15.x**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: Unstyled, accessible UI components
- **Redux Toolkit**: State management
- **Axios**: HTTP client
- **React Hook Form**: Form validation

## Backend Setup

See [backend/README.md](./backend/README.md) for instructions on setting up the NestJS backend.

## Development Guidelines

- Use TypeScript for all components and functions
- Follow the Next.js App Router patterns
- Use server components by default, client components when necessary
- Keep components small and focused on a single responsibility
- Use Tailwind CSS for styling