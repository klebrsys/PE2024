import { getActionPlans, getObjectives } from './storage';

export function calculateObjectiveAchievedPercentage(objectiveId: string): number {
  const plans = getActionPlans().filter(plan => plan.objectiveId === objectiveId);
  
  if (plans.length === 0) return 0;
  
  const totalProgress = plans.reduce((sum, plan) => sum + plan.progress, 0);
  return Math.round(totalProgress / plans.length);
}

export function calculateGoalCompletion(goalId: string): number {
  const objectives = getObjectives();
  const linkedObjectives = objectives.filter(obj => obj.goalId === goalId);
  
  if (linkedObjectives.length === 0) return 0;
  
  const weightPerObjective = 100 / linkedObjectives.length;
  
  const totalCompletion = linkedObjectives.reduce((sum, obj) => {
    const objectiveProgress = Math.max(obj.progress, obj.achievedPercentage);
    return sum + (objectiveProgress * weightPerObjective / 100);
  }, 0);
  
  return Math.round(totalCompletion);
}