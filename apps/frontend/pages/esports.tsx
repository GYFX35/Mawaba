import { getApiUrl, API_BASE_URL } from '../components/apiConfig';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import {
  Trophy,
  Cpu,
  ShieldCheck,
  Zap,
  Play,
  PlusCircle,
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  Lock,
  ExternalLink,
  Copy,
  RefreshCw,
  X,
  Globe,
  Coins,
  Share2,
  FileCode,
  Layers,
  BarChart3
} from 'lucide-react';

interface EsportTournament {
  id: string;
  title: string;
  gameTitle: string;
  genre: 'FPS & Tactical Shooter' | 'MOBA & Strategy' | 'Arcade & Fighting' | 'Sim Racing & Sports' | 'Eco & Web3 Strategy';
  organizer: string;
  organizerEmail: string;
  prizePoolUsd: number;
  prizePoolCrypto: string;
  smartContractAddress: string;
  blockchainNetwork: string;
  rules: string;
  teamsCount: number;
  maxTeams: number;
  status: 'Upcoming' | 'Live' | 'Completed';
  aiMatchPrediction?: {
    favoriteTeam: string;
    winProbabilityPct: number;
    recommendedTactics: string;
  };
  createdAt: string;
}

interface EsportPlayerPassport {
  id: string;
  playerHandle: string;
  email: string;
  walletAddress: string;
  gameTitle: string;
  nftTokenId: string;
  contractAddress: string;
  transactionHash: string;
  blockchainNetwork: string;
  achievements: string[];
  rank: string;
  reputationScore: number;
  createdAt: string;
}

interface EsportBlockchainPayout {
  id: string;
  tournamentId: string;
  tournamentTitle: string;
  winnerHandle: string;
  winnerWallet: string;
  payoutAmountUsd: number;
  payoutAmountCrypto: string;
  transactionHash: string;
  blockchainNetwork: string;
  status: 'Confirmed' | 'Pending Escrow';
  timestamp: string;
}

interface EsportAnalytics {
  summary: {
    totalTournaments: number;
    totalPrizePoolUsd: number;
    totalPassportsMinted: number;
    totalPayoutsExecuted: number;
    totalPayoutsUsd: number;
    blockchainNetworksSupported: string[];
  };
  activeTournaments: EsportTournament[];
  recentPassports: EsportPlayerPassport[];
  recentPayouts: EsportBlockchainPayout[];
}

export default function EsportsPage() {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'ai-coach' | 'passports' | 'analytics'>('tournaments');
  const [tournaments, setTournaments] = useState<EsportTournament[]>([]);
  const [analytics, setAnalytics] = useState<EsportAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Copy feedback state
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Tournament Join Modal state
  const [joiningTournament, setJoiningTournament] = useState<EsportTournament | null>(null);
  const [joinTeamName, setJoinTeamName] = useState('');
  const [joinCaptainHandle, setJoinCaptainHandle] = useState('');
  const [joinWalletAddress, setJoinWalletAddress] = useState('');
  const [joinSubmitting, setJoinSubmitting] = useState(false);
  const [joinMsg, setJoinMsg] = useState('');

  // AI Coach Query state
  const [coachGameTitle, setCoachGameTitle] = useState('Cyber Warfare & Tactical Tactics');
  const [coachTeamComp, setCoachTeamComp] = useState('Double Initiator, Sniper Hold & Fast Flanker');
  const [coachOpponentStrat, setCoachOpponentStrat] = useState('Fast B-Site Rush with Smoke Flashes & Heavy Armor');
  const [coachFocusArea, setCoachFocusArea] = useState('Draft & Counter-Picks');
  const [coachSkillLevel, setCoachSkillLevel] = useState('Pro');
  const [coachAnalyzing, setCoachAnalyzing] = useState(false);
  const [coachResult, setCoachResult] = useState<{
    tacticalAdvice: string;
    winProbabilityPct: number;
    counterPicks: string[];
    keyTakeaways: string[];
  } | null>(null);

  // Passport Minting state
  const [passports, setPassports] = useState<EsportPlayerPassport[]>([]);
  const [mintHandle, setMintHandle] = useState('');
  const [mintEmail, setMintEmail] = useState('');
  const [mintWallet, setMintWallet] = useState('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
  const [mintGame, setMintGame] = useState('Cyber Warfare & Tactical Tactics');
  const [mintRank, setMintRank] = useState('Pro Challenger');
  const [minting, setMinting] = useState(false);
  const [mintMsg, setMintMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Tournament Submission Modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittingTrn, setSubmittingTrn] = useState(false);
  const [trnSubmitMsg, setTrnSubmitMsg] = useState('');
  const [trnData, setTrnData] = useState({
    title: '',
    gameTitle: 'Cyber Warfare & Tactical Tactics',
    genre: 'FPS & Tactical Shooter' as EsportTournament['genre'],
    organizer: '',
    organizerEmail: '',
    prizePoolUsd: 10000,
    prizePoolCrypto: '4.0 ETH',
    blockchainNetwork: 'Polygon PoS Mainnet',
    rules: '5v5 Double Elimination. Web3 smart contract prize escrow enabled.',
    maxTeams: 32
  });

  const genres = ['All', 'FPS & Tactical Shooter', 'MOBA & Strategy', 'Arcade & Fighting', 'Sim Racing & Sports', 'Eco & Web3 Strategy'];
  const statuses = ['All', 'Live', 'Upcoming', 'Completed'];

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      let url = getApiUrl(`/api/esports/tournaments?genre=${encodeURIComponent(selectedGenre)}&status=${encodeURIComponent(selectedStatus)}`);
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTournaments(data);
      }
    } catch (err) {
      console.error('Failed to fetch e-sports tournaments', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(getApiUrl('/api/esports/analytics'));
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
        if (data.recentPassports) {
          setPassports(data.recentPassports);
        }
      }
    } catch (err) {
      console.error('Failed to fetch e-sports analytics', err);
    }
  };

  useEffect(() => {
    fetchTournaments();
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre, selectedStatus, searchQuery]);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleJoinTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joiningTournament) return;

    setJoinSubmitting(true);
    setJoinMsg('');

    try {
      const res = await fetch(getApiUrl(`/api/esports/tournaments/${joiningTournament.id}/join`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: joinTeamName,
          captainHandle: joinCaptainHandle,
          walletAddress: joinWalletAddress
        })
      });

      const data = await res.json();
      if (res.ok) {
        setJoinMsg(data.message || 'Successfully joined tournament roster!');
        setTimeout(() => {
          setJoiningTournament(null);
          setJoinTeamName('');
          setJoinCaptainHandle('');
          setJoinWalletAddress('');
          setJoinMsg('');
          fetchTournaments();
          fetchAnalytics();
        }, 1500);
      } else {
        setJoinMsg(data.error || 'Failed to join tournament');
      }
    } catch (err) {
      setJoinMsg('Server error while joining tournament');
    } finally {
      setJoinSubmitting(false);
    }
  };

  const handleQueryAiCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    setCoachAnalyzing(true);
    setCoachResult(null);

    try {
      const res = await fetch(getApiUrl('/api/esports/ai-coach'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameTitle: coachGameTitle,
          userTeamComposition: coachTeamComp,
          opponentStrategy: coachOpponentStrat,
          focusArea: coachFocusArea,
          userSkillLevel: coachSkillLevel
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCoachResult(data);
      }
    } catch (err) {
      console.error('Failed to query AI coach', err);
    } finally {
      setCoachAnalyzing(false);
    }
  };

  const handleMintPassport = async (e: React.FormEvent) => {
    e.preventDefault();
    setMintMsg(null);

    if (!mintHandle || !mintEmail || !mintWallet) {
      setMintMsg({ type: 'error', text: 'Please fill in all player passport fields.' });
      return;
    }

    try {
      setMinting(true);
      const res = await fetch(getApiUrl('/api/esports/blockchain/mint-passport'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerHandle: mintHandle,
          email: mintEmail,
          walletAddress: mintWallet,
          gameTitle: mintGame,
          rank: mintRank,
          achievements: ['Verified Web3 Athlete', 'Challenger Contender']
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMintMsg({ type: 'success', text: `Web3 Player Passport ${data.passport.nftTokenId} minted on-chain!` });
        setPassports(prev => [data.passport, ...prev]);
        setMintHandle('');
        setMintEmail('');
        fetchAnalytics();
      } else {
        setMintMsg({ type: 'error', text: data.error || 'Failed to mint passport' });
      }
    } catch (err) {
      setMintMsg({ type: 'error', text: 'Server error during Web3 minting' });
    } finally {
      setMinting(false);
    }
  };

  const handleSubmitTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrnSubmitMsg('');

    if (!trnData.title || !trnData.organizer || !trnData.organizerEmail) {
      setTrnSubmitMsg('Please fill in required tournament details.');
      return;
    }

    try {
      setSubmittingTrn(true);
      const res = await fetch(getApiUrl('/api/esports/tournaments'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trnData)
      });

      const data = await res.json();
      if (res.ok) {
        setTrnSubmitMsg('Tournament published successfully with Web3 escrow contract!');
        setTimeout(() => {
          setShowSubmitModal(false);
          setTrnSubmitMsg('');
          setTrnData({
            title: '',
            gameTitle: 'Cyber Warfare & Tactical Tactics',
            genre: 'FPS & Tactical Shooter',
            organizer: '',
            organizerEmail: '',
            prizePoolUsd: 10000,
            prizePoolCrypto: '4.0 ETH',
            blockchainNetwork: 'Polygon PoS Mainnet',
            rules: '5v5 Double Elimination. Web3 smart contract prize escrow enabled.',
            maxTeams: 32
          });
          fetchTournaments();
          fetchAnalytics();
        }, 1500);
      } else {
        setTrnSubmitMsg(data.error || 'Failed to publish tournament');
      }
    } catch (err) {
      setTrnSubmitMsg('Server error while publishing tournament');
    } finally {
      setSubmittingTrn(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>E-Sports Arena: AI Strategy Coaching & Web3 Blockchain Tournaments | Mawaba</title>
        <meta
          name="description"
          content="Competitive E-sports hub integrating real-time AI match strategy analysis, counter-picks, Web3 smart contract prize escrow, and on-chain player NFT passports."
        />
      </Head>

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 text-white py-16 px-4 sm:px-6 lg:px-8 shadow-2xl relative overflow-hidden border-b border-indigo-900/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10 pointer-events-none">
          <Trophy className="w-96 h-96 text-indigo-400" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-extrabold uppercase tracking-wider shadow-inner">
              <Zap className="h-4 w-4 text-amber-400 animate-pulse" />
              AI Match Coaching & Web3 Smart Contract Arena
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-300 bg-clip-text text-transparent">
              E-Sports Intelligence & Web3 Blockchain League
            </h1>
            <p className="text-base sm:text-lg text-indigo-100/80 leading-relaxed font-normal">
              Empowering professional e-sports teams with real-time <span className="text-amber-300 font-bold">AI match telemetry coaching</span>, automated smart contract prize pools, and verifiable on-chain player passports.
            </p>

            {/* Quick Action Controls */}
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setActiveTab('tournaments')}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg ${
                  activeTab === 'tournaments'
                    ? 'bg-indigo-600 text-white shadow-indigo-500/30 scale-105'
                    : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                }`}
              >
                <Trophy className="h-4 w-4" />
                <span>Web3 Tournaments</span>
              </button>
              <button
                onClick={() => setActiveTab('ai-coach')}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg ${
                  activeTab === 'ai-coach'
                    ? 'bg-purple-600 text-white shadow-purple-500/30 scale-105'
                    : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                }`}
              >
                <Cpu className="h-4 w-4" />
                <span>AI Strategy Coach</span>
              </button>
              <button
                onClick={() => setActiveTab('passports')}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg ${
                  activeTab === 'passports'
                    ? 'bg-amber-600 text-white shadow-amber-500/30 scale-105'
                    : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Player NFT Passports</span>
              </button>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Organize Tournament</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* --- TAB 1: WEB3 TOURNAMENTS & PRIZE ESCROW --- */}
        {activeTab === 'tournaments' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search e-sports tournaments, games, rules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700">
                    <Filter className="h-3.5 w-3.5 text-indigo-600" />
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
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <span>Status:</span>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="bg-transparent border-none text-xs font-bold text-gray-900 focus:outline-none cursor-pointer"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Tournaments Grid */}
            {loading ? (
              <div className="text-center py-16">
                <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-3" />
                <p className="text-gray-500 font-medium text-xs">Loading competitive tournaments & Web3 escrow contracts...</p>
              </div>
            ) : tournaments.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
                <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800">No E-Sports Tournaments Found</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4">
                  No tournaments matched your criteria. Organize a new tournament with automated Web3 smart contract prize escrow!
                </p>
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 transition-all inline-flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Publish E-Sports Tournament</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map((trn) => (
                  <div
                    key={trn.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      {/* Header Badge & Title */}
                      <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                            {trn.genre}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-sm ${
                            trn.status === 'Live' ? 'bg-red-500 text-white animate-pulse' :
                            trn.status === 'Upcoming' ? 'bg-amber-500 text-white' :
                            'bg-emerald-600 text-white'
                          }`}>
                            {trn.status}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                          {trn.title}
                        </h3>
                        <p className="text-xs text-indigo-200/80 font-medium">Game: {trn.gameTitle}</p>
                      </div>

                      {/* Prize Pool & Web3 Escrow details */}
                      <div className="p-5 space-y-4">
                        <div className="bg-amber-50/80 border border-amber-200/70 p-3.5 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold uppercase text-amber-700 block">Total Guaranteed Prize Escrow</span>
                          <div className="flex justify-between items-baseline">
                            <span className="text-xl font-black text-amber-900">${trn.prizePoolUsd.toLocaleString()} USD</span>
                            <span className="text-xs font-bold text-amber-700">{trn.prizePoolCrypto}</span>
                          </div>
                        </div>

                        {/* Smart Contract Info */}
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80 space-y-1 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-bold flex items-center gap-1">
                              <FileCode className="h-3.5 w-3.5 text-indigo-600" /> Contract:
                            </span>
                            <span className="text-indigo-600 font-extrabold text-[10px] bg-indigo-50 px-2 py-0.5 rounded">
                              {trn.blockchainNetwork}
                            </span>
                          </div>
                          <div className="flex items-center justify-between font-mono text-[11px] text-gray-700 bg-white p-1.5 rounded border border-gray-200">
                            <span className="truncate max-w-[200px]">{trn.smartContractAddress}</span>
                            <button
                              onClick={() => handleCopyText(trn.smartContractAddress)}
                              className="text-indigo-600 hover:text-indigo-800 p-1"
                              title="Copy Contract Address"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* AI Match Prediction Banner */}
                        {trn.aiMatchPrediction && (
                          <div className="bg-purple-50 border border-purple-100 p-3 rounded-xl text-xs space-y-1">
                            <div className="flex justify-between items-center text-purple-900 font-bold">
                              <span className="flex items-center gap-1 text-[11px]">
                                <Sparkles className="h-3.5 w-3.5 text-purple-600" /> AI Favorite:
                              </span>
                              <span className="text-purple-700 bg-purple-200/60 px-2 py-0.5 rounded font-extrabold">
                                {trn.aiMatchPrediction.winProbabilityPct}% Win Prob
                              </span>
                            </div>
                            <p className="text-[11px] text-purple-800 font-medium truncate">
                              {trn.aiMatchPrediction.favoriteTeam}
                            </p>
                          </div>
                        )}

                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                          {trn.rules}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-5 pt-0 border-t border-gray-100 mt-2 space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-gray-400" /> {trn.teamsCount} / {trn.maxTeams} Teams
                        </span>
                        <span className="text-indigo-600 font-bold">
                          by {trn.organizer}
                        </span>
                      </div>

                      <button
                        onClick={() => setJoiningTournament(trn)}
                        disabled={trn.teamsCount >= trn.maxTeams || trn.status === 'Completed'}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Trophy className="h-4 w-4" />
                        <span>{trn.teamsCount >= trn.maxTeams ? 'Roster Full' : 'Register Team for Tournament'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2: AI MATCH STRATEGY COACH --- */}
        {activeTab === 'ai-coach' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-6">
              <div className="border-b border-gray-100 pb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold mb-2">
                  <Cpu className="h-4 w-4" /> Real-Time E-Sports AI Telemetry & Counter Engine
                </div>
                <h2 className="text-2xl font-black text-gray-900">E-Sports AI Match Tactical Coach</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Query Mawaba AI to analyze team lineup synergies, opponent counter-strategies, frame advantage tactics, and win probability calculations.
                </p>
              </div>

              <form onSubmit={handleQueryAiCoach} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">E-Sports Game Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cyber Warfare, Valorant, EcoGrid, Dota 2"
                      value={coachGameTitle}
                      onChange={(e) => setCoachGameTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Focus Coaching Area *</label>
                    <select
                      value={coachFocusArea}
                      onChange={(e) => setCoachFocusArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                    >
                      <option value="Draft & Counter-Picks">Draft & Counter-Picks</option>
                      <option value="Economy & Resource Management">Economy & Resource Management</option>
                      <option value="Reaction & Frame Timing">Reaction & Frame Timing</option>
                      <option value="Teamfight Positioning & Rotations">Teamfight Positioning & Rotations</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Team Composition & Strategy *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. Double Initiators, Anchor Sniper, Heavy Crowd Control utility..."
                    value={coachTeamComp}
                    onChange={(e) => setCoachTeamComp(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Opponent Known Strategy / Picks *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. Fast aggressive A-site rush, early flash smokes, heavy sniper hold..."
                    value={coachOpponentStrat}
                    onChange={(e) => setCoachOpponentStrat(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={coachAnalyzing}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {coachAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  <span>{coachAnalyzing ? 'Analyzing E-Sports Telemetry...' : 'Generate AI Match Strategy Report'}</span>
                </button>
              </form>

              {/* AI Coaching Output Card */}
              {coachResult && (
                <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-5 animate-in fade-in duration-300 border border-purple-900/50 shadow-2xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-purple-400 bg-purple-500/20 px-2.5 py-1 rounded-full border border-purple-500/30">
                        AI Tactical Report
                      </span>
                      <h3 className="text-lg font-extrabold text-white mt-1">{coachGameTitle} Analysis</h3>
                    </div>

                    <div className="bg-purple-950 px-4 py-2 rounded-xl border border-purple-800 text-right">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">Win Probability</span>
                      <span className="text-xl font-black text-amber-400">{coachResult.winProbabilityPct}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase">Core Tactical Recommendation:</h4>
                    <p className="text-xs text-gray-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                      {coachResult.tacticalAdvice}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-amber-400 uppercase">Key Counter-Picks & Adjustment Triggers:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {coachResult.counterPicks.map((pick, i) => (
                        <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-gray-300 flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pick}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 3: ON-CHAIN PLAYER NFT PASSPORTS --- */}
        {activeTab === 'passports' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Mint Passport Form */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 space-y-5">
                <div className="border-b border-gray-100 pb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold mb-1">
                    <ShieldCheck className="h-4 w-4" /> Web3 On-Chain Verification
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900">Mint Player NFT Passport</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Register your verified Web3 athlete badge with tournament achievements stored permanently on-chain.
                  </p>
                </div>

                {mintMsg && (
                  <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    mintMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {mintMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : <X className="h-4 w-4 shrink-0 text-red-600" />}
                    <span>{mintMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleMintPassport} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Player Gamer Handle *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CyberAce_01"
                      value={mintHandle}
                      onChange={(e) => setMintHandle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="gamer@mawaba.org"
                      value={mintEmail}
                      onChange={(e) => setMintEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Web3 Wallet Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                      value={mintWallet}
                      onChange={(e) => setMintWallet(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Main Game Specialty</label>
                    <input
                      type="text"
                      required
                      value={mintGame}
                      onChange={(e) => setMintGame(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Competitive Rank Tier</label>
                    <select
                      value={mintRank}
                      onChange={(e) => setMintRank(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="Pro Challenger">Pro Challenger</option>
                      <option value="Pro Grandmaster Tier">Pro Grandmaster Tier</option>
                      <option value="Elite Strategist">Elite Strategist</option>
                      <option value="Tournament MVP">Tournament MVP</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={minting}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {minting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                    <span>{minting ? 'Minting NFT Passport...' : 'Mint Web3 Passport On-Chain'}</span>
                  </button>
                </form>
              </div>

              {/* Passports List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-amber-500" />
                    Verified Player Passports & Badges
                  </h3>
                  <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full">
                    {passports.length} Passports Minted
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {passports.map((pass) => (
                    <div key={pass.id} className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
                      <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                            {pass.nftTokenId}
                          </span>
                          <h4 className="text-base font-bold text-white mt-1">{pass.playerHandle}</h4>
                        </div>
                        <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {pass.rank}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <p className="text-gray-400 font-medium">Game: <span className="text-white font-bold">{pass.gameTitle}</span></p>
                        <p className="text-gray-400 font-medium">Reputation Score: <span className="text-amber-400 font-bold">{pass.reputationScore}/100</span></p>
                      </div>

                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] space-y-1 font-mono text-gray-400">
                        <div className="flex justify-between">
                          <span>Wallet:</span>
                          <span className="text-gray-200 truncate max-w-[120px]">{pass.walletAddress}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tx Hash:</span>
                          <span className="text-indigo-400 truncate max-w-[120px]">{pass.transactionHash}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {pass.achievements.map((ach, i) => (
                          <span key={i} className="text-[9px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded font-bold">
                            ★ {ach}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- TAB 4: E-SPORTS ANALYTICS --- */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Analytics Cards */}
            {analytics && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                    <Coins className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Total Escrow Prize Pools</p>
                    <h3 className="text-xl font-extrabold text-gray-900">${analytics.summary.totalPrizePoolUsd.toLocaleString()}</h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Active Tournaments</p>
                    <h3 className="text-xl font-extrabold text-gray-900">{analytics.summary.totalTournaments}</h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Web3 Passports Minted</p>
                    <h3 className="text-xl font-extrabold text-purple-600">{analytics.summary.totalPassportsMinted}</h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">On-Chain Payouts Executed</p>
                    <h3 className="text-xl font-extrabold text-emerald-600">${analytics.summary.totalPayoutsUsd.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* Recent On-Chain Payout Transactions */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-indigo-600" />
                  Smart Contract Prize Pool Disburstments
                </h3>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                  Automated Escrow
                </span>
              </div>

              {analytics?.recentPayouts.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">No smart contract payouts executed yet.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {analytics?.recentPayouts.map((po) => (
                    <div key={po.id} className="py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-xs">
                      <div>
                        <span className="font-bold text-gray-900 block">{po.tournamentTitle}</span>
                        <span className="text-gray-500 font-medium">
                          Winner: <strong className="text-indigo-600">{po.winnerHandle}</strong> ({po.winnerWallet})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-emerald-600 block">${po.payoutAmountUsd.toLocaleString()} ({po.payoutAmountCrypto})</span>
                        <span className="text-[10px] text-gray-400 font-mono">Tx: {po.transactionHash}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: JOIN TOURNAMENT MODAL */}
      {joiningTournament && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-gray-100 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Register Team for Tournament</h3>
                <p className="text-xs text-gray-500">{joiningTournament.title}</p>
              </div>
              <button
                onClick={() => setJoiningTournament(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {joinMsg ? (
              <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 p-4 rounded-xl text-xs font-bold text-center">
                {joinMsg}
              </div>
            ) : (
              <form onSubmit={handleJoinTournament} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Team Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cyber Strikers Alpha"
                    value={joinTeamName}
                    onChange={(e) => setJoinTeamName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Team Captain Handle *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ViperCap"
                    value={joinCaptainHandle}
                    onChange={(e) => setJoinCaptainHandle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Captain Web3 Wallet Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                    value={joinWalletAddress}
                    onChange={(e) => setJoinWalletAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setJoiningTournament(null)}
                    className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={joinSubmitting}
                    className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {joinSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
                    <span>{joinSubmitting ? 'Registering...' : 'Confirm Registration'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: SUBMIT / ORGANIZE TOURNAMENT MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-gray-100 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Publish E-Sports Web3 Tournament</h3>
                <p className="text-xs text-gray-500">Automated Smart Contract Prize Escrow Integration</p>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {trnSubmitMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold text-center">
                {trnSubmitMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmitTournament} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Tournament Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Legends Champions 2025"
                      value={trnData.title}
                      onChange={(e) => setTrnData({ ...trnData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Game Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cyber Warfare, Valorant"
                      value={trnData.gameTitle}
                      onChange={(e) => setTrnData({ ...trnData, gameTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Genre *</label>
                    <select
                      value={trnData.genre}
                      onChange={(e) => setTrnData({ ...trnData, genre: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="FPS & Tactical Shooter">FPS & Tactical Shooter</option>
                      <option value="MOBA & Strategy">MOBA & Strategy</option>
                      <option value="Arcade & Fighting">Arcade & Fighting</option>
                      <option value="Sim Racing & Sports">Sim Racing & Sports</option>
                      <option value="Eco & Web3 Strategy">Eco & Web3 Strategy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Blockchain Network</label>
                    <select
                      value={trnData.blockchainNetwork}
                      onChange={(e) => setTrnData({ ...trnData, blockchainNetwork: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="Polygon PoS Mainnet">Polygon PoS Mainnet</option>
                      <option value="Ethereum Sepolia Testnet">Ethereum Sepolia Testnet</option>
                      <option value="Arbitrum One">Arbitrum One</option>
                      <option value="Solana Devnet">Solana Devnet</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Organizer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Gaming League"
                      value={trnData.organizer}
                      onChange={(e) => setTrnData({ ...trnData, organizer: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Organizer Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="esports@apex.org"
                      value={trnData.organizerEmail}
                      onChange={(e) => setTrnData({ ...trnData, organizerEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Prize Pool ($ USD)</label>
                    <input
                      type="number"
                      required
                      min="100"
                      value={trnData.prizePoolUsd}
                      onChange={(e) => setTrnData({ ...trnData, prizePoolUsd: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Crypto Escrow Display</label>
                    <input
                      type="text"
                      placeholder="e.g. 4.0 ETH or 50,000 MAWA"
                      value={trnData.prizePoolCrypto}
                      onChange={(e) => setTrnData({ ...trnData, prizePoolCrypto: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTrn}
                    className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submittingTrn ? <RefreshCw className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                    <span>{submittingTrn ? 'Publishing...' : 'Publish Tournament'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </Layout>
  );
}
