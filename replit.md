# Replit.md

## Overview

This is a full-stack pharmaceutical inventory management application built with React, Express, and TypeScript. The application provides comprehensive features for managing pharmaceutical inventory, customer information, sales invoicing, and GST compliance. It uses a modern tech stack with shadcn/ui components for the frontend and includes comprehensive pharmacy-specific functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state, localStorage for client-side persistence
- **Routing**: React Router for client-side navigation
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL support
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful API with `/api` prefix
- **Development**: Hot reload with tsx and Vite middleware

### Database Architecture
- **Database**: PostgreSQL (configured via Drizzle)
- **Schema Location**: `shared/schema.ts` for type-safe database operations
- **Migration Strategy**: Drizzle Kit for schema management
- **Current Schema**: Basic user authentication table (expandable for pharmacy entities)

## Key Components

### Frontend Components
1. **Navigation System**: Hierarchical sidebar navigation with pharmacy-specific sections
2. **Dashboard**: Comprehensive analytics with charts and KPI displays
3. **Inventory Management**: Stock items with batch tracking, expiry management
4. **Customer Management**: Customer profiles with GST details and credit limits
5. **Sales Invoicing**: Invoice creation with automatic GST calculations
6. **GSTR-1 Features**: GST compliance and reporting tools
7. **Modal System**: Reusable modals for adding/editing entities

### Backend Infrastructure
1. **Storage Layer**: Abstract storage interface with in-memory implementation
2. **Route Registration**: Modular route registration system
3. **Middleware**: Request logging and error handling
4. **Development Server**: Vite integration for seamless full-stack development

### Data Models
- **StockItem**: Pharmaceutical products with batch tracking, expiry dates, GST rates
- **Customer**: Customer profiles with GST compliance information
- **SalesInvoice**: Invoicing with line items and tax calculations
- **User**: Basic authentication schema (ready for expansion)

## Data Flow

1. **Client-Side Storage**: Uses localStorage with a centralized DataStore class for client-side persistence
2. **API Communication**: TanStack Query handles server state with caching and synchronization
3. **Form Handling**: React Hook Form with Zod validation for type-safe form processing
4. **Real-time Updates**: Automatic UI updates when data changes through reactive patterns

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management
- **react-router-dom**: Client-side routing
- **zod**: Runtime type validation
- **date-fns**: Date manipulation utilities

### UI Dependencies
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **recharts**: Chart library for data visualization
- **sonner**: Toast notifications

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production builds
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with Express middleware integration
- **Port Configuration**: Server runs on port 5000 with automatic port forwarding
- **Database**: Neon Database with environment-based connection string

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code with external dependencies
- **Deployment Target**: Replit Autoscale with automatic scaling
- **Environment**: Production mode with optimized settings

### Database Management
- **Schema Deployment**: `drizzle-kit push` for schema synchronization
- **Migration Strategy**: Automatic schema updates via Drizzle migrations
- **Connection**: Environment variable `DATABASE_URL` for database connectivity

## Changelog

```
Changelog:
- June 23, 2025. Initial setup
- June 23, 2025. Implemented comprehensive feature expansion:
  * Added separate GST Compliance navigation category with 5 dedicated sub-items
  * Implemented full functionality for all accounting modules (ledgers, journal entries, payments, etc.)
  * Added complete sales and purchase workflow features (returns, delivery notes, quotations, etc.)
  * Enhanced parties management with suppliers, drug licenses, and credit limits
  * Replaced all "coming soon" placeholders with functional dashboards and analytics
  * Updated navigation highlighting to support new GST compliance section
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```