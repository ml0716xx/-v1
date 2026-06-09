
import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ChevronDown,
  Settings,
  MapPin,
  Check,
  Info,
  Wind
} from 'lucide-react';

interface StationRecord {
  id: string;
  name: string;
  emsSn: string;
  address: string;
  manager: string;
  phone: string;
  status: '正常' | '离线' | '故障';
  createdAt: string;
  pvCapacity: number;
  inverterCount: number;
  hasIrradiance: boolean;
  storageCapacity: number;
  storageUnits: number;
  cycleTimes: number;
  windCapacity?: number;
  windUnits?: number;
}

const MOCK_DATA: StationRecord[] = [
  { id: 'CS1768459686', name: '余电入储场景站点', emsSn: '710844cc449d55d1-SIM', address: '上海市上海城区金山区上海川投电线电缆有限公司', manager: '薛易立', phone: '15006118608', status: '正常', createdAt: '2025-01-15 14:49:14', pvCapacity: 1800000, inverterCount: 4, hasIrradiance: false, storageCapacity: 1566, storageUnits: 6, cycleTimes: 2 },
  { id: 'CS1768459611', name: '光储充场景站点', emsSn: 'e060a58df4049918-SIM', address: '江苏省常州市新北区天合光能东南', manager: '薛易立', phone: '15006118608', status: '正常', createdAt: '2025-01-15 14:47:51', pvCapacity: 184020, inverterCount: 3, hasIrradiance: false, storageCapacity: 261, storageUnits: 1, cycleTimes: 2 },
  { id: 'CS1768459542', name: '防逆流场景站点', emsSn: 'ddf2c4eb1273c445-SIM', address: '河北省邯郸市永年区翼南快递产业园', manager: '薛易立', phone: '15006118608', status: '正常', createdAt: '2025-01-15 14:46:45', pvCapacity: 280000, inverterCount: 4, hasIrradiance: false, storageCapacity: 522, storageUnits: 1, cycleTimes: 2 },
  { id: 'CS1768459478', name: '动态增容场景站点', emsSn: '7f5870f7c2796292-SIM', address: '江苏省常州市新北区常州益达利科技', manager: '薛易立', phone: '15006118608', status: '正常', createdAt: '2025-01-15 14:45:27', pvCapacity: 250000, inverterCount: 1, hasIrradiance: false, storageCapacity: 430, storageUnits: 2, cycleTimes: 1 },
  { id: 'CS2538051026', name: '光储充站1', emsSn: 'e060a58df4250526', address: '江苏省常州市新北区天合光能东南', manager: '何佳伟', phone: '13775025340', status: '离线', createdAt: '2025-05-26 09:39:50', pvCapacity: 62000, inverterCount: 4, hasIrradiance: false, storageCapacity: 261, storageUnits: 1, cycleTimes: 2 },
  { id: 'CS2442121003', name: '标准版站点', emsSn: 'GL240101000002', address: '江苏省常州市新北区天合光能北区', manager: '何佳伟', phone: '13775025340', status: '离线', createdAt: '2024-12-03 10:15:55', pvCapacity: 250000, inverterCount: 1, hasIrradiance: true, storageCapacity: 215, storageUnits: 1, cycleTimes: 2 },
  { id: 'CS2493011023', name: '实验站点2', emsSn: '', address: '江苏省苏州市昆山市玉山镇同丰东', manager: 'OSC2', phone: '13181350883', status: '故障', createdAt: '2024-01-23 19:28:19', pvCapacity: 67000, inverterCount: 2, hasIrradiance: true, storageCapacity: 430, storageUnits: 2, cycleTimes: 7000 },
];

const StationModal: React.FC<{ station?: StationRecord | null, onClose: () => void }> = ({ station, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-300">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h3 className="text-lg font-bold text-gray-800">{station ? '编辑站点' : '新增站点'}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* 基本信息 */}
          <section>
            <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              基本信息
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500">站点编号</label>
                <input disabled value={station?.id || 'CS' + Date.now().toString().slice(-10)} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-400 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500"><span className="text-red-500 mr-1">*</span>站点名称</label>
                <input defaultValue={station?.name} placeholder="请输入站点名称" className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-emerald-500 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500"><span className="text-red-500 mr-1">*</span>负责人名称</label>
                <input defaultValue={station?.manager} placeholder="请输入负责人姓名" className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-emerald-500 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500"><span className="text-red-500 mr-1">*</span>手机号</label>
                <input defaultValue={station?.phone} placeholder="请输入负责人手机号" className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-emerald-500 transition-colors" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs text-gray-500"><span className="text-red-500 mr-1">*</span>站点地址</label>
                <div className="flex gap-2">
                  <input defaultValue={station?.address} placeholder="请输入站点详细地址" className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div className="h-48 bg-slate-100 rounded-lg mt-2 border border-slate-200 flex items-center justify-center relative overflow-hidden group">
                   <div className="absolute inset-0 bg-[url('https://api.map.baidu.com/staticimage/v2?ak=fake&center=121.4,31.2&zoom=10&width=800&height=400')] bg-cover bg-center opacity-60"></div>
                   <div className="relative z-10 bg-white/90 px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                     <MapPin size={16} className="text-red-500" />
                     <span className="text-xs font-bold text-slate-700">地图选址占位符</span>
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* 光伏信息 */}
          <section>
            <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              光伏信息
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500"><span className="text-red-500 mr-1">*</span>光伏装机容量</label>
                <div className="relative">
                  <input type="number" defaultValue={station?.pvCapacity} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Wp</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500"><span className="text-red-500 mr-1">*</span>逆变器数量</label>
                <div className="relative">
                  <input type="number" defaultValue={station?.inverterCount} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">台</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500"><span className="text-red-500 mr-1">*</span>是否配置辐照仪</label>
                <select defaultValue={station?.hasIrradiance ? '是' : '否'} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none">
                  <option>否</option>
                  <option>是</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500">是否允许光伏上网</label>
                <select className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none">
                  <option>是</option>
                  <option>否</option>
                </select>
              </div>
            </div>
          </section>

          {/* 储能信息 */}
          <section>
            <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              储能信息
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500"><span className="text-red-500 mr-1">*</span>储能装机容量</label>
                <div className="relative">
                  <input type="number" defaultValue={station?.storageCapacity} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">kWh</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500"><span className="text-red-500 mr-1">*</span>储能数量</label>
                <div className="relative">
                  <input type="number" defaultValue={station?.storageUnits} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">台</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500"><span className="text-red-500 mr-1">*</span>测算模型充放电次数</label>
                <div className="relative">
                  <input type="number" defaultValue={station?.cycleTimes} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">次</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500"><span className="text-red-500 mr-1">*</span>DoD放电深度</label>
                <div className="relative">
                  <input type="number" defaultValue={95} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                </div>
              </div>
            </div>
          </section>

          {/* 风机信息 */}
          <section>
            <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              风机信息
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500">风机数量</label>
                <div className="relative">
                  <input type="number" defaultValue={station?.windUnits} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">台</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500">总装机容量</label>
                <div className="relative">
                  <input type="number" defaultValue={station?.windCapacity} className="w-full border border-gray-200 rounded px-3 py-2 text-sm outline-none pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">kW</span>
                </div>
              </div>
            </div>
          </section>

          {/* 其他信息 */}
          <section className="pb-8">
            <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              其他信息
            </h4>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500">保险，维保期限说明</label>
              <textarea placeholder="请输入保险，维保截止时间说明(少于200个字符)" className="w-full border border-gray-200 rounded p-3 text-sm outline-none h-24 focus:border-emerald-500 transition-colors"></textarea>
            </div>
          </section>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white sticky bottom-0 z-10">
          <button onClick={onClose} className="px-6 py-2 text-sm font-bold text-gray-500 border border-gray-200 rounded hover:bg-gray-50 transition-colors">取消</button>
          <button onClick={onClose} className="px-10 py-2 text-sm font-bold text-white bg-emerald-500 rounded shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">保存</button>
        </div>
      </div>
    </div>
  );
};

const PowerStationManagement: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState<StationRecord | null>(null);

  const handleEdit = (record: StationRecord) => {
    setEditingStation(record);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingStation(null);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 px-1">
        <span>系统管理</span>
        <span className="opacity-50">/</span>
        <span className="text-emerald-600 font-semibold">电站管理</span>
      </div>

      {/* Query Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 grid grid-cols-4 gap-4 items-end">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">站点编号</label>
          <input placeholder="请输入" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">站点名称</label>
          <input placeholder="请输入" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">手机号</label>
          <input placeholder="请输入" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">负责人名称</label>
          <input placeholder="请输入" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">站点状态</label>
          <select className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm outline-none"><option>全部</option><option>正常</option><option>故障</option><option>离线</option></select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">主EMS网关SN</label>
          <input placeholder="请输入" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">站点地址</label>
          <select className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm outline-none"><option>省/市/区</option></select>
        </div>
        <div className="space-y-1.5">
          <input placeholder="详细地址" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10" />
        </div>
        <div className="col-span-4 flex justify-end gap-3 mt-2">
          <button className="flex items-center gap-2 bg-emerald-500 text-white px-8 py-2 rounded text-sm font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"><Search size={16} />搜索</button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-500 px-6 py-2 rounded text-sm font-bold hover:bg-gray-50 active:scale-95 transition-all"><RotateCcw size={16} />重置</button>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-end items-center gap-3">
           <button 
             onClick={handleAdd}
             className="flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100 px-4 py-1.5 rounded text-xs font-bold hover:bg-emerald-100"
           >
             <Plus size={14} />新增站点
           </button>
           <button className="flex items-center gap-1 bg-white border border-slate-200 text-slate-500 px-4 py-1.5 rounded text-xs font-bold hover:bg-slate-50 transition-colors">
             <Settings size={14} />自定义列表
           </button>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full border-collapse min-w-[1600px]">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">站点编号</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">站点名称</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">主EMS网关SN</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">站点地址</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">负责人名称</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">手机号</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">站点状态</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">创建时间</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">光伏装机容量 (Wp)</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">逆变器数量 (台)</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">是否配置辐照仪</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">储能装机容量 (kWh)</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">储能数量 (台)</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">测算模型充放电次数 (次)</th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_DATA.map(record => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-[13px] text-slate-600 font-medium">{record.id}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-800 font-bold">{record.name}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-500 font-mono">{record.emsSn || '-'}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-600 max-w-[200px] truncate">{record.address}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-700 font-medium">{record.manager}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-600">{record.phone}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${record.status === '正常' ? 'bg-emerald-500' : record.status === '离线' ? 'bg-slate-300' : 'bg-rose-500'}`}></div>
                      <span className={`text-[12px] font-bold ${record.status === '正常' ? 'text-emerald-500' : record.status === '离线' ? 'text-slate-400' : 'text-rose-500'}`}>{record.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-500">{record.createdAt}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-800 font-bold">{record.pvCapacity}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-600">{record.inverterCount}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-600">{record.hasIrradiance ? '是' : '否'}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-800 font-bold">{record.storageCapacity}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-600">{record.storageUnits}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-600">{record.cycleTimes}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                       <button onClick={() => handleEdit(record)} className="text-emerald-500 hover:text-emerald-600 font-bold text-xs transition-colors">编辑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-gray-100 bg-white flex items-center justify-between">
           <span className="text-xs text-gray-400 font-medium tracking-tight uppercase">共 {MOCK_DATA.length} 条记录 第 1/1 页</span>
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                 <button className="w-8 h-8 rounded border border-emerald-500 text-emerald-500 text-xs font-bold bg-emerald-50">1</button>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-slate-50 border border-slate-200 rounded px-2 py-1 flex items-center gap-2 cursor-pointer">
                  <span className="text-[11px] font-bold text-slate-500">10 条/页</span>
                  <ChevronDown size={12} className="text-slate-400" />
                </div>
              </div>
           </div>
        </div>
      </div>

      {showModal && <StationModal station={editingStation} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default PowerStationManagement;
