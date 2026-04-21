import Link from 'next/link';
import { Cpu, Mail, Globe, Info } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">MAWABA</span>
            </div>
            <p className="text-gray-500 max-w-xs mb-4">
              Global interaction and communication platform integrated with AI for business, education, and development ideas.
            </p>
            <div className="flex space-x-4">
              <Mail className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <Globe className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <Info className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-500 hover:text-blue-600">About Us</Link></li>
              <li><Link href="/services" className="text-gray-500 hover:text-blue-600">Services</Link></li>
              <li><Link href="/forums" className="text-gray-500 hover:text-blue-600">Forums</Link></li>
              <li><Link href="/chat" className="text-gray-500 hover:text-blue-600">Chat</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-500 hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-500 hover:text-blue-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 flex justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Mawaba. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-400">
             <span>Made for a better world</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
