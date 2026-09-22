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
  Sparkles
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

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

  useEffect(() => {
    loadLeads();
  }, []);

  // Compute Metrics
  const totalDepositsCollected = leads
    .filter(l => l.paymentStatus === 'paid')
    .reduce((sum, l) => sum + (l.depositAmount || 1000), 0);

  const totalPaidLeadsCount = leads.filter(l => l.paymentStatus === 'paid').length;
  const totalGuestLeadsCount = leads.filter(l => l.paymentStatus === 'Guest_Lead').length;
  const targetPilotCapacity = 40;
  const capacityPercentage = Math.round((totalPaidLeadsCount / targetPilotCapacity) * 100);

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
              <span>Admin Waitlist Portal</span>
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
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Primary Metric Card */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200 relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 p-4 opacity-15">
              <IndianRupee className="w-20 h-20 text-emerald-400" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">
              Total Deposits Collected (₹)
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              ₹{totalDepositsCollected.toLocaleString()}
            </h2>
            <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Fully Refundable Deposits in Escrow</span>
            </div>
          </div>

          {/* Metric Card 2 */}
          <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
              Pilot Capacity Reserved
            </p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-extrabold text-white">{totalPaidLeadsCount}</h2>
              <span className="text-slate-300 text-base font-bold">/ {targetPilotCapacity} spots</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 mt-4 overflow-hidden border border-slate-800">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Metric Card 3 */}
          <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <p className="text-xs sm:text-sm font-bold text-teal-400 uppercase tracking-wider mb-2">
              Free Guest Leads Registered
            </p>
            <h2 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
              <Gift className="w-7 h-7 text-teal-400" />
              {totalGuestLeadsCount}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">
              Pay-As-You-Go leads captured
            </p>
          </div>

          {/* Metric Card 4 */}
          <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
              Top Subscription Tier
            </p>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Active Care (Couples)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">
              ₹10,500/mo ($125 USD)
            </p>
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
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="all">All Parent Districts</option>
              <option value="Kannur">Kannur (Phase 1)</option>
              <option value="Kozhikode">Kozhikode</option>
              <option value="Kasaragod">Kasaragod</option>
              <option value="Ernakulam">Ernakulam</option>
              <option value="Thrissur">Thrissur</option>
            </select>

            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="all">All Plans</option>
              <option value="safety_net">Safety Net</option>
              <option value="active_care">Active Care</option>
              <option value="comprehensive_care">Comprehensive Care</option>
              <option value="guest">Guest / Pay-As-You-Go</option>
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
                  <th className="py-4 px-6 font-bold">WhatsApp</th>
                  <th className="py-4 px-6 font-bold">NRK Location</th>
                  <th className="py-4 px-6 font-bold">Parent's District</th>
                  <th className="py-4 px-6 font-bold">Coverage</th>
                  <th className="py-4 px-6 font-bold">Selected Plan</th>
                  <th className="py-4 px-6 font-bold">Add-Ons</th>
                  <th className="py-4 px-6 font-bold text-right">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="py-14 text-center text-slate-400">
                      <RefreshCw className="w-7 h-7 text-emerald-400 animate-spin mx-auto mb-3" />
                      Loading waitlist records...
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-14 text-center text-slate-400">
                      No leads match your current search/filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead, index) => {
                    const formattedDate = new Date(lead.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });

                    const whatsappClean = lead.whatsappNumber.replace(/[^0-9+]/g, '');
                    const isGuest = lead.selectedPlan === 'guest' || lead.paymentStatus === 'Guest_Lead';
                    const planObj = isGuest ? GUEST_PLAN : PLANS.find(p => p.id === lead.selectedPlan);
                    const isCouple = lead.parentMode === 'couple';

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
                            href={`https://wa.me/${whatsappClean.replace('+', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
                          >
                            <MessageCircle className="w-4 h-4 fill-emerald-500/20" />
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

                        {/* Parent District */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`font-bold ${
                            lead.parentDistrict === 'Kannur' 
                              ? 'text-emerald-400' 
                              : 'text-slate-300'
                          }`}>
                            {lead.parentDistrict}
                          </span>
                        </td>

                        {/* Coverage Mode */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          {isCouple ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
                              <Users2 className="w-3.5 h-3.5 text-amber-400" />
                              Both Parents
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              Single Parent
                            </span>
                          )}
                        </td>

                        {/* Selected Plan */}
                        <td className="py-4 px-6 text-slate-200 whitespace-nowrap">
                          <div className="font-bold text-white">
                            {lead.selectedPlanName || planObj?.name || lead.selectedPlan}
                          </div>
                        </td>

                        {/* Add-ons Badges */}
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1.5">
                            {lead.selectedAddOns && lead.selectedAddOns.length > 0 ? (
                              lead.selectedAddOns.map((addOnId) => {
                                const addOn = ADD_ONS.find(a => a.id === addOnId);
                                return (
                                  <span key={addOnId} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium">
                                    {addOn ? addOn.name : addOnId}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-slate-400 italic text-xs">None</span>
                            )}
                          </div>
                        </td>

                        {/* Payment Status Badge */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          {isGuest ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/40 text-teal-300 font-extrabold text-xs shadow-sm">
                              <Gift className="w-4 h-4 text-teal-400" />
                              Free Guest Lead
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-extrabold text-xs shadow-sm">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              Paid ₹1,000
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
