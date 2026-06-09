
export enum DeviceType {
  METER = '电表',
  CHARGER = '充电桩',
  INVERTER = '逆变器',
  TRANSFORMER = '变压器',
  LOAD = '负载',
  IRRADIANCE = '辐照仪'
}

export interface Area {
  id: string;
  name: string;
  level: number;
  children?: Area[];
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  sn: string;
  parentId: string; // The site or parent node it's bound to
  parentName: string;
  areaId?: string;
  areaName?: string;
  createdAt: string;
  onlineStatus: 'online' | 'offline';
  deviceStatus: 'normal' | 'fault';
}

export interface Site {
  id: string;
  name: string;
  type: 'park' | 'power_station' | 'charging_station';
  areas?: Area[];
  boundStationIds?: string[]; // For parks to bind to multiple power stations
}

export type StationStatus = 'active' | 'construction' | 'fault';

export interface Tenant {
  id: string;
  name: string;
  createdAt: string;
  remarks: string;
  status: 'active' | 'inactive';
}

export interface OrgNode {
  id: string;
  name: string;
  parentId: string | null;
  tenantId: string;
  remarks: string;
  createdAt: string;
}

export interface SystemUser {
  id: string;
  username: string;
  phone: string;
  role: string;
  registrationTime: string;
  lastLogin: string;
  status: 'active' | 'inactive';
  tenantId?: string;
  orgId?: string;
  tenantIds?: string[];
  orgIds?: string[];
}

export interface SystemRole {
  id: string;
  roleName: string;
  remarks: string;
  createdAt: string;
}

export interface ChargingStation {
  id: string;
  name: string;
  address: string;
  chargerCount: number;
  totalPower: number; // in kW
  status: StationStatus;
  operator: string;
  lat: number;
  lng: number;
  lastUpdated: string;
}
