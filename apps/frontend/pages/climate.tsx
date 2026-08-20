import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {
  Leaf,
  Sun,
  Wind,
  Droplets,
  TreePine,
  Zap,
  Calculator,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Globe2,
  Users,
  PlusCircle,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  BookOpen,
  Filter,
  Send,
  HeartHandshake
} from 'lucide-react';

interface ClimateSolution {
  id: string;
  title: string;
  category: string;
  description: string;
  impactScore: number;
  reductionPotentialGt: number;
  implementationCost: string;
  scalability: string;
  keyTechnologies: string[];
  sdgGoals: number[];
  caseStudy: string;
}

interface ClimateInitiative {
  id: string;
  title: string;
  location: string;
  category: string;
  description: string;
  organizer: string;
  targetImpact: string;
  supporters: number;
  status: string;
  createdAt: string;
}

const ClimatePage: NextPage = () => {
  // Solutions State
  const [solutions, setSolutions] = useState<ClimateSolution[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingSolutions, setLoadingSolutions] = useState<boolean>(true);

  // Calculator State
  const [renewablePercentage, setRenewablePercentage] = useState<number>(40);
  const [solarKw, setSolarKw] = useState<number>(5);
  const [treeCount, setTreeCount] = useState<number>(25);
  const [evKm, setEvKm] = useState<number>(8000);
  const [recycledKg, setRecycledKg] = useState<number>(150);
  const [calcResult, setCalcResult] = useState<any>(null);

  // Initiatives State
  const [initiatives, setInitiatives] = useState<ClimateInitiative[]>([]);
  const [initTitle, setInitTitle] = useState('');
  const [initLocation, setInitLocation] = useState('');
  const [initCategory, setInitCategory] = useState('Renewable Energy');
  const [initDesc, setInitDesc] = useState('');
  const [initOrganizer, setInitOrganizer] = useState('');
  const [initImpact, setInitImpact] = useState('');
  const [initMessage, setInitMessage] = useState('');

  // AI Tutor State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponseType, setAiResponseType] = useState('Explanation');
  const [aiLevel, setAiLevel] = useState('Intermediate');
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // World Bank Climate Indicator State
  const [wbCountry, setWbCountry] = useState('WLD');
  const [wbIndicator, setWbIndicator] = useState('EN.ATM.CO2E.PC'); // CO2 emissions per capita
  const [wbData, setWbData] = useState<any>(null);
  const [wbLoading, setWbLoading] = useState(false);

  // Fetch Solutions
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        let url = 'http://localhost:3001/api/climate/solutions';
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (searchQuery) params.append('search', searchQuery);
        if (params.toString()) url += `?${params.toString()}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setSolutions(data.solutions || []);
        }
      } catch (err) {
        console.warn('Backend climate solutions endpoint unavailable, using mock fallback.', err);
        setSolutions([
          {
            id: 'cs1',
            title: 'Utility-Scale Microgrid Solar & Battery Storage',
            category: 'Renewable Energy',
            description: 'Deploying modular solar photovoltaic arrays coupled with LFP battery energy storage systems for off-grid communities.',
            impactScore: 95,
            reductionPotentialGt: 7.2,
            implementationCost: 'Medium',
            scalability: 'Global',
            keyTechnologies: ['Borehole Thermal Storage', 'Perovskite Solar Cells', 'Smart Inverters'],
            sdgGoals: [7, 11, 13],
            caseStudy: 'Implemented across rural electrification projects in East Africa and South Pacific island networks.'
          },
          {
            id: 'cs2',
            title: 'Direct Air Capture (DAC) & Mineralization',
            category: 'Carbon Capture',
            description: 'Extracting ambient CO2 directly from atmosphere using solid-sorbent technology and permanently locking it into basaltic rock.',
            impactScore: 88,
            reductionPotentialGt: 5.5,
            implementationCost: 'Capital Intensive',
            scalability: 'Global',
            keyTechnologies: ['Solid Sorbent Filters', 'Geothermal Energy Extraction', 'Carbonation Pumps'],
            sdgGoals: [9, 12, 13],
            caseStudy: 'Mammoth plant operations in Iceland capturing and mineralizing 36,000 tons of CO2 annually.'
          },
          {
            id: 'cs3',
            title: 'Regenerative Agriculture & Biochar Soil Enhancement',
            category: 'Sustainable Agriculture',
            description: 'Combining minimal tillage, cover cropping, and pyrolyzed agricultural biomass (biochar) to restore soil fertility.',
            impactScore: 91,
            reductionPotentialGt: 4.8,
            implementationCost: 'Low',
            scalability: 'Global',
            keyTechnologies: ['Biomass Pyrolysis Reactors', 'Soil Carbon Remote Sensing', 'No-Till Seeders'],
            sdgGoals: [2, 13, 15],
            caseStudy: 'Smallholder farming collectives in Latin America improving yield by 25% while building soil carbon.'
          }
        ]);
      } finally {
        setLoadingSolutions(false);
      }
    };

    fetchSolutions();
  }, [selectedCategory, searchQuery]);

  // Fetch Initiatives
  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/climate/initiatives');
        if (res.ok) {
          const data = await res.json();
          setInitiatives(data);
        }
      } catch (err) {
        console.warn('Backend initiatives fallback');
      }
    };
    fetchInitiatives();
  }, []);

  // Calculate Impact
  useEffect(() => {
    const runCalculator = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/climate/calculator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            renewablePercentage,
            solarCapacityKw: solarKw,
            treeCount,
            evKmPerYear: evKm,
            wasteRecycledKg: recycledKg
          })
        });
        if (res.ok) {
          const data = await res.json();
          setCalcResult(data.results);
        }
      } catch (err) {
        // Local calculation fallback
        const solarSaved = solarKw * 1200 * 0.85;
        const treeSaved = treeCount * 22;
        const evSaved = (evKm / 100) * 12;
        const wasteSaved = recycledKg * 1.5;
        const gridSaved = (renewablePercentage / 100) * 3500;
        const totalKg = Math.round(solarSaved + treeSaved + evSaved + wasteSaved + gridSaved);
        setCalcResult({
          totalCo2SavedKg: totalKg,
          totalCo2SavedTons: +(totalKg / 1000).toFixed(2),
          equivalentTreesPlanted: Math.round(totalKg / 22),
          equivalentCarsOffRoad: +(totalKg / 4600).toFixed(1),
          impactGrade: totalKg > 5000 ? 'A+' : totalKg > 2000 ? 'A' : 'B+'
        });
      }
    };

    runCalculator();
  }, [renewablePercentage, solarKw, treeCount, evKm, recycledKg]);

  // Submit Initiative
  const handleInitiativeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initTitle || !initLocation || !initDesc || !initOrganizer) return;

    try {
      const res = await fetch('http://localhost:3001/api/climate/initiatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: initTitle,
          location: initLocation,
          category: initCategory,
          description: initDesc,
          organizer: initOrganizer,
          targetImpact: initImpact || '50 Tons CO2/yr'
        })
      });

      if (res.ok) {
        const created = await res.json();
        setInitiatives(prev => [created, ...prev]);
        setInitTitle('');
        setInitLocation('');
        setInitDesc('');
        setInitOrganizer('');
        setInitImpact('');
        setInitMessage('Climate initiative successfully registered!');
        setTimeout(() => setInitMessage(''), 4000);
      }
    } catch (err) {
      const simulated: ClimateInitiative = {
        id: Math.random().toString(),
        title: initTitle,
        location: initLocation,
        category: initCategory,
        description: initDesc,
        organizer: initOrganizer,
        targetImpact: initImpact || '50 Tons CO2/yr',
        supporters: 1,
        status: 'Proposed',
        createdAt: new Date().toISOString()
      };
      setInitiatives(prev => [simulated, ...prev]);
      setInitTitle('');
      setInitLocation('');
      setInitDesc('');
      setInitOrganizer('');
      setInitImpact('');
      setInitMessage('Registered locally (Offline mode).');
      setTimeout(() => setInitMessage(''), 4000);
    }
  };

  const handleSupportInitiative = async (id: string) => {
    setInitiatives(prev =>
      prev.map(i => (i.id === id ? { ...i, supporters: i.supporters + 1 } : i))
    );
    try {
      await fetch(`http://localhost:3001/api/climate/initiatives/${id}/support`, { method: 'POST' });
    } catch (err) {
      console.warn('Supported locally');
    }
  };

  // Ask AI Tutor
  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    setAiLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: aiQuestion,
          discipline: 'STEM & Sciences',
          level: aiLevel,
          responseType: aiResponseType
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiResponse(data);
      }
    } catch (err) {
      setAiResponse({
        answer: `Conceptual Breakdown: Climate change solutions require multi-disciplinary technologies. Addressing carbon output requires scaling renewables, improving industrial efficiency, and investing in nature-based carbon sinks.`,
        keyTakeaways: [
          'Renewable energy prevents emissions at the source.',
          'Nature-based carbon sinks restore biodiversity while capturing carbon.'
        ],
        followUpQuestions: [
          'What are the trade-offs between mechanical DAC and reforestation?'
        ]
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Fetch World Bank Data
  useEffect(() => {
    const fetchWbData = async () => {
      setWbLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/api/worldbank/indicators?country=${wbCountry}&indicator=${wbIndicator}`);
        if (res.ok) {
          const data = await res.json();
          setWbData(data);
        }
      } catch (err) {
        console.warn('World Bank API call fallback');
      } finally {
        setWbLoading(false);
      }
    };
    fetchWbData();
  }, [wbCountry, wbIndicator]);

  const categories = [
    'All',
    'Renewable Energy',
    'Carbon Capture',
    'Sustainable Agriculture',
    'Circular Economy',
    'Ocean & Forest',
    'Smart Mobility'
  ];

  return (
    <>
      <Head>
        <title>Climate Change Solutions & Action Portal | Mawaba</title>
        <meta
          name="description"
          content="Explore cutting-edge HTML5 climate change solutions, calculate personal/corporate CO2 impact reductions, and connect with global environmental initiatives."
        />
      </Head>

      {/* Semantic HTML5 Header & Hero */}
      <header className="relative bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white py-24 border-b border-emerald-900/40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
              <Leaf className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span>HTML5 Climate Action Framework</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Actionable <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Climate Change Solutions</span> for Our Planet
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed font-normal">
              Empowering global innovators, policymakers, and communities with data-driven technologies, carbon reduction calculators, and direct action initiatives to achieve net-zero emissions.
            </p>
            <nav className="pt-4 flex flex-wrap gap-4">
              <a
                href="#solutions-explorer"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-2"
              >
                Explore Solutions <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#impact-calculator"
                className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold px-6 py-3.5 rounded-xl text-sm transition-all flex items-center gap-2"
              >
                <Calculator className="h-4 w-4 text-emerald-400" /> CO2 Impact Calculator
              </a>
            </nav>
          </div>
        </div>

        {/* Ambient Glowing Background Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none"></div>
      </header>

      {/* Main Semantic HTML5 Content */}
      <main className="bg-slate-50 min-h-screen">

        {/* SECTION 1: KEY METRICS BANNER */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="block text-3xl font-black text-emerald-600">51 Gt</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Annual Global Emissions Target</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="block text-3xl font-black text-teal-600">100%</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clean Energy Transition Goal</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="block text-3xl font-black text-cyan-600">30x30</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Land & Ocean Protection Standard</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="block text-3xl font-black text-emerald-600">$4.5T</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Annual Clean Tech Investment Needed</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: SOLUTIONS EXPLORER */}
        <section id="solutions-explorer" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                  Global Technology Database
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2">Climate Solutions Explorer</h2>
                <p className="text-slate-500 text-sm mt-1">
                  High-impact technologies and ecological strategies categorized by sector and global reduction capacity.
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search solutions & tech..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <nav className="flex flex-wrap gap-2 pt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>

            {/* Solution Cards Grid */}
            {loadingSolutions ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-20 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : solutions.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                <p className="text-slate-500 text-sm font-medium">No solutions found matching your search filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {solutions.map((sol) => (
                  <article
                    key={sol.id}
                    className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                          {sol.category}
                        </span>
                        <div className="flex items-center gap-1 bg-slate-900 text-emerald-400 text-xs font-black px-2.5 py-1 rounded-lg">
                          <Sparkles className="h-3 w-3" />
                          <span>Score: {sol.impactScore}/100</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {sol.title}
                      </h3>

                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                        {sol.description}
                      </p>

                      {/* Technical Specs Badges */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-2 text-[11px]">
                        <div className="flex justify-between items-center text-slate-600">
                          <span className="font-bold flex items-center gap-1"><TrendingDown className="h-3.5 w-3.5 text-emerald-600" /> Reduction Potential:</span>
                          <span className="font-extrabold text-slate-900">{sol.reductionPotentialGt} Gt CO2/yr</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                          <span className="font-bold">Implementation Cost:</span>
                          <span className="font-semibold text-slate-800">{sol.implementationCost}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                          <span className="font-bold">Scalability Scope:</span>
                          <span className="font-semibold text-slate-800">{sol.scalability}</span>
                        </div>
                      </div>

                      {/* Key Technologies Tags */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400">Enabling Technologies:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {sol.keyTechnologies.map((tech) => (
                            <span key={tech} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Case Study Detail Toggle */}
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <details className="text-xs group/details">
                        <summary className="font-bold text-emerald-700 cursor-pointer hover:underline list-none flex items-center justify-between">
                          <span>View Case Study</span>
                          <ArrowRight className="h-3.5 w-3.5 group-open/details:rotate-90 transition-transform" />
                        </summary>
                        <p className="mt-2 text-slate-500 leading-relaxed italic bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                          {sol.caseStudy}
                        </p>
                      </details>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: INTERACTIVE CO2 IMPACT CALCULATOR */}
        <section id="impact-calculator" className="py-20 bg-slate-900 text-white border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Calculator Form Inputs */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Interactive Simulation
                  </span>
                  <h2 className="text-3xl font-black mt-3">CO2 Impact Reduction Calculator</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Adjust your sustainable energy, transport, and ecological practices to simulate annual greenhouse gas savings.
                  </p>
                </div>

                <div className="space-y-5 bg-slate-800/60 p-6 lg:p-8 rounded-3xl border border-slate-700/60">

                  {/* Renewable Energy % Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <label className="flex items-center gap-1.5"><Sun className="h-4 w-4 text-amber-400" /> Renewable Electricity Share</label>
                      <span className="text-emerald-400 font-extrabold">{renewablePercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={renewablePercentage}
                      onChange={(e) => setRenewablePercentage(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Rooftop Solar Capacity (kW) */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <label className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-emerald-400" /> Rooftop Solar Capacity (kW)</label>
                      <span className="text-emerald-400 font-extrabold">{solarKw} kW</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      step="0.5"
                      value={solarKw}
                      onChange={(e) => setSolarKw(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Trees Planted */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <label className="flex items-center gap-1.5"><TreePine className="h-4 w-4 text-emerald-400" /> Native Trees Planted/Protected</label>
                      <span className="text-emerald-400 font-extrabold">{treeCount} Trees</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={treeCount}
                      onChange={(e) => setTreeCount(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Electric Vehicle Distance */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <label className="flex items-center gap-1.5"><Droplets className="h-4 w-4 text-cyan-400" /> Annual EV Driving Distance (km)</label>
                      <span className="text-emerald-400 font-extrabold">{evKm.toLocaleString()} km</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30000"
                      step="1000"
                      value={evKm}
                      onChange={(e) => setEvKm(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Waste Recycled */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <label className="flex items-center gap-1.5"><Leaf className="h-4 w-4 text-teal-400" /> Waste Recycled & Composted (kg/yr)</label>
                      <span className="text-emerald-400 font-extrabold">{recycledKg} kg</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="25"
                      value={recycledKg}
                      onChange={(e) => setRecycledKg(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                </div>
              </div>

              {/* Calculator Output Display Card */}
              <div className="lg:col-span-5">
                <div className="bg-gradient-to-b from-emerald-900/60 to-slate-800 rounded-3xl p-8 border border-emerald-500/30 shadow-2xl space-y-6 text-center relative overflow-hidden">

                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-400">Estimated Annual Impact</span>
                    <h3 className="text-5xl font-black text-white tracking-tight">
                      {calcResult ? calcResult.totalCo2SavedTons : '0'} <span className="text-2xl font-bold text-emerald-400">Metric Tons</span>
                    </h3>
                    <span className="text-xs text-slate-400 block font-semibold">({calcResult ? calcResult.totalCo2SavedKg.toLocaleString() : '0'} kg CO2 equivalent saved/year)</span>
                  </div>

                  {/* Impact Grade Badge */}
                  <div className="inline-block bg-slate-900/90 border border-emerald-500/40 px-6 py-3 rounded-2xl">
                    <span className="text-xs text-slate-400 uppercase font-extrabold block">Sustainability Grade</span>
                    <span className="text-3xl font-black text-emerald-400 tracking-wider">
                      {calcResult ? calcResult.impactGrade : 'C'}
                    </span>
                  </div>

                  {/* Equivalencies */}
                  <div className="grid grid-cols-2 gap-4 text-left pt-2">
                    <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/50 space-y-1">
                      <TreePine className="h-5 w-5 text-emerald-400" />
                      <span className="text-xs text-slate-400 font-medium block">Trees Equivalent</span>
                      <span className="text-xl font-bold text-white">{calcResult ? calcResult.equivalentTreesPlanted : 0} planted</span>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/50 space-y-1">
                      <Globe2 className="h-5 w-5 text-cyan-400" />
                      <span className="text-xs text-slate-400 font-medium block">Cars Removed</span>
                      <span className="text-xl font-bold text-white">{calcResult ? calcResult.equivalentCarsOffRoad : 0} off road</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-700/50">
                    Calculations based on IPCC AR6 conversion metrics for carbon intensity and household utility baselines.
                  </p>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 4: AI CLIMATE SOLUTIONS TUTOR & SCIENCE ASSISTANT */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* AI Tutor Query Interface */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                  AI Knowledge Engine
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2">Climate Science AI Tutor</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Ask deep technical questions regarding carbon capture, renewable grid integration, or ecological restoration.
                </p>
              </div>

              <form onSubmit={handleAskAi} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Question / Topic</label>
                  <input
                    type="text"
                    placeholder="e.g. How do perovskite solar cells increase photo-conversion efficiency?"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Academic Level</label>
                    <select
                      value={aiLevel}
                      onChange={(e) => setAiLevel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Response Type</label>
                    <select
                      value={aiResponseType}
                      onChange={(e) => setAiResponseType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Explanation">Explanation</option>
                      <option value="Key Takeaways">Key Takeaways</option>
                      <option value="Quiz">Practice Quiz</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={aiLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-200"
                >
                  {aiLoading ? (
                    <span>Processing AI Insights...</span>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Ask Climate AI Tutor
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* AI Response Display */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm min-h-[380px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tutor Response</span>
                    {aiResponse && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                        Powered by {aiResponse.model || 'Mawaba AI Engine'}
                      </span>
                    )}
                  </div>

                  {aiResponse ? (
                    <div className="space-y-4 text-xs leading-relaxed">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-800 font-medium leading-relaxed">
                        {aiResponse.answer}
                      </div>

                      {aiResponse.keyTakeaways && aiResponse.keyTakeaways.length > 0 && (
                        <div className="space-y-2">
                          <span className="font-extrabold uppercase text-slate-500 text-[10px] tracking-wider">Key Takeaways:</span>
                          <ul className="list-disc pl-5 space-y-1 text-slate-600">
                            {aiResponse.keyTakeaways.map((point: string, i: number) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {aiResponse.quiz && (
                        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
                          <span className="font-bold text-emerald-900 block">Quiz: {aiResponse.quiz.question}</span>
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            {aiResponse.quiz.options?.map((opt: string, i: number) => (
                              <div key={i} className="bg-white p-2 rounded-xl border border-emerald-100 font-semibold text-slate-700 text-[11px]">
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-20 text-center text-slate-400 italic space-y-2">
                      <HelpCircle className="h-10 w-10 text-slate-300 mx-auto" />
                      <p>Enter a question on climate technology or climate science to receive instant tutor guidance.</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Mawaba Education & Climate Science Network</span>
                  <span>Free Open Knowledge</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 5: WORLD BANK LIVE CLIMATE INDICATORS */}
        <section className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                  Live Open Data API
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2">World Bank Environmental Telemetry</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Fetch live global climate and sustainability datasets direct from World Bank endpoints.
                </p>
              </div>

              {/* Selector Controls */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={wbCountry}
                  onChange={(e) => setWbCountry(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700"
                >
                  <option value="WLD">Global (World)</option>
                  <option value="USA">United States</option>
                  <option value="CHN">China</option>
                  <option value="IND">India</option>
                  <option value="DEU">Germany</option>
                  <option value="KEN">Kenya</option>
                  <option value="BRA">Brazil</option>
                </select>

                <select
                  value={wbIndicator}
                  onChange={(e) => setWbIndicator(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700"
                >
                  <option value="EN.ATM.CO2E.PC">CO2 Emissions (Metric Tons per capita)</option>
                  <option value="EG.FEC.RNEW.ZS">Renewable Energy Consumption (% of total energy)</option>
                  <option value="AG.LND.FRST.ZS">Forest Area (% of land area)</option>
                </select>
              </div>
            </div>

            {/* Indicator Table / Cards */}
            {wbLoading ? (
              <div className="p-8 text-center text-slate-400 animate-pulse font-medium text-xs">
                Fetching World Bank telemetry data...
              </div>
            ) : wbData && wbData.data ? (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                  <div>
                    <h4 className="font-extrabold text-sm">{wbData.indicatorName || 'Indicator Telemetry'}</h4>
                    <span className="text-xs text-emerald-400 font-semibold">{wbData.countryName || wbCountry}</span>
                  </div>
                  <BarChart3 className="h-6 w-6 text-emerald-400" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-100 text-slate-800 uppercase text-[10px] tracking-wider font-extrabold border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3.5">Year</th>
                        <th className="px-6 py-3.5">Value</th>
                        <th className="px-6 py-3.5">Country Code</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {wbData.data.slice(0, 8).map((row: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3.5 font-bold text-slate-900">{row.year}</td>
                          <td className="px-6 py-3.5 font-extrabold text-emerald-600">
                            {row.value !== null ? row.value.toFixed(2) : 'N/A'}
                          </td>
                          <td className="px-6 py-3.5 font-semibold text-slate-500">{row.countryId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-slate-50 rounded-3xl border text-center text-xs text-slate-400">
                Data currently unavailable for selected metric.
              </div>
            )}
          </div>
        </section>

        {/* SECTION 6: COMMUNITY CLIMATE INITIATIVES */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Register Initiative Form */}
            <div className="lg:col-span-5 h-fit sticky top-24">
              <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Community Action
                  </span>
                  <h3 className="text-2xl font-black mt-3">Register Climate Initiative</h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Submit your local ecological project or clean technology proposal for global backing.
                  </p>
                </div>

                {initMessage && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{initMessage}</span>
                  </div>
                )}

                <form onSubmit={handleInitiativeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Initiative Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Solar Co-op for Smallholder Farmers"
                      value={initTitle}
                      onChange={(e) => setInitTitle(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Oaxaca, Mexico"
                        value={initLocation}
                        onChange={(e) => setInitLocation(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Category</label>
                      <select
                        value={initCategory}
                        onChange={(e) => setInitCategory(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Renewable Energy">Renewable Energy</option>
                        <option value="Carbon Capture">Carbon Capture</option>
                        <option value="Sustainable Agriculture">Sustainable Agriculture</option>
                        <option value="Circular Economy">Circular Economy</option>
                        <option value="Ocean & Forest">Ocean & Forest</option>
                        <option value="Smart Mobility">Smart Mobility</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Organizer</label>
                      <input
                        type="text"
                        placeholder="e.g. Green Earth Co-op"
                        value={initOrganizer}
                        onChange={(e) => setInitOrganizer(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Target Impact</label>
                      <input
                        type="text"
                        placeholder="e.g. 200 Tons CO2/yr"
                        value={initImpact}
                        onChange={(e) => setInitImpact(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Describe objectives, execution methodology, and community impact..."
                      value={initDesc}
                      onChange={(e) => setInitDesc(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" /> Submit Initiative
                  </button>
                </form>
              </div>
            </div>

            {/* Initiatives Feed */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-3xl font-black text-slate-900">Active Climate Initiatives</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Community projects seeking technical partnerships and peer support.
                </p>
              </div>

              <div className="space-y-4">
                {initiatives.map((init) => (
                  <article key={init.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {init.category}
                        </span>
                        <h4 className="text-lg font-black text-slate-900 mt-2">{init.title}</h4>
                        <span className="text-xs font-bold text-slate-400 block">{init.location} • Organized by {init.organizer}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        Status: {init.status}
                      </span>
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed">{init.description}</p>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
                        Impact: {init.targetImpact}
                      </span>

                      <button
                        onClick={() => handleSupportInitiative(init.id)}
                        className="flex items-center gap-1.5 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors active:scale-95"
                      >
                        <HeartHandshake className="h-3.5 w-3.5" /> Support ({init.supporters})
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

          </div>
        </section>

      </main>
    </>
  );
};

export default ClimatePage;
