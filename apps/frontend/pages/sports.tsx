import { getApiUrl } from '../components/apiConfig';
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import {
  Trophy,
  Activity,
  Flame,
  Search,
  PlusCircle,
  Play,
  RotateCcw,
  Users,
  CheckCircle2,
  Dumbbell,
  Calculator,
  Globe,
  Sparkles,
  ArrowRight,
  Info,
  Medal,
  Award
} from 'lucide-react';

interface SportsActivity {
  id: string;
  title: string;
  category: 'Football & Soccer' | 'Basketball & Athletics' | 'Fitness & Aerobics' | 'Cycling & Endurance' | 'Water Sports & Swimming' | 'Yoga & Mindfulness';
  description: string;
  location: string;
  organizer: string;
  participantsCount: number;
  caloriesBurnEst: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  createdAt: string;
}

interface CalculatorResult {
  caloriesBurned: number;
  fatGramsBurned: number;
  metValue: number;
  intensityLevel: string;
  healthBenefit: string;
}

export default function SportsAndFitnessPage() {
  const [activeTab, setActiveTab] = useState<'simulation' | 'activities' | 'calculator'>('simulation');

  // Activities State
  const [activities, setActivities] = useState<SportsActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  // New Activity Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<SportsActivity['category']>('Football & Soccer');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newOrganizer, setNewOrganizer] = useState('');
  const [newCalories, setNewCalories] = useState<number>(350);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');

  // Workout Calorie Calculator State
  const [calcActivity, setCalcActivity] = useState('football');
  const [calcMinutes, setCalcMinutes] = useState<number>(45);
  const [calcWeight, setCalcWeight] = useState<number>(70);
  const [calcResult, setCalcResult] = useState<CalculatorResult | null>(null);
  const [calculating, setCalculating] = useState(false);

  // Interactive Canvas Game / Simulation State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameEnergy, setGameEnergy] = useState(100);
  const [comboMultiplier, setComboMultiplier] = useState(1);

  // Fetch Activities
  const fetchActivities = async () => {
    setLoadingActivities(true);
    try {
      const res = await fetch(getApiUrl('/api/sports/activities'));
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (err) {
      console.error('Failed to fetch sports activities:', err);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Handle Activity Join
  const handleJoinActivity = async (id: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/sports/activities/${id}/join`), { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setActivities(prev =>
          prev.map(a => (a.id === id ? { ...a, participantsCount: data.participantsCount } : a))
        );
      }
    } catch (err) {
      setActivities(prev =>
        prev.map(a => (a.id === id ? { ...a, participantsCount: a.participantsCount + 1 } : a))
      );
    }
  };

  // Handle Create Activity
  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newLocation || !newOrganizer) return;

    setSubmitting(true);
    try {
      const res = await fetch(getApiUrl('/api/sports/activities'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          description: newDescription,
          location: newLocation,
          organizer: newOrganizer,
          caloriesBurnEst: newCalories
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActivities(prev => [data.activity, ...prev]);
        setSubmitMsg('Event successfully registered!');
        setTimeout(() => {
          setSubmitMsg('');
          setShowModal(false);
          setNewTitle('');
          setNewDescription('');
          setNewLocation('');
          setNewOrganizer('');
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to submit activity:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Calculator
  const handleCalculateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    try {
      const res = await fetch(getApiUrl('/api/sports/calculator'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityType: calcActivity,
          durationMinutes: calcMinutes,
          weightKg: calcWeight
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCalcResult(data.results);
      }
    } catch (err) {
      console.error('Failed to calculate workout:', err);
    } finally {
      setCalculating(false);
    }
  };

  // Interactive HTML5 Game Loop Simulation
  useEffect(() => {
    if (!gameActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let ballX = canvas.width / 2;
    let ballY = canvas.height - 30;
    let ballSpeedX = (Math.random() - 0.5) * 8;
    let ballSpeedY = -6;
    let paddleX = (canvas.width - 80) / 2;
    const paddleWidth = 80;
    const paddleHeight = 12;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Pitch Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Field Lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Paddle
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight, 6);
      ctx.fill();

      // Draw Ball (Football / Energy Sphere)
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
      ctx.fill();

      // Ball Movement
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Bounce Walls
      if (ballX + ballSpeedX > canvas.width - 10 || ballX + ballSpeedX < 10) {
        ballSpeedX = -ballSpeedX;
      }
      if (ballY + ballSpeedY < 10) {
        ballSpeedY = -ballSpeedY;
      } else if (ballY + ballSpeedY > canvas.height - 20) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
          ballSpeedY = -ballSpeedY * 1.05; // accelerate
          setGameScore(s => s + 10 * comboMultiplier);
          setComboMultiplier(m => Math.min(m + 1, 5));
        } else {
          // Missed
          setGameEnergy(e => {
            const newE = e - 25;
            if (newE <= 0) {
              setGameActive(false);
            }
            return Math.max(0, newE);
          });
          ballX = canvas.width / 2;
          ballY = canvas.height - 30;
          ballSpeedY = -6;
          setComboMultiplier(1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameActive, comboMultiplier]);

  const startGame = () => {
    setGameScore(0);
    setGameEnergy(100);
    setComboMultiplier(1);
    setGameActive(true);
  };

  const filteredActivities = activities.filter(a => {
    const matchesCat = categoryFilter === 'All' || a.category === categoryFilter;
    const matchesQuery =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <>
      <Head>
        <title>Sports & Fitness Promotion | Mawaba</title>
        <meta
          name="description"
          content="Promoting global athletic development, community fitness drives, interactive HTML5 sports simulations, and workout health tracking."
        />
      </Head>

      <main className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Hero Header */}
          <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 rounded-3xl p-8 sm:p-12 border border-blue-800/40 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-10 -mr-10 opacity-10 pointer-events-none">
              <Trophy className="w-96 h-96 text-blue-400" />
            </div>

            <div className="relative z-10 max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-blue-300 text-xs font-bold tracking-wide uppercase">
                <Activity className="w-4 h-4 text-blue-400" /> Active Living & Athletic Community
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                Global Sports, Fitness & Athletic Excellence
              </h1>
              <p className="text-blue-100 text-base sm:text-lg leading-relaxed font-normal">
                Connecting sports enthusiasts, organizing grassroots community tournaments, testing reflex stamina with HTML5 interactive simulations, and optimizing workout calorie burn.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => setActiveTab('simulation')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-6 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 text-sm"
                >
                  <Play className="w-4 h-4 fill-current" /> Play HTML5 Sports Simulator
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-6 py-3 rounded-2xl transition-all flex items-center gap-2 text-sm"
                >
                  <PlusCircle className="w-4 h-4 text-blue-300" /> Organize Sports Tournament
                </button>
              </div>
            </div>
          </header>

          {/* Stats Metrics */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <article className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-blue-400">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Community Drives</span>
                <Trophy className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">{activities.length}</p>
              <p className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Worldwide events
              </p>
            </article>

            <article className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Active Athletes</span>
                <Users className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">
                {activities.reduce((acc, a) => acc + a.participantsCount, 0).toLocaleString()}
              </p>
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Joined participants
              </p>
            </article>

            <article className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-rose-400">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Avg Calorie Burn</span>
                <Flame className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">420 kcal</p>
              <p className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5" /> Per active workout
              </p>
            </article>

            <article className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-amber-400">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Simulation Highscore</span>
                <Medal className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">{gameScore} PTS</p>
              <p className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> HTML5 Arcade record
              </p>
            </article>
          </section>

          {/* Navigation Tabs */}
          <nav className="flex flex-wrap gap-3 border-b border-slate-800 pb-4">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'simulation'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Play className="w-4 h-4 fill-current" /> Interactive HTML5 Sports Game
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'activities'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Trophy className="w-4 h-4" /> Tournaments & Community Sports
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'calculator'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Calculator className="w-4 h-4" /> Workout Calorie & MET Calculator
            </button>
          </nav>

          {/* TAB 1: HTML5 INTERACTIVE GAME SIMULATOR */}
          {activeTab === 'simulation' && (
            <section className="bg-slate-800/90 rounded-3xl border border-slate-700 p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full mb-1">
                    <Activity className="w-3.5 h-3.5" /> Reflex & Precision Challenge
                  </div>
                  <h2 className="text-2xl font-black text-white">Reflex Field Challenge Simulator</h2>
                  <p className="text-xs text-slate-400">Move your mouse to control the paddle and volley the sphere to score points!</p>
                </div>

                <div className="flex items-center gap-4 bg-slate-900 px-5 py-2.5 rounded-2xl border border-slate-700 text-xs">
                  <div>
                    <span className="text-slate-400 block">SCORE:</span>
                    <span className="text-xl font-black text-blue-400">{gameScore}</span>
                  </div>
                  <div className="border-l border-slate-800 pl-4">
                    <span className="text-slate-400 block">COMBO:</span>
                    <span className="text-xl font-black text-amber-400">{comboMultiplier}x</span>
                  </div>
                  <div className="border-l border-slate-800 pl-4">
                    <span className="text-slate-400 block">STAMINA:</span>
                    <span className="text-xl font-black text-rose-400">{gameEnergy}%</span>
                  </div>
                </div>
              </div>

              <div className="relative flex flex-col items-center justify-center bg-slate-950 rounded-2xl p-4 border border-slate-800 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={380}
                  className="w-full max-w-2xl bg-slate-900 rounded-xl cursor-crosshair border border-slate-800 shadow-inner"
                />

                {!gameActive && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 p-6 text-center">
                    <Trophy className="w-16 h-16 text-blue-400 animate-bounce" />
                    <h3 className="text-2xl font-black text-white">Ready for Kickoff?</h3>
                    <p className="text-xs text-slate-300 max-w-md">
                      Test your agility and athletic reaction time. Use your cursor to keep the ball in play.
                    </p>
                    <button
                      onClick={startGame}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-lg transition-all flex items-center gap-2 text-sm"
                    >
                      {gameEnergy <= 0 ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      {gameEnergy <= 0 ? 'Play Again' : 'Start Match'}
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* TAB 2: ACTIVITIES & TOURNAMENTS */}
          {activeTab === 'activities' && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-800/90 p-6 rounded-2xl border border-slate-700">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search sports activities or locations..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {['All', 'Football & Soccer', 'Basketball & Athletics', 'Fitness & Aerobics', 'Cycling & Endurance', 'Yoga & Mindfulness'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        categoryFilter === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {loadingActivities ? (
                <div className="bg-slate-800 rounded-3xl p-12 text-center border border-slate-700 text-slate-400">
                  Loading sports activities...
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="bg-slate-800 rounded-3xl p-12 text-center border border-slate-700 space-y-3">
                  <Info className="w-10 h-10 text-slate-500 mx-auto" />
                  <h3 className="text-lg font-bold text-white">No sports events found</h3>
                  <p className="text-sm text-slate-400">Organize a new event for {categoryFilter}!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredActivities.map((act) => (
                    <article
                      key={act.id}
                      className="bg-slate-800/90 p-6 rounded-3xl border border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="bg-blue-500/20 text-blue-300 font-extrabold text-xs px-2.5 py-1 rounded-lg border border-blue-500/30">
                            {act.category}
                          </span>
                          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {act.status}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white leading-snug">{act.title}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{act.description}</p>
                      </div>

                      <div className="bg-slate-950/60 p-3.5 rounded-2xl space-y-1 text-xs border border-slate-800">
                        <p className="text-slate-300 flex items-center justify-between">
                          <span>Location:</span>
                          <span className="font-bold text-white">{act.location}</span>
                        </p>
                        <p className="text-slate-300 flex items-center justify-between">
                          <span>Est. Calorie Burn:</span>
                          <span className="font-bold text-rose-400 flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5" /> {act.caloriesBurnEst} kcal
                          </span>
                        </p>
                        <p className="text-slate-300 flex items-center justify-between">
                          <span>Organizer:</span>
                          <span className="font-bold text-blue-300">{act.organizer}</span>
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                        <button
                          onClick={() => handleJoinActivity(act.id)}
                          className="flex items-center gap-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-all shadow-md"
                        >
                          <Users className="w-3.5 h-3.5" /> Join ({act.participantsCount})
                        </button>

                        <span className="text-xs text-slate-400 font-medium">
                          Grassroots Sports
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB 3: WORKOUT CALORIE CALCULATOR */}
          {activeTab === 'calculator' && (
            <section className="bg-slate-800/90 rounded-3xl border border-slate-700 p-8 sm:p-10 shadow-xl space-y-8">
              <header className="space-y-2 border-b border-slate-700 pb-6">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 font-extrabold text-xs px-3 py-1 rounded-lg">
                  <Calculator className="w-4 h-4" /> MET & Calorie Burn Analysis
                </div>
                <h2 className="text-2xl font-black text-white">Workout Energy Expenditure Calculator</h2>
                <p className="text-sm text-slate-400 max-w-2xl">
                  Estimate total calories and fat burn based on exercise Metabolic Equivalent of Task (MET) ratings.
                </p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form onSubmit={handleCalculateWorkout} className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Activity Type</label>
                      <select
                        value={calcActivity}
                        onChange={e => setCalcActivity(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="football">Football / Soccer (8.0 MET)</option>
                        <option value="basketball">Basketball (7.5 MET)</option>
                        <option value="running">Running / Jogging (7.0 MET)</option>
                        <option value="cycling">Cycling / Endurance (6.8 MET)</option>
                        <option value="swimming">Swimming (8.3 MET)</option>
                        <option value="aerobics">HIIT / Aerobics (8.5 MET)</option>
                        <option value="yoga">Yoga & Stretching (3.2 MET)</option>
                        <option value="walking">Brisk Walking (3.8 MET)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Duration (Minutes)</label>
                      <input
                        type="number"
                        min="5"
                        max="300"
                        required
                        value={calcMinutes}
                        onChange={e => setCalcMinutes(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Body Weight (kg)</label>
                      <input
                        type="number"
                        min="30"
                        max="200"
                        required
                        value={calcWeight}
                        onChange={e => setCalcWeight(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={calculating}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-8 py-3.5 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {calculating ? 'Computing...' : 'Calculate Energy Expenditure'} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <aside className="bg-slate-950 p-8 rounded-3xl space-y-6 border border-slate-800 flex flex-col justify-between">
                  {calcResult ? (
                    <div className="space-y-5">
                      <span className="bg-blue-500/20 text-blue-300 font-mono text-xs font-bold px-3 py-1 rounded-full uppercase">
                        Workout Output
                      </span>

                      <div className="space-y-1">
                        <p className="text-4xl font-black text-rose-400 flex items-center gap-2">
                          <Flame className="w-8 h-8" /> {calcResult.caloriesBurned} kcal
                        </p>
                        <p className="text-xs font-bold text-slate-300">Fat Mass Burned: {calcResult.fatGramsBurned} grams</p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                        <p className="text-slate-300">Intensity Level: <strong className="text-emerald-400">{calcResult.intensityLevel}</strong></p>
                        <p className="text-slate-300">Activity MET Rating: <strong className="text-blue-400">{calcResult.metValue}</strong></p>
                        <p className="text-slate-400 text-xs leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800 mt-2">
                          {calcResult.healthBenefit}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-center py-8">
                      <Flame className="w-12 h-12 text-rose-400 mx-auto animate-pulse" />
                      <h3 className="text-lg font-bold text-white">Workout Metric Ready</h3>
                      <p className="text-xs text-slate-400">Select an activity, duration, and weight to calculate energy expenditure.</p>
                    </div>
                  )}

                  <div className="text-xs text-slate-500 text-center border-t border-slate-800 pt-4">
                    Based on WHO Exercise Physiology Standards
                  </div>
                </aside>
              </div>
            </section>
          )}

          {/* ORGANIZE EVENT MODAL */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 rounded-3xl max-w-xl w-full p-8 space-y-6 border border-slate-700 shadow-2xl relative animate-in fade-in">
                <header className="space-y-1">
                  <h2 className="text-2xl font-black text-white">Organize Community Sports Event</h2>
                  <p className="text-xs text-slate-400">Register a local or virtual tournament to recruit participants.</p>
                </header>

                {submitMsg ? (
                  <div className="bg-emerald-500/20 text-emerald-300 p-4 rounded-2xl text-xs font-bold text-center border border-emerald-500/30">
                    {submitMsg}
                  </div>
                ) : (
                  <form onSubmit={handleCreateActivity} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Event / Tournament Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Metro Youth Basketball Cup"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                        <select
                          value={newCategory}
                          onChange={e => setNewCategory(e.target.value as any)}
                          className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          <option value="Football & Soccer">Football & Soccer</option>
                          <option value="Basketball & Athletics">Basketball & Athletics</option>
                          <option value="Fitness & Aerobics">Fitness & Aerobics</option>
                          <option value="Cycling & Endurance">Cycling & Endurance</option>
                          <option value="Water Sports & Swimming">Water Sports & Swimming</option>
                          <option value="Yoga & Mindfulness">Yoga & Mindfulness</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Est. Calorie Burn (kcal)</label>
                        <input
                          type="number"
                          required
                          value={newCalories}
                          onChange={e => setNewCalories(Number(e.target.value))}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Location / Stadium</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Central Sports Complex"
                          value={newLocation}
                          onChange={e => setNewLocation(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Organizer / Club</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. City Athletics Club"
                          value={newOrganizer}
                          onChange={e => setNewOrganizer(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Detail event schedule, equipment needs, and rules..."
                        value={newDescription}
                        onChange={e => setNewDescription(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      ></textarea>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-bold text-xs transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-1/2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-xs transition-all shadow-md disabled:opacity-50"
                      >
                        {submitting ? 'Registering...' : 'Publish Event'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
