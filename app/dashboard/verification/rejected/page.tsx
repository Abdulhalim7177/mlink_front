"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import { useAuthStore } from '../../../../store/auth.store';
import { AlertTriangle, ArrowRight, UploadCloud, RefreshCw, Loader2 } from 'lucide-react';

export default function VerificationRejectedPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleResubmit = () => {
    router.push('/dashboard/verification');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-surface-alt flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl border border-border p-10 max-w-lg w-full text-center animate-in zoom-in-95 duration-500">

        {/* Icon */}
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">Verification Declined</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Unfortunately, your submitted documents did not meet our verification requirements. 
          Please review the feedback below and resubmit your documents.
        </p>

        {/* What to do section */}
        <div className="bg-red-50 rounded-xl p-6 text-left mb-8 max-w-md mx-auto border border-red-100">
          <h3 className="font-bold text-red-900 mb-3">What you should do</h3>
          <ul className="space-y-4 text-sm text-red-800 font-medium">
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-red-200 text-red-800 flex items-center justify-center text-xs mr-3 shrink-0">1</div>
              <span>Check your email for specific feedback on which documents were rejected and why.</span>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-red-200 text-red-800 flex items-center justify-center text-xs mr-3 shrink-0">2</div>
              <span>Prepare corrected or updated versions of the flagged documents.</span>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-red-200 text-red-800 flex items-center justify-center text-xs mr-3 shrink-0">3</div>
              <span>Re-upload your documents through the verification center below.</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleResubmit}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center"
          >
            <UploadCloud className="w-5 h-5 mr-2" />
            Re-upload Documents
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center"
          >
            Return to Dashboard
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Need help? Contact support at <a href="mailto:support@marketlink.ng" className="text-primary hover:underline">support@marketlink.ng</a>
        </p>
      </div>
    </div>
  );
}
