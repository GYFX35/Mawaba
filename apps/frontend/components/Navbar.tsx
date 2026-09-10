import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Menu,
  X,
  Cpu,
  User,
  LogOut,
  ChevronDown,
  Globe,
  Sparkles,
  Heart,
  Leaf,
  Briefcase,
  BookOpen,
  MessageSquare,
  Gamepad2,
  Video,
  ShieldCheck,
  Building2,
  DollarSign,
  Code
} from 'lucide-react';
import LanguageTranslator from './LanguageTranslator';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'impact' | 'ecosystem' | null>(null);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mawaba_user');
    setCurrentUser(null);
    router.push('/');
  };

  const primaryNav = [
    { name: 'Home', href: '/', icon: Cpu },
    { name: 'Videos', href: '/videos', icon: Video },
    { name: 'Gaming', href: '/games', icon: Gamepad2 },
    { name: 'Education', href: '/education', icon: BookOpen },
    { name: 'Chat & Forum', href: '/chat', icon: MessageSquare },
    { name: 'Agriculture', href: '/agriculture', icon: Leaf },
  ];

  const impactLinks = [
    { name: 'Global Health', href: '/health', icon: Heart, desc: 'Biometric assessments & UN SDG 3 health tips' },
    { name: 'Culture & Traditions', href: '/culture', icon: Globe, desc: 'Ancestral heritage archive & publications' },
    { name: 'Climate Solutions', href: '/climate', icon: Sparkles, desc: 'CO2 calculator & clean tech initiatives' },
    { name: 'Environment Protection', href: '/environment', icon: ShieldCheck, desc: 'Eco-pledges & UN SDG environmental goals' },
    { name: 'World Bank Data', href: '/worldbank', icon: Building2, desc: 'Global development projects & country indicators' },
  ];

  const ecosystemLinks = [
    { name: 'Investors & VCs', href: '/investors', icon: DollarSign, desc: 'Pitch proposals & venture capital directory' },
    { name: 'DTC E-Commerce', href: '/dtc', icon: Briefcase, desc: 'Sustainable product store & checkout' },
    { name: 'Platform Services', href: '/services', icon: Briefcase, desc: 'Commercial services & business integration' },
    { name: 'Sponsorship', href: '/sponsor', icon: Heart, desc: 'Hall of Fame & custom funding tiers' },
    { name: 'Integrations', href: '/integrations', icon: Cpu, desc: 'Workspace connectors & partner APIs' },
    { name: 'Developer API', href: '/api-docs', icon: Code, desc: 'Interactive API docs & code playground' },
    { name: 'About Mawaba', href: '/about', icon: Globe, desc: 'Mission, governance, and release notes' },
    { name: 'Contact Us', href: '/contact', icon: MessageSquare, desc: 'Global support & partner inquiries' },
  ];

  const isImpactActive = impactLinks.some(l => router.pathname === l.href);
  const isEcosystemActive = ecosystemLinks.some(l => router.pathname === l.href);

  return (
    <header className="sticky top-0 z-50" ref={navRef}>
      <nav aria-label="Main Navigation" className="bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">

            {/* Brand Logo & Tag */}
            <div className="flex items-center gap-3">
              <Link href="/" aria-label="Mawaba Home" className="flex-shrink-0 flex items-center gap-2.5 group">
                <div className="bg-gradient-to-tr from-blue-700 to-indigo-600 text-white p-2 rounded-xl transition-transform group-hover:scale-105 duration-300 shadow-md shadow-blue-200">
                  <Cpu className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 via-blue-950 to-blue-700 bg-clip-text text-transparent">
                    MAWABA
                  </span>
                </div>
              </Link>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                v1.3.0
              </span>
            </div>

            {/* Desktop Main Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {primaryNav.map((link) => {
                const isActive = router.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 text-xs font-extrabold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50/70 border border-blue-100 shadow-xs'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Dropdown: Impact Hubs */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'impact' ? null : 'impact')}
                  className={`px-3 py-2 text-xs font-extrabold rounded-xl transition-all duration-200 flex items-center gap-1 ${
                    isImpactActive || activeDropdown === 'impact'
                      ? 'text-blue-600 bg-blue-50/70 border border-blue-100'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span>Impact Hubs</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === 'impact' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'impact' && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400">
                      Global Development Hubs
                    </div>
                    {impactLinks.map((item) => {
                      const Icon = item.icon;
                      const isActive = router.pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                            isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-800'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold">{item.name}</div>
                            <div className="text-[10px] text-gray-400 line-clamp-1">{item.desc}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dropdown: Ecosystem & Tools */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'ecosystem' ? null : 'ecosystem')}
                  className={`px-3 py-2 text-xs font-extrabold rounded-xl transition-all duration-200 flex items-center gap-1 ${
                    isEcosystemActive || activeDropdown === 'ecosystem'
                      ? 'text-blue-600 bg-blue-50/70 border border-blue-100'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span>Ecosystem</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === 'ecosystem' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'ecosystem' && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-2.5 grid grid-cols-1 gap-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400">
                      Platform Tools & Services
                    </div>
                    {ecosystemLinks.map((item) => {
                      const Icon = item.icon;
                      const isActive = router.pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                            isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-800'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold">{item.name}</div>
                            <div className="text-[10px] text-gray-400 line-clamp-1">{item.desc}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Right Controls: Translator & User Account */}
            <div className="hidden lg:flex items-center gap-2.5">
              <LanguageTranslator />
              {currentUser ? (
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                  <div className="bg-blue-600 text-white p-1 rounded-lg">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-gray-800 max-w-[100px] truncate">{currentUser.name}</span>
                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3 py-2 text-xs font-extrabold text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-blue-100 hover:shadow-lg inline-block"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <LanguageTranslator />
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close main menu" : "Open main menu"}
                aria-expanded={isOpen}
                className="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 hover:text-gray-950 hover:bg-gray-100 transition-colors focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Slide-Out Drawer */}
        {isOpen && (
          <div className="lg:hidden bg-white border-b border-gray-100 max-h-[85vh] overflow-y-auto animate-in fade-in duration-200 shadow-xl">
            <div className="px-4 pt-3 pb-6 space-y-4">

              {/* Main App Links */}
              <div>
                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-400">Core Applications</div>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {primaryNav.map((link) => {
                    const isActive = router.pathname === link.href;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                          isActive
                            ? 'text-blue-600 bg-blue-50 border border-blue-100'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Impact Initiatives */}
              <div>
                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-400">Impact Initiatives</div>
                <div className="grid grid-cols-1 gap-1 mt-1">
                  {impactLinks.map((link) => {
                    const isActive = router.pathname === link.href;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                          isActive
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <span>{link.name}</span>
                        <span className="text-[10px] text-gray-400 font-normal">{link.desc}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Ecosystem & Services */}
              <div>
                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-400">Ecosystem & Tools</div>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {ecosystemLinks.map((link) => {
                    const isActive = router.pathname === link.href;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* User Session */}
              <div className="border-t border-gray-100 pt-3">
                {currentUser ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800 px-3 py-2 bg-gray-50 rounded-xl">
                      <User className="h-4 w-4 text-blue-600" />
                      <span>Signed in as {currentUser.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2.5 rounded-xl text-center font-bold text-xs hover:bg-red-100 transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      className="w-full border border-gray-200 text-gray-800 py-2.5 rounded-xl text-center font-bold text-xs hover:bg-gray-50 transition-all inline-block"
                      onClick={() => setIsOpen(false)}
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-center font-bold text-xs transition-all shadow-md inline-block"
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
    </header>
  );
};

export default Navbar;
