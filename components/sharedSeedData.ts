import { Tenant, OrgNode, SystemUser, SystemRole } from '../types';

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'T01',
    name: '青海绿电算力基地有限公司',
    createdAt: '2026-01-10 10:00:00',
    remarks: '主打绿电与算力协同融合项目',
    status: 'active'
  },
  {
    id: 'T02',
    name: '特变电工青海新能源分部',
    createdAt: '2026-02-15 14:30:00',
    remarks: '光伏高低压变压及电站集成商',
    status: 'active'
  },
  {
    id: 'T03',
    name: '国家电网青海省电力公司',
    createdAt: '2026-03-01 09:15:00',
    remarks: '省级高品质电能保障配套合作方',
    status: 'active'
  }
];

export const INITIAL_ORGS: OrgNode[] = [
  // T01 nodes
  { id: 'O10', name: '总部', parentId: null, tenantId: 'T01', remarks: '青海绿电总部管理中心', createdAt: '2026-01-10 10:05:00' },
  { id: 'O11', name: '算力运营部', parentId: 'O10', tenantId: 'T01', remarks: '高密度绿色算力机房运维及能效算力分配', createdAt: '2026-01-11 09:00:00' },
  { id: 'O12', name: '微电网技术中心', parentId: 'O10', tenantId: 'T01', remarks: '智能微电网控制算法及本地调控研发', createdAt: '2026-01-11 10:15:00' },
  { id: 'O13', name: '智能运维班', parentId: 'O10', tenantId: 'T01', remarks: '一次侧与二次侧一次硬件检修保障团队', createdAt: '2026-01-12 11:30:00' },

  // T02 nodes
  { id: 'O20', name: '生产计划部', parentId: null, tenantId: 'T02', remarks: '变电设备组装及光敏材料调度研评', createdAt: '2026-02-15 14:40:00' },
  { id: 'O21', name: '电站建设分队', parentId: 'O20', tenantId: 'T02', remarks: '光伏及储能集装箱现场安装与线路调试施工队', createdAt: '2026-02-16 08:30:00' },

  // T03 nodes
  { id: 'O30', name: '配网调度科', parentId: null, tenantId: 'T03', remarks: '西宁城中区南川网格高压调配保障组', createdAt: '2026-03-01 09:20:00' }
];

export const INITIAL_USERS: SystemUser[] = [
  {
    id: 'U00051',
    username: '狄纯',
    phone: '13482772194',
    role: '管理员',
    registrationTime: '2026-04-09 09:38:36',
    lastLogin: '2026-04-10 11:26:57',
    status: 'active',
    tenantId: 'T01',
    orgId: 'O11',
    tenantIds: ['T01', 'T03'],
    orgIds: ['O11', 'O30']
  },
  {
    id: 'U00050',
    username: 'wsj',
    phone: '15038241946',
    role: 'zs',
    registrationTime: '2026-04-07 20:03:40',
    lastLogin: '2026-04-09 23:31:15',
    status: 'active',
    tenantId: 'T01',
    orgId: 'O12'
  },
  {
    id: 'U00049',
    username: '周巍巍',
    phone: '18896552862',
    role: '管理员',
    registrationTime: '2026-04-01 10:56:49',
    lastLogin: '2026-04-15 13:50:29',
    status: 'active',
    tenantId: 'T02',
    orgId: 'O20',
    tenantIds: ['T02', 'T01', 'T03'],
    orgIds: ['O20', 'O11', 'O12', 'O30']
  },
  {
    id: 'U00048',
    username: 'aaaaaa',
    phone: '15221448103',
    role: '-',
    registrationTime: '2026-03-20 16:15:40',
    lastLogin: '',
    status: 'inactive',
    tenantId: 'T01',
    orgId: 'O13'
  },
  {
    id: 'U00047',
    username: '雷烟测试用户',
    phone: '13888888888',
    role: '2',
    registrationTime: '2026-03-19 15:46:31',
    lastLogin: '2026-03-19 15:57:04',
    status: 'active',
    tenantId: 'T03',
    orgId: 'O30'
  },
  {
    id: 'U00046',
    username: '雷烟测试用户_02',
    phone: '13123333333',
    role: '33333332',
    registrationTime: '2026-03-19 15:45:45',
    lastLogin: '2026-03-19 15:50:00',
    status: 'active',
    tenantId: 'T03',
    orgId: 'O30'
  },
  {
    id: 'U00045',
    username: '1233额温枪%......& () 333456',
    phone: '15221448122',
    role: '12222222222222222222',
    registrationTime: '2026-03-17 17:50:31',
    lastLogin: '2026-03-17 17:58:58',
    status: 'active',
    tenantId: 'T01',
    orgId: 'O12'
  },
  {
    id: 'U00044',
    username: '2222',
    phone: '12211111333',
    role: '13',
    registrationTime: '2026-03-17 17:03:19',
    lastLogin: '',
    status: 'inactive',
    tenantId: 'T01',
    orgId: 'O13'
  },
  {
    id: 'U00043',
    username: '默认状态',
    phone: '15221448133',
    role: '12',
    registrationTime: '2026-03-17 16:58:26',
    lastLogin: '2026-03-19 14:24:11',
    status: 'active',
    tenantId: 'T02',
    orgId: 'O21'
  },
  {
    id: 'U00042',
    username: '123456#￥%............&**& () 1',
    phone: '18888888883',
    role: '5',
    registrationTime: '2026-03-17 16:51:25',
    lastLogin: '',
    status: 'active',
    tenantId: 'T01',
    orgId: 'O11'
  }
];

export const INITIAL_ROLES: SystemRole[] = [
  { id: 'R01', roleName: '超级管理员', remarks: '拥有全模块所有租户管理、业务数据配置最高控制权', createdAt: '2026-01-01 08:00:00' },
  { id: 'R02', roleName: '租户高级管理员', remarks: '针对特定租户内的用户、组织架构开展CRUD管理运作', createdAt: '2026-01-05 10:00:00' },
  { id: 'R03', roleName: '智能运维员', remarks: '只读整体概览与负荷调配，允许接收和确认故障告警推送', createdAt: '2026-01-10 12:00:00' },
  { id: 'R04', roleName: '算力保障专员', remarks: '重点调配电力算力协同调度配置参数，监控运行能效', createdAt: '2026-01-15 15:30:00' }
];
