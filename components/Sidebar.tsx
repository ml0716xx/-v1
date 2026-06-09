
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  Battery, 
  Zap, 
  Settings2, 
  Bell, 
  RefreshCw, 
  BarChart3, 
  Leaf, 
  Activity, 
  Settings, 
  Cpu,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export type NavMenu = 'dashboard' | 'park' | 'station' | 'charging-overview' | 'charging-list' | 'device' | 'forecast-mechanism' | 'forecast-messages' | 'system-park' | 'system-station' | 'system-transformer' | 'system-charging' | string;

interface SidebarProps {
  activeMenu: NavMenu;
  onMenuChange: (menu: NavMenu) => void;
}

interface NavItem {
  id: string;
  icon: any;
  label: string;
  children?: { id: string; label: string }[];
}

const navItems: NavItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: '整体概览' },
  { id: 'park', icon: Globe, label: '绿算园区管理' },
  { 
    id: 'station', 
    icon: Battery, 
    label: '电站管理',
    children: [
      { id: 'station-stats', label: '数据统计' },
      { id: 'station-analysis', label: '电站分析' }
    ]
  },
  { 
    id: 'charging', 
    icon: Zap, 
    label: '充电场站管理',
    children: [
      { id: 'charging-overview', label: '充电站概览' },
      { id: 'charging-list', label: '场站列表' }
    ]
  },
  { id: 'device', icon: Settings2, label: '设备管理' },
  { 
    id: 'alert', 
    icon: Bell, 
    label: '告警管理',
    children: [
      { id: 'alert-fault', label: '故障报警' }
    ]
  },
  { id: 'dispatch', icon: RefreshCw, label: '算电调度' },
  { id: 'analytics', icon: BarChart3, label: '数据分析' },
  { id: 'carbon', icon: Leaf, label: '零碳管理' },
  { 
    id: 'forecast', 
    icon: Activity, 
    label: '预测管理',
    children: [
      { id: 'forecast-mechanism', label: '系统预警机制' },
      { id: 'forecast-messages', label: '预警信息管理' }
    ]
  },
  { 
    id: 'system', 
    icon: Settings, 
    label: '系统管理',
    children: [
      { id: 'system-auth', label: '权限管理' },
      { id: 'system-tenant', label: '租户管理' },
      { id: 'system-org', label: '组织管理' },
      { id: 'system-park', label: '用电园区管理' },
      { id: 'system-station', label: '电站管理' },
      { id: 'system-transformer', label: '园区主变管理' },
      { id: 'system-charging', label: '充电场站管理' }
    ]
  },
  { id: 'iot', icon: Cpu, label: '物联管理' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuChange }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['forecast', 'system', 'station', 'charging', 'alert']);

  const toggleExpand = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleParentClick = (item: NavItem) => {
    if (item.children) {
      toggleExpand(item.id);
    } else {
      onMenuChange(item.id);
    }
  };

  const isSubMenuActive = (item: NavItem) => {
    return item.children?.some(child => child.id === activeMenu);
  };

  return (
    <div className="w-64 bg-[#1e293b] text-slate-300 flex flex-col h-screen shrink-0 overflow-y-auto border-r border-slate-700">
      <div className="p-4 flex items-center gap-3 border-b border-slate-700">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">T</div>
        <span className="text-lg font-semibold text-white tracking-tight">智能微网</span>
      </div>
      
      <div className="flex-1 py-4">
        {navItems.map((item) => (
          <div key={item.id} className="mb-1">
            <div 
              onClick={() => handleParentClick(item)}
              className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all ${
                activeMenu === item.id || isSubMenuActive(item)
                  ? 'text-white bg-slate-800 mr-2 rounded-r-xl' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={activeMenu === item.id || isSubMenuActive(item) ? 'text-emerald-400' : 'opacity-70'} />
                <span className={`text-sm font-medium ${activeMenu === item.id || isSubMenuActive(item) ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              </div>
              {item.children && (
                expandedMenus.includes(item.id) ? <ChevronDown size={14} className="opacity-50" /> : <ChevronRight size={14} className="opacity-50" />
              )}
            </div>

            {item.children && expandedMenus.includes(item.id) && (
              <div className="mt-1 space-y-1">
                {item.children.map(child => (
                  <div 
                    key={child.id}
                    onClick={() => onMenuChange(child.id)}
                    className={`flex items-center pl-11 pr-4 py-2 cursor-pointer transition-all text-sm font-medium ${
                      activeMenu === child.id 
                        ? 'text-white bg-[#10b981] rounded-r-xl mr-4 shadow-lg shadow-emerald-500/10' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {child.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-700 mt-auto">
        <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-slate-800/50">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">PRO</div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white truncate">Premium Account</span>
            <span className="text-[10px] text-slate-500 truncate text-emerald-400">系统运行正常</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
