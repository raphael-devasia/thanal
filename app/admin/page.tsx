'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WaitlistEntry, PLANS, GUEST_PLAN, ADD_ONS } from '@/types/waitlist';
import { fetchWaitlistLeads } from '@/lib/firebase';
import { 
  Users, 
  IndianRupee, 
  Search, 
  RefreshCw, 
  Download, 
  CheckCircle2, 
  MapPin, 
  ArrowLeft, 
  Calendar,
  MessageCircle,
  ShieldCheck,
  User,
  Users2,
  Gift,
  Sparkles,
  Lock,
  LogOut,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Dashboard Data State
  const [leads, setLeads] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  // Check auth session on mount
  useEffect(() => {
    const savedAuth = typeof window !== 'undefined' ? sessionStorage.getItem('thanal_admin_auth') : null;
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      loadLeads();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid email or password');
      }

      sessionStorage.setItem('thanal_admin_auth', 'true');
      setIsAuthenticated(true);
      loadLeads();
    } catch (err: any) {
      setLoginError(err?.message || 'Authentication failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('thanal_admin_auth');
    setIsAuthenticated(false);
    setLoginPassword('');
  };

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const data = await fetchWaitlistLeads();
      setLeads(data);
    } catch (error) {
      console.error('Error loading waitlist leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // If NOT Authenticated, render Admin Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white font-sans flex items-center justify-center p-4 selection:bg-[#E66323] selection:text-white">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl relative">
          
          <div className="text-center space-y-4 mb-8">
            <Link href="/" className="inline-block hover:opacity-90 transition">
              <img 
                src="/images/logo.png" 
                alt="Thanal Eldercare" 
                className="h-16 w-auto mx-auto object-contain" 
              />
            </Link>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Admin Portal Access</h2>
              <p className="text-sm text-slate-400 mt-1">
                Enter your credentials to manage Thanal leads
              </p>
            </div>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                placeholder="info@zynthexion.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#E66323] focus:ring-1 focus:ring-[#E66323] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#E66323] focus:ring-1 focus:ring-[#E66323] text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 rounded-xl bg-[#E66323] hover:bg-[#d55516] text-white font-extrabold text-base shadow-lg shadow-[#E66323]/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-white" />
              <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Portal'}</span>
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-800/80 pt-5">
            <Link 
              href="/" 
              className="text-xs font-bold text-slate-400 hover:text-white transition inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Landing Page</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Compute Metrics
  const totalLeadsCount = leads.length;
  const totalPaidLeadsCount = leads.filter(l => l.paymentStatus === 'paid' || l.paymentStatus === 'Lead_Submitted').length;
  const totalCallbackCount = leads.filter(l => l.paymentStatus === 'Callback_Requested').length;

  // Filtered list
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.nrkLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.whatsappNumber.includes(searchTerm);
    
    const matchesDistrict = districtFilter === 'all' || lead.parentDistrict === districtFilter;
    const matchesPlan = planFilter === 'all' || lead.selectedPlan === planFilter;

    return matchesSearch && matchesDistrict && matchesPlan;
  });

  // Export CSV Helper
  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['Date', 'Customer Name', 'WhatsApp', 'NRK Location', 'Parent District', 'Coverage Mode', 'Plan', 'Add-ons', 'Payment ID', 'Status'];
    const rows = leads.map(l => [
      new Date(l.createdAt).toLocaleDateString(),
      `"${l.fullName}"`,
      `"${l.whatsappNumber}"`,
      `"${l.nrkLocation}"`,
      `"${l.parentDistrict}"`,
      `"${l.parentMode || 'single'}"`,
      `"${l.selectedPlanName || l.selectedPlan}"`,
      `"${l.selectedAddOns?.join(', ') || 'None'}"`,
      `"${l.paymentId}"`,
      l.paymentStatus
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `thanal_waitlist_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#E66323] selection:text-white">
      {/* Admin Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#044749] transition flex items-center gap-2 text-sm font-bold border border-slate-200"
            >
              <ArrowLeft className="w-4 h-4 text-[#E66323]" />
              <span>Landing Page</span>
            </Link>
            <div className="h-5 w-px bg-slate-300" />
            <h1 className="text-xl font-bold text-[#044749] flex items-center gap-2.5">
              <img 
                src="/images/logo.png" 
                alt="Thanal Eldercare Concierge" 
                className="h-8 w-auto object-contain inline-block" 
              />
              <span className="text-slate-400 font-light">|</span>
              <span>Admin Lead Portal</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadLeads}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#044749] border border-slate-200 transition flex items-center gap-2 text-sm font-bold"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 text-[#E66323] ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-[#E66323] hover:bg-[#d55516] text-white font-extrabold text-sm transition flex items-center gap-2 shadow-md shadow-[#E66323]/20"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition flex items-center gap-1.5 text-xs font-bold"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
              Total Captured Leads
            </p>
            <h2 className="text-3xl font-extrabold text-white">{totalLeadsCount}</h2>
            <p className="text-xs text-slate-400 mt-2">Registered via website & WhatsApp inquiries</p>
          </div>

          <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <p className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">
              Form Lead Submissions
            </p>
            <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              {totalPaidLeadsCount}
            </h2>
            <p className="text-xs text-slate-400 mt-2">Ready for Care Manager contact</p>
          </div>

          <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <p className="text-xs sm:text-sm font-bold text-[#E66323] uppercase tracking-wider mb-2">
              WhatsApp Care Manager Enquiries
            </p>
            <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <MessageCircle className="w-7 h-7 text-[#25D366]" />
              {totalCallbackCount}
            </h2>
            <p className="text-xs text-slate-400 mt-2">Direct WhatsApp care manager inquiries</p>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-lg">
          <div className="relative w-full sm:w-88">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer name, NRK location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-[#E66323]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#E66323] font-medium"
            >
              <option value="all">All Parent Districts</option>
              <option value="Kannur">Kannur (Phase 1)</option>
              <option value="Kozhikode">Kozhikode</option>
              <option value="Kasaragod">Kasaragod</option>
              <option value="Ernakulam">Ernakulam</option>
              <option value="Thrissur">Thrissur</option>
            </select>
          </div>
        </div>

        {/* Lead Data Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-7 py-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
              Waitlist Customer Leads ({filteredLeads.length})
            </h3>
            <span className="text-xs sm:text-sm text-slate-400 font-semibold">Real-time Firestore Sync</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-300 uppercase tracking-wider text-xs border-b border-slate-800">
                  <th className="py-4 px-6 font-bold">Date</th>
                  <th className="py-4 px-6 font-bold">Customer Name</th>
                  <th className="py-4 px-6 font-bold">WhatsApp Number</th>
                  <th className="py-4 px-6 font-bold">NRK Location</th>
                  <th className="py-4 px-6 font-bold">Parent's Area in Kannur</th>
                  <th className="py-4 px-6 font-bold text-right">Lead Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-slate-400">
                      <RefreshCw className="w-7 h-7 text-[#E66323] animate-spin mx-auto mb-3" />
                      Loading waitlist records...
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-slate-400">
                      No leads match your current search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead, index) => {
                    const formattedDate = new Date(lead.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });

                    const whatsappClean = lead.whatsappNumber.replace(/[^0-9]/g, '');
                    const isCallback = lead.paymentStatus === 'Callback_Requested';

                    return (
                      <tr 
                        key={lead.id || index}
                        className={`transition hover:bg-slate-800/70 ${
                          index % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900'
                        }`}
                      >
                        {/* Date */}
                        <td className="py-4 px-6 text-slate-300 font-medium whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{formattedDate}</span>
                          </div>
                        </td>

                        {/* Customer Name */}
                        <td className="py-4 px-6 font-bold text-white whitespace-nowrap text-base">
                          {lead.fullName}
                        </td>

                        {/* WhatsApp Quick Action Link */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <a
                            href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent(`Hi ${lead.fullName}, thank you for reaching out to Thanal Eldercare. I am your Care Manager.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#25D366] hover:underline font-bold"
                          >
                            <MessageCircle className="w-4 h-4 fill-[#25D366]/20" />
                            <span>{lead.whatsappNumber}</span>
                          </a>
                        </td>

                        {/* NRK Location */}
                        <td className="py-4 px-6 text-slate-200 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-100 border border-slate-700 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            {lead.nrkLocation}
                          </span>
                        </td>

                        {/* Parent District / Town */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="font-bold text-emerald-400">
                            {lead.parentDistrict || 'Kannur'}
                          </span>
                        </td>

                        {/* Lead Status Badge */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          {isCallback ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/40 text-[#25D366] font-extrabold text-xs shadow-sm">
                              <MessageCircle className="w-4 h-4 text-[#25D366]" />
                              Care Manager Request
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-extrabold text-xs shadow-sm">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              Lead Submitted
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
