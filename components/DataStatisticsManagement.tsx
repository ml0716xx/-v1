
import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  ChevronDown, 
  BarChart3, 
  Info,
  CheckCircle2,
  Settings,
  Database
} from 'lucide-react';

interface StatsItem {
  id: string;
  name: string;
  category: '能耗' | '生产' | '碳足迹' | '成本';
  formula: string;
  organization: string;
  unit: string;
  status: '启用' | '禁用';
}

const MOCK_DATA: StatsItem[] = [
  { id: 'ST-001', name: '单位增加值能耗', category: '能耗', formula: '总能耗 / 增加值', organization: '绿算园区A区', unit: 'tce/万元', status: '启用' },
  { id: 'ST-002', name: '设备平均利用率', category: '生产', formula: '实际运行时间 / 总时长', organization: '南川研发基地', unit: '%', status: '启用' },
  { id: 'ST-003', name: '单位产品碳排放', category: '碳足迹', formula: '碳总排放量 / 产品产量', organization: '绿算园区B区', unit: 'kgCO2/个', status: '启用' },
  { id: 'ST-004', name: '储能充放电损耗', category: '能耗', formula: '1 - (放电量 / 充电量)', organization: '全园区', unit: '%', status: '启用' },
  { id: 'ST-005', name: '光伏清洁能源占比', category: '能耗', formula: '光伏发电量 / 总用电量', organization: '全园区', unit: '%', status: '启用' },
];

const StatsItemModal: React.FC<{ item?: StatsItem | null, onClose: () => void }> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">{item ? '编辑统计项' : '新增统计项'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
            <Info size={18} className="text-blue-500 mt-0.5" />
            <p className="text-xs text-blue-600 leading-relaxed">
              数据统计项即各组织或工序上的重点统计项。成功维护后，可在各业务模块的数据统计功能中进行数据查询、看板展示及导出。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600"><span className="text-red-500 mr-1">*</span>统计项名称</label>
              <input type="text" defaultValue={item?.name} placeholder="如：单位增加值能耗" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600"><span className="text-red-500 mr-1">*</span>业务分类</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500">
                <option selected={item?.category === '能耗'}>能耗</option>
                <option selected={item?.category === '生产'}>生产</option>
                <option selected={item?.category === '碳足迹'}>碳足迹</option>
                <option selected={item?.category === '成本'}>成本</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600"><span className="text-red-500 mr-1">*</span>所属组织/工序</label>
              <input type="text" defaultValue={item?.organization} placeholder="请选择或输入" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600"><span className="text-red-500 mr-1">*</span>计量单位</label>
              <input type="text" defaultValue={item?.unit} placeholder="如：kWh, %, tce" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600">计算逻辑/公式定义</label>
            <div className="relative">
              <textarea 
                defaultValue={item?.formula} 
                className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none h-24 focus:border-emerald-500 font-mono" 
                placeholder="请输入计算逻辑描述或公式"
              ></textarea>
              <div className="absolute right-3 bottom-3">
                <Database size={16} className="text-gray-300" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="text-xs font-bold text-gray-600">状态</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${item?.status !== '禁用' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`}>
                  {item?.status !== '禁用' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
                <span className="text-sm text-gray-600">启用</span>
                <input type="radio" name="status" className="hidden" defaultChecked={item?.status !== '禁用'} />
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${item?.status === '禁用' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`}>
                  {item?.status === '禁用' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
                <span className="text-sm text-gray-600">禁用</span>
                <input type="radio" name="status" className="hidden" defaultChecked={item?.status === '禁用'} />
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-slate-50">
          <button onClick={onClose} className="px-6 py-2 text-sm font-bold text-gray-500 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">取消</button>
          <button onClick={onClose} className="px-10 py-2 text-sm font-bold text-white bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">保存</button>
        </div>
      </div>
    </div>
  );
};

const DataStatisticsManagement: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<StatsItem | null>(null);

  const handleEdit = (item: StatsItem) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 px-1">
        <span>系统管理</span>
        <span className="opacity-50">/</span>
        <span className="text-emerald-600 font-semibold">数据统计项管理</span>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-6">
        <div className="flex flex-col gap-2 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">统计项名称</label>
          <input type="text" placeholder="输入关键字搜索" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" />
        </div>
        <div className="flex flex-col gap-2 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">业务分类</label>
          <select className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none">
            <option>全部分类</option>
            <option>能耗</option>
            <option>生产</option>
            <option>碳足迹</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-emerald-500 text-white px-8 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"><Search size={16} /> 查询</button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-500 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 active:scale-95 transition-all"><RotateCcw size={16} /> 重置</button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
           <div className="flex items-center gap-2 text-slate-500">
             <BarChart3 size={18} className="text-emerald-500" />
             <span className="text-sm font-bold">指标定义列表</span>
           </div>
           <button 
            onClick={handleAdd}
            className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/10 hover:bg-emerald-600 transition-colors"
           >
             <Plus size={16} /> 新增统计项
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">统计项名称</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">业务分类</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">所属组织/工序</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">计算逻辑</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">单位</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">状态</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_DATA.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.organization}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono italic truncate max-w-[200px]">{item.formula}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{item.unit}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                       <div className={`w-1.5 h-1.5 rounded-full ${item.status === '启用' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                       <span className={`text-[11px] font-bold ${item.status === '启用' ? 'text-emerald-500' : 'text-slate-400'}`}>{item.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-6">
                       <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-600 font-bold text-xs underline underline-offset-4 transition-colors">编辑</button>
                       <button className="text-rose-500 hover:text-rose-600 font-bold text-xs underline underline-offset-4 transition-colors">移除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
           <span className="text-xs text-gray-400 font-medium">共 {MOCK_DATA.length} 条记录 第 1 / 1 页</span>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                 <button className="w-8 h-8 rounded border border-emerald-500 text-emerald-500 text-xs font-bold bg-emerald-50">1</button>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white border border-slate-200 rounded px-2 py-1 flex items-center gap-2 cursor-pointer shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500">10 条/页</span>
                  <ChevronDown size={12} className="text-slate-400" />
                </div>
              </div>
           </div>
        </div>
      </div>

      {showModal && <StatsItemModal item={editingItem} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default DataStatisticsManagement;
