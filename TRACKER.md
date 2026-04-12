# Market-Link — Frontend Sprint Tracker

> Living document. Update as each task is started and completed.
> Last updated: April 12, 2026

---

## Sprint Overview

| Sprint | Weeks | Dates | Phase | Theme | Status |
|---|---|---|---|---|---|
| **S1** | 1–2 | Apr 2 – Apr 15 | Phase 1 | Project Setup & Design System | 🟡 In Progress |
| **S2** | 3–4 | Apr 16 – Apr 29 | Phase 1 | Auth Pages | ✅ Completed |
| **S3** | 5–6 | Apr 30 – May 13 | Phase 1 | Onboarding UI | ✅ Completed |
| **S4** | 7–8 | May 14 – May 27 | Phase 2 | Admin Verification Queue | ✅ Completed |
| **S5** | 9–10 | May 28 – Jun 10 | Phase 2 | Admin Dashboard | ✅ Completed |
| **S6** | 11–12 | Jun 11 – Jun 24 | Phase 3 | Free Marketplace & Market Pulse | 🔲 Not Started |
| **S7** | 13–14 | Jun 25 – Jul 8 | Phase 3 | Knowledge Hub & Dashboard | 🔲 Not Started |
| **S8** | 15–16 | Jul 9 – Jul 22 | Phase 4 | Listing Forms & Management | 🔲 Not Started |
| **S9** | 17–18 | Jul 23 – Aug 5 | Phase 4 | Search & Inquiry UI | 🔲 Not Started |
| **S10** | 19–20 | Aug 6 – Aug 19 | Phase 5 | Core Messaging UI | 🔲 Not Started |
| **S11** | 21–22 | Aug 20 – Sep 2 | Phase 5 | Messaging Polish | 🔲 Not Started |
| **S12** | 23–24 | Sep 3 – Sep 16 | Phase 6 | Service Listings UI | 🔲 Not Started |
| **S13** | 25–26 | Sep 17 – Sep 30 | Phase 6 | Booking Flow | 🔲 Not Started |
| **S14** | 27–28 | Oct 1 – Oct 14 | Phase 7 | Subscription & Paystack | 🔲 Not Started |
| **S15** | 29–30 | Oct 15 – Oct 28 | Phase 8 | AI Features UI | 🔲 Not Started |
| **S16** | 31–32 | Oct 29 – Nov 25 | Phase 8 | Testing & Launch | 🔲 Not Started |

---

## Current Sprint: S1 — Project Setup & Design System

### Tasks

- [x] FE-1.1 — Configure Tailwind with brand colours, fonts, breakpoints
- [ ] FE-1.2 — Install and configure Shadcn/ui components
- [x] FE-1.3 — Create root layout (fonts, meta tags, providers)
- [ ] FE-1.4 — Build shared components (VerificationBadge, TierBadge, LoadingSpinner, etc.)
- [x] FE-1.5 — Set up Zustand stores (auth.store, ui.store)
- [x] FE-1.6 — Create constants (commodities, states, sectors)
- [x] FE-1.7 — Create TypeScript types matching backend responses
- [x] FE-1.8 — Set up Axios API client with JWT interceptor

### Sprint Goal
Next.js project fully configured with design system, shared components, and API integration layer ready.

### Sprint Deliverable
Project starts → landing page renders with brand styling → shared components work at all breakpoints → Axios client configured.

---

## Backlog (Next Sprints)

### S2 — Auth Pages
- [ ] FE-2.1 — NextAuth credentials provider setup
- [x] FE-2.2 — Auth layout (centred card, logo)
- [x] FE-2.3 — Register page
- [x] FE-2.4 — OTP verification page
- [x] FE-2.5 — Login page
- [x] FE-2.6 — Auth middleware (guards + redirects)
- [x] FE-2.7 — API error handling (field-level display)
- [ ] FE-2.8 — Mobile OTP (numeric keypad, large inputs)

### S3 — Onboarding UI
- [x] FE-3.1 — Onboarding layout with ProgressStepper
- [x] FE-3.2 — Profile form page
- [x] FE-3.3 — Document upload page (drag+drop / camera)
- [x] FE-3.4 — S3-ready upload flow (request URL → upload → confirm)
- [x] FE-3.5 — Upload progress bar component
- [x] FE-3.6 — Pending review page (banner display implementation)
- [x] FE-3.7 — Status-based redirects
- [x] FE-3.8 — Verification rejected page
- [x] FE-3.9 — Mobile responsiveness audit

### S4 — Admin Verification Queue
- [x] FE-4.1 — Admin layout and sidebar
- [x] FE-4.2 — Admin auth guard
- [x] FE-4.3 — Queue list page
- [x] FE-4.4 — Individual review page
- [x] FE-4.5 — DocumentPreview component
- [x] FE-4.6 — AdminActionModal
- [x] FE-4.7 — SLA breach indicator

### S5 — Admin Dashboard
- [x] FE-5.1 — Analytics funnel chart page
- [x] FE-5.2 — User management page (paginated table, search)
- [x] FE-5.3 — Suspend/unsuspend user actions
- [x] FE-5.4 — Dashboard status banners (REJECTED, SUSPENDED, BADGE_ASSIGNED)
- [x] FE-5.5 — Admin shortcut banner on user dashboard

### S5.5 — Admin System Decoupling (MAJOR)
- [/] FE-5.5.1 — Admin login page at `/mlink-ctrl-9x4e/login` (dark themed, separate from user login)
- [/] FE-5.5.2 — `admin-auth.store.ts` (separate Zustand store in `admin-auth-storage`)
- [/] FE-5.5.3 — `admin-api.ts` (separate Axios instance with admin token + refresh interceptor)
- [/] FE-5.5.4 — Update admin layout to use `useAdminAuthStore`, redirect to admin login
- [/] FE-5.5.5 — Update AdminSidebar with department-based nav items
- [/] FE-5.5.6 — Department-based landing pages after login
- [/] FE-5.5.7 — Admin Management page (SUPER_ADMIN: create/edit/deactivate admins)
- [/] FE-5.5.8 — Update all admin pages to use `adminApi`
- [/] FE-5.5.9 — Remove admin banner from user dashboard
- [/] FE-5.5.10 — Update `lib/types.ts` with AdminDepartment, AdminUser types

---

## Velocity Log

| Sprint | Planned | Completed | Carryover | Notes |
|---|---|---|---|---|
| S1 | 8 | 6 | 2 | FE-1.2 (Shadcn), FE-1.4 (shared components) deferred |
| S2 | 8 | 6 | 2 | FE-2.1 (NextAuth), FE-2.8 (mobile OTP) deferred |
| S3 | 9 | 9 | 0 | All onboarding UI complete including FE-3.8 rejected page |
| S4 | 7 | 7 | 0 | Full admin verification queue |
| S5 | 5 | 5 | 0 | Analytics, user management, dashboard banners |
| S5.5 | 10 | 0 | 10 | Admin system decoupling — in progress |

---

## Blockers

| Date | Blocker | Impact | Resolution | Status |
|---|---|---|---|---|
| — | — | — | — | — |

---

## Notes

- Update this file at the start and end of every sprint
- Mark tasks as `[x]` when complete, `[/]` when in progress
- Track any backend API dependency delays in the Blockers section
- When a backend endpoint isn't ready, build UI with mocked data and note it

---

*Market-Link · Frontend Sprint Tracker · WebCortex Technologies Limited · April 2026*
