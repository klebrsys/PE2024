import { getItem, setItem } from './base';
import type { Goal, Objective, ActionPlan, CheckIn } from './types';

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