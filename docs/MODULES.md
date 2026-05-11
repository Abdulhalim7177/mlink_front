# Market-Link — Frontend Modules

> Page-by-page, component-by-component breakdown of the frontend application.
> WebCortex Technologies Limited · v1.0 · April 2026

---

## Module Index

| # | Module | Route Group | Phase | Sprint | Priority |
|---|---|---|---|---|---|
| FM1 | Authentication Pages | `(auth)` | Phase 1 | S2–S3 | P0 |
| FM2 | Onboarding Flow | `(onboarding)` | Phase 1–2 | S3–S4 | P0 |
| FM3 | Admin Dashboard | `(admin)` | Phase 2–3 | S4–S7 | P0 |
| FM4 | Basic Plan Marketplace | `(app)` | Phase 3 | S6–S7 | P0 |
| FM5 | Pro Listings & Search | `(app)` | Phase 4 | S8–S9 | P0 |
| FM6 | Inquiry Flow | `(app)` | Phase 4 | S9 | P0 |
| FM7 | Secure Messaging UI | `(app)` | Phase 5 | S10–S11 | P0 |
| FM8 | Market Pulse UI | `(app)` | Phase 3 | S6 | P0 |
| FM9 | Subscription & Payment | `(app)` | Phase 7 | S14 | P0 |
| FM10 | Services Marketplace UI | `(app)` | Phase 6 | S12–S13 | P1 |
| FM11 | AI Match Cards | `(app)` | Phase 8 | S15 | P1 |
| FM12 | AI Query Interface | `(app)` | Phase 8 | S16 | P1 |
| FM13 | Shared Components | — | Phase 1 | S1–S2 | P0 |
| FM14 | Zustand Stores | — | Phase 1 | S1 | P0 |

---

## FM1 — Authentication Pages

### Pages
| Route | Page | Description |
|---|---|---|
| `/register` | Register Page | Email + phone + password + optional referral code form |
| `/verify-otp` | OTP Verification Page | 6-box digit input with countdown timer and resend |
| `/login` | Login Page | Email + password login for returning users |

### Key Components
- **RegisterForm** — Form fields with Zod validation, calls `POST /auth/register`, redirects to OTP page
- **OtpForm** — Six individual input boxes with auto-advance, 10-minute countdown timer, resend button appears at 0, shows remaining attempts (max 3), 15-minute lockout display on 3rd failure, auto-triggers numeric keyboard on mobile
- **LoginForm** — Email/password form, NextAuth `signIn`, redirects based on `verificationStatus`

### UX Requirements
- All forms: clear field-level error messages matching backend Zod validation
- OTP page: numeric keypad on mobile (`inputMode="numeric"`)
- Redirect logged-in users away from auth pages to dashboard
- Show loading spinner during API calls — disable submit button

---

## FM2 — Onboarding Flow

### Pages
| Route | Page | Description |
|---|---|---|
| `/onboarding/profile` | Profile Completion | Business profile form (State S3) |
| `/onboarding/documents` | Document Upload | Upload verification documents (State S4) |
| `/onboarding/pending` | Pending Review | Waiting screen with status polling (States S5–S7) |
| `/verification-rejected` | Verification Rejected | Rejection reason + resubmit CTA |

### Key Components
- **ProgressStepper** — 10-step progress indicator showing current state. Steps: Account → Phone → Profile → Documents → Review → Verify → Setup → Subscribe → Badge → Live
- **ProfileForm** — All business fields: name, sector, state, LGA, description, type, years, commodities, CAC number. Zod validation matching backend schema
- **DocumentUpload** — Drag-and-drop on desktop, camera capture on mobile (`capture="environment"`). Supports PDF/JPG/PNG only, max 5MB per file. Upload progress bar. Sequential flow: request upload URL → upload file → confirm upload
- **PendingReview** — Polls `GET /users/me/status` every 30 seconds. Shows human-readable status messages per state. Redirects when status changes: `PENDING_PAYMENT` → subscription page, `REJECTED` → rejection page, `MARKETPLACE_ACTIVE` → dashboard

### Layout
The onboarding route group uses a dedicated layout with the ProgressStepper component at the top. No main app navigation is shown during onboarding — the user must complete verification before seeing the full app.

---

## FM3 — Admin Dashboard

### Pages
| Route | Page | Description |
|---|---|---|
| `/admin/dashboard` | Analytics Overview | Funnel chart, MRR, AI usage stats |
| `/admin/verification-queue` | Verification Queue | Paginated table with SLA flags |
| `/admin/verification-queue/:userId` | Individual Review | Profile details, document preview, approve/reject |
| `/admin/users` | User Management | User list with filters and actions |
| `/admin/users/:userId` | User Detail | Full user profile view |
| `/admin/listings` | Listing Moderation | Pending listings review queue |
| `/admin/market-pulse` | Price Management | Enter and manage commodity prices |

### Key Components
- **VerificationQueueItem** — Table row: business name, sector, state, readiness score, time in queue, SLA breach flag (red indicator if >24 hours)
- **DocumentPreview** — PDF iframe / image viewer for uploaded documents
- **AdminActionModal** — Three-option modal: Approve / Reject (reason required) / Request More Documents. All actions call the appropriate admin endpoint
- **FunnelChart** — Recharts bar chart showing user count at each of the 10 verification states
- **UserDetailPanel** — Complete user profile with all fields, document list, action history

### Layout
Separate admin layout with admin-specific sidebar navigation. Not accessible to non-admin users (middleware redirect + JWT check). Desktop-optimised — admin operations are expected on larger screens.

---

## FM4 — Basic Plan Marketplace

### Pages
| Route | Page | Description |
|---|---|---|
| `/marketplace` | Business Directory | Grid of verified business cards with filters |
| `/marketplace/:id` | Business/Listing Detail | Business profile (contact hidden for BASIC) |
| `/market-pulse` | Commodity Prices | Price table with 7-day lag banner |
| `/knowledge-hub` | Trade Knowledge Hub | Downloadable trade guides |

### Key Components
- **BusinessCard** — Displays: business name, sector, state, verification badge, commodity tags. Contact details hidden for BASIC — "Contact" button triggers UpgradePrompt
- **FilterPanel** — Desktop: sidebar. Mobile: slide-up drawer. Filters: state, sector, commodity, business type. Search bar with debounced input (300ms)
- **UpgradePrompt** — The most important conversion component. Shows: specific feature attempted, what Beta provides, pricing (₦15,000/month for buyer), CTA to subscription page. Must appear on every gated action attempt
- **DataLagBanner** — "You're viewing last week's prices. Beta subscribers see live prices." Persistent and visually prominent
- **PriceTable** — Commodity price grid. Shows commodity, state, price, unit, date. Horizontal scroll on mobile
- **TradeGuideCard** — Guide title, category, description, download button. Soft CTA at bottom: "Find verified partners →"

---

## FM5 — Pro Listings & Search

### Pages
| Route | Page | Description |
|---|---|---|
| `/listings/new` | Create Listing | Multi-field form with photo upload |
| `/listings` | My Listings | Seller's listing management dashboard |
| `/listings/:id/edit` | Edit Listing | Pre-populated form for editing |
| `/marketplace/search` | Buyer Search | Full-text search with all filters |

### Key Components
- **ListingCreateForm** — All fields per API contract. Multi-photo upload (parallel, progress bars per photo, max 5). Zod validation matching backend. Submit → success message: "Your listing is under review"
- **ListingCard** — Verification badge, commodity, price/price-on-request, location, inquiry CTA. View count and inquiry count for seller's own listings
- **SearchBar** — Full-text search input with debounced API calls
- **FilterPanel (extended)** — Commodity, state, price range slider, delivery terms, sort by (relevance/date/price)
- **InquiryQuotaDisplay** — "5 inquiries remaining this month" in buyer header. Colour-coded: green (4-5), yellow (2-3), red (0-1)

---

## FM6 — Inquiry Flow

### Pages
| Route | Page | Description |
|---|---|---|
| `/inquiries` | Inquiries List | Sent and received inquiries with status |

### Key Components
- **InquiryModal** — Dialog for sending inquiry on a listing: quantity, unit, delivery preference, message. Validates against quota before showing
- **InquiryList** — Two tabs: "Sent" and "Received". Each row shows: listing title, counterparty, status, date

---

## FM7 — Secure Messaging UI

### Pages
| Route | Page | Description |
|---|---|---|
| `/messages` | Thread List | All message threads with last message preview |
| `/messages/:userId` | Message Thread | Individual conversation view |

### Key Components
- **ThreadList** — Desktop: left panel. Mobile: full screen. Each thread shows: counterparty name, badge, last message preview, unread count badge, timestamp
- **MessageThread** — Chronological message bubbles (sent right, received left). File attachment button. Send input at bottom
- **MessageBubble** — Message content, timestamp, read indicator. Sent messages on right (primary colour), received on left (surface colour)
- **AttachmentUpload** — File picker for PDF and images, max 10MB
- **ContactWarningBanner** — "Keep negotiations on-platform for your protection." Shown for first 3 messages per thread

### Polling
The message thread polls for new messages every 10 seconds using a client-side interval. The thread list refreshes unread counts on focus.

---

## FM8 — Market Pulse UI

### Components
- **PriceTable** — Commodity price grid. Two modes: BASIC (7-day lag with banner) and Beta (live with "Updated today" badge)
- **PriceCard** — Single commodity: name, state, price, unit, trend indicator (up/down/stable)
- **PriceAlertForm** — Set alert: commodity, state, target price, direction (above/below)
- **DataLagBanner** — Persistent banner for BASIC users with upgrade CTA
- **PriceHistoryChart** — Line chart (Recharts) showing price history over 30/60/90 days (Beta only)

---

## FM9 — Subscription & Payment

### Pages
| Route | Page | Description |
|---|---|---|
| `/subscription` | Tier Selection | Three tier cards with Paystack integration |

### Key Components
- **TierCard** — Shows: tier name, price, feature list, CTA (current plan / upgrade). Three cards side by side (desktop) or stacked (mobile)
- **PaystackPopup** — Integrates Paystack.js popup. Flow: select tier → call backend for reference → open popup → user pays → poll status until `MARKETPLACE_ACTIVE` → redirect to dashboard
- **PaymentSuccessState** — Shows new tier badge, welcome message, redirect countdown

### Tiers Displayed
| Tier | Price | Key Features |
|---|---|---|
| BASIC | ₦0/month | Browse directory, lagged prices, trade guides |
| Active Buyer | ₦15,000/month | 5 inquiries, live prices, AI matches, messaging |
| Pro | ₦100,000/month | 5 listings, AI matches, messaging, analytics |

---

## FM10 — Services Marketplace UI

### Pages
| Route | Page | Description |
|---|---|---|
| `/services` | Service Directory | Search service providers by category |
| `/services/:id` | Service Detail | Provider details + booking CTA |
| `/services/my-services` | My Services | Provider's listing management |

---

## FM11 — AI Match Cards

### Pages
| Route | Page | Description |
|---|---|---|
| `/matches` | AI Matches | Grid of AI-generated match recommendations |

### Key Components
- **MatchCard** — Verification badge, compatibility score bar (0–100), 2-sentence reasoning text, thumbs up/down buttons, "Send Introduction" CTA. Score colour: green (80+), yellow (60–79), grey (<60)
- **MatchList** — Grid of MatchCards with refresh button and "Refreshed X hours ago" timestamp
- **MatchRefreshButton** — Triggers on-demand refresh. Loading state with 10-second timeout. Shows "2 refreshes remaining today"

---

## FM12 — AI Query Interface

### Components
- **AIQueryInput** — Natural language text input: "What is the best time to buy palm oil in Rivers State?" 10-500 character limit. PII detection warning
- **AIQueryResult** — Structured answer display with data point citations and source attribution
- **QuotaMeter** — "4 of 5 AI queries remaining this month." Colour: green (4-5), yellow (2-3), red (0-1). On 0: upgrade prompt for Power Buyer

---

## FM13 — Shared Components

Components used across multiple modules:

| Component | Description |
|---|---|
| **VerificationBadge** | Shows badge level 0–3 with colour and label |
| **TierBadge** | BASIC / BETA / ENTERPRISE text badge |
| **UpgradePrompt** | Modal: specific feature name, Beta pricing, upgrade CTA |
| **EmptyState** | Consistent empty state with icon, message, and action button |
| **LoadingSpinner** | Animated loading indicator |
| **ErrorBoundary** | Catches React errors, shows "Something went wrong" with retry |
| **ToastContainer** | Toast notification system (success, error, warning, info) |
| **SkeletonLoader** | Content placeholder during loading states |

---

## FM14 — Zustand Stores

| Store | Purpose | Key State |
|---|---|---|
| `auth.store.ts` | User session and tier | user, tier, verificationStatus, isAdmin, aiQuotaRemaining |
| `ui.store.ts` | Global UI state | toasts, activeModal, sidebarOpen |
| `market-pulse.store.ts` | Cached price data | prices, lastFetched, isStale |

---

## Error State Requirements

Every page and component must handle these states:

| State | Implementation |
|---|---|
| **Loading** | Skeleton loader or spinner |
| **Empty** | Meaningful message + action CTA |
| **Error** | Clear error message + retry button |
| **Offline / Network** | "Check your connection" banner |
| **Session Expired** | Redirect to login with toast |
| **plan gate** | UpgradePrompt modal (never a blank screen) |

---

*Market-Link · Frontend Modules · WebCortex Technologies Limited · v1.0 · April 2026*
