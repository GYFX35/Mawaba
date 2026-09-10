import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Target, Users, Lightbulb, Sparkles, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>About Us & Release v1.3.0 | Mawaba</title>
        <meta name="description" content="Learn about Mawaba's mission to globalize innovation through AI education, sustainable agribusiness, investor networks, and climate solutions." />
      </Head>

      <section className="py-20 bg-gradient-to-b from-slate-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Version 1.3.0 Ecosystem</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-6">
              Our Mission to Globalize Innovation & Human Flourishing
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              Mawaba is born from the vision of a world where geography never limits opportunity or innovation.
              We build a unified digital ecosystem bridging ideas, AI intelligence, sustainable agribusiness, venture capital, global health, and climate solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="bg-blue-50 w-12 h-12 flex items-center justify-center rounded-2xl border border-blue-100">
                <Target className="text-blue-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Strategic Focus</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Targeting critical global impact sectors including health equity (SDG 3), climate carbon neutrality, AI tutoring, and agribusiness trade.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="bg-blue-50 w-12 h-12 flex items-center justify-center rounded-2xl border border-blue-100">
                <Users className="text-blue-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Global Community</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Fostering an inclusive network of creators, researchers, startup founders, and investors collaborating across borders.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="bg-blue-50 w-12 h-12 flex items-center justify-center rounded-2xl border border-blue-100">
                <Lightbulb className="text-blue-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Intelligent Platform</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Integrating multi-provider AI model execution (Google Gemini & OpenAI GPT) to streamline strategy and decision making.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Release v1.3.0 Architecture Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-[36px] p-8 md:p-14 shadow-2xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Release v1.3.0 Milestone
              </span>
              <h2 className="text-3xl sm:text-4xl font-black leading-snug">
                Unified Ecosystem & Clean Navigation Architecture
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Version 1.3.0 introduces categorized navigation, enhanced AI service fallback safeguards, improved desktop & mobile UX, and full workspace alignment.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Responsive Categorized Header</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Multi-Provider AI Tutoring</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>B2B Agribusiness Marketplace</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>VC & Investor Match Matching</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 space-y-4 text-center">
              <div className="text-xs font-black text-blue-400 uppercase tracking-widest">Get Started Today</div>
              <p className="text-xs text-slate-300">Explore our developer documentation or connect with global creators.</p>
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/api-docs" className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2">
                  <span>Developer Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="bg-slate-700 hover:bg-slate-600 text-slate-200 py-3 rounded-xl text-xs font-bold transition-all">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
