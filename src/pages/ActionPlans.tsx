import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, User, Target, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getActionPlans, setActionPlans, getUsers, getObjectives, setObjectives } from '../services/storage';
import { calculateObjectiveAchievedPercentage } from '../services/storage/calculations';
import type { ActionPlan, User as UserType, Objective, CheckIn } from '../types';

export function ActionPlans() {
  const { user } = useAuth();
  const [actionPlans, setActionPlansState] = useState<ActionPlan[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [objectives, setObjectivesState] = useState<Objective[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ActionPlan | undefined>();
  const [showCheckInForm, setShowCheckInForm] = useState<string | null>(null);
  const [newCheckIn, setNewCheckIn] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    progress: 0,
  });

  // Load data
  const loadData = () => {
    if (user?.companyId) {
      const storedPlans = getActionPlans();
      const companyPlans = storedPlans.filter(p => p.companyId === user.companyId);
      setActionPlansState(companyPlans);

      const storedUsers = getUsers();
      const companyUsers = storedUsers.filter(u => u.companyId === user.companyId);
      setUsers(companyUsers);

      const storedObjectives = getObjectives();
      const companyObjectives = storedObjectives.filter(o => o.companyId === user.companyId);
      setObjectivesState(companyObjectives);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.companyId]);

  const handleSubmit = (data: Partial<ActionPlan>) => {
    if (!user?.companyId) return;

    const allPlans = getActionPlans();
    let updatedPlans: ActionPlan[];
    
    if (editingPlan) {
      updatedPlans = allPlans.map(p => 
        p.id === editingPlan.id ? { ...editingPlan, ...data } : p
      );
    } else {
      const newPlan: ActionPlan = {
        id: Date.now().toString(),
        description: data.description!,
        responsibleId: data.responsibleId!,
        startDate: data.startDate!,
        endDate: data.endDate!,
        howTo: data.howTo!,
        progress: 0,
        objectiveId: data.objectiveId!,
        companyId: user.companyId,
        checkIns: [],
      };
      updatedPlans = [...allPlans, newPlan];
    }
    
    setActionPlans(updatedPlans);
    setActionPlansState(updatedPlans.filter(p => p.companyId === user.companyId));
    handleCancel();
  };

  const updateObjectiveProgress = (objectiveId: string) => {
    const achievedPercentage = calculateObjectiveAchievedPercentage(objectiveId);
    
    const allObjectives = getObjectives();
    const updatedObjectives = allObjectives.map(obj =>
      obj.id === objectiveId ? { ...obj, achievedPercentage } : obj
    );
    
    // Update both local state and storage
    setObjectives(updatedObjectives);
    setObjectivesState(updatedObjectives.filter(o => o.companyId === user?.companyId));
  };

  const handleAddCheckIn = (planId: string) => {
    if (!newCheckIn.description.trim() || !newCheckIn.date) return;

    const checkIn: CheckIn = {
      id: Date.now().toString(),
      date: newCheckIn.date,
      description: newCheckIn.description.trim(),
      progress: newCheckIn.progress,
      actionPlanId: planId,
    };

    const allPlans = getActionPlans();
    const plan = allPlans.find(p => p.id === planId);
    
    if (!plan) return;

    const updatedPlans = allPlans.map(p => {
      if (p.id === planId) {
        const updatedCheckIns = [...(p.checkIns || []), checkIn];
        const totalProgress = Math.min(
          100,
          Math.max(
            p.progress,
            checkIn.progress
          )
        );
        return {
          ...p,
          checkIns: updatedCheckIns,
          progress: totalProgress,
        };
      }
      return p;
    });

    // Update action plans first
    setActionPlans(updatedPlans);
    setActionPlansState(updatedPlans.filter(p => p.companyId === user?.companyId));

    // Then update the related objective's progress
    updateObjectiveProgress(plan.objectiveId);

    setShowCheckInForm(null);
    setNewCheckIn({
      date: new Date().toISOString().split('T')[0],
      description: '',
      progress: 0,
    });
  };

  const handleEdit = (plan: ActionPlan) => {
    setEditingPlan(plan);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this action plan?')) return;

    const allPlans = getActionPlans();
    const plan = allPlans.find(p => p.id === id);
    const updatedPlans = allPlans.filter(p => p.id !== id);
    
    // Update action plans first
    setActionPlans(updatedPlans);
    setActionPlansState(updatedPlans.filter(p => p.companyId === user?.companyId));

    // Then update the related objective's progress
    if (plan) {
      updateObjectiveProgress(plan.objectiveId);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPlan(undefined);
  };

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Unknown User';
  };

  const getObjectiveName = (objectiveId: string) => {
    return objectives.find(o => o.id === objectiveId)?.description || 'Unknown Objective';
  };

  if (!user?.companyId) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Action Plans</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Action Plan
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingPlan ? 'Edit Action Plan' : 'Create New Action Plan'}
          </h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            handleSubmit({
              description: formData.get('description') as string,
              responsibleId: formData.get('responsibleId') as string,
              startDate: formData.get('startDate') as string,
              endDate: formData.get('endDate') as string,
              howTo: formData.get('howTo') as string,
              objectiveId: formData.get('objectiveId') as string,
            });
          }} className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={editingPlan?.description}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter action plan description..."
                required
              />
            </div>

            <div>
              <label htmlFor="responsibleId" className="block text-sm font-medium text-gray-700">
                Responsible Person
              </label>
              <select
                id="responsibleId"
                name="responsibleId"
                defaultValue={editingPlan?.responsibleId}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select responsible person...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="objectiveId" className="block text-sm font-medium text-gray-700">
                Related Objective
              </label>
              <select
                id="objectiveId"
                name="objectiveId"
                defaultValue={editingPlan?.objectiveId}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select related objective...</option>
                {objectives.map((objective) => (
                  <option key={objective.id} value={objective.id}>
                    {objective.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  defaultValue={editingPlan?.startDate}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  defaultValue={editingPlan?.endDate}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="howTo" className="block text-sm font-medium text-gray-700">
                How to Execute
              </label>
              <textarea
                id="howTo"
                name="howTo"
                rows={3}
                defaultValue={editingPlan?.howTo}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Describe how this plan will be executed..."
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {editingPlan ? 'Save Changes' : 'Create Action Plan'}
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
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsible
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Objective
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {actionPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{plan.description}</div>
                    <div className="mt-1 text-sm text-gray-500">{plan.howTo}</div>
                    {plan.checkIns && plan.checkIns.length > 0 && (
                      <div className="mt-2">
                        <button
                          onClick={() => setShowCheckInForm(plan.id)}
                          className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-900"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {plan.checkIns.length} Check-in{plan.checkIns.length !== 1 ? 's' : ''}
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-2" />
                      <span>{getUserName(plan.responsibleId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Target className="h-4 w-4 mr-2" />
                      <span>{getObjectiveName(plan.objectiveId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-1 mr-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${plan.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{plan.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowCheckInForm(plan.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Add Check-in"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(plan)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {actionPlans.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No action plans</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new action plan.</p>
                    <div className="mt-6">
                      <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        New Action Plan
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Check-in Modal */}
      {showCheckInForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Check-in</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={newCheckIn.date}
                  onChange={(e) => setNewCheckIn({ ...newCheckIn, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newCheckIn.description}
                  onChange={(e) => setNewCheckIn({ ...newCheckIn, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Describe the progress made..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Progress ({newCheckIn.progress}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newCheckIn.progress}
                  onChange={(e) => setNewCheckIn({ ...newCheckIn, progress: parseInt(e.target.value) })}
                  className="mt-1 block w-full"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCheckInForm(null)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddCheckIn(showCheckInForm)}
                  disabled={!newCheckIn.description.trim() || !newCheckIn.date}
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Check-in
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}