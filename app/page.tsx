"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Globe, LayoutGrid, Menu, Sparkles, Zap, Star, ShieldCheck, 
  Users, TrendingUp, Coins, ArrowUpRight, Building2, Landmark, 
  Signal, Droplet, BarChart2, BrainCircuit, Search, Brain, 
  Check 
} from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary-light/30 transition-all duration-300">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-heading font-bold text-text-primary tracking-tight">Market-Link</span>
                <div className="text-xs text-text-secondary font-medium -mt-1">Investment Intelligence</div>
              </div>
            </Link>

            <nav className="hidden lg:flex space-x-8 items-center">
              <a href="#features" className="text-text-secondary hover:text-primary font-medium transition-colors">Features</a>
              <a href="#pricing" className="text-text-secondary hover:text-primary font-medium transition-colors">Pricing</a>
              <a href="#market" className="text-text-secondary hover:text-primary font-medium transition-colors">Markets</a>
              <Link href="/services" className="text-text-secondary hover:text-primary font-medium transition-colors">Services</Link>
              <Link href="/about" className="text-text-secondary hover:text-primary font-medium transition-colors">About</Link>
              <Link href="/platform" className="flex items-center space-x-1 text-text-primary font-bold hover:text-primary bg-surface px-3 py-1.5 rounded-lg transition-colors border border-border">
                <LayoutGrid className="w-4 h-4" />
                <span>Platform Demo</span>
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full font-medium shadow-md shadow-primary-light/30 transition-all hover:shadow-lg hover:-translate-y-0.5">
                  Get Started
                </Link>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-text-secondary p-2 rounded-md hover:bg-surface"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white border-b border-border shadow-lg py-4 px-4 flex flex-col space-y-4 lg:hidden">
              <a href="#features" className="block text-text-primary font-medium">Features</a>
              <a href="#pricing" className="block text-text-primary font-medium">Pricing</a>
              <a href="#market" className="block text-text-primary font-medium">Markets</a>
              <Link href="/auth/login" className="block text-text-primary font-medium">Login</Link>
              <Link href="/auth/register" className="block w-full text-center bg-primary text-white py-3 rounded-lg font-bold">Get Started</Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="fade-in-up">
              <div className="inline-flex items-center bg-primary/10 text-primary-dark px-4 py-1.5 rounded-full text-sm font-semibold mb-8 border border-primary/20 shadow-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Nigeria's #1 B2B Trade & Intelligence Platform
              </div>

              <h1 className="text-5xl lg:text-7xl font-heading font-extrabold mb-6 leading-tight text-text-primary tracking-tight">
                Transform Your <br />
                <span className="gradient-text">Trading Decisions</span>
              </h1>

              <p className="text-lg lg:text-xl text-text-secondary mb-8 leading-relaxed max-w-lg">
                Access real-time market intelligence, connect with verified traders, and leverage AI-powered insights to make smarter investment decisions across Nigerian commodities.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="#pricing" className="flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary-light/30 hover:shadow-xl transition-all hover:-translate-y-1">
                  <Zap className="w-5 h-5 mr-2" />
                  View Pricing
                </Link>
                <Link href="/auth/register" className="flex items-center justify-center bg-white hover:bg-surface text-text-primary px-8 py-4 rounded-xl font-bold text-lg border border-border shadow-sm hover:shadow-md transition-all">
                  <Star className="w-5 h-5 mr-2 text-accent" />
                  Join Free Today
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-text-muted font-medium">
                <div className="flex items-center"><ShieldCheck className="w-4 h-4 text-success mr-1.5" /> 10-Step Verification</div>
                <div className="flex items-center"><Users className="w-4 h-4 text-primary mr-1.5" /> Verified Network</div>
              </div>
            </div>

            {/* Right Content - 3D/Glass Effect Visualization */}
            <div className="relative fade-in-up delay-100 hidden lg:block">
              <div className="absolute inset-0 bg-primary-light blur-[100px] opacity-20 rounded-full animate-pulse"></div>

              <div className="relative z-10 glass-card rounded-2xl p-6 border border-white/50 shadow-2xl float-animation">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-text-primary">Market Pulse</div>
                      <div className="text-xs text-success font-medium flex items-center">
                        <span className="w-2 h-2 bg-success rounded-full mr-1 animate-pulse"></span>
                        Live Updates
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface px-3 py-1 rounded-md text-xs font-medium text-text-secondary">Today</div>
                </div>

                {/* Chart Placeholder */}
                <div className="h-48 bg-gradient-to-b from-primary/5 to-transparent rounded-xl border border-primary/10 mb-6 flex items-end justify-between p-4 px-6 gap-2">
                  <div className="w-full bg-primary/20 rounded-t-sm h-[40%]"></div>
                  <div className="w-full bg-primary/30 rounded-t-sm h-[60%]"></div>
                  <div className="w-full bg-primary/40 rounded-t-sm h-[45%]"></div>
                  <div className="w-full bg-primary/60 rounded-t-sm h-[75%]"></div>
                  <div className="w-full bg-primary rounded-t-sm h-[90%]"></div>
                </div>

                {/* Interactive List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 hover:bg-surface rounded-lg transition-colors cursor-pointer group">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-text-primary">Cocoa Beans</div>
                        <div className="text-xs text-text-secondary">Ondo • Export</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-text-primary">₦1.2M</div>
                      <div className="text-xs text-success font-medium">+12.5%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 hover:bg-surface rounded-lg transition-colors cursor-pointer group">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-text-primary">Sesame Seed</div>
                        <div className="text-xs text-text-secondary">Kano • Commercial</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-text-primary">₦450K</div>
                      <div className="text-xs text-success font-medium">+8.2%</div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -right-6 top-20 bg-white p-3 rounded-xl shadow-xl border border-border animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-2">
                    <div className="bg-success/10 p-1.5 rounded-lg"><ArrowUpRight className="w-4 h-4 text-success" /></div>
                    <div>
                      <div className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">ROI</div>
                      <div className="text-sm font-bold text-text-primary">+42%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-10 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-text-muted mb-6 uppercase tracking-wider">Trusted by industry leaders across Nigeria</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-xl text-text-primary"><Building2 className="w-6 h-6" /> Dangote</div>
            <div className="flex items-center gap-2 font-bold text-xl text-text-primary"><Landmark className="w-6 h-6" /> UBA</div>
            <div className="flex items-center gap-2 font-bold text-xl text-text-primary"><Signal className="w-6 h-6" /> MTN</div>
            <div className="flex items-center gap-2 font-bold text-xl text-text-primary"><Droplet className="w-6 h-6" /> Oando</div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-surface px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-in-up">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">Comprehensive Feature Suite</h2>
            <p className="text-lg text-text-secondary">Everything you need to succeed in the Nigerian market, from real-time data to verified connections.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-border group fade-in-up">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart2 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-bold text-text-primary mb-3">Market Pulse</h3>
              <p className="text-text-secondary leading-relaxed">Track commodity prices and market trends across 10 Nigerian states with live data updates.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-border group fade-in-up delay-100">
              <div className="w-14 h-14 bg-success/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-7 h-7 text-success" />
              </div>
              <h3 className="text-xl font-heading font-bold text-text-primary mb-3">10-Step Verification</h3>
              <p className="text-text-secondary leading-relaxed">Connect with vetted buyers and sellers. Our strict verification process eliminates counterparty fraud in B2B trades.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-border group fade-in-up delay-200">
              <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BrainCircuit className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-heading font-bold text-text-primary mb-3">AI Matchmaker</h3>
              <p className="text-text-secondary leading-relaxed">Leverage our Bedrock-powered AI to automatically find highly compatible trading partners and services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section id="pricing" className="py-24 bg-surface px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-3xl font-heading font-bold text-text-primary mb-4">Choose Your Growth Path</h2>
            <p className="text-text-secondary">Scalable plans for every stage of your trading journey.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <div className="tier-card group relative bg-white rounded-2xl p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 fade-in-up">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">Free Tier</h3>
                <p className="text-sm text-text-secondary">Essential tools for starters</p>
              </div>
              <div className="text-4xl font-bold text-text-primary mb-6">₦0<span className="text-base font-normal text-text-muted">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm text-text-secondary"><Check className="w-4 h-4 text-success mr-3" /> Raw Material Directory</li>
                <li className="flex items-center text-sm text-text-secondary"><Check className="w-4 h-4 text-success mr-3" /> Basic Price Ranges</li>
                <li className="flex items-center text-sm text-text-secondary"><Check className="w-4 h-4 text-success mr-3" /> Trade Guides (PDFs)</li>
              </ul>
              <button className="w-full py-3 rounded-lg border-2 border-border font-semibold text-text-primary group-hover:border-primary group-hover:text-primary transition-all">
                Get Started
              </button>
            </div>

            {/* Beta Tier */}
            <div className="tier-card group relative bg-white rounded-2xl p-8 border-2 border-primary shadow-xl scale-105 z-10 fade-in-up delay-100">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide shadow-lg">POPULAR</div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">Beta Seller</h3>
                <p className="text-sm text-text-secondary">For established suppliers</p>
              </div>
              <div className="text-4xl font-bold text-text-primary mb-6">₦100,000<span className="text-base font-normal text-text-muted">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm text-text-secondary"><Check className="w-4 h-4 text-primary mr-3" /> 5 Active Listings</li>
                <li className="flex items-center text-sm text-text-secondary"><Check className="w-4 h-4 text-primary mr-3" /> Encrypted Messaging</li>
                <li className="flex items-center text-sm text-text-secondary"><Check className="w-4 h-4 text-primary mr-3" /> 5 AI Matches / Month</li>
                <li className="flex items-center text-sm text-text-secondary"><Check className="w-4 h-4 text-primary mr-3" /> Verified Badge (Level 2)</li>
              </ul>
              <button className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary-light/30">
                Join Beta
              </button>
            </div>

            {/* Premium Tier */}
            <div className="tier-card group relative bg-white rounded-2xl p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 fade-in-up delay-200">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-text-primary group-hover:text-accent transition-colors">Power Buyer</h3>
                <p className="text-sm text-text-secondary">For high-volume sourcing</p>
              </div>
              <div className="text-4xl font-bold text-text-primary mb-6">₦35,000<span className="text-base font-normal text-text-muted">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm text-text-secondary"><Check className="w-4 h-4 text-accent mr-3" /> Everything in Beta Buyer</li>
                <li className="flex items-center text-sm text-text-secondary"><Check className="w-4 h-4 text-accent mr-3" /> Unlimited Inquiries</li>
                <li className="flex items-center text-sm text-text-secondary"><Check className="w-4 h-4 text-accent mr-3" /> 10 AI Matches / Month</li>
                <li className="flex items-center text-sm text-text-secondary"><Check className="w-4 h-4 text-accent mr-3" /> Dedicated Support</li>
              </ul>
              <button className="w-full py-3 rounded-lg border-2 border-border font-semibold text-text-primary group-hover:border-accent group-hover:text-accent transition-all">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-heading font-bold text-text-primary">Market-Link</span>
              </Link>
              <p className="text-text-secondary text-sm leading-relaxed">
                Empowering Nigerian traders with actionable intelligence, global connections, and verified opportunities.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-text-primary mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-text-secondary">
                <li><Link href="/pulse" className="hover:text-primary transition-colors">Market Pulse</Link></li>
                <li><Link href="/directory" className="hover:text-primary transition-colors">Business Directory</Link></li>
                <li><Link href="/listings" className="hover:text-primary transition-colors">Verified Listings</Link></li>
                <li><Link href="/services" className="hover:text-primary transition-colors">Services Marketplace</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-text-primary mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-text-secondary">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-text-primary mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-text-secondary">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/compliance" className="hover:text-primary transition-colors">NDPR Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-text-secondary mb-4 md:mb-0">&copy; 2026 WebCortex Technologies Limited. All rights reserved.</p>
            <div className="flex space-x-6">
              {/* Note: Brand icons were removed from lucide-react in recent versions, using raw SVG fallbacks */}
              <a href="#" className="text-text-muted hover:text-text-primary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
              <a href="#" className="text-text-muted hover:text-text-primary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="text-text-muted hover:text-text-primary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
