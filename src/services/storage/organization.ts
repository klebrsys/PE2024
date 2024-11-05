import { getItem, setItem } from './base';
import type { Company, User, Department, Position } from './types';

// Companies
export function getCompanies(): Company[] {
  return getItem<Company>('companies');
}

export function setCompanies(companies: Company[]): void {
  setItem('companies', companies);
}

// Users
export function getUsers(): User[] {
  return getItem<User>('users');
}

export function setUsers(users: User[]): void {
  setItem('users', users);
}

// Departments
export function getDepartments(): Department[] {
  return getItem<Department>('departments');
}

export function setDepartments(departments: Department[]): void {
  setItem('departments', departments);
}

// Positions
export function getPositions(): Position[] {
  return getItem<Position>('positions');
}

export function setPositions(positions: Position[]): void {
  setItem('positions', positions);
}