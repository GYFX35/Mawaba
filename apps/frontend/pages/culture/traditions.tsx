import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import {
  Globe,
  BookOpen,
  ArrowLeft,
  Sparkles,
  MapPin,
  Heart,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  ShieldAlert,
  Compass
} from 'lucide-react';

interface TraditionSpotlight {
  id: string;
  title: string;
  culture: string;
  country: string;
  region: string;
  era: string;
  preservationStatus: 'Thriving' | 'Intangible UNESCO Heritage' | 'Under Preservation';
  description: string;
  keyPractices: string[];
  image: string;
}

const TRADITION_SPOTLIGHTS: TraditionSpotlight[] = [
  {
    id: 'ts-1',
    title: 'Oral History & Griot Storytelling',
    culture: 'Mandé People',
    country: 'Mali, Senegal, Guinea',
    region: 'West Africa',
    era: '13th Century - Present',
    preservationStatus: 'Intangible UNESCO Heritage',
    description: 'Griots (Jalis) are oral historians, genealogists, and musicians who safeguard centuries of family lineages, epics, and social wisdom accompanied by the 21-string Kora harp.',
    keyPractices: ['Epic of Sundiata recitation', 'Kora harp mastery', 'Genealogical preservation'],
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ts-2',
    title: 'Wabi-Sabi & Chanoyu Tea Ceremony',
    culture: 'Japanese Zen Heritage',
    country: 'Japan',
    region: 'East Asia',
    era: '16th Century - Present',
    preservationStatus: 'Thriving',
    description: 'Chanoyu (the Way of Tea) embodies mindfulness, harmony (Wa), respect (Kei), purity (Sei), and tranquility (Jaku). It highlights finding beauty in imperfection and rustic simplicity (Wabi-Sabi).',
    keyPractices: ['Powdered Matcha preparation', 'Seasonal chawan ceramics selection', 'Garden pathway walking (Roji)'],
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ts-3',
    title: 'Aymara & Quechua Weaving Arts',
    culture: 'Andean Indigenous Peoples',
    country: 'Peru & Bolivia',
    region: 'South America',
    era: 'Pre-Inca - Present',
    preservationStatus: 'Intangible UNESCO Heritage',
    description: 'Backstrap loom weaving uses alpaca wool naturally dyed with cochineal and native herbs. Complex geometric patterns (Tocapu) convey cosmology, clan identity, and agricultural calendars.',
    keyPractices: ['Natural plant & insect dyes', 'Backstrap loom hand-weaving', 'Tocapu symbolic storytelling'],
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ts-4',
    title: 'Kumbh Mela Pilgrimage & Sacred Gathering',
    culture: 'Vedic Cultural Heritage',
    country: 'India',
    region: 'South Asia',
    era: 'Ancient Antiquity - Present',
    preservationStatus: 'Intangible UNESCO Heritage',
    description: 'The world\'s largest peaceful cultural gathering where millions bathe in sacred rivers at auspicious astrological alignment periods, reflecting unity, spiritual discourse, and living heritage.',
    keyPractices: ['River ritual bathing', 'Philosophical debates (Satsang)', 'Community feast distribution (Langar)'],
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80'
  }
];

const TraditionsArchivePage = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredSpotlights = activeFilter === 'All'
    ? TRADITION_SPOTLIGHTS
    : TRADITION_SPOTLIGHTS.filter(t => t.preservationStatus === activeFilter);

  return (
    <Layout>
      <Head>
        <title>Ancestral Traditions & Heritage Archive | Mawaba Culture</title>
        <meta
          name="description"
          content="Explore living ancestral traditions, oral folklore, UNESCO intangible heritage, and traditional craftsmanship from around the world."
        />
      </Head>

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/culture"
            className="inline-flex items-center gap-2 text-amber-300 hover:text-white text-xs font-bold mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Global Culture Hub</span>
          </Link>

          <div className="max-w-3xl">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-extrabold uppercase px-3 py-1 rounded-full border border-amber-400/30">
              Intangible Heritage & Living Wisdom
            </span>
            <h1 className="text-4xl sm:text-5xl font-black mt-4 tracking-tight leading-tight">
              Ancestral Traditions & Heritage Archive
            </h1>
            <p className="mt-4 text-base sm:text-lg text-amber-100/90 font-light leading-relaxed">
              Living cultural traditions pass down human philosophy, ecological harmony, and artistic mastery across centuries. Safeguarding these traditions strengthens global empathy and cross-generational learning.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Featured Heritage Spotlights</h2>
            <p className="text-xs text-gray-500">Curated global traditions and living cultural customs</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {['All', 'Intangible UNESCO Heritage', 'Thriving'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === status
                    ? 'bg-amber-700 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Spotlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredSpotlights.map((trad) => (
            <div
              key={trad.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-video bg-gray-950 overflow-hidden">
                <img
                  src={trad.image}
                  alt={trad.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
                  {trad.region}
                </div>
                <div className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                  {trad.preservationStatus}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{trad.country} • {trad.culture}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900">{trad.title}</h3>

                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    {trad.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                      Key Cultural Practices:
                    </h4>
                    <ul className="space-y-1.5">
                      {trad.keyPractices.map((practice, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                          <ChevronRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">Era: {trad.era}</span>
                  <Link
                    href="/culture"
                    className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1"
                  >
                    <span>View Media Publications</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Callout Section */}
        <div className="mt-16 bg-gradient-to-r from-amber-900 to-orange-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-black">Know Your Traditions? Share Them Everywhere!</h3>
            <p className="mt-3 text-amber-100 text-sm leading-relaxed">
              Every village and town possesses traditional knowledge, seasonal recipes, folk music, or ceremonial wear. Capture a video recording or camera photo snapshot and preserve your cultural tradition online today.
            </p>
            <Link
              href="/culture"
              className="mt-6 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-950 px-6 py-3 rounded-2xl font-extrabold text-sm shadow-xl transition-all"
            >
              <Globe className="w-4 h-4" />
              <span>Publish My Culture Now</span>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TraditionsArchivePage;
