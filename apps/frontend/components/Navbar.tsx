import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Cpu, User, LogOut } from 'lucide-react';
import LanguageTranslator from './LanguageTranslator';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('mawaba_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user');
      }
    }
  }, [router.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('mawaba_user');
    setCurrentUser(null);
    router.push('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Gaming Hub', href: '/games' },
    { name: 'Culture', href: '/culture' },
    { name: 'Climate Solutions', href: '/climate' },
    { name: 'Education', href: '/education' },
    { name: 'Chat & Forum', href: '/chat' },
    { name: 'Environment', href: '/environment' },
    { name: 'DTC Tools', href: '/dtc' },
    { name: 'Services', href: '/services' },
    { name: 'Integrations', href: '/integrations' },
    { name: 'World Bank', href: '/worldbank' },
    { name: 'Developer API', href: '/api-docs' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2.5 group">
              <div className="bg-blue-600 text-white p-1.5 rounded-xl transition-transform group-hover:scale-105 duration-300 shadow-md shadow-blue-200">
                <Cpu className="h-5 w-5" />
              </div>
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                MAWABA
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/70'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pl-4 flex items-center gap-2.5">
              <LanguageTranslator />
              {currentUser ? (
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-700 p-1 rounded-lg">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-gray-800 max-w-[120px] truncate">{currentUser.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3.5 py-2 text-sm font-bold text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-100 hover:shadow-lg hover:shadow-blue-200 transform hover:-translate-y-0.5 inline-block"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageTranslator />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-gray-950 hover:bg-gray-100 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-in fade-in duration-200">
          <div className="px-3 pt-2 pb-4 space-y-1 sm:px-4">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2.5 rounded-xl text-base font-bold transition-all ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/70'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="mt-4 px-3 pb-2 border-t border-gray-100 pt-3">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800 px-3 py-2 bg-gray-50 rounded-xl">
                    <User className="h-4 w-4 text-blue-600" />
                    <span>Signed in as {currentUser.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2.5 rounded-xl text-center font-bold text-sm hover:bg-red-100 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    className="w-full border border-gray-200 text-gray-800 py-2.5 rounded-xl text-center font-bold text-sm hover:bg-gray-50 transition-all inline-block"
                    onClick={() => setIsOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-center font-bold text-sm transition-all shadow-md inline-block"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
