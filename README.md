# Market-Link — Frontend

> **Nigeria's Verified B2B Trade & Investment Intelligence Platform**
> WebCortex Technologies Limited · Frontend Application

---

## Overview

Market-Link is a verified B2B trade and investment intelligence platform for the Nigerian market. This repository contains the frontend web application — a Next.js 16 app that provides the user interface for registration, onboarding, marketplace browsing, listings, messaging, AI features, and administration.

The frontend communicates exclusively with the backend REST API. All business logic, data validation, and tier enforcement happen on the backend — the frontend is responsible for presentation, form handling, and user experience.

> **Current Implementation Status:** **Sprint 3 Verification UI Completed.** The secure frontend Next.js interface currently supports user Registration mapped natively to persistent Authentication Guards. The Dashboard successfully hydrates algorithmic profile data dynamically routing users to the newly constructed Multi-Step KYC engine featuring explicit binary dropzones before hitting the Admin queue.

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js | 16.x | App Router, SSR, static generation |
| Language | TypeScript | 5.x | Type safety across all components |
| UI Components | Shadcn/ui | latest | Accessible, customisable component library |
| Styling | Tailwind CSS | 4.x | Utility-first CSS framework |
| State Management | Zustand | 4.x+ | Lightweight global state (auth, UI, cache) |
| Form Handling | React Hook Form + Zod | latest | Type-safe forms with validation |
| API Client | Axios | 1.x+ | HTTP client with interceptors for JWT |
| Auth | NextAuth.js | 4.x+ | JWT-based session management |
| Charts | Recharts | latest | Admin analytics charts |
| Testing | Vitest + Testing Library | latest | Unit and integration tests |
| E2E Testing | Playwright | latest | End-to-end browser tests |

---

## Prerequisites

- **Node.js** 20 LTS or later
- **npm** 10.x or later
- **Backend API** running at `http://localhost:5000` (or staging URL configured)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/webcortex/mlink_front.git
cd mlink_front
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` — set `NEXT_PUBLIC_API_BASE_URL` to your backend URL.

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start Next.js development server with hot reload |
| `build` | `npm run build` | Create production build |
| `start` | `npm run start` | Start production server |
| `lint` | `npm run lint` | Run ESLint |
| `typecheck` | `npm run typecheck` | Run TypeScript compiler check |
| `test` | `npm run test` | Run unit tests with Vitest |
| `test:e2e` | `npm run test:e2e` | Run E2E tests with Playwright |

---

## Environment Variables

| Variable | Required | Description | Example |
|---|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend API base URL | `http://localhost:5000/api/v1` |
| `NEXTAUTH_SECRET` | Yes | Secret for NextAuth session encryption | Random 32+ char string |
| `NEXTAUTH_URL` | Yes | Frontend URL | `http://localhost:3000` |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Phase 7+ | Paystack public key for popup | `pk_test_xxx` |

---

## Design System

### Brand Colours

| Token | Value | Usage |
|---|---|---|
| Primary | `#0A5F38` | Deep Nigerian green — buttons, links, headings |
| Primary Light | `#1A8F56` | Hover states, active indicators |
| Primary Dark | `#063B23` | Dark mode backgrounds, emphasis |
| Accent / Gold | `#D4AF37` | Trust, premium elements, badges |
| Accent Light | `#E8C85A` | Hover states for accent elements |
| Surface | `#FAFAF8` | Page backgrounds |
| Border | `#E2E0DB` | Card borders, dividers |
| Text Primary | `#1A1A18` | Main body text |
| Text Secondary | `#6B6B67` | Secondary labels, descriptions |
| Text Muted | `#9B9B97` | Placeholder text, disabled states |
| Success | `#16A34A` | Success messages, approved states |
| Warning | `#D97706` | Warnings, SLA breach indicators |
| Error | `#DC2626` | Error messages, rejected states |
| Info | `#2563EB` | Informational messages |

### Badge Colours
| Level | Colour | Label |
|---|---|---|
| 0 (None) | `#9B9B97` (grey) | — |
| 1 (Basic) | `#2563EB` (blue) | Verified |
| 2 (Full) | `#0A5F38` (green) | Fully Verified |
| 3 (Premium) | `#D4AF37` (gold) | Premium |

### Typography
- **Headings:** Bricolage Grotesque (distinct, modern, authoritative)
- **Body:** DM Sans (clean, readable on mobile)

### Breakpoints
| Name | Width | Target |
|---|---|---|
| `sm` | 375px | Mobile (default — mobile-first) |
| `md` | 768px | Tablet |
| `lg` | 1280px | Desktop |

---

## Mobile-First Requirements

The majority of Nigerian B2B users access Market-Link on mobile devices. Mobile is the primary experience.

| Feature | Mobile Behaviour | Desktop Behaviour |
|---|---|---|
| Navigation | Bottom tab bar | Sidebar |
| Document upload | Camera capture enabled | Drag-and-drop |
| OTP input | Numeric keypad auto-triggered | Standard input |
| Message thread | Full-screen | Side panel |
| Filter panel | Slide-up drawer | Sidebar |
| Forms | Single-column, large labels | Multi-column where appropriate |
| Price table | Horizontal scroll | Full table |
| AI match cards | Full-width | Grid layout |

### Lighthouse Targets

| Metric | Target |
|---|---|
| Performance | ≥ 80 on mobile 4G simulation |
| Accessibility | ≥ 90 |
| Best Practices | ≥ 90 |
| SEO | ≥ 85 |

---

## Key UI Rules

1. **Never show contact details** for Free users — always show UpgradePrompt
2. **Always show data age** on Market Pulse (Free: "7 days ago", Beta: "Updated today")
3. **Always show quota remaining** when AI features are used
4. **Verification badge is always prominent** — never hidden or small
5. **Mobile: all tap targets minimum 44×44px**
6. **Loading states** for every async action — no blank screens
7. **Every component handles:** loading state, empty state, error state, offline/network error, session expired

---

## Development Workflow

### Git Branching

```
main          → production build (protected)
staging       → staging deployment (protected)
feature/*     → feature branches (from staging)
hotfix/*      → emergency fixes (from main)
```

### Branch Naming

```
feature/FE-1.5-register-page
feature/FE-3.4-admin-review-page
hotfix/FE-otp-keyboard-mobile
```

### Commit Format

```
feat(auth): add OTP verification page
fix(marketplace): correct filter sidebar on mobile
test(listings): add ListingCard component test
style(ui): update badge colours to match brand
```

---

## Documentation Index

| Document | Description |
|---|---|
| [System Analysis](docs/SYSTEM_ANALYSIS.md) | Requirements, constraints, use cases, compliance |
| [Modules](docs/MODULES.md) | Frontend module and component breakdown |
| [Project Structure](docs/PROJECT_STRUCTURE.md) | Directory tree with file descriptions |
| [Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md) | Phase-by-phase sprint plan |
| [Tracker](TRACKER.md) | Living sprint progress tracker |

---

*Market-Link Frontend · WebCortex Technologies Limited · April 2026*
