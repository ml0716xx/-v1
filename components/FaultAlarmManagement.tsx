import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  RotateCcw, 
  Edit3, 
  Trash2, 
  Mail, 
  User, 
  Bell, 
  Check, 
  X, 
  AlertTriangle,
  Info,
  Clock,
  ShieldAlert,
  Sliders,
  Settings,
  MailCheck,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

// Interfaces
interface PushConfig {
  id: string;
  name: string;
  email: string;
  alertTypes: string[]; // ['设备告警', '事件告警', '阈值告警']
  status: 'active' | 'inactive';
}

interface AlarmRecord {
  id: string;
  time: string;
  target: string;
  type: string;
  level: 'high' | 'medium' | 'low';
  status: 'active' | 'resolved';
  description: string;
}

// Initial Mock Data for Configurations
const INITIAL_CONFIGS: PushConfig[] = [
  {
    id: 'config-1',
    name: '张国庆',
    email: 'guoqing.zhang@trinapower.com',
    alertTypes: ['设备告警', '事件告警'],
    status: 'active'
  },
  {
    id: 'config-2',
    name: '李丽华',
    email: 'lihua.li@trinapower.com',
    alertTypes: ['设备告警', '阈值告警'],
    status: 'active'
  },
  {
    id: 'config-3',
    name: '赵强',
    email: 'qiang.zhao@trinapower.com',
    alertTypes: ['事件告警', '阈值告警'],
    status: 'inactive'
  }
];

// Initial Alarm Records
const DEVICE_ALARMS: AlarmRecord[] = [
  { id: 'da-1', time: '2026-06-08 10:12:45', target: 'INV-01 逆变器', type: '通讯中断', level: 'high', status: 'active', description: '逆变器INV-01连续2分钟无心跳包上报' },
  { id: 'da-2', time: '2026-06-08 09:45:12', target: 'METER-03 总表', type: '采集故障', level: 'medium', status: 'active', description: '分相计量器采集通道异常，电参数据丢失' },
  { id: 'da-3', time: '2026-06-07 18:22:11', target: 'CHARGER-08 充电桩', type: '急停触发', level: 'high', status: 'resolved', description: '用户触发紧急停止按钮' }
];

const EVENT_ALARMS: AlarmRecord[] = [
  { id: 'ea-1', time: '2026-06-08 08:30:15', target: '机房103安全锁', type: '门禁异常开启', level: 'medium', status: 'active', description: '机房103巡检门禁非授权开启' },
  { id: 'ea-2', time: '2026-06-07 14:05:32', target: '消防主机', type: '烟雾探测预警', level: 'high', status: 'resolved', description: '电池储能区2号烟感探头浓度瞬时超范围' }
];

const THRESHOLD_ALARMS: AlarmRecord[] = [
  { id: 'ta-1', time: '2026-06-08 10:05:00', target: 'T1变压器核心', type: '油温过高', level: 'high', status: 'active', description: '油温实时值 88.4°C 超过安全红线 85°C' },
  { id: 'ta-2', time: '2026-06-08 07:12:33', target: '1号储能舱', type: 'SOC差值偏大', level: 'low', status: 'active', description: 'Pack间最大最小电压偏差达250mV，触发均衡警报' }
];

const ALERT_TYPES_POOL = ['设备告警', '事件告警', '阈值告警'];

export const FaultAlarmManagement: React.FC = () => {
  // Tabs: 'device' | 'event' | 'threshold' | 'push_config'
  const [activeTab, setActiveTab] = useState<'device' | 'event' | 'threshold' | 'push_config'>('push_config');
  
  // Configuration State
  const [configs, setConfigs] = useState<PushConfig[]>(INITIAL_CONFIGS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<Partial<PushConfig> | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; alertTypes?: string }>({});

  const filteredConfigs = useMemo(() => {
    return configs.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [configs, searchQuery]);

  // Handle Edit/Add Save
  const handleOpenAdd = () => {
    setEditingConfig({
      name: '',
      email: '',
      alertTypes: ['设备告警'], // Default Selection
      status: 'active'
    });
    setErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (config: PushConfig) => {
    setEditingConfig({ ...config });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`确认删除该联系人的告警推送配置吗？\n姓名: ${name}`)) {
      setConfigs(prev => prev.filter(c => c.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setConfigs(prev => prev.map(c => 
      c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
    ));
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!editingConfig?.name?.trim()) {
      newErrors.name = '请输入姓名';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editingConfig?.email?.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!emailRegex.test(editingConfig.email)) {
      newErrors.email = '请输入合法的邮箱格式';
    }

    if (!editingConfig?.alertTypes || editingConfig.alertTypes.length === 0) {
      newErrors.alertTypes = '请至少选择一种告警类型';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate() || !editingConfig) return;

    if (editingConfig.id) {
      // Update
      setConfigs(prev => prev.map(c => c.id === editingConfig.id ? (editingConfig as PushConfig) : c));
    } else {
      // Create
      const newConfig: PushConfig = {
        ...(editingConfig as PushConfig),
        id: `config-${Date.now()}`
      };
      setConfigs(prev => [...prev, newConfig]);
    }
    setShowModal(false);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
  };

  // Switch Alert Type Selection in Dialog
  const handleCheckboxChange = (type: string) => {
    if (!editingConfig) return;
    const currentTypes = editingConfig.alertTypes || [];
    const nextTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    setEditingConfig({ ...editingConfig, alertTypes: nextTypes });
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500 h-full">
      {/* Breadcrumb path */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 px-1">
        <span>告警管理</span>
        <span className="opacity-50">/</span>
        <span className="text-emerald-600 font-semibold">故障报警</span>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden min-h-[500px]">
        {/* Navigation Tabs Header */}
        <div className="border-b border-slate-200 bg-slate-50/50 px-6 pt-4 flex items-center justify-between">
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab('device')}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === 'device' 
                  ? 'text-slate-800 border-b-2 border-emerald-500' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              设备告警
            </button>
            <button 
              onClick={() => setActiveTab('event')}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === 'event' 
                  ? 'text-slate-800 border-b-2 border-emerald-500' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              事件告警
            </button>
            <button 
              onClick={() => setActiveTab('threshold')}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === 'threshold' 
                  ? 'text-slate-800 border-b-2 border-emerald-500' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              阈值告警
            </button>
            <button 
              onClick={() => setActiveTab('push_config')}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === 'push_config' 
                  ? 'text-emerald-600 border-b-2 border-emerald-500 font-black' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              告警推送配置
            </button>
          </div>
          <div className="pb-4">
            <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase bg-slate-100 px-2.5 py-1 rounded">
              ALARM NOTIFICATION CENTER
            </span>
          </div>
        </div>

        {/* Tab Body Section */}
        <div className="flex-1 p-6 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
          
          {/* 1. Device Alarm list Tab */}
          {activeTab === 'device' && (
            <div className="flex-1 flex flex-col gap-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-semibold text-slate-500">
                    当前监测到 {DEVICE_ALARMS.filter(a => a.status === 'active').length} 个未恢复设备报警
                  </span>
                </div>
              </div>
              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-5 * text-slate-500 text-xs font-bold uppercase border-b border-slate-100">
                    <tr className="bg-slate-50/70">
                      <th className="px-6 py-4 text-left">触发时间</th>
                      <th className="px-6 py-4 text-left">告警设备</th>
                      <th className="px-6 py-4 text-left">告警类型</th>
                      <th className="px-6 py-4 text-left">等级</th>
                      <th className="px-6 py-4 text-left">详述</th>
                      <th className="px-6 py-4 text-left">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {DEVICE_ALARMS.map(record => (
                      <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{record.time}</td>
                        <td className="px-6 py-4 font-bold text-slate-700">{record.target}</td>
                        <td className="px-6 py-4 text-slate-600">{record.type}</td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-600">
                          <span className={`px-2 py-0.5 rounded-full ${
                            record.level === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {record.level === 'high' ? '严重' : '一般'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 max-w-sm truncate">{record.description}</td>
                        <td className="px-6 py-4 text-xs">
                          <span className={`px-2 py-0.5 rounded ${
                            record.status === 'active' ? 'bg-orange-100 text-orange-700 font-bold' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {record.status === 'active' ? '未恢复' : '已恢复'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. Event Alarm Tab */}
          {activeTab === 'event' && (
            <div className="flex-1 flex flex-col gap-4 animate-in fade-in duration-300">
              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-100">
                    <tr className="bg-slate-50/70">
                      <th className="px-6 py-4 text-left">触发时间</th>
                      <th className="px-6 py-4 text-left">事件主体</th>
                      <th className="px-6 py-4 text-left">事件类型</th>
                      <th className="px-6 py-4 text-left">严重级别</th>
                      <th className="px-6 py-4 text-left">异常详述</th>
                      <th className="px-6 py-4 text-left">当前状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {EVENT_ALARMS.map(record => (
                      <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{record.time}</td>
                        <td className="px-6 py-4 font-bold text-slate-700">{record.target}</td>
                        <td className="px-6 py-4 text-slate-600">{record.type}</td>
                        <td className="px-6 py-4 text-xs font-bold">
                          <span className={`px-2 py-0.5 rounded-full ${
                            record.level === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {record.level === 'high' ? '严重' : '一般'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 max-w-sm truncate">{record.description}</td>
                        <td className="px-6 py-4 text-xs">
                          <span className={`px-2 py-0.5 rounded ${
                            record.status === 'active' ? 'bg-orange-100 text-orange-700 font-bold' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {record.status === 'active' ? '未恢复' : '已恢复'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Threshold Alarm Tab */}
          {activeTab === 'threshold' && (
            <div className="flex-1 flex flex-col gap-4 animate-in fade-in duration-300">
              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-100">
                    <tr className="bg-slate-50/70">
                      <th className="px-6 py-4 text-left">触发时间</th>
                      <th className="px-6 py-4 text-left">指标对象</th>
                      <th className="px-6 py-4 text-left">定值类型</th>
                      <th className="px-6 py-4 text-left">判定等级</th>
                      <th className="px-6 py-4 text-left">偏差说明</th>
                      <th className="px-6 py-4 text-left">处理状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {THRESHOLD_ALARMS.map(record => (
                      <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{record.time}</td>
                        <td className="px-6 py-4 font-bold text-slate-700">{record.target}</td>
                        <td className="px-6 py-4 text-slate-600">{record.type}</td>
                        <td className="px-6 py-4 text-xs font-bold">
                          <span className={`px-2 py-0.5 rounded-full ${
                            record.level === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                          }`}>
                            {record.level === 'high' ? '严重' : '低偏差'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 max-w-sm truncate">{record.description}</td>
                        <td className="px-6 py-4 text-xs">
                          <span className={`px-2 py-0.5 rounded ${
                            record.status === 'active' ? 'bg-orange-100 text-orange-700 font-bold' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {record.status === 'active' ? '未恢复' : '已恢复'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Notification Push Config Tab */}
          {activeTab === 'push_config' && (
            <div className="flex-1 flex flex-col gap-5 animate-in fade-in duration-300">
              
              {/* Intro Banner */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-start gap-4">
                <MailCheck className="text-emerald-600 mt-0.5 shrink-0" size={20} />
                <div className="text-xs text-emerald-800 leading-relaxed font-medium">
                  <h4 className="font-bold text-emerald-900 text-sm mb-0.5">告警推送配置中心</h4>
                  您可以在此处维护系统告警接收人及其接收级别分类。对于已启用的配置账户，当对应的安全指标触犯时，系统将触发后台邮件/短信多渠道安全网格推送。
                </div>
              </div>

              {/* Action and Query row */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="按姓名或邮箱查询配置..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all font-medium"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      onClick={handleResetSearch} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/10 active:scale-95 transition-all hover:bg-emerald-600"
                  >
                    <Plus size={14} />
                    新增推送人
                  </button>
                </div>
              </div>

              {/* Configuration Grid/Table */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-left">通知接收人</th>
                      <th className="px-6 py-4 text-left">电子邮箱</th>
                      <th className="px-6 py-4 text-left">推送告警类型</th>
                      <th className="px-6 py-4 text-center w-36">推送状态</th>
                      <th className="px-6 py-4 text-center w-36">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredConfigs.length > 0 ? (
                      filteredConfigs.map(config => (
                        <tr key={config.id} className="hover:bg-slate-50/45 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-800">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <User size={15} />
                              </div>
                              {config.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">{config.email}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              {config.alertTypes.map(t => {
                                const isDevice = t === '设备告警';
                                const isEvent = t === '事件告警';
                                return (
                                  <span 
                                    key={t} 
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                      isDevice ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                      isEvent ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                      'bg-purple-50 text-purple-600 border border-purple-100'
                                    }`}
                                  >
                                    {t}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => toggleStatus(config.id)}
                              className="focus:outline-none inline-flex items-center cursor-pointer"
                              title={config.status === 'active' ? '点击禁用' : '点击启用'}
                            >
                              {config.status === 'active' ? (
                                <div className="text-emerald-500 flex items-center gap-1 font-bold text-xs">
                                  <ToggleRight size={30} className="text-emerald-500" />
                                  <span>启用中</span>
                                </div>
                              ) : (
                                <div className="text-slate-400 flex items-center gap-1 font-bold text-xs">
                                  <ToggleLeft size={30} className="text-slate-300" />
                                  <span className="text-slate-400 font-normal">已停用</span>
                                </div>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-4 text-xs font-bold">
                              <button 
                                onClick={() => handleOpenEdit(config)}
                                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all"
                              >
                                <Edit3 size={12} />
                                编辑
                              </button>
                              <button 
                                onClick={() => handleDelete(config.id, config.name)}
                                className="text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-all"
                              >
                                <Trash2 size={12} />
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-300">
                          <Mail className="opacity-10 mx-auto mb-3" size={40} />
                          <p className="text-xs">暂无匹配的告警接收配置</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Push Config Add/Edit Dialog Mode */}
      {showModal && editingConfig && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Bell size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{editingConfig.id ? '编辑通知接收人' : '新增通知接收人'}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Configure alert routing recipients</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              
              {/* Name field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">安全员姓名</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="请输入安全联络人姓名"
                    className={`w-full bg-slate-50 border ${errors.name ? 'border-rose-400 focus:ring-rose-500/10' : 'border-slate-200 focus:ring-emerald-500/10'} rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-4 transition-all font-semibold text-slate-700`}
                    value={editingConfig.name || ''}
                    onChange={(e) => setEditingConfig({ ...editingConfig, name: e.target.value })}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-500 font-bold ml-1">{errors.name}</p>}
              </div>

              {/* Email field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">推送电子邮箱 Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="email" 
                    placeholder="recipient@company.com"
                    className={`w-full bg-slate-50 border ${errors.email ? 'border-rose-400 focus:ring-rose-500/10' : 'border-slate-200 focus:ring-emerald-500/10'} rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-4 transition-all text-slate-600 font-mono`}
                    value={editingConfig.email || ''}
                    onChange={(e) => setEditingConfig({ ...editingConfig, email: e.target.value })}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-rose-500 font-bold ml-1">{errors.email}</p>}
              </div>

              {/* Alert Types (Multi select checklist) */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">接收告警类型设定</label>
                <div className="grid grid-cols-1 gap-2 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                  {ALERT_TYPES_POOL.map(type => {
                    const isChecked = editingConfig.alertTypes?.includes(type);
                    return (
                      <label key={type} className="flex items-center gap-3 py-1 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                          isChecked 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'bg-white border-slate-300 group-hover:border-emerald-400'
                        }`}>
                          {isChecked && <Check size={12} className="stroke-[3]" />}
                        </div>
                        <input 
                          type="checkbox"
                          className="hidden"
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(type)}
                        />
                        <span className={`text-xs font-bold transition-colors ${isChecked ? 'text-slate-800' : 'text-slate-400'}`}>
                          {type}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.alertTypes && <p className="text-[11px] text-rose-500 font-bold ml-1">{errors.alertTypes}</p>}
              </div>

              {/* Status Selector */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-600">使能此安全联络人 (Push Enable)</span>
                <button 
                  onClick={() => setEditingConfig({ ...editingConfig, status: editingConfig.status === 'active' ? 'inactive' : 'active' })}
                  className="focus:outline-none"
                >
                  {editingConfig.status === 'active' ? (
                    <ToggleRight size={38} className="text-emerald-500" />
                  ) : (
                    <ToggleLeft size={38} className="text-slate-300" />
                  )}
                </button>
              </div>

            </div>

            {/* Actions button */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-white border border-transparent hover:border-slate-100 rounded-xl transition-all"
              >
                取消
              </button>
              <button 
                onClick={handleSave}
                className="px-7 py-2.5 bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/10 active:scale-95 transition-all hover:bg-emerald-600"
              >
                保 存
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Embedded style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
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

export default FaultAlarmManagement;
