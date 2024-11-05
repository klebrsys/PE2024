import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, Target, Compass } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { getGoals, setGoals, getObjectives, getPerspectives } from '../services/storage';
import { calculateGoalCompletion } from '../services/storage/calculations';
import type { Goal, Objective, Perspective } from '../types';

export function Goals() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [goals, setGoalsState] = useState<Goal[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [perspectives, setPerspectives] = useState<Perspective[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  // Load goals data
  const loadData = () => {
    if (user?.companyId) {
      const storedGoals = getGoals();
      const companyGoals = storedGoals.filter(g => g.companyId === user.companyId);
      setGoalsState(companyGoals);

      const storedObjectives = getObjectives();
      const companyObjectives = storedObjectives.filter(o => o.companyId === user.companyId);
      setObjectives(companyObjectives);

      const storedPerspectives = getPerspectives();
      const companyPerspectives = storedPerspectives.filter(p => p.companyId === user.companyId);
      setPerspectives(companyPerspectives);
    }
  };

  // Load initial data
  useEffect(() => {
    loadData();
  }, [user?.companyId]);

  const handleSubmit = (data: Partial<Goal>) => {
    if (!user?.companyId) return;

    const allGoals = getGoals();
    let updatedGoals: Goal[];
    
    if (editingGoal) {
      updatedGoals = allGoals.map(g => 
        g.id === editingGoal.id ? { ...editingGoal, ...data } : g
      );
    } else {
      const newGoal: Goal = {
        id: Date.now().toString(),
        description: data.description!,
        startDate: data.startDate!,
        endDate: data.endDate!,
        perspectiveId: data.perspectiveId!,
        companyId: user.companyId,
      };
      updatedGoals = [...allGoals, newGoal];
    }
    
    setGoals(updatedGoals);
    setGoalsState(updatedGoals.filter(g => g.companyId === user.companyId));
    handleCancel();
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(t('goals.confirmDelete'))) return;

    const allGoals = getGoals();
    const updatedGoals = allGoals.filter(g => g.id !== id);
    setGoals(updatedGoals);
    setGoalsState(updatedGoals.filter(g => g.companyId === user?.companyId));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGoal(undefined);
  };

  const getPerspectiveName = (perspectiveId: string) => {
    return perspectives.find(p => p.id === perspectiveId)?.description || t('goals.unknownPerspective');
  };

  const getLinkedObjectives = (goalId: string) => {
    return objectives.filter(obj => obj.goalId === goalId);
  };

  const toggleObjectivesList = (goalId: string) => {
    setSelectedGoal(selectedGoal === goalId ? null : goalId);
  };

  if (!user?.companyId) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{t('goals.title')}</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="h-5 w-5 mr-2" />
            {t('goals.new')}
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingGoal ? t('goals.edit') : t('goals.new')}
          </h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            handleSubmit({
              description: formData.get('description') as string,
              startDate: formData.get('startDate') as string,
              endDate: formData.get('endDate') as string,
              perspectiveId: formData.get('perspectiveId') as string,
            });
          }} className="space-y-4">
            <div>
              <label htmlFor="perspectiveId" className="block text-sm font-medium text-gray-700">
                {t('goals.perspective')}
              </label>
              <select
                id="perspectiveId"
                name="perspectiveId"
                defaultValue={editingGoal?.perspectiveId}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">{t('goals.selectPerspective')}</option>
                {perspectives.map((perspective) => (
                  <option key={perspective.id} value={perspective.id}>
                    {perspective.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                {t('goals.description')}
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={editingGoal?.description}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder={t('goals.descriptionPlaceholder')}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  {t('goals.startDate')}
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  defaultValue={editingGoal?.startDate}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  {t('goals.endDate')}
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  defaultValue={editingGoal?.endDate}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {t('actions.cancel')}
              </button>
              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {editingGoal ? t('actions.save') : t('actions.create')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('goals.description')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('goals.perspective')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('goals.timeline')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('goals.completion')}
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">{t('goals.actions')}</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {goals.map((goal) => {
                const completion = calculateGoalCompletion(goal.id);
                const linkedObjectives = getLinkedObjectives(goal.id);
                const isSelected = selectedGoal === goal.id;

                return (
                  <React.Fragment key={goal.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{goal.description}</div>
                        <button
                          onClick={() => toggleObjectivesList(goal.id)}
                          className="mt-2 inline-flex items-center text-xs text-indigo-600 hover:text-indigo-900"
                        >
                          <Target className="h-3 w-3 mr-1" />
                          {linkedObjectives.length} {t('goals.objectivesCount', { count: linkedObjectives.length })}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Compass className="h-4 w-4 mr-2" />
                          <span>{getPerspectiveName(goal.perspectiveId)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-1 mr-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${completion}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{completion}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(goal)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(goal.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isSelected && linkedObjectives.length > 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-900">{t('goals.linkedObjectives')}</h4>
                            <div className="space-y-2">
                              {linkedObjectives.map((obj) => (
                                <div key={obj.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-900">{obj.description}</p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(obj.startDate).toLocaleDateString()} - {new Date(obj.endDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="ml-4 flex items-center space-x-4">
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-500 mr-2">{t('goals.manualProgress')}:</span>
                                      <span className="text-sm font-medium text-gray-900">{obj.progress}%</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-500 mr-2">{t('goals.achievedProgress')}:</span>
                                      <span className="text-sm font-medium text-gray-900">{obj.achievedPercentage}%</span>
                                    </div>
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{ width: `${Math.max(obj.progress, obj.achievedPercentage)}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {goals.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">{t('goals.noGoals')}</h3>
                    <p className="mt-1 text-sm text-gray-500">{t('goals.getStarted')}</p>
                    <div className="mt-6">
                      <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        {t('goals.new')}
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}