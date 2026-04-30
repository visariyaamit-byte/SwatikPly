# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Swastik Plywood — a store management system for a plywood/board retail business. Tracks inventory (Plywood, Board, MDF, Flexi), customers, challans (delivery notes), payments, and sales reports.

## Commands

- `npm run dev` — start dev server (Next.js 16, port 3000)
- `npm run build` — production build
- `npm run lint` — ESLint

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19, JavaScript (no TypeScript)
- **Database**: Supabase (PostgreSQL with RLS)
- **Styling**: Tailwind CSS 3 + Radix UI primitives
- **Forms**: react-hook-form + zod validation
- **Icons**: lucide-react
- **PDF**: jspdf + html2canvas (for challan printing)

## Architecture

### Supabase Clients (src/lib/supabase/)
Three Supabase client factories — use the right one:
- `server.js` → `createClient()` — for Server Components and Server Actions (cookie-based auth)
- `client.js` → `createClient()` — for Client Components (browser auth)
- `service.js` → `createServiceClient()` — bypasses RLS using service_role key, **server-side only**

### Server Actions (src/app/actions/)
All data mutations and queries go through Server Actions (`'use server'`). Each domain has its own file: `auth.js`, `inventory.js`, `challans.js`, `customers.js`, `payments.js`, `companies.js`, `sites.js`, `laminates.js`, `reports.js`. Actions use `revalidatePath()` after mutations.

### Auth & Roles
- Middleware (`src/middleware.js`) protects all routes — redirects unauthenticated users to `/login`
- Role system via `user_roles` table: `manager`, `staff`, `viewer`
- Dashboard sales reports are manager-only

### Route Structure
All app routes are under `src/app/`:
- `/login` — auth page
- `/dashboard` — main dashboard (sales reports for managers)
- `/dashboard/inventory` — inventory management with sub-routes per product type (`plywood/`, `board/`, `mdf/`, `flexi/`)
- `/dashboard/inventory/companies` — plywood company management
- `/dashboard/challans` — delivery challans (create, view, print)
- `/dashboard/customers` — customer management with payment tracking
- `/dashboard/sites` — site/project management with laminate tracking

### Database Schema
SQL migrations live in `database/`. Key tables: `inventory`, `companies`, `challans`, `challan_items`, `customers`, `payments`, `user_roles`, `sites`, `laminates`, `stock_history`. All tables use UUID primary keys and have RLS enabled for authenticated users.

### Product Types & Constants
Product-specific measurements, thicknesses, and grades are defined in `src/lib/constants.js`. Product types: Plywood (has company_id), Board (has grade), MDF (has color via grade field), Flexi (has type via grade field).

## Key Patterns

- Pages are Server Components that fetch data; interactive parts are Client Components
- Inventory items use upsert logic — creating a duplicate item adds to existing quantity
- Path alias `@/` maps to `src/` (configured in jsconfig.json)
