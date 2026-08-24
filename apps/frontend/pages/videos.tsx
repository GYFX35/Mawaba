import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import {
  Video,
  Play,
  Heart,
  Share2,
  Download,
  MessageCircle,
  PlusCircle,
  Search,
  X,
  Sparkles,
  Filter,
  Upload,
  User,
  Eye,
  CheckCircle2,
  Copy,
  Camera,
  Film
} from 'lucide-react';

interface VideoComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface VideoItem {
  id: string;
  title: string;
  category: 'Entertainment' | 'Gaming & Esports' | 'Music & Dance' | 'Culture & Vlogs' | 'Education & Sci-Fi' | 'Comedy & Shorts';
  description: string;
  author: string;
  thumbnailUrl?: string;
  videoUrl: string;
  likes: number;
  shares: number;
  downloads: number;
  views: number;
  comments: VideoComment[];
  createdAt: string;
}

const CATEGORIES = [
  'All',
  'Entertainment',
  'Gaming & Esports',
  'Music & Dance',
  'Culture & Vlogs',
  'Education & Sci-Fi',
  'Comedy & Shorts'
];

const VideosHubPage = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Selected Video for Modal / Full Player view
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Submission Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState<'Entertainment' | 'Gaming & Esports' | 'Music & Dance' | 'Culture & Vlogs' | 'Education & Sci-Fi' | 'Comedy & Shorts'>('Entertainment');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoAuthor, setVideoAuthor] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [thumbnailUrlInput, setThumbnailUrlInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Comment state per video ID
  const [activeCommentVidId, setActiveCommentVidId] = useState<string | null>(null);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');

  // HTML5 WebRTC Video Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchVideos();
    // Pre-fill author if logged in
    const savedUser = localStorage.getItem('mawaba_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.name) setVideoAuthor(u.name);
      } catch (e) {}
    }
  }, [selectedCategory, searchQuery]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`http://localhost:3001/api/videos?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (err) {
      console.error('Failed to fetch videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:3001/api/videos/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setVideos(videos.map(v => v.id === id ? { ...v, likes: data.likes } : v));
        if (selectedVideo && selectedVideo.id === id) {
          setSelectedVideo({ ...selectedVideo, likes: data.likes });
        }
        showToast('Liked video!');
      }
    } catch (err) {
      console.error('Error liking video:', err);
    }
  };

  const handleShare = async (video: VideoItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:3001/api/videos/${video.id}/share`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setVideos(videos.map(v => v.id === video.id ? { ...v, shares: data.shares } : v));
        if (selectedVideo && selectedVideo.id === video.id) {
          setSelectedVideo({ ...selectedVideo, shares: data.shares });
        }

        // Copy share link to clipboard
        const linkToCopy = `${window.location.origin}/videos?id=${video.id}`;
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(linkToCopy);
          showToast(`Share link copied to clipboard! (${data.shares} shares)`);
        } else {
          showToast(`Shared video! Total shares: ${data.shares}`);
        }
      }
    } catch (err) {
      console.error('Error sharing video:', err);
    }
  };

  const handleDownload = async (video: VideoItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:3001/api/videos/${video.id}/download`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setVideos(videos.map(v => v.id === video.id ? { ...v, downloads: data.downloads } : v));
        if (selectedVideo && selectedVideo.id === video.id) {
          setSelectedVideo({ ...selectedVideo, downloads: data.downloads });
        }

        // Trigger browser download anchor link
        const a = document.createElement('a');
        a.href = video.videoUrl;
        a.download = `${video.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        showToast(`Download started! Total downloads: ${data.downloads}`);
      }
    } catch (err) {
      console.error('Error downloading video:', err);
    }
  };

  const handleAddComment = async (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) return;

    try {
      const res = await fetch(`http://localhost:3001/api/videos/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: commentAuthor, text: commentText })
      });

      if (res.ok) {
        const data = await res.json();
        setVideos(videos.map(v => v.id === id ? { ...v, comments: data.video.comments } : v));
        if (selectedVideo && selectedVideo.id === id) {
          setSelectedVideo({ ...selectedVideo, comments: data.video.comments });
        }
        setCommentText('');
        showToast('Comment posted successfully!');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // WebRTC Recording Functions
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    setIsRecording(false);
    setRecordingSeconds(0);

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: true
        });
      } catch (audioErr) {
        // Fallback to video only if microphone access fails
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false
        });
      }

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(err.message || 'Unable to access phone or computer camera. Please check permissions.');
      setIsCameraActive(false);
    }
  };

  const startRecording = async () => {
    if (!mediaStreamRef.current) {
      await startCamera();
      if (!mediaStreamRef.current) return;
    }

    try {
      setIsRecording(true);
      recordedChunksRef.current = [];
      setRecordingSeconds(0);

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          if (reader.result) {
            setVideoUrlInput(reader.result as string);
          }
        };
        stopCamera();
      };

      recorder.start(100);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Recording start error:', err);
      alert('Camera access denied or recording not supported on this device.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const stopCamera = () => {
    if (isRecording) {
      stopRecording();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsCameraActive(false);
    setIsRecording(false);
  };

  const openSubmitModalWithCamera = () => {
    setIsSubmitModalOpen(true);
    setTimeout(() => {
      startCamera();
    }, 150);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setVideoUrlInput(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle || !videoCategory || !videoDescription || !videoAuthor || !videoUrlInput) {
      alert('Please complete all required fields (title, category, description, author name, video source).');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('http://localhost:3001/api/videos/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: videoTitle,
          category: videoCategory,
          description: videoDescription,
          author: videoAuthor,
          videoUrl: videoUrlInput,
          thumbnailUrl: thumbnailUrlInput || undefined
        })
      });

      if (res.ok) {
        const newVid = await res.json();
        setVideos([newVid, ...videos]);
        setSubmitSuccess('Your video has been published to Videos Hub!');
        setTimeout(() => {
          setIsSubmitModalOpen(false);
          setSubmitSuccess('');
          resetSubmitForm();
        }, 1500);
      } else {
        alert('Failed to submit video. Please check input parameters.');
      }
    } catch (err) {
      console.error('Error submitting video:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetSubmitForm = () => {
    setVideoTitle('');
    setVideoDescription('');
    setVideoUrlInput('');
    setThumbnailUrlInput('');
    stopCamera();
  };

  return (
    <Layout>
      <Head>
        <title>Videos Hub & Entertainment | Mawaba</title>
        <meta
          name="description"
          content="Watch, like, share, download, and submit entertaining videos. Explore gaming, music, culture, comedy, and educational video content."
        />
      </Head>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 border border-purple-500/30">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-sm">
            <Video className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Mawaba Entertainment & Video Hub</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Discover, Watch & Share <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">Interactive Videos</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-purple-100/90 max-w-3xl mx-auto font-light leading-relaxed">
            Welcome to the Videos Hub! Explore trending clips, esports highlights, cultural shorts, and educational showcases. Like, share, download, or submit your own videos!
          </p>

          <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={openSubmitModalWithCamera}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white px-7 py-3.5 rounded-2xl font-bold shadow-xl shadow-purple-900/40 hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
            >
              <Camera className="w-5 h-5 text-amber-300 animate-bounce" />
              <span>Record with Camera</span>
            </button>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-7 py-3.5 rounded-2xl font-bold backdrop-blur-md transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Submit Video</span>
            </button>
          </div>

          {/* Highlights Metrics */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-purple-500/20 text-center">
            <div>
              <div className="text-3xl font-extrabold text-purple-400">HD & 4K</div>
              <div className="text-xs text-purple-200/80 uppercase font-semibold mt-1">Video Quality</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-pink-400">1-Click</div>
              <div className="text-xs text-purple-200/80 uppercase font-semibold mt-1">Direct Download</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-purple-400">Instant</div>
              <div className="text-xs text-purple-200/80 uppercase font-semibold mt-1">Social Sharing</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-pink-400">HTML5 WebRTC</div>
              <div className="text-xs text-purple-200/80 uppercase font-semibold mt-1">Live Recorder</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-10 space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search videos by title, description, or creator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all shrink-0"
            >
              <Film className="w-4 h-4" />
              <span>Submit Video</span>
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-purple-600" />
              <span>Filter by Category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Video Items Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading entertainment videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <Video className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No Videos Found</h3>
            <p className="text-gray-500 text-sm mt-2">
              Be the first to submit a video clip in this category!
            </p>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="mt-6 inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit First Video</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                {/* Video HTML5 Player Container */}
                <div className="relative bg-black aspect-video overflow-hidden">
                  <video
                    src={vid.videoUrl}
                    controls
                    preload="metadata"
                    poster={vid.thumbnailUrl}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-purple-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md pointer-events-none">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{vid.category}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-gray-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border border-white/10">
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    <span>{vid.views} views</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-purple-600 transition-colors">
                      {vid.title}
                    </h2>

                    <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {vid.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                        <User className="w-4 h-4 text-purple-600" />
                        <span>{vid.author}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Like, Share, Download, Comment */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-4 gap-1 text-center text-xs font-bold">
                      {/* Like Button */}
                      <button
                        onClick={(e) => handleLike(vid.id, e)}
                        className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Like Video"
                      >
                        <Heart className="w-4 h-4 fill-current text-red-500 mb-1" />
                        <span>{vid.likes}</span>
                      </button>

                      {/* Share Button */}
                      <button
                        onClick={(e) => handleShare(vid, e)}
                        className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        title="Share Video"
                      >
                        <Share2 className="w-4 h-4 text-blue-500 mb-1" />
                        <span>{vid.shares}</span>
                      </button>

                      {/* Download Button */}
                      <button
                        onClick={(e) => handleDownload(vid, e)}
                        className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                        title="Download Video"
                      >
                        <Download className="w-4 h-4 text-green-600 mb-1" />
                        <span>{vid.downloads}</span>
                      </button>

                      {/* Comment Button */}
                      <button
                        onClick={() => setActiveCommentVidId(activeCommentVidId === vid.id ? null : vid.id)}
                        className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        title="View Comments"
                      >
                        <MessageCircle className="w-4 h-4 text-purple-600 mb-1" />
                        <span>{vid.comments.length}</span>
                      </button>
                    </div>

                    {/* Inline Comments Section */}
                    {activeCommentVidId === vid.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in duration-200">
                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                          {vid.comments.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No comments yet. Write the first comment!</p>
                          ) : (
                            vid.comments.map((c) => (
                              <div key={c.id} className="bg-gray-50 p-2.5 rounded-xl text-xs">
                                <div className="font-bold text-gray-800">{c.author}</div>
                                <div className="text-gray-600 mt-0.5">{c.text}</div>
                              </div>
                            ))
                          )}
                        </div>

                        <form onSubmit={(e) => handleAddComment(vid.id, e)} className="mt-3 space-y-2">
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={commentAuthor}
                            onChange={(e) => setCommentAuthor(e.target.value)}
                            className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                            />
                            <button
                              type="submit"
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                            >
                              Post
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Submit Video Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsSubmitModalOpen(false);
                stopCamera();
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Submit Entertainment Video</h2>
                <p className="text-xs text-gray-500">Publish your video clip, WebRTC camera recording, or video URL to the hub.</p>
              </div>
            </div>

            {submitSuccess ? (
              <div className="py-12 text-center bg-green-50 rounded-2xl border border-green-200">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3 animate-bounce" />
                <h3 className="text-lg font-bold text-green-900">{submitSuccess}</h3>
              </div>
            ) : (
              <form onSubmit={handleSubmitVideo} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Video Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Drone Racing Stunts, Nature Exploration"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                    <select
                      value={videoCategory}
                      onChange={(e: any) => setVideoCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Author / Creator Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name or Channel Name"
                    value={videoAuthor}
                    onChange={(e) => setVideoAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Video Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide a brief summary of the video content..."
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium"
                  />
                </div>

                {/* Video Media Source Section */}
                <div className="p-4 bg-purple-50/60 border border-purple-200/70 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-purple-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-purple-600" />
                      Video Source & Camera Access *
                    </span>
                    <span className="text-[10px] text-purple-700 font-semibold">Live Camera, Device File Upload, or URL</span>
                  </div>

                  {cameraError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
                      ⚠️ {cameraError}
                    </div>
                  )}

                  {/* HTML5 WebRTC Video Recorder / Camera Preview */}
                  {isCameraActive && (
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border-2 border-purple-400 shadow-inner">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

                      {/* Video status overlay */}
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white font-bold flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
                        {isRecording ? `Recording: ${recordingSeconds}s` : 'Camera Live Preview'}
                      </div>

                      <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2 px-3">
                        {!isRecording ? (
                          <>
                            <button
                              type="button"
                              onClick={startRecording}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5"
                            >
                              <Video className="w-4 h-4" /> Start Recording
                            </button>
                            <button
                              type="button"
                              onClick={stopCamera}
                              className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded-xl text-xs font-bold"
                            >
                              Turn Off Camera
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="bg-red-600 animate-pulse hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2"
                          >
                            <span className="w-2.5 h-2.5 rounded-sm bg-white" /> Stop & Attach Video ({recordingSeconds}s)
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {!isCameraActive && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition-all"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Enable Camera Access</span>
                      </button>

                      <label className="flex items-center justify-center gap-2 bg-white border border-purple-300 text-purple-800 py-2.5 rounded-xl text-xs font-bold hover:bg-purple-100 transition-all cursor-pointer">
                        <Upload className="w-4 h-4 text-purple-600" />
                        <span>Upload Video File</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* Direct Video URL input */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Video Direct URL or Base64 Data *</label>
                    <input
                      type="text"
                      required
                      placeholder="https://commondatastorage.googleapis.com/.../sample.mp4"
                      value={videoUrlInput}
                      onChange={(e) => setVideoUrlInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Thumbnail Image URL (Optional)</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={thumbnailUrlInput}
                      onChange={(e) => setThumbnailUrlInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium"
                    />
                  </div>

                  {videoUrlInput && (
                    <div className="p-2.5 bg-white rounded-xl border border-purple-200 text-xs flex items-center justify-between">
                      <span className="font-bold text-purple-900 truncate max-w-[400px]">Video Attached: {videoUrlInput.substring(0, 45)}...</span>
                      <button
                        type="button"
                        onClick={() => setVideoUrlInput('')}
                        className="text-red-500 hover:text-red-700 font-bold ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitModalOpen(false);
                      stopCamera();
                    }}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-bold shadow-lg transition-all"
                  >
                    {submitting ? 'Publishing...' : 'Publish Video'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default VideosHubPage;
