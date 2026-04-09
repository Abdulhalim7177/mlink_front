# Market-Link — Frontend Sprint Tracker

> Living document. Update as each task is started and completed.
> Last updated: April 2, 2026

---

## Sprint Overview

| Sprint | Weeks | Dates | Phase | Theme | Status |
|---|---|---|---|---|---|
| **S1** | 1–2 | Apr 2 – Apr 15 | Phase 1 | Project Setup & Design System | 🔲 Not Started |
| **S2** | 3–4 | Apr 16 – Apr 29 | Phase 1 | Auth Pages | 🔲 Not Started |
| **S3** | 5–6 | Apr 30 – May 13 | Phase 1 | Onboarding UI | 🔲 Not Started |
| **S4** | 7–8 | May 14 – May 27 | Phase 2 | Admin Verification Queue | 🔲 Not Started |
| **S5** | 9–10 | May 28 – Jun 10 | Phase 2 | Admin Dashboard | 🔲 Not Started |
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

- [ ] FE-1.1 — Configure Tailwind with brand colours, fonts, breakpoints
- [ ] FE-1.2 — Install and configure Shadcn/ui components
- [ ] FE-1.3 — Create root layout (fonts, meta tags, providers)
- [ ] FE-1.4 — Build shared components (VerificationBadge, TierBadge, LoadingSpinner, etc.)
- [ ] FE-1.5 — Set up Zustand stores (auth.store, ui.store)
- [ ] FE-1.6 — Create constants (commodities, states, sectors)
- [ ] FE-1.7 — Create TypeScript types matching backend responses
- [ ] FE-1.8 — Set up Axios API client with JWT interceptor

### Sprint Goal
Next.js project fully configured with design system, shared components, and API integration layer ready.

### Sprint Deliverable
Project starts → landing page renders with brand styling → shared components work at all breakpoints → Axios client configured.

---

## Backlog (Next Sprints)

### S2 — Auth Pages
- [ ] FE-2.1 — NextAuth credentials provider setup
- [ ] FE-2.2 — Auth layout (centred card, logo)
- [ ] FE-2.3 — Register page
- [ ] FE-2.4 — OTP verification page
- [ ] FE-2.5 — Login page
- [ ] FE-2.6 — Auth middleware (guards + redirects)
- [ ] FE-2.7 — API error handling (field-level display)
- [ ] FE-2.8 — Mobile OTP (numeric keypad, large inputs)

### S3 — Onboarding UI
- [x] FE-3.1 — Onboarding layout with ProgressStepper
- [x] FE-3.2 — Profile form page
- [x] FE-3.3 — Document upload page (drag+drop / camera)
- [x] FE-3.4 — S3-ready upload flow (request URL → upload → confirm)
- [x] FE-3.5 — Upload progress bar component
- [x] FE-3.6 — Pending review page (banner display implementation)
- [x] FE-3.7 — Status-based redirects
- [ ] FE-3.8 — Verification rejected page
- [x] FE-3.9 — Mobile responsiveness audit

### S4 — Admin Verification Queue
- [ ] FE-4.1 — Admin layout and sidebar
- [ ] FE-4.2 — Admin auth guard
- [ ] FE-4.3 — Queue list page
- [ ] FE-4.4 — Individual review page
- [ ] FE-4.5 — DocumentPreview component
- [ ] FE-4.6 — AdminActionModal
- [ ] FE-4.7 — SLA breach indicator

---

## Velocity Log

| Sprint | Planned | Completed | Carryover | Notes |
|---|---|---|---|---|
| S1 | — | — | — | — |
| S2 | — | — | — | — |
| S3 | — | — | — | — |

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
