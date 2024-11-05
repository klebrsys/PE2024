import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { UserList } from '../components/users/UserList';
import { UserForm } from '../components/users/UserForm';
import { useAuth } from '../hooks/useAuth';
import { getUsers, setUsers } from '../services/storage';
import type { User } from '../types';

export function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsersState] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();

  // Load users on component mount
  useEffect(() => {
    const storedUsers = getUsers();
    // Filter users based on company if not admin
    const filteredUsers = currentUser?.role === 'ADMIN' 
      ? storedUsers 
      : storedUsers.filter(u => u.companyId === currentUser?.companyId);
    setUsersState(filteredUsers);
  }, [currentUser]);

  const handleSubmit = (data: Partial<User>) => {
    const allUsers = getUsers(); // Get all users to maintain data for other companies
    let updatedUsers: User[];
    
    if (editingUser) {
      updatedUsers = allUsers.map(u => 
        u.id === editingUser.id ? { ...editingUser, ...data } : u
      );
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...data,
      } as User;
      updatedUsers = [...allUsers, newUser];
    }
    
    // Update storage with all users
    setUsers(updatedUsers);
    
    // Update state with filtered users
    const filteredUsers = currentUser?.role === 'ADMIN'
      ? updatedUsers
      : updatedUsers.filter(u => u.companyId === currentUser?.companyId);
    setUsersState(filteredUsers);
    
    handleCancel();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const allUsers = getUsers();
      const updatedUsers = allUsers.filter(u => u.id !== id);
      setUsers(updatedUsers);
      
      const filteredUsers = currentUser?.role === 'ADMIN'
        ? updatedUsers
        : updatedUsers.filter(u => u.companyId === currentUser?.companyId);
      setUsersState(filteredUsers);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(undefined);
  };

  const handleToggleRole = (user: User) => {
    const allUsers = getUsers();
    const updatedUser = {
      ...user,
      role: user.role === 'USER' ? 'MASTER' : 'USER'
    };
    
    const updatedUsers = allUsers.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    
    const filteredUsers = currentUser?.role === 'ADMIN'
      ? updatedUsers
      : updatedUsers.filter(u => u.companyId === currentUser?.companyId);
    setUsersState(filteredUsers);
  };

  if (!currentUser?.companyId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="h-5 w-5 mr-2" />
            New User
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingUser ? 'Edit' : 'New'} User
          </h2>
          <UserForm
            user={editingUser}
            companyId={currentUser.companyId}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <UserList
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleRole={handleToggleRole}
          />
        </div>
      )}
    </div>
  );
}