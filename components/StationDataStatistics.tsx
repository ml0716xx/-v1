
import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Download, Calendar, BarChart3, TrendingUp, Zap, Battery, Wind, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Comparison data for the chart when 'All Stations' is selected
const COMPARISON_DATA = [
  { name: '站点A', 储能充电量: 800, 储能放电量: 750, 光伏发电量: 1200, 风机发电量: 400 },
  { name: '站点B', 储能充电量: 1200, 储能放电量: 1100, 光伏发电量: 1900, 风机发电量: 600 },
  { name: '站点C', 储能充电量: 450, 储能放电量: 420, 光伏发电量: 800, 风机发电量: 200 },
  { name: '站点D', 储能充电量: 1100, 储能放电量: 1050, 光伏发电量: 1500, 风机发电量: 550 },
  { name: '站点E', 储能充电量: 1600, 储能放电量: 1520, 光伏发电量: 2100, 风机发电量: 800 },
];

const StationDataStatistics: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState('全部电站');
  const [period, setPeriod] = useState('日');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Generate detailed flow data based on period and aggregation
  const detailedFlowData = useMemo(() => {
    const records = [];
    const isAll = selectedStation === '全部电站';
    const multiplier = isAll ? 5 : 1; // Aggregated data is higher

    if (period === '日') {
      // Hourly data for the selected day
      for (let i = 0; i < 24; i++) {
        records.push({
          time: `2025-05-20 ${String(i).padStart(2, '0')}:00`,
          储能充电量: (Math.random() * 20 + 10 * multiplier).toFixed(2),
          储能放电量: (Math.random() * 18 + 8 * multiplier).toFixed(2),
          光伏发电量: (Math.random() * 50 + 30 * multiplier).toFixed(2),
          风机发电量: (Math.random() * 30 + 5 * multiplier).toFixed(2),
        });
      }
    } else if (period === '月') {
      // Daily data for the selected month
      for (let i = 1; i <= 30; i++) {
        records.push({
          time: `2025-05-${String(i).padStart(2, '0')}`,
          储能充电量: (Math.random() * 400 + 200 * multiplier).toFixed(2),
          储能放电量: (Math.random() * 380 + 180 * multiplier).toFixed(2),
          光伏发电量: (Math.random() * 800 + 1200 * multiplier).toFixed(2),
          风机发电量: (Math.random() * 300 + 400 * multiplier).toFixed(2),
        });
      }
    } else { // 年
      // Daily data for the selected year (showing representative sample for simulation)
      for (let i = 1; i <= 365; i++) {
        const month = Math.ceil(i / 30.5);
        const day = Math.ceil(i % 30.5) || 1;
        records.push({
          time: `2025-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          储能充电量: (Math.random() * 450 + 250 * multiplier).toFixed(2),
          储能放电量: (Math.random() * 420 + 220 * multiplier).toFixed(2),
          光伏发电量: (Math.random() * 900 + 1500 * multiplier).toFixed(2),
          风机发电量: (Math.random() * 350 + 450 * multiplier).toFixed(2),
        });
      }
    }
    return records;
  }, [period, selectedStation]);

  // Chart data: if All Stations, show comparison. If single station, show trend.
  const chartData = useMemo(() => {
    if (selectedStation === '全部电站') {
      return COMPARISON_DATA;
    }
    // For trend, we show simplified points for the chart
    return detailedFlowData.filter((_, idx) => {
      if (period === '年') return idx % 30 === 0; // Monthly points for year chart
      return true;
    }).map(d => ({
      name: d.time.split(' ')[d.time.includes(' ') ? 1 : 0],
      ...d
    }));
  }, [selectedStation, detailedFlowData, period]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return detailedFlowData.slice(start, start + pageSize);
  }, [detailedFlowData, currentPage]);

  const totalPages = Math.ceil(detailedFlowData.length / pageSize);

  const timePlaceholder = useMemo(() => {
    if (period === '日') return '2025-05-20';
    if (period === '月') return '2025-05';
    return '2025';
  }, [period]);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 px-1">
        <span>电站管理</span>
        <span className="opacity-50">/</span>
        <span className="text-emerald-600 font-semibold">数据统计</span>
      </div>

      {/* Query Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 grid grid-cols-4 gap-4 items-end">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">选择电站</label>
          <select 
            value={selectedStation}
            onChange={(e) => { setSelectedStation(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10"
          >
            <option>全部电站</option>
            <option>余电入储站点</option>
            <option>光储充场景站点</option>
            <option>防逆流场景站点</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">统计周期</label>
          <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1">
            {['日', '月', '年'].map(p => (
              <button 
                key={p} 
                onClick={() => { setPeriod(p); setCurrentPage(1); }}
                className={`flex-1 text-[11px] font-bold py-1.5 rounded-md transition-all ${period === p ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">统计时间</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder={timePlaceholder}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" 
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white py-2 rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"><Search size={16} />查询</button>
          <button 
            onClick={() => { setSelectedStation('全部电站'); setPeriod('日'); setCurrentPage(1); }}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-500 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 active:scale-95 transition-all"
          >
            <RotateCcw size={16} />重置
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '储能充电量', value: '12,450', unit: 'kWh', icon: Battery, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: '储能放电量', value: '11,820', unit: 'kWh', icon: Battery, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: '光伏发电量', value: '45,231', unit: 'kWh', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: '风机发电量', value: '8,420', unit: 'kWh', icon: Wind, color: 'text-sky-500', bg: 'bg-sky-50' },
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 mb-1">{card.label}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-800 tracking-tight">{card.value}</span>
                <span className="text-[10px] font-bold text-slate-400">{card.unit}</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center shadow-sm`}>
              <card.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
             <BarChart3 size={18} className="text-emerald-500" />
             <h3 className="text-sm font-bold text-slate-800">
               {selectedStation === '全部电站' ? '各站核心数据对标' : `${selectedStation} 数据趋势`}
             </h3>
          </div>
          <button className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors">
            <Download size={14} /> 导出统计报告
          </button>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <YAxis fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingBottom: '20px' }} />
              <Bar dataKey="储能充电量" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="储能放电量" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="光伏发电量" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="风机发电量" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Flow Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col">
        <div className="p-5 border-b border-gray-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">明细流水流水</h4>
            <span className="text-[10px] font-bold text-slate-400">
              {selectedStation} - {period}统计周期下明细展示
            </span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-slate-400">共 {detailedFlowData.length} 条</span>
             </div>
             <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors">
               <Download size={14} /> 导出
             </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">时间序列</th>
                <th className="px-8 py-4">储能充电量 (kWh)</th>
                <th className="px-8 py-4">储能放电量 (kWh)</th>
                <th className="px-8 py-4">光伏发电量 (kWh)</th>
                <th className="px-8 py-4">风机发电量 (kWh)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedData.map((record, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-4 text-sm font-medium text-slate-700 font-mono">
                    {record.time}
                  </td>
                  <td className="px-8 py-4 text-sm text-indigo-600 font-mono font-bold">{record.储能充电量}</td>
                  <td className="px-8 py-4 text-sm text-blue-600 font-mono font-bold">{record.储能放电量}</td>
                  <td className="px-8 py-4 text-sm text-emerald-600 font-mono font-bold">{record.光伏发电量}</td>
                  <td className="px-8 py-4 text-sm text-sky-600 font-mono font-bold">{record.风机发电量}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="p-5 bg-slate-50/30 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400">
            第 {currentPage} / {totalPages} 页
          </span>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-emerald-500 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1 mx-2">
              <span className="text-xs font-bold text-slate-600">跳转至</span>
              <input 
                type="number" 
                className="w-12 h-8 bg-white border border-slate-200 rounded-lg text-center text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/10" 
                defaultValue={currentPage}
                onBlur={(e) => {
                  const val = parseInt(e.target.value);
                  if (val >= 1 && val <= totalPages) setCurrentPage(val);
                }}
              />
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-emerald-500 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationDataStatistics;
