
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Building2, 
  MapPin, 
  Network, 
  ChevronDown, 
  PlusCircle, 
  Layers,
  Info,
  MoreVertical,
  Phone,
  User,
  Zap
} from 'lucide-react';
import { SITES } from '../data';
import { Area, Site } from '../types';

const POWER_STATIONS = SITES.filter(s => s.type === 'power_station');

interface ParkState extends Site {
  address: string;
  contact: string;
  phone: string;
}

const INITIAL_PARKS: ParkState[] = SITES.filter(s => s.type === 'park').map(s => ({
  ...s,
  address: '青海省西宁市南川工业园',
  contact: '管理员',
  phone: '138-0000-0000',
  areas: s.areas || []
}));

const AreaTreeItem: React.FC<{ 
  area: Area; 
  onAdd: (parentId: string, level: number) => void;
  onDelete: (id: string) => void;
  onEdit: (area: Area) => void;
}> = ({ area, onAdd, onDelete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="ml-8 mt-4 animate-in slide-in-from-left-2 duration-300 relative">
      <div className="absolute -left-4 top-0 bottom-0 w-px bg-slate-200"></div>
      <div className="absolute -left-4 top-6 w-4 h-px bg-slate-200"></div>

      <div className="flex items-center group bg-white border border-slate-100 rounded-xl p-3 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5 transition-all">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1 hover:bg-slate-100 rounded mr-2 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
          style={{ visibility: area.children && area.children.length > 0 ? 'visible' : 'hidden' }}
        >
          <ChevronDown size={14} className="text-slate-400" />
        </button>
        
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
          area.level === 1 ? 'bg-emerald-50 text-emerald-600' :
          area.level === 2 ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'
        }`}>
          <Layers size={16} />
        </div>
        
        <div className="flex-1">
          <span className="text-sm font-bold text-slate-700">{area.name}</span>
          <span className={`ml-3 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
            area.level === 1 ? 'bg-emerald-100 text-emerald-700' :
            area.level === 2 ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
          }`}>
            L{area.level}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {area.level < 3 && (
            <button 
              onClick={() => onAdd(area.id, area.level + 1)}
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="添加子区域"
            >
              <PlusCircle size={16} />
            </button>
          )}
          <button 
            onClick={() => onEdit(area)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="重命名"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={() => onDelete(area.id)}
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            title="删除"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isExpanded && area.children && area.children.length > 0 && (
        <div className="relative">
          {area.children.map(child => (
            <AreaTreeItem key={child.id} area={child} onAdd={onAdd} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
};

const ElectricParkManagement: React.FC = () => {
  const [parks, setParks] = useState<ParkState[]>(INITIAL_PARKS);
  const [selectedParkId, setSelectedParkId] = useState<string>(INITIAL_PARKS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  // Area Modal State
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [editingArea, setEditingArea] = useState<{ id?: string, parentId?: string, name: string, level: number } | null>(null);

  // Park Modal State
  const [showParkModal, setShowParkModal] = useState(false);
  const [editingPark, setEditingPark] = useState<Partial<ParkState> | null>(null);

  const selectedPark = useMemo(() => parks.find(p => p.id === selectedParkId), [parks, selectedParkId]);

  const filteredParks = useMemo(() => 
    parks.filter(p => p.name.includes(searchQuery)), 
    [parks, searchQuery]
  );

  // Park CRUD
  const handleOpenAddPark = () => {
    setEditingPark({ name: '', address: '', contact: '', phone: '', boundStationIds: [] });
    setShowParkModal(true);
  };

  const handleOpenEditPark = (e: React.MouseEvent, park: ParkState) => {
    e.stopPropagation();
    setEditingPark(park);
    setShowParkModal(true);
  };

  const handleSavePark = () => {
    if (!editingPark || !editingPark.name?.trim()) return;

    if (editingPark.id) {
      setParks(prev => prev.map(p => p.id === editingPark.id ? (editingPark as ParkState) : p));
    } else {
      const newPark: ParkState = {
        ...editingPark as ParkState,
        id: `site-park-${Date.now()}`,
        type: 'park',
        areas: []
      };
      setParks(prev => [...prev, newPark]);
      setSelectedParkId(newPark.id);
    }
    setShowParkModal(false);
  };

  const handleDeletePark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('确定要永久删除该园区及所属所有资产映射吗？此操作不可撤销。')) return;
    
    setParks(prev => {
      const remaining = prev.filter(p => p.id !== id);
      if (id === selectedParkId && remaining.length > 0) {
        setSelectedParkId(remaining[0].id);
      }
      return remaining;
    });
  };

  // Area CRUD
  const handleOpenAddArea = (parentId: string = '', level: number = 1) => {
    setEditingArea({ parentId, name: '', level });
    setShowAreaModal(true);
  };

  const handleOpenEditArea = (area: Area) => {
    setEditingArea({ id: area.id, name: area.name, level: area.level });
    setShowAreaModal(true);
  };

  const handleDeleteArea = (areaId: string) => {
    if (!window.confirm('确定要删除该区域及其下属所有层级吗？')) return;

    setParks(prev => prev.map(p => {
      if (p.id !== selectedParkId) return p;
      const removeNode = (nodes: Area[]): Area[] => {
        return nodes.filter(n => {
          if (n.id === areaId) return false;
          if (n.children) n.children = removeNode(n.children);
          return true;
        });
      };
      return { ...p, areas: removeNode(p.areas || []) };
    }));
  };

  const handleSaveArea = () => {
    if (!editingArea || !editingArea.name.trim()) return;

    setParks(prev => prev.map(p => {
      if (p.id !== selectedParkId) return p;
      const newAreas = [...(p.areas || [])];

      if (editingArea.id) {
        const updateNode = (nodes: Area[]) => {
          for (let node of nodes) {
            if (node.id === editingArea.id) {
              node.name = editingArea.name;
              return true;
            }
            if (node.children && updateNode(node.children)) return true;
          }
          return false;
        };
        updateNode(newAreas);
      } else {
        const newNode: Area = {
          id: `area-${Date.now()}`,
          name: editingArea.name,
          level: editingArea.level,
          children: []
        };
        if (!editingArea.parentId) {
          newAreas.push(newNode);
        } else {
          const findAndAdd = (nodes: Area[]) => {
            for (let node of nodes) {
              if (node.id === editingArea.parentId) {
                if (!node.children) node.children = [];
                node.children.push(newNode);
                return true;
              }
              if (node.children && findAndAdd(node.children)) return true;
            }
            return false;
          };
          findAndAdd(newAreas);
        }
      }
      return { ...p, areas: newAreas };
    }));

    setShowAreaModal(false);
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500 h-full">
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 px-1">
        <span>系统管理</span>
        <span className="opacity-50">/</span>
        <span className="text-emerald-600 font-semibold">用电园区管理</span>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-160px)]">
        {/* Left: Park List */}
        <div className="col-span-4 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Building2 size={16} className="text-emerald-500" />
                用电园区列表
              </h3>
              <button 
                onClick={handleOpenAddPark}
                className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                title="新增园区"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="搜索园区..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              {filteredParks.length > 0 ? (
                filteredParks.map(park => (
                  <div 
                    key={park.id}
                    onClick={() => setSelectedParkId(park.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all relative group ${
                      selectedParkId === park.id 
                        ? 'bg-emerald-50 border-emerald-200 shadow-sm ring-1 ring-emerald-500/10' 
                        : 'bg-white border-slate-100 hover:border-emerald-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-bold ${selectedParkId === park.id ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {park.name}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => handleOpenEditPark(e, park)}
                          className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
                          title="编辑园区信息"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          onClick={(e) => handleDeletePark(e, park.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                          title="删除园区"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <MapPin size={10} />
                      <span className="truncate">{park.address}</span>
                    </div>
                    {park.boundStationIds && park.boundStationIds.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {park.boundStationIds.map(id => {
                          const station = POWER_STATIONS.find(ps => ps.id === id);
                          return (
                            <div key={id} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold">
                              <Zap size={10} />
                              <span>{station?.name || '未知电站'}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                  <Building2 size={32} className="opacity-20 mb-2" />
                  <p className="text-xs">暂无匹配园区</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Area Structure */}
        <div className="col-span-8 flex flex-col gap-4">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col overflow-hidden">
            {selectedPark ? (
              <>
                <div className="flex items-center justify-between mb-10">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                        <Network size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">{selectedPark.name} 区域维护</h3>
                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Hierarchy Definition & Site Topology</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleOpenAddArea('', 1)}
                    className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all hover:bg-emerald-600"
                  >
                    <Plus size={18} />
                    新增一级区域
                  </button>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mb-6">
                  <Info size={16} className="text-blue-500 mt-0.5" />
                  <div className="text-xs text-blue-700/80 leading-relaxed font-medium">
                    您可以维护园区的物理空间架构（如楼宇、车间、工序），层级结构最高支持 <span className="text-blue-700 font-bold underline">3级</span>。设备管理模块可直接绑定资产至特定的终端区域。
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 -ml-8 custom-scrollbar">
                  {selectedPark.areas && selectedPark.areas.length > 0 ? (
                    <div>
                      {selectedPark.areas.map(area => (
                        <AreaTreeItem 
                          key={area.id} 
                          area={area} 
                          onAdd={handleOpenAddArea} 
                          onDelete={handleDeleteArea} 
                          onEdit={handleOpenEditArea} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12 ml-8">
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 border border-slate-100">
                        <Layers size={32} className="text-slate-200" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-400">尚未定义区域架构</h4>
                      <p className="text-sm text-slate-300 mt-2 max-w-[280px] text-center">点击右上角按钮开始为 {selectedPark.name} 建立地理拓扑模型</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300">
                <Building2 size={48} className="opacity-10 mb-4" />
                <p className="text-lg font-bold">请选择一个园区以开始维护</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Park Add/Edit Modal */}
      {showParkModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Building2 size={20} />
                </div>
                <h4 className="font-bold text-slate-800 text-lg">{editingPark?.id ? '编辑园区信息' : '新增园区信息'}</h4>
              </div>
              <button onClick={() => setShowParkModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">园区名称 (Required)</label>
                <input 
                  autoFocus
                  type="text"
                  value={editingPark?.name}
                  onChange={(e) => setEditingPark(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700"
                  placeholder="请输入园区全称"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">详细地址</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-slate-400" size={16} />
                  <input 
                    type="text"
                    value={editingPark?.address}
                    onChange={(e) => setEditingPark(prev => prev ? { ...prev, address: e.target.value } : null)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-3 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
                    placeholder="请输入园区详细物理地址"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">联系人</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-slate-400" size={16} />
                    <input 
                      type="text"
                      value={editingPark?.contact}
                      onChange={(e) => setEditingPark(prev => prev ? { ...prev, contact: e.target.value } : null)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-3 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
                      placeholder="负责人姓名"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">联系电话</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 text-slate-400" size={16} />
                    <input 
                      type="text"
                      value={editingPark?.phone}
                      onChange={(e) => setEditingPark(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-3 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
                      placeholder="常用联系方式"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">绑定电站 (多选)</label>
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {POWER_STATIONS.map(ps => {
                    const isChecked = editingPark?.boundStationIds?.includes(ps.id);
                    return (
                      <label key={ps.id} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                          isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 group-hover:border-emerald-400'
                        }`}>
                          {isChecked && <Plus size={14} className="rotate-45" />}
                        </div>
                        <input 
                          type="checkbox"
                          className="hidden"
                          checked={isChecked}
                          onChange={(e) => {
                            const currentIds = editingPark?.boundStationIds || [];
                            const nextIds = e.target.checked 
                              ? [...currentIds, ps.id]
                              : currentIds.filter(id => id !== ps.id);
                            setEditingPark(prev => prev ? { ...prev, boundStationIds: nextIds } : null);
                          }}
                        />
                        <span className={`text-xs font-medium transition-colors ${isChecked ? 'text-emerald-700' : 'text-slate-600'}`}>
                          {ps.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowParkModal(false)} 
                className="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
              >
                取消
              </button>
              <button 
                onClick={handleSavePark} 
                disabled={!editingPark?.name?.trim()}
                className="px-10 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all hover:bg-emerald-600 disabled:opacity-50 disabled:grayscale"
              >
                保存信息
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Area Add/Edit Modal */}
      {showAreaModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <Plus size={18} />
                </div>
                <h4 className="font-bold text-slate-800">{editingArea?.id ? '编辑区域名称' : `添加第 ${editingArea?.level} 级区域`}</h4>
              </div>
              <button onClick={() => setShowAreaModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">区域名称 (Name)</label>
              <input 
                autoFocus
                type="text"
                value={editingArea?.name}
                onChange={(e) => setEditingArea(prev => prev ? { ...prev, name: e.target.value } : null)}
                onKeyDown={e => e.key === 'Enter' && handleSaveArea()}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700 text-lg placeholder:font-normal placeholder:text-slate-300"
                placeholder="例如：生产车间 / 1楼机房"
              />
              <div className="mt-6 flex items-center gap-2 text-[10px] text-slate-400 italic">
                <Info size={12} />
                <span>层级深度越高，资产管理粒度越细</span>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowAreaModal(false)} 
                className="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
              >
                取消
              </button>
              <button 
                onClick={handleSaveArea} 
                disabled={!editingArea?.name.trim()}
                className="px-8 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all hover:bg-emerald-600 disabled:opacity-50 disabled:grayscale"
              >
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default ElectricParkManagement;
