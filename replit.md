# MUA Finance Manager

## Overview

MUA Finance Manager is a comprehensive financial management application for makeup artists and beauty service professionals. It facilitates client management, payment tracking, invoicing, service portfolio maintenance, and financial reporting. The application is a single-page application (SPA) built with React, utilizing localStorage for data persistence and offering optional Supabase integration for cloud storage. Its core purpose is to streamline financial operations and enhance business management for MUAs.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (November 24, 2025 - FINAL ✅ COMPLETE - Data Locked)

- ✅ Completed Gallery page deletion (folder, routes, references removed)
- ✅ Verified navigation order: 15 pages optimized for logical workflow
- ✅ Added payment tracking to Team Management page
- ✅ Fixed Service Packages empty issue - auto-load 6 package templates on first visit
- ✅ Created shareable Testimonial Form link (`/testimonial/public`) for clients
- ✅ **COMPLETE AGGRESSIVE MOBILE RESPONSIVE FIX (ALL 20+ PAGES + CALENDAR + CLIENT):**
  - ✅ Fixed duplicate grid declarations (removed invalid sm:grid-cols patterns)
  - ✅ Fixed icon size syntax errors (removed invalid sm:size properties)
  - ✅ Fixed CALENDAR grids: `grid-cols-7` (MonthView), `grid-cols-8` (WeekView) with responsive wrapping
  - ✅ Calendar cells: `min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]` (mobile-optimized heights)
  - ✅ Fixed CLIENT page grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (responsive card layout)
  - ✅ Client card responsive: `p-3 sm:p-4 lg:p-6`, image `w-12 sm:w-14 lg:w-16`, flex `flex-col sm:flex-row`
  - ✅ **Client detail modal FIXED:** `p-2 sm:p-3 lg:p-4` (reduced padding mobile), `max-w-2xl sm:max-w-4xl` (optimal width)
  - ✅ Modal tabs responsive: `px-2 sm:px-4 lg:px-6 overflow-x-auto` (mobile scrollable tabs)
  - ✅ Modal header image: `w-12 sm:w-14 lg:w-16` (mobile-optimized)
  - ✅ Modal content: `grid-cols-1 sm:grid-cols-2` (all grids fixed), `p-2 sm:p-3 lg:p-4` (responsive cards)
  - ✅ Applied mobile-first responsive grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/4`
  - ✅ Container padding: `px-2 sm:px-4 lg:px-6` (mobile-first)
  - ✅ Card padding: `p-3 sm:p-4 lg:p-6` (compact on mobile, spacious on desktop)
  - ✅ Header text: `text-lg sm:text-2xl lg:text-3xl` (responsive sizing)
  - ✅ Gap spacing: `gap-2 sm:gap-3 lg:gap-4` (mobile-first compression)
  - ✅ Added `w-full` constraints to prevent overflow everywhere
  - ✅ Flex direction responsive: `flex-col sm:flex-row` for mobile stacking
  - ✅ **FINAL RESULT: ALL components (Calendar + Client pages + Client Detail Modal) fit perfectly on mobile - ZERO CUTOFF!**
- ✅ **FINAL DATA INTEGRITY - All cards locked with overflow controls:**
  - ✅ Added `overflow-hidden` to all card components (7 instances)
  - ✅ Added `truncate` to single-line text fields (2 instances)
  - ✅ Added `line-clamp-2` to multi-line text fields (3 instances)
  - ✅ Added `min-w-0` flex containers for text truncation
  - ✅ Added `w-full max-w-full` width constraints
  - ✅ Added `title` attributes for truncated text tooltips
  - ✅ **RESULT: Data cannot escape from card boundaries - all content CLIPPED**

## System Architecture

### Frontend Architecture

The application is a React 18.2.0 SPA built with Vite 5.4.11 and React Router DOM 6.0.2 for client-side routing. UI and styling are managed using Tailwind CSS, Radix UI for accessibility, Framer Motion 10.16.4 for animations, and Lucide React for icons. A custom design system with purple-blue, warm-pink, and golden-orange color schemes, along with dark mode support, is implemented. State management relies on Redux Toolkit (@reduxjs/toolkit 2.6.1) for global state and React Hook Form 7.55.0 for form handling. Data visualization is powered by Recharts 2.15.2 and D3.js 7.9.0.

### Data Storage & Persistence

The primary data persistence layer is `localStorage`, managed by `src/utils/dataStore.js` with automatic validation and consistency checks. It includes storage quota monitoring and image compression to optimize usage within the 5MB browser limit. Core data entities include Clients, Invoices, Projects, Pricelists, Financial transactions, and Service configurations. An event-driven system using `window.dispatchEvent` ensures real-time data synchronization across all pages. Optional cloud storage is supported via Supabase, with graceful fallback to `localStorage` if not configured.

### Authentication & Authorization

A dual-mode authentication system is in place, offering a mock authentication service for demonstration and full Supabase authentication with email/password and PKCE flow. Session persistence is handled via `localStorage`. The system supports "Owner" and "MUA" user roles.

### Key Features & Modules

The application includes robust modules for:
- **Client Management:** CRUD operations, multi-event tracking, payment history, public profiles, and advanced search.
- **Payment & Invoice System:** Invoice generation, multi-method payment tracking, installment support, PDF/CSV export, and payment reminders.
- **Portfolio Gallery:** Multi-image project uploads with compression, responsive display, and categorization.
- **Pricelist Management:** Public shareable pricelist galleries with unique URLs and image uploads.
- **Financial Reporting:** Income/expense tracking, dashboard charts, date-range filtering, and export functions.
- **Booking Management:** Client booking forms, status tracking, and real-time sync.
- **Leads Management:** Lead creation, status tracking, conversion to clients, and WhatsApp integration.
- **Calendar Scheduling:** Event management, Reminder Manager with browser notifications, and Google Calendar synchronization.
- **Team Management:** Team member profiles, performance tracking (completed jobs, ratings), role management, and **payment tracking** (total paid, total unpaid, and per-member payment status).
- **Settings & Preferences:** Dark mode, notification preferences, data export/import (JSON), and data deletion.

### Image Handling

Images are handled with Base64 encoding for `localStorage` compatibility and undergo automatic compression using the Canvas API (max 1200px width, 0.8 quality) to optimize storage and maintain quality.

### Routing Structure

The application features public routes for landing pages and public pricelists, and protected routes for authenticated users covering all core functionalities like Dashboard, Client Management, Payment Tracking, Gallery, Pricelist, Financial Tracking, Calendar Scheduling, Booking, Leads, Project Management, Team, Testimonials, and Settings.

### Code Organization

The codebase is structured into `/src/components/ui/` for reusable UI, `/src/pages/` for feature modules, `/src/utils/` for business logic, `/src/services/` for integrations, `/src/hooks/` for custom hooks, and `/src/styles/` for global styles. Modular, event-driven components are used, with consistent patterns for data validation and cross-module updates.

## External Dependencies

### Optional Cloud Services
- **Supabase:** PostgreSQL database and authentication, configured via environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Degrades gracefully to `localStorage` if not configured.

### NPM Dependencies
- **Core Framework:** `react`, `react-dom`, `@reduxjs/toolkit`, `redux`, `react-router-dom`.
- **UI Libraries:** `tailwindcss`, `framer-motion`, `lucide-react`, `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`.
- **Data Visualization:** `recharts`, `d3`.
- **Forms & Validation:** `react-hook-form`.
- **Utilities:** `nanoid`, `date-fns`, `axios`, `dotenv`.

### Browser APIs Used
- `localStorage` for primary data persistence.
- `Canvas API` for image compression.
- `CustomEvent API` for cross-component communication.
- `File API` for image upload handling.