"use client";
import React, { useState } from 'react';
import { MENU_DATA } from '../constants/menuData';

export default function Navbar({ onMenuClick }: { onMenuClick: (menu: string, sub: string) => void }) {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  return (
    <nav className="bg-[#2b59c3] text-white relative">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <div className="text-2xl font-bold cursor-pointer tracking-tighter">BnC Blower</div>
        <ul className="flex h-full">
          {Object.keys(MENU_DATA).map((menu) => (
            <li 
              key={menu}
              className="relative group h-full flex items-center cursor-pointer px-6 hover:bg-[#1e44a5]"
              onMouseEnter={() => setHoveredMenu(menu)}
              onMouseLeave={() => setHoveredMenu(null)}
              onClick={() => onMenuClick(menu, MENU_DATA[menu][0])}
            >
              <span className="font-medium">{menu}</span>
              {hoveredMenu === menu && (
                <div className="absolute top-16 left-0 min-w-[200px] bg-white text-gray-800 shadow-2xl z-50 border py-2">
                  {MENU_DATA[menu].map(sub => (
                    <div 
                      key={sub} 
                      className="px-6 py-2 hover:bg-gray-100 hover:text-blue-700 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMenuClick(menu, sub);
                      }}
                    >
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="hidden md:flex space-x-4 text-xs opacity-80">
          <span>HOME</span> | <span>A/S 접수</span>
        </div>
      </div>
    </nav>
  );
}