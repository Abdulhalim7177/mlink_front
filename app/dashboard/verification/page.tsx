"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, ArrowLeft } from 'lucide-react';
import BusinessProfileStep from '../../../components/verification/BusinessProfileStep';
import KycUploadStep from '../../../components/verification/KycUploadStep';
import ReviewSubmitStep from '../../../components/verification/ReviewSubmitStep';

const STEPS = [
  { id: 1, name: 'Business Profile' },
  { id: 2, name: 'Identity & KYC' },
  { id: 3, name: 'Final Review' }
];

export default function VerificationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNext = () => {
    if (currentStep === 3) {
      setIsSuccess(true);
    } else {
      setCurrentStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isSuccess) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-surface-alt flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl border border-border p-10 max-w-lg w-full text-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-success" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Thank you. Your profile is currently securely staged and under exhaustive algorithmic review by our team.
          </p>

          <div className="bg-blue-50 rounded-xl p-6 text-left mb-10 max-w-md mx-auto border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-3">What happens next?</h3>
            <ul className="space-y-4 text-sm text-blue-800 font-medium">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-xs mr-3 shrink-0">1</div>
                <span>We verify your ID documents and compute Readiness.</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-xs mr-3 shrink-0">2</div>
                <span>You'll look out for an email confirming approval.</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-xs mr-3 shrink-0">3</div>
                <span>Your profile dynamically goes live.</span>
              </li>
            </ul>
          </div>

          <button onClick={() => router.push('/dashboard')} className="w-full bg-gray-900 hover:bg-gray-800 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-surface-alt">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10 flex items-center">
        <button onClick={() => currentStep > 1 ? handleBack() : router.push('/dashboard')} className="p-2 mr-4 bg-white border border-border rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verification Center</h1>
          <p className="text-sm text-text-muted mt-1">Complete the rigorous onboarding steps to access premium modules.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        
        {/* Stepper Component */}
        <div className="mb-12 relative px-4">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
          
          <div className="flex justify-between items-center relative z-10 w-full px-[10%]">
            {STEPS.map((step, index) => {
              const isCompleted = step.id < currentStep;
              const isActive = step.id === currentStep;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ring-4 ring-surface-alt transition-colors duration-500 shadow-sm ${isCompleted ? 'bg-success text-white' : isActive ? 'bg-accent text-white scale-110' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <span className={`text-xs font-bold transition-colors absolute -bottom-6 w-32 text-center -ml-16 ${isActive ? 'text-accent' : isCompleted ? 'text-success' : 'text-gray-400'}`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-border/60 p-8 md:p-10 mb-10">
          {currentStep === 1 && <BusinessProfileStep onNext={handleNext} />}
          {currentStep === 2 && <KycUploadStep onNext={handleNext} onBack={handleBack} />}
          {currentStep === 3 && <ReviewSubmitStep onNext={handleNext} onBack={handleBack} />}
        </div>
        
      </div>
    </div>
  );
}
