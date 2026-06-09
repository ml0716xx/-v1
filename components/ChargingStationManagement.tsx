
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  RotateCcw, 
  LayoutGrid, 
  List as ListIcon, 
  Map as MapIcon, 
  ChevronRight, 
  ExternalLink, 
  MapPin,
  Zap,
  Battery,
  ChevronDown,
  X,
  Activity,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { CHARGING_STATIONS } from '../data';
import { ChargingStation, StationStatus } from '../types';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const mockPowerData = Array.from({ length: 12 }, (_, i) => ({
  time: `${i * 2}:00`,
  load: Math.floor(Math.random() * 80) + 20,
}));

const StationDetailModal: React.FC<{ station: ChargingStation; onClose: () => void }> = ({ station, onClose }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{station.name}</h3>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                <MapPin size={12} />
                <span>{station.address}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">终端总数</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{station.chargerCount} <span className="text-xs font-normal">把</span></div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">装机功率</span>
              <div className="text-2xl font-black text-blue-700 mt-1">{station.totalPower} <span className="text-xs font-normal">kW</span></div>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">今日营收</span>
              <div className="text-2xl font-black text-amber-700 mt-1">¥ 1,280</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Activity size={16} className="text-emerald-500" />
                负荷趋势 (今日)
              </h4>
              <div className="h-64 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockPowerData}>
                    <defs>
                      <linearGradient id="detailPower" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="time" fontSize={10} stroke="#94a3b8" />
                    <YAxis fontSize={10} stroke="#94a3b8" />
                    <Tooltip />
                    <Area type="monotone" dataKey="load" stroke="#10b981" fillOpacity={1} fill="url(#detailPower)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-500" />
                充电桩状态分布
              </h4>
              <div className="space-y-3">
                {[
                  { label: '正在充电', count: 14, color: 'bg-emerald-500', percent: 60 },
                  { label: '空闲中', count: 8, color: 'bg-blue-400', percent: 30 },
                  { label: '离线/维护', count: 2, color: 'bg-slate-300', percent: 10 }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-600">{item.label}</span>
                      <span className="text-sm font-bold text-slate-800">{item.count}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-slate-50">
          <button onClick={onClose} className="px-6 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">
            关闭
          </button>
          <button className="px-6 py-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-lg shadow-emerald-500/20 transition-all">
            下载监控报告
          </button>
        </div>
      </div>
    </div>
  );
};

const ChargingStationManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'card' | 'map'>('list');
  const [searchParams, setSearchParams] = useState({ name: '', status: '全部' });
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [focusedStationId, setFocusedStationId] = useState<string | null>(null);

  const filteredStations = useMemo(() => {
    return CHARGING_STATIONS.filter(s => {
      const matchName = s.name.toLowerCase().includes(searchParams.name.toLowerCase());
      const matchStatus = searchParams.status === '全部' || s.status === searchParams.status;
      return matchName && matchStatus;
    });
  }, [searchParams]);

  const handleReset = () => {
    setSearchParams({ name: '', status: '全部' });
  };

  const handleLocate = (stationId: string) => {
    setViewMode('map');
    setFocusedStationId(stationId);
  };

  const getStatusConfig = (status: StationStatus) => {
    switch (status) {
      case 'active': return { label: '运行中', color: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'construction': return { label: '建设中', color: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
      case 'fault': return { label: '有故障', color: 'bg-rose-500', text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' };
      default: return { label: '未知', color: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' };
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 px-1">
        <span>充电场站管理</span>
        <span className="opacity-50">/</span>
        <span className="text-emerald-600 font-semibold">场站列表</span>
      </div>

      {/* Query Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-6">
        <div className="flex flex-col gap-2 flex-1 min-w-[240px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">场站名称</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索场站名称或地址..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              value={searchParams.name}
              onChange={(e) => setSearchParams(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 min-w-[160px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">运营状态</label>
          <div className="relative">
            <select 
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              value={searchParams.status}
              onChange={(e) => setSearchParams(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="全部">全部状态</option>
              <option value="active">运行中</option>
              <option value="construction">建设中</option>
              <option value="fault">有故障</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
            <Search size={18} />
            查询
          </button>
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95"
          >
            <RotateCcw size={18} />
            重置
          </button>
        </div>
      </div>

      {/* Toolbar & View Switch */}
      <div className="flex justify-between items-center bg-white px-5 py-3 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 font-medium">共找到 {filteredStations.length} 个充电场站</span>
        </div>
        
        <div className="flex items-center p-1 bg-gray-100 rounded-xl">
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <ListIcon size={16} />
            列表
          </button>
          <button 
            onClick={() => setViewMode('card')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'card' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LayoutGrid size={16} />
            卡片
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <MapIcon size={16} />
            地图
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {viewMode === 'list' && (
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">场站名称</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">枪数 / 功率</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">详细地址</th>
                  <th className="text-center px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStations.map(station => {
                  const config = getStatusConfig(station.status);
                  return (
                    <tr key={station.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-800">{station.name}</span>
                          <span className="text-[10px] text-gray-400 font-mono">ID: {station.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${config.bg} ${config.text} ${config.border}`}>
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-700 font-medium">{station.chargerCount} 把枪</span>
                          <span className="text-xs text-gray-400">{station.totalPower} kW</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{station.address}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-4">
                          <button 
                            onClick={() => setSelectedStation(station)}
                            className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs flex items-center gap-1 transition-colors"
                          >
                            <ChevronRight size={14} /> 详情
                          </button>
                          <button 
                            onClick={() => handleLocate(station.id)}
                            className="text-blue-600 hover:text-blue-700 font-semibold text-xs flex items-center gap-1 transition-colors"
                          >
                            <MapPin size={14} /> 定位
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStations.map(station => {
              const config = getStatusConfig(station.status);
              return (
                <div key={station.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl transition-all group flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                      <Zap size={24} />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${config.bg} ${config.text} ${config.border}`}>
                      {config.label}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{station.name}</h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <MapPin size={12} />
                      <span className="truncate">{station.address}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">终端规模</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-gray-800">{station.chargerCount}</span>
                        <span className="text-xs text-gray-400">把枪</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">总功率</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-gray-800">{station.totalPower}</span>
                        <span className="text-xs text-gray-400">kW</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                    <button 
                      onClick={() => handleLocate(station.id)}
                      className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 transition-colors"
                    >
                      <MapPin size={14} /> 查看位置
                    </button>
                    <button 
                      onClick={() => setSelectedStation(station)}
                      className="text-emerald-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      管理详情 <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === 'map' && (
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm h-[600px] relative">
            <div className="absolute inset-0 bg-[#f1f5f9] flex items-center justify-center">
               <div className="relative w-full h-full p-8 overflow-hidden">
                  <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
                  
                  {filteredStations.map((station, i) => {
                    const config = getStatusConfig(station.status);
                    const isFocused = focusedStationId === station.id;
                    return (
                      <div 
                        key={station.id} 
                        className={`absolute cursor-pointer transition-all z-10 group ${isFocused ? 'scale-125 z-20' : 'hover:scale-110'}`}
                        style={{ 
                          top: `${30 + (station.lat - 36.5) * 400}%`, 
                          left: `${20 + (station.lng - 101.7) * 400}%` 
                        }}
                        onClick={() => setFocusedStationId(station.id)}
                      >
                        <div className={`relative flex flex-col items-center`}>
                          {isFocused && (
                            <div className="absolute inset-0 -m-4 bg-emerald-500/20 rounded-full animate-ping z-0" />
                          )}
                          <div className={`w-10 h-10 ${config.bg} ${config.text} ${config.border} border-2 rounded-2xl flex items-center justify-center shadow-lg relative z-10 ${isFocused ? 'ring-4 ring-emerald-500/30' : ''}`}>
                            <Zap size={20} fill="currentColor" />
                          </div>
                          <div className={`w-0.5 h-3 ${config.color} opacity-40`}></div>
                          
                          <div className={`absolute bottom-full mb-3 w-48 bg-white p-3 rounded-xl shadow-2xl border border-gray-100 z-50 ${isFocused ? 'block' : 'hidden group-hover:block'}`}>
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="text-xs font-bold text-gray-800">{station.name}</h5>
                              <button onClick={(e) => { e.stopPropagation(); setSelectedStation(station); }} className="text-emerald-500 hover:text-emerald-600 p-0.5 rounded transition-colors">
                                <ChevronRight size={14} />
                              </button>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-400">
                               <span>{station.chargerCount} 枪</span>
                               <span>{station.totalPower} kW</span>
                            </div>
                            <div className={`mt-2 text-[9px] font-bold ${config.text}`}>{config.label}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md p-4 rounded-xl border border-gray-200 shadow-xl flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase">图例说明</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded bg-emerald-500 shadow-sm"></div>
                      <span className="text-xs font-medium text-gray-600">正常运行</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded bg-blue-500 shadow-sm"></div>
                      <span className="text-xs font-medium text-gray-600">建设调试</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded bg-rose-500 shadow-sm"></div>
                      <span className="text-xs font-medium text-gray-600">设备故障</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      {selectedStation && (
        <StationDetailModal 
          station={selectedStation} 
          onClose={() => setSelectedStation(null)} 
        />
      )}
    </div>
  );
};

export default ChargingStationManagement;
