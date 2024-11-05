import React, { useState, useEffect } from 'react';
import { Plus, Users, Briefcase } from 'lucide-react';
import { DepartmentList } from '../components/departments/DepartmentList';
import { DepartmentForm } from '../components/departments/DepartmentForm';
import { PositionList } from '../components/positions/PositionList';
import { PositionForm } from '../components/positions/PositionForm';
import { useAuth } from '../hooks/useAuth';
import { getDepartments, setDepartments, getPositions, setPositions, getUsers } from '../services/storage';
import type { Department, Position, User } from '../types';

type ActiveTab = 'departments' | 'positions';

export function Settings() {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('departments');
  const [departments, setDepartmentsState] = useState<Department[]>([]);
  const [positions, setPositionsState] = useState<Position[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [showPositionForm, setShowPositionForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department>();
  const [editingPosition, setEditingPosition] = useState<Position>();

  // Load data on component mount
  useEffect(() => {
    if (currentUser?.companyId) {
      const storedDepartments = getDepartments().filter(d => d.companyId === currentUser.companyId);
      const storedPositions = getPositions().filter(p => p.companyId === currentUser.companyId);
      const storedUsers = getUsers().filter(u => u.companyId === currentUser.companyId && u.isManager);
      
      setDepartmentsState(storedDepartments);
      setPositionsState(storedPositions);
      setManagers(storedUsers);
    }
  }, [currentUser?.companyId]);

  const handleDepartmentSubmit = (data: Partial<Department>) => {
    const allDepartments = getDepartments();
    let updatedDepartments: Department[];
    
    if (editingDepartment) {
      updatedDepartments = allDepartments.map(d => 
        d.id === editingDepartment.id ? { ...editingDepartment, ...data } : d
      );
    } else {
      const newDepartment: Department = {
        id: Date.now().toString(),
        ...data,
      } as Department;
      updatedDepartments = [...allDepartments, newDepartment];
    }
    
    setDepartments(updatedDepartments);
    setDepartmentsState(updatedDepartments.filter(d => d.companyId === currentUser?.companyId));
    handleDepartmentCancel();
  };

  const handlePositionSubmit = (data: Partial<Position>) => {
    const allPositions = getPositions();
    let updatedPositions: Position[];
    
    if (editingPosition) {
      updatedPositions = allPositions.map(p => 
        p.id === editingPosition.id ? { ...editingPosition, ...data } : p
      );
    } else {
      const newPosition: Position = {
        id: Date.now().toString(),
        ...data,
      } as Position;
      updatedPositions = [...allPositions, newPosition];
    }
    
    setPositions(updatedPositions);
    setPositionsState(updatedPositions.filter(p => p.companyId === currentUser?.companyId));
    handlePositionCancel();
  };

  const handleDepartmentEdit = (department: Department) => {
    setEditingDepartment(department);
    setShowDepartmentForm(true);
  };

  const handlePositionEdit = (position: Position) => {
    setEditingPosition(position);
    setShowPositionForm(true);
  };

  const handleDepartmentDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      const allDepartments = getDepartments();
      const updatedDepartments = allDepartments.filter(d => d.id !== id);
      setDepartments(updatedDepartments);
      setDepartmentsState(updatedDepartments.filter(d => d.companyId === currentUser?.companyId));
    }
  };

  const handlePositionDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      const allPositions = getPositions();
      const updatedPositions = allPositions.filter(p => p.id !== id);
      setPositions(updatedPositions);
      setPositionsState(updatedPositions.filter(p => p.companyId === currentUser?.companyId));
    }
  };

  const handleDepartmentCancel = () => {
    setShowDepartmentForm(false);
    setEditingDepartment(undefined);
  };

  const handlePositionCancel = () => {
    setShowPositionForm(false);
    setEditingPosition(undefined);
  };

  if (!currentUser?.companyId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('departments')}
            className={`${
              activeTab === 'departments'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            <Users className="h-5 w-5 mr-2" />
            Departments
          </button>
          <button
            onClick={() => setActiveTab('positions')}
            className={`${
              activeTab === 'positions'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            <Briefcase className="h-5 w-5 mr-2" />
            Positions
          </button>
        </nav>
      </div>

      {activeTab === 'departments' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Departments</h2>
            {!showDepartmentForm && (
              <button
                onClick={() => setShowDepartmentForm(true)}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Department
              </button>
            )}
          </div>

          {showDepartmentForm ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingDepartment ? 'Edit' : 'New'} Department
              </h3>
              <DepartmentForm
                department={editingDepartment}
                managers={managers}
                companyId={currentUser.companyId}
                onSubmit={handleDepartmentSubmit}
                onCancel={handleDepartmentCancel}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <DepartmentList
                departments={departments}
                managers={managers}
                onEdit={handleDepartmentEdit}
                onDelete={handleDepartmentDelete}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Positions</h2>
            {!showPositionForm && (
              <button
                onClick={() => setShowPositionForm(true)}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Position
              </button>
            )}
          </div>

          {showPositionForm ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPosition ? 'Edit' : 'New'} Position
              </h3>
              <PositionForm
                position={editingPosition}
                companyId={currentUser.companyId}
                onSubmit={handlePositionSubmit}
                onCancel={handlePositionCancel}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <PositionList
                positions={positions}
                onEdit={handlePositionEdit}
                onDelete={handlePositionDelete}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}