import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, Compass, Target } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { getPerspectives, setPerspectives } from '../services/storage';
import type { Perspective } from '../types';

export function Perspectivas() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [perspectives, setPerspectivesState] = useState<Perspective[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  // Load perspectives data
  const loadPerspectives = () => {
    if (user?.companyId) {
      const storedPerspectives = getPerspectives();
      const companyPerspectives = storedPerspectives.filter(p => p.companyId === user.companyId);
      setPerspectivesState(companyPerspectives);
      setIsLoading(false);
      // Trigger animation after loading
      setTimeout(() => setShowAnimation(true), 100);
    }
  };

  // Load initial data
  useEffect(() => {
    loadPerspectives();
  }, [user?.companyId]);

  const handleAddPerspective = () => {
    if (!formData.description.trim() || !user?.companyId) return;

    const perspective: Perspective = {
      id: Date.now().toString(),
      description: formData.description.trim(),
      companyId: user.companyId,
    };
    
    const allPerspectives = getPerspectives();
    const updatedPerspectives = [...allPerspectives, perspective];
    setPerspectives(updatedPerspectives);
    setPerspectivesState(updatedPerspectives.filter(p => p.companyId === user.companyId));
    setFormData({ description: '' });
    setShowForm(false);
    
    // Trigger animation for new item
    setShowAnimation(false);
    setTimeout(() => setShowAnimation(true), 100);
  };

  const handleEdit = (perspective: Perspective) => {
    setEditingId(perspective.id);
    setFormData({
      description: perspective.description
    });
    setShowForm(true);
  };

  const handleSaveEdit = () => {
    if (!formData.description.trim() || !editingId) return;

    const allPerspectives = getPerspectives();
    const updatedPerspectives = allPerspectives.map(p =>
      p.id === editingId ? { 
        ...p, 
        description: formData.description.trim()
      } : p
    );
    
    setPerspectives(updatedPerspectives);
    setPerspectivesState(updatedPerspectives.filter(p => p.companyId === user?.companyId));
    setEditingId(null);
    setFormData({ description: '' });
    setShowForm(false);
    
    // Trigger animation after edit
    setShowAnimation(false);
    setTimeout(() => setShowAnimation(true), 100);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(t('perspectives.confirmDelete'))) return;

    const allPerspectives = getPerspectives();
    const updatedPerspectives = allPerspectives.filter(p => p.id !== id);
    setPerspectives(updatedPerspectives);
    setPerspectivesState(updatedPerspectives.filter(p => p.companyId === user?.companyId));
  };

  if (!user?.companyId) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Compass className="h-8 w-8 text-blue-600 animate-pulse" />
          <h1 className="text-3xl font-bold text-gray-900">Perspectives</h1>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Perspective
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-[1.01]">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Perspective' : 'Add New Perspective'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perspective Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ description: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter perspective description..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ description: '' });
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => editingId ? handleSaveEdit() : handleAddPerspective()}
                disabled={!formData.description.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {editingId ? 'Save Changes' : 'Add Perspective'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {perspectives.map((perspective, index) => (
          <div
            key={perspective.id}
            className={`transform transition-all duration-500 hover:scale-[1.02] ${
              showAnimation
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-medium text-gray-900">{perspective.description}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(perspective)}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(perspective.id)}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {perspectives.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Compass className="h-12 w-12 text-blue-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No perspectives defined yet</h3>
          <p className="mt-2 text-gray-500">Get started by adding your strategic perspectives.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add First Perspective
          </button>
        </div>
      )}
    </div>
  );
}