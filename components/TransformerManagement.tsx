
import React, { useState } from 'react';
import { Search, RotateCcw, Plus, Edit3, Trash2, X, Battery } from 'lucide-react';

interface Transformer {
  id: string;
  name: string;
  sn: string;
  capacity: number;
  parkName: string;
}

const MOCK_TRANSFORMERS: Transformer[] = [
  { id: '1', name: '园区主变-T1', sn: 'TR-2024-001', capacity: 1250, parkName: '绿算园区A区' },
  { id: '2', name: '园区主变-T2', sn: 'TR-2024-002', capacity: 1250, parkName: '绿算园区A区' },
  { id: '3', name: '备用主变-T3', sn: 'TR-2024-003', capacity: 800, parkName: '绿算园区B区' },
];

const TransformerManagement: React.FC = () => {
  const [transformers, setTransformers] = useState<Transformer[]>(MOCK_TRANSFORMERS);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState<Transformer | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('确定移除该主变设备？')) {
      setTransformers(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 px-1">
        <span>系统管理</span>
        <span className="opacity-50">/</span>
        <span className="text-emerald-600 font-semibold">园区主变管理</span>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-6">
        <div className="flex flex-col gap-2 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">主变名称</label>
          <input type="text" placeholder="搜索主变名称" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" />
        </div>
        <div className="flex flex-col gap-2 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">所属园区</label>
          <select className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none">
            <option>全部园区</option>
            <option>绿算园区A区</option>
            <option>绿算园区B区</option>
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
             <Plus size={16} /> 新增主变
           </button>
        </div>

        <table className="w-full border-collapse">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">主变名称</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">设备编号</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">额定容量 (kVA)</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">所属园区</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transformers.map(t => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-bold text-gray-800">{t.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{t.sn}</td>
                <td className="px-6 py-4 text-sm text-gray-600 font-bold">{t.capacity}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{t.parkName}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-6">
                     <button onClick={() => { setCurrent(t); setShowModal(true); }} className="text-blue-500 hover:text-blue-600 font-bold text-xs underline underline-offset-4">编辑</button>
                     <button onClick={() => handleDelete(t.id)} className="text-rose-500 hover:text-rose-600 font-bold text-xs underline underline-offset-4">移除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">{current ? '编辑主变' : '新增主变'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">所属园区</label>
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500">
                  <option>请选择园区</option>
                  <option selected={current?.parkName === '绿算园区A区'}>绿算园区A区</option>
                  <option selected={current?.parkName === '绿算园区B区'}>绿算园区B区</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">主变名称</label>
                  <input type="text" defaultValue={current?.name} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="如：主变-T1" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">设备编号</label>
                  <input type="text" defaultValue={current?.sn} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="SN号" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">额定容量 (kVA)</label>
                <input type="number" defaultValue={current?.capacity} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="请输入容量数值" />
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

export default TransformerManagement;
