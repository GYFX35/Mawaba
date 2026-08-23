import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Globe, Check, Sparkles, MapPin, ChevronDown } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', dir: 'ltr' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' },
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export const LanguageTranslator: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<Language>(LANGUAGES[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const setGoogtransCookie = (langCode: string) => {
    const domain = window.location.hostname;
    const cookieValue = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain};`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
  };

  const detectLocationAndLanguage = useCallback(async () => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const browserLang = navigator.language || 'en';

      const res = await fetch(`/api/location/detect?timezone=${encodeURIComponent(timezone)}&lang=${encodeURIComponent(browserLang)}`, {
        headers: {
          'Accept-Language': navigator.languages ? navigator.languages.join(',') : browserLang,
          'x-timezone': timezone,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const code = data.language?.code || 'en';
        const matched = LANGUAGES.find((l) => l.code === code || l.code.startsWith(code.split('-')[0])) || LANGUAGES[0];

        setSelectedLang(matched);
        setIsAutoDetected(true);
        setDetectedLocation(data.detectedLocation?.countryName || null);

        // Store persistent state
        localStorage.setItem('mawaba_language', matched.code);
        localStorage.setItem('mawaba_language_auto', 'true');

        // Apply Google Translate cookie if not English
        if (matched.code !== 'en') {
          setGoogtransCookie(matched.code);
        }
      }
    } catch (e) {
      console.warn('Auto location language detection failed, defaulting to browser language', e);
      // Fallback to browser locale
      const browserLang = (navigator.language || 'en').split('-')[0];
      const matched = LANGUAGES.find((l) => l.code.startsWith(browserLang)) || LANGUAGES[0];
      setSelectedLang(matched);
    }
  }, []);

  // Initialize language & automatic location detection
  useEffect(() => {
    // 1. Check if user previously picked a language in localStorage
    const savedLangCode = localStorage.getItem('mawaba_language');
    const autoDetectedFlag = localStorage.getItem('mawaba_language_auto');

    if (savedLangCode) {
      const found = LANGUAGES.find((l) => l.code === savedLangCode || l.code.startsWith(savedLangCode));
      if (found) {
        setSelectedLang(found);
        if (autoDetectedFlag === 'true') {
          setIsAutoDetected(true);
        }
      }
    } else {
      // 2. Perform automatic language detection based on user location & locale
      detectLocationAndLanguage();
    }

    // 3. Load Google Translate script safely
    loadGoogleTranslateScript();

    // Close dropdown on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [detectLocationAndLanguage]);

  // Update HTML document dir attribute when language changes
  useEffect(() => {
    if (selectedLang.dir === 'rtl') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [selectedLang]);

  const loadGoogleTranslateScript = () => {
    if (document.getElementById('google-translate-script')) return;

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,fr,es,de,zh-CN,ja,ar,pt,sw,hi,ru',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  };


  const changeLanguage = (lang: Language) => {
    setSelectedLang(lang);
    setIsAutoDetected(false);
    setIsOpen(false);

    localStorage.setItem('mawaba_language', lang.code);
    localStorage.setItem('mawaba_language_auto', 'false');

    // Trigger Google Translate frame select if available
    setGoogtransCookie(lang.code);

    const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectEl) {
      selectEl.value = lang.code;
      selectEl.dispatchEvent(new Event('change'));
    } else {
      // Reload page to apply google translate cookie
      window.location.reload();
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Hidden element for Google Translate widget */}
      <div id="google_translate_element" className="hidden" />

      {/* Language Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-700 hover:text-blue-600 font-semibold text-xs transition-all shadow-sm focus:outline-none"
        title={`Change page language (Current: ${selectedLang.name})`}
        aria-expanded={isOpen}
      >
        <Globe className="h-4 w-4 text-blue-600" />
        <span className="text-base leading-none">{selectedLang.flag}</span>
        <span className="font-bold uppercase tracking-wider">{selectedLang.code.split('-')[0]}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <Globe className="h-3.5 w-3.5 text-blue-600" />
              <span>Global Page Language</span>
            </div>
            {isAutoDetected && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                <Sparkles className="h-3 w-3" /> Auto
              </span>
            )}
          </div>

          {/* Location Badge */}
          {detectedLocation && isAutoDetected && (
            <div className="mx-3 my-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100/80 flex items-center gap-2 text-[11px] text-blue-900">
              <MapPin className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
              <span>
                Detected location: <strong>{detectedLocation}</strong>
              </span>
            </div>
          )}

          {/* Languages List */}
          <div className="max-h-64 overflow-y-auto py-1">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLang.code === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang)}
                  className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-semibold">{lang.nativeName}</span>
                      <span className="text-[10px] text-gray-400">{lang.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                </button>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="px-4 pt-2 pb-1 border-t border-gray-100 text-[10px] text-gray-400 text-center">
            Automatic location translation enabled
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageTranslator;
