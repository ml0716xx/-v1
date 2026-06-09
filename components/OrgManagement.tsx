import React, { useState, useMemo } from 'react';
import { Tenant, OrgNode, SystemUser } from '../types';
import { 
  Network, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Edit3, 
  Trash2, 
  FolderPlus, 
  Briefcase, 
  Users, 
  X, 
  Info, 
  Check, 
  UserPlus, 
  UserMinus, 
  GitFork,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';

interface OrgManagementProps {
  tenants: Tenant[];
  orgs: OrgNode[];
  setOrgs: React.Dispatch<React.SetStateAction<OrgNode[]>>;
  users: SystemUser[];
  setUsers: React.Dispatch<React.SetStateAction<SystemUser[]>>;
}

export const OrgManagement: React.FC<OrgManagementProps> = ({
  tenants,
  orgs,
  setOrgs,
  users,
  setUsers
}) => {
  // Select active tenant - default to first active tenant
  const activeTenants = useMemo(() => tenants.filter(t => t.status === 'active'), [tenants]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>(() => {
    return activeTenants[0]?.id || tenants[0]?.id || '';
  });

  // Active Tenant Org Nodes
  const activeTenantOrgs = useMemo(() => {
    return orgs.filter(o => o.tenantId === selectedTenantId);
  }, [orgs, selectedTenantId]);

  // Selected Node in Tree
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(() => {
    const firstRoot = orgs.find(o => o.tenantId === selectedTenantId && !o.parentId);
    return firstRoot?.id || null;
  });

  // State to track collapsed/expanded nodes
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'O10': true, // Auto-expand T01 root "总部" by default
    'O20': true  // Auto-expand T02 root "生产计划部" by default
  });

  // Edit/Add Node Modals
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [editingNode, setEditingNode] = useState<Partial<OrgNode> | null>(null);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Custom double-confirmation delete states for Org Node
  const [nodeToDelete, setNodeToDelete] = useState<{ id: string; name: string } | null>(null);
  const [nodeDeleteInputText, setNodeDeleteInputText] = useState('');
  const [nodeDeleteCheck, setNodeDeleteCheck] = useState(false);

  // Derive active tenant object
  const activeTenant = useMemo(() => {
    return tenants.find(t => t.id === selectedTenantId) || null;
  }, [tenants, selectedTenantId]);

  // Derive active node object
  const activeNode = useMemo(() => {
    return activeTenantOrgs.find(o => o.id === selectedNodeId) || activeTenantOrgs[0] || null;
  }, [activeTenantOrgs, selectedNodeId]);

  // Expand or collapse a node
  const toggleNodeExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Build hierarchial tree structure of organizations for rendering
  const treeRoots = useMemo(() => {
    const rootNodes = activeTenantOrgs.filter(o => !o.parentId);
    return rootNodes;
  }, [activeTenantOrgs]);

  const treeChildrenMap = useMemo(() => {
    const map: Record<string, OrgNode[]> = {};
    activeTenantOrgs.forEach(o => {
      if (o.parentId) {
        if (!map[o.parentId]) map[o.parentId] = [];
        map[o.parentId].push(o);
      }
    });
    return map;
  }, [activeTenantOrgs]);

  // Users belonging to selected organization node
  const orgUsers = useMemo(() => {
    if (!activeNode) return [];
    return users.filter(u => u.orgId === activeNode.id);
  }, [users, activeNode]);

  // Users in the same tenant who *aren't* in this org node.
  // These are candidates to be added to this node.
  const eligibleTenantUsers = useMemo(() => {
    return users.filter(u => u.tenantId === selectedTenantId && u.orgId !== activeNode?.id);
  }, [users, selectedTenantId, activeNode]);

  const nodeUserCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach(u => {
      if (u.orgId) {
        counts[u.orgId] = (counts[u.orgId] || 0) + 1;
      }
    });
    return counts;
  }, [users]);

  // Action: Open Modal to Add Node
  const handleOpenAddNode = (parentId: string | null) => {
    setEditingNode({
      id: '',
      name: '',
      remarks: '',
      parentId: parentId,
      tenantId: selectedTenantId
    });
    setErrors({});
    setShowNodeModal(true);
  };

  const handleOpenEditNode = (node: OrgNode) => {
    setEditingNode({ ...node });
    setErrors({});
    setShowNodeModal(true);
  };

  const handleSaveNode = () => {
    if (!editingNode || !editingNode.name?.trim()) {
      setErrors({ name: '请输入部门/组织名称' });
      return;
    }

    if (editingNode.id) {
      // Update
      setOrgs(prev => prev.map(o => o.id === editingNode.id ? (editingNode as OrgNode) : o));
    } else {
      // Insert
      const newId = `O${Date.now().toString().slice(-4)}`;
      const newNode: OrgNode = {
        id: newId,
        name: editingNode.name,
        parentId: editingNode.parentId || null,
        tenantId: selectedTenantId,
        remarks: editingNode.remarks || '',
        createdAt: new Date().toISOString().replace('T', ' ').split('.')[0]
      };
      setOrgs(prev => [...prev, newNode]);
      // Set newly created node as selected and expand its parent
      setSelectedNodeId(newId);
      if (editingNode.parentId) {
        setExpandedNodes(prev => ({ ...prev, [editingNode.parentId!]: true }));
      }
    }
    setShowNodeModal(false);
  };

  const handleDeleteNode = (id: string, name: string) => {
    const userCount = nodeUserCounts[id] || 0;
    if (userCount > 0) {
      alert(`无法解散部门「${name}」！\n该组织架构节点目前包含 ${userCount} 名在册成员。请先移除组织下的所有成员，再解散部门。`);
      return;
    }

    // Also check if it has children nodes
    const hasChildren = orgs.some(o => o.parentId === id);
    if (hasChildren) {
      alert(`无法删除部门「${name}」！\n该节点下包含子级分支，请先依次删除或解脱子级组织节点层级，然后再行主节点删除。`);
      return;
    }

    setNodeToDelete({ id, name });
    setNodeDeleteInputText('');
    setNodeDeleteCheck(false);
  };

  const handleConfirmDeleteNode = () => {
    if (!nodeToDelete) return;
    if (nodeDeleteInputText !== nodeToDelete.name) return;
    if (!nodeDeleteCheck) return;

    setOrgs(prev => prev.filter(o => o.id !== nodeToDelete.id));
    if (selectedNodeId === nodeToDelete.id) {
      setSelectedNodeId(null);
    }
    setNodeToDelete(null);
  };

  // Add User to Organization Node (sets user's orgId)
  const handleAssignUserToOrg = (userId: string) => {
    if (!activeNode) return;
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, orgId: activeNode.id } : u
    ));
    setShowAddUserModal(false);
  };

  // Remove User from Organization Node (clears user's orgId but keeps tenantId)
  const handleRemoveUserFromOrg = (userId: string, name: string) => {
    if (window.confirm(`确定将「${name}」移出该组织架构吗？\n(这不影响其所属租户，仅清空部门归属)`)) {
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, orgId: undefined } : u
      ));
    }
  };

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: OrgNode, depth: number = 0) => {
    const children = treeChildrenMap[node.id] || [];
    const isExpanded = !!expandedNodes[node.id];
    const isSelected = selectedNodeId === node.id;
    const userCount = nodeUserCounts[node.id] || 0;

    return (
      <div key={node.id} className="flex flex-col mt-0.5 select-none">
        
        {/* Node Bar info row */}
        <div 
          onClick={() => setSelectedNodeId(node.id)}
          className={`flex items-center justify-between group px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
            isSelected 
              ? 'bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-500/10' 
              : 'hover:bg-slate-50 text-slate-700'
          }`}
          style={{ paddingLeft: `${Math.max(12, depth * 20)}px` }}
        >
          <div className="flex items-center gap-2 min-w-0">
            {children.length > 0 ? (
              <button 
                onClick={(e) => toggleNodeExpand(node.id, e)}
                className={`p-1 rounded-md transition-colors ${
                  isSelected ? 'hover:bg-emerald-600' : 'hover:bg-slate-100'
                }`}
              >
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
            ) : (
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-300'}`} />
              </div>
            )}
            
            <Briefcase size={14} className={isSelected ? 'text-white' : 'text-slate-400'} />
            <span className="text-xs truncate block">{node.name}</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
              isSelected ? 'bg-emerald-600 text-emerald-100' : 'bg-slate-100 text-slate-400'
            }`}>
              {userCount}人
            </span>
          </div>

          <div className={`flex items-center gap-1.5 ${isSelected ? 'text-white' : 'text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity'}`}>
            <button 
              onClick={(e) => { e.stopPropagation(); handleOpenAddNode(node.id); }}
              className={`p-1 rounded ${isSelected ? 'hover:bg-emerald-600' : 'hover:bg-slate-100 text-emerald-600'}`}
              title="添加子部门"
            >
              <Plus size={12} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleOpenEditNode(node); }}
              className={`p-1 rounded ${isSelected ? 'hover:bg-emerald-600' : 'hover:bg-slate-100 text-blue-600'}`}
              title="重命名/编辑"
            >
              <Edit3 size={11} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id, node.name); }}
              className={`p-1 rounded ${isSelected ? 'hover:bg-emerald-600' : 'hover:bg-slate-100 text-rose-500'}`}
              title="撤销部门"
            >
              <Trash2 size={11} />
            </button>
          </div>
        </div>

        {/* Child level recursive container */}
        {children.length > 0 && isExpanded && (
          <div className="flex flex-col border-l border-dashed border-slate-200 ml-5 mt-0.5">
            {children.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 h-full">
      {/* Title Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 px-1">
        <span>系统管理</span>
        <span className="opacity-50">/</span>
        <span className="text-emerald-600 font-semibold">组织管理</span>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[550px]">
        
        {/* Left Tree Box */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-5 flex flex-col shadow-sm">
          
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <GitFork className="text-emerald-500" size={20} />
            <h4 className="font-extrabold text-slate-800 text-sm">企业内设组织架构树</h4>
          </div>

          {/* Tenant Selector Dropdown */}
          <div className="mb-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">查看租户环境</label>
            <select 
              value={selectedTenantId}
              onChange={(e) => {
                setSelectedTenantId(e.target.value);
                setSelectedNodeId(null);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/10 outline-none"
            >
              {tenants.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} {t.status === 'inactive' ? '(已废止)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between mt-3 mb-2 px-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              部门层级节点 (Tree View)
            </span>
            <button 
              onClick={() => handleOpenAddNode(null)}
              className="flex items-center gap-1 text-[11px] font-black text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md"
            >
              创建一级根部门
            </button>
          </div>

          {/* Tree Scroll Container */}
          <div className="flex-1 overflow-y-auto max-h-[400px] border border-slate-100 rounded-xl p-2 bg-slate-50/20 custom-scrollbar">
            {treeRoots.length > 0 ? (
              treeRoots.map(root => renderTreeNode(root, 0))
            ) : (
              <div className="py-20 text-center text-slate-300">
                <Network className="mx-auto mb-2 opacity-10" size={36} />
                <p className="text-xs font-semibold">该租户下目前未建立架构树</p>
                <p className="text-[9px] text-slate-400 mt-1">您可以点击“创建一级根部门”开启</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Details / User List Box */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-5 flex flex-col shadow-sm">
          {activeNode ? (
            <div className="flex-1 flex flex-col">
              
              {/* Node Basic Info Header Banner */}
              <div className="bg-slate-50/80 border border-slate-150 rounded-2xl p-4 flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                    <Briefcase size={16} className="text-emerald-500" />
                    当前部门: {activeNode.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    描述备注: {activeNode.remarks || '暂无详细描述...'}
                  </p>
                  <div className="flex gap-4 mt-2.5 text-[10px] text-slate-400 font-bold">
                    <span>关联编码: <code className="font-mono bg-slate-100 text-slate-600 px-1 py-0.2 rounded">{activeNode.id}</code></span>
                    <span>建制时间: {activeNode.createdAt}</span>
                  </div>
                </div>
                
                <span className="bg-emerald-500 text-white rounded-lg px-2.5 py-1 text-xs font-black self-start">
                  部门人数：{orgUsers.length} 人
                </span>
              </div>

              {/* Department Members Management Section */}
              <div className="mt-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Users size={12} />
                    部门成员信息 {`(${orgUsers.length})`}
                  </h4>
                  <button 
                    onClick={() => setShowAddUserModal(true)}
                    className="flex items-center gap-1.5 bg-emerald-500 text-white hover:bg-emerald-600 px-3.5 py-1.5 rounded-lg text-xs font-black shadow-md shadow-emerald-500/10 transition-all active:scale-95"
                  >
                    <UserPlus size={13} />
                    添加成员
                  </button>
                </div>

                {/* Table list of members */}
                <div className="flex-1 border border-slate-100 rounded-xl overflow-hidden min-h-[150px]">
                  <table className="w-full border-collapse">
                    <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 text-left">姓名</th>
                        <th className="px-4 py-3 text-left">手机号</th>
                        <th className="px-4 py-3 text-left">所属角色</th>
                        <th className="px-4 py-3 text-center">状态</th>
                        <th className="px-4 py-3 text-center w-20">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {orgUsers.length > 0 ? (
                        orgUsers.map(user => (
                          <tr key={user.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-bold text-slate-700">{user.username}</td>
                            <td className="px-4 py-3 font-mono text-slate-500">{user.phone}</td>
                            <td className="px-4 py-3 text-slate-600">{user.role}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                user.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                              }`}>
                                {user.status === 'active' ? '启用' : '停用'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button 
                                onClick={() => handleRemoveUserFromOrg(user.id, user.username)}
                                className="text-rose-500 hover:text-rose-600 font-bold flex items-center gap-0.5 justify-center mx-auto"
                                title="从当前部门解绑"
                              >
                                <UserMinus size={11} />
                                移出
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-350">
                            <Users className="mx-auto mb-2 opacity-15" size={24} />
                            <p className="font-semibold">暂无任何成员分拨至本级部门</p>
                            <p className="text-[10px] text-slate-400 mt-1">您可以点击“添加成员”选择同租户下人员归档</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 py-12">
              <GitFork className="opacity-10 mb-2" size={48} />
              <p className="text-sm font-semibold">尚未选中任何有效组织节点</p>
              <p className="text-[10px] text-slate-400 mt-1">请在左侧数状图切换或创建一个架构单元进行查看</p>
            </div>
          )}
        </div>

      </div>

      {/* dialog to add/edit tree node */}
      {showNodeModal && editingNode && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="font-black text-slate-800 text-sm">
                {editingNode.id ? '编辑部门资料' : '配置新增子分支部门'}
              </span>
              <button onClick={() => setShowNodeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">部门/组织名称 (必填)</label>
                <input 
                  type="text"
                  value={editingNode.name || ''}
                  onChange={e => setEditingNode({ ...editingNode, name: e.target.value })}
                  placeholder="如：技术质量部 / 配网调运一组"
                  className={`w-full bg-slate-50 border ${errors.name ? 'border-rose-400' : 'border-slate-200'} rounded-xl px-4 py-2.5 text-xs outline-none font-bold text-slate-700`}
                />
                {errors.name && <p className="text-[10px] text-rose-500 font-bold">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">备注说明</label>
                <textarea 
                  rows={3}
                  value={editingNode.remarks || ''}
                  onChange={e => setEditingNode({ ...editingNode, remarks: e.target.value })}
                  placeholder="请输入描述该部门的主要职责、负责内容等"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none text-slate-600 focus:ring-1 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t flex justify-end gap-2.5">
              <button 
                onClick={() => setShowNodeModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 bg-white hover:bg-slate-100 rounded-lg"
              >
                取消
              </button>
              <button 
                onClick={handleSaveNode}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-sm"
              >
                保存确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog to select and bind member to current node */}
      {showAddUserModal && activeNode && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden text-sm flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-black text-slate-800 text-sm block">添加部门成员</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                  部门: <span className="text-emerald-600">{activeNode.name}</span>
                </span>
              </div>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 max-h-[350px] overflow-y-auto space-y-2">
              <span className="text-[10px] font-black text-slate-400 tracking-widest block uppercase mb-1">
                同一租户下可调配员工列表 ({eligibleTenantUsers.length} 人)
              </span>
              
              {eligibleTenantUsers.length > 0 ? (
                eligibleTenantUsers.map(u => (
                  <div 
                    key={u.id}
                    onClick={() => handleAssignUserToOrg(u.id)}
                    className="p-3 border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/50 rounded-xl cursor-pointer flex items-center justify-between transition-all group font-medium"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-700 block group-hover:text-emerald-700">{u.username}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{u.phone} • 当前职务:{u.role}</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      划入部门 +
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  <Info className="mx-auto text-slate-200 mb-2" size={32} />
                  <p className="text-xs font-bold">该租户下无可供分配的其他员工</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    所有员工都已分配至该组，或请至「用户管理」增加本租户成员建档
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t flex justify-end">
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="px-5 py-2 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER DUAL CONFIRMATION DELETION MODAL FOR ORG NODE */}
      {nodeToDelete && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden text-sm border border-red-100 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-red-50 flex items-center justify-between bg-red-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-red-700 text-sm">
                    ⚠️ 极其危险的组织部门删除操作
                  </h4>
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Department Decommissioning Consent</p>
                </div>
              </div>
              <button 
                onClick={() => setNodeToDelete(null)} 
                className="p-1.5 hover:bg-red-100/60 rounded-full text-red-400 transition-colors cursor-pointer font-bold"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-red-50/30 border border-red-100/70 p-4 rounded-2xl">
                <p className="text-xs text-red-700 font-bold leading-relaxed mb-1">
                  您确定要解散并永久撤销组织节点「{nodeToDelete.name}」吗？
                </p>
                <p className="text-[11px] text-slate-500 leading-normal">
                  此操作将彻底注销该部门。由于已通过首层安全检测，本组织下暂无直接人员档案关系和子分支挂载，但此解散行为一经确认无法回撤。
                </p>
              </div>

              {/* Requirement Checkbox */}
              <div className="space-y-3 pt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">双重核对确认事项 (必勾选)</span>
                
                <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox"
                    checked={nodeDeleteCheck}
                    onChange={(e) => setNodeDeleteCheck(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500/20 w-3.5 h-3.5 cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-600 font-medium select-none">
                    我已完全知晓此解散行为是<strong>不可逆</strong>的，且同意在租户树状版图上永久抹除「{nodeToDelete.name}」节点。
                  </div>
                </label>
              </div>

              {/* Precise Type Verification string */}
              <div className="space-y-1.5 border-t border-slate-150 pt-4">
                <label className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                  <span>请输入部门名称以确认注销:</span>
                  <span className="font-mono font-bold text-red-600 select-all">「{nodeToDelete.name}」</span>
                </label>
                <input 
                  type="text"
                  placeholder="在此输入完全相同的部门名称"
                  value={nodeDeleteInputText}
                  onChange={(e) => setNodeDeleteInputText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-500/50 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none transition-all placeholder:text-slate-350"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
              <button 
                onClick={() => setNodeToDelete(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 font-black text-xs rounded-xl cursor-pointer"
              >
                取消
              </button>
              <button 
                disabled={nodeDeleteInputText !== nodeToDelete.name || !nodeDeleteCheck}
                onClick={handleConfirmDeleteNode}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-black text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 hover:shadow-red-500/15"
              >
                <Trash2 size={13} />
                确认解散并销毁
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default OrgManagement;
