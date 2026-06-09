
import React, { useState } from 'react';
import { Search, RotateCcw, Plus, Edit3, Trash2, X, Zap, MapPin } from 'lucide-react';

interface ChargingStation {
  id: string;
  name: string;
  address: string;
  chargerCount: number;
  capacity: number;
  status: '运行中' | '建设中' | '离线';
}

const MOCK_STATIONS: ChargingStation[] = [
  { id: '1', name: '南川工业园快充站', address: '工业园园区内', chargerCount: 12, capacity: 360, status: '运行中' },
  { id: '2', name: '办公区交流桩', address: '综合办公楼停车场', chargerCount: 24, capacity: 168, status: '运行中' },
];

const ChargingStationSystemManagement: React.FC = () => {
  const [stations, setStations] = useState<ChargingStation[]>(MOCK_STATIONS);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState<ChargingStation | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('确定移除该充电场站配置？')) {
      setStations(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 px-1">
        <span>系统管理</span>
        <span className="opacity-50">/</span>
        <span className="text-emerald-600 font-semibold">充电场站管理</span>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-6">
        <div className="flex flex-col gap-2 min-w-[300px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">场站名称</label>
          <input type="text" placeholder="搜索场站名称" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" />
        </div>
        <div className="flex flex-col gap-2 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">运营状态</label>
          <select className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none">
            <option>全部状态</option>
            <option>运行中</option>
            <option>建设中</option>
            <option>离线</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-emerald-500 text-white px-8 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-emerald-500/20"><Search size={16} /> 查询</button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-500 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50"><RotateCcw size={16} /> 重置</button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-end">
           <button 
            onClick={() => { setCurrent(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-100 px-5 py-2 rounded-lg text-sm font-bold hover:bg-emerald-100"
           >
             <Plus size={16} /> 新增场站
           </button>
        </div>

        <table className="w-full border-collapse">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">场站名称</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">详细地址</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">充电桩数量</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">总功率 (kW)</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">当前状态</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stations.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-bold text-gray-800">{s.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-[300px]">{s.address}</td>
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">{s.chargerCount} 把</td>
                <td className="px-6 py-4 text-sm text-gray-800 font-bold">{s.capacity}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${s.status === '运行中' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : s.status === '建设中' ? 'bg-blue-50 text-blue-500 border border-blue-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-6">
                     <button onClick={() => { setCurrent(s); setShowModal(true); }} className="text-blue-500 hover:text-blue-600 font-bold text-xs underline underline-offset-4">编辑</button>
                     <button onClick={() => handleDelete(s.id)} className="text-rose-500 hover:text-rose-600 font-bold text-xs underline underline-offset-4">移除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">{current ? '编辑场站' : '新增场站'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">场站名称</label>
                <input type="text" defaultValue={current?.name} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="请输入场站名称" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">枪数 (把)</label>
                  <input type="number" defaultValue={current?.chargerCount} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">总功率 (kW)</label>
                  <input type="number" defaultValue={current?.capacity} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">当前状态</label>
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500">
                  <option selected={current?.status === '运行中'}>运行中</option>
                  <option selected={current?.status === '建设中'}>建设中</option>
                  <option selected={current?.status === '离线'}>离线</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">场站详细地址</label>
                <div className="space-y-2">
                  <textarea 
                    defaultValue={current?.address} 
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none h-20 focus:border-emerald-500 transition-colors" 
                    placeholder="请输入详细地址"
                  ></textarea>
                  <div className="h-44 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-[url('https://api.map.baidu.com/staticimage/v2?ak=fake&center=121.5,31.3&zoom=11&width=700&height=350')] bg-cover bg-center opacity-50"></div>
                    <div className="relative z-10 bg-white/90 px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 hover:bg-white transition-colors">
                      <MapPin size={16} className="text-red-500" />
                      <span className="text-xs font-bold text-slate-700">点击并在地图上定位场站位置</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 text-sm font-bold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50">取消</button>
              <button onClick={() => setShowModal(false)} className="px-10 py-2 text-sm font-bold text-white bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChargingStationSystemManagement;
