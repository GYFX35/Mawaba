import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Sprout,
  Wheat,
  Droplets,
  Sun,
  ShieldAlert,
  Search,
  PlusCircle,
  ThumbsUp,
  Calculator,
  Bot,
  Globe,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Send,
  Sparkles,
  Users,
  TrendingUp,
  Leaf
} from 'lucide-react';
import Layout from '../components/Layout';
import { getApiUrl } from '../components/apiConfig';

interface AgricultureProject {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  organizer: string;
  targetImpact: string;
  peopleFedEst: number;
  supporters: number;
  status: 'Proposed' | 'Active' | 'Completed';
  createdAt: string;
}

interface StarvationSolution {
  id: string;
  title: string;
  category: string;
  description: string;
  impactScore: number;
  potentialPeopleFedPerYr: number;
  implementationCost: string;
  scalability: string;
  keyTechnologies: string[];
  sdgGoals: number[];
  caseStudy: string;
}

interface YieldCalculationResult {
  estimatedTotalYieldTons: number;
  estimatedPeopleFedPerYear: number;
  waterSavedM3: number;
  co2SequesteredTons: number;
  sdgTarget: string;
}

const AgriculturePage = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'solutions' | 'calculator' | 'ai-agronomist'>('projects');

  // Projects state
  const [projects, setProjects] = useState<AgricultureProject[]>([]);
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('All');
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Drought-Resilient Crops',
    description: '',
    location: '',
    organizer: '',
    targetImpact: '',
    peopleFedEst: 5000
  });

  // Solutions state
  const [solutions, setSolutions] = useState<StarvationSolution[]>([]);
  const [solutionSearchQuery, setSolutionSearchQuery] = useState('');

  // Calculator state
  const [calcFarmSize, setCalcFarmSize] = useState<number>(5);
  const [calcCropType, setCalcCropType] = useState<string>('drought_resilient');
  const [calcIrrigationEff, setCalcIrrigationEff] = useState<number>(75);
  const [calcBiochar, setCalcBiochar] = useState<number>(2);
  const [calcResult, setCalcResult] = useState<YieldCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // AI Agronomist state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLevel, setAiLevel] = useState('Intermediate');
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchSolutions();
    handleCalculateYield();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(getApiUrl('/api/agriculture/projects'));
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Failed to fetch agriculture projects:', err);
    }
  };

  const fetchSolutions = async () => {
    try {
      const res = await fetch(getApiUrl('/api/agriculture/solutions'));
      if (res.ok) {
        const data = await res.json();
        setSolutions(data);
      }
    } catch (err) {
      console.error('Failed to fetch starvation solutions:', err);
    }
  };

  const handleSupportProject = async (id: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/agriculture/projects/${id}/support`), {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(prev =>
          prev.map(p => (p.id === id ? { ...p, supporters: data.supporters } : p))
        );
      }
    } catch (err) {
      console.error('Error supporting project:', err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description || !newProject.location || !newProject.organizer) {
      alert('Please fill in all required project fields.');
      return;
    }

    try {
      const res = await fetch(getApiUrl('/api/agriculture/projects'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      if (res.ok) {
        const data = await res.json();
        setProjects([data, ...projects]);
        setIsSubmittingProject(false);
        setNewProject({
          title: '',
          category: 'Drought-Resilient Crops',
          description: '',
          location: '',
          organizer: '',
          targetImpact: '',
          peopleFedEst: 5000
        });
      }
    } catch (err) {
      console.error('Error submitting project:', err);
    }
  };

  const handleCalculateYield = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsCalculating(true);
    try {
      const res = await fetch(getApiUrl('/api/agriculture/calculator'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmSizeHectares: calcFarmSize,
          cropType: calcCropType,
          irrigationEfficiencyPct: calcIrrigationEff,
          biocharAppliedTons: calcBiochar
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCalcResult(data.results);
      }
    } catch (err) {
      console.error('Calculator error:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleAskAiAgronomist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsAiLoading(true);
    setAiResponse(null);
    try {
      const res = await fetch(getApiUrl('/api/ai/tutor'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: aiQuestion,
          discipline: 'Sustainable Agriculture & Starvation Alleviation',
          level: aiLevel,
          responseType: 'Explanation'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiResponse(data);
      }
    } catch (err) {
      console.error('AI Agronomist error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesCategory = projectCategoryFilter === 'All' || p.category === projectCategoryFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(projectSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredSolutions = solutions.filter(s =>
    s.title.toLowerCase().includes(solutionSearchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(solutionSearchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(solutionSearchQuery.toLowerCase())
  );

  return (
    <Layout>
      <Head>
        <title>Sustainable Agriculture & Starvation Solutions | Mawaba</title>
        <meta
          name="description"
          content="Empowering global agricultural development, drought-resilient crops, precision irrigation, and zero-hunger starvation solutions."
        />
      </Head>

      <div className="bg-gradient-to-b from-emerald-900 via-green-900 to-emerald-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-600 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-emerald-200">
            <Wheat className="h-4 w-4 text-emerald-400" /> UN SDG 2: Zero Hunger & Climate-Smart Agriculture
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-100 via-green-200 to-yellow-100 bg-clip-text text-transparent">
            Global Agriculture & Starvation Alleviation
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-emerald-100/90 leading-relaxed">
            Uniting climate-resilient farming techniques, solar micro-irrigation, biofortified staple crops, and AI-driven yield optimization to nourish local communities and end food insecurity.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6">
            <div className="bg-emerald-800/50 backdrop-blur-sm border border-emerald-700/60 p-4 rounded-2xl text-center">
              <span className="block text-2xl font-black text-amber-300">455,000+</span>
              <span className="text-xs text-emerald-200 font-medium">People Fed per Year</span>
            </div>
            <div className="bg-emerald-800/50 backdrop-blur-sm border border-emerald-700/60 p-4 rounded-2xl text-center">
              <span className="block text-2xl font-black text-emerald-300">60%</span>
              <span className="text-xs text-emerald-200 font-medium">Water Saved via Drip</span>
            </div>
            <div className="bg-emerald-800/50 backdrop-blur-sm border border-emerald-700/60 p-4 rounded-2xl text-center">
              <span className="block text-2xl font-black text-yellow-300">96/100</span>
              <span className="text-xs text-emerald-200 font-medium">Biochar Soil Impact</span>
            </div>
            <div className="bg-emerald-800/50 backdrop-blur-sm border border-emerald-700/60 p-4 rounded-2xl text-center">
              <span className="block text-2xl font-black text-sky-300">100%</span>
              <span className="text-xs text-emerald-200 font-medium">Open Source Agronomy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-gray-200 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'projects'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <Sprout className="h-4 w-4" /> Global Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'solutions'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <ShieldAlert className="h-4 w-4" /> Starvation Solutions
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'calculator'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <Calculator className="h-4 w-4" /> Yield & Impact Calculator
          </button>
          <button
            onClick={() => setActiveTab('ai-agronomist')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'ai-agronomist'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <Bot className="h-4 w-4" /> AI Agronomist Tutor
          </button>
        </div>

        {/* TAB 1: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects by title, location, or keyword..."
                  value={projectSearchQuery}
                  onChange={e => setProjectSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={projectCategoryFilter}
                  onChange={e => setProjectCategoryFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Drought-Resilient Crops">Drought-Resilient Crops</option>
                  <option value="Precision Irrigation">Precision Irrigation</option>
                  <option value="Soil Health & Biochar">Soil Health & Biochar</option>
                  <option value="Vertical & Urban Farming">Vertical & Urban Farming</option>
                  <option value="Food Loss & Distribution">Food Loss & Distribution</option>
                  <option value="Agroforestry">Agroforestry</option>
                </select>

                <button
                  onClick={() => setIsSubmittingProject(true)}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap"
                >
                  <PlusCircle className="h-4 w-4" /> Propose Initiative
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                        {project.category}
                      </span>
                      <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5" /> {project.location}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 leading-snug">{project.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>

                    <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-emerald-900">
                        <span>Impact Goal:</span>
                        <span>{project.targetImpact}</span>
                      </div>
                      <div className="flex justify-between font-bold text-amber-700">
                        <span>Est. People Fed:</span>
                        <span>{project.peopleFedEst.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">By {project.organizer}</span>
                    <button
                      onClick={() => handleSupportProject(project.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" /> Support ({project.supporters})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: STARVATION SOLUTIONS */}
        {activeTab === 'solutions' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search anti-hunger technologies and starvation solutions..."
                value={solutionSearchQuery}
                onChange={e => setSolutionSearchQuery(e.target.value)}
                className="w-full text-sm font-medium focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSolutions.map(solution => (
                <div
                  key={solution.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg">
                        {solution.category}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                        Impact: {solution.impactScore}/100
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900">{solution.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{solution.description}</p>

                    <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-xs">
                      <div className="flex justify-between text-gray-700">
                        <span className="font-semibold">Potential People Fed/Yr:</span>
                        <span className="font-bold text-emerald-700">
                          {(solution.potentialPeopleFedPerYr / 1000000).toFixed(1)} Million
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span className="font-semibold">Cost Level:</span>
                        <span className="font-bold">{solution.implementationCost}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span className="font-semibold">Scalability:</span>
                        <span className="font-bold">{solution.scalability}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold text-gray-700 block">Key Tech:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {solution.keyTechnologies.map((tech, i) => (
                          <span
                            key={i}
                            className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 text-xs text-gray-600 italic">
                    <strong>Case Study:</strong> {solution.caseStudy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Calculator className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-gray-900">Crop Yield & Hunger Alleviation Estimator</h2>
              </div>

              <form onSubmit={handleCalculateYield} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Farm Size (Hectares)
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={calcFarmSize}
                    onChange={e => setCalcFarmSize(parseFloat(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Crop System & Seed Variety
                  </label>
                  <select
                    value={calcCropType}
                    onChange={e => setCalcCropType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="drought_resilient">Drought-Resilient Sorghum/Millet</option>
                    <option value="biofortified">Biofortified Cassava/Zinc Rice</option>
                    <option value="hydroponic">Solar Hydroponic Vertical Towers</option>
                    <option value="staple">Standard Traditional Staples</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Irrigation Efficiency ({calcIrrigationEff}%)
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="95"
                    value={calcIrrigationEff}
                    onChange={e => setCalcIrrigationEff(parseInt(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                    <span>Flood Irrigation (20%)</span>
                    <span>Solar Drip (95%)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Biochar Organic Amendment (Tons/Hectare)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={calcBiochar}
                    onChange={e => setCalcBiochar(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCalculating}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isCalculating ? 'Simulating Yield...' : 'Calculate Food Output & Impact'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {calcResult && (
                <div className="bg-emerald-900 text-white p-6 rounded-2xl space-y-6 shadow-lg border border-emerald-800">
                  <div className="flex items-center justify-between border-b border-emerald-800 pb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-400" />
                      <h3 className="text-xl font-extrabold text-emerald-100">Projected Yield & Food Impact</h3>
                    </div>
                    <span className="text-xs bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full font-bold">
                      {calcResult.sdgTarget}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-emerald-800/60 p-4 rounded-xl border border-emerald-700 text-center">
                      <Wheat className="h-5 w-5 text-amber-300 mx-auto mb-1" />
                      <span className="block text-2xl font-black text-amber-300">
                        {calcResult.estimatedTotalYieldTons}
                      </span>
                      <span className="text-[11px] text-emerald-200 font-semibold">Tons Yield/Year</span>
                    </div>

                    <div className="bg-emerald-800/60 p-4 rounded-xl border border-emerald-700 text-center">
                      <Users className="h-5 w-5 text-emerald-300 mx-auto mb-1" />
                      <span className="block text-2xl font-black text-emerald-300">
                        {calcResult.estimatedPeopleFedPerYear.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-emerald-200 font-semibold">People Fed Annually</span>
                    </div>

                    <div className="bg-emerald-800/60 p-4 rounded-xl border border-emerald-700 text-center">
                      <Droplets className="h-5 w-5 text-sky-300 mx-auto mb-1" />
                      <span className="block text-2xl font-black text-sky-300">
                        {calcResult.waterSavedM3.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-emerald-200 font-semibold">m³ Water Saved</span>
                    </div>

                    <div className="bg-emerald-800/60 p-4 rounded-xl border border-emerald-700 text-center">
                      <Leaf className="h-5 w-5 text-yellow-300 mx-auto mb-1" />
                      <span className="block text-2xl font-black text-yellow-300">
                        {calcResult.co2SequesteredTons}
                      </span>
                      <span className="text-[11px] text-emerald-200 font-semibold">Tons CO₂ Locked</span>
                    </div>
                  </div>

                  <div className="bg-emerald-950/70 p-4 rounded-xl text-xs space-y-2 text-emerald-200">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Key Agronomic Takeaways:
                    </div>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Micro-drip irrigation significantly cuts evaporative loss while maximizing root hydration.</li>
                      <li>Biochar soil addition creates durable carbon sinks while improving nutrient retention during heatwaves.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: AI AGRONOMIST */}
        {activeTab === 'ai-agronomist' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Bot className="h-6 w-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-900">AI Agronomist & Food Security Advisor</h2>
              </div>

              <form onSubmit={handleAskAiAgronomist} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Ask a question about sustainable agriculture, crop management, or food security:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. How can smallholder farmers in dry climates use biochar to improve soil moisture retention?"
                    value={aiQuestion}
                    onChange={e => setAiQuestion(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <select
                    value={aiLevel}
                    onChange={e => setAiLevel(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700"
                  >
                    <option value="Beginner">Beginner Level</option>
                    <option value="Intermediate">Intermediate Level</option>
                    <option value="Advanced">Advanced Agronomist</option>
                  </select>

                  <button
                    type="submit"
                    disabled={isAiLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
                  >
                    {isAiLoading ? 'Consulting AI...' : 'Ask AI Agronomist'}
                  </button>
                </div>
              </form>

              {aiResponse && (
                <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                    <span className="font-bold text-emerald-900 text-sm">{aiResponse.tutorName}</span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                      Model: {aiResponse.model}
                    </span>
                  </div>

                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{aiResponse.answer}</p>

                  {aiResponse.keyTakeaways && aiResponse.keyTakeaways.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-emerald-900 uppercase">Key Agronomic Highlights:</span>
                      <ul className="list-disc pl-5 text-xs text-emerald-900 space-y-1">
                        {aiResponse.keyTakeaways.map((takeaway: string, idx: number) => (
                          <li key={idx}>{takeaway}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PROPOSE PROJECT MODAL */}
      {isSubmittingProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              Propose Sustainable Agriculture Initiative
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={newProject.title}
                  onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={newProject.category}
                    onChange={e => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Drought-Resilient Crops">Drought-Resilient Crops</option>
                    <option value="Precision Irrigation">Precision Irrigation</option>
                    <option value="Soil Health & Biochar">Soil Health & Biochar</option>
                    <option value="Vertical & Urban Farming">Vertical & Urban Farming</option>
                    <option value="Food Loss & Distribution">Food Loss & Distribution</option>
                    <option value="Agroforestry">Agroforestry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kano, Nigeria"
                    value={newProject.location}
                    onChange={e => setNewProject({ ...newProject, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Organizer / Co-op</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Green Harvest Alliance"
                    value={newProject.organizer}
                    onChange={e => setNewProject({ ...newProject, organizer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Est. People Fed</label>
                  <input
                    type="number"
                    min="100"
                    value={newProject.peopleFedEst}
                    onChange={e => setNewProject({ ...newProject, peopleFedEst: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newProject.description}
                  onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSubmittingProject(false)}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-sm transition-all"
                >
                  Publish Initiative
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AgriculturePage;
