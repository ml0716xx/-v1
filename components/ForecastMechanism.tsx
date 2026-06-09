
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  PlusCircle, 
  MinusCircle, 
  CheckCircle2,
  ChevronDown,
  Check
} from 'lucide-react';

interface WarningRule {
  id: string;
  name: string;
  type: '自定义' | '基础规则';
  devices: number;
  points: number;
  triggers: number;
  status: boolean;
}

const MOCK_RULES: WarningRule[] = [
  { id: '1', name: 'apple-散热', type: '自定义', devices: 1, points: 1, triggers: 1, status: true },
  { id: '2', name: 'orange-超限', type: '自定义', devices: 0, points: 0, triggers: 0, status: true },
  { id: '3', name: 'moon-电池过充', type: '自定义', devices: 3, points: 3, triggers: 3, status: true },
  { id: '4', name: '区域A', type: '自定义', devices: 1, points: 1, triggers: 1, status: false },
  { id: '5', name: 'sun-超限', type: '自定义', devices: 3, points: 3, triggers: 3, status: false },
  { id: '6', name: '红旗', type: '自定义', devices: 4, points: 4, triggers: 4, status: true },
  { id: '7', name: '设备C1', type: '自定义', devices: 5, points: 5, triggers: 5, status: true },
  { id: '8', name: '设备C3', type: '自定义', devices: 0, points: 0, triggers: 0, status: false },
  { id: '9', name: '储能异常开关机', type: '基础规则', devices: 5, points: 0, triggers: 0, status: false },
  { id: '10', name: '设备离线告警', type: '基础规则', devices: 1, points: 1, triggers: 1, status: false },
];

// Custom Searchable Select Component
const SearchableSelect: React.FC<{
  options: string[];
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
}> = ({ options, placeholder, value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white cursor-pointer hover:border-emerald-500 transition-colors"
      >
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[90] top-full mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
          <div className="p-2 border-b border-gray-50">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
              <input 
                type="text"
                autoFocus
                placeholder="搜索..."
                className="w-full pl-7 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-100 rounded-md outline-none focus:border-emerald-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <div 
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="flex items-center justify-between px-3 py-2 text-xs hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer transition-colors"
                >
                  <span>{opt}</span>
                  {value === opt && <Check size={12} className="text-emerald-500" />}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-gray-400 text-[10px]">未找到匹配项</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const RuleFormModal: React.FC<{ rule?: WarningRule | null, onClose: () => void }> = ({ rule, onClose }) => {
  const [activeTab] = useState<'自定义' | '基础规则'>(rule?.type || '自定义');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedPoint, setSelectedPoint] = useState('');
  
  const isBasic = activeTab === '基础规则';

  const deviceOptions = ['储能电池组#1', '储能电池组#2', '充电桩#01', '充电桩#02', '逆变器INV-01', '变压器T1', '电表M-01'];
  const pointOptions = ['实时功率', 'SOC', '核心温度', 'A相电压', 'B相电压', 'C相电压', '运行电流'];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">{rule ? '编辑告警规则' : '新增告警规则'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">规则名称</label>
              <input type="text" defaultValue={rule?.name} placeholder="请输入规则名称" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
            </div>

            {!isBasic ? (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">告警规则</label>
                  <div className="flex gap-4">
                     <label className="flex items-center gap-2 text-sm cursor-pointer font-medium"><input type="radio" name="rule-type" checked readOnly className="accent-emerald-500" /> 自定义规则</label>
                     <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-400"><input type="radio" name="rule-type" disabled className="accent-emerald-500" /> 基础规则</label>
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-bold text-gray-600">触发规则</span>
                    <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white outline-none">
                      <option>满足任一状态</option>
                      <option>满足全部状态</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                     <SearchableSelect 
                        className="flex-1"
                        options={deviceOptions}
                        placeholder="请选择设备"
                        value={selectedDevice}
                        onChange={setSelectedDevice}
                     />
                     <SearchableSelect 
                        className="flex-1"
                        options={pointOptions}
                        placeholder="请选择测点"
                        value={selectedPoint}
                        onChange={setSelectedPoint}
                     />
                     <select className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white outline-none hover:border-emerald-500"><option>请选择判断规则</option><option>大于</option><option>小于</option><option>等于</option></select>
                     <select className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs bg-white outline-none hover:border-emerald-500"><option>请选择状态</option><option>数值100</option><option>故障</option></select>
                     <div className="flex gap-1 pl-2">
                       <PlusCircle size={20} className="text-emerald-500 cursor-pointer hover:scale-110 transition-transform" />
                       <MinusCircle size={20} className="text-rose-500 cursor-pointer hover:scale-110 transition-transform" />
                     </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium tracking-wide">* 最多跨N个设备，最多N个测点同时判断</p>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">告警规则</label>
                  <p className="text-xs text-blue-600 bg-blue-50 p-4 rounded-xl border border-blue-100 leading-relaxed">
                    基础规则逻辑由系统内置。例如：储能设备自行启动或关闭，但在 5 分钟内未接收到系统发出的开关机命令时触发预警。
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">备注</label>
              <textarea className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none h-24 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" placeholder="请输入备注内容"></textarea>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
          <button onClick={onClose} className="px-8 py-2.5 text-sm font-bold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">取消</button>
          <button onClick={onClose} className="px-10 py-2.5 text-sm font-bold text-white bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">确定</button>
        </div>
      </div>
    </div>
  );
};

const ForecastMechanism: React.FC = () => {
  const [rules, setRules] = useState<WarningRule[]>(MOCK_RULES);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRule, setCurrentRule] = useState<WarningRule | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const showToast = (msg: string) => {
    setToast({ type: 'success', msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (!rule) return;
    setRules(prev => prev.map(r => r.id === id ? { ...r, status: !r.status } : r));
    showToast(rule.status ? '关闭成功' : '开启成功');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('温馨提示：是否确认删除此规则？')) {
      setRules(prev => prev.filter(r => r.id !== id));
      showToast('删除成功');
    }
  };

  const handleEdit = (rule: WarningRule) => {
    setCurrentRule(rule);
    setIsEditing(true);
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500 relative h-full">
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-300">
           <div className="bg-[#1e293b] text-white px-8 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span className="text-sm font-bold tracking-tight">{toast.msg}</span>
           </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 px-1">
        <span>预测管理</span>
        <span className="opacity-50">/</span>
        <span className="text-emerald-600 font-semibold">系统预警机制</span>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-6">
        <div className="flex flex-col gap-2 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">告警规则名称</label>
          <input type="text" placeholder="请输入名称" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" />
        </div>
        <div className="flex flex-col gap-2 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">设备名称</label>
          <input type="text" placeholder="请输入设备名称" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" />
        </div>
        <div className="flex flex-col gap-2 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">设备编号</label>
          <input type="text" placeholder="请输入序列号" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-emerald-500 text-white px-8 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-emerald-500/10 active:scale-95 transition-all"><Search size={16} /> 查询</button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-500 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 active:scale-95 transition-all"><RotateCcw size={16} /> 重置</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 flex justify-end">
           <button 
            onClick={() => { setCurrentRule(null); setIsEditing(true); }}
            className="flex items-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-100 px-5 py-2 rounded-lg text-sm font-bold hover:bg-emerald-100 transition-colors"
           >
             <Plus size={16} /> 新增告警规则
           </button>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">告警规则名称</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">规则类型</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">设备数</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">测点数</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">触发次数</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">开关状态</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rules.map(rule => (
                <tr key={rule.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">{rule.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{rule.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{rule.devices} <span className="text-[10px] text-slate-400">设备</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{rule.points} <span className="text-[10px] text-slate-400">点位</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{rule.triggers} <span className="text-[10px] text-slate-400">次</span></td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${rule.status ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                      {rule.status ? '开启' : '关闭'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-6">
                       <button onClick={() => handleToggle(rule.id)} className={`${rule.status ? 'text-rose-400 hover:text-rose-500' : 'text-emerald-500 hover:text-emerald-600'} font-bold text-xs transition-colors underline underline-offset-4`}>
                         {rule.status ? '关闭' : '开启'}
                       </button>
                       <button onClick={() => handleEdit(rule)} className="text-blue-500 hover:text-blue-600 font-bold text-xs transition-colors underline underline-offset-4">编辑</button>
                       <button onClick={() => handleDelete(rule.id)} className="text-rose-500 hover:text-rose-600 font-bold text-xs transition-colors underline underline-offset-4">移除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
           <span className="text-xs text-gray-500 font-medium">共 {rules.length} 条记录 第 1 / 1 页</span>
           <div className="flex items-center gap-2">
              <button className="p-1 text-gray-400 disabled:opacity-30" disabled><ChevronLeft size={16} /></button>
              <button className="w-8 h-8 rounded bg-emerald-500 text-white text-xs font-bold">1</button>
              <button className="p-1 text-gray-400 disabled:opacity-30" disabled><ChevronRight size={16} /></button>
              <div className="ml-4 flex items-center gap-2">
                <span className="text-xs text-gray-400">10条/页</span>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
           </div>
        </div>
      </div>

      {isEditing && (
        <RuleFormModal 
          rule={currentRule} 
          onClose={() => setIsEditing(false)} 
        />
      )}
    </div>
  );
};

export default ForecastMechanism;
