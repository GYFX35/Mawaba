import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { ArrowRight, Globe, Shield, Zap, Heart, BookOpen, BarChart } from 'lucide-react';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Mawaba | Global Interaction & AI-Driven Business</title>
        <meta name="description" content="Global interaction, communication app integrated with AI for business, partnership, and development ideas." />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              Empowering <span className="text-blue-600">Global Innovation</span> through AI
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 mb-10">
              The premier social network for business promotion, world development, health, and education. Connect, share ideas, and grow together.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Start Your Journey <ArrowRight className="h-5 w-5" />
              </button>
              <button className="bg-white text-gray-700 border-2 border-gray-100 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-[5%] left-[-5%] w-[35%] h-[35%] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Mawaba?</h2>
            <div className="h-1.5 w-20 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Global Reach",
                desc: "Connect with entrepreneurs and visionaries from across the globe in real-time.",
                icon: <Globe className="h-8 w-8 text-blue-600" />
              },
              {
                title: "AI Integrated",
                desc: "Harness powerful AI tools to optimize your business ideas and partnership strategies.",
                icon: <Zap className="h-8 w-8 text-blue-600" />
              },
              {
                title: "Secure Forums",
                desc: "Share sensitive developmental ideas in a protected, community-vetted environment.",
                icon: <Shield className="h-8 w-8 text-blue-600" />
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-4 bg-blue-50 w-16 h-16 flex items-center justify-center rounded-xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disciplines Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Pillars</h2>
          <p className="text-gray-500 mb-16 max-w-2xl mx-auto">Focusing on what truly matters for global development and human well-being.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Health", icon: <Heart className="text-rose-500" /> },
              { name: "Education", icon: <BookOpen className="text-amber-500" /> },
              { name: "Business", icon: <BarChart className="text-emerald-500" /> },
              { name: "Development", icon: <Globe className="text-blue-500" /> }
            ].map((pillar, idx) => (
              <div key={idx} className="flex flex-col items-center p-6 bg-white border border-gray-100 rounded-2xl hover:border-blue-100 transition-colors cursor-pointer group">
                <div className="mb-4 p-4 rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors">
                  {React.cloneElement(pillar.icon as React.ReactElement, { size: 32 })}
                </div>
                <span className="font-semibold text-gray-900">{pillar.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-3xl p-10 md:p-20 text-center text-white relative overflow-hidden">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Join the Mawaba Community</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto relative z-10">
              Ready to take your ideas global? Start connecting with the world today.
            </p>
            <button className="bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-50 transition-all shadow-lg relative z-10">
              Create Free Account
            </button>
            {/* Decoration */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-500 rounded-full opacity-30"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-blue-400 rounded-full opacity-20"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
