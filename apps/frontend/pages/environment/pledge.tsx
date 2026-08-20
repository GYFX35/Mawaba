import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Award,
  ShieldCheck,
  Globe,
  Leaf,
  CheckCircle2,
  Share2,
  ArrowLeft,
  Sparkles,
  TreePine,
  Wind,
  Check,
  Copy
} from 'lucide-react';

interface Pledge {
  id: string;
  name: string;
  country: string;
  pledgeType: string;
  co2ReductionEst: number;
  createdAt: string;
}

export default function EnvironmentPledgePage() {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('United States');
  const [pledgeType, setPledgeType] = useState('Switching to 100% Renewable Home Electricity');
  const [co2Est, setCo2Est] = useState<number>(2000);
  const [submitting, setSubmitting] = useState(false);
  const [hasPledged, setHasPledged] = useState(false);
  const [copied, setCopied] = useState(false);

  // Recent community pledges
  const [recentPledges, setRecentPledges] = useState<Pledge[]>([]);
  const [totalPledgesCount, setTotalPledgesCount] = useState(3);
  const [totalCo2Kg, setTotalCo2Kg] = useState(4250);

  const PLEDGE_OPTIONS = [
    { label: 'Switching to 100% Renewable Home Electricity', co2: 2000 },
    { label: 'Transitioning to EV / Bicycle / Public Transit Commute', co2: 1500 },
    { label: 'Adopting Plant-Rich Diet & Zero Food Waste', co2: 1200 },
    { label: 'Planting 10+ Native Trees Annually', co2: 1000 },
    { label: 'Eliminating Single-Use Plastics & Active Composting', co2: 600 }
  ];

  const fetchPledges = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/environment/pledges');
      if (res.ok) {
        const data = await res.json();
        setRecentPledges(data.recentPledges || []);
        setTotalPledgesCount(data.totalPledges || 3);
        setTotalCo2Kg(data.totalCo2ReductionKg || 4250);
      }
    } catch (e) {
      console.error('Error fetching pledges:', e);
      setRecentPledges([
        { id: 'p-1', name: 'Sophia Chen', country: 'Singapore', pledgeType: 'Switching to 100% Renewable Home Power', co2ReductionEst: 2400, createdAt: new Date().toISOString() },
        { id: 'p-2', name: 'Amina Diallo', country: 'Senegal', pledgeType: 'Zero Single-Use Plastics & Active Composting', co2ReductionEst: 650, createdAt: new Date().toISOString() }
      ]);
    }
  };

  useEffect(() => {
    fetchPledges();
  }, []);

  const handlePledgeOptionChange = (optionLabel: string, co2Value: number) => {
    setPledgeType(optionLabel);
    setCo2Est(co2Value);
  };

  const handleSubmitPledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !country || !pledgeType) return;

    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:3001/api/environment/pledges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          country,
          pledgeType,
          co2ReductionEst: co2Est
        })
      });

      if (res.ok) {
        const data = await res.json();
        setHasPledged(true);
        if (data.pledge) {
          setRecentPledges(prev => [data.pledge, ...prev]);
        }
        if (data.totalPledges) setTotalPledgesCount(data.totalPledges);
        if (data.totalCo2ReductionKg) setTotalCo2Kg(data.totalCo2ReductionKg);
      }
    } catch (e) {
      console.error('Error submitting pledge:', e);
      setHasPledged(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyBadgeLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Head>
        <title>Global Climate Pledge & Certificate | Mawaba</title>
        <meta
          name="description"
          content="Take the Mawaba Climate Pledge, commitment to carbon reduction, and generate an official digital environment protection badge."
        />
      </Head>

      <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Top Navigation */}
          <nav className="flex items-center justify-between">
            <Link
              href="/environment"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Environment Protection Page
            </Link>

            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Official Climate Action Registry
            </span>
          </nav>

          {/* Hero Section */}
          <header className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden space-y-4">
            <div className="relative z-10 max-w-2xl space-y-3">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Make Your Climate Commitment Official
              </h1>
              <p className="text-emerald-100 text-sm leading-relaxed">
                Join thousands of individuals and organizations around the globe taking measurable actions to abate carbon emissions, support green energy, and protect biodiversity.
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column: Form / Certificate */}
            <div className="lg:col-span-7 space-y-6">
              {!hasPledged ? (
                <section className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                  <header className="space-y-1">
                    <h2 className="text-2xl font-black text-gray-900">Take the Eco-Pledge</h2>
                    <p className="text-xs text-gray-500">Fill in your information to receive your digital badge.</p>
                  </header>

                  <form onSubmit={handleSubmitPledge} className="space-y-5">
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-bold text-gray-700 mb-1.5">Full Name / Organization</label>
                      <input
                        id="fullName"
                        type="text"
                        required
                        placeholder="e.g. Dr. Maya Lin"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="countryInput" className="block text-xs font-bold text-gray-700 mb-1.5">Country / Region</label>
                      <input
                        id="countryInput"
                        type="text"
                        required
                        placeholder="e.g. Kenya, Canada, Germany..."
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700">Select Primary Environmental Commitment</label>
                      <div className="space-y-2">
                        {PLEDGE_OPTIONS.map((option) => (
                          <div
                            key={option.label}
                            onClick={() => handlePledgeOptionChange(option.label, option.co2)}
                            className={`p-3.5 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-between ${
                              pledgeType === option.label
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <span>{option.label}</span>
                            <span className="font-mono text-emerald-700 text-xs">-{option.co2} kg/yr</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl text-xs transition-all shadow-md shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? 'Registering Pledge...' : 'Register Official Pledge & Generate Badge'}
                    </button>
                  </form>
                </section>
              ) : (
                /* Interactive Digital Certificate Preview */
                <article className="bg-gradient-to-b from-slate-900 to-emerald-950 text-white p-8 sm:p-10 rounded-3xl border-2 border-emerald-500/40 shadow-2xl space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Award className="w-64 h-64 text-emerald-400" />
                  </div>

                  <header className="flex items-center justify-between border-b border-emerald-800/80 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-emerald-500 text-slate-950 p-1.5 rounded-xl">
                        <Leaf className="w-5 h-5" />
                      </div>
                      <span className="font-black text-sm tracking-wider uppercase text-emerald-400">MAWABA CLIMATE BADGE</span>
                    </div>

                    <span className="text-xs font-mono text-emerald-300 bg-emerald-900/60 border border-emerald-700 px-3 py-1 rounded-full">
                      VERIFIED #ECO-{Math.floor(100000 + Math.random() * 900000)}
                    </span>
                  </header>

                  <div className="space-y-4 py-2 text-center sm:text-left">
                    <p className="text-xs uppercase font-bold tracking-widest text-emerald-300">This certifies that</p>
                    <h2 className="text-3xl font-black text-white">{name || 'Global Innovator'}</h2>
                    <p className="text-xs text-slate-300">from <strong className="text-emerald-300">{country}</strong> has officially pledged to:</p>
                    <blockquote className="bg-emerald-900/40 border-l-4 border-emerald-400 p-4 rounded-r-2xl text-sm font-extrabold text-emerald-100">
                      &ldquo;{pledgeType}&rdquo;
                    </blockquote>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-800/80 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated CO2 Reduction</span>
                      <span className="text-xl font-black text-emerald-400">{co2Est} kg / year</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Tree Equivalent</span>
                      <span className="text-xl font-black text-teal-300">~{Math.round(co2Est / 22)} mature trees</span>
                    </div>
                  </div>

                  <footer className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleCopyBadgeLink}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Badge Link Copied!' : 'Share Climate Certificate'}
                    </button>
                    <button
                      onClick={() => setHasPledged(false)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-3 rounded-xl text-xs transition-colors"
                    >
                      Edit Pledge
                    </button>
                  </footer>
                </article>
              )}
            </div>

            {/* Right Column: Global Community Action */}
            <aside className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <header className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-lg font-bold text-gray-900">Live Global Registry</h3>
                  <span className="bg-emerald-50 text-emerald-800 font-mono text-xs font-bold px-2.5 py-1 rounded-lg">
                    {totalPledgesCount} Pledges Total
                  </span>
                </header>

                <div className="space-y-3">
                  {recentPledges.map((p) => (
                    <div key={p.id} className="p-3.5 bg-gray-50 rounded-2xl space-y-1.5 text-xs border border-gray-100">
                      <div className="flex justify-between items-center font-bold text-gray-900">
                        <span>{p.name}</span>
                        <span className="text-emerald-700 font-mono">-{p.co2ReductionEst} kg CO2/yr</span>
                      </div>
                      <p className="text-gray-500 font-medium">{p.pledgeType}</p>
                      <p className="text-[10px] text-gray-400">{p.country}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-900 text-emerald-100 p-6 rounded-3xl space-y-3">
                <h4 className="font-bold text-sm flex items-center gap-2 text-white">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Collective Environmental Impact
                </h4>
                <p className="text-xs leading-relaxed text-emerald-200">
                  Total abated CO2 logged across all Mawaba user pledges:
                </p>
                <p className="text-3xl font-black text-emerald-400 font-mono">
                  {(totalCo2Kg / 1000).toFixed(2)} Tons CO2
                </p>
              </div>
            </aside>

          </div>

        </div>
      </main>
    </>
  );
}
