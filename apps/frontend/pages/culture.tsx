import { getApiUrl, API_BASE_URL } from '../components/apiConfig';
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import {
  Globe,
  Camera,
  Video,
  Heart,
  MessageCircle,
  PlusCircle,
  Search,
  X,
  Sparkles,
  Filter,
  Play,
  Upload,
  User,
  MapPin,
  Compass,
  CheckCircle2,
  BookOpen,
  Share2,
  Image as ImageIcon
} from 'lucide-react';

interface CultureComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface CultureItem {
  id: string;
  title: string;
  country: string;
  region: 'Africa' | 'Asia-Pacific' | 'Europe' | 'Americas' | 'Middle East' | 'Oceania';
  category: 'Tradition' | 'Festival' | 'Music & Dance' | 'Culinary Heritage' | 'Clothing & Crafts' | 'History & Folklore';
  description: string;
  author: string;
  image?: string;
  video?: string;
  likes: number;
  comments: CultureComment[];
  createdAt: string;
}

const REGIONS = ['All', 'Africa', 'Asia-Pacific', 'Europe', 'Americas', 'Middle East', 'Oceania'];
const CATEGORIES = ['All', 'Tradition', 'Festival', 'Music & Dance', 'Culinary Heritage', 'Clothing & Crafts', 'History & Folklore'];

const GlobalCulturePage = () => {
  const [items, setItems] = useState<CultureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Selected Item for Modal / Video Expansion
  const [selectedMediaItem, setSelectedMediaItem] = useState<CultureItem | null>(null);

  // New Post Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postCountry, setPostCountry] = useState('');
  const [postRegion, setPostRegion] = useState<'Africa' | 'Asia-Pacific' | 'Europe' | 'Americas' | 'Middle East' | 'Oceania'>('Africa');
  const [postCategory, setPostCategory] = useState<'Tradition' | 'Festival' | 'Music & Dance' | 'Culinary Heritage' | 'Clothing & Crafts' | 'History & Folklore'>('Tradition');
  const [postDescription, setPostDescription] = useState('');
  const [postAuthor, setPostAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [postSuccess, setPostSuccess] = useState('');

  // Comment State per item
  const [activeCommentItemId, setActiveCommentItemId] = useState<string | null>(null);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');

  // WebRTC Camera Snapshot State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // HTML5 Video Recording State
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    fetchCultureItems();
    // Pre-fill author if logged in
    const savedUser = localStorage.getItem('mawaba_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.name) setPostAuthor(u.name);
      } catch (e) {}
    }
  }, [selectedRegion, selectedCategory, searchQuery]);

  const fetchCultureItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedRegion !== 'All') params.append('region', selectedRegion);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(getApiUrl(`/api/culture/items?${params.toString()}`));
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch culture items:', err);
    } finally {
      setLoading(false);
    }
  };

  // WebRTC Camera Snapshot Functions
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access error or permission denied.');
      setIsCameraActive(false);
    }
  };

  const captureCameraSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImageUrl(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Video Recording Functions
  const startVideoRecording = async () => {
    try {
      setIsRecordingVideo(true);
      recordedChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          if (reader.result) {
            setVideoUrl(reader.result as string);
          }
        };
        stopCamera();
      };

      recorder.start();
    } catch (err) {
      alert('Camera or Microphone permission denied for video recording.');
      setIsRecordingVideo(false);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecordingVideo) {
      mediaRecorderRef.current.stop();
      setIsRecordingVideo(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, mediaType: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        if (mediaType === 'image') {
          setImageUrl(event.target.result as string);
        } else {
          setVideoUrl(event.target.result as string);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postCountry || !postDescription || !postAuthor) {
      alert('Please fill out all required fields (title, country, story description, author name).');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(getApiUrl('/api/culture/items'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postTitle,
          country: postCountry,
          region: postRegion,
          category: postCategory,
          description: postDescription,
          author: postAuthor,
          image: imageUrl || undefined,
          video: videoUrl || undefined
        })
      });

      if (res.ok) {
        const newItem = await res.json();
        setItems([newItem, ...items]);
        setPostSuccess('Your cultural tradition has been published globally!');
        setTimeout(() => {
          setIsModalOpen(false);
          setPostSuccess('');
          resetForm();
        }, 1500);
      } else {
        alert('Failed to publish culture item. Please check inputs.');
      }
    } catch (err) {
      console.error('Error publishing culture post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setPostTitle('');
    setPostCountry('');
    setPostDescription('');
    setImageUrl('');
    setVideoUrl('');
    stopCamera();
  };

  const handleLike = async (id: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/culture/items/${id}/like`), {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setItems(items.map((item) => (item.id === id ? { ...item, likes: data.likes } : item)));
      }
    } catch (err) {
      console.error('Error liking item:', err);
    }
  };

  const handleAddComment = async (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) return;

    try {
      const res = await fetch(getApiUrl(`/api/culture/items/${id}/comments`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: commentAuthor,
          text: commentText
        })
      });

      if (res.ok) {
        const data = await res.json();
        setItems(items.map((item) => (item.id === id ? { ...item, comments: data.item.comments } : item)));
        setCommentText('');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Global Culture & Traditions Everywhere | Mawaba</title>
        <meta
          name="description"
          content="Promote, share, and discover global culture, ancient traditions, festivals, music, and crafts everywhere. Publish photos and videos of your heritage."
        />
      </Head>

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-orange-950 to-indigo-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-sm">
            <Globe className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Know My Culture & Traditions Everywhere</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Celebrating Earth&apos;s Rich <span className="text-amber-400 bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">Heritage & Traditions</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-amber-100/90 max-w-3xl mx-auto font-light leading-relaxed">
            Every community carries timeless wisdom, vibrant music, ceremonial attire, and ancestral dances. Share photos, videos, and stories of your culture with the global community.
          </p>

          <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-7 py-3.5 rounded-2xl font-bold shadow-xl shadow-amber-900/40 hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Publish My Culture & Traditions</span>
            </button>

            <Link
              href="/culture/traditions"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-2xl font-bold backdrop-blur-md transition-all"
            >
              <BookOpen className="w-5 h-5 text-amber-300" />
              <span>Explore Heritage Archive</span>
            </Link>
          </div>

          {/* Highlights Metrics */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-amber-500/20 text-center">
            <div>
              <div className="text-3xl font-extrabold text-amber-400">190+</div>
              <div className="text-xs text-amber-200/80 uppercase font-semibold mt-1">Countries Represented</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-orange-400">6 Regions</div>
              <div className="text-xs text-amber-200/80 uppercase font-semibold mt-1">Global Continents</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-amber-400">HTML5 Media</div>
              <div className="text-xs text-amber-200/80 uppercase font-semibold mt-1">Photos & WebRTC Videos</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-orange-400">100% Free</div>
              <div className="text-xs text-amber-200/80 uppercase font-semibold mt-1">Cultural Preservation</div>
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
                placeholder="Search traditions, country (e.g. Kenya, Japan, Peru), music, festivals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-sm font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all shrink-0"
            >
              <Camera className="w-4 h-4" />
              <span>Share Culture</span>
            </button>
          </div>

          {/* Region Tabs */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Filter by Region</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedRegion === region
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-orange-600" />
              <span>Filter by Category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Culture Items Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-amber-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading global cultural traditions...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <Globe className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No Culture Publications Found</h3>
            <p className="text-gray-500 text-sm mt-2">
              Be the first to share traditions, photos, or video recordings from this region or category!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish My Culture</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                {/* Media Container (Video / Photo) */}
                <div className="relative bg-gray-950 aspect-video overflow-hidden">
                  {item.video ? (
                    <div className="relative w-full h-full group/video">
                      <video
                        src={item.video}
                        controls
                        preload="metadata"
                        className="w-full h-full object-cover"
                        poster={item.image}
                      />
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md pointer-events-none">
                        <Video className="w-3.5 h-3.5" />
                        <span>VIDEO</span>
                      </div>
                    </div>
                  ) : item.image ? (
                    <div
                      onClick={() => setSelectedMediaItem(item)}
                      className="relative w-full h-full cursor-pointer group/img"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover/img:bg-black/10 transition-colors" />
                      <div className="absolute top-3 left-3 bg-amber-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md">
                        <Camera className="w-3.5 h-3.5" />
                        <span>PHOTO</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-900 to-orange-950 text-amber-200/70 p-6 text-center">
                      <Globe className="w-12 h-12 mb-2 text-amber-400" />
                      <span className="text-xs font-semibold">Global Cultural Heritage</span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
                    {item.region}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
                      <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg font-bold">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.country}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg font-bold">
                        {item.category}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-amber-700 transition-colors">
                      {item.title}
                    </h2>

                    <p className="mt-3 text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
                          {item.author.charAt(0).toUpperCase()}
                        </div>
                        <span>{item.author}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleLike(item.id)}
                          className="flex items-center gap-1 font-bold text-gray-600 hover:text-red-500 transition-colors"
                        >
                          <Heart className="w-4 h-4 fill-current text-red-500" />
                          <span>{item.likes}</span>
                        </button>

                        <button
                          onClick={() => setActiveCommentItemId(activeCommentItemId === item.id ? null : item.id)}
                          className="flex items-center gap-1 font-bold text-gray-600 hover:text-amber-600 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{item.comments.length}</span>
                        </button>
                      </div>
                    </div>

                    {/* Comments Drawer / Section */}
                    {activeCommentItemId === item.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in duration-200">
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                          {item.comments.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No comments yet. Be the first to reply!</p>
                          ) : (
                            item.comments.map((c) => (
                              <div key={c.id} className="bg-gray-50 p-2.5 rounded-xl text-xs">
                                <div className="font-bold text-gray-800">{c.author}</div>
                                <div className="text-gray-600 mt-0.5">{c.text}</div>
                              </div>
                            ))
                          )}
                        </div>

                        <form onSubmit={(e) => handleAddComment(item.id, e)} className="mt-3 space-y-2">
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={commentAuthor}
                            onChange={(e) => setCommentAuthor(e.target.value)}
                            className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                            />
                            <button
                              type="submit"
                              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold"
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

      {/* Modal: Publish My Culture & Traditions */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsModalOpen(false);
                stopCamera();
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Publish My Culture & Traditions</h2>
                <p className="text-xs text-gray-500">Share photos, videos, and stories of your regional heritage with the world.</p>
              </div>
            </div>

            {postSuccess ? (
              <div className="py-12 text-center bg-green-50 rounded-2xl border border-green-200">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3 animate-bounce" />
                <h3 className="text-lg font-bold text-green-900">{postSuccess}</h3>
              </div>
            ) : (
              <form onSubmit={handleCreatePost} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Title of Tradition / Festival *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maasai Adumu Dance, Carnival Crafts"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Country / Community *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kenya, Japan, Peru"
                      value={postCountry}
                      onChange={(e) => setPostCountry(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Region *</label>
                    <select
                      value={postRegion}
                      onChange={(e: any) => setPostRegion(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500"
                    >
                      {REGIONS.filter((r) => r !== 'All').map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                    <select
                      value={postCategory}
                      onChange={(e: any) => setPostCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500"
                    >
                      {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Name / Publisher *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={postAuthor}
                    onChange={(e) => setPostAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Cultural Significance & Story *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the cultural significance, history, songs, attire, or practice..."
                    value={postDescription}
                    onChange={(e) => setPostDescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium"
                  />
                </div>

                {/* HTML5 Media Attachment Tools */}
                <div className="p-4 bg-amber-50/60 border border-amber-200/70 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wide">
                      Attach Media (Photo & Video Publication)
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold">WebRTC Camera & Upload supported</span>
                  </div>

                  {/* WebRTC Camera Live Preview */}
                  {isCameraActive && (
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                        {!isRecordingVideo ? (
                          <>
                            <button
                              type="button"
                              onClick={captureCameraSnapshot}
                              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg"
                            >
                              Take Photo Snapshot
                            </button>
                            <button
                              type="button"
                              onClick={startVideoRecording}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1"
                            >
                              <Video className="w-3.5 h-3.5" /> Record Video Clip
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={stopVideoRecording}
                            className="bg-red-600 animate-pulse text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg"
                          >
                            Stop Video Recording
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="bg-gray-800 text-white px-3 py-2 rounded-xl text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {!isCameraActive && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="flex items-center justify-center gap-2 bg-white border border-amber-300 text-amber-800 py-2.5 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all"
                      >
                        <Camera className="w-4 h-4 text-amber-600" />
                        <span>Use HTML5 Camera</span>
                      </button>

                      <label className="flex items-center justify-center gap-2 bg-white border border-amber-300 text-amber-800 py-2.5 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all cursor-pointer">
                        <Upload className="w-4 h-4 text-amber-600" />
                        <span>Upload Local Media</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.type.startsWith('video')) {
                                handleFileUpload(e, 'video');
                              } else {
                                handleFileUpload(e, 'image');
                              }
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* Manual URLs input */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Photo URL / Data</label>
                      <input
                        type="text"
                        placeholder="https://... or snapshot"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Video URL / Data</label>
                      <input
                        type="text"
                        placeholder="https://... or recording"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Previews */}
                  {(imageUrl || videoUrl) && (
                    <div className="p-2 bg-white rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-700">Media Attached: {imageUrl ? 'Photo' : ''} {videoUrl ? 'Video' : ''}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl('');
                          setVideoUrl('');
                        }}
                        className="text-red-500 hover:text-red-700 font-bold"
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
                      setIsModalOpen(false);
                      stopCamera();
                    }}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold shadow-lg transition-all"
                  >
                    {submitting ? 'Publishing...' : 'Publish Culture Post'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Photo / Media Modal */}
      {selectedMediaItem && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedMediaItem(null)}
              className="absolute top-4 right-4 z-10 text-white bg-black/60 p-2 rounded-full hover:bg-black/80"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video bg-black flex items-center justify-center">
              {selectedMediaItem.video ? (
                <video src={selectedMediaItem.video} controls autoPlay className="max-h-[70vh] w-full" />
              ) : selectedMediaItem.image ? (
                <img src={selectedMediaItem.image} alt={selectedMediaItem.title} className="max-h-[70vh] object-contain" />
              ) : null}
            </div>
            <div className="p-6 text-white">
              <span className="text-xs font-bold text-amber-400 uppercase">{selectedMediaItem.country} • {selectedMediaItem.category}</span>
              <h2 className="text-2xl font-bold mt-1">{selectedMediaItem.title}</h2>
              <p className="text-gray-300 text-sm mt-2">{selectedMediaItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default GlobalCulturePage;
