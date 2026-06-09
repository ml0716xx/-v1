
import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, CheckCircle2, ChevronLeft, ChevronRight, LayoutGrid, ChevronDown, MapPin, Network } from 'lucide-react';
import { Device, Site, DeviceType, Area } from '../types';

interface AddDeviceModalProps {
  unboundDevices: Device[];
  targetSite: Site;
  onClose: () => void;
  onBind: (deviceIds: string[], areaId?: string, areaName?: string) => void;
}

const ITEMS_PER_PAGE = 6;

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ unboundDevices, targetSite, onClose, onBind }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('全部');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('');
  const [selectedAreaName, setSelectedAreaName] = useState<string>('');

  const deviceTypes = ['全部', ...Object.values(DeviceType)];

  const filtered = useMemo(() => 
    unboundDevices.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                          d.sn.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType === '全部' || d.type === selectedType;
      return matchesSearch && matchesType;
    }), [unboundDevices, search, selectedType]
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  
  const paginatedDevices = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedType]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Helper to flatten areas for a simple dropdown, or could use recursive component
  const flattenedAreas = useMemo(() => {
    const list: { id: string; name: string; path: string }[] = [];
    const traverse = (areas: Area[], path = '') => {
      areas.forEach(a => {
        const currentPath = path ? `${path} > ${a.name}` : a.name;
        list.push({ id: a.id, name: a.name, path: currentPath });
        if (a.children) traverse(a.children, currentPath);
      });
    };
    if (targetSite.areas) traverse(targetSite.areas);
    return list;
  }, [targetSite.areas]);

  const handleAreaSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const areaId = e.target.value;
    const area = flattenedAreas.find(a => a.id === areaId);
    setSelectedAreaId(areaId);
    setSelectedAreaName(area ? area.path : '');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">绑定新设备</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                正在为 <span className="font-bold text-emerald-600">{targetSite.name}</span> 分配资产
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-all hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Binding Target Section */}
        <div className="px-6 py-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-emerald-500" />
              <span className="text-sm font-bold text-slate-700">站点: {targetSite.name}</span>
            </div>
            <div className="h-4 w-px bg-emerald-200"></div>
            <div className="flex items-center gap-3">
              <Network size={16} className="text-blue-500" />
              <div className="relative">
                <select 
                  value={selectedAreaId}
                  onChange={handleAreaSelect}
                  className="appearance-none bg-white border border-emerald-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">绑定到站点根节点</option>
                  {flattenedAreas.map(area => (
                    <option key={area.id} value={area.id}>{area.path}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter bg-white px-2 py-1 rounded border border-emerald-100">绑定目标配置</span>
        </div>

        {/* Filter Bar & Search */}
        <div className="px-6 py-4 bg-slate-50 border-b border-gray-100 flex flex-col gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {deviceTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all border ${
                  selectedType === type
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text"
                placeholder="通过设备名称或序列号(SN)搜索..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-base outline-none shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Device List Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 flex flex-col">
          {filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-3 flex-1">
                {paginatedDevices.map(device => (
                  <div 
                    key={device.id}
                    onClick={() => toggleSelect(device.id)}
                    className={`p-4 border rounded-2xl cursor-pointer transition-all flex items-center justify-between group bg-white hover:shadow-md ${
                      selectedIds.includes(device.id) 
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-500/5' 
                        : 'border-gray-100 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex gap-4 items-center">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${
                        selectedIds.includes(device.id) 
                          ? 'bg-emerald-500 text-white shadow-lg' 
                          : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                      }`}>
                        {device.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">{device.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold uppercase">
                            {device.type}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">SN: {device.sn}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {selectedIds.includes(device.id) ? (
                        <div className="bg-emerald-500 text-white p-1 rounded-full animate-in zoom-in duration-200">
                          <CheckCircle2 size={20} />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-emerald-300 transition-colors bg-slate-50 shadow-inner" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Internal List Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2 pb-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 disabled:opacity-30 transition-all text-gray-500"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-xs font-bold text-slate-400">第 {currentPage} / {totalPages} 页</span>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 disabled:opacity-30 transition-all text-gray-500"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
              <Search size={48} className="text-slate-200 mb-4" />
              <h4 className="text-xl font-bold text-gray-400">未找到待分配设备</h4>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-gray-100 flex items-center justify-between shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-100">
              <span className="text-sm font-bold text-emerald-700">已选择 {selectedIds.length} 个设备</span>
            </div>
            {selectedAreaId && (
              <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-sm font-bold text-blue-700">绑定至: {selectedAreaName}</span>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="px-8 py-3 text-base font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
            >
              取消
            </button>
            <button 
              disabled={selectedIds.length === 0}
              onClick={() => onBind(selectedIds, selectedAreaId, selectedAreaName)}
              className="px-12 py-3 text-base font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed rounded-xl shadow-xl shadow-emerald-500/20 transition-all transform active:scale-95"
            >
              完成绑定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDeviceModal;
