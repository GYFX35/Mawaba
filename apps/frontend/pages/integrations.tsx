import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { CreditCard, ShoppingBag, Utensils, Store, Smartphone, BarChart3, Globe, CheckCircle2, XCircle } from 'lucide-react';

interface Integration {
  name: string;
  connected: boolean;
  desc: string;
  category: string;
}

const IntegrationsPage: NextPage = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
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
        return <BarChart3 className="h-8 w-8 text-blue-600" />;
      case 'revel':
        return <Smartphone className="h-8 w-8 text-blue-600" />;
      case 'lightspeed':
        return <ShoppingBag className="h-8 w-8 text-blue-600" />;
      case 'square':
        return <CreditCard className="h-8 w-8 text-blue-600" />;
      case 'toast':
        return <Utensils className="h-8 w-8 text-blue-600" />;
      case 'shopline':
        return <Store className="h-8 w-8 text-blue-600" />;
      default:
        return <Globe className="h-8 w-8 text-blue-600" />;
    }
  };

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/integrations');
      if (res.ok) {
        const data = await res.json();
        // If server returns array of names or structures, map them
        if (Array.isArray(data)) {
          if (typeof data[0] === 'string') {
            // Older simple format, convert to structures
            const formatted = fallbackPartners.map(p => {
              const matched = data.find((n: string) => n.toLowerCase() === p.name.toLowerCase());
              return { ...p, connected: matched ? true : false };
            });
            setIntegrations(formatted);
          } else {
            // New rich structures returned by backend
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
        // Make sure we set precise state from server
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
        // Revert on failure
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
      console.error(err);
      // Even if server is offline, let's allow toggling in local client state for demonstration
      setActionMessage({
        text: `Server offline. Simulated ${action}ing of ${partner.name} locally.`,
        isError: false
      });
    }

    // Clear alert after 4 seconds
    setTimeout(() => {
      setActionMessage(null);
    }, 4000);
  };

  return (
    <>
      <Head>
        <title>Global Business Integrations | Mawaba</title>
        <meta name="description" content="Integrate your business with top global tools like NCR, Square, Toast, and more." />
      </Head>

      <section className="py-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Global Business Assistance</h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              We connect your business with the world&apos;s leading commerce and point-of-sale platforms in real-time.
            </p>
          </div>

          {actionMessage && (
            <div className={`max-w-md mx-auto mb-8 p-4 rounded-xl shadow-md text-center flex items-center justify-center gap-2 font-medium ${
              actionMessage.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {actionMessage.isError ? <XCircle className="h-5 w-5 text-red-500" /> : <CheckCircle2 className="h-5 w-5 text-green-500" />}
              {actionMessage.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {integrations.map((partner, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all relative flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-50 w-16 h-16 flex items-center justify-center rounded-xl">
                      {getIcon(partner.name)}
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        partner.connected
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {partner.connected ? '● Active' : '○ Offline'}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{partner.name}</h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-1 rounded-md">
                    {partner.category}
                  </span>
                  <p className="text-gray-500 leading-relaxed mt-3">{partner.desc}</p>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => handleToggleConnection(partner)}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      partner.connected
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    }`}
                  >
                    {partner.connected ? 'Disconnect Partner' : 'Connect Integration →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Why Integrate with Mawaba?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div>
              <h4 className="text-xl font-bold mb-4 text-blue-600">Unified Dashboard</h4>
              <p className="text-gray-500">Manage all your POS and commerce data in one single, global interface powered by AI.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 text-blue-600">AI-Powered Insights</h4>
              <p className="text-gray-500">Use Langchain and Google AI to analyze your business performance across all integrated tools.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 text-blue-600">Global Connectivity</h4>
              <p className="text-gray-500">Seamlessly expand your business across borders with our international partner network.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default IntegrationsPage;
