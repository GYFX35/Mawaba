import { getApiUrl } from '../components/apiConfig';
import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowRight,
  Globe,
  Shield,
  Zap,
  Heart,
  BookOpen,
  BarChart,
  MessageSquare,
  ThumbsUp,
  User,
  PlusCircle,
  AlertCircle,
  Sparkles,
  Gamepad2,
  Video,
  DollarSign,
  Leaf,
  CheckCircle2,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface Idea {
  id: string;
  title: string;
  category: 'Health' | 'Education' | 'Business' | 'Development' | 'Climate';
  description: string;
  author: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
}

const HomePage: NextPage = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeModuleTab, setActiveModuleTab] = useState<'ai' | 'investors' | 'agri' | 'health' | 'gaming' | 'videos'>('ai');

  // Submit new Idea Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Health' | 'Education' | 'Business' | 'Development' | 'Climate'>('Climate');
  const [newDescription, setNewDescription] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Comment State Map (ideaId -> text)
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentAuthors, setCommentAuthors] = useState<Record<string, string>>({});

  const fetchIdeas = async () => {
    try {
      const res = await fetch(getApiUrl('/api/ideas'));
      if (res.ok) {
        const data = await res.json();
        setIdeas(data);
      }
    } catch (err) {
      console.warn("Could not fetch ideas, fallback to client mock.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleLike = async (id: string) => {
    // Optimistic Update
    setIdeas(prev =>
      prev.map(idea => (idea.id === id ? { ...idea, likes: idea.likes + 1 } : idea))
    );

    try {
      await fetch(getApiUrl(`/api/ideas/${id}/like`), {
        method: 'POST',
      });
    } catch (err) {
      console.warn("Offline like updated locally.");
    }
  };

  const handleAddComment = async (e: React.FormEvent, ideaId: string) => {
    e.preventDefault();
    const author = commentAuthors[ideaId]?.trim() || 'Anonymous Reviewer';
    const text = commentInputs[ideaId]?.trim();
    if (!text) return;

    const optimisticComment: Comment = {
      id: Math.random().toString(),
      author,
      text,
      createdAt: new Date().toISOString()
    };

    // Optimistic Update
    setIdeas(prev =>
      prev.map(idea =>
        idea.id === ideaId ? { ...idea, comments: [...idea.comments, optimisticComment] } : idea
      )
    );

    setCommentInputs(prev => ({ ...prev, [ideaId]: '' }));

    try {
      await fetch(getApiUrl(`/api/ideas/${ideaId}/comments`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, text })
      });
    } catch (err) {
      console.warn("Offline comment posted locally.");
    }
  };

  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!newTitle.trim() || !newDescription.trim() || !newAuthor.trim()) {
      setSubmitError('All fields are required to publish an innovation idea.');
      return;
    }

    const payload = {
      title: newTitle,
      category: newCategory,
      description: newDescription,
      author: newAuthor
    };

    try {
      const res = await fetch(getApiUrl('/api/ideas'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const created = await res.json();
        setIdeas(prev => [created, ...prev]);
        setNewTitle('');
        setNewDescription('');
        setNewAuthor('');
        setSubmitSuccess('Your innovation idea has been successfully published!');
      } else {
        throw new Error('Failed to create idea');
      }
    } catch (err) {
      // Local fallback for offline mode
      const simulated: Idea = {
        id: Math.random().toString(),
        title: newTitle,
        category: newCategory,
        description: newDescription,
        author: newAuthor,
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString()
      };
      setIdeas(prev => [simulated, ...prev]);
      setNewTitle('');
      setNewDescription('');
      setNewAuthor('');
      setSubmitSuccess('Published locally (Offline simulation).');
    }
  };

  return (
    <>
      <Head>
        <title>Mawaba v1.3.0 | Global Interaction, AI Tutoring & Impact Ecosystem</title>
        <meta name="description" content="Mawaba connects AI education, sustainable agribusiness, investor matching, health promotion, climate solutions, and global media into a unified workspace." />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-50 via-blue-50/30 to-white overflow-hidden py-20 md:py-28 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-blue-100/80 text-blue-800 border border-blue-200/80 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
              <span>Mawaba Release v1.3.0 is Live</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-none">
              Empowering <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">Global Impact</span> through Intelligent Technology
            </h1>
            <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
              A unified digital ecosystem linking AI education, sustainable agribusiness, venture capital matching, global health SDG 3, climate solutions, and media entertainment for creators worldwide.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <a href="#innovation-feed" className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-base font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transform hover:-translate-y-0.5">
                Explore Innovation Feed <ArrowRight className="h-5 w-5" />
              </a>
              <Link href="/about" className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl text-base font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-xs">
                View v1.3.0 Release Notes
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-15%] right-[-10%] w-[55%] h-[55%] bg-blue-200/50 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-200/40 rounded-full blur-[120px]"></div>
        </div>
      </section>

      {/* Global Impact Stats Ticker */}
      <section className="bg-slate-900 text-white py-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-blue-400">190+</div>
              <div className="text-xs text-slate-400 font-bold mt-1">Countries Connected</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">97.8%</div>
              <div className="text-xs text-slate-400 font-bold mt-1">AI Tutor Accuracy Rate</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">$12.5M+</div>
              <div className="text-xs text-slate-400 font-bold mt-1">Agribusiness Trade Value</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-pink-400">85%</div>
              <div className="text-xs text-slate-400 font-bold mt-1">Dev Games Revenue Split</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Platform Feature Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Ecosystem Modules
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">All-in-One Global Platform</h2>
            <p className="text-slate-500 text-sm mt-2">
              Discover how Mawaba integrates multiple specialized hubs into one synchronized workspace.
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              { id: 'ai', label: 'AI Tutor', icon: Sparkles },
              { id: 'investors', label: 'Investors & VCs', icon: DollarSign },
              { id: 'agri', label: 'Agribusiness', icon: Leaf },
              { id: 'health', label: 'Global Health', icon: Heart },
              { id: 'gaming', label: 'Gaming Arcade', icon: Gamepad2 },
              { id: 'videos', label: 'Videos Hub', icon: Video },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeModuleTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveModuleTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Module Content Banner */}
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm">
            {activeModuleTab === 'ai' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Multi-Provider AI Tutoring</span>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900">Google Gemini 1.5 Flash & OpenAI GPT-4o</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Interactive AI tutor supporting structured explanations, study takeaways, study quizzes, and follow-up inquiry tailored for STEM, Literature, Business, and Climate disciplines.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Link href="/education" className="bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-md">
                      Launch AI Tutor &rarr;
                    </Link>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex justify-between text-xs font-extrabold text-slate-800 border-b border-slate-100 pb-2">
                    <span>Sample Prompt Response</span>
                    <span className="text-blue-600">Gemini 1.5 Flash</span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                    &quot;Superposition allows quantum particles to exist in multiple state combinations simultaneously until direct measurement collapses the wave function into a single eigenstate.&quot;
                  </div>
                </div>
              </div>
            )}

            {activeModuleTab === 'investors' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Venture Capital Directory</span>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900">Direct Startup Pitch & Investment Offers</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Connecting sustainable technology startups with top global VC funds, impact angels, and ESG investors through automated pitch proposals and match score analytics.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Link href="/investors" className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-emerald-700 transition-all shadow-md">
                      View Investor Portal &rarr;
                    </Link>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span className="text-slate-800">Apex Green Horizon Capital</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px]">Active VC</span>
                  </div>
                  <p className="text-xs text-slate-500">Check size: $250k - $2M | Focus: Clean Tech & Agribusiness</p>
                </div>
              </div>
            )}

            {activeModuleTab === 'agri' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-black text-amber-600 uppercase tracking-widest">B2B Marketplace & Starvation Relief</span>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900">Crop Yield Calculator & Solar Drip Irrigation</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Facilitate trade offers for drought-resilient crops, solar irrigation pumps, and biochar soil amendments while supporting starvation alleviation projects.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Link href="/agriculture" className="bg-amber-600 text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-amber-700 transition-all shadow-md">
                      Open Agriculture Hub &rarr;
                    </Link>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex justify-between items-center text-xs font-extrabold text-slate-800">
                    <span>Yield Multiplier Impact</span>
                    <span className="text-amber-600 font-black">+42%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[72%] rounded-full"></div>
                  </div>
                </div>
              </div>
            )}

            {activeModuleTab === 'health' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-black text-rose-600 uppercase tracking-widest">Global Health Promotion</span>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900">Biometric Assessment & UN SDG 3 Alignment</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Calculate personalized body mass index (BMI) and daily hydration targets, browse preventative healthcare tips, and support global health campaigns.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Link href="/health" className="bg-rose-600 text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-rose-700 transition-all shadow-md">
                      Assess Health & Hydration &rarr;
                    </Link>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="text-xs font-extrabold text-slate-800">Daily Hydration Target</div>
                  <div className="text-xl font-black text-rose-600">2.8 Liters / day</div>
                </div>
              </div>
            )}

            {activeModuleTab === 'gaming' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Gaming Arcade & Monetization</span>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900">Browser Games & 85% Developer Revenue Split</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Play browser-based games, support independent game creators through tipping or in-game purchases, and track live developer revenue splits.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Link href="/games" className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-indigo-700 transition-all shadow-md">
                      Play Arcade Games &rarr;
                    </Link>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex justify-between text-xs font-extrabold">
                    <span>Dev Payout Share</span>
                    <span className="text-indigo-600">85% Developer / 15% Platform</span>
                  </div>
                </div>
              </div>
            )}

            {activeModuleTab === 'videos' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-black text-purple-600 uppercase tracking-widest">Videos Entertainment Hub</span>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900">Streaming Video Discovery & YouTube Integration</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Discover educational shorts, climate documentaries, and tech tutorials with automated YouTube ID parsing, likes, comments, and sharing.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Link href="/videos" className="bg-purple-600 text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-purple-700 transition-all shadow-md">
                      Watch Videos &rarr;
                    </Link>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Video className="h-4 w-4 text-purple-600" />
                    <span>Auto YouTube URL Parsing & Thumbnail Generation</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* REAL-TIME INNOVATION & OPINIONS FEED */}
      <section id="innovation-feed" className="py-24 bg-slate-50/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Submit an Idea Form (Sticky Left) */}
            <div className="lg:col-span-5 h-fit sticky top-24">
              <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800 space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/10">
                    Publishing Portal
                  </span>
                  <h3 className="text-2xl font-black mt-3">Share Your Innovation</h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Have a global developmental idea or opinion? Post it onto Mawaba&apos;s feed for live peer review.
                  </p>
                </div>

                {submitError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-xs text-rose-300 flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                {submitSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-xs text-emerald-300 flex items-start gap-2.5 animate-pulse">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                    <span>{submitSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitIdea} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-300 mb-1.5 uppercase tracking-wider">Innovation Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Decentralized Clean Water Networks"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-300 mb-1.5 uppercase tracking-wider">Pillar Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      >
                        <option value="Climate">Climate</option>
                        <option value="Development">Development</option>
                        <option value="Business">Business</option>
                        <option value="Education">Education</option>
                        <option value="Health">Health</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-300 mb-1.5 uppercase tracking-wider">Author Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Evelyn Carter"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-300 mb-1.5 uppercase tracking-wider">Brief Description</label>
                    <textarea
                      rows={4}
                      placeholder="Describe the problem you are solving, target demographic, and AI assistance requirements..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900"
                  >
                    <PlusCircle className="h-4 w-4" /> Publish to Innovation Feed
                  </button>
                </form>
              </div>
            </div>

            {/* Ideas Feed (Scrollable Right) */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h3 className="text-3xl font-black text-slate-900">Innovation Feed</h3>
                <p className="text-slate-500 text-xs mt-1">
                  Connect directly with ongoing humanitarian projects and share your expert feedback.
                </p>
              </div>

              {loading ? (
                <div className="space-y-6">
                  {[1, 2].map(n => (
                    <div key={n} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-16 bg-slate-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : ideas.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-16 text-center">
                  <p className="text-slate-400 text-xs italic">No innovations shared yet. Be the first to publish above!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {ideas.map((idea) => (
                    <div key={idea.id} className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xs hover:shadow-md transition-all duration-300">

                      {/* Idea Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                          <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full uppercase ${
                            idea.category === 'Climate' ? 'bg-emerald-100 text-emerald-800' :
                            idea.category === 'Health' ? 'bg-rose-100 text-rose-800' :
                            idea.category === 'Education' ? 'bg-amber-100 text-amber-800' :
                            idea.category === 'Business' ? 'bg-blue-100 text-blue-800' :
                            'bg-indigo-100 text-indigo-800'
                          }`}>
                            {idea.category}
                          </span>
                          <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                            <User className="h-3 w-3" /> by {idea.author}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">
                          {new Date(idea.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Title & Body */}
                      <div className="space-y-2">
                        <h4 className="text-2xl font-black text-slate-900 leading-snug">{idea.title}</h4>
                        <p className="text-slate-600 text-xs leading-relaxed font-medium">{idea.description}</p>
                      </div>

                      {/* Like Action */}
                      <div className="flex items-center gap-4 border-y border-slate-100 py-3.5">
                        <button
                          onClick={() => handleLike(idea.id)}
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-50 border border-slate-200 hover:border-blue-200 px-3.5 py-2 rounded-xl transition-all shadow-xs active:scale-95"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" /> Upvote ({idea.likes})
                        </button>
                        <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5 text-slate-400" /> {idea.comments.length} expert comments
                        </span>
                      </div>

                      {/* Comments List */}
                      {idea.comments.length > 0 && (
                        <div className="space-y-3.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Expert Discussion</span>
                          <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                            {idea.comments.map((comm) => (
                              <div key={comm.id} className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl text-xs">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-bold text-slate-800">@{comm.author}</span>
                                  <span className="text-[9px] text-slate-400">
                                    {new Date(comm.createdAt).toLocaleDateString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-slate-600 leading-relaxed font-medium">{comm.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Post Comment Form */}
                      <form onSubmit={(e) => handleAddComment(e, idea.id)} className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-2">
                        <input
                          type="text"
                          placeholder="Your handle..."
                          value={commentAuthors[idea.id] || ''}
                          onChange={(e) => setCommentAuthors(prev => ({ ...prev, [idea.id]: e.target.value }))}
                          className="md:col-span-3 p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Write expert advice..."
                          value={commentInputs[idea.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [idea.id]: e.target.value }))}
                          className="md:col-span-7 p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                        <button
                          type="submit"
                          className="md:col-span-2 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-xl text-xs py-2.5 transition-all"
                        >
                          Submit
                        </button>
                      </form>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-700 via-indigo-900 to-slate-950 rounded-[36px] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-black mb-4 relative z-10 leading-tight">Join the Mawaba Community</h2>
            <p className="text-blue-100 text-sm md:text-base mb-8 max-w-xl mx-auto relative z-10 font-medium">
              Ready to publish your ideas, query AI tutors, or access global venture capital and agribusiness tools? Start connecting today.
            </p>
            <Link href="/signup" className="bg-white hover:bg-slate-50 text-blue-900 px-8 py-4 rounded-2xl text-base font-black transition-all shadow-xl hover:shadow-2xl relative z-10 inline-block">
              Create Free Account
            </Link>
            {/* Decoration */}
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full opacity-25 blur-3xl"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
