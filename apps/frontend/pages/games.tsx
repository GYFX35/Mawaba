import { getApiUrl, API_BASE_URL } from '../components/apiConfig';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import {
  Gamepad2,
  PlusCircle,
  DollarSign,
  Play,
  Sparkles,
  Search,
  Filter,
  Award,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  BarChart3,
  Layers,
  Users,
  CreditCard,
  ExternalLink,
  X,
  RefreshCw,
  Gift
} from 'lucide-react';

interface GameItem {
  id: string;
  title: string;
  developer: string;
  developerEmail: string;
  genre: 'Action & Arcade' | 'Puzzle & Logic' | 'Strategy & Simulation' | 'Educational & Sci-Fi' | 'Eco & Climate';
  description: string;
  thumbnailUrl: string;
  gameUrl: string;
  monetizationModel: 'Free' | 'Ad-Supported' | 'Premium Purchase' | 'In-Game Pass / Subscription';
  price: number;
  playCount: number;
  rating: number;
  totalEarnings: number;
  devRevenueShare: number;
  status: string;
  createdAt: string;
}

interface GameTransaction {
  id: string;
  gameId: string;
  gameTitle: string;
  userEmail: string;
  amount: number;
  devPayoutAmount: number;
  platformFeeAmount: number;
  type: string;
  paymentMethod: string;
  timestamp: string;
}

interface MonetizationAnalytics {
  developerEmail: string;
  summary: {
    totalGames: number;
    totalPlays: number;
    grossRevenue: number;
    developerPayoutTotal: number;
    platformFeeTotal: number;
    devShareRate: string;
  };
  topEarningGames: GameItem[];
  recentTransactions: GameTransaction[];
}

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState<'arcade' | 'submit' | 'monetization'>('arcade');
  const [games, setGames] = useState<GameItem[]>([]);
  const [analytics, setAnalytics] = useState<MonetizationAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedMonetization, setSelectedMonetization] = useState<string>('All');

  // Active game play modal state
  const [activePlayingGame, setActivePlayingGame] = useState<GameItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [purchaseSuccessMsg, setPurchaseSuccessMsg] = useState<string>('');
  const [tipAmount, setTipAmount] = useState<number>(3.00);

  // Game Submission Form state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    developer: '',
    developerEmail: '',
    genre: 'Eco & Climate',
    description: '',
    thumbnailUrl: '',
    gameUrl: '',
    monetizationModel: 'Ad-Supported',
    price: 0
  });

  const genres = ['All', 'Action & Arcade', 'Puzzle & Logic', 'Strategy & Simulation', 'Educational & Sci-Fi', 'Eco & Climate'];
  const monetizationModels = ['All', 'Free', 'Ad-Supported', 'Premium Purchase', 'In-Game Pass / Subscription'];

  const API_BASE = API_BASE_URL;

  const fetchGames = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE}/api/games?genre=${encodeURIComponent(selectedGenre)}&monetization=${encodeURIComponent(selectedMonetization)}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setGames(data);
      }
    } catch (err) {
      console.error('Failed to fetch games', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/games/monetization/analytics`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to fetch monetization analytics', err);
    }
  };

  useEffect(() => {
    fetchGames();
    fetchAnalytics();
  }, [selectedGenre, selectedMonetization, searchQuery]);

  const handleStartPlay = async (game: GameItem) => {
    setActivePlayingGame(game);
    setIsPlaying(true);
    setPurchaseSuccessMsg('');

    // Trigger play count API
    try {
      await fetch(`${API_BASE}/api/games/${game.id}/play`, { method: 'POST' });
      fetchGames();
      fetchAnalytics();
    } catch (err) {
      console.error('Failed to register play', err);
    }
  };

  const handlePurchaseOrTip = async (type: 'Purchase' | 'Developer Tip' | 'In-Game Pass', customAmount?: number) => {
    if (!activePlayingGame) return;

    const amount = customAmount || activePlayingGame.price || 2.99;
    try {
      const res = await fetch(`${API_BASE}/api/games/${activePlayingGame.id}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: 'gamer@mawaba.org',
          amount,
          type,
          paymentMethod: 'Mawaba Express Pay'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPurchaseSuccessMsg(`Successfully processed ${type} of $${amount.toFixed(2)}! (85% paid to ${activePlayingGame.developer})`);
        fetchGames();
        fetchAnalytics();
      }
    } catch (err) {
      console.error('Purchase failed', err);
    }
  };

  const handleSubmitGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMsg(null);

    if (!formData.title || !formData.developer || !formData.developerEmail || !formData.description) {
      setSubmitMsg({ type: 'error', text: 'Please fill in all required game details.' });
      return;
    }

    if (formData.monetizationModel === 'Premium Purchase' && formData.price <= 0) {
      setSubmitMsg({ type: 'error', text: 'Premium Purchase games require a price greater than $0.' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/api/games/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitMsg({ type: 'success', text: 'Game published successfully to the Arcade! You are set to earn 85% revenue share.' });
        setFormData({
          title: '',
          developer: '',
          developerEmail: '',
          genre: 'Eco & Climate',
          description: '',
          thumbnailUrl: '',
          gameUrl: '',
          monetizationModel: 'Ad-Supported',
          price: 0
        });
        fetchGames();
        fetchAnalytics();
      } else {
        setSubmitMsg({ type: 'error', text: data.error || 'Failed to submit game.' });
      }
    } catch (err) {
      setSubmitMsg({ type: 'error', text: 'Server error while submitting game.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Live calculation for developer submit share
  const devShareAmount = formData.monetizationModel === 'Premium Purchase' || formData.monetizationModel === 'In-Game Pass / Subscription'
    ? (formData.price * 0.85).toFixed(2)
    : '0.85';

  return (
    <Layout>
      <Head>
        <title>Gaming Arcade & Developer Monetization Portal | Mawaba</title>
        <meta name="description" content="Discover, play, and publish HTML5 web games with industry-leading 85% developer revenue share monetization." />
      </Head>

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-gray-900 via-blue-950 to-indigo-900 text-white py-16 px-4 sm:px-6 lg:px-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-inner">
              <Gamepad2 className="h-4 w-4 text-blue-400 animate-pulse" />
              Web3 & HTML5 Next-Gen Gaming Engine
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent mb-4">
              Play, Submit & Monetize Games Globally
            </h1>
            <p className="text-lg text-blue-100/80 mb-8 leading-relaxed">
              Explore immersive web mini-games or publish your own creations. Game developers earn <span className="font-bold text-amber-300">85% revenue share</span> on all sales, ad impressions, micro-transactions, and community tips.
            </p>

            {/* Main Tabs */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setActiveTab('arcade')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                  activeTab === 'arcade'
                    ? 'bg-blue-600 text-white shadow-blue-500/30 scale-105'
                    : 'bg-white/10 text-blue-100 hover:bg-white/20'
                }`}
              >
                <Gamepad2 className="h-4 w-4" />
                <span>Gaming Arcade</span>
              </button>
              <button
                onClick={() => setActiveTab('submit')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                  activeTab === 'submit'
                    ? 'bg-emerald-600 text-white shadow-emerald-500/30 scale-105'
                    : 'bg-white/10 text-blue-100 hover:bg-white/20'
                }`}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Submit Your Game</span>
              </button>
              <button
                onClick={() => setActiveTab('monetization')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                  activeTab === 'monetization'
                    ? 'bg-amber-600 text-white shadow-amber-500/30 scale-105'
                    : 'bg-white/10 text-blue-100 hover:bg-white/20'
                }`}
              >
                <DollarSign className="h-4 w-4" />
                <span>Developer Earnings & Payouts</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* --- TAB 1: GAMING ARCADE --- */}
        {activeTab === 'arcade' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search games, developers, keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700">
                    <Filter className="h-3.5 w-3.5 text-blue-600" />
                    <span>Genre:</span>
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="bg-transparent border-none text-xs font-bold text-gray-900 focus:outline-none cursor-pointer"
                    >
                      {genres.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Monetization:</span>
                    <select
                      value={selectedMonetization}
                      onChange={(e) => setSelectedMonetization(e.target.value)}
                      className="bg-transparent border-none text-xs font-bold text-gray-900 focus:outline-none cursor-pointer"
                    >
                      {monetizationModels.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Cards Grid */}
            {loading ? (
              <div className="text-center py-16">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
                <p className="text-gray-500 font-medium text-sm">Loading gaming catalog...</p>
              </div>
            ) : games.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
                <Gamepad2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800">No Games Found</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mt-1 mb-4">
                  No games matched your search criteria. Be the first developer to publish a game in this category!
                </p>
                <button
                  onClick={() => setActiveTab('submit')}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition-all inline-flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Submit a Game</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
                  >
                    <div className="relative h-48 bg-gray-900 overflow-hidden">
                      <img
                        src={game.thumbnailUrl}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <Layers className="h-3 w-3 text-blue-400" />
                        <span>{game.genre}</span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold shadow-md ${
                          game.monetizationModel === 'Free' ? 'bg-emerald-500 text-white' :
                          game.monetizationModel === 'Ad-Supported' ? 'bg-blue-500 text-white' :
                          game.monetizationModel === 'Premium Purchase' ? 'bg-amber-500 text-white' :
                          'bg-indigo-600 text-white'
                        }`}>
                          {game.monetizationModel === 'Premium Purchase' ? `$${game.price.toFixed(2)}` : game.monetizationModel}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {game.title}
                          </h3>
                        </div>
                        <p className="text-xs text-blue-600 font-semibold mb-2">by {game.developer}</p>
                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                          {game.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 space-y-3">
                        <div className="flex justify-between items-center text-xs text-gray-500 font-semibold">
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-gray-400" />
                            {game.playCount.toLocaleString()} plays
                          </span>
                          <span className="flex items-center gap-1 text-amber-600 font-bold">
                            ★ {game.rating.toFixed(1)}
                          </span>
                          <span className="text-emerald-600 font-bold">
                            ${game.totalEarnings.toFixed(2)} dev earned
                          </span>
                        </div>

                        <button
                          onClick={() => handleStartPlay(game)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg"
                        >
                          <Play className="h-4 w-4 fill-current" />
                          <span>{game.monetizationModel === 'Premium Purchase' ? 'Buy & Launch Game' : 'Play Arcade Game'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2: SUBMIT A GAME --- */}
        {activeTab === 'submit' && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
              <div className="border-b border-gray-100 pb-6 mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
                  <ShieldCheck className="h-4 w-4" />
                  Instant Developer Publishing & Monetization
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">Submit Your Web Game</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Publish HTML5, WebGL, or Canvas mini-games directly to the Mawaba Gaming Hub. Retain full ownership with an automated 85% revenue payout split.
                </p>
              </div>

              {submitMsg && (
                <div className={`p-4 rounded-xl text-xs font-bold mb-6 flex items-center gap-2 ${
                  submitMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : <X className="h-4 w-4 shrink-0 text-red-600" />}
                  <span>{submitMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmitGame} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Game Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EcoGrid: Clean Energy Tycoon"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Genre / Category *</label>
                    <select
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Action & Arcade">Action & Arcade</option>
                      <option value="Puzzle & Logic">Puzzle & Logic</option>
                      <option value="Strategy & Simulation">Strategy & Simulation</option>
                      <option value="Educational & Sci-Fi">Educational & Sci-Fi</option>
                      <option value="Eco & Climate">Eco & Climate</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Developer / Studio Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AeroGames Studio"
                      value={formData.developer}
                      onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Developer Payout Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="dev@aerogames.io"
                      value={formData.developerEmail}
                      onChange={(e) => setFormData({ ...formData, developerEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Game Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe core mechanics, gameplay objectives, and educational or entertainment value..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Monetization Model *</label>
                    <select
                      value={formData.monetizationModel}
                      onChange={(e) => setFormData({ ...formData, monetizationModel: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Free">Free (Community & Tipping)</option>
                      <option value="Ad-Supported">Ad-Supported ($0.05/play payout)</option>
                      <option value="Premium Purchase">Premium Purchase (One-time price)</option>
                      <option value="In-Game Pass / Subscription">In-Game Pass / Subscription</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Price ($ USD) {formData.monetizationModel === 'Free' || formData.monetizationModel === 'Ad-Supported' ? '(N/A)' : ''}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      disabled={formData.monetizationModel === 'Free' || formData.monetizationModel === 'Ad-Supported'}
                      placeholder="4.99"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Thumbnail Image URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Game Embed/Canvas URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://cdn.html5games.com/mygame"
                      value={formData.gameUrl}
                      onChange={(e) => setFormData({ ...formData, gameUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Revenue Share Breakdown Banner */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-xs text-amber-900 font-medium">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>
                      Developer Revenue Split: <strong className="font-bold">85% ($ {devShareAmount} payout)</strong> • Platform Fee: 15%
                    </span>
                  </div>
                  <span className="font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">Instant Payouts</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                  <span>{submitting ? 'Publishing Game...' : 'Publish Game & Start Earning'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- TAB 3: DEVELOPER MONETIZATION & ANALYTICS --- */}
        {activeTab === 'monetization' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Analytics Summary Header */}
            {analytics && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Gross Revenue</p>
                    <h3 className="text-xl font-extrabold text-gray-900">${analytics.summary.grossRevenue.toFixed(2)}</h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Dev Payout Total (85%)</p>
                    <h3 className="text-xl font-extrabold text-emerald-600">${analytics.summary.developerPayoutTotal.toFixed(2)}</h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Total Plays</p>
                    <h3 className="text-xl font-extrabold text-gray-900">{analytics.summary.totalPlays.toLocaleString()}</h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                    <Gamepad2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Published Games</p>
                    <h3 className="text-xl font-extrabold text-gray-900">{analytics.summary.totalGames}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* Top Earning Games & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Earning Games */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Top Earning Games
                  </h3>
                  <span className="text-xs text-gray-500 font-semibold">85% Dev Split Rate</span>
                </div>

                {analytics?.topEarningGames.length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center">No monetization data yet.</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {analytics?.topEarningGames.map((g) => (
                      <div key={g.id} className="py-3 flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{g.title}</h4>
                          <p className="text-xs text-gray-500">by {g.developer} • {g.monetizationModel}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-emerald-600">${g.totalEarnings.toFixed(2)}</span>
                          <p className="text-xs text-gray-400">{g.playCount} plays</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Transactions */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                    Recent Transactions
                  </h3>
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Payout Status: Active</span>
                </div>

                {analytics?.recentTransactions.length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center">No monetization transactions recorded yet.</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {analytics?.recentTransactions.map((tx) => (
                      <div key={tx.id} className="py-3 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-gray-900 block">{tx.gameTitle}</span>
                          <span className="text-gray-500">{tx.type} • {tx.paymentMethod}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-gray-900">${tx.amount.toFixed(2)}</span>
                          <span className="block text-emerald-600 font-bold">Payout: ${tx.devPayoutAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Interactive Playable Game Modal */}
      {isPlaying && activePlayingGame && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gray-900 text-white rounded-3xl max-w-4xl w-full border border-gray-800 shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
              <div className="flex items-center gap-3">
                <Gamepad2 className="h-5 w-5 text-blue-400" />
                <div>
                  <h3 className="text-lg font-extrabold">{activePlayingGame.title}</h3>
                  <p className="text-xs text-gray-400">by {activePlayingGame.developer} • {activePlayingGame.genre}</p>
                </div>
              </div>

              <button
                onClick={() => setIsPlaying(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body: Interactive HTML5 Mini Game Canvas */}
            <div className="p-6 space-y-6">
              <div className="relative bg-black rounded-2xl h-80 flex flex-col items-center justify-center border border-gray-800 overflow-hidden text-center p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-indigo-900/10 to-emerald-900/20 pointer-events-none" />

                <div className="z-10 space-y-4 max-w-md">
                  <div className="inline-flex p-3 bg-blue-500/20 rounded-2xl border border-blue-400/30 text-blue-400 mb-1">
                    <Zap className="h-8 w-8 animate-bounce" />
                  </div>
                  <h4 className="text-xl font-bold text-white">{activePlayingGame.title} Session Active</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    [Live Game Engine Canvas running] <br />
                    Enjoy playing! Use keyboard/touch controls. Supporting game developers fosters innovation across global open platforms.
                  </p>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => handlePurchaseOrTip('Developer Tip', 2.00)}
                      className="bg-amber-500 hover:bg-amber-600 text-gray-950 px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Gift className="h-4 w-4" />
                      Tip Dev $2.00
                    </button>
                    {activePlayingGame.monetizationModel === 'Premium Purchase' && (
                      <button
                        onClick={() => handlePurchaseOrTip('Purchase', activePlayingGame.price)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                      >
                        <Lock className="h-4 w-4" />
                        Unlock Premium (${activePlayingGame.price.toFixed(2)})
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Purchase Feedback Banner */}
              {purchaseSuccessMsg && (
                <div className="bg-emerald-900/40 border border-emerald-500/50 p-3 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{purchaseSuccessMsg}</span>
                </div>
              )}

              {/* Game Metadata & Monetization Details */}
              <div className="bg-gray-800/60 p-4 rounded-xl border border-gray-700/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block font-semibold">Monetization Model:</span>
                  <span className="font-bold text-amber-400">{activePlayingGame.monetizationModel} (85% Dev Payout)</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-gray-300 font-semibold">Support the Creator:</span>
                  <div className="flex items-center gap-1">
                    {[1, 3, 5].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => handlePurchaseOrTip('Developer Tip', amt)}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-2.5 py-1 rounded-lg font-bold"
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
