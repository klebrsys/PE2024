export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
}

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

export interface Department {
  id: string;
  name: string;
  managerId: string;
  companyId: string;
}

export interface Position {
  id: string;
  name: string;
  isActive: boolean;
  companyId: string;
}

export interface Vision {
  id: string;
  description: string;
  companyId: string;
}

export interface Mission {
  id: string;
  description: string;
  companyId: string;
}

export interface Value {
  id: string;
  description: string;
  companyId: string;
}

export interface Perspective {
  id: string;
  description: string;
  companyId: string;
}

export interface Goal {
  id: string;
  description: string;
  startDate: string;
  endDate: string;
  companyId: string;
}

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