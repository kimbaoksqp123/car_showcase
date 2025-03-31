# Car Showcase Application

A modern web application for showcasing and managing cars built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- Car browsing and filtering
- User authentication
- File upload and management
- Vehicle registration
- Responsive design

### Prerequisites

- Node.js 18+
- npm

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install

3. Create a `.env.local` file with the necessary environment variables
4. Run the development server:
   ```bash
   npm run dev

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