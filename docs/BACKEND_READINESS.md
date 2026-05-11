# Market-Link — Backend Readiness Checklist

> **For Frontend Team Use Only**
> This document defines what the frontend needs from the backend before each sprint can proceed.
> Each section lists the success criteria that the backend must meet and how to verify them.
> WebCortex Technologies Limited · v1.0 · April 2026

---

## How to Use This Document

Before starting a sprint's API integration work:
1. Find your current sprint below
2. Check each **success metric** against the backend
3. Run the **verification test** to confirm readiness
4. If any metric fails, mark it as 🔴 and build with **mocked data** (see Mocking Guide at bottom)
5. Log the blocker in your `TRACKER.md`

---

## Sprint 1 — No Backend Dependencies

Frontend Sprint 1 is fully independent. Focus on project setup, design system, and shared components.

**Backend readiness required:** None.

---

## Sprint 2 — Authentication Endpoints

### What Frontend Needs

The frontend auth pages (Register, OTP, Login) require these backend endpoints to be functional.

### Success Metrics

| # | Metric | How to Verify | Pass/Fail |
|---|---|---|---|
| SM-2.1 | Backend server starts and responds on configured port | `curl http://localhost:5000/api/v1/health` returns `{ "success": true }` | 🔲 |
| SM-2.2 | Register endpoint creates user and sends OTP email | Send `POST /auth/register` with valid data → 201 response + OTP email received | 🔲 |
| SM-2.3 | OTP verification issues JWT | Send `POST /auth/verify-otp` with correct OTP → response contains `accessToken` and `refreshToken` | 🔲 |
| SM-2.4 | Login returns JWT with user status | Send `POST /auth/login` → response contains `accessToken`, `verificationStatus`, `tier` | 🔲 |
| SM-2.5 | JWT is valid for protected routes | Send `GET /users/me/status` with Bearer token → 200 with user data | 🔲 |
| SM-2.6 | Invalid credentials return proper error | Wrong password → `{ "success": false, "error": { "code": "UNAUTHENTICATED" } }` | 🔲 |
| SM-2.7 | Validation errors return field-level detail | Missing email → `{ "error": { "code": "VALIDATION_ERROR", "field": "email" } }` | 🔲 |
| SM-2.8 | Token refresh works | Send `POST /auth/refresh` with valid refresh token → new access token | 🔲 |

### Verification Script

```bash
# Quick verification sequence — run from terminal
API=http://localhost:5000/api/v1

# 1. Health check
curl -s $API/health | jq .success
# Expected: true

# 2. Register
curl -s -X POST $API/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","phoneNumber":"+2348012345678","password":"Test1234!"}' | jq .

# 3. Verify OTP (use OTP from email/console)
curl -s -X POST $API/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"userId":"<userId>","otpCode":"<otp>"}' | jq .

# 4. Login
curl -s -X POST $API/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234!"}' | jq .
```

---

## Sprint 3 — Profile & Document Upload

### What Frontend Needs

Profile form submission, file upload flow, and status transitions must work.

### Success Metrics

| # | Metric | How to Verify | Pass/Fail |
|---|---|---|---|
| SM-3.1 | Profile submission changes status | `POST /users/profile` with valid data → status becomes `PENDING_DOCUMENTS` | 🔲 |
| SM-3.2 | Profile validation returns field errors | Missing `businessName` → 422 with `"field": "businessName"` | 🔲 |
| SM-3.3 | Document upload URL is generated | `POST /users/documents` → returns `uploadUrl` and `documentId` | 🔲 |
| SM-3.4 | File upload to URL works | PUT file to `uploadUrl` → 200 | 🔲 |
| SM-3.5 | Upload confirmation triggers score | `PUT /users/documents/:id/confirm` → readiness score calculated | 🔲 |
| SM-3.6 | User status progresses to PENDING_REVIEW | After confirm → `GET /users/me/status` shows `PENDING_REVIEW` | 🔲 |
| SM-3.7 | Commodities list from seed data matches constants | API response commodity options match `lib/constants.ts` | 🔲 |

---

## Sprint 4 — Admin Queue

### What Frontend Needs

Full admin authentication and verification queue management.

### Success Metrics

| # | Metric | How to Verify | Pass/Fail |
|---|---|---|---|
| SM-4.1 | Admin JWT contains `isAdmin: true` | Login as admin → decode JWT → `isAdmin` field present and true | 🔲 |
| SM-4.2 | Non-admin gets 403 on admin routes | Login as regular user → `GET /admin/queue` → 403 | 🔲 |
| SM-4.3 | Queue returns paginated results | `GET /admin/queue?page=1&limit=10` → returns items with pagination meta | 🔲 |
| SM-4.4 | Queue items include SLA breach flag | Items older than 24 hours have `slaBreached: true` | 🔲 |
| SM-4.5 | User review returns full profile + doc URLs | `GET /admin/users/:id` → profile data + downloadable document URLs | 🔲 |
| SM-4.6 | Document URLs are accessible | Download URL from SM-4.5 → file downloads correctly | 🔲 |
| SM-4.7 | Approve triggers full pipeline (BASIC path) | `POST /admin/queue/:id/approve` → user status reaches `MARKETPLACE_ACTIVE` | 🔲 |
| SM-4.8 | Reject sends email with reason | `POST /admin/queue/:id/reject` → user receives email with rejection reason | 🔲 |

---

## Sprint 6 — Market Pulse & Directory

### Success Metrics

| # | Metric | How to Verify | Pass/Fail |
|---|---|---|---|
| SM-6.1 | BASIC user sees lagged prices | `GET /market-pulse/prices` as BASIC user → prices ≥ 7 days old | 🔲 |
| SM-6.2 | Beta user sees current prices | `GET /market-pulse/prices` as Beta user → prices from today/yesterday | 🔲 |
| SM-6.3 | Directory hides contact for BASIC | `GET /users/:id/profile` as BASIC → no `email`, `phone` in response | 🔲 |
| SM-6.4 | plan gate returns upgrade info | BASIC user hits gated endpoint → 403 with `code: "PLAN_UPGRADE_REQUIRED"` + pricing data | 🔲 |
| SM-6.5 | At least 3 commodity/state pairs have price data | Prices exist for testing (admin seeded or manually entered) | 🔲 |

---

## Sprint 8 — Listing CRUD

### Success Metrics

| # | Metric | How to Verify | Pass/Fail |
|---|---|---|---|
| SM-8.1 | Listing creation returns listing ID | `POST /listings` as Pro → 201 with `listingId` | 🔲 |
| SM-8.2 | Listing limits enforced (5 active) | Create 6th listing → 400/403 with limit error | 🔲 |
| SM-8.3 | Photo upload works on listings | Upload photo → reference stored on listing | 🔲 |
| SM-8.4 | Admin can approve listing | `POST /admin/listings/:id/approve` → listing status = LIVE | 🔲 |
| SM-8.5 | My listings returns seller's data | `GET /listings/mine` → seller's listings with stats | 🔲 |

---

## Sprint 9 — Search & Inquiries

### Success Metrics

| # | Metric | How to Verify | Pass/Fail |
|---|---|---|---|
| SM-9.1 | Full-text search returns results | `GET /listings/search?q=sesame` → matching listings | 🔲 |
| SM-9.2 | Filters narrow results | `?commodity=sesame&state=Kano` → filtered results | 🔲 |
| SM-9.3 | Inquiry creation respects quota | 6th inquiry as Active Buyer → 429 `QUOTA_EXCEEDED` | 🔲 |
| SM-9.4 | Inquiry response includes remaining quota | Response meta includes `quotaRemaining` field | 🔲 |
| SM-9.5 | Seller receives inquiry notification | Inquiry created → seller gets email | 🔲 |

---

## Sprint 10 — Core Messaging

### Success Metrics

| # | Metric | How to Verify | Pass/Fail |
|---|---|---|---|
| SM-10.1 | Message stored encrypted | Check DB directly — `contentEncrypted` is not plaintext | 🔲 |
| SM-10.2 | Message returned decrypted | `GET /messages/thread/:userId` → readable message content | 🔲 |
| SM-10.3 | Thread list has accurate unread count | Send 3 messages → recipient's thread list shows `unreadCount: 3` | 🔲 |
| SM-10.4 | File attachments work | Send message with attachment → attachment downloadable | 🔲 |

---

## Sprint 14 — Payments

### Success Metrics

| # | Metric | How to Verify | Pass/Fail |
|---|---|---|---|
| SM-14.1 | Paystack reference generated | `POST /payments/subscription` → returns `reference` and `authorizationUrl` | 🔲 |
| SM-14.2 | Test payment processes via webhook | Paystack test payment → webhook fires → tier updated | 🔲 |
| SM-14.3 | User tier updates within 30 seconds | After webhook → `GET /users/me/status` shows new tier | 🔲 |
| SM-14.4 | Badge assigned correctly | Tier + readiness score → correct badge level | 🔲 |

---

## Sprint 15 — AI Features

### Success Metrics

| # | Metric | How to Verify | Pass/Fail |
|---|---|---|---|
| SM-15.1 | Matches returned with scores | `GET /ai/matches` → list of matches with `compatibilityScore` and `reasoning` | 🔲 |
| SM-15.2 | Refresh generates new matches | `POST /ai/matches/refresh` → new matches stored | 🔲 |
| SM-15.3 | Refresh limit enforced | 3rd refresh in one day → 429 | 🔲 |
| SM-15.4 | Feedback stored | `PUT /ai/matches/:id/feedback` → `thumbsUp` field updated | 🔲 |
| SM-15.5 | Quota tracked per billing cycle | Query count increments correctly | 🔲 |

---

## Mocking Guide

When a backend endpoint is not yet ready, the frontend should build against mocked responses. This approach avoids blocking frontend progress while maintaining correct data shapes.

### Mock Strategy

1. Create a `lib/mocks/` directory
2. Each mock file exports functions matching the API client interface
3. Use environment variable to toggle: `NEXT_PUBLIC_USE_MOCKS=true`
4. All mock data must match the **exact** response shape from `docs/API_CONTRACT.md`

### Example Mock Structure

```
lib/mocks/
├── auth.mock.ts          # Mock register, login, OTP responses
├── listings.mock.ts      # Mock listing data
├── messages.mock.ts      # Mock thread/message data
└── index.ts              # Mock toggle logic
```

### Rules
- Mock data must use realistic Nigerian business names, states, and commodities
- Mock IDs must be valid UUIDs
- Mock dates must be within realistic ranges
- Remove mocks before production — `NEXT_PUBLIC_USE_MOCKS` must never be `true` in production

---

*Market-Link · Backend Readiness Checklist · WebCortex Technologies Limited · April 2026*
