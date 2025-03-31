# Car Showcase

Modern car showcase platform built with Next.js App Router, React 19, TypeScript, and Tailwind CSS.

## Features

- Modern responsive UI with Tailwind CSS
- Server and client components with Next.js App Router
- Type-safe development with TypeScript
- Dynamic car listings and filtering
- Advanced search functionality
- Authentication with NextAuth.js
- Backend API with NestJS (separate setup)

## Requirements

- Node.js 18.x or higher
- npm 8.x or higher

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/kimbaoksqp123/car_showcase
cd car_showcase
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
# Add other environment variables as needed
```

## Running the Application

### Development

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).
## Key Dependencies

- **Next.js 15.x**: React framework with App Router
- **React 19.x**: UI library
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