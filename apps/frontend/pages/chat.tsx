import React, { useState, useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  MessageSquare,
  Camera,
  Video,
  VideoOff,
  Image as ImageIcon,
  Send,
  ThumbsUp,
  Plus,
  Search,
  Sparkles,
  Globe,
  X,
  RefreshCw,
  User,
  Layers,
  CheckCircle,
  MessageCircle,
  Share2,
  Upload,
  Play,
  Square
} from 'lucide-react';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  room: string;
  image?: string;
  video?: string;
  timestamp: string;
}

interface ForumReply {
  id: string;
  author: string;
  text: string;
  image?: string;
  video?: string;
  createdAt: string;
}

interface ForumTopic {
  id: string;
  title: string;
  category: 'General' | 'STEM & AI' | 'Climate & Earth' | 'Business & Trade' | 'Literature & Culture';
  content: string;
  author: string;
  image?: string;
  video?: string;
  likes: number;
  replies: ForumReply[];
  createdAt: string;
}

const GlobalChatPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'forum'>('chat');

  // User state
  const [currentUsername, setCurrentUsername] = useState<string>('GuestUser');

  // Global Chat state
  const [selectedRoom, setSelectedRoom] = useState<string>('All');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatMessageText, setChatMessageText] = useState<string>('');
  const [chatRoom, setChatRoom] = useState<string>('STEM & AI');
  const [isPostingChat, setIsPostingChat] = useState<boolean>(false);

  // Forum state
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showNewTopicModal, setShowNewTopicModal] = useState<boolean>(false);

  // New topic state
  const [topicTitle, setTopicTitle] = useState<string>('');
  const [topicCategory, setTopicCategory] = useState<'General' | 'STEM & AI' | 'Climate & Earth' | 'Business & Trade' | 'Literature & Culture'>('STEM & AI');
  const [topicContent, setTopicContent] = useState<string>('');
  const [isPostingTopic, setIsPostingTopic] = useState<boolean>(false);

  // Forum Reply state
  const [activeReplyTopicId, setActiveReplyTopicId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [isPostingReply, setIsPostingReply] = useState<boolean>(false);

  // Camera state & WebRTC Video/Photo Recording
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');
  const [isRecordingVideo, setIsRecordingVideo] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [capturedVideo, setCapturedVideo] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraTarget, setCameraTarget] = useState<'chat' | 'topic' | 'reply' | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // File input refs for uploading from device (Phone or PC)
  const chatFileInputRef = useRef<HTMLInputElement | null>(null);
  const topicFileInputRef = useRef<HTMLInputElement | null>(null);
  const replyFileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize logged in user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('mawaba_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.name) setCurrentUsername(u.name);
      } catch (e) {
        console.error('Failed to parse user from localStorage');
      }
    }
  }, []);

  // Fetch Chat Messages
  const fetchChatMessages = async () => {
    try {
      const url = selectedRoom === 'All'
        ? 'http://localhost:3001/api/chat/messages'
        : `http://localhost:3001/api/chat/messages?room=${encodeURIComponent(selectedRoom)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data);
      }
    } catch (err) {
      console.warn("Using offline simulated chat messages fallback.");
    }
  };

  // Fetch Forum Topics
  const fetchForumTopics = async () => {
    try {
      let url = 'http://localhost:3001/api/forum/topics';
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery.trim()) params.append('search', searchQuery);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setForumTopics(data);
      }
    } catch (err) {
      console.warn("Using offline simulated forum topics fallback.");
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, [selectedRoom]);

  useEffect(() => {
    fetchForumTopics();
  }, [selectedCategory, searchQuery]);

  // Handle HTML5 Camera access
  const startCamera = async (target: 'chat' | 'topic' | 'reply') => {
    setCameraTarget(target);
    setCameraError(null);
    setIsCameraActive(true);
    setIsRecordingVideo(false);
    setRecordingSeconds(0);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
            audio: true
          });
        } catch (audioErr) {
          // Fallback to video only if microphone access fails/denied
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
            audio: false
          });
        }

        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError('Camera access is not supported on this browser.');
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(err.message || 'Unable to access device camera. Please check camera permissions.');
    }
  };

  const stopCamera = () => {
    if (isRecordingVideo) {
      stopRecordingVideo();
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
    setIsRecordingVideo(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedSnapshot(dataUrl);
        setCapturedVideo(null); // Clear video if photo taken
        stopCamera();
      }
    }
  };

  const startRecordingVideo = () => {
    if (!mediaStreamRef.current) return;
    recordedChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType });
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.onloadend = () => {
          const videoDataUrl = reader.result as string;
          setCapturedVideo(videoDataUrl);
          setCapturedSnapshot(null); // Clear snapshot if video recorded
          stopCamera();
        };
        reader.readAsDataURL(blob);
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setIsRecordingVideo(true);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Failed to record video:', err);
      setCameraError('Failed to record video using this device camera.');
    }
  };

  const stopRecordingVideo = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsRecordingVideo(false);
  };

  // Handle uploading photos and videos from Phone or Computer
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'chat' | 'topic' | 'reply') => {
    setCameraTarget(target);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (file.type.startsWith('image/')) {
        setCapturedSnapshot(result);
        setCapturedVideo(null);
      } else if (file.type.startsWith('video/')) {
        setCapturedVideo(result);
        setCapturedSnapshot(null);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value so re-selecting same file triggers event
    e.target.value = '';
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Post Chat Message
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim() && !capturedSnapshot && !capturedVideo) return;

    setIsPostingChat(true);
    const payload = {
      username: currentUsername,
      message: chatMessageText.trim() || (capturedVideo ? '🎥 Attached video clip' : '📸 Attached photo snapshot'),
      room: chatRoom,
      image: capturedSnapshot || undefined,
      video: capturedVideo || undefined
    };

    try {
      const res = await fetch('http://localhost:3001/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newMsg = await res.json();
        setChatMessages(prev => [...prev, newMsg]);
        setChatMessageText('');
        setCapturedSnapshot(null);
        setCapturedVideo(null);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      // Offline fallback
      const fallbackMsg: ChatMessage = {
        id: 'c-' + Math.random().toString(36).substr(2, 9),
        username: currentUsername,
        message: payload.message,
        room: payload.room,
        image: payload.image,
        video: payload.video,
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
      setChatMessageText('');
      setCapturedSnapshot(null);
      setCapturedVideo(null);
    } finally {
      setIsPostingChat(false);
    }
  };

  // Post Forum Topic
  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim() || !topicContent.trim()) return;

    setIsPostingTopic(true);
    const payload = {
      title: topicTitle.trim(),
      category: topicCategory,
      content: topicContent.trim(),
      author: currentUsername,
      image: capturedSnapshot || undefined,
      video: capturedVideo || undefined
    };

    try {
      const res = await fetch('http://localhost:3001/api/forum/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newTopic = await res.json();
        setForumTopics(prev => [newTopic, ...prev]);
        setTopicTitle('');
        setTopicContent('');
        setCapturedSnapshot(null);
        setCapturedVideo(null);
        setShowNewTopicModal(false);
      } else {
        throw new Error('Failed to create topic');
      }
    } catch (err) {
      const fallbackTopic: ForumTopic = {
        id: 'ft-' + Math.random().toString(36).substr(2, 9),
        title: payload.title,
        category: payload.category,
        content: payload.content,
        author: payload.author,
        image: payload.image,
        video: payload.video,
        likes: 0,
        replies: [],
        createdAt: new Date().toISOString()
      };
      setForumTopics(prev => [fallbackTopic, ...prev]);
      setTopicTitle('');
      setTopicContent('');
      setCapturedSnapshot(null);
      setCapturedVideo(null);
      setShowNewTopicModal(false);
    } finally {
      setIsPostingTopic(false);
    }
  };

  // Like Forum Topic
  const handleLikeTopic = async (topicId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/forum/topics/${topicId}/like`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setForumTopics(prev =>
          prev.map(t => (t.id === topicId ? { ...t, likes: data.likes } : t))
        );
      }
    } catch (err) {
      setForumTopics(prev =>
        prev.map(t => (t.id === topicId ? { ...t, likes: t.likes + 1 } : t))
      );
    }
  };

  // Post Reply to Forum Topic
  const handlePostReply = async (topicId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && !capturedSnapshot && !capturedVideo) return;

    setIsPostingReply(true);
    const payload = {
      author: currentUsername,
      text: replyText.trim() || (capturedVideo ? '🎥 Attached video clip' : '📸 Attached photo snapshot'),
      image: capturedSnapshot || undefined,
      video: capturedVideo || undefined
    };

    try {
      const res = await fetch(`http://localhost:3001/api/forum/topics/${topicId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setForumTopics(prev =>
          prev.map(t => (t.id === topicId ? { ...t, replies: [...t.replies, data.reply] } : t))
        );
        setReplyText('');
        setCapturedSnapshot(null);
        setCapturedVideo(null);
        setActiveReplyTopicId(null);
      }
    } catch (err) {
      const fallbackReply: ForumReply = {
        id: 'fr-' + Math.random().toString(36).substr(2, 9),
        author: payload.author,
        text: payload.text,
        image: payload.image,
        video: payload.video,
        createdAt: new Date().toISOString()
      };
      setForumTopics(prev =>
        prev.map(t => (t.id === topicId ? { ...t, replies: [...t.replies, fallbackReply] } : t))
      );
      setReplyText('');
      setCapturedSnapshot(null);
      setCapturedVideo(null);
      setActiveReplyTopicId(null);
    } finally {
      setIsPostingReply(false);
    }
  };

  const rooms = ['All', 'General', 'STEM & AI', 'Climate & Earth', 'Global Trade'];
  const categories = ['All', 'General', 'STEM & AI', 'Climate & Earth', 'Business & Trade', 'Literature & Culture'];

  return (
    <>
      <Head>
        <title>Global Chat & Forum | Mawaba</title>
        <meta name="description" content="Mawaba Global Chat & Community Forum featuring live camera photo & video capture, file uploads from phone or computer, topic discussions, and interactive community channels." />
      </Head>

      <div className="bg-gradient-to-b from-blue-50/50 via-white to-gray-50 min-h-screen py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 lg:p-12 text-white shadow-xl relative overflow-hidden mb-10">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-md">
                <Globe className="h-4 w-4 text-blue-300" /> Live Mawaba Community Network
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Global Chat & Community Forum
              </h1>
              <p className="text-blue-100 text-base sm:text-lg leading-relaxed">
                Connect in real-time across international channels, discuss research ideas, and use live camera or local file uploads to publish photos and videos directly from your phone or computer.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-xs font-bold text-white">
                  <User className="h-4 w-4 text-emerald-400" />
                  <span>Posting as: <span className="text-emerald-300">{currentUsername}</span></span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-xs font-bold text-white">
                  <Camera className="h-4 w-4 text-amber-400" />
                  <span>Camera & Media Access: <span className="text-amber-300">Enabled</span></span>
                </div>
              </div>
            </div>

            {/* Background elements */}
            <div className="absolute right-[-10%] top-[-20%] w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
            <div className="absolute left-[40%] bottom-[-30%] w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
          </div>

          {/* Hidden File Inputs for Device Media Upload (Phone / Computer) */}
          <input
            ref={chatFileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'chat')}
          />
          <input
            ref={topicFileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'topic')}
          />
          <input
            ref={replyFileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'reply')}
          />

          {/* Navigation Tabs */}
          <div className="flex justify-between items-center border-b border-gray-200 mb-8 pb-4 flex-wrap gap-4">
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2.5 transition-all duration-200 ${
                  activeTab === 'chat'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <MessageSquare className="h-4 w-4" /> Global Live Chat
              </button>
              <button
                onClick={() => setActiveTab('forum')}
                className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2.5 transition-all duration-200 ${
                  activeTab === 'forum'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Layers className="h-4 w-4" /> Community Forum
              </button>
            </div>

            {/* Camera & Media Floating Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => startCamera('chat')}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <Camera className="h-4 w-4" /> Open Camera (Photo/Video)
              </button>
              <button
                onClick={() => chatFileInputRef.current?.click()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <Upload className="h-4 w-4" /> Upload File (Phone/PC)
              </button>
            </div>
          </div>

          {/* --- HTML5 Live Camera Snapshot & Video Recording Modal --- */}
          {isCameraActive && (
            <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Camera className="h-5 w-5 text-amber-500" /> Device Camera Access
                  </h3>
                  <button
                    onClick={stopCamera}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mode Selector Tabs inside Modal */}
                <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => { setCameraMode('photo'); if (isRecordingVideo) stopRecordingVideo(); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      cameraMode === 'photo' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    <Camera className="h-3.5 w-3.5" /> Take Photo Snapshot
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraMode('video')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      cameraMode === 'video' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    <Video className="h-3.5 w-3.5" /> Record Video Clip
                  </button>
                </div>

                {cameraError ? (
                  <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-xs font-semibold mb-4 border border-red-100">
                    ⚠️ {cameraError}
                  </div>
                ) : (
                  <div className="relative bg-slate-900 rounded-2xl overflow-hidden aspect-video mb-4 flex items-center justify-center border border-slate-700">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Live indicator / Video recording timer banner */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-bold flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isRecordingVideo ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`}></span>
                      {isRecordingVideo ? `Recording: ${recordingSeconds}s` : 'Live Camera Feed'}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 justify-end items-center">
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>

                  {cameraMode === 'photo' ? (
                    <button
                      type="button"
                      onClick={capturePhoto}
                      disabled={!!cameraError}
                      className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                    >
                      <Camera className="h-4 w-4" /> Capture Photo
                    </button>
                  ) : (
                    isRecordingVideo ? (
                      <button
                        type="button"
                        onClick={stopRecordingVideo}
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all animate-pulse"
                      >
                        <Square className="h-4 w-4" /> Stop & Finish ({recordingSeconds}s)
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startRecordingVideo}
                        disabled={!!cameraError}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                      >
                        <Video className="h-4 w-4" /> Start Video Recording
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Active Attached Media Previews */}
          {capturedSnapshot && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <img
                  src={capturedSnapshot}
                  alt="Captured photo preview"
                  className="w-16 h-16 object-cover rounded-xl border-2 border-amber-400 shadow-sm"
                />
                <div>
                  <span className="text-xs font-bold text-amber-900 block">Photo Attached</span>
                  <span className="text-[11px] text-amber-700">Ready to publish to your {cameraTarget || 'post'}</span>
                </div>
              </div>
              <button
                onClick={() => setCapturedSnapshot(null)}
                className="text-xs font-bold text-red-600 hover:text-red-700 bg-white border border-red-200 px-3 py-1.5 rounded-xl shadow-xs"
              >
                Remove Photo
              </button>
            </div>
          )}

          {capturedVideo && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <video
                  src={capturedVideo}
                  controls
                  className="w-24 h-16 object-cover rounded-xl border-2 border-indigo-400 shadow-sm bg-black"
                />
                <div>
                  <span className="text-xs font-bold text-indigo-900 block">Video Clip Attached</span>
                  <span className="text-[11px] text-indigo-700">Ready to publish to your {cameraTarget || 'post'}</span>
                </div>
              </div>
              <button
                onClick={() => setCapturedVideo(null)}
                className="text-xs font-bold text-red-600 hover:text-red-700 bg-white border border-red-200 px-3 py-1.5 rounded-xl shadow-xs"
              >
                Remove Video
              </button>
            </div>
          )}

          {/* TAB 1: GLOBAL LIVE CHAT */}
          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

              {/* Left Column: Channels / Rooms */}
              <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-fit">
                <h3 className="font-extrabold text-gray-900 text-base mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" /> Chat Channels
                </h3>
                <div className="space-y-1.5">
                  {rooms.map((rm) => (
                    <button
                      key={rm}
                      onClick={() => setSelectedRoom(rm)}
                      className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-between transition-all ${
                        selectedRoom === rm
                          ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-xs'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span># {rm}</span>
                      {selectedRoom === rm && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block mb-2">
                    Room Guidelines
                  </span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Be respectful and constructive across all channels. Live photo and video publications must adhere to community standards.
                  </p>
                </div>
              </div>

              {/* Right Column: Live Chat Workspace */}
              <div className="lg:col-span-3 bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm flex flex-col justify-between min-h-[580px]">

                {/* Chat Top Header */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                      #{selectedRoom} Channel
                    </h3>
                    <span className="text-xs text-gray-400 font-medium">Real-time discussion & media photo/video sharing</span>
                  </div>
                  <button
                    onClick={fetchChatMessages}
                    className="text-gray-400 hover:text-blue-600 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                    title="Refresh Feed"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>

                {/* Message Scroll Area */}
                <div className="space-y-4 overflow-y-auto max-h-[420px] pr-2 mb-6 scrollbar-thin">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 text-xs">
                      No messages in this channel yet. Be the first to start the conversation!
                    </div>
                  ) : (
                    chatMessages.map((msg) => (
                      <div key={msg.id} className="flex items-start gap-3.5 bg-gray-50/70 p-4 rounded-2xl border border-gray-100 shadow-xs">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shrink-0 flex items-center justify-center font-extrabold text-xs shadow-sm">
                          {msg.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-gray-900">@{msg.username}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                #{msg.room}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                          {msg.message && <p className="text-xs text-gray-700 leading-relaxed font-medium">{msg.message}</p>}

                          {/* Attached Photo Image */}
                          {msg.image && (
                            <div className="pt-2">
                              <img
                                src={msg.image}
                                alt="Chat attachment"
                                className="max-w-xs max-h-56 rounded-xl border border-gray-200 shadow-sm object-cover"
                              />
                            </div>
                          )}

                          {/* Attached Video Clip */}
                          {msg.video && (
                            <div className="pt-2">
                              <video
                                src={msg.video}
                                controls
                                className="max-w-xs max-h-56 rounded-xl border border-gray-200 shadow-sm bg-black"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Chat Input Form */}
                <form onSubmit={handleSendChatMessage} className="space-y-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <select
                      value={chatRoom}
                      onChange={(e) => setChatRoom(e.target.value)}
                      className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="General"># General</option>
                      <option value="STEM & AI"># STEM & AI</option>
                      <option value="Climate & Earth"># Climate & Earth</option>
                      <option value="Global Trade"># Global Trade</option>
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startCamera('chat')}
                        className={`p-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all ${
                          capturedSnapshot || capturedVideo
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-gray-50 hover:bg-amber-50 text-gray-700 border-gray-200 hover:text-amber-700'
                        }`}
                        title="Camera Access (Photo & Video)"
                      >
                        <Camera className="h-4 w-4 text-amber-600" />
                        <span className="hidden sm:inline">Camera</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => chatFileInputRef.current?.click()}
                        className="p-2.5 rounded-xl border font-bold text-xs bg-gray-50 hover:bg-indigo-50 text-gray-700 border-gray-200 hover:text-indigo-700 flex items-center gap-1.5 transition-all"
                        title="Upload Photo/Video from Phone or PC"
                      >
                        <Upload className="h-4 w-4 text-indigo-600" />
                        <span className="hidden sm:inline">Upload</span>
                      </button>
                    </div>

                    <div className="relative flex-1 w-full sm:w-auto">
                      <input
                        type="text"
                        placeholder="Type a message or attach photo/video..."
                        value={chatMessageText}
                        onChange={(e) => setChatMessageText(e.target.value)}
                        className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                      />
                      <button
                        type="submit"
                        disabled={isPostingChat || (!chatMessageText.trim() && !capturedSnapshot && !capturedVideo)}
                        className="absolute right-1.5 top-1.5 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg disabled:bg-blue-300 transition-colors"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </form>

              </div>
            </div>
          )}

          {/* TAB 2: COMMUNITY FORUM */}
          {activeTab === 'forum' && (
            <div className="space-y-6">

              {/* Forum Controls Bar */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search topics, author, keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 overflow-x-auto w-full md:w-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Create Topic Button */}
                <button
                  onClick={() => setShowNewTopicModal(true)}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
                >
                  <Plus className="h-4 w-4" /> Start Discussion
                </button>
              </div>

              {/* Forum Topic List */}
              <div className="space-y-6">
                {forumTopics.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-100 text-xs">
                    No forum discussions match your criteria. Start a new topic!
                  </div>
                ) : (
                  forumTopics.map((topic) => (
                    <div key={topic.id} className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm space-y-4 transition-all hover:shadow-md">

                      {/* Topic Header */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                            {topic.category}
                          </span>
                          <h3 className="text-xl font-extrabold text-gray-900 pt-1">
                            {topic.title}
                          </h3>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium shrink-0">
                          {new Date(topic.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Topic Author & Body */}
                      <div className="text-xs text-gray-500 font-semibold flex items-center gap-2">
                        <span>Posted by <strong className="text-gray-800">@{topic.author}</strong></span>
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line font-medium">
                        {topic.content}
                      </p>

                      {/* Attached Snapshot Image */}
                      {topic.image && (
                        <div className="pt-2">
                          <img
                            src={topic.image}
                            alt="Topic photo attachment"
                            className="max-w-md max-h-72 rounded-2xl border border-gray-200 shadow-sm object-cover"
                          />
                        </div>
                      )}

                      {/* Attached Video Clip */}
                      {topic.video && (
                        <div className="pt-2">
                          <video
                            src={topic.video}
                            controls
                            className="max-w-md max-h-72 rounded-2xl border border-gray-200 shadow-sm bg-black"
                          />
                        </div>
                      )}

                      {/* Topic Action Footer */}
                      <div className="flex items-center gap-6 pt-4 border-t border-gray-100 text-xs">
                        <button
                          onClick={() => handleLikeTopic(topic.id)}
                          className="flex items-center gap-1.5 font-bold text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <ThumbsUp className="h-4 w-4 text-blue-500" />
                          <span>{topic.likes} Likes</span>
                        </button>

                        <button
                          onClick={() => setActiveReplyTopicId(activeReplyTopicId === topic.id ? null : topic.id)}
                          className="flex items-center gap-1.5 font-bold text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4 text-purple-500" />
                          <span>{topic.replies ? topic.replies.length : 0} Replies</span>
                        </button>
                      </div>

                      {/* Replies List */}
                      {topic.replies && topic.replies.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-50 space-y-3 bg-gray-50/60 p-4 rounded-2xl">
                          <span className="text-[10px] font-extrabold uppercase text-gray-400 block mb-2">
                            Community Replies
                          </span>
                          {topic.replies.map((reply) => (
                            <div key={reply.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs space-y-1">
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="font-bold text-gray-800">@{reply.author}</span>
                                <span className="text-[9px] text-gray-400">
                                  {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              {reply.text && <p className="text-xs text-gray-600 leading-relaxed font-medium">{reply.text}</p>}
                              {reply.image && (
                                <img
                                  src={reply.image}
                                  alt="Reply photo attachment"
                                  className="max-w-xs max-h-40 rounded-lg border border-gray-200 mt-2 object-cover"
                                />
                              )}
                              {reply.video && (
                                <video
                                  src={reply.video}
                                  controls
                                  className="max-w-xs max-h-40 rounded-lg border border-gray-200 mt-2 bg-black"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Form */}
                      {activeReplyTopicId === topic.id && (
                        <form onSubmit={(e) => handlePostReply(topic.id, e)} className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                          <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
                            <button
                              type="button"
                              onClick={() => startCamera('reply')}
                              className="p-2 bg-gray-100 hover:bg-amber-50 text-gray-700 rounded-xl font-bold text-xs flex items-center gap-1 border border-gray-200"
                              title="Camera (Photo/Video)"
                            >
                              <Camera className="h-4 w-4 text-amber-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => replyFileInputRef.current?.click()}
                              className="p-2 bg-gray-100 hover:bg-indigo-50 text-gray-700 rounded-xl font-bold text-xs flex items-center gap-1 border border-gray-200"
                              title="Upload Photo/Video from Phone or PC"
                            >
                              <Upload className="h-4 w-4 text-indigo-600" />
                            </button>
                            <input
                              type="text"
                              placeholder="Write a reply or attach photo/video..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="flex-1 p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                            />
                            <button
                              type="submit"
                              disabled={isPostingReply || (!replyText.trim() && !capturedSnapshot && !capturedVideo)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs disabled:bg-blue-300 transition-colors shrink-0"
                            >
                              Reply
                            </button>
                          </div>
                        </form>
                      )}

                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* New Forum Topic Modal */}
          {showNewTopicModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-xl w-full shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Plus className="h-5 w-5 text-blue-600" /> Start New Discussion
                  </h3>
                  <button
                    onClick={() => setShowNewTopicModal(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateTopic} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Topic Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AI-assisted soil quality sensing..."
                      value={topicTitle}
                      onChange={(e) => setTopicTitle(e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Category
                    </label>
                    <select
                      value={topicCategory}
                      onChange={(e) => setTopicCategory(e.target.value as any)}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium bg-white"
                    >
                      <option value="General">General</option>
                      <option value="STEM & AI">STEM & AI</option>
                      <option value="Climate & Earth">Climate & Earth</option>
                      <option value="Business & Trade">Business & Trade</option>
                      <option value="Literature & Culture">Literature & Culture</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Discussion Content
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Elaborate on your idea, questions, or project..."
                      value={topicContent}
                      onChange={(e) => setTopicContent(e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                    />
                  </div>

                  {/* Camera & Local File Upload Options */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                    <span className="text-xs font-bold text-gray-700 block">Attach Media (Photo or Video):</span>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => startCamera('topic')}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Camera className="h-4 w-4" /> Open Camera
                      </button>
                      <button
                        type="button"
                        onClick={() => topicFileInputRef.current?.click()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Upload className="h-4 w-4" /> Choose from Phone / Computer
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowNewTopicModal(false)}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isPostingTopic}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all disabled:bg-blue-300"
                    >
                      Publish Topic
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default GlobalChatPage;
