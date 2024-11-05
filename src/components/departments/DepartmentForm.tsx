import React from 'react';
import type { Department, User } from '../../types';

interface DepartmentFormProps {
  department?: Department;
  managers: User[];
  companyId: string;
  onSubmit: (data: Partial<Department>) => void;
  onCancel: () => void;
}

export function DepartmentForm({ department, managers, companyId, onSubmit, onCancel }: DepartmentFormProps) {
  const [formData, setFormData] = React.useState({
    name: department?.name || '',
    managerId: department?.managerId || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, companyId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Department Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="managerId" className="block text-sm font-medium text-gray-700">
          Department Manager
        </label>
        <select
          id="managerId"
          value={formData.managerId}
          onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select a manager</option>
          {managers.map((manager) => (
            <option key={manager.id} value={manager.id}>
              {manager.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {department ? 'Update' : 'Create'} Department
        </button>
      </div>
    </form>
  );
}