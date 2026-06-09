
import React, { useState, useMemo } from 'react';
import Sidebar, { NavMenu } from './components/Sidebar';
import Header from './components/Header';
import AddDeviceModal from './components/AddDeviceModal';
import MonitorModal from './components/MonitorModal';
import ChargingStationManagement from './components/ChargingStationManagement';
import ChargingStationOverview from './components/ChargingStationOverview';
import ForecastMechanism from './components/ForecastMechanism';
import WarningMessageManagement from './components/WarningMessageManagement';
import DashboardOverview from './components/DashboardOverview';
import ElectricParkManagement from './components/ElectricParkManagement';
import TransformerManagement from './components/TransformerManagement';
import ChargingStationSystemManagement from './components/ChargingStationSystemManagement';
import PowerStationManagement from './components/PowerStationManagement';
import StationDataStatistics from './components/StationDataStatistics';
import StationAnalysis from './components/StationAnalysis';
import { FaultAlarmManagement } from './components/FaultAlarmManagement';
import TenantManagement from './components/TenantManagement';
import OrgManagement from './components/OrgManagement';
import PermissionManagement from './components/PermissionManagement';
import { INITIAL_TENANTS, INITIAL_ORGS, INITIAL_USERS } from './components/sharedSeedData';
import { Device, Site, DeviceType, Tenant, OrgNode, SystemUser } from './types';
import { MASTER_DEVICE_POOL, SITES } from './data';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Eye, 
  Trash2, 
  Info,
  CircleAlert,
  CheckCircle2,
  ChevronDown,
  MapPin,
  Network
} from 'lucide-react';

const App: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<NavMenu>('dashboard');
  const [currentSiteId, setCurrentSiteId] = useState(SITES[1].id); // Default to site-02
  const [devices, setDevices] = useState<Device[]>(MASTER_DEVICE_POOL);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [monitoringDevice, setMonitoringDevice] = useState<Device | null>(null);
  const [searchParams, setSearchParams] = useState({ type: '全部', name: '', sn: '' });

  // System Administration Shared States
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [orgs, setOrgs] = useState<OrgNode[]>(INITIAL_ORGS);
  const [users, setUsers] = useState<SystemUser[]>(INITIAL_USERS);

  const currentSite = useMemo(() => SITES.find(s => s.id === currentSiteId)!, [currentSiteId]);
  
  const siteDevices = useMemo(() => 
    devices.filter(d => d.parentId === currentSiteId || d.parentName === currentSite.name), 
    [devices, currentSiteId, currentSite.name]
  );

  const filteredDevices = useMemo(() => {
    return siteDevices.filter(d => {
      const matchType = searchParams.type === '全部' || d.type === searchParams.type;
      const matchName = d.name.toLowerCase().includes(searchParams.name.toLowerCase());
      const matchSn = d.sn.toLowerCase().includes(searchParams.sn.toLowerCase());
      return matchType && matchName && matchSn;
    });
  }, [siteDevices, searchParams]);

  const unboundDevices = useMemo(() => 
    devices.filter(d => !d.parentId && d.parentName === '-'),
    [devices]
  );

  const handleBind = (deviceIds: string[], areaId?: string, areaName?: string) => {
    setDevices(prev => prev.map(d => 
      deviceIds.includes(d.id) 
        ? { 
            ...d, 
            parentId: currentSiteId, 
            parentName: currentSite.name, 
            areaId: areaId || '', 
            areaName: areaName || '' 
          } 
        : d
    ));
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确认解除此设备绑定？解绑后设备将返回资源池。')) {
      setDevices(prev => prev.map(d => 
        d.id === id ? { ...d, parentId: '', parentName: '-', areaId: '', areaName: '' } : d
      ));
    }
  };

  const handleReset = () => {
    setSearchParams({ type: '全部', name: '', sn: '' });
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header currentSiteId={currentSiteId} onSiteChange={setCurrentSiteId} />
        
        <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {activeMenu === 'dashboard' ? (
            <DashboardOverview />
          ) : activeMenu === 'device' ? (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 px-1">
                <span>绿算园区管理</span>
                <span className="opacity-50">/</span>
                <span className="text-emerald-600 font-semibold">设备管理</span>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-6">
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">设备类型</label>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      value={searchParams.type}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="全部">全部类型</option>
                      {Object.values(DeviceType).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">设备名称</label>
                  <input 
                    type="text" 
                    placeholder="请输入设备名称..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    value={searchParams.name}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                    <Search size={18} />
                    查询
                  </button>
                  <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95"
                  >
                    <RotateCcw size={18} />
                    重置
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center bg-white px-5 py-3 rounded-t-xl border-x border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95"
                  >
                    <Plus size={18} />
                    新增绑定
                  </button>
                  <span className="text-xs text-slate-400 font-medium ml-2">
                    已绑定 {filteredDevices.length} 个资产
                  </span>
                </div>
              </div>

              <div className="bg-white flex-1 min-h-0 border border-gray-100 rounded-b-xl overflow-hidden shadow-sm flex flex-col">
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                  <table className="w-full border-collapse min-w-[1200px]">
                    <thead className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
                      <tr>
                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">设备名称</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">设备类型</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">状态</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">设备SN</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">所属位置 (站点 &gt; 区域)</th>
                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">创建时间</th>
                        <th className="text-center px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredDevices.map((device) => (
                        <tr key={device.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-800">{device.name}</span>
                              <span className="text-[9px] text-gray-400 font-mono mt-0.5">{device.id}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-black text-slate-600 uppercase tracking-wider">{device.type}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border w-fit ${
                              device.onlineStatus === 'online' 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                : 'bg-slate-50 text-slate-400 border-slate-100'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${device.onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                              {device.onlineStatus === 'online' ? '在线' : '离线'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-mono text-gray-600">{device.sn}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                               <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                                 <MapPin size={12} className="text-emerald-500" />
                                 {device.parentName}
                               </div>
                               {device.areaName && (
                                 <div className="flex items-center gap-1.5 text-[10px] text-blue-500 font-medium ml-4">
                                   <Network size={10} />
                                   {device.areaName}
                                 </div>
                               )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">{device.createdAt}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-4">
                              <button onClick={() => setMonitoringDevice(device)} className="text-emerald-600 hover:text-emerald-700 font-bold text-xs">监控</button>
                              <button className="text-blue-600 hover:text-blue-700 font-bold text-xs">详情</button>
                              <button onClick={() => handleDelete(device.id)} className="text-rose-500 hover:text-rose-600 font-bold text-xs">移除</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeMenu === 'charging-overview' ? (
            <ChargingStationOverview />
          ) : activeMenu === 'charging-list' ? (
            <ChargingStationManagement />
          ) : activeMenu === 'forecast-mechanism' ? (
            <ForecastMechanism />
          ) : activeMenu === 'forecast-messages' ? (
            <WarningMessageManagement />
          ) : activeMenu === 'system-park' ? (
            <ElectricParkManagement />
          ) : activeMenu === 'system-transformer' ? (
            <TransformerManagement />
          ) : activeMenu === 'system-charging' ? (
            <ChargingStationSystemManagement />
          ) : activeMenu === 'system-station' ? (
            <PowerStationManagement />
          ) : activeMenu === 'system-tenant' ? (
            <TenantManagement tenants={tenants} setTenants={setTenants} users={users} setUsers={setUsers} />
          ) : activeMenu === 'system-org' ? (
            <OrgManagement tenants={tenants} orgs={orgs} setOrgs={setOrgs} users={users} setUsers={setUsers} />
          ) : activeMenu === 'system-auth' ? (
            <PermissionManagement tenants={tenants} orgs={orgs} users={users} setUsers={setUsers} />
          ) : activeMenu === 'station-stats' ? (
            <StationDataStatistics />
          ) : activeMenu === 'station-analysis' ? (
            <StationAnalysis />
          ) : activeMenu === 'alert-fault' ? (
            <FaultAlarmManagement />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Info size={48} className="text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-600">模块开发中</h3>
            </div>
          )}
        </main>
      </div>

      {isAddModalOpen && (
        <AddDeviceModal 
          unboundDevices={unboundDevices} 
          targetSite={currentSite} 
          onClose={() => setIsAddModalOpen(false)}
          onBind={handleBind}
        />
      )}

      {monitoringDevice && (
        <MonitorModal 
          device={monitoringDevice} 
          onClose={() => setMonitoringDevice(null)} 
        />
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

export default App;
