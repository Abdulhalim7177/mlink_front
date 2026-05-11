# Market-Link — Frontend Implementation Roadmap

> Phase-by-phase, sprint-by-sprint development plan for the frontend.
> 8 months · 16 sprints · Starting April 2026
> WebCortex Technologies Limited · v1.0

---

## Timeline Overview

| Phase | Sprints | Weeks | Dates | Theme | Status |
|---|---|---|---|---|---|
| **1 — Foundation** | S1–S3 | 1–6 | Apr 2 – May 13 | Setup, Auth Pages, Onboarding UI | ✅ Completed |
| **2 — Verification + Admin** | S4–S5 | 7–10 | May 14 – Jun 10 | Admin Dashboard, Verification Queue | ✅ Completed |
| **3 — Basic Plan** | S6–S7 | 11–14 | Jun 11 – Jul 8 | BASIC Marketplace, Market Pulse, Knowledge Hub | ✅ Completed |
| **4 — Pro Listings** | S8–S9 | 15–18 | Jul 9 – Aug 5 | Listing Forms, Search, Inquiry UI | 🚧 In Progress |
| **5 — Messaging** | S10–S11 | 19–22 | Aug 6 – Sep 2 | Messaging UI |
| **6 — Services** | S12–S13 | 23–26 | Sep 3 – Sep 30 | Services Marketplace UI |
| **7 — Payments** | S14 | 27–28 | Oct 1 – Oct 14 | Subscription Page, Paystack Popup |
| **8 — AI + Launch** | S15–S16 | 29–32 | Oct 15 – Nov 25 | AI Features, Testing, Launch |

---

## Phase 1 — Foundation (Sprints 1–3)

### Sprint 1 (Weeks 1–2) — Project Setup & Design System

**Goal:** Next.js project fully configured with design system, core shared components ready.

| ID | Task | Acceptance Criteria |
|---|---|---|
| FE-1.1 | Configure Tailwind CSS with brand colours, fonts, and breakpoints | Design tokens available as CSS variables throughout the app |
| FE-1.2 | Install and configure Shadcn/ui — add Button, Card, Dialog, Input, Select, Table, Toast | Components render correctly with brand styling |
| FE-1.3 | Create app root layout — fonts (Bricolage Grotesque + DM Sans), meta tags, providers | Google Fonts loaded, meta tags present, no styles flash |
| FE-1.4 | Create shared components: VerificationBadge, TierBadge, LoadingSpinner, ErrorBoundary, EmptyState | All components render at 375px, 768px, and 1280px |
| FE-1.5 | Set up Zustand stores: auth.store.ts, ui.store.ts | Stores initialise correctly, persist across navigation |
| FE-1.6 | Create `lib/constants.ts` — commodities, states, sectors, service categories | Constants exported and usable across all components |
| FE-1.7 | Create `lib/types.ts` — TypeScript types matching backend response shapes | All API response types defined and exported |
| FE-1.8 | Set up API client (`lib/api-client.ts`) — Axios with JWT interceptor | Requests to backend include Authorization header when logged in |

**Deliverable:** Project starts with `npm run dev`, shows landing page with brand styling. All shared components render correctly.

---

### Sprint 2 (Weeks 3–4) — Auth Pages

**Goal:** Complete register → OTP → login flow integrated with backend API.

| ID | Task | Acceptance Criteria |
|---|---|---|
| FE-2.1 | Set up NextAuth with credentials provider — JWT callback, session extension | Login/logout flow stores and removes session correctly |
| FE-2.2 | Create auth layout — centred card, Market-Link logo, minimal chrome | Layout renders cleanly at all breakpoints |
| FE-2.3 | Build Register page — email, phone, password, referral code, Zod validation | Form validates, calls API, redirects to OTP page |
| FE-2.4 | Build OTP verification page — 6-box input, countdown timer, resend button | OTP validates, JWT stored in session, redirects to profile |
| FE-2.5 | Build Login page — email/password, NextAuth signIn, redirect based on status | Login works, user redirected to correct page for their status |
| FE-2.6 | Implement middleware.ts — auth guard + verification-status redirects | Unauthenticated → /login; wrong-state → correct onboarding step |
| FE-2.7 | API error handling — display field-level errors from backend validation | Backend 422 errors show on the correct form fields |
| FE-2.8 | Mobile OTP: numeric keypad auto-triggered, large input boxes | OTP inputs are 44×44px minimum, numeric keypad shows on mobile |

**Deliverable:** User can register → receive OTP → enter OTP → land on profile page. Returning user can log in → land on correct page based on verification status.

---

### Sprint 3 (Weeks 5–6) — Onboarding UI

**Goal:** Complete onboarding flow UI — profile, documents, pending review.

| ID | Task | Acceptance Criteria |
|---|---|---|
| FE-3.1 | Build onboarding layout with ProgressStepper (10 steps) | Stepper shows correct active step based on user status |
| FE-3.2 | Build Profile form page — all business fields, Zod validation, API call | All fields render, validation works, API call saves profile |
| FE-3.3 | Build Document upload page — drag+drop desktop, camera mobile | Files selectable, type/size validated, upload progress shown |
| FE-3.4 | Implement S3-ready upload flow: request URL → upload → confirm | Files upload to local backend, confirm call triggers score |
| FE-3.5 | Build upload progress bar component | Shows accurate progress percentage during file upload |
| FE-3.6 | Build Pending Review page — status polling every 30 seconds | Polls API, shows human-readable message for each status |
| FE-3.7 | Implement status-based redirects from pending page | PENDING_PAYMENT → subscription; REJECTED → rejected page; ACTIVE → dashboard |
| FE-3.8 | Build Verification Rejected page — show reason, resubmit CTA | Displays admin rejection reason, "Resubmit Documents" button works |
| FE-3.9 | Mobile responsiveness: all onboarding pages at 375px | No horizontal scroll, all elements usable, large tap targets |

**Deliverable:** Complete onboarding UI: profile → documents → pending → approval/rejection. All pages responsive on mobile.

---

## Phase 2 — Verification + Admin (Sprints 4–5)

### Sprint 4 (Weeks 7–8) — Admin Verification Queue

**Goal:** Admin can review and process the verification queue.

| ID | Task | Acceptance Criteria |
|---|---|---|
| FE-4.1 | Build admin layout — separate sidebar, admin-specific navigation | Admin layout distinct from main app, sidebar has admin links |
| FE-4.2 | Implement admin auth guard — middleware blocks non-admin users | Non-admin users redirected to /dashboard on admin routes |
| FE-4.3 | Build verification queue list page — table, SLA flags, pagination | Table shows business name, sector, state, score, time, SLA indicator |
| FE-4.4 | Build individual review page — profile details, document preview/download | Admin sees full profile, can open/download documents |
| FE-4.5 | Build DocumentPreview component — PDF iframe + image viewer | PDFs render in iframe, images display inline |
| FE-4.6 | Build AdminActionModal — Approve / Reject (reason required) / Request docs | All three actions call correct endpoints, show success toast |
| FE-4.7 | SLA breach visual indicator — red flag on items older than 24 hours | Overdue items visually highlighted in queue |

**Deliverable:** Admin logs in → sees verification queue → opens a review → previews documents → approves or rejects → success confirmation.

### Sprint 5 (Weeks 9–10) — Admin Dashboard & User Management

| ID | Task | Acceptance Criteria |
|---|---|---|
| FE-5.1 | Build admin analytics page — verification funnel chart (Recharts) | Bar chart shows user count at each of 10 states |
| FE-5.2 | Build user management list — filters by tier, status, state, search | User list renders with pagination and filters |
| FE-5.3 | Build user detail page — full profile, action history, suspend/tier buttons | Admin can view complete user data and take actions |
| FE-5.4 | Build UpgradePrompt component — feature-specific messaging, pricing, CTA | Modal shows correct feature name, tier pricing, upgrade button |
| FE-5.5 | Build ToastContainer — success, error, warning, info notifications | Toasts appear and auto-dismiss correctly |

**Deliverable:** Admin has full dashboard with analytics, user management, and action capabilities.

---

## Phase 3 — Basic Plan (Sprints 6–7)

### Sprint 6 (Weeks 11–12) — BASIC Marketplace & Market Pulse

| ID | Task | Acceptance Criteria |
|---|---|---|
| FE-6.1 | Build BASIC marketplace page — BusinessCard grid, FilterPanel, SearchBar | Directory renders, filters work, search debounced |
| FE-6.2 | Build BusinessCard component — name, sector, state, badge, commodities | Card renders correctly, "Contact" triggers UpgradePrompt for BASIC |
| FE-6.3 | Build Market Pulse Basic Plan page — PriceTable with DataLagBanner | Prices displayed with "7 days ago" dates, upgrade banner visible |
| FE-6.4 | Build DataLagBanner — persistent upgrade CTA | Banner clearly says "Last week's prices" with upgrade link |
| FE-6.5 | Build PriceTable component — commodity, state, price, unit, date | Table renders, horizontal scroll on mobile |
| FE-6.6 | Build FilterPanel — desktop sidebar, mobile slide-up drawer | Panel behaviour matches breakpoint correctly |

### Sprint 7 (Weeks 13–14) — Knowledge Hub & Dashboard

| ID | Task | Acceptance Criteria |
|---|---|---|
| FE-7.1 | Build Trade Knowledge Hub — guide cards, category filter, download | Guide cards render, category filter works, PDFs downloadable |
| FE-7.2 | Build main app layout — sidebar (desktop), bottom nav (mobile) | Navigation adapts to breakpoint, all links functional |
| FE-7.3 | Build Dashboard page — role-aware (shows different content for BASIC/Buyer/Seller) | Dashboard renders appropriate widgets based on user tier |
| FE-7.4 | Integrate UpgradePrompt across all BASIC-gated touch points | Every gated action (contact, inquiry, message, AI) shows prompt |
| FE-7.5 | Mobile polish: all Basic Plan pages at 375px | All pages mobile-optimised, no layout breaks |

**Deliverable:** BASIC user can browse marketplace, view lagged prices, download guides, see upgrade prompts on all gated features.

---

## Phase 4 — Pro Listings & Trade (Sprints 8–9)

### Sprint 8 (Weeks 15–16) — Listing Management UI (Seller Focus)

**Goal:** Pro sellers can manage commodity listings; Admin moderates for quality.

| ID | Task | Acceptance Criteria |
|---|---|---|
| FE-8.1 | Build Listing Creation Form — multi-step with photo upload | Validates fields; parallel photo uploads (max 5); API integration |
| FE-8.2 | Build "My Listings" Dashboard — status & action management | Show active/pending/rejected/expired; pause/edit/delete actions |
| FE-8.3 | Build Admin Listing Moderation UI — queue & action modals | Admin review page with photo gallery and approve/reject actions |
| FE-8.4 | Implement Listing Quota UI — "5 Active Listings" enforcement | Prevents new listing creation when limit is reached; shows upgrade prompt |

### Sprint 9 (Weeks 17–18) — Search & Structured Inquiry UI (Buyer Focus)

**Goal:** Advanced discovery and formal trade inquiry flow.

| ID | Task | Acceptance Criteria |
|---|---|---|
| FE-9.1 | Build Advanced Search Interface — full filters & sort | Filter by state, price, commodity, and terms; uses backend full-text search |
| FE-9.2 | Build Structured Inquiry Modal — quantity/unit/delivery fields | Replaces free-text message; validates structured trade fields |
| FE-9.3 | Build Inquiry Quota Display — "N inquiries remaining" | Dynamic counter in header/inquiry modal; color-coded by usage |
| FE-9.4 | Build "My Inquiries" Tracking Page — sent & received tabs | Track status (SENT → VIEWED → RESPONDED) with timeline view |
| FE-9.5 | Verified Badge Visibility — Inject BadgeLevel into Listing/Profile Cards | Seller's badge (1/2/3) prominently displayed on all search results |

---

## Phase 5 — Secure Messaging & Intel (Sprints 10–11)

### Sprint 10 (Weeks 19–20) — Encrypted Messaging UI

**Goal:** Secure, monitored communication for Pro users.

| ID | Task | Acceptance Criteria |
|---|---|---|
| FE-10.1 | Build Messaging Dashboard — ThreadList & MessageThread | Clean UI for exchanging encrypted messages; polling-based updates |
| FE-10.2 | Build PII Detection Alerts — Contact Warning Banner | Visual alert shown in first 3 messages if phone/email patterns detected |
| FE-10.3 | Implement Messaging Unlock Flow — Inquiry-Gated Access | Thread only navigable after a formal inquiry has been sent |

### Sprint 11 (Weeks 21–22) — Live Intelligence UI (Market Pulse Pro)

**Goal:** Real-time data and historical trends for Pro subscribers.

| ID | Task | Acceptance Criteria |
|---|---|---|
| FE-11.1 | Build Market Pulse Pro View — Live Price Table | Removes "7-day lag" banner; shows latest prices with status indicators |
| FE-11.2 | Build Interactive Price History Charts — Recharts integration | Trend analysis charts for commodity/state pairs over time |

---

## Phase 6 — Services (Sprints 12–13)

### Sprint 12 (Weeks 23–24) — Service Listings UI

| ID | Task | Acceptance Criteria |
|---|---|---|
| FE-12.1 | Build service directory page — search by category, state, price | Directory renders with filters |
| FE-12.2 | Build service detail page — provider info, booking CTA | Detail page shows all service info |
| FE-12.3 | Build service listing creation form (for providers) | Form validates and creates service listing |
| FE-12.4 | Build My Profile + TIS score page | TIS breakdown displayed correctly |

### Sprint 13 (Weeks 25–26) — Booking Flow

| ID | Task | Acceptance Criteria |
|---|---|---|
| FE-13.1 | Build booking request flow — select service → confirm → pay | Booking flow completes end-to-end |
| FE-13.2 | Build service provider dashboard — bookings, commission earned | Provider sees all bookings and earnings |
| FE-13.3 | Build booking confirmation page | Confirmation details displayed after payment |

**Deliverable:** Service providers list services. Buyers search, book, and pay. Providers see dashboard with earnings.

---

## Phase 7 — Payments (Sprint 14)

### Sprint 14 (Weeks 27–28) — Subscription Page & Paystack

| ID | Task | Acceptance Criteria |
|---|---|---|
| FE-14.1 | Build subscription page — three tier cards with feature comparison | Cards render clearly, current plan highlighted |
| FE-14.2 | Integrate Paystack.js popup — reference from backend, handle callback | Popup opens, payment processes, callback fires |
| FE-14.3 | Post-payment status polling — poll until MARKETPLACE_ACTIVE | Status polling works, redirects to dashboard on activation |
| FE-14.4 | Build payment confirmation state — new tier badge, welcome message | User sees their new tier and features |
| FE-14.5 | Build Market Pulse Beta enhanced view — live prices, alert form | Beta users see live prices, can set price alerts |

**Deliverable:** User selects tier → pays via Paystack popup → sees new tier → accesses Beta features.

---

## Phase 8 — AI + Launch (Sprints 15–16)

### Sprint 15 (Weeks 29–30) — AI Features UI

| ID | Task | Acceptance Criteria |
|---|---|---|
| FE-15.1 | Build AI matches page — MatchList with MatchCard grid | Matches display with scores and reasoning |
| FE-15.2 | Build MatchCard component — score bar, reasoning, thumbs, intro button | Card renders all elements, interactions work |
| FE-15.3 | Build match refresh button + loading state (10s timeout) | Refresh triggers, loading shows, list updates |
| FE-15.4 | Build AI query interface — input, loading, structured answer | Query submits, answer renders with citations |
| FE-15.5 | Build QuotaMeter — remaining queries display | Quota shown, colour changes at thresholds |
| FE-15.6 | Build UpgradePrompt for BASIC users on AI pages | BASIC users see clear upgrade message |

### Sprint 16 (Weeks 31–32) — Testing & Launch

| ID | Task | Acceptance Criteria |
|---|---|---|
| FE-16.1 | Playwright E2E: full onboarding flow (S1–S10) | Automated test passes consistently |
| FE-16.2 | Playwright E2E: buyer flow (search → inquiry → message) | Automated test passes |
| FE-16.3 | Playwright E2E: admin review flow (queue → approve) | Automated test passes |
| FE-16.4 | Lighthouse audit: all P0 pages on mobile | All pages ≥ 80 performance |
| FE-16.5 | Accessibility audit — all interactive elements labelled | WCAG 2.1 AA compliance |
| FE-16.6 | Bug triage from controlled beta (25 users) | Zero P0 bugs |
| FE-16.7 | Production build + deployment preparation | Build succeeds, env vars documented |

**Deliverable:** All AI features live. E2E tests passing. Lighthouse scores met. Ready for controlled beta.

---

## Sprint Dependencies (Backend → Frontend)

| Frontend Need | Backend Prerequisite | Sprint Alignment |
|---|---|---|
| Auth pages | Auth endpoints live | S2 (parallel development) |
| Onboarding pages | Profile + document endpoints | S3 (parallel development) |
| Admin queue | Admin endpoints live | S4 (parallel development) |
| BASIC marketplace | Directory + Market Pulse endpoints | S6 (parallel development) |
| Listing forms | Listing CRUD endpoints | S8 (backend delivers first half of sprint) |
| Search page | Search endpoint with full-text | S9 (backend delivers mid-sprint) |
| Messaging | Messaging endpoints | S10 (parallel development) |
| Subscription | Payment endpoints | S14 (backend delivers first) |
| AI features | AI endpoints | S15 (backend delivers first) |

> When the backend endpoint is not yet available, the frontend team should build the UI with mocked API responses and integrate when the backend is ready.

---

*Market-Link · Frontend Implementation Roadmap · WebCortex Technologies Limited · v1.0 · April 2026*
