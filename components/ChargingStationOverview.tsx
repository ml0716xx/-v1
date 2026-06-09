
import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Battery, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ShieldCheck, 
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  RotateCcw,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const mockLoadData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  load: Math.floor(Math.random() * 400) + 200,
  revenue: Math.floor(Math.random() * 150) + 50,
}));

const statusData = [
  { name: '充电中', value: 45, color: '#10b981' },
  { name: '空闲', value: 38, color: '#3b82f6' },
  { name: '故障', value: 5, color: '#f43f5e' },
  { name: '离线', value: 12, color: '#94a3b8' },
];

const MetricCard = ({ title, value, unit, icon: Icon, color, trend, trendValue }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
    <div className="flex items-center justify-between relative z-10">
      <div className={`p-2 rounded-xl ${color} bg-opacity-10`}>
        <Icon size={20} className={color.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trendValue}
        </div>
      )}
    </div>
    <div className="relative z-10">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</span>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-2xl font-black text-slate-800">{value}</span>
        <span className="text-xs font-bold text-slate-400">{unit}</span>
      </div>
    </div>
  </div>
);

const ChargingStationOverview: React.FC = () => {
  // Fixed to '日' as the period options are removed from the UI
  const period = '日';

  // Mock table data for daily view
  const tableData = useMemo(() => {
    const records = [];
    const count = 10;
    for (let i = 1; i <= count; i++) {
      records.push({
        id: i,
        time: `2026-01-${i.toString().padStart(2, '0')}`,
        volume: (Math.random() * 500 + 200).toFixed(2),
        salesRevenue: (Math.random() * 1000 + 400).toFixed(2),
        profit: (Math.random() * 300 + 100).toFixed(2)
      });
    }
    return records;
  }, []);

  const totals = useMemo(() => {
    return tableData.reduce((acc, curr) => ({
      volume: (parseFloat(acc.volume) + parseFloat(curr.volume)).toFixed(2),
      salesRevenue: (parseFloat(acc.salesRevenue) + parseFloat(curr.salesRevenue)).toFixed(2),
      profit: (parseFloat(acc.profit) + parseFloat(curr.profit)).toFixed(2)
    }), { volume: '0', salesRevenue: '0', profit: '0' });
  }, [tableData]);

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-500 pb-8">
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>充电场站管理</span>
            <span className="opacity-50">/</span>
            <span className="text-emerald-600 font-semibold">充电站概览</span>
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">场站运营核心大盘</h2>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard title="总终端规模" value="1,452" unit="把" icon={Zap} color="bg-emerald-500" trend="up" trendValue="+12" />
        <MetricCard title="今日充电电量" value="12,450" unit="kWh" icon={Battery} color="bg-blue-500" trend="up" trendValue="+8.4%" />
        <MetricCard title="今日充电营收" value="14,231" unit="元" icon={TrendingUp} color="bg-amber-500" trend="down" trendValue="-2.1%" />
        <MetricCard title="设备在线率" value="98.5" unit="%" icon={ShieldCheck} color="bg-indigo-500" trend="up" trendValue="+0.2%" />
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Load Trend */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">24H 实时负荷分布</h3>
              <p className="text-[10px] text-slate-400 font-medium">Power Demand & Revenue Correlation</p>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockLoadData}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="load" name="实时功率 (kW)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">终端运行状态</h3>
              <p className="text-[10px] text-slate-400 font-medium">Real-time Equipment Status</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" fontSize={11} axisLine={false} tickLine={false} width={60} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {statusData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] font-bold text-slate-500">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-700">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Table Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        {/* Table Header / Action Area */}
        <div className="p-5 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">统计周期:</span>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  readOnly 
                  value="2026-01-01 ~ 2026-01-27"
                  className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs font-medium text-slate-600 outline-none min-w-[220px]" 
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-emerald-500/10 hover:bg-emerald-600 transition-all">
              <Search size={14} /> 查询
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 px-5 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all">
              <RotateCcw size={14} /> 重置
            </button>
            <button className="flex items-center gap-2 bg-white border border-emerald-200 text-emerald-600 px-5 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-50 transition-all">
              <Download size={14} /> 导出
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-4">时间</th>
                <th className="px-8 py-4">充电量(kWh)</th>
                <th className="px-8 py-4">售电收入(元)</th>
                <th className="px-8 py-4">充电收益(元)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600">
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-4 text-sm font-medium">{row.time}</td>
                  <td className="px-8 py-4 text-sm font-mono">{row.volume}</td>
                  <td className="px-8 py-4 text-sm font-mono">{row.salesRevenue}</td>
                  <td className="px-8 py-4 text-sm font-mono font-bold text-emerald-600">{row.profit}</td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="bg-emerald-50/30 font-bold border-t border-emerald-100">
                <td className="px-8 py-5 text-sm text-slate-800">合计</td>
                <td className="px-8 py-5 text-sm font-mono text-slate-800">{totals.volume}</td>
                <td className="px-8 py-5 text-sm font-mono text-slate-800">{totals.salesRevenue}</td>
                <td className="px-8 py-5 text-sm font-mono text-emerald-700">{totals.profit}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-6 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400">
            共 {tableData.length} 条记录 第 1/{(Math.ceil(tableData.length / 10))} 页
          </span>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-emerald-500 transition-colors disabled:opacity-30" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-emerald-500 text-white rounded-lg text-xs font-black shadow-lg shadow-emerald-500/20">1</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-lg text-xs font-bold hover:border-emerald-500 hover:text-emerald-500 transition-all">2</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-lg text-xs font-bold hover:border-emerald-500 hover:text-emerald-500 transition-all">3</button>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-emerald-500 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargingStationOverview;
