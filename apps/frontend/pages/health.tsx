import { getApiUrl } from '../components/apiConfig';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Heart,
  Activity,
  Droplets,
  ShieldAlert,
  ThumbsUp,
  PlusCircle,
  Calculator,
  Globe,
  Sparkles,
  CheckCircle2,
  Brain,
  Apple,
  Search,
  UserCheck,
  Building2,
  Info,
  ArrowRight
} from 'lucide-react';

interface HealthCampaign {
  id: string;
  title: string;
  category: 'Epidemic & Disease Control' | 'Maternal & Child Health' | 'Mental Health & Well-being' | 'Nutrition & Food Security' | 'Universal Health Coverage' | 'Clean Water & Sanitation';
  description: string;
  location: string;
  organizer: string;
  targetImpact: string;
  supporters: number;
  status: 'Proposed' | 'Active' | 'Completed';
  createdAt: string;
}

interface HealthTip {
  id: string;
  title: string;
  category: 'Wellness & Prevention' | 'Mental Well-being' | 'Nutrition' | 'Physical Activity' | 'Hygiene & Cleanliness';
  content: string;
  author: string;
  likes: number;
  createdAt: string;
}

interface HealthAssessmentResult {
  bmi: number;
  bmiCategory: string;
  recommendedWaterLiters: number;
  currentWaterLiters: number;
  hydrationStatus: string;
  healthAdvice: string;
  sdgTarget: string;
}

export default function GlobalHealthPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'calculator' | 'tips' | 'sdg3'>('campaigns');

  // Campaigns state
  const [campaigns, setCampaigns] = useState<HealthCampaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [campaignCategory, setCampaignCategory] = useState<string>('All');
  const [searchCampaignQuery, setSearchCampaignQuery] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // New Campaign Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HealthCampaign['category']>('Epidemic & Disease Control');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newOrganizer, setNewOrganizer] = useState('');
  const [newTargetImpact, setNewTargetImpact] = useState('');
  const [submittingCampaign, setSubmittingCampaign] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');

  // Health Tips State
  const [tips, setTips] = useState<HealthTip[]>([]);
  const [tipCategory, setTipCategory] = useState<string>('All');
  const [showTipModal, setShowTipModal] = useState(false);
  const [newTipTitle, setNewTipTitle] = useState('');
  const [newTipCategory, setNewTipCategory] = useState<HealthTip['category']>('Wellness & Prevention');
  const [newTipContent, setNewTipContent] = useState('');
  const [newTipAuthor, setNewTipAuthor] = useState('');
  const [submittingTip, setSubmittingTip] = useState(false);

  // Health Assessment / Calculator State
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(170);
  const [age, setAge] = useState<number>(28);
  const [waterLiters, setWaterLiters] = useState<number>(2.5);
  const [assessmentResult, setAssessmentResult] = useState<HealthAssessmentResult | null>(null);
  const [calculating, setCalculating] = useState(false);

  // Load Initial Data
  const fetchCampaigns = async () => {
    setLoadingCampaigns(true);
    try {
      const res = await fetch(getApiUrl('/api/health-promotion/campaigns'));
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (e) {
      console.error('Error fetching health campaigns:', e);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const fetchTips = async () => {
    try {
      const res = await fetch(getApiUrl('/api/health-promotion/tips'));
      if (res.ok) {
        const data = await res.json();
        setTips(data);
      }
    } catch (e) {
      console.error('Error fetching health tips:', e);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchTips();
  }, []);

  const handleSupportCampaign = async (id: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/health-promotion/campaigns/${id}/support`), { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setCampaigns(prev =>
          prev.map(c => (c.id === id ? { ...c, supporters: data.supporters } : c))
        );
      }
    } catch (e) {
      setCampaigns(prev =>
        prev.map(c => (c.id === id ? { ...c, supporters: c.supporters + 1 } : c))
      );
    }
  };

  const handleLikeTip = async (id: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/health-promotion/tips/${id}/like`), { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setTips(prev =>
          prev.map(t => (t.id === id ? { ...t, likes: data.likes } : t))
        );
      }
    } catch (e) {
      setTips(prev =>
        prev.map(t => (t.id === id ? { ...t, likes: t.likes + 1 } : t))
      );
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newLocation || !newOrganizer) return;

    setSubmittingCampaign(true);
    try {
      const res = await fetch(getApiUrl('/api/health-promotion/campaigns'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          description: newDescription,
          location: newLocation,
          organizer: newOrganizer,
          targetImpact: newTargetImpact || 'Global Community Impact'
        })
      });

      if (res.ok) {
        const added = await res.json();
        setCampaigns(prev => [added, ...prev]);
        setSubmitMsg('Campaign successfully launched!');
        setTimeout(() => {
          setSubmitMsg('');
          setShowSubmitModal(false);
          setNewTitle('');
          setNewDescription('');
          setNewLocation('');
          setNewOrganizer('');
          setNewTargetImpact('');
        }, 1500);
      }
    } catch (e) {
      console.error('Failed to submit campaign:', e);
    } finally {
      setSubmittingCampaign(false);
    }
  };

  const handleCreateTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTipTitle || !newTipContent || !newTipAuthor) return;

    setSubmittingTip(true);
    try {
      const res = await fetch(getApiUrl('/api/health-promotion/tips'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTipTitle,
          category: newTipCategory,
          content: newTipContent,
          author: newTipAuthor
        })
      });

      if (res.ok) {
        const added = await res.json();
        setTips(prev => [added, ...prev]);
        setShowTipModal(false);
        setNewTipTitle('');
        setNewTipContent('');
        setNewTipAuthor('');
      }
    } catch (e) {
      console.error('Failed to publish tip:', e);
    } finally {
      setSubmittingTip(false);
    }
  };

  const handleCalculateHealth = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    try {
      const res = await fetch(getApiUrl('/api/health-promotion/assessment'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weightKg,
          heightCm,
          age,
          dailyWaterLiters: waterLiters
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAssessmentResult(data.assessment);
      }
    } catch (e) {
      console.error('Failed to run assessment:', e);
    } finally {
      setCalculating(false);
    }
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchesCat = campaignCategory === 'All' || c.category === campaignCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchCampaignQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchCampaignQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchCampaignQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredTips = tipCategory === 'All'
    ? tips
    : tips.filter(t => t.category === tipCategory);

  return (
    <>
      <Head>
        <title>Global Health Promotion & Well-being | Mawaba</title>
        <meta
          name="description"
          content="Promoting global health equity, preventative care, mental well-being, universal healthcare coverage, and UN SDG 3 initiatives across local communities."
        />
      </Head>

      <main className="min-h-screen bg-rose-50/30 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Hero Banner Header */}
          <header className="bg-gradient-to-r from-rose-900 via-red-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-10 -mr-10 opacity-10 pointer-events-none">
              <Heart className="w-96 h-96 text-rose-300" />
            </div>
            <div className="relative z-10 max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/30 px-3.5 py-1.5 rounded-full text-rose-200 text-xs font-bold tracking-wide uppercase">
                <Activity className="w-4 h-4 text-rose-400" /> UN SDG 3: Good Health & Well-being For All
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Empowering Communities Through Global Health Equity
              </h1>
              <p className="text-rose-100 text-base sm:text-lg leading-relaxed font-normal">
                Mobilizing universal healthcare access, epidemic disease prevention, mental well-being awareness, maternal-child health tele-care, and preventative wellness tools worldwide.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    setActiveTab('calculator');
                  }}
                  className="bg-rose-500 hover:bg-rose-600 text-slate-950 font-extrabold px-6 py-3 rounded-2xl shadow-lg shadow-rose-900/40 transition-all flex items-center gap-2 text-sm"
                >
                  <Calculator className="w-4 h-4" /> Check Personal Health & BMI Score
                </button>
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-6 py-3 rounded-2xl transition-all flex items-center gap-2 text-sm"
                >
                  <PlusCircle className="w-4 h-4 text-rose-300" /> Launch Health Campaign
                </button>
              </div>
            </div>
          </header>

          {/* Quick Metrics Cards */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <article className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-rose-600">
                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">Global Health Drive</span>
                <Heart className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{campaigns.length}</p>
              <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Active field drives
              </p>
            </article>

            <article className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-blue-600">
                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">Community Supporters</span>
                <UserCheck className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">
                {campaigns.reduce((acc, c) => acc + c.supporters, 0).toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Global advocate backers
              </p>
            </article>

            <article className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-teal-600">
                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">Wellness Guidance</span>
                <Apple className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{tips.length}</p>
              <p className="text-xs text-teal-600 font-semibold flex items-center gap-1">
                <Brain className="w-3.5 h-3.5" /> Verified preventative tips
              </p>
            </article>

            <article className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-amber-600">
                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">Target Goal</span>
                <Building2 className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">SDG 3</p>
              <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% WHO alignment
              </p>
            </article>
          </section>

          {/* Interactive Navigation Tabs */}
          <nav className="flex flex-wrap gap-3 border-b border-gray-200 pb-4">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'campaigns'
                  ? 'bg-rose-700 text-white shadow-lg shadow-rose-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Heart className="w-4 h-4" /> Field Campaigns & Disease Control
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'calculator'
                  ? 'bg-rose-700 text-white shadow-lg shadow-rose-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Calculator className="w-4 h-4" /> Personal Health & BMI Assessment
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'tips'
                  ? 'bg-rose-700 text-white shadow-lg shadow-rose-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Brain className="w-4 h-4" /> Preventative Tips & Mental Health
            </button>
            <button
              onClick={() => setActiveTab('sdg3')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'sdg3'
                  ? 'bg-rose-700 text-white shadow-lg shadow-rose-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Globe className="w-4 h-4" /> UN SDG 3 Global Framework
            </button>
          </nav>

          {/* TAB 1: HEALTH CAMPAIGNS */}
          {activeTab === 'campaigns' && (
            <section className="space-y-6">
              {/* Category & Search Controls */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search health drives or locations..."
                    value={searchCampaignQuery}
                    onChange={e => setSearchCampaignQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {['All', 'Epidemic & Disease Control', 'Maternal & Child Health', 'Mental Health & Well-being', 'Clean Water & Sanitation'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCampaignCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        campaignCategory === cat
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campaigns Grid */}
              {loadingCampaigns ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                  <p className="text-gray-500 font-medium">Loading health campaigns...</p>
                </div>
              ) : filteredCampaigns.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
                  <Info className="w-10 h-10 text-gray-400 mx-auto" />
                  <h3 className="text-lg font-bold text-gray-800">No health campaigns found</h3>
                  <p className="text-sm text-gray-500">Be the first to launch a campaign for {campaignCategory}!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCampaigns.map((item) => (
                    <article
                      key={item.id}
                      className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="bg-rose-50 text-rose-700 font-extrabold text-xs px-2.5 py-1 rounded-lg border border-rose-100">
                            {item.category}
                          </span>
                          <span className="text-xs font-semibold text-gray-400">
                            <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleDateString()}</time>
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 leading-snug">{item.title}</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                      </div>

                      <div className="bg-rose-50/60 p-3.5 rounded-xl space-y-1 text-xs border border-rose-100">
                        <p className="text-rose-950 font-extrabold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Target Impact: {item.targetImpact}
                        </p>
                        <p className="text-gray-500">Location: <span className="font-semibold text-gray-800">{item.location}</span></p>
                        <p className="text-gray-500">Organizer: <span className="font-semibold text-gray-800">{item.organizer}</span></p>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <button
                          onClick={() => handleSupportCampaign(item.id)}
                          className="flex items-center gap-2 text-xs font-bold bg-gray-50 hover:bg-rose-50 text-gray-700 hover:text-rose-700 px-3.5 py-2 rounded-xl transition-colors border border-gray-200"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" /> Support Drive ({item.supporters})
                        </button>

                        <span className="text-xs text-gray-400 font-medium">
                          Verified Health Action
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB 2: HEALTH & BMI CALCULATOR */}
          {activeTab === 'calculator' && (
            <section className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm space-y-8">
              <header className="space-y-2 border-b border-gray-100 pb-6">
                <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 font-extrabold text-xs px-3 py-1 rounded-lg">
                  <Calculator className="w-4 h-4" /> Personal Health & Hydration Assessment
                </div>
                <h2 className="text-2xl font-black text-gray-900">Biometric Health & Hydration Calculator</h2>
                <p className="text-sm text-gray-500 max-w-2xl">
                  Calculate your Body Mass Index (BMI), optimal daily hydration baseline, and receive tailored WHO-aligned preventative advice.
                </p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form onSubmit={handleCalculateHealth} className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Body Weight (kg)</label>
                      <input
                        type="number"
                        min="20"
                        max="300"
                        required
                        value={weightKg}
                        onChange={e => setWeightKg(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Height (cm)</label>
                      <input
                        type="number"
                        min="80"
                        max="250"
                        required
                        value={heightCm}
                        onChange={e => setHeightCm(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Age (Years)</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        required
                        value={age}
                        onChange={e => setAge(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-700">
                      <label htmlFor="waterRange">Current Daily Water Intake (Liters):</label>
                      <output htmlFor="waterRange" className="text-rose-700 font-mono text-sm">{waterLiters} L / day</output>
                    </div>
                    <input
                      id="waterRange"
                      type="range"
                      min="0.5"
                      max="6"
                      step="0.5"
                      value={waterLiters}
                      onChange={(e) => setWaterLiters(Number(e.target.value))}
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={calculating}
                    className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-8 py-3.5 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {calculating ? 'Analyzing...' : 'Run Health Assessment'} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Result Summary Card */}
                <aside className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 flex flex-col justify-between shadow-xl">
                  {assessmentResult ? (
                    <div className="space-y-5">
                      <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-xs font-bold px-3 py-1 rounded-full uppercase">
                        Biometric Summary
                      </span>

                      <div className="space-y-1">
                        <p className="text-4xl font-black text-rose-400">
                          BMI: {assessmentResult.bmi}
                        </p>
                        <p className="text-sm font-bold text-slate-200">Category: {assessmentResult.bmiCategory}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 space-y-3 text-xs">
                        <div className="flex items-center gap-2 text-rose-300">
                          <Droplets className="w-5 h-5 flex-shrink-0" />
                          <span>Recommended Water: <strong className="text-white text-sm">{assessmentResult.recommendedWaterLiters} L/day</strong> ({assessmentResult.hydrationStatus})</span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                          {assessmentResult.healthAdvice}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-center py-8">
                      <Activity className="w-12 h-12 text-rose-400 mx-auto animate-pulse" />
                      <h3 className="text-lg font-bold">Biometric Analysis Ready</h3>
                      <p className="text-xs text-slate-400">Enter your parameters and click &quot;Run Health Assessment&quot; to view your BMI and hydration metrics.</p>
                    </div>
                  )}

                  <div className="text-xs text-slate-400 text-center border-t border-slate-800 pt-4">
                    Aligned with WHO & UN SDG 3 Standards
                  </div>
                </aside>
              </div>
            </section>
          )}

          {/* TAB 3: HEALTH TIPS & PREVENTATIVE CARE */}
          {activeTab === 'tips' && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Preventative Wellness & Mental Health Guidelines</h2>
                  <p className="text-xs text-gray-500">Community shared health knowledge, physical exercise routines, and stress management.</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTipModal(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" /> Share Wellness Tip
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredTips.map((tip) => (
                  <article
                    key={tip.id}
                    className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <span className="bg-rose-50 text-rose-700 font-extrabold text-xs px-2.5 py-1 rounded-lg border border-rose-100">
                        {tip.category}
                      </span>
                      <h3 className="text-base font-bold text-gray-900">{tip.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{tip.content}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-medium">By {tip.author}</span>
                      <button
                        onClick={() => handleLikeTip(tip.id)}
                        className="flex items-center gap-1.5 text-rose-600 font-bold bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" /> {tip.likes}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* TAB 4: UN SDG 3 FRAMEWORK */}
          {activeTab === 'sdg3' && (
            <section className="space-y-6">
              <header className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-2">
                <h2 className="text-2xl font-black text-gray-900">United Nations Sustainable Development Goal 3 (SDG 3)</h2>
                <p className="text-sm text-gray-500 max-w-2xl">
                  Ensure healthy lives and promote well-being for all at all ages through global partnerships, epidemic response, and resilient health infrastructure.
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <article className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4 border-t-4 border-t-rose-600">
                  <div className="bg-rose-50 text-rose-800 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg">
                    3.1
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Maternal & Infant Mortality</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    By 2030, reduce the global maternal mortality ratio to less than 70 per 100,000 live births and end preventable deaths of newborns and children under 5.
                  </p>
                </article>

                <article className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4 border-t-4 border-t-blue-600">
                  <div className="bg-blue-50 text-blue-800 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg">
                    3.3
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Communicable Epidemics</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    End the epidemics of AIDS, tuberculosis, malaria, and neglected tropical diseases, and combat hepatitis, waterborne diseases, and emerging infections.
                  </p>
                </article>

                <article className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4 border-t-4 border-t-teal-600">
                  <div className="bg-teal-50 text-teal-800 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg">
                    3.8
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Universal Health Coverage</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Achieve universal health coverage (UHC), including financial risk protection, access to quality essential health-care services, and safe, effective vaccines for all.
                  </p>
                </article>
              </div>
            </section>
          )}

          {/* LAUNCH CAMPAIGN MODAL */}
          {showSubmitModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-xl w-full p-8 space-y-6 border border-gray-200 shadow-2xl relative animate-in fade-in">
                <header className="space-y-1">
                  <h2 className="text-2xl font-black text-gray-900">Launch Global Health Drive</h2>
                  <p className="text-xs text-gray-500">Publish a new health initiative to rally community support.</p>
                </header>

                {submitMsg ? (
                  <div className="bg-rose-50 text-rose-800 p-4 rounded-2xl text-xs font-bold text-center border border-rose-200">
                    {submitMsg}
                  </div>
                ) : (
                  <form onSubmit={handleCreateCampaign} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Drive / Campaign Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rural Tele-Ultrasound Mobile Clinic"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                        <select
                          value={newCategory}
                          onChange={e => setNewCategory(e.target.value as any)}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                        >
                          <option value="Epidemic & Disease Control">Epidemic & Disease Control</option>
                          <option value="Maternal & Child Health">Maternal & Child Health</option>
                          <option value="Mental Health & Well-being">Mental Health & Well-being</option>
                          <option value="Nutrition & Food Security">Nutrition & Food Security</option>
                          <option value="Universal Health Coverage">Universal Health Coverage</option>
                          <option value="Clean Water & Sanitation">Clean Water & Sanitation</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Location / Region</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Lagos, Nigeria"
                          value={newLocation}
                          onChange={e => setNewLocation(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Target Impact</label>
                      <input
                        type="text"
                        placeholder="e.g. 10,000 Vaccines Administered"
                        value={newTargetImpact}
                        onChange={e => setNewTargetImpact(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Organization / Lead Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Health Equity Alliance"
                        value={newOrganizer}
                        onChange={e => setNewOrganizer(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Campaign Description</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Describe the medical goals, target population, and key healthcare outcomes..."
                        value={newDescription}
                        onChange={e => setNewDescription(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      ></textarea>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowSubmitModal(false)}
                        className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-xs transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submittingCampaign}
                        className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold text-xs transition-all shadow-md disabled:opacity-50"
                      >
                        {submittingCampaign ? 'Publishing...' : 'Launch Drive'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* SHARE WELLNESS TIP MODAL */}
          {showTipModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-8 space-y-6 border border-gray-200 shadow-2xl relative animate-in fade-in">
                <header className="space-y-1">
                  <h2 className="text-xl font-black text-gray-900">Share Wellness Guidance</h2>
                  <p className="text-xs text-gray-500">Provide actionable preventative health or mental wellness advice.</p>
                </header>

                <form onSubmit={handleCreateTip} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Tip Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hydration & Micro-break Routine"
                      value={newTipTitle}
                      onChange={e => setNewTipTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                    <select
                      value={newTipCategory}
                      onChange={e => setNewTipCategory(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    >
                      <option value="Wellness & Prevention">Wellness & Prevention</option>
                      <option value="Mental Well-being">Mental Well-being</option>
                      <option value="Nutrition">Nutrition</option>
                      <option value="Physical Activity">Physical Activity</option>
                      <option value="Hygiene & Cleanliness">Hygiene & Cleanliness</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Name / Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Sarah Lin"
                      value={newTipAuthor}
                      onChange={e => setNewTipAuthor(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Tip Content</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Detail practical steps for healthy living..."
                      value={newTipContent}
                      onChange={e => setNewTipContent(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowTipModal(false)}
                      className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingTip}
                      className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold text-xs transition-all shadow-md disabled:opacity-50"
                    >
                      {submittingTip ? 'Publishing...' : 'Publish Tip'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
