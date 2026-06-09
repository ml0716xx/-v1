
import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Download, Zap, DollarSign, Calendar, Battery } from 'lucide-react';

const StationAnalysis: React.FC = () => {
  const [dimension, setDimension] = useState<'day' | 'month' | 'year'>('day');
  const [period1, setPeriod1] = useState('2025-05-20');
  const [period2, setPeriod2] = useState('2025-05-19');

  // Update periods automatically when dimension changes
  useEffect(() => {
    if (dimension === 'day') {
      setPeriod1('2025-05-20');
      setPeriod2('2025-05-19');
    } else if (dimension === 'month') {
      setPeriod1('2025-05');
      setPeriod2('2024-05');
    } else if (dimension === 'year') {
      setPeriod1('2025');
      setPeriod2('2024');
    }
  }, [dimension]);

  // Generate comparison data based on selected dimension
  const chartData = useMemo(() => {
    const labels = dimension === 'day' 
      ? Array.from({ length: 24 }, (_, i) => `${i}:00`)
      : dimension === 'month'
      ? Array.from({ length: 30 }, (_, i) => `${i + 1}日`)
      : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

    return labels.map(label => ({
      time: label,
      // Generation Metrics
      pvGeneration1: Math.floor(Math.random() * 300) + 500,
      pvGeneration2: Math.floor(Math.random() * 300) + 480,
      windGeneration1: Math.floor(Math.random() * 200) + 300,
      windGeneration2: Math.floor(Math.random() * 200) + 280,
      // Storage Metrics
      storageCharge1: Math.floor(Math.random() * 100) + 200,
      storageCharge2: Math.floor(Math.random() * 100) + 180,
      storageDischarge1: Math.floor(Math.random() * 90) + 190,
      storageDischarge2: Math.floor(Math.random() * 90) + 170,
      // Revenue Metrics
      revenue1: Math.floor(Math.random() * 200) + 400,
      revenue2: Math.floor(Math.random() * 200) + 380,
    }));
  }, [dimension, period1, period2]);

  const placeholderText = useMemo(() => {
    if (dimension === 'day') return { p1: 'YYYY-MM-DD', p2: 'YYYY-MM-DD', label: '日期' };
    if (dimension === 'month') return { p1: 'YYYY-MM', p2: 'YYYY-MM', label: '月份' };
    return { p1: 'YYYY', p2: 'YYYY', label: '年份' };
  }, [dimension]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
        <span>电站管理</span>
        <span className="opacity-50">/</span>
        <span className="text-emerald-600 font-semibold">电站分析</span>
      </div>

      {/* Top Controls & Comparison Selection */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-800">分析维度与对比时段</h3>
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {[
                  { id: 'day', label: '按日分析' },
                  { id: 'month', label: '按月分析' },
                  { id: 'year', label: '按年分析' },
                ].map(d => (
                  <button 
                    key={d.id}
                    onClick={() => setDimension(d.id as any)}
                    className={`px-6 py-1.5 rounded-md text-xs font-bold transition-all ${dimension === d.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              
              <div className="h-6 w-px bg-slate-200"></div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={14} />
                  <input 
                    type="text" 
                    value={period1}
                    onChange={(e) => setPeriod1(e.target.value)}
                    placeholder={placeholderText.p1}
                    className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/10 min-w-[140px]" 
                  />
                  <span className="absolute -top-5 left-0 text-[10px] text-slate-400 font-bold">对比{placeholderText.label} A</span>
                </div>
                <span className="text-slate-300 font-bold px-1">VS</span>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={14} />
                  <input 
                    type="text" 
                    value={period2}
                    onChange={(e) => setPeriod2(e.target.value)}
                    placeholder={placeholderText.p2}
                    className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 min-w-[140px]" 
                  />
                  <span className="absolute -top-5 left-0 text-[10px] text-slate-400 font-bold">对比{placeholderText.label} B</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">A期累计发电</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-emerald-800">12,840</span>
                  <span className="text-[10px] text-slate-400">kWh</span>
                </div>
              </div>
              <div className="flex flex-col items-end border-l border-emerald-200 pl-6">
                 <div className="flex items-center gap-1 text-emerald-500">
                   <TrendingUp size={12} />
                   <span className="text-[11px] font-bold">+5.2%</span>
                 </div>
                 <span className="text-[10px] text-slate-400 font-medium">相对B期</span>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">A期综合收益</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-slate-800">4,523</span>
                  <span className="text-[10px] text-slate-400">元</span>
                </div>
              </div>
              <div className="flex flex-col items-end border-l border-blue-200 pl-6">
                 <div className="flex items-center gap-1 text-rose-500">
                   <TrendingDown size={12} />
                   <span className="text-[11px] font-bold">-1.2%</span>
                 </div>
                 <span className="text-[10px] text-slate-400 font-medium">相对B期</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Trend Comparison - Added PV and Wind */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm"><Zap size={20} /></div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">发电量对标分析 (kWh)</h3>
              <p className="text-[10px] text-slate-400 font-medium">PV & Wind Power Generation Comparison</p>
            </div>
          </div>
          <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"><Download size={16} /></button>
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px' }} 
              />
              <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
              <Bar dataKey="pvGeneration1" name={`光伏 A (${period1})`} fill="#10b981" radius={[3, 3, 0, 0]} barSize={8} />
              <Bar dataKey="pvGeneration2" name={`光伏 B (${period2})`} fill="#a7f3d0" radius={[3, 3, 0, 0]} barSize={8} />
              <Bar dataKey="windGeneration1" name={`风机 A (${period1})`} fill="#0ea5e9" radius={[3, 3, 0, 0]} barSize={8} />
              <Bar dataKey="windGeneration2" name={`风机 B (${period2})`} fill="#bae6fd" radius={[3, 3, 0, 0]} barSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Storage Energy Comparison - NEW CHART */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm"><Battery size={20} /></div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">储能电量对标分析 (kWh)</h3>
              <p className="text-[10px] text-slate-400 font-medium">Storage Charging & Discharging Comparison</p>
            </div>
          </div>
          <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"><Download size={16} /></button>
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px' }} 
              />
              <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
              <Bar dataKey="storageCharge1" name={`充电 A (${period1})`} fill="#6366f1" radius={[3, 3, 0, 0]} barSize={8} />
              <Bar dataKey="storageCharge2" name={`充电 B (${period2})`} fill="#c7d2fe" radius={[3, 3, 0, 0]} barSize={8} />
              <Bar dataKey="storageDischarge1" name={`放电 A (${period1})`} fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={8} />
              <Bar dataKey="storageDischarge2" name={`放电 B (${period2})`} fill="#bfdbfe" radius={[3, 3, 0, 0]} barSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Trend Comparison */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm"><DollarSign size={20} /></div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">综合收益对标分析 (元)</h3>
              <p className="text-[10px] text-slate-400 font-medium">Financial Revenue & Yield Correlation</p>
            </div>
          </div>
          <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"><Download size={16} /></button>
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px' }} 
              />
              <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
              <Bar dataKey="revenue1" name={`收益 A (${period1})`} fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={10} />
              <Bar dataKey="revenue2" name={`收益 B (${period2})`} fill="#cbd5e1" radius={[3, 3, 0, 0]} barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StationAnalysis;
