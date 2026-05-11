# Market-Link — Frontend Project Structure

> Directory tree with descriptions of every folder and key file.
> WebCortex Technologies Limited · v1.0 · April 2026

---

## Root Directory

```
mlink_front/
│
├── app/                              # Next.js 16 App Router
│   │
│   ├── (auth)/                       # Auth routes — minimal layout, no app navigation
│   │   ├── layout.tsx                # Auth layout: centred card, brand logo
│   │   ├── register/
│   │   │   └── page.tsx              # Registration form (S1)
│   │   ├── verify-otp/
│   │   │   └── page.tsx              # 6-digit OTP input (S2)
│   │   └── login/
│   │       └── page.tsx              # Email/password login
│   │
│   ├── (onboarding)/                 # Verification flow — ProgressStepper layout
│   │   ├── layout.tsx                # Stepper layout with 10-step indicator
│   │   ├── profile/
│   │   │   └── page.tsx              # Business profile form (S3)
│   │   ├── documents/
│   │   │   └── page.tsx              # Document upload page (S4)
│   │   ├── pending/
│   │   │   └── page.tsx              # Waiting screen with polling (S5–S7)
│   │   └── rejected/
│   │       └── page.tsx              # Rejection reason + resubmit CTA
│   │
│   ├── (app)/                        # Main app — full navigation layout
│   │   ├── layout.tsx                # Sidebar (desktop) + bottom nav (mobile)
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Role-aware dashboard (BASIC/Buyer/Seller)
│   │   │
│   │   ├── marketplace/
│   │   │   ├── page.tsx              # Business directory (BASIC + Beta)
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # Business/listing detail
│   │   │   └── search/
│   │   │       └── page.tsx          # Full search + filters (Beta only)
│   │   │
│   │   ├── listings/                 # Pro only
│   │   │   ├── page.tsx              # My listings management
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Create new listing
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx      # Edit existing listing
│   │   │
│   │   ├── inquiries/
│   │   │   └── page.tsx              # Sent + received inquiries (Beta)
│   │   │
│   │   ├── messages/                 # Beta only
│   │   │   ├── page.tsx              # Thread list
│   │   │   └── [userId]/
│   │   │       └── page.tsx          # Individual message thread
│   │   │
│   │   ├── market-pulse/
│   │   │   └── page.tsx              # Commodity prices (BASIC: lagged, Beta: live)
│   │   │
│   │   ├── matches/
│   │   │   └── page.tsx              # AI match recommendations (Beta)
│   │   │
│   │   ├── services/                 # Beta
│   │   │   ├── page.tsx              # Service provider directory
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # Service detail + book
│   │   │   └── my-services/
│   │   │       └── page.tsx          # Provider's listings
│   │   │
│   │   ├── knowledge-hub/
│   │   │   └── page.tsx              # Trade guides library (BASIC)
│   │   │
│   │   ├── subscription/
│   │   │   └── page.tsx              # Tier selection + Paystack payment
│   │   │
│   │   └── profile/
│   │       └── page.tsx              # My profile + TIS score (Beta)
│   │
│   ├── (admin)/                      # Admin panel — separate layout
│   │   ├── layout.tsx                # Admin sidebar, desktop-optimised
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Analytics overview
│   │   ├── verification-queue/
│   │   │   ├── page.tsx              # Queue list
│   │   │   └── [userId]/
│   │   │       └── page.tsx          # Individual user review
│   │   ├── users/
│   │   │   ├── page.tsx              # User management list
│   │   │   └── [userId]/
│   │   │       └── page.tsx          # User detail
│   │   ├── listings/
│   │   │   └── page.tsx              # Listing moderation queue
│   │   └── market-pulse/
│   │       └── page.tsx              # Price data entry + health
│   │
│   ├── api/                          # Next.js API routes (thin proxy only)
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts          # NextAuth handler
│   │
│   ├── layout.tsx                    # Root layout: fonts, metadata, providers
│   ├── page.tsx                      # Landing page (redirects to /login or /dashboard)
│   ├── globals.css                   # Global styles, Tailwind imports, CSS variables
│   ├── favicon.ico                   # Site favicon
│   └── not-found.tsx                 # Custom 404 page
│
├── components/                       # All reusable UI components
│   │
│   ├── ui/                           # Shadcn/ui base components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── toast.tsx
│   │   ├── tabs.tsx
│   │   └── ...                       # Other Shadcn components as needed
│   │
│   ├── shared/                       # Cross-feature components
│   │   ├── VerificationBadge.tsx     # Badge level 0–3 display
│   │   ├── TierBadge.tsx             # BASIC / BETA / ENTERPRISE label
│   │   ├── UpgradePrompt.tsx         # Upgrade CTA modal (most important conversion component)
│   │   ├── EmptyState.tsx            # Consistent "no data" display
│   │   ├── LoadingSpinner.tsx        # Animated loader
│   │   ├── ErrorBoundary.tsx         # React error catch + retry
│   │   ├── ToastContainer.tsx        # Notification toast system
│   │   └── SkeletonLoader.tsx        # Content placeholder during load
│   │
│   ├── onboarding/                   # Verification flow components
│   │   ├── ProgressStepper.tsx       # 10-step progress indicator
│   │   ├── RegisterForm.tsx
│   │   ├── OtpForm.tsx               # 6-box input with countdown
│   │   ├── ProfileForm.tsx           # Business profile form
│   │   ├── DocumentUpload.tsx        # Drag+drop / camera capture
│   │   └── PendingReview.tsx         # Polling status display
│   │
│   ├── marketplace/                  # Listing and directory components
│   │   ├── BusinessCard.tsx          # Verified business card
│   │   ├── ListingCard.tsx           # Commodity listing card
│   │   ├── SearchBar.tsx             # Debounced search input
│   │   ├── FilterPanel.tsx           # Desktop sidebar / mobile drawer
│   │   ├── ListingCreateForm.tsx     # Full listing creation form
│   │   └── InquiryModal.tsx          # Send inquiry dialog
│   │
│   ├── messaging/                    # Chat components
│   │   ├── ThreadList.tsx            # All conversations list
│   │   ├── MessageThread.tsx         # Single conversation view
│   │   ├── MessageBubble.tsx         # Individual message bubble
│   │   ├── AttachmentUpload.tsx      # File attachment picker
│   │   └── ContactWarningBanner.tsx  # "Stay on-platform" warning
│   │
│   ├── ai/                           # AI feature components
│   │   ├── MatchCard.tsx             # AI match with score + reasoning
│   │   ├── MatchList.tsx             # Grid of match cards
│   │   ├── AIQueryInput.tsx          # Natural language query input
│   │   ├── AIQueryResult.tsx         # Structured AI answer display
│   │   └── QuotaMeter.tsx            # Remaining queries visual
│   │
│   ├── market-pulse/                 # Price intelligence components
│   │   ├── PriceTable.tsx            # Commodity price grid
│   │   ├── PriceCard.tsx             # Single commodity price display
│   │   ├── PriceAlertForm.tsx        # Set price alert form
│   │   ├── PriceHistoryChart.tsx     # Line chart for price trends
│   │   └── DataLagBanner.tsx         # "Last week's prices" upgrade banner
│   │
│   └── admin/                        # Admin-specific components
│       ├── VerificationQueueItem.tsx  # Queue row with SLA flag
│       ├── DocumentPreview.tsx        # PDF/image document viewer
│       ├── AdminActionModal.tsx       # Approve/reject/request docs
│       ├── FunnelChart.tsx            # Verification funnel (Recharts)
│       └── UserDetailPanel.tsx        # Full user detail view
│
├── lib/                              # Shared utilities and configuration
│   ├── api-client.ts                 # Axios instance with JWT and error interceptors
│   ├── auth.ts                       # NextAuth configuration (credentials provider)
│   ├── types.ts                      # TypeScript types matching backend response shapes
│   ├── validators.ts                 # Zod schemas matching backend validation
│   ├── utils.ts                      # Formatting: currency (NGN), dates, phone numbers
│   └── constants.ts                  # Commodities list, states list, sectors, categories
│
├── store/                            # Zustand state management
│   ├── auth.store.ts                 # User session, tier, verification status
│   ├── ui.store.ts                   # Global UI: toasts, modals, sidebar
│   └── market-pulse.store.ts         # Cached commodity prices
│
├── hooks/                            # Custom React hooks
│   ├── useAuth.ts                    # Auth state and session helpers
│   ├── useApi.ts                     # SWR/fetch wrapper with error handling
│   └── useMediaQuery.ts             # Responsive breakpoint detection
│
├── public/                           # Static assets (served directly)
│   ├── logo.svg                      # Market-Link logo
│   ├── icons/                        # App icons, favicons
│   └── guides/                       # Trade guide PDFs (Basic Plan downloads)
│
├── tests/                            # Test files
│   ├── unit/                         # Component unit tests (Vitest)
│   │   ├── components/
│   │   ├── lib/
│   │   └── store/
│   ├── integration/                  # Integration tests (Testing Library)
│   │   ├── onboarding-flow.test.tsx
│   │   ├── listing-creation.test.tsx
│   │   └── ai-query.test.tsx
│   └── e2e/                          # End-to-end tests (Playwright)
│       ├── full-onboarding.spec.ts
│       ├── BASIC-tier-browse.spec.ts
│       ├── beta-buyer-flow.spec.ts
│       └── admin-review.spec.ts
│
├── middleware.ts                     # Next.js middleware: auth guard, admin gate, state redirects
│
├── .env.local                        # Local environment variables (gitignored)
├── .env.example                      # Template for environment variables
├── .gitignore                        # Git ignore rules
├── eslint.config.mjs                 # ESLint configuration
├── next.config.ts                    # Next.js configuration
├── postcss.config.mjs                # PostCSS configuration (Tailwind)
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
├── package-lock.json                 # Dependency lock file
├── README.md                         # Project overview and setup guide
├── TRACKER.md                        # Living sprint progress tracker
│
└── docs/                             # Technical documentation
    ├── SYSTEM_ANALYSIS.md            # Requirements, constraints, use cases
    ├── MODULES.md                    # Frontend module breakdown
    ├── PROJECT_STRUCTURE.md          # This file
    └── IMPLEMENTATION_ROADMAP.md     # Phase/sprint development plan
```

---

## Key Architectural Patterns

### Route Groups & Layouts

Next.js 16 route groups define four distinct layout contexts:

| Group | Layout | Purpose | Auth |
|---|---|---|---|
| `(auth)` | Minimal — centred card, logo | Registration, OTP, login | Redirect to dashboard if already authenticated |
| `(onboarding)` | ProgressStepper layout | Verification flow (S1–S10) | Require auth, redirect if S10 complete |
| `(app)` | Full navigation — sidebar + topbar | Main marketplace experience | Require auth + state-aware gating |
| `(admin)` | Admin sidebar layout | Platform administration | Require auth + isAdmin |

### Component Organisation

Components are organised by **feature domain**, not by component type:
- `components/onboarding/` — all onboarding-related components
- `components/marketplace/` — all listing and directory components
- `components/messaging/` — all messaging-related components
- `components/shared/` — components used across multiple domains

### Data Fetching Strategy

| Data Type | Strategy | Example |
|---|---|---|
| SEO-important, rarely changing | Server Components | Trade guides, public profiles |
| Live data needing revalidation | SWR with refresh intervals | Prices, matches, messages |
| Interactive user actions | Client Components with mutation | Forms, send message, thumbs up |

### Adding a New Page

1. Create the page in the appropriate route group under `app/`
2. Create any necessary components in the appropriate `components/` subdirectory
3. Add API types to `lib/types.ts`
4. Add validation schemas to `lib/validators.ts`
5. Update navigation in the layout component
6. Write tests in `tests/`

### File Naming Convention

| Type | Convention | Example |
|---|---|---|
| Pages | `page.tsx` (Next.js convention) | `app/(app)/dashboard/page.tsx` |
| Layouts | `layout.tsx` | `app/(app)/layout.tsx` |
| Components | PascalCase | `BusinessCard.tsx` |
| Utilities | camelCase | `api-client.ts` |
| Stores | `{name}.store.ts` | `auth.store.ts` |
| Hooks | `use{Name}.ts` | `useAuth.ts` |
| Types | `types.ts` | `lib/types.ts` |

---

*Market-Link · Frontend Project Structure · WebCortex Technologies Limited · v1.0 · April 2026*
