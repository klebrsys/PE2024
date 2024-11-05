import { getItem, setItem } from './storage-base';
import type {
  Company, User, Department, Position, Vision,
  Mission, Value, Perspective, Goal, Objective,
  ActionPlan, CheckIn, SwotItem
} from './types';

// Company
export function getCompanies(): Company[] {
  return getItem<Company>('companies');
}

export function setCompanies(companies: Company[]): void {
  setItem('companies', companies);
}

// User
export function getUsers(): User[] {
  return getItem<User>('users');
}

export function setUsers(users: User[]): void {
  setItem('users', users);
}

// Department
export function getDepartments(): Department[] {
  return getItem<Department>('departments');
}

export function setDepartments(departments: Department[]): void {
  setItem('departments', departments);
}

// Position
export function getPositions(): Position[] {
  return getItem<Position>('positions');
}

export function setPositions(positions: Position[]): void {
  setItem('positions', positions);
}

// Vision
export function getVisions(): Vision[] {
  return getItem<Vision>('visions');
}

export function setVisions(visions: Vision[]): void {
  setItem('visions', visions);
}

// Mission
export function getMissions(): Mission[] {
  return getItem<Mission>('missions');
}

export function setMissions(missions: Mission[]): void {
  setItem('missions', missions);
}

// Values
export function getValues(): Value[] {
  return getItem<Value>('values');
}

export function setValues(values: Value[]): void {
  setItem('values', values);
}

// Perspectives
export function getPerspectives(): Perspective[] {
  return getItem<Perspective>('perspectives');
}

export function setPerspectives(perspectives: Perspective[]): void {
  setItem('perspectives', perspectives);
}

// Goals
export function getGoals(): Goal[] {
  return getItem<Goal>('goals');
}

export function setGoals(goals: Goal[]): void {
  setItem('goals', goals);
}

// Objectives
export function getObjectives(): Objective[] {
  return getItem<Objective>('objectives');
}

export function setObjectives(objectives: Objective[]): void {
  setItem('objectives', objectives);
}

// Action Plans
export function getActionPlans(): ActionPlan[] {
  return getItem<ActionPlan>('actionPlans');
}

export function setActionPlans(plans: ActionPlan[]): void {
  setItem('actionPlans', plans);
}

// Check-ins
export function getCheckIns(): CheckIn[] {
  return getItem<CheckIn>('checkIns');
}

export function setCheckIns(checkIns: CheckIn[]): void {
  setItem('checkIns', checkIns);
}

// SWOT Analysis
export function getSwotItems(): SwotItem[] {
  return getItem<SwotItem>('swot-items');
}

export function setSwotItems(items: SwotItem[]): void {
  setItem('swot-items', items);
}