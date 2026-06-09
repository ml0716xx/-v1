import React, { useState, useMemo } from 'react';
import { Tenant, OrgNode, SystemUser, SystemRole } from '../types';
import { 
  Users, 
  Search, 
  RotateCcw, 
  Plus, 
  X, 
  Check, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Shield, 
  ToggleLeft, 
  ToggleRight, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  Building,
  GitMerge,
  Eye,
  KeyRound
} from 'lucide-react';
import { INITIAL_ROLES } from './sharedSeedData';

interface PermissionManagementProps {
  tenants: Tenant[];
  orgs: OrgNode[];
  users: SystemUser[];
  setUsers: React.Dispatch<React.SetStateAction<SystemUser[]>>;
}

export const PermissionManagement: React.FC<PermissionManagementProps> = ({
  tenants,
  orgs,
  users,
  setUsers
}) => {
  // Navigation: 'users' | 'roles'
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

  // Multi-tenant Roles
  const [roles, setRoles] = useState<SystemRole[]>(INITIAL_ROLES);

  // User Management State Filters
  const [userFilters, setUserFilters] = useState({
    username: '',
    phone: '',
    role: '全部',
    status: '全部'
  });

  // Role Management State Filters
  const [roleSearch, setRoleSearch] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPageInput, setJumpPageInput] = useState('');

  // Modals state
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<SystemUser> | null>(null);
  const [viewingUserOrgs, setViewingUserOrgs] = useState<SystemUser | null>(null);
  
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Partial<SystemRole> | null>(null);
  
  const [userErrors, setUserErrors] = useState<Record<string, string>>({});
  const [roleErrors, setRoleErrors] = useState<Record<string, string>>({});

  // Dynamic dropdown values
  const uniqueRolesForFilter = useMemo(() => {
    // Collect all roles currently assigned to users or in roles pool
    const userRoles = users.map(u => u.role).filter(r => r && r !== '-');
    const rolePoolNames = roles.map(r => r.roleName);
    return Array.from(new Set([...userRoles, ...rolePoolNames]));
  }, [users, roles]);

  const tenantNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    tenants.forEach(t => {
      map[t.id] = t.name;
    });
    return map;
  }, [tenants]);

  const orgNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    orgs.forEach(o => {
      map[o.id] = o.name;
    });
    return map;
  }, [orgs]);

  // Compute filtered Users (exactly as screenshot query)
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchName = !userFilters.username || user.username.toLowerCase().includes(userFilters.username.toLowerCase());
      const matchPhone = !userFilters.phone || user.phone.includes(userFilters.phone);
      const matchRole = userFilters.role === '全部' || user.role === userFilters.role;
      
      let matchStatus = true;
      if (userFilters.status === '启用') {
        matchStatus = user.status === 'active';
      } else if (userFilters.status === '停用') {
        matchStatus = user.status === 'inactive';
      }
      
      return matchName && matchPhone && matchRole && matchStatus;
    });
  }, [users, userFilters]);

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    return roles.filter(r => 
      r.roleName.toLowerCase().includes(roleSearch.toLowerCase()) ||
      r.id.toLowerCase().includes(roleSearch.toLowerCase())
    );
  }, [roles, roleSearch]);

  // Paginated Users list
  const totalUserCount = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalUserCount / pageSize));
  
  const paginatedUsers = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIdx, startIdx + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Handlers for User Filters
  const handleQueryUsers = () => {
    setCurrentPage(1); // Reset page on query
  };

  const handleResetFilters = () => {
    setUserFilters({
      username: '',
      phone: '',
      role: '全部',
      status: '全部'
    });
    setCurrentPage(1);
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
  };

  const handleOpenAddUser = () => {
    setEditingUser({
      id: '',
      username: '',
      phone: '',
      role: '普通成员',
      status: 'active',
      tenantId: tenants[0]?.id || '',
      orgId: '',
      tenantIds: tenants[0]?.id ? [tenants[0].id] : [],
      orgIds: []
    });
    setUserErrors({});
    setShowUserModal(true);
  };

  const handleOpenEditUser = (user: SystemUser) => {
    const tenantIds = user.tenantIds || (user.tenantId ? [user.tenantId] : []);
    const orgIds = user.orgIds || (user.orgId ? [user.orgId] : []);
    setEditingUser({ 
      ...user,
      tenantIds,
      orgIds
    });
    setUserErrors({});
    setShowUserModal(true);
  };

  const handleToggleTenantAssociation = (tenantId: string) => {
    if (!editingUser) return;
    const currentTenants = [...(editingUser.tenantIds || [])];
    const isCurrentlyAssigned = currentTenants.includes(tenantId);
    
    let nextTenants: string[];
    let nextOrgs = [...(editingUser.orgIds || [])];
    if (isCurrentlyAssigned) {
      nextTenants = currentTenants.filter(id => id !== tenantId);
      // Remove all organization ids belonging to this tenant too
      nextOrgs = nextOrgs.filter(oid => {
        const o = orgs.find(node => node.id === oid);
        return o?.tenantId !== tenantId;
      });
    } else {
      nextTenants = [...currentTenants, tenantId];
    }
    
    setEditingUser({
      ...editingUser,
      tenantId: nextTenants[0] || '',
      orgId: nextOrgs[0] || '',
      tenantIds: nextTenants,
      orgIds: nextOrgs
    });
  };

  const handleToggleOrgAssociation = (orgNode: OrgNode) => {
    if (!editingUser) return;
    const currentOrgs = [...(editingUser.orgIds || [])];
    const isCurrentlyAssigned = currentOrgs.includes(orgNode.id);
    
    let nextOrgs: string[];
    if (isCurrentlyAssigned) {
      nextOrgs = currentOrgs.filter(id => id !== orgNode.id);
    } else {
      nextOrgs = [...currentOrgs, orgNode.id];
    }
    
    // Auto-ensure the parent tenantId is in tenantIds
    let nextTenants = [...(editingUser.tenantIds || [])];
    if (!isCurrentlyAssigned && orgNode.tenantId && !nextTenants.includes(orgNode.tenantId)) {
      nextTenants.push(orgNode.tenantId);
    }
    
    setEditingUser({
      ...editingUser,
      tenantId: nextTenants[0] || '',
      orgId: nextOrgs[0] || '',
      tenantIds: nextTenants,
      orgIds: nextOrgs
    });
  };

  const handleSaveUser = () => {
    if (!editingUser) return;
    const errors: Record<string, string> = {};
    if (!editingUser.username?.trim()) errors.username = '请输入用户名称';
    if (!editingUser.phone?.trim()) {
      errors.phone = '请输入手机号';
    } else if (!/^\d{11}$/.test(editingUser.phone)) {
      errors.phone = '请输入11位数字手机号';
    }

    if (Object.keys(errors).length > 0) {
      setUserErrors(errors);
      return;
    }

    if (editingUser.id) {
      // Edit
      setUsers(prev => prev.map(u => u.id === editingUser.id ? (editingUser as SystemUser) : u));
    } else {
      // Create - get next custom code ID
      const userNumbers = users.map(u => parseInt(u.id.substring(1))).filter(n => !isNaN(n));
      const maxNum = userNumbers.length > 0 ? Math.max(...userNumbers) : 51;
      const nextId = `U${String(maxNum + 1).padStart(5, '0')}`;
      
      const newUser: SystemUser = {
        ...(editingUser as SystemUser),
        id: nextId,
        registrationTime: new Date().toISOString().replace('T', ' ').split('.')[0],
        lastLogin: ''
      };
      setUsers(prev => [newUser, ...prev]);
    }
    setShowUserModal(false);
  };

  const handleDeleteUser = (id: string, username: string) => {
    if (window.confirm(`确认注销并删除系统用户账号「${username}」吗？\n删除后该用户将彻底失去登录所有系统的权限。`)) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  // Organization suggestions filter depending on selected Tenant inside editingUser form
  const availableOrgsForEditingUser = useMemo(() => {
    if (!editingUser?.tenantId) return [];
    return orgs.filter(o => o.tenantId === editingUser.tenantId);
  }, [orgs, editingUser?.tenantId]);

  // Handlers for Role Custom Actions
  const handleOpenAddRole = () => {
    setEditingRole({
      id: '',
      roleName: '',
      remarks: ''
    });
    setRoleErrors({});
    setShowRoleModal(true);
  };

  const handleOpenEditRole = (role: SystemRole) => {
    setEditingRole({ ...role });
    setRoleErrors({});
    setShowRoleModal(true);
  };

  const handleSaveRole = () => {
    if (!editingRole || !editingRole.roleName?.trim()) {
      setRoleErrors({ roleName: '请输入角色名称' });
      return;
    }

    if (editingRole.id) {
      // Update
      setRoles(prev => prev.map(r => r.id === editingRole.id ? (editingRole as SystemRole) : r));
    } else {
      // Create
      const newRole: SystemRole = {
        id: `R${String(roles.length + 1).padStart(2, '0')}-${Date.now().toString().slice(-3)}`,
        roleName: editingRole.roleName,
        remarks: editingRole.remarks || '',
        createdAt: new Date().toISOString().replace('T', ' ').split('.')[0]
      };
      setRoles(prev => [...prev, newRole]);
    }
    setShowRoleModal(false);
  };

  const handleDeleteRole = (id: string, name: string) => {
    const isUsing = users.some(u => u.role === name);
    if (isUsing) {
      alert(`无法删除角色「${name}」！\n当前已有系统用户被授予了该角色身份，请先在“用户管理”中调整相关用户的角色配置，再行注销该角色。`);
      return;
    }

    if (window.confirm(`确定废止并删除角色配置「${name}」吗？`)) {
      setRoles(prev => prev.filter(r => r.id !== id));
    }
  };

  // Pagination Helper Page Jump triggers
  const executeJumpPage = () => {
    const parsed = parseInt(jumpPageInput);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      setCurrentPage(parsed);
    }
    setJumpPageInput('');
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      
      {/* Breadcrumb Info path */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 px-1">
        <span>系统管理</span>
        <span className="opacity-50">/</span>
        <span className="text-emerald-600 font-semibold">权限管理 (用户与角色)</span>
      </div>

      {/* Embedded Top Tabs Selector */}
      <div className="bg-white border border-slate-100 rounded-2xl p-2.5 flex gap-2 w-fit shadow-xs">
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-black transition-all rounded-xl ${
            activeTab === 'users' 
              ? 'bg-[#1e293b] text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users size={14} />
          用户管理 (User Directory)
        </button>
        <button 
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-black transition-all rounded-xl ${
            activeTab === 'roles' 
              ? 'bg-[#1e293b] text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <KeyRound size={14} />
          角色配置 (Role Matrix)
        </button>
      </div>

      {/* TAB SUB-PANEL 1: USER LIST */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Query Filter Area exactly matching screenshot inputs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-end gap-5">
            <div className="flex flex-col gap-1.5 min-w-[150px] flex-1">
              <span className="text-xs font-bold text-slate-500">用户名称</span>
              <input 
                type="text" 
                placeholder="请输入用户名称"
                value={userFilters.username}
                onChange={e => setUserFilters(prev => ({ ...prev, username: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs font-medium outline-none transition-all focus:bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5 min-w-[150px] flex-1">
              <span className="text-xs font-bold text-slate-500">手机号</span>
              <input 
                type="text" 
                placeholder="请输入手机号"
                value={userFilters.phone}
                onChange={e => setUserFilters(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs font-medium outline-none transition-all focus:bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5 min-w-[150px]">
              <span className="text-xs font-bold text-slate-500">角色</span>
              <select 
                value={userFilters.role}
                onChange={e => setUserFilters(prev => ({ ...prev, role: e.target.value }))}
                className="bg-slate-50 border border-slate-200 hover:border-slate-350 text-xs font-bold text-slate-700 rounded-xl px-3.5 py-2 outline-none"
              >
                <option value="全部">全部角色</option>
                {uniqueRolesForFilter.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 min-w-[120px]">
              <span className="text-xs font-bold text-slate-500">状态</span>
              <select 
                value={userFilters.status}
                onChange={e => setUserFilters(prev => ({ ...prev, status: e.target.value }))}
                className="bg-slate-50 border border-slate-200 hover:border-slate-350 text-xs font-bold text-slate-700 rounded-xl px-3.5 py-2 outline-none"
              >
                <option value="全部">请选择状态</option>
                <option value="启用">启用</option>
                <option value="停用">停用</option>
              </select>
            </div>

            <div className="flex gap-2.5">
              <button 
                onClick={handleQueryUsers}
                className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-black transition-all shadow-sm active:scale-95"
              >
                <Search size={13} />
                查询
              </button>
              <button 
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-5 py-2 rounded-xl text-xs font-black transition-all active:scale-95"
              >
                <RotateCcw size={13} />
                重置
              </button>
            </div>
          </div>

          {/* Action Row & Table */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            
            {/* Upper control header */}
            <div className="p-4 bg-slate-50/50 border-b border-rose-50/5 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold">
                查询到 {totalUserCount} 份在册安全用户记录 (展示第 {(currentPage-1)*pageSize+1}-{Math.min(currentPage*pageSize, totalUserCount)} 条)
              </span>
              <button 
                onClick={handleOpenAddUser}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm"
              >
                <Plus size={14} />
                新建用户
              </button>
            </div>

            {/* List Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 text-xs font-bold uppercase">
                  <tr>
                    <th className="px-6 py-4 text-left">用户ID</th>
                    <th className="px-6 py-4 text-left">用户名称</th>
                    <th className="px-6 py-4 text-left">手机号</th>
                    <th className="px-6 py-4 text-left">角色</th>
                    <th className="px-6 py-4 text-left">所属租户/分支架构</th>
                    <th className="px-6 py-4 text-left">注册时间</th>
                    <th className="px-6 py-4 text-left">最近登录</th>
                    <th className="px-6 py-4 text-center">状态</th>
                    <th className="px-6 py-4 text-center w-36">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map(user => {
                      const uTenants = user.tenantIds && user.tenantIds.length > 0 ? user.tenantIds : (user.tenantId ? [user.tenantId] : []);
                      const uOrgs = user.orgIds && user.orgIds.length > 0 ? user.orgIds : (user.orgId ? [user.orgId] : []);
                      const isMulti = uTenants.length > 1 || uOrgs.length > 1;
                      
                      const primaryTenantId = uTenants[0] || user.tenantId || '';
                      const primaryTenantName = primaryTenantId ? tenantNameMap[primaryTenantId] : '';
                      const primaryOrgId = uOrgs[0] || user.orgId || '';
                      const primaryOrgName = primaryOrgId ? orgNameMap[primaryOrgId] : '';

                      return (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-slate-500">{user.id}</td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-800 text-sm block">{user.username}</span>
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-500">{user.phone}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              user.role === '管理员' || user.role === '超级管理员' 
                                ? 'bg-indigo-50 text-indigo-600' 
                                : user.role === '-' 
                                ? 'bg-slate-100 text-slate-400' 
                                : 'bg-slate-100 text-slate-750'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {isMulti ? (
                              <div className="flex items-center gap-2">
                                <div className="flex flex-col gap-0.5 max-w-[140px]">
                                  <span className="text-[10px] border-b border-dotted border-blue-300 pb-0.5 text-blue-600 font-bold truncate flex items-center gap-0.5 cursor-help" title={primaryTenantName}>
                                    <Building size={10} />
                                    {primaryTenantName || '多部门/租户'}
                                  </span>
                                  {primaryOrgName && (
                                    <span className="text-[9px] text-emerald-600 font-medium truncate flex items-center gap-0.5" title={primaryOrgName}>
                                      <GitMerge size={9} />
                                      {primaryOrgName}
                                    </span>
                                  )}
                                </div>
                                <button 
                                  onClick={() => setViewingUserOrgs(user)}
                                  className="shrink-0 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-[10px] min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center cursor-pointer shadow-xs transition-all hover:scale-110 active:scale-95 border-none font-mono"
                                  title={`点击数字查看全部 ${uOrgs.length} 个组织架构`}
                                >
                                  {uOrgs.length}
                                </button>
                              </div>
                            ) : primaryTenantName ? (
                              <div className="flex flex-col gap-0.5 max-w-[180px]">
                                <span className="text-[10px] text-blue-600 font-bold truncate flex items-center gap-0.5">
                                  <Building size={10} />
                                  {primaryTenantName}
                                </span>
                                {primaryOrgName && (
                                  <span className="text-[9px] text-emerald-600 font-medium truncate flex items-center gap-0.5">
                                    <GitMerge size={9} />
                                    {primaryOrgName}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-350 text-[10px] italic">无宿主归属</span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-400">{user.registrationTime}</td>
                          <td className="px-6 py-4 font-mono text-slate-450">{user.lastLogin || '-'}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              user.status === 'active' ? 'text-emerald-500' : 'text-slate-400'
                            }`}>
                              <div className={`w-1 h-1 rounded-full ${user.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-350'}`} />
                              {user.status === 'active' ? '● 启用' : '● 停用'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3">
                              <button 
                                onClick={() => handleOpenEditUser(user)}
                                className="text-blue-500 hover:text-blue-700 font-bold hover:underline"
                              >
                                编辑
                              </button>
                              
                              {/* Toggle Switch */}
                              <button 
                                onClick={() => handleToggleUserStatus(user.id)}
                                className="focus:outline-none flex items-center"
                                title={user.status === 'active' ? '点击停用' : '点击启用'}
                              >
                                {user.status === 'active' ? (
                                  <ToggleRight size={24} className="text-blue-500" />
                                ) : (
                                  <ToggleLeft size={24} className="text-slate-300" />
                                )}
                              </button>

                              <button 
                                onClick={() => handleDeleteUser(user.id, user.username)}
                                className="text-rose-450 hover:text-rose-600"
                                title="删除用户"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-16 text-center text-slate-300">
                        <Users className="opacity-10 mx-auto mb-2" size={44} />
                        <p className="text-xs">未查询到符合过滤条件的人员录档</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination block - matches screenshot styling */}
            <div className="p-4 bg-[#f8fafc] border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-500">
              <div>
                共 {totalUserCount} 条记录 第 {currentPage}/{totalPages} 页
              </div>
              
              <div className="flex items-center gap-4">
                
                {/* Micro numerical pages selectors */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                    const isCurrent = p === currentPage;
                    return (
                      <button 
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-7 h-7 flex items-center justify-center rounded text-xs transition-colors ${
                          isCurrent 
                            ? 'bg-blue-500 text-white font-black' 
                            : 'hover:bg-slate-100 text-slate-600 font-bold'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Page sizes */}
                <select 
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none text-xs text-slate-600 font-bold"
                >
                  <option value={5}>5 条/页</option>
                  <option value={10}>10 条/页</option>
                  <option value={20}>20 条/页</option>
                  <option value={50}>50 条/页</option>
                </select>

                {/* Go to input */}
                <div className="flex items-center gap-1">
                  <span>跳转</span>
                  <input 
                    type="text" 
                    value={jumpPageInput}
                    onChange={e => setJumpPageInput(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={e => { if (e.key === 'Enter') executeJumpPage(); }}
                    className="w-10 bg-white border border-slate-200 rounded-lg py-1 text-center outline-none font-bold text-xs"
                  />
                  <span>页</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB SUB-PANEL 2: ROLE LIST */}
      {activeTab === 'roles' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="按照角色名称或对应ID检索..."
                value={roleSearch}
                onChange={e => setRoleSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-bold outline-none"
              />
              {roleSearch && (
                <button onClick={() => setRoleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-600">
                  <X size={12} />
                </button>
              )}
            </div>

            <button 
              onClick={handleOpenAddRole}
              className="flex items-center gap-1.5 bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-sm active:scale-95"
            >
              <Plus size={14} />
              录入新增角色
            </button>
          </div>

          {/* Roles list */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-[#1e293b] text-slate-300 text-xs font-bold uppercase">
                  <tr>
                    <th className="px-6 py-4 text-left">角色命名</th>
                    <th className="px-6 py-4 text-left">对应矩阵ID</th>
                    <th className="px-6 py-4 text-left">建置时间</th>
                    <th className="px-6 py-4 text-left">角色职能备注描述</th>
                    <th className="px-6 py-4 text-center w-36">管理操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-650">
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map(role => (
                      <tr key={role.id} className="hover:bg-slate-50/55 transition-colors">
                        <td className="px-6 py-4 font-extrabold text-slate-800 text-sm">
                          <div className="flex items-center gap-2">
                            <Shield size={14} className="text-blue-500 shrink-0" />
                            {role.roleName}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-500">{role.id}</td>
                        <td className="px-6 py-4 font-mono text-slate-400">{role.createdAt}</td>
                        <td className="px-6 py-4 text-slate-500 max-w-sm truncate">{role.remarks || '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-4 font-bold">
                            <button 
                              onClick={() => handleOpenEditRole(role)}
                              className="text-blue-500 hover:text-blue-700 flex items-center gap-0.5"
                            >
                              <Edit3 size={12} />
                              编辑
                            </button>
                            <button 
                              onClick={() => handleDeleteRole(role.id, role.roleName)}
                              className="text-rose-500 hover:text-rose-600 flex items-center gap-0.5"
                            >
                              <Trash2 size={12} />
                              注销
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-300 animate-pulse">
                        <Shield className="opacity-10 mx-auto mb-2" size={44} />
                        <span className="text-xs">未搜索到相匹配的作用角色</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* MODAL: ADD/EDIT USER */}
      {showUserModal && editingUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden text-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">
                    {editingUser.id ? '编辑安全员档案' : '录入新系统用户'}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Configure user credentials and organization mapping</p>
                </div>
              </div>
              <button onClick={() => setShowUserModal(false)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-450 uppercase block">用户名称 (Name)</label>
                <input 
                  type="text" 
                  value={editingUser.username || ''}
                  onChange={e => setEditingUser({ ...editingUser, username: e.target.value })}
                  placeholder="请输入完整姓名"
                  className={`w-full bg-slate-50 border ${userErrors.username ? 'border-rose-400 focus:ring-rose-500/5' : 'border-slate-200 focus:ring-blue-500/5'} rounded-xl px-4 py-2.5 outline-none font-bold text-slate-705 focus:ring-4`}
                />
                {userErrors.username && <p className="text-[10px] text-rose-500 font-bold ml-1">{userErrors.username}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-450 uppercase block">手机号码 (11位数字)</label>
                <input 
                  type="text" 
                  maxLength={11}
                  value={editingUser.phone || ''}
                  onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                  placeholder="如：13482772194"
                  className={`w-full bg-slate-50 border ${userErrors.phone ? 'border-rose-400 focus:ring-rose-500/5' : 'border-slate-200 focus:ring-blue-500/5'} rounded-xl px-4 py-2.5 font-mono text-slate-650 outline-none focus:ring-4`}
                />
                {userErrors.phone && <p className="text-[10px] text-rose-500 font-bold ml-1">{userErrors.phone}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-450 uppercase block">赋予系统角色</label>
                  <select 
                    value={editingUser.role || '普通成员'}
                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5"
                  >
                    <option value="-">-</option>
                    <option value="管理员">管理员</option>
                    <option value="超级管理员">超级管理员</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.roleName}>{r.roleName}</option>
                    ))}
                  </select>
                </div>

                {/* Multiple Tenants & Branches Authorization Section */}
                <div className="col-span-2 border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-3 mt-2">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.55">
                      <Building size={12} className="text-blue-500 shrink-0" />
                      园区多租户分支架构选择 (授权绑定)
                    </span>
                    <span className="text-[9px] bg-blue-50 text-blue-600 font-mono font-bold px-2 py-0.5 rounded-full">
                      已选 {(editingUser.orgIds || []).length} 个组织分支
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-slate-400 leading-normal mb-1">
                    系统支持用户隶属于多租户、多架构。勾选下方租户及其子级组织，点击数额将直观展现。
                  </p>

                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 py-1 custom-scrollbar">
                    {tenants.map(tenant => {
                      const tenantRelatedOrgs = orgs.filter(o => o.tenantId === tenant.id);
                      const isTenantSelected = (editingUser.tenantIds || []).includes(tenant.id);
                      
                      return (
                        <div key={tenant.id} className="bg-white border border-slate-100 rounded-xl p-3 space-y-2 shadow-xs transition-colors hover:border-slate-200">
                          <label className="flex items-center gap-2 cursor-pointer font-extrabold text-xs text-slate-700">
                            <input 
                              type="checkbox"
                              checked={isTenantSelected}
                              onChange={() => handleToggleTenantAssociation(tenant.id)}
                              className="rounded border-slate-300 text-blue-500 focus:ring-blue-500/20 w-3.5 h-3.5 cursor-pointer"
                            />
                            <span className="truncate block max-w-[210px]">{tenant.name}</span>
                          </label>

                          {/* Orgs of this tenant */}
                          {tenantRelatedOrgs.length > 0 ? (
                            <div className="ml-5 grid grid-cols-2 gap-2 border-l border-dashed border-slate-200 pl-3">
                              {tenantRelatedOrgs.map(org => {
                                const isOrgSelected = (editingUser.orgIds || []).includes(org.id);
                                
                                return (
                                  <label key={org.id} className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-500 hover:text-slate-800 transition-colors">
                                    <input 
                                      type="checkbox"
                                      checked={isOrgSelected}
                                      disabled={!isTenantSelected}
                                      onChange={() => handleToggleOrgAssociation(org)}
                                      className="rounded border-slate-200 text-emerald-500 focus:ring-emerald-500/25 w-3 h-3 cursor-pointer disabled:opacity-40"
                                    />
                                    <span className="truncate block max-w-[100px]" title={org.name}>{org.name}</span>
                                  </label>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-[9px] text-slate-400 italic ml-5">该租户下无可供勾选的分支部门</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-750">当前激活使能状态</span>
                <button 
                  onClick={() => setEditingUser({ ...editingUser, status: editingUser.status === 'active' ? 'inactive' : 'active' })}
                  className="focus:outline-none"
                >
                  {editingUser.status === 'active' ? (
                    <ToggleRight size={38} className="text-blue-500" />
                  ) : (
                    <ToggleLeft size={38} className="text-slate-300" />
                  )}
                </button>
              </div>

            </div>

            <div className="p-5 bg-slate-50 border-t flex justify-end gap-3">
              <button 
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 text-xs font-bold bg-white text-slate-550 border border-slate-200 rounded-xl hover:bg-slate-100"
              >
                取消
              </button>
              <button 
                onClick={handleSaveUser}
                className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                保存资料
              </button>
            </div>
          </div>
        </div>
      )}

    {/* MODAL: VIEW ALL USER ARCHITECTURES */}
    {viewingUserOrgs && (
      <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden text-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                {(viewingUserOrgs.orgIds || []).length || (viewingUserOrgs.orgId ? 1 : 0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  「{viewingUserOrgs.username}」隶属多架构详情
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Multi-Tenant & Branches Assignment Matrix</p>
              </div>
            </div>
            <button 
              onClick={() => setViewingUserOrgs(null)} 
              className="p-1 hover:bg-slate-200 rounded-full text-slate-400 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar">
            <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400">用户手机号：</span>
                <span className="font-mono text-slate-700 font-bold">{viewingUserOrgs.phone}</span>
              </div>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="font-bold text-slate-400">赋予系统角色：</span>
                <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold text-[10px]">{viewingUserOrgs.role}</span>
              </div>
            </div>

            <span className="text-[10px] font-black text-slate-450 uppercase block tracking-wider mb-2">已获授权之全部所属架构一览 ({((viewingUserOrgs.tenantIds || (viewingUserOrgs.tenantId ? [viewingUserOrgs.tenantId] : [])).length)} 个租户主体)</span>
            
            <div className="space-y-3">
              {(viewingUserOrgs.tenantIds || (viewingUserOrgs.tenantId ? [viewingUserOrgs.tenantId] : [])).map(tId => {
                const tName = tenantNameMap[tId] || '未知租户';
                // Get selected orgs under this tenant
                const tOrgIds = (viewingUserOrgs.orgIds || (viewingUserOrgs.orgId ? [viewingUserOrgs.orgId] : [])).filter(oid => {
                  const orgNode = orgs.find(o => o.id === oid);
                  return orgNode?.tenantId === tId;
                });

                return (
                  <div key={tId} className="border border-slate-200 rounded-2xl p-4 space-y-2.5 bg-white shadow-xs">
                    <div className="flex items-start gap-2 border-b border-slate-100 pb-2">
                      <Building size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black text-xs text-slate-800 leading-tight">{tName}</p>
                        <p className="text-[9px] text-slate-400 font-mono font-bold mt-0.5">ID: {tId}</p>
                      </div>
                    </div>

                    {tOrgIds.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {tOrgIds.map(oid => {
                          const oName = orgNameMap[oid] || '部门名缺失';
                          return (
                            <span 
                              key={oid} 
                              className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-xl text-[10px] font-bold border border-emerald-100"
                            >
                              <GitMerge size={9} />
                              {oName}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 italic">该租户下无映射部门 (具有全域基础权限)</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t flex justify-end">
            <button 
              onClick={() => setViewingUserOrgs(null)}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer border-none"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    )}

      {/* MODAL: ADD/EDIT ROLE */}
      {showRoleModal && editingRole && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-250">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="font-extrabold text-slate-800 text-sm">
                {editingRole.id ? '编辑角色配置' : '开辟新增角色矩阵'}
              </span>
              <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-450 tracking-wider block uppercase">角色名称 (如: 高级配电分析主任)</label>
                <input 
                  type="text" 
                  value={editingRole.roleName || ''}
                  onChange={e => setEditingRole({ ...editingRole, roleName: e.target.value })}
                  placeholder="请输入角色名称"
                  className={`w-full bg-slate-50 border ${roleErrors.roleName ? 'border-rose-400' : 'border-slate-200'} rounded-xl px-4 py-2.5 outline-none font-bold text-slate-700`}
                />
                {roleErrors.roleName && <p className="text-[10px] text-rose-500 font-bold ml-1">{roleErrors.roleName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-450 tracking-wider block uppercase">角色职能补充备注</label>
                <textarea 
                  rows={3}
                  value={editingRole.remarks || ''}
                  onChange={e => setEditingRole({ ...editingRole, remarks: e.target.value })}
                  placeholder="简单描写本级角色所持有的查看、决策机制或管辖说明"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none text-slate-600"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t flex justify-end gap-2.5">
              <button 
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 bg-white hover:bg-slate-100 rounded-lg"
              >
                取消
              </button>
              <button 
                onClick={handleSaveRole}
                className="px-5 py-2 bg-blue-500 text-white hover:bg-blue-600 font-bold text-xs rounded-lg"
              >
                确定开辟
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default PermissionManagement;
