import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { CreditCard, ShoppingBag, Utensils, Store, Smartphone, BarChart3, Globe } from 'lucide-react';

const IntegrationsPage: NextPage = () => {
  const partners = [
    { name: "NCR", icon: <BarChart3 className="h-8 w-8 text-blue-600" />, desc: "Global leader in consumer transaction technologies." },
    { name: "Revel", icon: <Smartphone className="h-8 w-8 text-blue-600" />, desc: "Cloud-based POS system for restaurants and retailers." },
    { name: "Lightspeed", icon: <ShoppingBag className="h-8 w-8 text-blue-600" />, desc: "Commerce platform for retail and hospitality businesses." },
    { name: "Square", icon: <CreditCard className="h-8 w-8 text-blue-600" />, desc: "Comprehensive suite of business tools and payment solutions." },
    { name: "Toast", icon: <Utensils className="h-8 w-8 text-blue-600" />, desc: "Built specifically for restaurants to streamline operations." },
    { name: "Shopline", icon: <Store className="h-8 w-8 text-blue-600" />, desc: "Global smart commerce platform for merchants." },
    { name: "Clover", icon: <Globe className="h-8 w-8 text-blue-600" />, desc: "Integrated point of sale systems for all business types." }
  ];

  return (
    <>
      <Head>
        <title>Global Business Integrations | Mawaba</title>
        <meta name="description" content="Integrate your business with top global tools like NCR, Square, Toast, and more." />
      </Head>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Global Business Assistance</h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              We connect your business with the world&apos;s leading commerce and point-of-sale platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="mb-4 bg-blue-50 w-16 h-16 flex items-center justify-center rounded-xl">
                  {partner.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{partner.name}</h3>
                <p className="text-gray-500 leading-relaxed">{partner.desc}</p>
                <button className="mt-6 text-blue-600 font-semibold flex items-center gap-2 hover:text-blue-700">
                  Connect Integration &rarr;
                </button>
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
