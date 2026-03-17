import React from 'react';
import { MENU_DATA } from '../constants/menuData';

interface SidebarProps {
  currentCategory: string;
  currentSub: string;
  onSubClick: (sub: string) => void;
}

export default function Sidebar({ currentCategory, currentSub, onSubClick }: SidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0">
      <h3 className="text-2xl font-bold text-gray-900 border-b-4 border-blue-700 pb-4 mb-6 uppercase tracking-tight">
        {currentCategory}
      </h3>
      <ul className="border-t">
        {MENU_DATA[currentCategory].map((sub) => (
          <li 
            key={sub}
            onClick={() => onSubClick(sub)}
            className={`group flex justify-between items-center p-4 border-b cursor-pointer transition-all ${
              currentSub === sub ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <span>{sub}</span>
            <span className={`text-xl ${currentSub === sub ? 'block' : 'hidden group-hover:block'}`}>›</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}