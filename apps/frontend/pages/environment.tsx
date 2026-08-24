import { getApiUrl, API_BASE_URL } from '../components/apiConfig';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Leaf,
  Wind,
  Droplets,
  Sun,
  Recycle,
  TreePine,
  ShieldCheck,
  TrendingUp,
  PlusCircle,
  ThumbsUp,
  Calculator,
  Award,
  Globe,
  Share2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface Initiative {
  id: string;
  title: string;
  category: 'Climate Action' | 'Ocean & Marine' | 'Reforestation' | 'Renewable Energy' | 'Circular Economy';
  description: string;
  location: string;
  impact: string;
  author: string;
  upvotes: number;
  createdAt: string;
}

interface PledgeStats {
  totalPledges: number;
  totalCo2ReductionKg: number;
}

export default function EnvironmentProtectionPage() {
  const [activeTab, setActiveTab] = useState<'initiatives' | 'calculator' | 'sdgs' | 'tech'>('initiatives');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Initiatives state
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loadingInitiatives, setLoadingInitiatives] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // New Initiative Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Climate Action' | 'Ocean & Marine' | 'Reforestation' | 'Renewable Energy' | 'Circular Economy'>('Climate Action');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newImpact, setNewImpact] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [submittingInitiative, setSubmittingInitiative] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');

  // Eco-Pledge Stats State
  const [pledgeStats, setPledgeStats] = useState<PledgeStats>({ totalPledges: 3, totalCo2ReductionKg: 4250 });

  // Carbon Impact Calculator State
  const [weeklyKm, setWeeklyKm] = useState<number>(120);
  const [dietType, setDietType] = useState<string>('omnivore'); // omnivore, flexitarian, vegetarian, vegan
  const [renewablePercent, setRenewablePercent] = useState<number>(30);
  const [recyclingRate, setRecyclingRate] = useState<number>(50);

  // Calculated Metrics
  const calculateCo2Estimate = () => {
    // Base travel CO2 (kg/yr): 0.17 kg CO2/km
    const travelCo2 = weeklyKm * 52 * 0.17;

    // Diet factor (kg/yr)
    let dietCo2 = 2500;
    if (dietType === 'flexitarian') dietCo2 = 1800;
    if (dietType === 'vegetarian') dietCo2 = 1200;
    if (dietType === 'vegan') dietCo2 = 800;

    // Electricity factor based on renewable %
    const powerCo2 = 2000 * (1 - renewablePercent / 100);

    // Recycling factor
    const recyclingDiscount = (recyclingRate / 100) * 300;

    const total = Math.max(200, Math.round(travelCo2 + dietCo2 + powerCo2 - recyclingDiscount));
    const treeEquivalent = Math.round(total / 22); // ~22kg CO2 per tree per year
    return { total, treeEquivalent };
  };

  const { total: calcCo2, treeEquivalent: calcTrees } = calculateCo2Estimate();

  // Load initiatives & pledge stats
  const fetchInitiatives = async () => {
    setLoadingInitiatives(true);
    try {
      const res = await fetch(getApiUrl('/api/environment/initiatives'));
      if (res.ok) {
        const data = await res.json();
        setInitiatives(data);
      }
    } catch (e) {
      console.error('Error fetching initiatives:', e);
      // Fallback data if backend is offline
      setInitiatives([
        {
          id: 'env-1',
          title: 'Coastal Mangrove Ecosystem Restoration',
          category: 'Ocean & Marine',
          description: 'Planting native red mangrove trees along coastal zones to prevent storm surges, enhance ocean biodiversity, and sequester blue carbon.',
          location: 'Mombasa, Kenya',
          impact: '150,000 Trees Planted • 45,000 Tons CO2 Sequestered/Yr',
          author: 'Blue Planet Alliance',
          upvotes: 42,
          createdAt: new Date().toISOString()
        },
        {
          id: 'env-2',
          title: 'Community Solar Microgrid & Energy Storage',
          category: 'Renewable Energy',
          description: 'Installing decentralized solar microgrids in rural off-grid agricultural communities to reduce diesel generator reliance.',
          location: 'Oaxaca, Mexico',
          impact: '1.2 MW Clean Energy • 3,500 Families Powered',
          author: 'Solar Action Network',
          upvotes: 38,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoadingInitiatives(false);
    }
  };

  const fetchPledges = async () => {
    try {
      const res = await fetch(getApiUrl('/api/environment/pledges'));
      if (res.ok) {
        const data = await res.json();
        setPledgeStats({
          totalPledges: data.totalPledges || 3,
          totalCo2ReductionKg: data.totalCo2ReductionKg || 4250
        });
      }
    } catch (e) {
      console.error('Error fetching pledges:', e);
    }
  };

  useEffect(() => {
    fetchInitiatives();
    fetchPledges();
  }, []);

  const handleUpvote = async (id: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/environment/initiatives/${id}/upvote`), { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setInitiatives(prev =>
          prev.map(item => (item.id === id ? { ...item, upvotes: data.upvotes } : item))
        );
      }
    } catch (e) {
      // Optimistic update
      setInitiatives(prev =>
        prev.map(item => (item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item))
      );
    }
  };

  const handleCreateInitiative = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newLocation || !newAuthor) return;

    setSubmittingInitiative(true);
    try {
      const res = await fetch(getApiUrl('/api/environment/initiatives'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          description: newDescription,
          location: newLocation,
          impact: newImpact || 'Community Green Project',
          author: newAuthor
        })
      });

      if (res.ok) {
        const added = await res.json();
        setInitiatives(prev => [added, ...prev]);
        setSubmitSuccessMsg('Your environment protection project was successfully published!');
        setTimeout(() => {
          setSubmitSuccessMsg('');
          setShowSubmitModal(false);
          setNewTitle('');
          setNewDescription('');
          setNewLocation('');
          setNewImpact('');
          setNewAuthor('');
        }, 1500);
      }
    } catch (e) {
      console.error('Failed to submit initiative:', e);
    } finally {
      setSubmittingInitiative(false);
    }
  };

  const filteredInitiatives = categoryFilter === 'All'
    ? initiatives
    : initiatives.filter(i => i.category === categoryFilter);

  return (
    <>
      <Head>
        <title>Environment Protection & Sustainability | Mawaba</title>
        <meta
          name="description"
          content="Join Mawaba's global environment protection network. Explore climate action initiatives, calculate your carbon footprint, make eco pledges, and support sustainable innovation."
        />
      </Head>

      <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Header Hero Section */}
          <header className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-10 -mr-10 opacity-10 pointer-events-none">
              <Leaf className="w-96 h-96 text-emerald-300" />
            </div>
            <div className="relative z-10 max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-emerald-200 text-xs font-bold tracking-wide uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Global Climate Protection & Biodiversity Initiative
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Protecting Our Planet Through Innovation & Action
              </h1>
              <p className="text-emerald-100 text-base sm:text-lg leading-relaxed font-normal">
                Connecting global eco-innovators, community restoration projects, carbon offset intelligence, and UN Sustainable Development Goal tracking to preserve ecosystems for generations to come.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/environment/pledge"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold px-6 py-3 rounded-2xl shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-2 text-sm"
                >
                  <Award className="w-4 h-4" /> Take Climate Pledge & Get Badge
                </Link>
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-6 py-3 rounded-2xl transition-all flex items-center gap-2 text-sm"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-300" /> Submit Environmental Project
                </button>
              </div>
            </div>
          </header>

          {/* Quick Metrics Banner */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <article className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-emerald-600">
                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">Global Eco-Pledges</span>
                <Award className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{pledgeStats.totalPledges}</p>
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Growing global community
              </p>
            </article>

            <article className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-blue-600">
                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">CO2 Abated (Pledged)</span>
                <Wind className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{(pledgeStats.totalCo2ReductionKg / 1000).toFixed(1)} <span className="text-base font-bold text-gray-500">Tons</span></p>
              <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Estimated annual offset
              </p>
            </article>

            <article className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-teal-600">
                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">Active Restoration</span>
                <TreePine className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{initiatives.length}</p>
              <p className="text-xs text-teal-600 font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Multi-region field projects
              </p>
            </article>

            <article className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-amber-600">
                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">Clean Energy Impact</span>
                <Sun className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">100%</p>
              <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified green standards
              </p>
            </article>
          </section>

          {/* Interactive HTML5 Tabs */}
          <nav className="flex flex-wrap gap-3 border-b border-gray-200 pb-4">
            <button
              onClick={() => setActiveTab('initiatives')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'initiatives'
                  ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <TreePine className="w-4 h-4" /> Restoration & Field Initiatives
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'calculator'
                  ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Calculator className="w-4 h-4" /> Carbon Footprint Calculator
            </button>
            <button
              onClick={() => setActiveTab('sdgs')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'sdgs'
                  ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Globe className="w-4 h-4" /> UN Environmental SDGs
            </button>
            <button
              onClick={() => setActiveTab('tech')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'tech'
                  ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Sun className="w-4 h-4" /> Green Tech & Circular Economy
            </button>
          </nav>

          {/* TAB 1: FIELD INITIATIVES */}
          {activeTab === 'initiatives' && (
            <section className="space-y-6">
              {/* Category Filters */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Community Environmental Initiatives</h2>
                  <p className="text-xs text-gray-500">Discover and support grassroots environmental projects around the world.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['All', 'Climate Action', 'Ocean & Marine', 'Reforestation', 'Renewable Energy', 'Circular Economy'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        categoryFilter === cat
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Initiatives List */}
              {loadingInitiatives ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                  <p className="text-gray-500 font-medium">Loading initiatives...</p>
                </div>
              ) : filteredInitiatives.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
                  <Info className="w-10 h-10 text-gray-400 mx-auto" />
                  <h3 className="text-lg font-bold text-gray-800">No projects found in this category</h3>
                  <p className="text-sm text-gray-500">Be the first to submit a project for {categoryFilter}!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredInitiatives.map((item) => (
                    <article
                      key={item.id}
                      className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="bg-emerald-50 text-emerald-700 font-extrabold text-xs px-2.5 py-1 rounded-lg border border-emerald-100">
                            {item.category}
                          </span>
                          <span className="text-xs font-semibold text-gray-400">
                            <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleDateString()}</time>
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 leading-snug">{item.title}</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                      </div>

                      <div className="bg-emerald-50/60 p-3 rounded-xl space-y-1.5 text-xs border border-emerald-100">
                        <p className="text-emerald-900 font-extrabold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Key Impact: {item.impact}
                        </p>
                        <p className="text-gray-500">Location: <span className="font-semibold text-gray-800">{item.location}</span></p>
                        <p className="text-gray-500">Published by: <span className="font-semibold text-gray-800">{item.author}</span></p>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <button
                          onClick={() => handleUpvote(item.id)}
                          className="flex items-center gap-2 text-xs font-bold bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 px-3.5 py-2 rounded-xl transition-colors border border-gray-200"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" /> Support Project ({item.upvotes})
                        </button>

                        <span className="text-xs text-gray-400 font-medium">
                          Verified Community Action
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB 2: CARBON FOOTPRINT CALCULATOR */}
          {activeTab === 'calculator' && (
            <section className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm space-y-8">
              <header className="space-y-2 border-b border-gray-100 pb-6">
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-lg">
                  <Calculator className="w-4 h-4" /> HTML5 Interactive Calculator
                </div>
                <h2 className="text-2xl font-black text-gray-900">Personal & Household Carbon Footprint Estimator</h2>
                <p className="text-sm text-gray-500 max-w-2xl">
                  Adjust the sliders below to estimate your annual carbon dioxide emissions and see how simple lifestyle choices reduce your environmental impact.
                </p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* HTML5 Form Controls */}
                <form className="lg:col-span-2 space-y-6" onSubmit={e => e.preventDefault()}>
                  <fieldset className="p-5 border border-gray-200 rounded-2xl space-y-4">
                    <legend className="px-2 font-bold text-xs uppercase tracking-wider text-emerald-800 bg-white">
                      Transportation & Commute
                    </legend>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-gray-700">
                        <label htmlFor="travelRange">Weekly Vehicle / Motor Travel (km):</label>
                        <output htmlFor="travelRange" className="text-emerald-700 font-mono text-sm">{weeklyKm} km/week</output>
                      </div>
                      <input
                        id="travelRange"
                        type="range"
                        min="0"
                        max="500"
                        step="10"
                        value={weeklyKm}
                        onChange={(e) => setWeeklyKm(Number(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                      <p className="text-xs text-gray-400">Includes personal automobile driving or taxi transit.</p>
                    </div>
                  </fieldset>

                  <fieldset className="p-5 border border-gray-200 rounded-2xl space-y-4">
                    <legend className="px-2 font-bold text-xs uppercase tracking-wider text-emerald-800 bg-white">
                      Dietary Footprint
                    </legend>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'omnivore', label: 'Omnivore' },
                        { id: 'flexitarian', label: 'Flexitarian' },
                        { id: 'vegetarian', label: 'Vegetarian' },
                        { id: 'vegan', label: 'Vegan' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setDietType(item.id)}
                          className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all text-center border ${
                            dietType === item.id
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="p-5 border border-gray-200 rounded-2xl space-y-4">
                    <legend className="px-2 font-bold text-xs uppercase tracking-wider text-emerald-800 bg-white">
                      Household Renewable Energy & Recycling
                    </legend>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-700">
                          <label htmlFor="solarRange">Home Electricity from Clean/Renewable Sources:</label>
                          <output htmlFor="solarRange" className="text-emerald-700 font-mono text-sm">{renewablePercent}%</output>
                        </div>
                        <input
                          id="solarRange"
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={renewablePercent}
                          onChange={(e) => setRenewablePercent(Number(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-700">
                          <label htmlFor="recycleRange">Waste Recycling & Composting Rate:</label>
                          <output htmlFor="recycleRange" className="text-emerald-700 font-mono text-sm">{recyclingRate}%</output>
                        </div>
                        <input
                          id="recycleRange"
                          type="range"
                          min="0"
                          max="100"
                          step="10"
                          value={recyclingRate}
                          onChange={(e) => setRecyclingRate(Number(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  </fieldset>
                </form>

                {/* Impact Output Summary Card */}
                <aside className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 flex flex-col justify-between shadow-xl">
                  <div className="space-y-4">
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold px-3 py-1 rounded-full uppercase">
                      Estimated Carbon Footprint
                    </span>

                    <div className="space-y-1">
                      <p className="text-4xl sm:text-5xl font-black text-emerald-400">
                        {calcCo2.toLocaleString()} <span className="text-lg font-bold text-slate-300">kg CO2/yr</span>
                      </p>
                      <p className="text-xs text-slate-400">Equivalent to approximately {(calcCo2 / 1000).toFixed(2)} metric tons of CO2 per year.</p>
                    </div>

                    <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
                      <div className="flex items-center gap-2 text-emerald-300">
                        <TreePine className="w-5 h-5 flex-shrink-0" />
                        <span>Requires ~<strong className="text-white text-sm">{calcTrees} mature trees</strong> for 1 year to absorb.</span>
                      </div>
                      <div className="flex items-center gap-2 text-teal-300">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <span>Switching to 100% renewables saves up to 2,000 kg CO2/yr.</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/environment/pledge"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 rounded-2xl text-center text-xs transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    Lock In Climate Pledge & Save Impact <ArrowRight className="w-4 h-4" />
                  </Link>
                </aside>
              </div>
            </section>
          )}

          {/* TAB 3: UN ENVIRONMENTAL SDGS */}
          {activeTab === 'sdgs' && (
            <section className="space-y-6">
              <header className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-2">
                <h2 className="text-2xl font-black text-gray-900">United Nations Sustainable Development Goals (SDGs)</h2>
                <p className="text-sm text-gray-500 max-w-2xl">
                  Mawaba aligns global projects and business ideas with key environmental frameworks established by the UN.
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <article className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4 border-t-4 border-t-emerald-600">
                  <div className="bg-emerald-50 text-emerald-800 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg">
                    13
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">SDG 13: Climate Action</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Take urgent action to combat climate change and its impacts through renewable energy adoption, greenhouse gas reduction, and resilient community planning.
                  </p>
                </article>

                <article className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4 border-t-4 border-t-blue-600">
                  <div className="bg-blue-50 text-blue-800 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg">
                    14
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">SDG 14: Life Below Water</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Conserve and sustainably use oceans, seas, and marine resources. Protecting coral reefs, reducing ocean plastics, and restoring coastal mangroves.
                  </p>
                </article>

                <article className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4 border-t-4 border-t-teal-600">
                  <div className="bg-teal-50 text-teal-800 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg">
                    15
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">SDG 15: Life on Land</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Protect, restore, and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt biodiversity loss.
                  </p>
                </article>
              </div>
            </section>
          )}

          {/* TAB 4: GREEN TECH */}
          {activeTab === 'tech' && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <article className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="bg-amber-50 text-amber-600 p-3.5 w-fit rounded-2xl">
                  <Sun className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">AI & Renewable Energy Forecasting</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Integrating machine learning with solar and wind telemetry optimizes grid distribution, predicts peak generation hours, and minimizes energy waste.
                </p>
              </article>

              <article className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="bg-emerald-50 text-emerald-600 p-3.5 w-fit rounded-2xl">
                  <Recycle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Circular Economy & Materials Upcycling</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Eliminating waste through closed-loop supply chains, enabling businesses to repurpose raw materials, reduce plastic manufacturing, and achieve carbon neutrality.
                </p>
              </article>
            </section>
          )}

          {/* SUBMIT INITIATIVE MODAL */}
          {showSubmitModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-xl w-full p-8 space-y-6 border border-gray-200 shadow-2xl relative animate-in fade-in">
                <header className="space-y-1">
                  <h2 className="text-2xl font-black text-gray-900">Publish Environmental Project</h2>
                  <p className="text-xs text-gray-500">Share your restoration initiative with the global Mawaba network.</p>
                </header>

                {submitSuccessMsg ? (
                  <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl text-xs font-bold text-center border border-emerald-200">
                    {submitSuccessMsg}
                  </div>
                ) : (
                  <form onSubmit={handleCreateInitiative} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Project Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rainforest Reforestation Corridor"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                        <select
                          value={newCategory}
                          onChange={e => setNewCategory(e.target.value as any)}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="Climate Action">Climate Action</option>
                          <option value="Ocean & Marine">Ocean & Marine</option>
                          <option value="Reforestation">Reforestation</option>
                          <option value="Renewable Energy">Renewable Energy</option>
                          <option value="Circular Economy">Circular Economy</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Location / Country</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Nairobi, Kenya"
                          value={newLocation}
                          onChange={e => setNewLocation(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Impact Summary</label>
                      <input
                        type="text"
                        placeholder="e.g. 50,000 Trees Planted • 2,000 Tons CO2 Saved"
                        value={newImpact}
                        onChange={e => setNewImpact(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Organization / Author Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Green Earth Collective"
                        value={newAuthor}
                        onChange={e => setNewAuthor(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Project Description</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Describe the environmental goal, methodology, and ecological impact..."
                        value={newDescription}
                        onChange={e => setNewDescription(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                        disabled={submittingInitiative}
                        className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs transition-all shadow-md disabled:opacity-50"
                      >
                        {submittingInitiative ? 'Publishing...' : 'Submit Project'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
