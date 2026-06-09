
import React from 'react';
import { 
  Zap, 
  Battery, 
  Sun, 
  Wind, 
  TrendingUp, 
  ArrowUpRight, 
  Leaf, 
  TreePine, 
  Flame, 
  Info, 
  AlertTriangle,
  ChevronRight,
  Monitor,
  X,
  Activity,
  ArrowUp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line
} from 'recharts';

const chartData = [
  { name: '05-02', 储能充电: 120, 充电站充电: 80, 电网上网: 60, 负载用电: 210 },
  { name: '05-04', 储能充电: 150, 充电站充电: 110, 电网上网: 40, 负载用电: 250 },
  { name: '05-06', 储能充电: 140, 充电站充电: 95, 电网上网: 55, 负载用电: 230 },
  { name: '05-08', 储能充电: 160, 充电站充电: 120, 电网上网: 45, 负载用电: 280 },
  { name: '05-10', 储能充电: 130, 充电站充电: 100, 电网上网: 50, 负载用电: 220 },
  { name: '05-11', 储能充电: 145, 充电站充电: 105, 电网上网: 48, 负载用电: 245 },
  { name: '05-13', 储能充电: 155, 充电站充电: 115, 电网上网: 42, 负载用电: 260 },
  { name: '05-15', 储能充电: 125, 充电站充电: 90, 电网上网: 58, 负载用电: 215 },
  { name: '05-17', 储能充电: 170, 充电站充电: 130, 电网上网: 35, 负载用电: 310 },
  { name: '05-19', 储能充电: 140, 充电站充电: 100, 电网上网: 52, 负载用电: 240 },
  { name: '05-21', 储能充电: 150, 充电站充电: 110, 电网上网: 45, 负载用电: 275 },
  { name: '05-23', 储能充电: 135, 充电站充电: 98, 电网上网: 55, 负载用电: 230 },
  { name: '05-25', 储能充电: 165, 充电站充电: 125, 电网上网: 40, 负载用电: 295 },
  { name: '05-27', 储能充电: 140, 充电站充电: 105, 电网上网: 48, 负载用电: 255 },
  { name: '05-29', 储能充电: 155, 充电站充电: 115, 电网上网: 42, 负载用电: 280 },
  { name: '05-31', 储能充电: 145, 充电站充电: 110, 电网上网: 45, 负载用电: 265 },
];

const miniChartData = [
  { v: 10 }, { v: 15 }, { v: 12 }, { v: 18 }, { v: 14 }, { v: 22 }, { v: 20 }
];

const RevenueMiniChart = ({ color }: { color: string }) => (
  <div className="h-8 w-full mt-1">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={miniChartData}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const SummaryCard = ({ title, icon: Icon, color, bg, metrics, daily, total }: any) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <h4 className="text-[13px] font-bold text-slate-700">{title}</h4>
      <div className={`w-7 h-7 rounded-full ${bg} ${color} flex items-center justify-center`}>
        <Icon size={14} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      {metrics.map((m: any, i: number) => (
        <div key={i} className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{m.label}</span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-[13px] font-bold text-slate-700">{m.value}</span>
            <span className="text-[9px] text-slate-400">{m.unit}</span>
          </div>
        </div>
      ))}
    </div>
    <div className="flex gap-2 mt-1">
      <div className="flex-1 bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col">
        <span className="text-[9px] text-slate-400 font-bold">今日</span>
        <div className="flex items-baseline gap-0.5">
          <span className="text-[12px] font-black text-slate-700">{daily}</span>
          <span className="text-[9px] text-slate-400">kWh</span>
        </div>
      </div>
      <div className="flex-1 bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col">
        <span className="text-[9px] text-slate-400 font-bold">累计</span>
        <div className="flex items-baseline gap-0.5">
          <span className="text-[12px] font-black text-slate-700">{total}</span>
          <span className="text-[9px] text-slate-400">万kWh</span>
        </div>
      </div>
    </div>
  </div>
);

const DashboardOverview: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500 bg-[#f8fafc]">
      {/* Tab Selectors */}
      <div className="flex items-center gap-2 mb-1">
        <button className="px-4 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-sm">运行概览</button>
        <button className="px-4 py-1.5 bg-blue-500 text-white rounded text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2">
          多站总览
          <X size={14} />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Left Column (3) */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-4">
          {/* Revenue Overview */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-[14px] font-bold text-slate-800 mb-4">收益概览</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-3 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-medium">今日总收益</span>
                  <div className="w-5 h-5 rounded bg-emerald-50 text-emerald-500 flex items-center justify-center"><TrendingUp size={10} /></div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-slate-800">10223.02</span>
                  <span className="text-[10px] text-slate-400">元</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-medium">累计总收益</span>
                  <div className="w-5 h-5 rounded bg-blue-50 text-blue-500 flex items-center justify-center"><ArrowUpRight size={10} /></div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-slate-800">105.02</span>
                  <span className="text-[10px] text-slate-400">万元</span>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {[
                { label: '储能', icon: Battery, color: '#10b981', today: '10223', accum: '23.02' },
                { label: '光伏', icon: Sun, color: '#3b82f6', today: '304', accum: '43.02' },
                { label: '充电', icon: Zap, color: '#f59e0b', today: '0', accum: '13.02' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon size={14} style={{ color: item.color }} />
                      <span className="text-xs font-bold text-slate-600">{item.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">近七日</span>
                  </div>
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4">
                      <span className="text-[9px] text-slate-400 block">今日收益</span>
                      <span className="text-[11px] font-bold text-slate-700">{item.today} <span className="font-normal text-[9px]">元</span></span>
                    </div>
                    <div className="col-span-4">
                      <span className="text-[9px] text-slate-400 block">累计收益</span>
                      <span className="text-[11px] font-bold text-slate-700">{item.accum} <span className="font-normal text-[9px]">万</span></span>
                    </div>
                    <div className="col-span-4">
                      <RevenueMiniChart color={item.color} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Park Consumption */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-bold text-slate-800">园区用电</h3>
              <ChevronRight size={14} className="text-slate-300" />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-medium">今日总用电</span>
                  <span className="text-[15px] font-black text-blue-600 mt-0.5">4523.12 <span className="text-[9px] font-normal">kWh</span></span>
                </div>
                <Zap size={14} className="text-blue-400 opacity-60" />
              </div>
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-medium">最高负荷</span>
                  <span className="text-[15px] font-black text-indigo-600 mt-0.5">890.2 <span className="text-[9px] font-normal">kW</span></span>
                </div>
                <Activity size={14} className="text-indigo-400 opacity-60" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[11px] border-t border-slate-50 pt-3">
               <div className="flex flex-col">
                 <span className="text-slate-400">昨日</span>
                 <span className="font-bold text-slate-700">4231.02 <span className="font-normal text-[9px]">kWh</span></span>
               </div>
               <div className="flex flex-col items-end">
                 <span className="text-slate-400">累计总用电</span>
                 <span className="font-bold text-slate-700">254.12 <span className="font-normal text-[9px]">万kWh</span></span>
               </div>
            </div>
          </div>

          {/* Social Contribution */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[13px] font-bold text-slate-500 px-1 uppercase tracking-wider">社会贡献</h3>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between relative overflow-hidden">
               <div className="flex flex-col relative z-10">
                 <span className="text-[11px] font-bold text-blue-600">等效减排</span>
                 <div className="flex items-baseline gap-1 mt-1">
                   <span className="text-2xl font-black text-blue-700">100.00</span>
                   <span className="text-xs font-bold text-blue-700/60">kg</span>
                 </div>
               </div>
               <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center relative z-10 shadow-inner">
                 <Leaf size={28} className="text-blue-500" />
               </div>
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-y-8 translate-x-8"></div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between relative overflow-hidden">
               <div className="flex flex-col relative z-10">
                 <span className="text-[11px] font-bold text-emerald-600">等效植树</span>
                 <div className="flex items-baseline gap-1 mt-1">
                   <span className="text-2xl font-black text-emerald-700">1425</span>
                   <span className="text-xs font-bold text-emerald-700/60">颗</span>
                 </div>
               </div>
               <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center relative z-10 shadow-inner">
                 <TreePine size={28} className="text-emerald-500" />
               </div>
               <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-8 translate-x-8"></div>
            </div>
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center justify-between relative overflow-hidden">
               <div className="flex flex-col relative z-10">
                 <span className="text-[11px] font-bold text-orange-600">等效节煤</span>
                 <div className="flex items-baseline gap-1 mt-1">
                   <span className="text-2xl font-black text-orange-700">245.12</span>
                   <span className="text-xs font-bold text-orange-700/60">吨</span>
                 </div>
               </div>
               <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center relative z-10 shadow-inner">
                 <Flame size={28} className="text-orange-500" />
               </div>
               <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -translate-y-8 translate-x-8"></div>
            </div>
          </div>
        </div>

        {/* Center Column (6) */}
        <div className="col-span-12 xl:col-span-6 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col min-h-[600px] relative overflow-hidden">
            <div className="flex flex-col gap-1 z-10">
              <div className="flex items-center gap-2">
                 <Monitor size={18} className="text-blue-500" />
                 <h3 className="text-sm font-bold text-slate-800 tracking-tight">系统运行座舱</h3>
              </div>
              <span className="text-[11px] text-slate-400 ml-7">实时能源平衡与调度监控中心</span>
            </div>

            {/* Radar Visualizer - Perfectly matching screenshot positions */}
            <div className="flex-1 relative flex items-center justify-center">
              {/* Outer Pulsing Glow */}
              <div className="absolute w-[85%] h-[85%] rounded-full bg-blue-50/30 animate-pulse"></div>
              
              {/* Decorative Concentric Dashed Circles */}
              <div className="absolute w-[70%] h-[70%] border border-slate-100 rounded-full border-dashed"></div>
              <div className="absolute w-[45%] h-[45%] border border-slate-200 rounded-full border-dashed opacity-50"></div>

              {/* Central Value Node */}
              <div className="relative z-20 w-44 h-44 rounded-full bg-white shadow-2xl flex flex-col items-center justify-center border-[6px] border-blue-50 ring-1 ring-slate-100">
                 <div className="flex flex-col items-center">
                   <div className="flex items-center gap-1.5 text-blue-500 mb-1">
                     <Activity size={14} className="animate-pulse" />
                     <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">实时微网负荷</span>
                   </div>
                   <div className="text-[34px] font-black text-slate-800 leading-none">245.8</div>
                   <div className="text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">KW</div>
                 </div>
              </div>

              {/* Floating Cockpit Data Nodes */}
              {/* Top - PV Output */}
              <div className="absolute top-[12%] flex flex-col items-center group">
                 <div className="px-4 py-2 bg-emerald-50/80 backdrop-blur rounded-xl border border-emerald-100 shadow-sm text-center transform transition-transform group-hover:-translate-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 block">光伏出力</span>
                    <span className="text-[15px] font-black text-emerald-700">120.4 <span className="text-[10px] font-medium opacity-60">kW</span></span>
                 </div>
                 <div className="w-px h-10 bg-gradient-to-b from-emerald-300 to-transparent opacity-30 mt-2"></div>
              </div>

              {/* Left - Storage SOC */}
              <div className="absolute left-[8%] flex items-center group">
                 <div className="px-4 py-2 bg-indigo-50/80 backdrop-blur rounded-xl border border-indigo-100 shadow-sm text-center transform transition-transform group-hover:-translate-x-1">
                    <span className="text-[10px] font-bold text-indigo-600 block">储能SOC</span>
                    <span className="text-[15px] font-black text-indigo-700">78 <span className="text-[10px] font-medium opacity-60">%</span></span>
                 </div>
                 <div className="h-px w-10 bg-gradient-to-r from-transparent to-indigo-300 opacity-30 ml-2"></div>
              </div>

              {/* Right - Wind Power */}
              <div className="absolute right-[8%] flex items-center group">
                 <div className="h-px w-10 bg-gradient-to-l from-transparent to-blue-300 opacity-30 mr-2"></div>
                 <div className="px-4 py-2 bg-blue-50/80 backdrop-blur rounded-xl border border-blue-100 shadow-sm text-center transform transition-transform group-hover:translate-x-1">
                    <span className="text-[10px] font-bold text-blue-600 block">风机出力</span>
                    <span className="text-[15px] font-black text-blue-700">85.2 <span className="text-[10px] font-medium opacity-60">kW</span></span>
                 </div>
              </div>

              {/* Bottom - Charging Station Load */}
              <div className="absolute bottom-[12%] flex flex-col items-center group">
                 <div className="w-px h-10 bg-gradient-to-t from-amber-300 to-transparent opacity-30 mb-2"></div>
                 <div className="px-4 py-2 bg-amber-50/80 backdrop-blur rounded-xl border border-amber-100 shadow-sm text-center transform transition-transform group-hover:translate-y-1">
                    <span className="text-[10px] font-bold text-amber-600 block">充电站负荷</span>
                    <span className="text-[15px] font-black text-amber-700">142.1 <span className="text-[10px] font-medium opacity-60">kW</span></span>
                 </div>
              </div>
            </div>

            {/* Bottom Chart Section */}
            <div className="mt-auto pt-6 border-t border-slate-50">
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-6">
                  {['微网', '电网', '光伏', '储能', '充电站'].map((t, idx) => (
                    <button key={t} className={`text-xs font-bold transition-all relative ${idx === 0 ? 'text-blue-500 after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[2px] after:bg-blue-500' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    {['日', '月', '年', '总'].map(p => (
                      <button key={p} className={`px-4 py-1 text-[10px] font-bold rounded transition-all ${p === '月' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{p}</button>
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">2024-05</span>
                </div>
              </div>
              
              <div className="h-[260px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={9} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                    <YAxis fontSize={9} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }} 
                    />
                    <Bar dataKey="负载用电" stackId="a" fill="#3b82f6" barSize={12} radius={[0, 0, 0, 0]} />
                    <Bar dataKey="充电站充电" stackId="a" fill="#10b981" />
                    <Bar dataKey="电网上网" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="储能充电" stackId="a" fill="#6366f1" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-8 mt-4">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div><span className="text-[10px] text-slate-500 font-medium">储能充电</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div><span className="text-[10px] text-slate-500 font-medium">充电站充电</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div><span className="text-[10px] text-slate-500 font-medium">电网上网</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div><span className="text-[10px] text-slate-500 font-medium">负载用电</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (3) */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-4">
          <SummaryCard 
            title="光伏概览" 
            icon={Sun} 
            color="text-emerald-500" 
            bg="bg-emerald-50" 
            metrics={[{ label: '装机总容量', value: '100.36', unit: 'kWp' }, { label: '逆变器数量', value: '4253', unit: '台' }]}
            daily="100.36"
            total="452.23"
          />
          <SummaryCard 
            title="风机概览" 
            icon={Wind} 
            color="text-blue-500" 
            bg="bg-blue-50" 
            metrics={[{ label: '装机总容量', value: '250.50', unit: 'kWp' }, { label: '风机数量', value: '12', unit: '台' }]}
            daily="452.12"
            total="1284.5"
          />
          <SummaryCard 
            title="储能概览" 
            icon={Battery} 
            color="text-indigo-500" 
            bg="bg-indigo-50" 
            metrics={[{ label: '装机容量', value: '100.36', unit: 'kWh' }, { label: '总数量', value: '4253', unit: '个' }]}
            daily="100.36"
            total="958.12"
          />
          <SummaryCard 
            title="充电站概览" 
            icon={Zap} 
            color="text-amber-500" 
            bg="bg-amber-50" 
            metrics={[{ label: '额定功率', value: '100.02', unit: 'kW' }, { label: '交流桩', value: '452', unit: '个' }, { label: '直流桩', value: '10000', unit: '个' }]}
            daily="100.36"
            total="958.12"
          />

          {/* System Warnings Sticky Bottom Component */}
          <div className="mt-auto bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center justify-between shadow-sm shadow-amber-500/5">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                 <AlertTriangle size={20} className="animate-bounce" />
               </div>
               <div className="flex flex-col">
                 <span className="text-xs font-bold text-amber-700">待处理告警</span>
                 <span className="text-[10px] text-amber-600/70">发现多处点位触发预警阈值</span>
               </div>
             </div>
             <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-amber-500 text-white text-xs font-black rounded-lg shadow-lg shadow-amber-500/30">8</div>
                <ChevronRight size={14} className="text-amber-400" />
             </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: scale(1.1); opacity: 0; }
        }
        .cockpit-ring {
          animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default DashboardOverview;
