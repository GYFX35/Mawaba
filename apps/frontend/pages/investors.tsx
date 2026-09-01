import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Building2,
  DollarSign,
  Briefcase,
  Search,
  Filter,
  Globe,
  PlusCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  PieChart,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight
} from 'lucide-react';
import { getApiUrl } from '../components/apiConfig';

interface Investor {
  id: string;
  firmName: string;
  investorName: string;
  email: string;
  type: 'VC Firm' | 'Angel Network' | 'Impact Fund' | 'Sovereign Wealth' | 'Corporate VC';
  focusSectors: string[];
  ticketSizeRange: string;
  portfolioCount: number;
  totalCapitalDeployed: string;
  location: string;
  website?: string;
  logoUrl?: string;
  bio: string;
  createdAt: string;
}

interface FundingRequest {
  id: string;
  projectName: string;
  founderName: string;
  founderEmail: string;
  category: string;
  fundingStage: string;
  targetAmount: number;
  raisedAmount: number;
  pitchSummary: string;
  deckUrl?: string;
  location: string;
  status: 'Open' | 'Under Review' | 'Funded';
  createdAt: string;
}

interface InvestmentMatch {
  id: string;
  requestId: string;
  projectName: string;
  investorId: string;
  investorName: string;
  investorEmail: string;
  proposedAmount: number;
  message: string;
  status: string;
  timestamp: string;
}

const InvestorPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<'directory' | 'requests' | 'submit' | 'analytics'>('directory');

  // Directory State
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [vcTypeFilter, setVcTypeFilter] = useState<string>('All');
  const [vcSectorFilter, setVcSectorFilter] = useState<string>('All');
  const [vcSearch, setVcSearch] = useState<string>('');

  // Funding Requests State
  const [fundingRequests, setFundingRequests] = useState<FundingRequest[]>([]);
  const [requestCategoryFilter, setRequestCategoryFilter] = useState<string>('All');
  const [requestStageFilter, setRequestStageFilter] = useState<string>('All');
  const [requestSearch, setRequestSearch] = useState<string>('');

  // Selected Request for VC Match Modal
  const [selectedRequestForMatch, setSelectedRequestForMatch] = useState<FundingRequest | null>(null);
  const [matchInvestorName, setMatchInvestorName] = useState<string>('');
  const [matchInvestorEmail, setMatchInvestorEmail] = useState<string>('');
  const [matchProposedAmount, setMatchProposedAmount] = useState<string>('');
  const [matchMessage, setMatchMessage] = useState<string>('');
  const [matchSuccessMsg, setMatchSuccessMsg] = useState<string>('');
  const [matchErrorMsg, setMatchErrorMsg] = useState<string>('');
  const [isSubmittingMatch, setIsSubmittingMatch] = useState<boolean>(false);

  // Submit Funding Request Form State
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newFounderName, setNewFounderName] = useState<string>('');
  const [newFounderEmail, setNewFounderEmail] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Clean Tech & Climate');
  const [newFundingStage, setNewFundingStage] = useState<string>('Seed');
  const [newTargetAmount, setNewTargetAmount] = useState<string>('');
  const [newPitchSummary, setNewPitchSummary] = useState<string>('');
  const [newDeckUrl, setNewDeckUrl] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string>('');
  const [submitErrorMsg, setSubmitErrorMsg] = useState<string>('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState<boolean>(false);

  // Analytics State
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchInvestors();
    fetchFundingRequests();
    fetchAnalytics();
  }, []);

  const fetchInvestors = async () => {
    try {
      const res = await fetch(getApiUrl('/api/investors'));
      if (res.ok) {
        const data = await res.json();
        setInvestors(data);
      }
    } catch (err) {
      console.warn('Failed to fetch investors directory', err);
    }
  };

  const fetchFundingRequests = async () => {
    try {
      const res = await fetch(getApiUrl('/api/investors/funding-requests'));
      if (res.ok) {
        const data = await res.json();
        setFundingRequests(data);
      }
    } catch (err) {
      console.warn('Failed to fetch funding requests', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(getApiUrl('/api/investors/analytics'));
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.warn('Failed to fetch VC analytics', err);
    }
  };

  const handleMatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestForMatch) return;
    setMatchSuccessMsg('');
    setMatchErrorMsg('');
    setIsSubmittingMatch(true);

    try {
      const res = await fetch(getApiUrl(`/api/investors/funding-requests/${selectedRequestForMatch.id}/match`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorName: matchInvestorName,
          investorEmail: matchInvestorEmail,
          proposedAmount: parseFloat(matchProposedAmount),
          message: matchMessage
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit investment match proposal');

      setMatchSuccessMsg(data.message);
      fetchFundingRequests();
      fetchAnalytics();
      setTimeout(() => {
        setSelectedRequestForMatch(null);
        setMatchSuccessMsg('');
        setMatchInvestorName('');
        setMatchInvestorEmail('');
        setMatchProposedAmount('');
        setMatchMessage('');
      }, 2500);
    } catch (err: any) {
      setMatchErrorMsg(err.message);
    } finally {
      setIsSubmittingMatch(false);
    }
  };

  const handleNewRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccessMsg('');
    setSubmitErrorMsg('');
    setIsSubmittingRequest(true);

    try {
      const res = await fetch(getApiUrl('/api/investors/funding-requests'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: newProjectName,
          founderName: newFounderName,
          founderEmail: newFounderEmail,
          category: newCategory,
          fundingStage: newFundingStage,
          targetAmount: parseFloat(newTargetAmount),
          pitchSummary: newPitchSummary,
          deckUrl: newDeckUrl || undefined,
          location: newLocation
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit funding request');

      setSubmitSuccessMsg(data.message);
      fetchFundingRequests();
      fetchAnalytics();

      // Reset form
      setNewProjectName('');
      setNewFounderName('');
      setNewFounderEmail('');
      setNewTargetAmount('');
      setNewPitchSummary('');
      setNewDeckUrl('');
      setNewLocation('');

      setTimeout(() => {
        setActiveTab('requests');
        setSubmitSuccessMsg('');
      }, 2000);
    } catch (err: any) {
      setSubmitErrorMsg(err.message);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  // Filtered Investors
  const filteredInvestors = investors.filter((inv) => {
    const matchesType = vcTypeFilter === 'All' || inv.type.toLowerCase() === vcTypeFilter.toLowerCase();
    const matchesSector = vcSectorFilter === 'All' || inv.focusSectors.some(s => s.toLowerCase() === vcSectorFilter.toLowerCase());
    const matchesSearch = !vcSearch || (
      inv.firmName.toLowerCase().includes(vcSearch.toLowerCase()) ||
      inv.investorName.toLowerCase().includes(vcSearch.toLowerCase()) ||
      inv.bio.toLowerCase().includes(vcSearch.toLowerCase()) ||
      inv.location.toLowerCase().includes(vcSearch.toLowerCase())
    );
    return matchesType && matchesSector && matchesSearch;
  });

  // Filtered Funding Requests
  const filteredRequests = fundingRequests.filter((fr) => {
    const matchesCategory = requestCategoryFilter === 'All' || fr.category.toLowerCase() === requestCategoryFilter.toLowerCase();
    const matchesStage = requestStageFilter === 'All' || fr.fundingStage.toLowerCase() === requestStageFilter.toLowerCase();
    const matchesSearch = !requestSearch || (
      fr.projectName.toLowerCase().includes(requestSearch.toLowerCase()) ||
      fr.founderName.toLowerCase().includes(requestSearch.toLowerCase()) ||
      fr.pitchSummary.toLowerCase().includes(requestSearch.toLowerCase()) ||
      fr.location.toLowerCase().includes(requestSearch.toLowerCase())
    );
    return matchesCategory && matchesStage && matchesSearch;
  });

  return (
    <>
      <Head>
        <title>Investors & VCs Network | Global Project Funding | Mawaba</title>
        <meta
          name="description"
          content="Connect global high-impact startups and projects with Venture Capital firms, Angel Networks, and Impact Funds for seed, series A, and growth funding."
        />
      </Head>

      {/* Hero Banner */}
      <section className="relative py-20 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
              <TrendingUp className="h-4 w-4 text-blue-400" /> Venture Capital & Global Investor Network
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              Fueling High-Impact Global Innovation & Startups
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Connecting visionaries in Clean Tech, AI, Global Health, Agritech, and EdTech directly with Venture Capital firms, Impact Funds, and Angel Syndicates.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setActiveTab('requests')}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all"
              >
                Browse Pitch Requests
              </button>
              <button
                onClick={() => setActiveTab('submit')}
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition-all"
              >
                Request Funding for Project
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Summary Bar */}
      <section className="bg-slate-800 text-white py-6 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <span className="text-2xl font-extrabold text-blue-400 block">
                {analytics?.summary?.totalVCs || investors.length}
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active VC & Investor Partners</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-emerald-400 block">
                ${((analytics?.summary?.totalTargetFunding || 2550000) / 1000000).toFixed(2)}M
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Funding Sought</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-purple-400 block">
                ${((analytics?.summary?.totalRaisedFunding || 1400000) / 1000000).toFixed(2)}M
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Capital Matched & Committed</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-pink-400 block">
                {analytics?.summary?.fundingProgressPct || '54.9'}%
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Target Fulfilled Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 sm:space-x-8 overflow-x-auto no-scrollbar py-3">
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === 'directory'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Building2 className="h-4 w-4" /> VC & Investor Directory
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === 'requests'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="h-4 w-4" /> Pitch & Funding Requests
            </button>

            <button
              onClick={() => setActiveTab('submit')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === 'submit'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="h-4 w-4" /> Submit Pitch Request
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <PieChart className="h-4 w-4" /> VC Ecosystem Analytics
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="py-12 bg-slate-50 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* TAB 1: VC Directory */}
          {activeTab === 'directory' && (
            <div className="space-y-8">
              {/* Filter Controls */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search VC firms, investors, location..."
                    value={vcSearch}
                    onChange={(e) => setVcSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Type:</span>
                    <select
                      value={vcTypeFilter}
                      onChange={(e) => setVcTypeFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="All">All Investor Types</option>
                      <option value="VC Firm">VC Firm</option>
                      <option value="Impact Fund">Impact Fund</option>
                      <option value="Angel Network">Angel Network</option>
                      <option value="Sovereign Wealth">Sovereign Wealth</option>
                      <option value="Corporate VC">Corporate VC</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Sector:</span>
                    <select
                      value={vcSectorFilter}
                      onChange={(e) => setVcSectorFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="All">All Focus Sectors</option>
                      <option value="Clean Tech & Climate">Clean Tech & Climate</option>
                      <option value="AI & Sci-Fi">AI & Sci-Fi</option>
                      <option value="Global Health">Global Health</option>
                      <option value="Agritech">Agritech</option>
                      <option value="EdTech">EdTech</option>
                      <option value="FinTech & Commerce">FinTech & Commerce</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Directory Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredInvestors.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider inline-block mb-1">
                            {inv.type}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900">{inv.firmName}</h3>
                        </div>
                        <Building2 className="h-5 w-5 text-slate-400 shrink-0 mt-1" />
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-4">{inv.bio}</p>

                      <div className="space-y-2 mb-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-semibold">Lead Partner:</span>
                          <strong className="text-slate-900">{inv.investorName}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-semibold">Check Size:</span>
                          <strong className="text-emerald-700">{inv.ticketSizeRange}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-semibold">Capital Deployed:</span>
                          <strong className="text-purple-700">{inv.totalCapitalDeployed}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-semibold">HQ Location:</span>
                          <strong className="text-slate-900">{inv.location}</strong>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Focus Sectors
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {inv.focusSectors.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={`mailto:${inv.email}?subject=Inquiry%20from%20Mawaba%20Founder`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        Contact Investor <Send className="h-3.5 w-3.5" />
                      </a>
                      {inv.website && (
                        <a
                          href={inv.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                        >
                          Website <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Pitch & Funding Requests */}
          {activeTab === 'requests' && (
            <div className="space-y-8">
              {/* Filter Controls */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search project title, founder, summary..."
                    value={requestSearch}
                    onChange={(e) => setRequestSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Category:</span>
                    <select
                      value={requestCategoryFilter}
                      onChange={(e) => setRequestCategoryFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="All">All Categories</option>
                      <option value="Clean Tech & Climate">Clean Tech & Climate</option>
                      <option value="AI & Sci-Fi">AI & Sci-Fi</option>
                      <option value="Global Health">Global Health</option>
                      <option value="Agritech">Agritech</option>
                      <option value="EdTech">EdTech</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Stage:</span>
                    <select
                      value={requestStageFilter}
                      onChange={(e) => setRequestStageFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="All">All Funding Stages</option>
                      <option value="Pre-Seed">Pre-Seed</option>
                      <option value="Seed">Seed</option>
                      <option value="Series A">Series A</option>
                      <option value="Series B+">Series B+</option>
                      <option value="Grant / Non-Profit">Grant / Non-Profit</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pitch Requests Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRequests.map((fr) => {
                  const progressPct = Math.min(Math.round((fr.raisedAmount / fr.targetAmount) * 100), 100);
                  return (
                    <div
                      key={fr.id}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider inline-block mb-1">
                              {fr.fundingStage} • {fr.category}
                            </span>
                            <h3 className="text-xl font-bold text-slate-900">{fr.projectName}</h3>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            fr.status === 'Funded'
                              ? 'bg-emerald-100 text-emerald-800'
                              : fr.status === 'Under Review'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {fr.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed mb-6">{fr.pitchSummary}</p>

                        {/* Progress Bar */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-600">Funding Progress ({progressPct}%)</span>
                            <span className="text-slate-900">
                              ${fr.raisedAmount.toLocaleString()} / <strong className="text-blue-600">${fr.targetAmount.toLocaleString()}</strong>
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${progressPct}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                            <span>Founder: <strong>{fr.founderName}</strong></span>
                            <span>Location: <strong>{fr.location}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        {fr.deckUrl ? (
                          <a
                            href={fr.deckUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                          >
                            View Pitch Deck <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">Deck upon request</span>
                        )}

                        <button
                          onClick={() => setSelectedRequestForMatch(fr)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-all"
                        >
                          Propose VC Investment <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Submit Funding Request Form */}
          {activeTab === 'submit' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md">
                <div className="mb-8 border-b border-slate-100 pb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="h-3.5 w-3.5" /> Pitch Your Startup
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Global Project Funding Request</h2>
                  <p className="text-slate-600 text-sm mt-1">
                    Submit your pitch summary and target capital requirements to get discovered by our verified VC firms and Angel Syndicate network.
                  </p>
                </div>

                <form onSubmit={handleNewRequestSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Project / Startup Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. AeroGrid Solar AI"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Founder Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Marcus Vance"
                        value={newFounderName}
                        onChange={(e) => setNewFounderName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Founder Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. founder@startup.io"
                        value={newFounderEmail}
                        onChange={(e) => setNewFounderEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Target Capital Amount ($ USD) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1000"
                        placeholder="e.g. 500000"
                        value={newTargetAmount}
                        onChange={(e) => setNewTargetAmount(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Category / Sector *
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="Clean Tech & Climate">Clean Tech & Climate</option>
                        <option value="AI & Sci-Fi">AI & Sci-Fi</option>
                        <option value="Global Health">Global Health</option>
                        <option value="Agritech">Agritech</option>
                        <option value="EdTech">EdTech</option>
                        <option value="FinTech & Commerce">FinTech & Commerce</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Funding Stage *
                      </label>
                      <select
                        value={newFundingStage}
                        onChange={(e) => setNewFundingStage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="Pre-Seed">Pre-Seed</option>
                        <option value="Seed">Seed</option>
                        <option value="Series A">Series A</option>
                        <option value="Series B+">Series B+</option>
                        <option value="Grant / Non-Profit">Grant / Non-Profit</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Pitch Summary & Core Value Proposition *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe the problem, your proprietary solution, market opportunity, and traction..."
                      value={newPitchSummary}
                      onChange={(e) => setNewPitchSummary(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Pitch Deck URL (PDF / Doc)
                      </label>
                      <input
                        type="url"
                        placeholder="https://yourstartup.com/deck.pdf"
                        value={newDeckUrl}
                        onChange={(e) => setNewDeckUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Headquarters / Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Austin, TX or Remote / Global"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {submitSuccessMsg && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      <span>{submitSuccessMsg}</span>
                    </div>
                  )}

                  {submitErrorMsg && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                      <span>{submitErrorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingRequest}
                    className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Send className="h-4 w-4" /> Submit Project Pitch to VC Network
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: VC Ecosystem Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Total Funding Target Across Projects
                  </span>
                  <span className="text-3xl font-extrabold text-slate-900">
                    ${(analytics?.summary?.totalTargetFunding || 2550000).toLocaleString()}
                  </span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Total Capital Committed By Investors
                  </span>
                  <span className="text-3xl font-extrabold text-emerald-600">
                    ${(analytics?.summary?.totalRaisedFunding || 1400000).toLocaleString()}
                  </span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Active VC Investment Matches
                  </span>
                  <span className="text-3xl font-extrabold text-purple-600">
                    {analytics?.summary?.totalMatches || 1} Proposals
                  </span>
                </div>
              </div>

              {/* Recent Matches Table */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600" /> Recent VC Match Offers & Proposals
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 uppercase text-[10px] tracking-wider text-slate-500 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Project Name</th>
                        <th className="p-3">VC / Investor Firm</th>
                        <th className="p-3">Proposed Check Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(analytics?.recentMatches || []).map((m: any) => (
                        <tr key={m.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900">{m.projectName}</td>
                          <td className="p-3 font-medium text-slate-800">{m.investorName}</td>
                          <td className="p-3 font-bold text-emerald-700">${m.proposedAmount.toLocaleString()}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold border border-purple-100">
                              {m.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">{new Date(m.timestamp).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* VC Match Proposal Modal */}
      {selectedRequestForMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  VC Match Proposal
                </span>
                <h3 className="text-xl font-bold text-slate-900">{selectedRequestForMatch.projectName}</h3>
              </div>
              <button
                onClick={() => setSelectedRequestForMatch(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleMatchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Firm / Investor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Global Horizon Ventures"
                  value={matchInvestorName}
                  onChange={(e) => setMatchInvestorName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Investor Contact Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah@ghventures.com"
                  value={matchInvestorEmail}
                  onChange={(e) => setMatchInvestorEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Proposed Investment Check Amount ($) *</label>
                <input
                  type="number"
                  required
                  min="1000"
                  placeholder="e.g. 150000"
                  value={matchProposedAmount}
                  onChange={(e) => setMatchProposedAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Proposal Note / Terms *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Express why you are interested in leading or joining this round..."
                  value={matchMessage}
                  onChange={(e) => setMatchMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {matchSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  {matchSuccessMsg}
                </div>
              )}

              {matchErrorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
                  {matchErrorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingMatch}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow flex items-center justify-center gap-2 transition-all"
              >
                <Send className="h-4 w-4" /> Send Official VC Proposal
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default InvestorPage;
