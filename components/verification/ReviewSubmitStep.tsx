"use client";

import React, { useState } from 'react';
import api from '../../lib/api';
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function ReviewSubmitStep({ onNext, onBack }: Props) {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const submitToQueue = async () => {
    try {
      if (!agreed) {
        setServerError('You must agree to the Terms of Service to proceed.');
        return;
      }
      setServerError('');
      setIsSubmitting(true);

      // Hit Backend Pipeline: S4 -> S5
      await api.put('/users/documents/submit-for-review');
      
      onNext();
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to submit application to the queue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Final Review & Submission</h2>
        <p className="text-gray-500">Your profile and documentation are staged. Are you ready to submit?</p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
          {serverError}
        </div>
      )}

      <div className="bg-surface rounded-xl p-6 mb-8 border border-border/80 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 border-b border-border pb-3">What happens next?</h3>
        <ul className="space-y-4 text-sm text-text-secondary">
          <li className="flex items-start">
            <CheckCircle2 className="w-5 h-5 text-accent mr-3 shrink-0" />
            <span>We calculate your algorithmic Readiness Score dynamically.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="w-5 h-5 text-accent mr-3 shrink-0" />
            <span>Our admin team manually reviews your legal KYC documents for authenticity.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="w-5 h-5 text-accent mr-3 shrink-0" />
            <span>You will receive an email upon complete tier verification.</span>
          </li>
        </ul>
      </div>

      <div className="flex items-start mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
        <input 
          type="checkbox" 
          id="agree"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-5 w-5 text-accent rounded border-gray-300 focus:ring-accent cursor-pointer"
        />
        <label htmlFor="agree" className="ml-3 text-sm text-gray-700 cursor-pointer">
          I verify that the information provided is entirely true and accurate. I agree to a background check and the formally documented Market-Link <a href="#" className="text-accent font-bold hover:underline">Terms of Service</a>.
        </label>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-border">
        <button 
          onClick={onBack}
          type="button" 
          disabled={isSubmitting}
          className="flex items-center px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>
        <button 
          onClick={submitToQueue}
          disabled={isSubmitting || !agreed}
          className="flex items-center px-8 py-3 rounded-xl bg-accent hover:bg-accent-dark text-white font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
        >
          {isSubmitting ? 'Entering Queue...' : <>Commit Application <ArrowRight className="w-5 h-5 ml-2" /></>}
        </button>
      </div>
    </div>
  );
}
