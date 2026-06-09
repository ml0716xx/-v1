
import { Device, DeviceType, Site, ChargingStation, Area } from './types';

export const SITES: Site[] = [
  { 
    id: 'site-01', 
    name: '实验站点1', 
    type: 'park',
    areas: [
      {
        id: 'a1-1', name: '办公大楼', level: 1,
        children: [
          { id: 'a1-1-1', name: '1楼机房', level: 2 },
          { id: 'a1-1-2', name: '顶层光伏区', level: 2 }
        ]
      },
      { id: 'a1-2', name: '生产车间', level: 1 }
    ]
  },
  { 
    id: 'site-02', 
    name: '实验站点2', 
    type: 'power_station',
    areas: [
      { id: 'a2-1', name: '1号变压器区', level: 1 },
      { 
        id: 'a2-2', name: '集装箱储能区', level: 1,
        children: [
          { id: 'a2-2-1', name: 'A列电芯', level: 2 },
          { id: 'a2-2-2', name: 'B列电芯', level: 2 }
        ]
      }
    ]
  },
  { id: 'site-03', name: '科士达储能', type: 'charging_station' },
];

export const CHARGING_STATIONS: ChargingStation[] = [
  {
    id: 'CS-001',
    name: '绿算园区超级充电站',
    address: '青海省西宁市城中区南川工业园A区',
    chargerCount: 24,
    totalPower: 1200,
    status: 'active',
    operator: '特来电',
    lat: 36.62,
    lng: 101.77,
    lastUpdated: '2025-11-20 10:00:00'
  },
  {
    id: 'CS-002',
    name: '南川西路公共充电站',
    address: '青海省西宁市城中区南川西路158号',
    chargerCount: 12,
    totalPower: 600,
    status: 'active',
    operator: '国家电网',
    lat: 36.58,
    lng: 101.75,
    lastUpdated: '2025-11-20 09:30:00'
  }
];

const generatePoolDevices = (count: number): Device[] => {
  const types = Object.values(DeviceType);
  return Array.from({ length: count }, (_, i) => ({
    id: `POOL-D-${100 + i}`,
    name: `待分配${types[i % types.length]}-${String(i + 1).padStart(3, '0')}`,
    type: types[i % types.length],
    sn: `SN-2025-PX-${1000 + i}`,
    parentId: '',
    parentName: '-',
    createdAt: `2025-11-${String((i % 28) + 1).padStart(2, '0')} 09:00:00`,
    onlineStatus: Math.random() > 0.3 ? 'online' : 'offline',
    deviceStatus: Math.random() > 0.15 ? 'normal' : 'fault'
  }));
};

export const MASTER_DEVICE_POOL: Device[] = [
  {
    id: 'THMEMET000FORBZ5C3MGC',
    name: '电表001',
    type: DeviceType.METER,
    sn: 'THMEMET000FORBZ5C3MGC',
    parentId: 'site-02',
    parentName: '实验站点2',
    areaId: 'a2-1',
    areaName: '1号变压器区',
    createdAt: '2025-10-14 18:59:44',
    onlineStatus: 'online',
    deviceStatus: 'normal'
  },
  {
    id: 'THEVCGUN00ZOSEYRKW7OC',
    name: '充电枪001',
    type: DeviceType.CHARGER,
    sn: 'THEVCGUN00ZOSEYRKW7OC',
    parentId: 'site-01',
    parentName: '实验站点1',
    areaId: 'a1-1-1',
    areaName: '办公大楼 > 1楼机房',
    createdAt: '2025-10-14 18:58:45',
    onlineStatus: 'online',
    deviceStatus: 'normal'
  },
  ...generatePoolDevices(15)
];
