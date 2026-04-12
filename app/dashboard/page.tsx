"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../store/auth.store';
import api from '../../lib/api';
import { ADMIN_BASE_PATH } from '../../lib/constants';
import { 
  DollarSign, TrendingUp, Sparkles, Percent, 
  Briefcase, HelpCircle, Bookmark, AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2,
  Shield, Ban, Award, UploadCloud
} from 'lucide-react';

interface UserStatus {
  verificationStatus: string;
  tier: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [statusMap, setStatusMap] = useState<UserStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get('/users/me/status');
        setStatusMap(response.data.data);
      } catch (error) {
        console.error("Failed to fetch user status", error);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchStatus();
  }, []);

  const requiresVerification = statusMap?.verificationStatus === 'PENDING_PROFILE' || 
                               statusMap?.verificationStatus === 'PENDING_DOCUMENTS' || 
                               statusMap?.verificationStatus === 'PENDING_OTP';

  const isAwaitingVerification = statusMap?.verificationStatus === 'PENDING_REVIEW';
  const isRejected = statusMap?.verificationStatus === 'REJECTED';
  const isSuspended = statusMap?.verificationStatus === 'SUSPENDED';
  const isBadgeAssigned = statusMap?.verificationStatus === 'BADGE_ASSIGNED';

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-surface-alt">
      {/* REJECTED Banner */}
      {!loadingStatus && isRejected && (
        <div className="mb-8 p-5 bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 text-red-600 rounded-full shrink-0">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Verification Declined</h3>
              <p className="text-sm text-gray-600 mt-1">
                Your application was not approved. Please check your email for details and re-upload your documents.
              </p>
            </div>
          </div>
          <Link href="/dashboard/verification/rejected" className="shrink-0 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center shadow-sm">
            <UploadCloud className="w-4 h-4 mr-2" /> Re-submit Documents
          </Link>
        </div>
      )}

      {/* SUSPENDED Banner */}
      {!loadingStatus && isSuspended && (
        <div className="mb-8 p-5 bg-gradient-to-r from-red-600/10 to-transparent border border-red-600/20 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-red-600/10 text-red-700 rounded-full shrink-0">
            <Ban className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Account Suspended</h3>
            <p className="text-sm text-gray-600 mt-1">
              Your account has been suspended by a platform administrator. 
              Contact <a href="mailto:support@marketlink.ng" className="text-primary font-bold hover:underline">support@marketlink.ng</a> for assistance.
            </p>
          </div>
        </div>
      )}

      {/* BADGE_ASSIGNED Banner */}
      {!loadingStatus && isBadgeAssigned && (
        <div className="mb-8 p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-3 text-purple-800 text-sm font-medium">
          <Award className="w-5 h-5" /> Your badge has been assigned! Your tier classification is being finalized.
        </div>
      )}
      
      {/* Verification Banner */}
      {!loadingStatus && requiresVerification && (
        <div className="mb-8 p-5 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-full shrink-0">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Complete Your Verification Profile</h3>
              <p className="text-sm text-gray-600 mt-1">
                You are currently in <strong className="text-amber-700">{statusMap?.verificationStatus.replace(/_/g, ' ')}</strong> state. Upload your business credentials to access premium trade leads and matchmaking.
              </p>
            </div>
          </div>
          <Link href="/dashboard/verification" className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center shadow-sm">
            Resume Onboarding <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      )}

      {/* Awaiting Review Banner */}
      {!loadingStatus && isAwaitingVerification && (
        <div className="mb-8 p-5 bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-full shrink-0">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Application Under Review</h3>
              <p className="text-sm text-gray-600 mt-1">
                Your profile is in the <strong className="text-blue-700">AWAITING VERIFICATION</strong> queue. Our admin team is actively reviewing your legal documents. You will be notified once complete.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Verification Success (Temporary display if completely vetted) */}
      {!loadingStatus && statusMap?.verificationStatus === 'MARKETPLACE_ACTIVE' && (
        <div className="mb-8 p-4 bg-success/10 border border-success/20 rounded-xl flex items-center gap-3 text-success-dark text-sm font-medium">
          <CheckCircle2 className="w-5 h-5" /> Account fully verified. Access granted to all tier-level datasets.
        </div>
      )}

      {/* KEY METRICS ROW (Financial & Platform Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="glass-card p-5 rounded-xl border border-border bg-white shadow-sm hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-text-secondary">Capital Deployed</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">$2.4M</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-success font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +12.5%
            </span>
            <span className="text-text-muted ml-2">vs last month</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-border bg-white shadow-sm hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-text-secondary">Active Deals</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">14</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-text-secondary font-medium">3 requiring action</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-border bg-white shadow-sm hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-text-secondary">New AI Matches</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">8</h3>
            </div>
            <div className="p-2 bg-accent/10 rounded-lg text-accent-dark">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-accent font-bold hover:underline cursor-pointer">View Recommendations →</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-border bg-white shadow-sm hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-text-secondary">Avg. Proj. ROI</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">18.2%</h3>
            </div>
            <div className="p-2 bg-success/10 rounded-lg text-success">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-text-muted">Across portfolio</span>
          </div>
        </div>
      </div>

      {/* TWO COLUMN LAYOUT: Feed & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-800">Recommended Opportunities</h2>
            <Link href="/dashboard/opportunities" className="text-sm text-accent hover:text-accent-dark font-medium transition-colors">View All</Link>
          </div>

          {[
            {
              title: "Prime Logistics Hub - Lagos",
              sector: "Real Estate",
              score: 95,
              desc: "Seeking equity partner for a tech-enabled logistics facility serving the Lekki Free Trade Zone.",
              raise: "$500k", roi: "22%", horizon: "5 Years",
              author: "Lagos Dev Co.",
              imgUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=300&h=300"
            },
            {
              title: "Solar Grid Expansion - Kenya",
              sector: "Energy",
              score: 88,
              desc: "Scaling renewable energy mini-grids across 15 rural communities. Backed by government PPA.",
              raise: "$1.2M", roi: "16%", horizon: "10 Years",
              author: "Solar Africa Ltd",
              imgUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=300&h=300"
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-border/60 overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
              <div className="w-full md:w-56 h-48 md:h-auto bg-gray-200 relative shrink-0">
                <img src={item.imgUrl} alt={item.sector} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded text-xs font-bold text-gray-800 shadow">
                  {item.sector}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 hover:text-accent cursor-pointer transition-colors">{item.title}</h3>
                    <div className="flex items-center space-x-1 bg-success/10 text-success-dark px-2 py-0.5 rounded text-xs font-bold">
                      <span>{item.score} Score</span>
                      <HelpCircle className="w-3 h-3 text-success" />
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary mt-2 line-clamp-2">{item.desc}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mt-5 text-sm">
                    <div>
                      <p className="text-text-muted text-xs">Target Raise</p>
                      <p className="font-semibold text-gray-800">{item.raise}</p>
                    </div>
                    <div>
                      <p className="text-text-muted text-xs">Proj. ROI</p>
                      <p className="font-semibold text-success">{item.roi}</p>
                    </div>
                    <div>
                      <p className="text-text-muted text-xs">Time Horizon</p>
                      <p className="font-semibold text-gray-800">{item.horizon}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.author)}&background=random`} alt="Owner" />
                    </div>
                    <span className="text-xs font-medium text-text-secondary">{item.author}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="bg-gray-900 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors">
                      View Deal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-5">Sector Distribution</h3>
            
            {/* Visual Bar Implementation serving as graph placeholder */}
            <div className="space-y-4">
              {[
                { name: 'AgriTech', pct: 35, color: 'bg-accent' },
                { name: 'Real Estate', pct: 25, color: 'bg-blue-500' },
                { name: 'Energy', pct: 20, color: 'bg-green-500' },
                { name: 'FinTech', pct: 15, color: 'bg-purple-500' },
                { name: 'Other', pct: 5, color: 'bg-gray-400' }
              ].map(sec => (
                <div key={sec.name}>
                  <div className="flex justify-between text-xs font-bold text-text-secondary mb-1">
                    <span>{sec.name}</span>
                    <span className="text-gray-900">{sec.pct}%</span>
                  </div>
                  <div className="w-full bg-surface rounded-full h-2">
                    <div className={`${sec.color} h-2 rounded-full`} style={{ width: `${sec.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-900">Recent Messages</h3>
              <Link href="/dashboard/messages" className="text-xs text-primary font-bold hover:underline">View All</Link>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Sarah Mensah', msg: 'Re: Investment in Cocoa Pro...', time: '2m', unread: true },
                { name: 'David Kalu', msg: 'Documents have been uploa...', time: '1h', unread: false }
              ].map((m, idx) => (
                <div key={idx} className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded -mx-2 transition-colors">
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=random`} alt="User" />
                    </div>
                    {m.unread && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-white rounded-full"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${m.unread ? 'font-bold text-gray-900' : 'font-medium text-text-secondary'}`}>{m.name}</p>
                    <p className="text-xs text-text-muted truncate mt-0.5">{m.msg}</p>
                  </div>
                  <span className="text-xs text-text-muted mt-1">{m.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
