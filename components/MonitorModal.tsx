
import React from 'react';
import { X, Activity, Zap, Thermometer, ShieldCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Device } from '../types';

const mockChartData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  power: Math.floor(Math.random() * 50) + 10,
  voltage: 220 + Math.floor(Math.random() * 10),
}));

interface MonitorModalProps {
  device: Device;
  onClose: () => void;
}

const MonitorModal: React.FC<MonitorModalProps> = ({ device, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-[#0f172a] text-slate-200 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-800">
        <div className="flex items-center justify-between p-6 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${device.onlineStatus === 'online' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-rose-500 animate-pulse'}`} />
            <div>
              <h3 className="text-xl font-bold tracking-tight">{device.name} 实时监控</h3>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Device SN: {device.sn} • TYPE: {device.type}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard icon={<Zap className="text-amber-400" />} label="当前功率" value="32.5 kW" sub="昨日: 28.1 kW" />
            <MetricCard icon={<Activity className="text-blue-400" />} label="运行效率" value="98.2 %" sub="标准: 95.0 %" />
            <MetricCard icon={<Thermometer className="text-rose-400" />} label="核心温度" value="42.8 ℃" sub="状态: 正常" />
            <MetricCard icon={<ShieldCheck className="text-emerald-400" />} label="健康度" value={device.deviceStatus === 'normal' ? '优' : '注意'} sub="更新于 1分钟前" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-semibold mb-6 flex items-center gap-2">
                <Activity size={16} className="text-blue-400" />
                功率波动趋势 (24h)
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData}>
                    <defs>
                      <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="power" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPower)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-semibold mb-6 flex items-center gap-2">
                <Zap size={16} className="text-amber-400" />
                电压稳定性 analysis (24h)
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    <Line type="stepAfter" dataKey="voltage" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ icon: React.ReactNode, label: string, value: string, sub: string }> = ({ icon, label, value, sub }) => (
  <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-colors">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-slate-800 rounded-lg">{icon}</div>
      <span className="text-xs text-slate-400 font-medium">{label}</span>
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{sub}</div>
  </div>
);

export default MonitorModal;
