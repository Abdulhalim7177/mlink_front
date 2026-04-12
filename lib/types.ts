// Market-Link — Shared TypeScript Types
// Mirrors backend API response shapes for type-safe frontend integration.

// ─── Enums & Unions ────────────────────────────────────────────────────────────

export type VerificationStatus =
  | 'PENDING_OTP'
  | 'PENDING_PROFILE'
  | 'PENDING_DOCUMENTS'
  | 'PENDING_SCORE'
  | 'PENDING_REVIEW'
  | 'REJECTED'
  | 'BADGE_ASSIGNED'
  | 'PENDING_PAYMENT'
  | 'MARKETPLACE_ACTIVE'
  | 'SUSPENDED';

export type UserTier =
  | 'FREE'
  | 'BETA_BUYER'
  | 'BETA_SELLER'
  | 'PREMIUM';

export type UserRole = 'USER' | 'ADMIN';

export type DocumentType =
  | 'CAC_CERTIFICATE'
  | 'BUSINESS_ID'
  | 'DIRECTORS_ID'
  | 'TIN_CERTIFICATE'
  | 'BANK_STATEMENT'
  | 'OTHER';

export type DocumentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type BusinessType = 'buyer' | 'seller' | 'service_provider' | 'mixed';

// ─── API Envelope ──────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  success: false;
  errors?: Record<string, string>;
}

// ─── Pagination ────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── User & Profile ────────────────────────────────────────────────────────────

export interface Profile {
  id?: string;
  userId?: string;
  firstName: string;
  lastName: string;
  businessName: string;
  sector: string;
  state: string;
  lga?: string;
  businessDescription?: string;
  businessType?: BusinessType;
  yearsInOperation?: number;
  commodities?: string[];
  cacNumber?: string;
  tinNumber?: string;
  bio?: string;
  annualTurnoverRange?: string;
  employeeCount?: string;
  website?: string;
  matchTags?: string[];
  tierEligibility?: string[];
  bvnEncrypted?: string;
  ninEncrypted?: string;
}

export interface User {
  id: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  tier: UserTier;
  badgeLevel?: number;
  readinessScore?: number;
  referralCode?: string;
  createdAt?: string;
  profile?: Profile | null;
}

// ─── Documents ─────────────────────────────────────────────────────────────────

export interface UserDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: DocumentStatus;
  s3Bucket?: string;
  uploadedAt?: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  rejectionReason?: string | null;
  viewUrl?: string;
}

// ─── Admin Queue ───────────────────────────────────────────────────────────────

export interface AdminQueueItem {
  id: string;
  email: string;
  createdAt: string;
  verificationStatus: VerificationStatus;
  profile: Pick<Profile, 'firstName' | 'lastName' | 'businessName' | 'sector'> | null;
  documents: Pick<UserDocument, 'id' | 'type' | 'fileName' | 'fileSize' | 'mimeType'>[];
  url: string;
  timeInQueue: string;
  isSLABreached: boolean;
}

export interface AdminQueueResponse {
  data: AdminQueueItem[];
  meta: PaginationMeta;
}

// ─── Admin User Detail ─────────────────────────────────────────────────────────

export interface AdminUserDetail {
  id: string;
  email: string;
  createdAt: string;
  verificationStatus: VerificationStatus;
  profile: Profile | null;
  documents: UserDocument[];
}

// ─── Admin User List ───────────────────────────────────────────────────────────

export interface AdminUserListItem {
  id: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  tier: UserTier;
  createdAt: string;
  profile: Profile | null;
  documents: Pick<UserDocument, 'id' | 'type' | 'status'>[];
}

export interface AdminUserListResponse {
  success: boolean;
  data: AdminUserListItem[];
  pagination: PaginationMeta;
}

// ─── Admin Analytics ───────────────────────────────────────────────────────────

export interface AnalyticsFunnelResponse {
  totalUsers: number;
  breakdown: Record<string, number>;
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterResponse {
  id: string;
  email: string;
  verificationStatus: VerificationStatus;
}

export interface VerifyOtpResponse {
  accessToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// ─── Decoupled Admin System ────────────────────────────────────────────────────

export type AdminDepartment =
  | 'SUPER_ADMIN'
  | 'VERIFICATION'
  | 'CUSTOMER_SERVICE'
  | 'FINANCE'
  | 'ANALYTICS';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  department: AdminDepartment;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  admin: AdminUser;
}
