// Company Types
export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  companyId: string;
  isManager: boolean;
  isAdmin: boolean;
}

// Department Types
export interface Department {
  id: string;
  name: string;
  managerId: string;
  companyId: string;
}

// Position Types
export interface Position {
  id: string;
  name: string;
  isActive: boolean;
  companyId: string;
}

// Vision Types
export interface Vision {
  id: string;
  description: string;
  companyId: string;
}

// Mission Types
export interface Mission {
  id: string;
  description: string;
  companyId: string;
}

// Value Types
export interface Value {
  id: string;
  description: string;
  companyId: string;
}

// Perspective Types
export interface Perspective {
  id: string;
  description: string;
  companyId: string;
}

// Goal Types
export interface Goal {
  id: string;
  description: string;
  startDate: string;
  endDate: string;
  companyId: string;
}

// Objective Types
export interface Objective {
  id: string;
  description: string;
  startDate: string;
  endDate: string;
  goalId: string;
  companyId: string;
  progress: number;
  achievedPercentage: number;
}

// Action Plan Types
export interface ActionPlan {
  id: string;
  description: string;
  responsibleId: string;
  startDate: string;
  endDate: string;
  howTo: string;
  objectiveId: string;
  companyId: string;
  progress: number;
}

export interface CheckIn {
  id: string;
  date: string;
  description: string;
  progress: number;
  planId: string;
}

// SWOT Types
export interface SwotItem {
  id: string;
  type: 'strength' | 'weakness' | 'opportunity' | 'threat';
  description: string;
  companyId: string;
  createdAt: Date;
}