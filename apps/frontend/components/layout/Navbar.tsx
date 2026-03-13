import React from 'react';
import { Search, Bell, User, Menu, Play, Mic, Video } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 h-16 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full lg:hidden">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <Play className="w-6 h-6 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">Mawaba Learn</span>
        </div>
      </div>

      <div className="hidden md:flex flex-1 max-w-2xl mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for sciences, literature, business..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-full outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Video className="w-6 h-6 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell className="w-6 h-6 text-gray-600" />
        </button>
        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold ml-2 cursor-pointer">
          JD
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
