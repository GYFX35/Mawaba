import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { getApiUrl } from '../components/apiConfig';
import {
  Music,
  Play,
  Pause,
  Heart,
  DollarSign,
  Sparkles,
  Search,
  Upload,
  MessageSquare,
  TrendingUp,
  Radio,
  Volume2,
  CheckCircle2,
  Share2,
  Tag,
  Mic,
  Disc,
  ListMusic,
  BarChart3,
  Award,
  Zap,
  Send,
  UserCheck
} from 'lucide-react';

interface MusicComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  artistEmail: string;
  genre: string;
  description: string;
  coverArtUrl: string;
  audioUrl: string;
  price: number;
  streamCount: number;
  likeCount: number;
  totalTipsUsd: number;
  devRevenueShare: number;
  tags: string[];
  comments: MusicComment[];
  createdAt: string;
}

interface MusicAnalytics {
  artistEmail: string;
  summary: {
    totalTracks: number;
    totalStreams: number;
    totalLikes: number;
    totalTipsUsd: number;
    artistPayoutTotal: number;
    platformFeeTotal: number;
    artistShareRate: string;
  };
  topTracks: MusicTrack[];
  recentTransactions: any[];
}

export default function MusicPage() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<MusicTrack[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Active playing track state
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Modals & Form state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showTipModal, setShowTipModal] = useState<boolean>(false);
  const [targetTrackForTip, setTargetTrackForTip] = useState<MusicTrack | null>(null);

  // Upload Track form
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newArtistEmail, setNewArtistEmail] = useState('');
  const [newGenre, setNewGenre] = useState('Afrobeats & Amapiano');
  const [newDescription, setNewDescription] = useState('');
  const [newCoverArtUrl, setNewCoverArtUrl] = useState('');
  const [newAudioUrl, setNewAudioUrl] = useState('');
  const [newPrice, setNewPrice] = useState('1.99');
  const [newTags, setNewTags] = useState('afrobeats, fusion');
  const [uploadStatus, setUploadStatus] = useState<{ success: boolean; msg: string } | null>(null);

  // Tipping form
  const [tipAmount, setTipAmount] = useState<string>('10.00');
  const [supporterEmail, setSupporterEmail] = useState<string>('');
  const [tipStatus, setTipStatus] = useState<{ success: boolean; msg: string } | null>(null);

  // Comments state
  const [expandedCommentsTrackId, setExpandedCommentsTrackId] = useState<string | null>(null);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');

  // AI Creator Assistant state
  const [aiMode, setAiMode] = useState<'Release Strategy' | 'Lyrics & Chords' | 'Press Release Generator'>('Release Strategy');
  const [aiTrackTitle, setAiTrackTitle] = useState('');
  const [aiArtistName, setAiArtistName] = useState('');
  const [aiGenre, setAiGenre] = useState('Afrobeats & Amapiano');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<any | null>(null);

  // Analytics state
  const [analytics, setAnalytics] = useState<MusicAnalytics | null>(null);

  const genres = [
    'All',
    'Afrobeats & Amapiano',
    'Electronic & Synthwave',
    'Hip-Hop & R&B',
    'Indie & Acoustic',
    'Global & Folk',
    'Ambient & Cinematic'
  ];

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiUrl('/api/music/tracks'));
      if (res.ok) {
        const data = await res.json();
        setTracks(data);
        setFilteredTracks(data);
        if (data.length > 0 && !currentTrack) {
          setCurrentTrack(data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch music tracks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(getApiUrl('/api/music/analytics'));
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to fetch music analytics:', err);
    }
  };

  useEffect(() => {
    fetchTracks();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    let result = [...tracks];
    if (selectedGenre !== 'All') {
      result = result.filter(t => t.genre.toLowerCase() === selectedGenre.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
    setFilteredTracks(result);
  }, [selectedGenre, searchQuery, tracks]);

  // Audio Playback Handler
  const handlePlayTrack = async (track: MusicTrack) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      // Increment stream count API
      try {
        await fetch(getApiUrl(`/api/music/tracks/${track.id}/stream`), { method: 'POST' });
        setTracks(prev =>
          prev.map(t => (t.id === track.id ? { ...t, streamCount: t.streamCount + 1 } : t))
        );
      } catch (err) {
        console.error('Error recording stream count:', err);
      }
    }
  };

  const handleLikeTrack = async (trackId: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/music/tracks/${trackId}/like`), { method: 'POST' });
      if (res.ok) {
        setTracks(prev =>
          prev.map(t => (t.id === trackId ? { ...t, likeCount: t.likeCount + 1 } : t))
        );
      }
    } catch (err) {
      console.error('Error liking track:', err);
    }
  };

  const handleUploadTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadStatus(null);
    if (!newTitle || !newArtist || !newArtistEmail || !newAudioUrl) {
      setUploadStatus({ success: false, msg: 'Please fill in all required fields.' });
      return;
    }

    try {
      const res = await fetch(getApiUrl('/api/music/tracks'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          artist: newArtist,
          artistEmail: newArtistEmail,
          genre: newGenre,
          description: newDescription || 'Promoted independent track on Mawaba Music Hub.',
          coverArtUrl: newCoverArtUrl,
          audioUrl: newAudioUrl,
          price: Number(newPrice) || 0,
          tags: newTags
        })
      });

      const data = await res.json();
      if (res.ok) {
        setUploadStatus({ success: true, msg: data.message });
        setShowUploadModal(false);
        fetchTracks();
        fetchAnalytics();
        // Reset form
        setNewTitle('');
        setNewArtist('');
        setNewArtistEmail('');
        setNewDescription('');
        setNewCoverArtUrl('');
        setNewAudioUrl('');
      } else {
        setUploadStatus({ success: false, msg: data.error || 'Failed to upload track' });
      }
    } catch (err) {
      setUploadStatus({ success: false, msg: 'Error submitting track to server.' });
    }
  };

  const handleSubmitTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTrackForTip || !tipAmount) return;

    try {
      const res = await fetch(getApiUrl(`/api/music/tracks/${targetTrackForTip.id}/tip`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supporterEmail: supporterEmail || 'fan@mawaba.org',
          amount: Number(tipAmount)
        })
      });

      const data = await res.json();
      if (res.ok) {
        setTipStatus({ success: true, msg: data.message });
        setTimeout(() => {
          setShowTipModal(false);
          setTipStatus(null);
          fetchTracks();
          fetchAnalytics();
        }, 1500);
      } else {
        setTipStatus({ success: false, msg: data.error || 'Failed to process tip' });
      }
    } catch (err) {
      setTipStatus({ success: false, msg: 'Server error processing tip.' });
    }
  };

  const handleAddComment = async (trackId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor || !commentText) return;

    try {
      const res = await fetch(getApiUrl(`/api/music/tracks/${trackId}/comments`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: commentAuthor,
          text: commentText
        })
      });

      if (res.ok) {
        setCommentText('');
        fetchTracks();
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const handleRunAiAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    setAiResult(null);

    try {
      const res = await fetch(getApiUrl('/api/music/ai-assistant'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: aiMode,
          trackTitle: aiTrackTitle,
          artistName: aiArtistName,
          genre: aiGenre,
          prompt: aiPrompt
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiResult(data);
      }
    } catch (err) {
      console.error('Error calling AI Creator Assistant:', err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Music Promotion & AI Creator Hub | Mawaba</title>
        <meta
          name="description"
          content="Promote independent music, engage with fans, receive direct supporter tips with 85% creator revenue share, and power releases with AI Creator Assistants."
        />
      </Head>

      <div className="bg-slate-950 text-slate-100 min-h-screen pb-20">

        {/* Hero Banner */}
        <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-purple-950/40 via-slate-950 to-slate-950 py-16 px-4 sm:px-6 lg:px-8">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold mb-6">
              <Disc className="w-4 h-4 animate-spin-slow text-purple-400" />
              <span>Independent Artist Direct Monetization • 85% Revenue Payout</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4">
              Global Music Promotion & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">AI Creator Hub</span>
            </h1>

            <p className="max-w-3xl mx-auto text-slate-400 text-base sm:text-lg mb-8 leading-relaxed">
              Empowering independent musicians, producers, and creators to showcase global tracks, gain worldwide fanbase exposure, collect direct supporter tips, and supercharge release strategies with AI Music Assistants.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg shadow-purple-900/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm"
              >
                <Upload className="w-4 h-4" />
                <span>Promote Your Track</span>
              </button>

              <a
                href="#ai-assistant"
                className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-200 font-extrabold px-6 py-3.5 rounded-2xl transition-all flex items-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Creator Assistant</span>
              </a>
            </div>
          </div>
        </section>

        {/* Global Floating Player bar */}
        {currentTrack && (
          <div className="sticky top-16 z-40 bg-slate-900/95 backdrop-blur-md border-b border-purple-950/50 px-4 py-3 shadow-xl">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={currentTrack.coverArtUrl}
                  alt={currentTrack.title}
                  className="w-12 h-12 rounded-xl object-cover border border-purple-500/30 shadow-md"
                />
                <div>
                  <div className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>{currentTrack.title}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {currentTrack.genre}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">{currentTrack.artist}</div>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
                <button
                  onClick={() => handlePlayTrack(currentTrack)}
                  className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <audio
                  ref={audioRef}
                  src={currentTrack.audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  controls
                  className="h-8 max-w-[260px] sm:max-w-md accent-purple-500 bg-slate-950 rounded-lg"
                />
              </div>

              {/* Player Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLikeTrack(currentTrack.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-400 text-xs font-bold transition-all"
                >
                  <Heart className="w-3.5 h-3.5 fill-pink-400" />
                  <span>{currentTrack.likeCount}</span>
                </button>

                <button
                  onClick={() => {
                    setTargetTrackForTip(currentTrack);
                    setShowTipModal(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md transition-all"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Tip Artist</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">

          {/* Search & Genre Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {genres.map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                    selectedGenre === genre
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-950/50'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search title, artist, tag..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Tracks Grid */}
          {loading ? (
            <div className="text-center py-20 text-slate-500 text-sm animate-pulse">
              Loading music promotion catalog...
            </div>
          ) : filteredTracks.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
              <Music className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">No tracks found</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting search filters or upload a new track to promote.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredTracks.map(track => {
                const isThisPlaying = currentTrack?.id === track.id && isPlaying;
                return (
                  <div
                    key={track.id}
                    className="bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-purple-950/20"
                  >
                    <div>
                      {/* Track Cover Header */}
                      <div className="relative rounded-2xl overflow-hidden aspect-video mb-4 bg-slate-950 group">
                        <img
                          src={track.coverArtUrl}
                          alt={track.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => handlePlayTrack(track)}
                            className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-xl transition-transform active:scale-90"
                          >
                            {isThisPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                          </button>
                        </div>
                        <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-purple-300 border border-purple-500/30 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                          {track.genre}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-base font-extrabold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                            {track.title}
                          </h3>
                          <div className="text-xs font-semibold text-purple-400 mt-0.5">{track.artist}</div>
                        </div>

                        <button
                          onClick={() => handlePlayTrack(track)}
                          className={`p-2.5 rounded-xl shrink-0 transition-all ${
                            isThisPlaying
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-800 text-slate-300 hover:bg-purple-600 hover:text-white'
                          }`}
                        >
                          {isThisPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      </div>

                      <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                        {track.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {track.tags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-bold text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="border-t border-slate-800/80 pt-4 mt-2">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-3">
                        <div className="flex items-center gap-1">
                          <Radio className="w-3.5 h-3.5 text-purple-400" />
                          <span>{track.streamCount.toLocaleString()} Streams</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-400">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>${track.totalTipsUsd.toFixed(2)} Tips</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleLikeTrack(track.id)}
                          className="flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-pink-400 py-2 rounded-xl text-xs font-extrabold transition-all"
                        >
                          <Heart className="w-3.5 h-3.5 fill-pink-400" />
                          <span>{track.likeCount}</span>
                        </button>

                        <button
                          onClick={() => {
                            setTargetTrackForTip(track);
                            setShowTipModal(true);
                          }}
                          className="flex items-center justify-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-2 rounded-xl text-xs font-black shadow-md transition-all"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Tip</span>
                        </button>

                        <button
                          onClick={() =>
                            setExpandedCommentsTrackId(
                              expandedCommentsTrackId === track.id ? null : track.id
                            )
                          }
                          className="flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl text-xs font-bold transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{track.comments.length}</span>
                        </button>
                      </div>

                      {/* Comments Drawer */}
                      {expandedCommentsTrackId === track.id && (
                        <div className="mt-4 pt-3 border-t border-slate-800 space-y-3 animate-in fade-in duration-200">
                          <div className="text-[11px] font-black uppercase text-purple-400 tracking-wider">
                            Listener Feedback ({track.comments.length})
                          </div>

                          <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                            {track.comments.length === 0 ? (
                              <div className="text-[11px] text-slate-500 italic">No comments yet. Be the first to comment!</div>
                            ) : (
                              track.comments.map(c => (
                                <div key={c.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                                  <div className="font-bold text-slate-200 flex justify-between">
                                    <span>{c.author}</span>
                                    <span className="text-[10px] font-normal text-slate-500">
                                      {new Date(c.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="text-slate-400 text-[11px] mt-0.5">{c.text}</div>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Post Comment Form */}
                          <form onSubmit={e => handleAddComment(track.id, e)} className="space-y-2 pt-1">
                            <input
                              type="text"
                              placeholder="Your Name / Handle"
                              value={commentAuthor}
                              onChange={e => setCommentAuthor(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                              required
                            />
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Add a comment..."
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                                required
                              />
                              <button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all"
                              >
                                Post
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* AI Creator Assistant Section */}
          <section id="ai-assistant" className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 sm:p-10 mb-16 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 relative z-10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>AI Music Producer & Co-Pilot</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">AI Music Creator Assistant</h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Generate release marketing roadmaps, press releases, lyric chord guides, and viral TikTok social hooks tailored for independent musicians.
                </p>
              </div>

              {/* Mode Selector */}
              <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-2xl w-full md:w-auto overflow-x-auto shrink-0">
                {(['Release Strategy', 'Lyrics & Chords', 'Press Release Generator'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setAiMode(mode)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      aiMode === mode ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleRunAiAssistant} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 relative z-10">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Track Title</label>
                <input
                  type="text"
                  placeholder="e.g. Savanna Sunset Groove"
                  value={aiTrackTitle}
                  onChange={e => setAiTrackTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Artist / Band Name</label>
                <input
                  type="text"
                  placeholder="e.g. Amina Diallo"
                  value={aiArtistName}
                  onChange={e => setAiArtistName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Primary Genre</label>
                <select
                  value={aiGenre}
                  onChange={e => setAiGenre(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  {genres.filter(g => g !== 'All').map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Custom Prompt / Creator Question
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="e.g. How can I pitch my track to Spotify editorial curators and build a pre-save campaign?"
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{aiLoading ? 'Generating...' : 'Run Assistant'}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* AI Assistant Output Card */}
            {aiResult && (
              <div className="bg-slate-950 rounded-2xl border border-purple-500/30 p-6 space-y-4 animate-in fade-in duration-200 relative z-10">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-black text-purple-300">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>AI Creator Guidance: {aiResult.mode}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{new Date(aiResult.timestamp).toLocaleTimeString()}</span>
                </div>

                <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-medium">
                  {aiResult.aiAdvice}
                </div>

                {aiResult.actionItems && aiResult.actionItems.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[11px] font-black uppercase text-purple-400 mb-2">Recommended Action Steps</div>
                    <ul className="space-y-1.5">
                      {aiResult.actionItems.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiResult.socialHooks && aiResult.socialHooks.length > 0 && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="text-[11px] font-black uppercase text-pink-400 mb-2">Viral Social Media Hooks (TikTok / Instagram / Shorts)</div>
                    <div className="space-y-1.5">
                      {aiResult.socialHooks.map((hook: string, idx: number) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-300 font-mono">
                          {hook}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Artist Creator Monetization Analytics Dashboard */}
          {analytics && (
            <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Creator Revenue Splits • 85% Artist Share</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Ecosystem Revenue & Analytics</h2>
                </div>
                <div className="text-xs font-bold text-slate-400 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
                  Payout Rate: <span className="text-emerald-400">85%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-slate-400 text-xs font-bold">Total Streams</div>
                  <div className="text-2xl font-black text-white mt-1">{analytics.summary.totalStreams.toLocaleString()}</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-slate-400 text-xs font-bold">Total Supporter Tips</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">${analytics.summary.totalTipsUsd.toFixed(2)}</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-slate-400 text-xs font-bold">Artist Earnings (85%)</div>
                  <div className="text-2xl font-black text-purple-400 mt-1">${analytics.summary.artistPayoutTotal.toFixed(2)}</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-slate-400 text-xs font-bold">Promoted Tracks</div>
                  <div className="text-2xl font-black text-blue-400 mt-1">{analytics.summary.totalTracks}</div>
                </div>
              </div>

              {/* Recent Tipping Transactions */}
              {analytics.recentTransactions && analytics.recentTransactions.length > 0 && (
                <div>
                  <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-3">Recent Supporter Tips</h3>
                  <div className="space-y-2">
                    {analytics.recentTransactions.map(tx => (
                      <div key={tx.id} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">{tx.trackTitle}</div>
                          <div className="text-[11px] text-slate-500">Supporter: {tx.supporterEmail}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-emerald-400">+${tx.amount.toFixed(2)}</div>
                          <div className="text-[10px] text-purple-400 font-bold">Artist Split: ${tx.artistPayoutAmount.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

        </div>

        {/* Upload Track Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-base font-black text-white">
                  <Upload className="w-5 h-5 text-purple-400" />
                  <span>Promote Music Track</span>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-slate-400 hover:text-white font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {uploadStatus && (
                <div className={`p-3 rounded-2xl mb-4 text-xs font-bold ${uploadStatus.success ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                  {uploadStatus.msg}
                </div>
              )}

              <form onSubmit={handleUploadTrack} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Track Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Savanna Sunset Groove"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Artist Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amina Diallo"
                      value={newArtist}
                      onChange={e => setNewArtist(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Artist Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. amina@rhythm.org"
                      value={newArtistEmail}
                      onChange={e => setNewArtistEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Genre *</label>
                    <select
                      value={newGenre}
                      onChange={e => setNewGenre(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                    >
                      {genres.filter(g => g !== 'All').map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Price ($) optional</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="1.99"
                      value={newPrice}
                      onChange={e => setNewPrice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Audio Stream URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/audio.mp3"
                    value={newAudioUrl}
                    onChange={e => setNewAudioUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Cover Art Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newCoverArtUrl}
                    onChange={e => setNewCoverArtUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of your music release..."
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. afrobeats, summer, vocal"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2.5 rounded-2xl text-slate-400 font-bold hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-6 py-2.5 rounded-2xl shadow-lg shadow-purple-900/50"
                  >
                    Publish Track
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Supporter Tipping Modal */}
        {showTipModal && targetTrackForTip && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-base font-black text-white">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>Tip {targetTrackForTip.artist}</span>
                </div>
                <button
                  onClick={() => setShowTipModal(false)}
                  className="text-slate-400 hover:text-white font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 mb-6">
                <img
                  src={targetTrackForTip.coverArtUrl}
                  alt={targetTrackForTip.title}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <div className="text-xs font-black text-white">{targetTrackForTip.title}</div>
                  <div className="text-[11px] text-purple-400 font-bold">{targetTrackForTip.artist}</div>
                </div>
              </div>

              {tipStatus && (
                <div className={`p-3 rounded-2xl mb-4 text-xs font-bold ${tipStatus.success ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                  {tipStatus.msg}
                </div>
              )}

              <form onSubmit={handleSubmitTip} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Tip Amount ($ USD)</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {['5.00', '10.00', '25.00', '50.00'].map(amt => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setTipAmount(amt)}
                        className={`py-2 rounded-xl font-bold transition-all ${
                          tipAmount === amt
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    step="0.50"
                    required
                    value={tipAmount}
                    onChange={e => setTipAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Your Email Address</label>
                  <input
                    type="email"
                    placeholder="supporter@mawaba.org"
                    value={supporterEmail}
                    onChange={e => setSupporterEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl text-[11px] text-emerald-300">
                  ⚡ <strong>85% Creator Guarantee:</strong> ${(+tipAmount * 0.85).toFixed(2)} goes directly to {targetTrackForTip.artist}.
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowTipModal(false)}
                    className="px-4 py-2.5 rounded-2xl text-slate-400 font-bold hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold px-6 py-2.5 rounded-2xl shadow-lg"
                  >
                    Confirm Tip
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
