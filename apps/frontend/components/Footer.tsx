import Link from 'next/link';
import { Cpu, Mail, Globe, Info } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-600 text-white p-1.5 rounded-xl">
                <Cpu className="h-5 w-5" />
              </div>
              <span className="text-xl font-black text-white tracking-wider">MAWABA</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              An advanced global communication and interaction platform integrated with cutting-edge AI tutors, business development modules, and real-time commerce point-of-sale systems.
            </p>
            <div className="flex space-x-4 pt-2">
              <Mail className="h-5 w-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
              <Globe className="h-5 w-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
              <Info className="h-5 w-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Platform</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/climate" className="hover:text-white transition-colors">Climate Solutions</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">What We Offer</Link></li>
              <li><Link href="/education" className="hover:text-white transition-colors">Global Education</Link></li>
              <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              <li><Link href="/api-docs" className="hover:text-white transition-colors">Developer Portal</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/license" className="hover:text-white transition-colors">MIT License</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} Mawaba Inc. All rights reserved. Empowering global innovators.
          </p>
          <div className="flex items-center gap-1.5 text-slate-500">
             <span>Made with ❤️ for a better, more unified world</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
