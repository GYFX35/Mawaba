import React, { useState } from 'react';
import Link from 'next/link';
import { Cpu, Mail, Globe, Info, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Brand & Newsletter Column */}
          <div className="col-span-1 md:col-span-2 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-2 rounded-xl shadow-md">
                <Cpu className="h-5 w-5" />
              </div>
              <span className="text-xl font-black text-white tracking-wider">MAWABA</span>
              <span className="bg-blue-900/60 text-blue-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-700/50">
                v1.3.0
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An advanced global communication and interaction platform integrated with cutting-edge AI tutors, sustainable agribusiness, investor networks, and real-time DTC point-of-sale systems.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2 max-w-sm">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 block mb-2">
                Subscribe to Global Impact Updates
              </span>
              {subscribed ? (
                <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-xl p-3 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Subscribed! You will receive our monthly innovation briefs.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1"
                  >
                    <span>Join</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}
            </div>

            <div className="flex space-x-4 pt-2 text-slate-500">
              <Mail className="h-4 w-4 hover:text-white cursor-pointer transition-colors" />
              <Globe className="h-4 w-4 hover:text-white cursor-pointer transition-colors" />
              <Info className="h-4 w-4 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Impact Initiatives Column */}
          <div>
            <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-widest mb-4">Impact Initiatives</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/health" className="hover:text-white transition-colors">Global Health SDG 3</Link></li>
              <li><Link href="/culture" className="hover:text-white transition-colors">Culture & Traditions</Link></li>
              <li><Link href="/climate" className="hover:text-white transition-colors">Climate Solutions</Link></li>
              <li><Link href="/agriculture" className="hover:text-white transition-colors">Sustainable Agriculture</Link></li>
              <li><Link href="/environment" className="hover:text-white transition-colors">Environment Protection</Link></li>
              <li><Link href="/worldbank" className="hover:text-white transition-colors">World Bank Data</Link></li>
            </ul>
          </div>

          {/* Platform & Media Column */}
          <div>
            <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-widest mb-4">Platform & Media</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/videos" className="hover:text-white transition-colors">Videos Entertainment Hub</Link></li>
              <li><Link href="/games" className="hover:text-white transition-colors">Gaming Arcade & Split</Link></li>
              <li><Link href="/education" className="hover:text-white transition-colors">AI Education & Tutor</Link></li>
              <li><Link href="/chat" className="hover:text-white transition-colors">Global Chat & Forum</Link></li>
              <li><Link href="/dtc" className="hover:text-white transition-colors">DTC E-Commerce Store</Link></li>
              <li><Link href="/investors" className="hover:text-white transition-colors">Investors & VCs</Link></li>
            </ul>
          </div>

          {/* Developers & Sponsorship Column */}
          <div>
            <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-widest mb-4">Developers & Partners</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/sponsor" className="text-pink-400 hover:text-pink-300 transition-colors font-bold flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-pink-400 fill-pink-400/20" /> Sponsorship & Hall
                </Link>
              </li>
              <li><Link href="/api-docs" className="hover:text-white transition-colors">Developer Portal & APIs</Link></li>
              <li><Link href="/integrations" className="hover:text-white transition-colors">Workspace Integrations</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About & Governance</Link></li>
              <li><Link href="/license" className="hover:text-white transition-colors">MIT License</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} Mawaba Inc. All rights reserved. Empowering global creators and innovators.
          </p>
          <div className="flex items-center gap-2 text-slate-500">
            <span>Made with ❤️ for a unified global community</span>
            <span className="text-slate-700">•</span>
            <span className="text-blue-400 font-bold">Release v1.3.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
