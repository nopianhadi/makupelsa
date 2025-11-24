# MUA Finance Manager

## Overview

MUA Finance Manager is a comprehensive financial management application designed for makeup artists (MUA) and beauty service professionals. The application helps manage clients, track payments, handle invoices, maintain service portfolios, and generate financial reports. Built as a single-page application using React, it operates entirely in the browser using localStorage for data persistence, with optional Supabase integration for cloud storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18.2.0** - Core UI framework with hooks-based architecture
- **Vite 5.4.11** - Modern build tool and development server
- **React Router DOM 6.0.2** - Client-side routing with hash-link support
- Single-page application (SPA) with component-based architecture

**UI & Styling**
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **Radix UI** - Headless UI components for accessibility (@radix-ui/react-slot)
- **Framer Motion 10.16.4** - Animation library for smooth transitions
- **Lucide React** - Icon library
- Custom design tokens defined in CSS variables for theming (purple-blue, warm-pink, golden-orange color scheme)
- Dark mode support with class-based toggling

**State Management**
- **Redux Toolkit (@reduxjs/toolkit 2.6.1)** - Global state management
- **React Hook Form 7.55.0** - Form state and validation
- Local component state using React hooks
- Custom hooks for data validation and business logic

**Data Visualization**
- **Recharts 2.15.2** - Chart library for financial dashboards
- **D3.js 7.9.0** - Advanced data visualization capabilities

### Data Storage & Persistence

**Primary Storage Strategy**
- **localStorage** - Main data persistence layer for client-side storage
- Centralized data management through `src/utils/dataStore.js`
- Automatic data validation and consistency checks via `src/utils/dataValidation.js`
- Storage quota monitoring with user warnings when approaching limits (5MB browser limit)
- Image compression utility to optimize storage usage

**Data Entities**
- Clients (with payment history, events, profile images)
- Invoices (with line items, payment tracking)
- Projects (gallery portfolio items with multiple images)
- Pricelists (shareable price galleries with public links)
- Financial transactions (income/expenses with categorization)
- Service configurations (types, packages, payment methods)

**Data Synchronization**
- `paymentSync.js` - Synchronizes payment data across clients, invoices, and financial records
- Automatic consistency validation on data mutations
- Migration utilities for data format updates (`migrateClientData.js`, `migrateImageData.js`)

**Optional Cloud Storage**
- **Supabase (@supabase/supabase-js 2.39.3)** - Optional PostgreSQL-backed cloud storage
- Graceful fallback to localStorage when Supabase is not configured
- Mock authentication service when running without backend
- Environment-based configuration via `.env` files

### Authentication & Authorization

**Authentication Strategy**
- Dual-mode authentication system:
  - **Mock Mode** - Demo authentication using `mockAuthService.js` with predefined users
  - **Supabase Mode** - Full authentication with email/password and PKCE flow
- Session persistence in localStorage
- Auto-detection of Supabase configuration
- Demo accounts for testing (demo@muafinance.com, test@muafinance.com)

**User Roles**
- Owner - Full access to all features
- MUA - Service provider access

### Key Features & Modules

**Client Management**
- CRUD operations for client profiles with contact information
- Multi-event tracking per client (weddings, photoshoots, etc.)
- Payment history and status tracking
- Public shareable client profiles
- Client archival system for completed projects
- Advanced search and filtering (by service type, payment status, date range)

**Payment & Invoice System**
- Invoice generation with custom line items
- Payment tracking with multiple methods (transfer, cash, e-wallet)
- Automatic payment status calculation (pending, partial, paid)
- Payment synchronization across modules
- Invoice export to PDF/CSV
- Payment reminder system

**Portfolio Gallery**
- Multi-image project uploads (up to 20 images per project)
- Automatic image compression for storage optimization
- Grid-based responsive gallery display
- Project categorization by service type
- Before/after photo support

**Pricelist Management**
- Public shareable pricelist galleries
- Multiple image upload support (PNG, JPG, JPEG)
- Unique public URLs for each pricelist
- Image compression (max 5MB per image)
- Easy sharing via WhatsApp, email, social media

**Financial Reporting**
- Income vs. expense tracking with categorization
- Dashboard with visual charts and metrics
- Date-range filtering for reports
- Export functionality (CSV, PDF)
- Category-based expense management

**Data Export & Backup**
- CSV export for clients, payments, projects
- Summary report generation
- Data validation and auto-fix utilities
- Manual backup/restore functionality

### Image Handling

**Compression & Storage**
- Base64 image encoding for localStorage compatibility
- Automatic compression using canvas API (max width: 1200px, quality: 0.8)
- Size calculation and quota warnings
- Support for PNG, JPG, JPEG formats
- Multiple image handling with preview grids

**Optimization Rationale**
- localStorage has strict size limits (~5MB in most browsers)
- Compression reduces storage usage while maintaining visual quality
- Base64 encoding enables offline-first architecture without file system access

### Routing Structure

**Public Routes**
- `/pricelist/public/{publicId}` - Public pricelist viewer

**Protected Routes** (require authentication)
- `/` - Dashboard
- `/client-management` - Client CRUD interface
- `/payment-tracking` - Invoice and payment management
- `/gallery` - Portfolio management
- `/pricelist` - Pricelist gallery management
- `/financial-report` - Financial analytics

### Code Organization

**Directory Structure**
- `/src/components/ui/` - Reusable UI components (buttons, modals, cards)
- `/src/pages/` - Page-level components with feature modules
- `/src/utils/` - Business logic, data management, validation
- `/src/services/` - Authentication and external service integrations
- `/src/hooks/` - Custom React hooks
- `/src/styles/` - Global styles and Tailwind configuration
- `/src/lib/` - Third-party library configurations

**Component Patterns**
- Modular modal-based workflows for complex operations
- Reusable card components with consistent styling
- Custom hooks for data validation and storage events
- Event-driven architecture for cross-module updates

## External Dependencies

### Required Third-Party Services

**Optional Cloud Services**
- **Supabase** - PostgreSQL database and authentication (optional, configured via environment variables)
  - `VITE_SUPABASE_URL` - Supabase project URL
  - `VITE_SUPABASE_ANON_KEY` - Public anon key
  - Graceful degradation to localStorage when not configured

### NPM Dependencies

**Core Framework**
- react, react-dom - UI rendering
- @reduxjs/toolkit, redux - State management
- react-router-dom - Routing

**UI Libraries**
- tailwindcss - Styling framework
- framer-motion - Animations
- lucide-react - Icons
- @radix-ui/react-slot - Accessible component primitives
- class-variance-authority, clsx, tailwind-merge - Utility class management

**Data Visualization**
- recharts - Charts and graphs
- d3 - Advanced visualizations

**Forms & Validation**
- react-hook-form - Form handling

**Utilities**
- nanoid - Unique ID generation
- date-fns - Date manipulation
- axios - HTTP client (for future API integrations)
- dotenv - Environment variable management

**Development Tools**
- @vitejs/plugin-react - Vite React integration
- autoprefixer, postcss - CSS processing
- tailwindcss plugins - Extended Tailwind functionality

### Browser APIs Used
- localStorage - Primary data persistence
- Canvas API - Image compression
- CustomEvent API - Cross-component communication
- File API - Image upload handling

### Design Tokens
- Custom CSS variable-based theming system
- Color palette: purple-blue (#6B73FF), warm-pink (#FF6B9D), golden-orange (#FFB366)
- Typography: Plus Jakarta Sans (primary), Inter, DM Sans, JetBrains Mono
- Responsive breakpoints following Tailwind defaults