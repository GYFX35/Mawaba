import React from 'react';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, BookOpen, Atom, Briefcase, Users, Radio } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Home' },
  { icon: Radio, label: 'Podcasts' },
  { icon: PlaySquare, label: 'Videos' },
  { icon: Compass, label: 'Shorts' },
];

const disciplines = [
  { icon: Atom, label: 'Sciences' },
  { icon: BookOpen, label: 'Literature' },
  { icon: Briefcase, label: 'Business' },
  { icon: Users, label: 'Mentorship' },
];

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 bottom-0 border-r border-gray-200 p-4 gap-6 overflow-y-auto bg-white">
      <div className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <button key={item.label} className="flex items-center gap-4 px-3 py-2.5 hover:bg-gray-100 rounded-xl text-gray-700 transition-colors">
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      <hr className="border-gray-100" />
      <div className="flex flex-col gap-1">
        <h4 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Disciplines</h4>
        {disciplines.map((item) => (
          <button key={item.label} className="flex items-center gap-4 px-3 py-2.5 hover:bg-gray-100 rounded-xl text-gray-700 transition-colors">
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
