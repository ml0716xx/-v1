import React, { useState, useMemo } from 'react';
import { Tenant, SystemUser } from '../types';
import { 
  Building2, 
  Search, 
  RotateCcw, 
  Plus, 
  Edit3, 
  Trash2, 
  UserCheck, 
  Users, 
  ShieldAlert, 
  X, 
  PlusCircle, 
  Info, 
  UserPlus, 
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  UserX,
  AlertTriangle
} from 'lucide-react';

interface TenantManagementProps {
  tenants: Tenant[];
  setTenants: React.Dispatch<React.SetStateAction<Tenant[]>>;
  users: SystemUser[];
  setUsers: React.Dispatch<React.SetStateAction<SystemUser[]>>;
}

export const TenantManagement: React.FC<TenantManagementProps> = ({
  tenants,
  setTenants,
  users,
  setUsers
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Partial<Tenant> | null>(null);
  
  const [showUserManageModal, setShowUserManageModal] = useState(false);
  const [selectedTenantIdForUsers, setSelectedTenantIdForUsers] = useState<string | null>(null);
  
  const [showSelectUserPopup, setShowSelectUserPopup] = useState(false);
  
  // Custom double-confirmation delete states
  const [tenantToDelete, setTenantToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteInputText, setDeleteInputText] = useState('');
  const [deleteChecks, setDeleteChecks] = useState({ understand: false, backedUp: false });
  
  // Error state
  const [errors, setErrors] = useState<{ name?: string }>({});

  const filteredTenants = useMemo(() => {
    return tenants.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tenants, searchQuery]);

  // Map tenant user counts dynamically from the users state!
  const tenantUserCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach(u => {
      if (u.tenantId) {
        counts[u.tenantId] = (counts[u.tenantId] || 0) + 1;
      }
    });
    return counts;
  }, [users]);

  const activeTenantForUsers = useMemo(() => {
    return tenants.find(t => t.id === selectedTenantIdForUsers) || null;
  }, [tenants, selectedTenantIdForUsers]);

  const tenantUsers = useMemo(() => {
    if (!selectedTenantIdForUsers) return [];
    return users.filter(u => u.tenantId === selectedTenantIdForUsers);
  }, [users, selectedTenantIdForUsers]);

  // Users without any tenant yet, available for binding
  const unassignedUsers = useMemo(() => {
    return users.filter(u => !u.tenantId);
  }, [users]);

  // Handlers
  const handleOpenAddTenant = () => {
    setEditingTenant({
      id: '',
      name: '',
      remarks: '',
      status: 'active'
    });
    setErrors({});
    setShowTenantModal(true);
  };

  const handleOpenEditTenant = (tenant: Tenant) => {
    setEditingTenant({ ...tenant });
    setErrors({});
    setShowTenantModal(true);
  };

  const handleSaveTenant = () => {
    if (!editingTenant || !editingTenant.name?.trim()) {
      setErrors({ name: '请输入租户名称' });
      return;
    }

    if (editingTenant.id) {
      // Edit
      setTenants(prev => prev.map(t => t.id === editingTenant.id ? (editingTenant as Tenant) : t));
    } else {
      // Add
      const newId = `T${String(tenants.length + 1).padStart(2, '0')}-${Date.now().toString().slice(-4)}`;
      const newTenant: Tenant = {
        id: newId,
        name: editingTenant.name,
        remarks: editingTenant.remarks || '',
        status: editingTenant.status || 'active',
        createdAt: new Date().toISOString().replace('T', ' ').split('.')[0]
      };
      setTenants(prev => [...prev, newTenant]);
    }
    setShowTenantModal(false);
  };

  const handleDeleteTenant = (id: string, name: string) => {
    const userCount = tenantUserCounts[id] || 0;
    if (userCount > 0) {
      alert(`无法删除租户「${name}」！\n该租户当前关联了 ${userCount} 个人员，请先在“成员管理”中移除所有绑定用户再重试。`);
      return;
    }
    
    setTenantToDelete({ id, name });
    setDeleteInputText('');
    setDeleteChecks({ understand: false, backedUp: false });
  };

  const handleConfirmDeleteTenant = () => {
    if (!tenantToDelete) return;
    if (deleteInputText !== tenantToDelete.name) return;
    if (!deleteChecks.understand || !deleteChecks.backedUp) return;

    setTenants(prev => prev.filter(t => t.id !== tenantToDelete.id));
    setTenantToDelete(null);
  };

  const toggleTenantStatus = (id: string) => {
    setTenants(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' } : t
    ));
  };

  const handleManageUsers = (tenantId: string) => {
    setSelectedTenantIdForUsers(tenantId);
    setShowUserManageModal(true);
  };

  const handleRemoveUserFromTenant = (userId: string, username: string) => {
    if (window.confirm(`确认断开用户「${username}」与当前租户的关联归属吗？\n(这不会删除用户账号，仅将其归为无租户状态)`)) {
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, tenantId: undefined, orgId: undefined } : u
      ));
    }
  };

  const handleAddUserToTenant = (userId: string) => {
    if (!selectedTenantIdForUsers) return;
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, tenantId: selectedTenantIdForUsers } : u
    ));
    setShowSelectUserPopup(false);
  };

  // Quick Inline Creation of user in tenant context
  const handleQuickCreateUser = () => {
    const nameInput = prompt('请输入新录入成员的姓名:');
    if (!nameInput?.trim()) return;
    const phoneInput = prompt('请输入成员手机号:');
    if (!phoneInput?.trim()) return;

    const newUserId = `U${String(users.length + 42).padStart(5, '0')}`;
    const newUser: SystemUser = {
      id: newUserId,
      username: nameInput.trim(),
      phone: phoneInput.trim(),
      role: '普通成员',
      registrationTime: new Date().toISOString().replace('T', ' ').split('.')[0],
      lastLogin: '',
      status: 'active',
      tenantId: selectedTenantIdForUsers || undefined
    };

    setUsers(prev => [newUser, ...prev]);
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      
      {/* Title Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 px-1">
        <span>系统管理</span>
        <span className="opacity-50">/</span>
        <span className="text-emerald-600 font-semibold">租户管理</span>
      </div>

      {/* Intro section */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 flex items-start gap-4 shadow-sm">
        <Building2 className="text-emerald-500 mt-1 shrink-0" size={24} />
        <div>
          <h3 className="text-base font-black text-slate-800">租户管理</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            支持基于 SAAS 框架对用电租户进行集中开通、配置、修改及成员范围设置。各租户数据域处于逻辑隔离箱内。当前作为 Phase 1 预留模块提供服务。
          </p>
        </div>
      </div>

      {/* Query Row & Actions */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" 
            placeholder="按租户名称、ID检索..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/10 font-bold"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={12} />
            </button>
          )}
        </div>

        <button 
          onClick={handleOpenAddTenant}
          className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95"
        >
          <Plus size={14} />
          开通新租户
        </button>
      </div>

      {/* Tenants Table Grid */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#1e293b] text-slate-300 text-xs font-bold uppercase border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left">租户信息</th>
                <th className="px-6 py-4 text-left">租户ID</th>
                <th className="px-6 py-4 text-left">开通时间</th>
                <th className="px-6 py-4 text-center">用户数</th>
                <th className="px-6 py-4 text-left">备注</th>
                <th className="px-6 py-4 text-center w-36">状态</th>
                <th className="px-6 py-4 text-center w-48">高级控制</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTenants.length > 0 ? (
                filteredTenants.map(tenant => {
                  const userCount = tenantUserCounts[tenant.id] || 0;
                  return (
                    <tr key={tenant.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                            tenant.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                          }`}>
                            <Building2 size={16} />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 text-sm block">{tenant.name}</span>
                            <span className="text-[10px] text-slate-400 tracking-wider font-semibold">SAAS ENTERPRISE DOMAIN</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500 font-bold">{tenant.id}</td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">{tenant.createdAt}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-black">
                          {userCount}人
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">{tenant.remarks || '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => toggleTenantStatus(tenant.id)}
                          className="focus:outline-none"
                        >
                          {tenant.status === 'active' ? (
                            <div className="flex items-center justify-center gap-1 text-emerald-600 font-black text-xs cursor-pointer">
                              <ToggleRight size={28} className="text-emerald-500" />
                              <span>启用</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1 text-slate-400 font-bold text-xs cursor-pointer">
                              <ToggleLeft size={28} className="text-slate-300" />
                              <span className="text-slate-400">禁用</span>
                            </div>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3 text-xs font-bold">
                          <button 
                            onClick={() => handleManageUsers(tenant.id)}
                            className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                            title="修改成员列表"
                          >
                            <Users size={12} />
                            成员
                          </button>
                          <button 
                            onClick={() => handleOpenEditTenant(tenant)}
                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <Edit3 size={12} />
                            编辑
                          </button>
                          <button 
                            onClick={() => handleDeleteTenant(tenant.id, tenant.name)}
                            className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-300">
                    <Building2 className="opacity-10 mx-auto mb-3" size={48} />
                    <p className="text-xs">暂无匹配的用电宿主租户数据</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Tenant Modal */}
      {showTenantModal && editingTenant && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Building2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{editingTenant.id ? '编辑租户基本信息' : '配置新增租户域'}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Configure SAAS logical tenant parameters</p>
                </div>
              </div>
              <button onClick={() => setShowTenantModal(false)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">租户名称 (必填)</label>
                <input 
                  type="text" 
                  value={editingTenant.name || ''}
                  onChange={e => setEditingTenant({ ...editingTenant, name: e.target.value })}
                  placeholder="如：青海新能源技术研发试验所"
                  className={`w-full bg-slate-50 border ${errors.name ? 'border-rose-400' : 'border-slate-200'} rounded-2xl px-4 py-3 text-sm outline-none font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5`}
                />
                {errors.name && <p className="text-xs text-rose-500 font-bold">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">租户备注信息</label>
                <textarea 
                  rows={3}
                  value={editingTenant.remarks || ''}
                  onChange={e => setEditingTenant({ ...editingTenant, remarks: e.target.value })}
                  placeholder="请输入补充备注或行政说明"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none text-slate-600 focus:ring-4 focus:ring-emerald-500/5"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">使能租户状态</span>
                  <span className="text-[9px] text-slate-400">停用后，当前租户下所有用户将禁止登录</span>
                </div>
                <button 
                  onClick={() => setEditingTenant({ ...editingTenant, status: editingTenant.status === 'active' ? 'inactive' : 'active' })}
                  className="focus:outline-none"
                >
                  {editingTenant.status === 'active' ? (
                    <ToggleRight size={38} className="text-emerald-500" />
                  ) : (
                    <ToggleLeft size={38} className="text-slate-300" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-5/50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowTenantModal(false)}
                className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100/50 rounded-xl"
              >
                取消
              </button>
              <button 
                onClick={handleSaveTenant}
                className="px-7 py-2.5 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/10 hover:bg-emerald-600 active:scale-95"
              >
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tenant User Management modal */}
      {showUserManageModal && activeTenantForUsers && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">租户关联成员管理</h4>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                    当前租户: <span className="text-blue-600 underline font-black">{activeTenantForUsers.name}</span>
                  </p>
                </div>
              </div>
              <button onClick={() => setShowUserManageModal(false)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  已有成员绑定 ({tenantUsers.length} 人)
                </h5>
                <div className="flex gap-2">
                  <button 
                    onClick={handleQuickCreateUser}
                    className="flex items-center gap-1 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    <PlusCircle size={13} className="text-emerald-500" />
                    快捷新增用户
                  </button>
                  <button 
                    onClick={() => setShowSelectUserPopup(true)}
                    className="flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 px-4 py-1.5 rounded-lg text-xs font-black shadow-md shadow-blue-500/10"
                  >
                    <UserPlus size={13} />
                    关联现有用户
                  </button>
                </div>
              </div>

              {/* Members Table */}
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full border-collapse">
                  <thead className="bg-[#f8fafc] text-slate-500 text-[10px] font-black uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left">成员姓名</th>
                      <th className="px-4 py-3 text-left">手机号</th>
                      <th className="px-4 py-3 text-left">角色角色</th>
                      <th className="px-4 py-3 text-center">当前状态</th>
                      <th className="px-4 py-3 text-center w-24">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {tenantUsers.length > 0 ? (
                      tenantUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-bold text-slate-700">{user.username}</td>
                          <td className="px-4 py-3 font-mono text-slate-500">{user.phone}</td>
                          <td className="px-4 py-3 text-slate-600">{user.role}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              user.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {user.status === 'active' ? '在线启用' : '离线停用'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button 
                              onClick={() => handleRemoveUserFromTenant(user.id, user.username)}
                              className="text-rose-500 hover:text-rose-600 font-bold flex items-center justify-center gap-0.5 mx-auto"
                            >
                              <UserX size={12} />
                              移除
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-300">
                          <Info className="mx-auto mb-1 opacity-20" size={24} />
                          <p className="font-semibold">当前租户尚未纳管任何用户</p>
                          <p className="text-[10px] text-slate-400 mt-1">您可以点击右上方按钮添加系统成员进来</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-6 bg-slate-50/60 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowUserManageModal(false)}
                className="px-6 py-2.5 bg-slate-800 text-white font-black text-xs rounded-xl shadow-lg hover:bg-slate-900 transition-all active:scale-95 animate-pulse"
              >
                完 成
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bind Existing User popup */}
      {showSelectUserPopup && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-black text-slate-700">选择待绑定的系统人员</span>
              <button onClick={() => setShowSelectUserPopup(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 max-h-[300px] overflow-y-auto space-y-2">
              {unassignedUsers.length > 0 ? (
                unassignedUsers.map(user => (
                  <div 
                    key={user.id} 
                    onClick={() => handleAddUserToTenant(user.id)}
                    className="p-3 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 rounded-xl cursor-pointer transition-all flex items-center justify-between font-medium group"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-700 block group-hover:text-emerald-700">{user.username}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{user.phone} ({user.id})</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-400 font-bold px-2 py-0.5 rounded group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      选择绑定 +
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  <UserCheck className="mx-auto text-slate-200 mb-2" size={32} />
                  <p className="text-xs font-bold">所有用户均已归属指定租户</p>
                  <p className="text-[10px] text-slate-400 mt-1">您可以返回上一步快捷新增全新用户</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t text-right">
              <button 
                onClick={() => setShowSelectUserPopup(false)}
                className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-300"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER DUAL CONFIRMATION DELETION MODAL */}
      {tenantToDelete && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden text-sm border border-red-100">
            {/* Header */}
            <div className="p-5 border-b border-red-50 flex items-center justify-between bg-red-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-red-700 text-sm">
                    ⚠️ 极其危险的租户删除操作
                  </h4>
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Tenant Absolute Decommissioning Consent</p>
                </div>
              </div>
              <button 
                onClick={() => setTenantToDelete(null)} 
                className="p-1.5 hover:bg-red-100/60 rounded-full text-red-400 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-red-50/30 border border-red-100/70 p-4 rounded-2xl">
                <p className="text-xs text-red-700 font-bold leading-relaxed mb-1">
                  您确定要注销并永久删除用电租户「{tenantToDelete.name}」吗？
                </p>
                <p className="text-[11px] text-slate-500 leading-normal">
                  此操作将彻底根除该 SAAS 租户的所有隔离权限配置与元数据资产，该租户下原先分配的部门子集、架构、关系数据也将永久丢失，此行为无法回滚或恢复。
                </p>
              </div>

              {/* Requirement Checkboxes */}
              <div className="space-y-3 pt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">双重核对确认事项 (必勾选)</span>
                
                <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox"
                    checked={deleteChecks.understand}
                    onChange={(e) => setDeleteChecks(prev => ({ ...prev, understand: e.target.checked }))}
                    className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500/20 w-3.5 h-3.5 cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-600 font-medium select-none">
                    我已完全知晓此操作是<strong>绝对不可逆</strong>的，且同意注销该租户主体的所有系统服务。
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox"
                    checked={deleteChecks.backedUp}
                    onChange={(e) => setDeleteChecks(prev => ({ ...prev, backedUp: e.target.checked }))}
                    className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500/20 w-3.5 h-3.5 cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-600 font-medium select-none">
                    我确认该租户下相关业务均已妥善备份，并无任何正在运行的核心资产绑定运作。
                  </div>
                </label>
              </div>

              {/* Precise Type Verification string */}
              <div className="space-y-1.5 border-t border-slate-150 pt-4">
                <label className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                  <span>请输入租户名称以确认注销:</span>
                  <span className="font-mono font-bold text-red-600 select-all">「{tenantToDelete.name}」</span>
                </label>
                <input 
                  type="text"
                  placeholder="在此输入完全相同的租户名称"
                  value={deleteInputText}
                  onChange={(e) => setDeleteInputText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-500/50 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none transition-all placeholder:text-slate-350"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
              <button 
                onClick={() => setTenantToDelete(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 font-black text-xs rounded-xl cursor-pointer"
              >
                取消
              </button>
              <button 
                disabled={deleteInputText !== tenantToDelete.name || !deleteChecks.understand || !deleteChecks.backedUp}
                onClick={handleConfirmDeleteTenant}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-black text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 hover:shadow-red-500/15"
              >
                <Trash2 size={13} />
                确认注销并删除租户
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default TenantManagement;
