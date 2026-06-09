
import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ExternalLink,
  ChevronDown,
  Calendar
} from 'lucide-react';

interface WarningMessage {
  id: string;
  time: string;
  ruleName: string;
  description: string;
}

const MOCK_MESSAGES: WarningMessage[] = [
  { 
    id: '1', 
    time: '2024-05-20 14:30:15', 
    ruleName: '储能电池SOC超限', 
    description: '[绿算园区B区] 储能电池组#3 SOC实时值为 96.5%，触发高水位预警阈值(95%)。' 
  },
  { 
    id: '2', 
    time: '2024-05-20 12:15:42', 
    ruleName: '充电桩通讯中断', 
    description: '[南川西路公共站] 终端#08 连续5分钟未上报心跳包，判断为通讯离线。' 
  },
  { 
    id: '3', 
    time: '2024-05-20 10:05:11', 
    ruleName: '变压器温度过高', 
    description: '[主变电站] T1变压器核心油温达到 88.4°C，已超过预警阈值(85°C)，请检查冷却系统。' 
  },
  { 
    id: '4', 
    time: '2024-05-19 23:45:00', 
    ruleName: '光伏逆变器交流侧故障', 
    description: '[屋顶光伏区] 逆变器INV-04 交流侧三相电流不平衡度达到12%，超过安全范围。' 
  },
  { 
    id: '5', 
    time: '2024-05-19 18:20:33', 
    ruleName: '系统总功率波动异常', 
    description: '[绿算园区] 联络线实时功率突增至 1250kW，已超过园区需量限制值(1200kW)。' 
  },
  { 
    id: '6', 
    time: '2024-05-19 14:10:05', 
    ruleName: '电表数据偏差告警', 
    description: '[数据中心支路] 分项计量电表EM-12 功率因数降至 0.82，建议检查无功补偿装置。' 
  },
  { 
    id: '7', 
    time: '2024-05-18 09:30:00', 
    ruleName: '充电站日营收异常', 
    description: '[城中万达枢纽站] 昨日营收 ¥240，较上周同期下降 65%，疑似部分模块故障未报。' 
  },
  { 
    id: '8', 
    time: '2024-05-18 08:15:22', 
    ruleName: '辐照仪清洗提醒', 
    description: '[实验站点2] 辐照仪测量值与周边气象站偏差超过15%，建议清洁传感器表面。' 
  },
];

const MessageDetailModal: React.FC<{ message: WarningMessage; onClose: () => void }> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">预警详情 - {message.ruleName}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-12">
          {/* Status Section */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">预警触发时间</span>
                <p className="text-lg font-mono text-slate-800 mt-1">{message.time}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">预警规则</span>
                <p className="text-lg font-bold text-emerald-600 mt-1">{message.ruleName}</p>
              </div>
            </div>
            <div className="mt-6">
              <span className="text-xs font-bold text-slate-400 uppercase">详细描述</span>
              <p className="text-base text-slate-600 mt-2 leading-relaxed">{message.description}</p>
            </div>
          </div>

          {/* Condition Analysis */}
          <div className="space-y-6">
            <div className="flex items-center gap-8 border-b border-slate-100 pb-2">
               <span className="text-sm font-bold text-emerald-600 border-b-2 border-emerald-500 pb-2 px-1">实时判定数据</span>
               <span className="text-sm font-bold text-slate-300 px-1">关联工单记录</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700">测点 1：{message.ruleName.includes('温度') ? '核心油温' : 'SOC/功率'}</span>
                  <span className="text-xs text-slate-400">设备 ID: TH-GRID-UNIT-001</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-rose-500 font-bold">实时值：</span>
                  <span className="text-rose-500 font-black text-lg">
                    {message.ruleName.includes('温度') ? '88.4°C' : message.ruleName.includes('SOC') ? '96.5%' : '1250kW'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl opacity-60">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700">阈值配置</span>
                  <span className="text-xs text-slate-400">触发规则：大于或等于 (&gt;=)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">设定值：</span>
                  <span className="text-slate-800 font-black">
                    {message.ruleName.includes('温度') ? '85°C' : message.ruleName.includes('SOC') ? '95%' : '1200kW'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end bg-slate-50 gap-4">
          <button 
            className="px-6 py-2 text-sm font-bold text-emerald-600 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-all shadow-sm"
          >
            派发工单
          </button>
          <button 
            onClick={onClose} 
            className="px-8 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm"
          >
            返回列表
          </button>
        </div>
      </div>
    </div>
  );
};

const WarningMessageManagement: React.FC = () => {
  const [selectedMsg, setSelectedMsg] = useState<WarningMessage | null>(null);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500 h-full">
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 px-1">
        <span>预测管理</span>
        <span className="opacity-50">/</span>
        <span className="text-emerald-600 font-semibold">预警信息管理</span>
      </div>

      {/* Query Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-6">
        <div className="flex flex-col gap-2 min-w-[180px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">告警规则名称</label>
          <input type="text" placeholder="如：SOC超限" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" />
        </div>
        <div className="flex flex-col gap-2 min-w-[180px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">场站/设备</label>
          <input type="text" placeholder="如：绿算园区" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" />
        </div>
        <div className="flex flex-col gap-2 min-w-[280px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">告警时间范围</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
               <input type="text" placeholder="开始日期" className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none" />
            </div>
            <span className="text-gray-400">—</span>
            <div className="relative flex-1">
               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
               <input type="text" placeholder="结束日期" className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 ml-auto">
          <button className="flex items-center gap-2 bg-emerald-500 text-white px-8 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
            <Search size={16} /> 查询
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-500 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 active:scale-95 transition-all">
            <RotateCcw size={16} /> 重置
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase w-[200px]">告警时间</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase w-[180px]">规则名称</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">异常信息摘要</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase w-[120px]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_MESSAGES.map(msg => (
                <tr key={msg.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{msg.time}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-800">{msg.ruleName}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[600px]">{msg.description}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedMsg(msg)}
                      className="text-emerald-600 hover:text-emerald-700 font-bold text-xs underline underline-offset-4"
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
           <span className="text-xs text-gray-500 font-medium">展示 {MOCK_MESSAGES.length} 条实时告警记录</span>
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

      {selectedMsg && (
        <MessageDetailModal 
          message={selectedMsg} 
          onClose={() => setSelectedMsg(null)} 
        />
      )}
    </div>
  );
};

export default WarningMessageManagement;
