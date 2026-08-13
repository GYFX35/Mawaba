import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { CreditCard, ShoppingBag, Utensils, Store, Smartphone, BarChart3, Globe, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';

interface Integration {
  name: string;
  connected: boolean;
  desc: string;
  category: string;
}

const IntegrationsPage: NextPage = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [actionMessage, setActionMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Fallback initial state if backend cannot be reached
  const fallbackPartners: Integration[] = [
    { name: "NCR", connected: false, desc: "Global leader in consumer transaction technologies.", category: "Payments" },
    { name: "Revel", connected: true, desc: "Cloud-based POS system for restaurants and retailers.", category: "POS" },
    { name: "Lightspeed", connected: false, desc: "Commerce platform for retail and hospitality businesses.", category: "E-commerce" },
    { name: "Square", connected: false, desc: "Comprehensive suite of business tools and payment solutions.", category: "Payments" },
    { name: "Toast", connected: true, desc: "Built specifically for restaurants to streamline operations.", category: "POS" },
    { name: "Shopline", connected: false, desc: "Global smart commerce platform for merchants.", category: "E-commerce" },
    { name: "Clover", connected: false, desc: "Integrated point of sale systems for all business types.", category: "POS" }
  ];

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'ncr':
        return <BarChart3 className="h-6 w-6 text-blue-600" />;
      case 'revel':
        return <Smartphone className="h-6 w-6 text-blue-600" />;
      case 'lightspeed':
        return <ShoppingBag className="h-6 w-6 text-blue-600" />;
      case 'square':
        return <CreditCard className="h-6 w-6 text-blue-600" />;
      case 'toast':
        return <Utensils className="h-6 w-6 text-blue-600" />;
      case 'shopline':
        return <Store className="h-6 w-6 text-blue-600" />;
      default:
        return <Globe className="h-6 w-6 text-blue-600" />;
    }
  };

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/integrations');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          if (typeof data[0] === 'string') {
            const formatted = fallbackPartners.map(p => {
              const matched = data.find((n: string) => n.toLowerCase() === p.name.toLowerCase());
              return { ...p, connected: matched ? true : false };
            });
            setIntegrations(formatted);
          } else {
            setIntegrations(data);
          }
        } else {
          setIntegrations(fallbackPartners);
        }
      } else {
        setIntegrations(fallbackPartners);
      }
    } catch (err) {
      console.warn("Could not load integrations from API backend, using client-side fallback store.", err);
      setIntegrations(fallbackPartners);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleToggleConnection = async (partner: Integration) => {
    const action = partner.connected ? 'disconnect' : 'connect';
    const originalConnected = partner.connected;

    // Optimistically update UI
    setIntegrations(prev =>
      prev.map(item =>
        item.name.toLowerCase() === partner.name.toLowerCase()
          ? { ...item, connected: !originalConnected }
          : item
      )
    );

    try {
      const res = await fetch(`http://localhost:3001/api/integrations/${partner.name}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({
          text: `Successfully ${action}ed ${partner.name}!`,
          isError: false
        });
        if (data.integration) {
          setIntegrations(prev =>
            prev.map(item =>
              item.name.toLowerCase() === partner.name.toLowerCase()
                ? data.integration
                : item
            )
          );
        }
      } else {
        setIntegrations(prev =>
          prev.map(item =>
            item.name.toLowerCase() === partner.name.toLowerCase()
              ? { ...item, connected: originalConnected }
              : item
          )
        );
        setActionMessage({
          text: data.message || `Failed to ${action} ${partner.name}.`,
          isError: true
        });
      }
    } catch (err) {
      setActionMessage({
        text: `Offline simulated connection of ${partner.name}.`,
        isError: false
      });
    }

    setTimeout(() => {
      setActionMessage(null);
    }, 4000);
  };

  // Filter and Search Logic
  const filteredIntegrations = integrations.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'POS', 'Payments', 'E-commerce'];

  return (
    <>
      <Head>
        <title>Global Business Integrations | Mawaba</title>
        <meta name="description" content="Integrate your business with top global tools like NCR, Square, Toast, and more." />
      </Head>

      <section className="py-20 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              🛠️ Business Integrations Hub
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 tracking-tight leading-none">
              Global Business Assistance
            </h1>
            <p className="text-lg text-slate-500 mt-4 leading-relaxed">
              Seamlessly connect, sync, and control your point-of-sale (POS) and global payment pipelines from a single unified API dashboard.
            </p>
          </div>

          {actionMessage && (
            <div className={`max-w-md mx-auto mb-10 p-4 rounded-2xl shadow-lg text-center flex items-center justify-center gap-2 font-semibold text-xs border animate-bounce ${
              actionMessage.isError ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'
            }`}>
              {actionMessage.isError ? <XCircle className="h-4 w-4 text-red-500" /> : <CheckCircle2 className="h-4 w-4 text-green-500" />}
              {actionMessage.text}
            </div>
          )}

          {/* Search and Filters bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm max-w-5xl mx-auto mb-12 flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-100 bg-slate-50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              <span className="text-xs text-slate-400 font-bold mr-2 hidden lg:inline-block">Filter By:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredIntegrations.map((partner, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-blue-50 p-3.5 flex items-center justify-center rounded-2xl group-hover:scale-105 duration-300 transition-transform">
                      {getIcon(partner.name)}
                    </div>
                    <div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${
                        partner.connected
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-slate-50 text-slate-500 border border-slate-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${partner.connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                        {partner.connected ? 'Active' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 leading-none">{partner.name}</h3>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {partner.category}
                  </span>
                  <p className="text-slate-500 text-sm leading-relaxed mt-4">{partner.desc}</p>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-50">
                  <button
                    onClick={() => handleToggleConnection(partner)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 ${
                      partner.connected
                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    }`}
                  >
                    {partner.connected ? 'Disconnect Partner' : 'Connect Integration'}
                  </button>
                </div>
              </div>
            ))}

            {filteredIntegrations.length === 0 && (
              <div className="col-span-full border-2 border-dashed border-slate-200 rounded-3xl py-16 text-center">
                <p className="text-slate-400 text-sm italic">No integrations match your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Integration Benefits */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-16">Why Integrate with Mawaba?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left max-w-5xl mx-auto">
            <div className="space-y-3">
              <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 font-bold mb-4">01</div>
              <h4 className="text-xl font-bold text-slate-900">Unified Dashboard</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Manage all your POS and commerce data in one single, global interface powered by AI.</p>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 font-bold mb-4">02</div>
              <h4 className="text-xl font-bold text-slate-900">AI-Powered Insights</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Use Langchain and Google AI to analyze your business performance across all integrated tools.</p>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 font-bold mb-4">03</div>
              <h4 className="text-xl font-bold text-slate-900">Global Connectivity</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Seamlessly expand your business across borders with our international partner network.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default IntegrationsPage;
