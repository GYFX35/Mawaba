import { getApiUrl, API_BASE_URL } from '../components/apiConfig';
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
  AlertCircle
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
        <title>Mawaba | Global Interaction & AI-Driven Business</title>
        <meta name="description" content="Global interaction, communication app integrated with AI for business, partnership, and development ideas." />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-slate-50 overflow-hidden py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              ✨ Empowering Global Creators
            </span>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight leading-none">
              Empowering <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">Global Innovation</span> through AI
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 leading-relaxed">
              Mawaba is the premier social workspace for business promotion, world development, and decentralized education. Share opinions, interact, and collaborate using powerful built-in AI models.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <a href="#innovation-feed" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-extrabold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:shadow-xl hover:shadow-blue-200 transform hover:-translate-y-0.5">
                Join Innovation Feed <ArrowRight className="h-5 w-5" />
              </a>
              <Link href="/about" className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-100 rounded-full blur-[120px] opacity-50"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">Why Mawaba?</h2>
            <div className="h-1.5 w-20 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Global Collaboration",
                desc: "Engage instantly with verified developers, social workers, and enterprise heads across borders.",
                icon: <Globe className="h-6 w-6 text-blue-600" />
              },
              {
                title: "AI-Powered Strategy",
                desc: "Directly analyze plans and extract actionable frameworks with built-in Langchain capabilities.",
                icon: <Zap className="h-6 w-6 text-blue-600" />
              },
              {
                title: "Protected Ecosystem",
                desc: "Secure, structured workspaces allowing safe disclosure of high-impact research.",
                icon: <Shield className="h-6 w-6 text-blue-600" />
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 hover:border-blue-100 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                <div className="mb-6 bg-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Our Core Pillars</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Focusing on what truly matters for global development and human well-being.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { name: "Climate Solutions", desc: "Clean tech, carbon capture & ESG tools", icon: <Globe className="text-emerald-500" />, href: "/climate" },
              { name: "Education", desc: "Interactive AI tutor models & forums", icon: <BookOpen className="text-amber-500" />, href: "/education" },
              { name: "Business", desc: "Commerce POS APIs & global trade", icon: <BarChart className="text-blue-500" />, href: "/services" },
              { name: "Development", desc: "World Bank data & local initiatives", icon: <Globe className="text-indigo-500" />, href: "/worldbank" }
            ].map((pillar, idx) => (
              <Link key={idx} href={pillar.href || '#'}>
              <div className="flex flex-col items-center p-8 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                <div className="mb-4 p-4 rounded-2xl bg-slate-50 group-hover:bg-blue-50 transition-colors">
                  {React.cloneElement(pillar.icon as React.ReactElement, { size: 28 })}
                </div>
                <span className="font-extrabold text-slate-900 text-lg mb-1">{pillar.name}</span>
                <span className="text-slate-400 text-xs">{pillar.desc}</span>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* REAL-TIME INNOVATION & OPINIONS FEED */}
      <section id="innovation-feed" className="py-24 bg-white border-t border-slate-100">
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
                  <p className="text-slate-400 text-sm mt-1">
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
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                    <span>{submitSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitIdea} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Innovation Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Decentralized Clean Water Networks"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Pillar Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      >
                        <option value="Climate">Climate</option>
                        <option value="Development">Development</option>
                        <option value="Business">Business</option>
                        <option value="Education">Education</option>
                        <option value="Health">Health</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Author Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Evelyn Carter"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Brief Description</label>
                    <textarea
                      rows={4}
                      placeholder="Describe the problem you are solving, target demographic, and AI assistance requirements..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900"
                  >
                    <PlusCircle className="h-4 w-4" /> Publish to Feed
                  </button>
                </form>
              </div>
            </div>

            {/* Ideas Feed (Scrollable Right) */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h3 className="text-3xl font-extrabold text-slate-900">Innovation Feed</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Connect directly with ongoing humanitarian projects and share your expert feedback.
                </p>
              </div>

              {loading ? (
                <div className="space-y-6">
                  {[1, 2].map(n => (
                    <div key={n} className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-16 bg-slate-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : ideas.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-3xl py-16 text-center">
                  <p className="text-slate-400 text-sm italic">No innovations shared yet. Be the first to publish above!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {ideas.map((idea) => (
                    <div key={idea.id} className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 lg:p-8 space-y-6 hover:border-slate-200 hover:shadow-md transition-all duration-300">

                      {/* Idea Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                          <span className={`text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-full uppercase ${
                            idea.category === 'Climate' ? 'bg-emerald-100 text-emerald-800' :
                            idea.category === 'Health' ? 'bg-rose-100 text-rose-800' :
                            idea.category === 'Education' ? 'bg-amber-100 text-amber-800' :
                            idea.category === 'Business' ? 'bg-blue-100 text-blue-800' :
                            'bg-indigo-100 text-indigo-800'
                          }`}>
                            {idea.category}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
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
                        <p className="text-slate-600 text-sm leading-relaxed">{idea.description}</p>
                      </div>

                      {/* Like Action */}
                      <div className="flex items-center gap-4 border-y border-slate-100 py-3.5">
                        <button
                          onClick={() => handleLike(idea.id)}
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-200 px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          <ThumbsUp className="h-4 w-4" /> Upvote ({idea.likes})
                        </button>
                        <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-slate-400" /> {idea.comments.length} expert comments
                        </span>
                      </div>

                      {/* Comments List */}
                      {idea.comments.length > 0 && (
                        <div className="space-y-3.5">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">Expert Discussion</span>
                          <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                            {idea.comments.map((comm) => (
                              <div key={comm.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-xs">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-extrabold text-slate-800">@{comm.author}</span>
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
                      <form onSubmit={(e) => handleAddComment(e, idea.id)} className="bg-white p-3 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-2">
                        <input
                          type="text"
                          placeholder="Your handle..."
                          value={commentAuthors[idea.id] || ''}
                          onChange={(e) => setCommentAuthors(prev => ({ ...prev, [idea.id]: e.target.value }))}
                          className="md:col-span-3 p-2.5 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold bg-slate-50/50"
                        />
                        <input
                          type="text"
                          placeholder="Write expert advice..."
                          value={commentInputs[idea.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [idea.id]: e.target.value }))}
                          className="md:col-span-7 p-2.5 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                        />
                        <button
                          type="submit"
                          className="md:col-span-2 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl text-xs py-2.5 transition-all"
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
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-950 rounded-[40px] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-black mb-6 relative z-10 leading-tight">Join the Mawaba Community</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto relative z-10">
              Ready to publish your ideas or link your Point-of-Sale structures with global networks? Start connecting today.
            </p>
            <Link href="/contact" className="bg-white hover:bg-slate-50 text-blue-900 px-10 py-4.5 rounded-xl text-lg font-black transition-all shadow-xl hover:shadow-2xl relative z-10 inline-block">
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
