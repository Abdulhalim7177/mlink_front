// Market-Link — Shared Constants
// Mirrors backend seed data and configuration values.

// ─── Admin Route ───────────────────────────────────────────────────────────────
// Obfuscated admin panel path — change here to rotate the URL.
export const ADMIN_BASE_PATH = '/mlink-ctrl-9x4e';

// ─── 20 MVP Commodities ────────────────────────────────────────────────────────
export const COMMODITIES = [
  'Cocoa',
  'Cashew Nuts',
  'Sesame Seeds',
  'Shea Butter',
  'Palm Oil',
  'Groundnuts',
  'Ginger',
  'Hibiscus (Zobo)',
  'Soybeans',
  'Maize',
  'Sorghum',
  'Rice',
  'Yam',
  'Cassava',
  'Cotton',
  'Rubber',
  'Timber',
  'Charcoal',
  'Fish (Catfish)',
  'Cattle',
] as const;

// ─── 10 Launch States ──────────────────────────────────────────────────────────
export const LAUNCH_STATES = [
  'Lagos',
  'Kano',
  'Abuja',
  'Rivers',
  'Ogun',
  'Kaduna',
  'Oyo',
  'Katsina',
  'Anambra',
  'Delta',
] as const;

// ─── Sectors ───────────────────────────────────────────────────────────────────
export const SECTORS = [
  'Agriculture',
  'Energy',
  'Real Estate',
  'Logistics',
  'Manufacturing',
  'Mining',
  'Technology',
  'Financial Services',
] as const;

// ─── Document Types ────────────────────────────────────────────────────────────
export const DOCUMENT_TYPES: Record<string, string> = {
  CAC_CERTIFICATE: 'CAC Registration Certificate',
  BUSINESS_ID: 'Business Identification Form',
  DIRECTORS_ID: "Director's ID",
  TIN_CERTIFICATE: 'Tax Identification Number (TIN)',
  BANK_STATEMENT: 'Corporate Bank Statement',
  OTHER: 'Other Document',
};

// ─── Verification Status Labels & Colors ───────────────────────────────────────
export const VERIFICATION_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING_OTP:        { label: 'Pending OTP',        color: 'text-amber-700',  bg: 'bg-amber-50' },
  PENDING_PROFILE:    { label: 'Pending Profile',    color: 'text-amber-700',  bg: 'bg-amber-50' },
  PENDING_DOCUMENTS:  { label: 'Pending Documents',  color: 'text-orange-700', bg: 'bg-orange-50' },
  PENDING_SCORE:      { label: 'Scoring',            color: 'text-blue-700',   bg: 'bg-blue-50' },
  PENDING_REVIEW:     { label: 'Under Review',       color: 'text-blue-700',   bg: 'bg-blue-50' },
  REJECTED:           { label: 'Rejected',           color: 'text-red-700',    bg: 'bg-red-50' },
  BADGE_ASSIGNED:     { label: 'Badge Assigned',     color: 'text-purple-700', bg: 'bg-purple-50' },
  PENDING_PAYMENT:    { label: 'Pending Payment',    color: 'text-indigo-700', bg: 'bg-indigo-50' },
  MARKETPLACE_ACTIVE: { label: 'Active',             color: 'text-emerald-700',bg: 'bg-emerald-50' },
  SUSPENDED:          { label: 'Suspended',          color: 'text-red-700',    bg: 'bg-red-50' },
};

// ─── Tier Labels ───────────────────────────────────────────────────────────────
export const TIER_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  FREE:         { label: 'Free Tier',    color: 'text-gray-700',    bg: 'bg-gray-100' },
  BETA_BUYER:   { label: 'Beta Buyer',   color: 'text-blue-700',    bg: 'bg-blue-50' },
  BETA_SELLER:  { label: 'Beta Seller',  color: 'text-emerald-700', bg: 'bg-emerald-50' },
  PREMIUM:      { label: 'Premium',      color: 'text-amber-700',   bg: 'bg-amber-50' },
};

// ─── Document Status Labels ────────────────────────────────────────────────────
export const DOC_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:  { label: 'Pending Review', color: 'text-amber-700',   bg: 'bg-amber-50' },
  APPROVED: { label: 'Approved',       color: 'text-emerald-700', bg: 'bg-emerald-50' },
  REJECTED: { label: 'Rejected',       color: 'text-red-700',     bg: 'bg-red-50' },
};

// ─── Business Types ────────────────────────────────────────────────────────────
export const BUSINESS_TYPES = [
  { value: 'buyer', label: 'Buyer' },
  { value: 'seller', label: 'Seller' },
  { value: 'service_provider', label: 'Service Provider' },
  { value: 'mixed', label: 'Mixed' },
] as const;
