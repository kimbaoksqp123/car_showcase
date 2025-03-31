# Car Showcase - Next.js 15 Project Structure

This project follows the standard Next.js 15 App Router project structure.

## Directory Structure

```
src/                     # All application code lives here
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── globals.css      # Global styles
│   ├── signin/          # Sign in page
│   ├── signup/          # Sign up page
│   └── upload-files/    # File upload page (admin only)
├── components/          # Reusable React components
│   ├── CarCard.tsx
│   ├── FileUploader.tsx
│   ├── Navbar.tsx
│   └── ...
├── lib/                 # Library code and utilities
│   ├── api.ts           # API client
│   ├── redux/           # Redux store and slices
│   │   ├── store.ts     
│   │   └── features/
│   ├── types/           # TypeScript type definitions
│   ├── hooks/           # Custom React hooks
│   └── providers/       # React context providers
└── constants/           # Constants and configuration
```

## Import Conventions

Use absolute imports with the `@/` prefix:

```tsx
// Good
import { uploadFiles } from '@/lib/redux/features/fileSlice';
import FileUploader from '@/components/FileUploader';

// Avoid
import { uploadFiles } from '../../lib/redux/features/fileSlice';
import FileUploader from '../../components/FileUploader';
```

## Component Conventions

- One component per file
- Use PascalCase for component file names
- Keep components in the `src/components` directory
- Create subdirectories for related components if needed

## Development Guidelines

- Use TypeScript for all components and functions
- Follow the Next.js App Router patterns and conventions
- Use server components by default, client components when necessary
- Keep components small and focused on a single responsibility
- Use Tailwind CSS for styling
- Use Redux for global state management 