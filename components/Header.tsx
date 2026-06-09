
import React from 'react';
import { Bell, User, Monitor as ScreenIcon, BookOpen, RefreshCw, ChevronDown } from 'lucide-react';
import { SITES } from '../data';

interface HeaderProps {
  currentSiteId: string;
  onSiteChange: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentSiteId, onSiteChange }) => {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-slate-500 text-sm">
          <span>绿算园区管理</span>
          <span className="mx-1">/</span>
          <span className="text-gray-900 font-medium">设备管理</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded border border-emerald-100 whitespace-nowrap">
              绿算园区
            </span>
            <div className="relative">
              <select 
                className="appearance-none bg-slate-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full py-1.5 pl-3 pr-8 min-w-[140px] hover:bg-white transition-colors cursor-pointer"
                value={currentSiteId}
                onChange={(e) => onSiteChange(e.target.value)}
              >
                {SITES.map(site => (
                  <option key={site.id} value={site.id}>{site.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
          <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="h-6 w-[1px] bg-gray-200"></div>

        <div className="flex items-center gap-5 text-gray-500">
          <ScreenIcon size={18} className="cursor-pointer hover:text-emerald-500 transition-colors" />
          <BookOpen size={18} className="cursor-pointer hover:text-emerald-500 transition-colors" />
          <div className="relative">
            <Bell size={18} className="cursor-pointer hover:text-emerald-500 transition-colors" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">3</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900 group">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">易</div>
            <span className="text-sm font-medium">易立</span>
            <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
