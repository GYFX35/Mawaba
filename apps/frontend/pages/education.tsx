import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  BookOpen,
  Award,
  Sparkles,
  Globe,
  Compass,
  Users,
  GraduationCap,
  ArrowRight,
  Brain,
  BookOpenCheck,
  Search,
  CheckCircle,
  Play,
  MessageSquare
} from 'lucide-react';

interface Course {
  title: string;
  category: string;
  level: string;
  duration: string;
  enrolled: number;
  rating: number;
}

const EducationPage: NextPage = () => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string>('');
  const [isAiResponding, setIsAiResponding] = useState<boolean>(false);

  // Forum state
  const [messages, setMessages] = useState<any[]>([]);
  const [newUsername, setNewUsername] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [messageDiscipline, setMessageDiscipline] = useState<string>('STEM & Sciences');
  const [submittingMessage, setSubmittingMessage] = useState<boolean>(false);

  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/forums/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.warn("Could not load forum messages from API backend.", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const disciplines = [
    { id: 'All', name: 'All Disciplines' },
    { id: 'Sciences', name: 'Sciences & STEM' },
    { id: 'Literature', name: 'Literature & Languages' },
    { id: 'Business', name: 'Business & Econ' },
    { id: 'Health', name: 'Health & Well-being' },
    { id: 'Development', name: 'World Development' }
  ];

  const featuredCourses: Course[] = [
    {
      title: "Introduction to Artificial Intelligence in Business",
      category: "Business",
      level: "Beginner",
      duration: "4 weeks",
      enrolled: 1240,
      rating: 4.8
    },
    {
      title: "Global Public Health & Pandemics",
      category: "Health",
      level: "Intermediate",
      duration: "6 weeks",
      enrolled: 850,
      rating: 4.9
    },
    {
      title: "Sustainable Development Goals & Green Energy",
      category: "Development",
      level: "All Levels",
      duration: "5 weeks",
      enrolled: 2100,
      rating: 4.7
    },
    {
      title: "Advanced Quantum Physics Principles",
      category: "Sciences",
      level: "Advanced",
      duration: "10 weeks",
      enrolled: 430,
      rating: 4.9
    },
    {
      title: "Mastering World Literature and Philosophy",
      category: "Literature",
      level: "Intermediate",
      duration: "8 weeks",
      enrolled: 620,
      rating: 4.6
    },
    {
      title: "Microeconomics & Global Markets",
      category: "Business",
      level: "Intermediate",
      duration: "6 weeks",
      enrolled: 1040,
      rating: 4.8
    }
  ];

  const filteredCourses = selectedDiscipline === 'All'
    ? featuredCourses
    : featuredCourses.filter(course => course.category === selectedDiscipline);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsAiResponding(true);
    setAiAnswer('');

    try {
      let discipline = 'STEM & Sciences';
      if (selectedDiscipline === 'Literature') discipline = 'Literature & Languages';
      if (selectedDiscipline === 'Business') discipline = 'Business & Economics';
      if (selectedDiscipline === 'Health') discipline = 'Health & Well-being';
      if (selectedDiscipline === 'Development') discipline = 'World Development';

      const res = await fetch('http://localhost:3001/api/ai/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: aiQuestion,
          discipline
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiAnswer(data.answer);
      } else {
        throw new Error('API response error');
      }
    } catch (err) {
      console.warn("Using offline simulated response fallback...");
      setTimeout(() => {
        const q = aiQuestion.toLowerCase();
        let response = "That's an excellent question! In the context of Mawaba's global education, we believe in interdisciplinary problem-solving. ";

        if (q.includes('ai') || q.includes('artificial intelligence') || q.includes('technology')) {
          response += "Artificial Intelligence acts as an equalizer, translating learning materials in real-time and personalizing coursework to match every student's learning style, regardless of location.";
        } else if (q.includes('science') || q.includes('physics') || q.includes('math')) {
          response += "Scientific inquiry drives modern discovery. Our STEM curriculum highlights collaboration between labs globally, allowing students in emerging economies to run virtual simulations on premium hardware.";
        } else if (q.includes('business') || q.includes('economics') || q.includes('finance')) {
          response += "Modern business is global and social. Integrating sustainability (green tech) and AI tools into business courses ensures future leaders build companies that prioritize social and planetary health.";
        } else if (q.includes('health') || q.includes('medicine') || q.includes('well-being')) {
          response += "Global health education focuses on preventive care, public health policy, and clean drinking water access. Educating communities yields instant returns in economic stability and wellness.";
        } else {
          response += "We offer localized content, virtual mentors, and collaborative projects. Connecting students from diverse cultural backgrounds helps solve the world's most complex challenges together.";
        }

        setAiAnswer(response);
      }, 1000);
    } finally {
      setIsAiResponding(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newMessage.trim()) return;

    setSubmittingMessage(true);
    try {
      const res = await fetch('http://localhost:3001/api/forums/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: newUsername,
          message: newMessage,
          discipline: messageDiscipline
        })
      });

      if (res.ok) {
        const posted = await res.json();
        setMessages(prev => [...prev, posted]);
        setNewMessage('');
      } else {
        throw new Error('API post failed');
      }
    } catch (err) {
      console.warn("Offline post fallback...");
      const fallbackMsg = {
        id: Math.random().toString(),
        username: newUsername,
        discipline: messageDiscipline,
        message: newMessage,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, fallbackMsg]);
      setNewMessage('');
    } finally {
      setSubmittingMessage(false);
    }
  };

  const sampleQuestions = [
    "How does AI optimize business models in emerging markets?",
    "What is the relationship between clean water education and world development?",
    "Why is STEM education critical for sustainable development goals?"
  ];

  return (
    <>
      <Head>
        <title>Global Education | Mawaba</title>
        <meta name="description" content="Explore Mawaba Global Education, integrating Sciences, Literature, Business, Health, and AI-driven interactive tutoring." />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white overflow-hidden py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                <Sparkles className="h-3.5 w-3.5" /> Next-Generation Learning Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-none">
                Education Without <span className="text-blue-600">Boundaries</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 max-w-xl leading-relaxed">
                Mawaba brings world-class educational resources directly to your screen. We integrate modern STEM sciences, literature, economics, global health, and advanced AI systems to nurture future leaders.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#explore-courses"
                  className="bg-blue-600 text-white px-6 py-3.5 rounded-full font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Explore Disciplines <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="#ai-tutor"
                  className="bg-white text-gray-700 border border-gray-200 px-6 py-3.5 rounded-full font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <Brain className="h-5 w-5 text-purple-600" /> Talk to AI Tutor
                </a>
              </div>
            </div>

            {/* Visual Hero Feature */}
            <div className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-xl lg:ml-4">
              <div className="absolute -top-6 -right-6 bg-amber-100 p-4 rounded-2xl shadow-md -rotate-12 hidden sm:block">
                <Award className="h-8 w-8 text-amber-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Compass className="text-blue-600 h-6 w-6" /> Platform Pillars
              </h3>
              <div className="space-y-4">
                {[
                  { title: "STEM & Sciences", desc: "Interactive quantum physics, computational mathematics, biology, and green technology.", icon: <Sparkles className="text-emerald-500" /> },
                  { title: "Literature & Languages", desc: "Multilingual content, global writing circles, and comparative literary studies.", icon: <Globe className="text-indigo-500" /> },
                  { title: "Business & sustainable development", desc: "Social entrepreneurship guides, micro-economical models, and sustainable goals.", icon: <Users className="text-rose-500" /> }
                ].map((pillar, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-blue-50/50 transition-colors">
                    <div className="bg-white p-3 h-fit rounded-xl border border-gray-100 shadow-sm shrink-0">
                      {pillar.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{pillar.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Backdrop blob */}
        <div className="absolute top-0 right-0 w-[45%] h-[45%] bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none -z-10 translate-x-[20%] translate-y-[-20%]"></div>
      </section>

      {/* Explore Disciplines */}
      <section id="explore-courses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Curriculum Core Disciplines
            </h2>
            <div className="h-1.5 w-20 bg-blue-600 mx-auto mt-4 rounded-full"></div>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mt-4">
              Switch between disciplines to view our highly targeted global courses.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {disciplines.map((discipline) => (
              <button
                key={discipline.id}
                onClick={() => setSelectedDiscipline(discipline.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  (selectedDiscipline === discipline.id || (selectedDiscipline === 'All' && discipline.id === 'All'))
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {discipline.name}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      {course.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{course.level}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-6 border-t border-gray-50 pt-4">
                    <span className="flex items-center gap-1"><BookOpenCheck className="h-4 w-4 text-blue-500" /> {course.duration}</span>
                    <span className="flex items-center gap-1"><Users className="h-4 w-4 text-emerald-500" /> {course.enrolled} enrolled</span>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-sm font-bold text-amber-500 flex items-center gap-1">★ {course.rating}</span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1 transition-all">
                    Start Course <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive AI Tutor Section */}
      <section id="ai-tutor" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-12">

              {/* Promo Left Column */}
              <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 to-indigo-800 p-8 lg:p-12 text-white flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="bg-blue-500/30 w-12 h-12 flex items-center justify-center rounded-xl backdrop-blur-md">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                    Ask Mawaba&apos;s <br />AI Global Tutor
                  </h3>
                  <p className="text-blue-100 leading-relaxed text-sm lg:text-base">
                    Stuck on a homework problem or wanting to understand complex economic principles? Our AI tutor can answer your educational queries in dozens of languages instantly.
                  </p>

                  <div className="space-y-3 pt-4">
                    {[
                      "Powered by customized LLMs",
                      "Instant language translation",
                      "Tailored study paths"
                    ].map((bullet, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-blue-50">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12 lg:mt-0 pt-6 border-t border-blue-500/30 flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-full backdrop-blur-md">
                    <Sparkles className="h-5 w-5 text-blue-300" />
                  </div>
                  <span className="text-xs text-blue-100 font-medium">Included free with all education modules</span>
                </div>
              </div>

              {/* Interactive Demo Right Column */}
              <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between bg-white">
                <div>
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" /> Interactive Mock Workspace
                  </h4>
                  <p className="text-sm text-gray-500 mb-6">
                    Try the tutor simulator below. Type a question or select one of our suggested templates to see an answer instantly.
                  </p>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {sampleQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setAiQuestion(q);
                        }}
                        className="text-left text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg border border-gray-200 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleAskAi} className="relative mb-6">
                    <input
                      type="text"
                      placeholder="e.g. Why is STEM education critical for sustainable development?"
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      type="submit"
                      disabled={isAiResponding}
                      className="absolute right-2 top-2 bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>

                  {/* AI Response Box */}
                  <div className="bg-gray-50 rounded-2xl p-5 min-h-[160px] border border-gray-100 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block mb-2 flex items-center gap-1">
                        <Brain className="h-3.5 w-3.5" /> AI Response
                      </span>
                      {isAiResponding ? (
                        <div className="space-y-2 pt-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                        </div>
                      ) : aiAnswer ? (
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                          {aiAnswer}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          Choose a template question above or type your own, then click the arrow to see how the AI tutor acts.
                        </p>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-3 mt-4 flex justify-between items-center text-xs text-gray-400">
                      <span>Response time: ~1.5s</span>
                      <span>Accuracy rate: 99.4%</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Educational Forums & Community section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Global Idea Sharing & Educational Forums
              </h2>
              <div className="h-1.5 w-20 bg-blue-600 mt-4 rounded-full"></div>
              <p className="text-lg text-gray-500 leading-relaxed">
                Mawaba is more than just curriculum; it is a global social network. Students, professors, and industry leaders connect via our dedicated forums to share ideas, form partnerships, and organize peer-to-peer tutoring.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  {
                    title: "Peer-to-Peer Mentoring",
                    desc: "Seniors mentor juniors across different continents, building strong global relationships."
                  },
                  {
                    title: "Joint Development Projects",
                    desc: "Collaborative research groups creating solutions for regional development and public health."
                  },
                  {
                    title: "Open Opinion Forums",
                    desc: "Debate and discussion on contemporary issues like economic policies, global trade, and ethics in technology."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="bg-emerald-50 text-emerald-600 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-3xl p-6 lg:p-8 relative overflow-hidden flex flex-col justify-between min-h-[450px]">
              <div className="space-y-2 mb-4">
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-widest">
                  Discussion Spotlights & Live Forums
                </span>
                <h3 className="text-xl font-bold text-gray-900">
                  Global Conversation Room
                </h3>
              </div>

              {/* Message List */}
              <div className="space-y-3 my-4 overflow-y-auto max-h-[220px] pr-1">
                {messages.length === 0 ? (
                  <>
                    {[
                      { username: "Einstein101", message: "Has anyone integrated any live quantum simulator on NextJS?", discipline: "STEM & Sciences" },
                      { username: "AdaLovelace", message: "Yes! Check out React-Three-Fiber, it works wonders for 3D state representations.", discipline: "STEM & Sciences" },
                      { username: "GutenbergPioneer", message: "I am planning to launch a creative writing challenge next week.", discipline: "Literature & Languages" }
                    ].map((m, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-gray-700">@{m.username}</span>
                          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">
                            {m.discipline}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{m.message}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  messages.map((m, idx) => (
                    <div key={m.id || idx} className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-700">@{m.username}</span>
                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">
                          {m.discipline}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{m.message}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Form to Post Message */}
              <form onSubmit={handleSendMessage} className="bg-white p-4 rounded-2xl border border-blue-100 space-y-2 mt-2">
                <span className="text-xs font-bold text-gray-800 block">Post to Live Feed</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="p-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <select
                    value={messageDiscipline}
                    onChange={(e) => setMessageDiscipline(e.target.value)}
                    className="p-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="STEM & Sciences">Sciences & STEM</option>
                    <option value="Literature & Languages">Literature & Langs</option>
                    <option value="Business & Economics">Business & Econ</option>
                    <option value="Health & Well-being">Health & Wellness</option>
                    <option value="World Development">Development</option>
                  </select>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full p-2 pr-16 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={submittingMessage}
                    className="absolute right-1.5 top-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded text-[10px] disabled:bg-blue-300"
                  >
                    {submittingMessage ? 'Sending' : 'Post'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Certification & Institution Partnership Call */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-900 py-20 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <GraduationCap className="h-16 w-16 mx-auto mb-6 text-blue-400 opacity-90" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold max-w-4xl mx-auto tracking-tight leading-tight">
            Partner with Mawaba&apos;s Education Ecosystem
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mt-6">
            Are you an educational institution, NGO, or university looking to amplify your educational material to a global scale? We offer easy API integrations, joint certificate issuing, and open-source licensing.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <button className="bg-white text-blue-900 font-bold px-8 py-4 rounded-full shadow-lg hover:bg-gray-50 transition-all">
              Become an Academic Partner
            </button>
            <button className="bg-transparent border-2 border-blue-400 text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-all">
              View Developer Documentation
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[-30%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-[-30%] right-[-10%] w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
      </section>
    </>
  );
};

export default EducationPage;
