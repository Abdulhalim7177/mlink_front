"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import { ADMIN_BASE_PATH, DOCUMENT_TYPES, DOC_STATUS_CONFIG } from '../../../../lib/constants';
import type { AdminUserDetail, UserDocument } from '../../../../lib/types';
import AdminActionModal from '../../../../components/admin/AdminActionModal';
import DocumentPreview from '../../../../components/admin/DocumentPreview';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  Loader2,
  Mail,
  Shield,
  ShieldCheck,
  ShieldX,
  Building2,
  MapPin,
  Briefcase,
  Calendar,
} from 'lucide-react';

export default function AdminUserReviewPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [userData, setUserData] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  // Modals
  const [rejectModal, setRejectModal] = useState(false);
  const [requestDocsModal, setRequestDocsModal] = useState(false);

  // Document Preview
  const [previewDoc, setPreviewDoc] = useState<UserDocument | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users/${userId}`);
      setUserData(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load user data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUser();
  }, [userId]);

  const handleApproveDoc = async (documentId: string) => {
    try {
      setActionLoading(documentId);
      await api.post(`/admin/queue/${userId}/approve`, { documentId });
      await fetchUser();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve document.');
    } finally {
      setActionLoading('');
    }
  };

  const handleRejectDoc = async (documentId: string) => {
    try {
      setActionLoading(documentId);
      await api.post(`/admin/queue/${userId}/reject`, {
        documentId,
        reason: 'Document does not meet requirements.',
      });
      await fetchUser();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject document.');
    } finally {
      setActionLoading('');
    }
  };

  const handleFinalizeApproval = async () => {
    try {
      setActionLoading('finalize');
      await api.post(`/admin/queue/${userId}/approve-user`, { isApproval: true });
      router.push(`${ADMIN_BASE_PATH}/queue`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to finalize approval.');
      setActionLoading('');
    }
  };

  const handleRejectUser = async (reason: string) => {
    await api.post(`/admin/queue/${userId}/reject-user`, { reason });
    router.push(`${ADMIN_BASE_PATH}/queue`);
  };

  const handleRequestDocs = async (message: string) => {
    await api.post(`/admin/queue/${userId}/request-documents`, { message });
    router.push(`${ADMIN_BASE_PATH}/queue`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-8 text-center py-32">
        <ShieldX className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-500">User Not Found</h3>
        <p className="text-sm text-gray-400 mt-1">{error || 'No data available for this user.'}</p>
      </div>
    );
  }

  const profile = userData.profile;
  const allDocsApproved =
    userData.documents.length > 0 &&
    userData.documents.every((d) => d.status === 'APPROVED');

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.push(`${ADMIN_BASE_PATH}/queue`)}
        className="flex items-center text-sm text-gray-500 hover:text-gray-700 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Queue
      </button>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
          {error}
          <button onClick={() => setError('')} className="ml-4 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {profile?.firstName?.charAt(0) || userData.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {profile?.firstName} {profile?.lastName}
              </h1>
              <p className="text-sm text-gray-500 flex items-center">
                <Mail className="w-3.5 h-3.5 mr-1.5" />
                {userData.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
              {userData.verificationStatus.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
              Business Profile
            </h2>
            {profile ? (
              <div className="space-y-4">
                <InfoRow icon={Building2} label="Business Name" value={profile.businessName} />
                <InfoRow icon={Briefcase} label="Sector" value={profile.sector} />
                <InfoRow icon={MapPin} label="State" value={profile.state} />
                <InfoRow icon={Briefcase} label="Business Type" value={profile.businessType || '—'} />
                <InfoRow
                  icon={Calendar}
                  label="Years Active"
                  value={profile.yearsInOperation ? `${profile.yearsInOperation} years` : '—'}
                />
                {profile.commodities && profile.commodities.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Commodities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.commodities.map((c: string) => (
                        <span key={c} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.businessDescription && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{profile.businessDescription}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No profile data available.</p>
            )}
          </div>
        </div>

        {/* Documents */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-5">
              Submitted Documents ({userData.documents.length})
            </h2>

            {userData.documents.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No documents uploaded.</p>
            ) : (
              <div className="space-y-3">
                {userData.documents.map((doc) => {
                  const statusConf = DOC_STATUS_CONFIG[doc.status] || DOC_STATUS_CONFIG.PENDING;
                  const isCurrentAction = actionLoading === doc.id;

                  return (
                    <div
                      key={doc.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 bg-gray-50 rounded-lg shrink-0">
                          <FileText className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {DOCUMENT_TYPES[doc.type] || doc.type}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {doc.fileName} · {(doc.fileSize / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusConf.color} ${statusConf.bg}`}>
                          {statusConf.label}
                        </span>

                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {doc.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApproveDoc(doc.id)}
                              disabled={!!actionLoading}
                              className="p-2 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              {isCurrentAction ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleRejectDoc(doc.id)}
                              disabled={!!actionLoading}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Finalize Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleFinalizeApproval}
                disabled={!allDocsApproved || !!actionLoading}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {actionLoading === 'finalize' ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ShieldCheck className="w-4 h-4 mr-2" />
                )}
                Finalize Approval
              </button>
              <button
                onClick={() => setRejectModal(true)}
                disabled={!!actionLoading}
                className="flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50 shadow-sm"
              >
                <ShieldX className="w-4 h-4 mr-2" />
                Reject User
              </button>
              <button
                onClick={() => setRequestDocsModal(true)}
                disabled={!!actionLoading}
                className="flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50 shadow-sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                Request Docs
              </button>
            </div>

            {!allDocsApproved && userData.documents.length > 0 && (
              <p className="text-xs text-amber-600 mt-3 font-medium">
                ⚠ All documents must be individually approved before you can finalize.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AdminActionModal
        title="Reject User"
        description="This will reject the user's application and notify them via email. They will need to re-apply."
        confirmLabel="Confirm Rejection"
        inputLabel="Rejection Reason"
        inputPlaceholder="e.g. Documents are unclear or do not match..."
        isOpen={rejectModal}
        onClose={() => setRejectModal(false)}
        onConfirm={handleRejectUser}
      />

      <AdminActionModal
        title="Request Additional Documents"
        description="This will send the user an email asking them to re-upload specific documents."
        confirmLabel="Send Request"
        confirmColor="bg-amber-500 hover:bg-amber-600"
        inputLabel="Message to User"
        inputPlaceholder="e.g. Please re-upload your CAC certificate with a clearer scan..."
        isOpen={requestDocsModal}
        onClose={() => setRequestDocsModal(false)}
        onConfirm={handleRequestDocs}
      />

      {previewDoc && (
        <DocumentPreview
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          documentUrl={previewDoc.viewUrl || ''}
          documentName={previewDoc.fileName}
          mimeType={previewDoc.mimeType}
        />
      )}
    </div>
  );
}

// Helper component
function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-sm text-gray-900 font-medium capitalize">{value}</p>
      </div>
    </div>
  );
}
