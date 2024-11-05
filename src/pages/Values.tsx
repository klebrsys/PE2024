import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, BookOpen, Info, Gem, Star, Award, Medal, Crown, Diamond } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { getValues, setValues } from '../services/storage';
import type { Value } from '../types';

// Array of different value icons for variety
const valueIcons = [Star, Award, Medal, Crown, Diamond];

export function Values() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [values, setValuesState] = useState<Value[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    meaning: ''
  });
  const [showMeaning, setShowMeaning] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load values data
  const loadValues = () => {
    if (user?.companyId) {
      const storedValues = getValues();
      const companyValues = storedValues.filter(v => v.companyId === user.companyId);
      setValuesState(companyValues);
      setIsLoading(false);
      // Trigger animation after loading
      setTimeout(() => setShowAnimation(true), 100);
    }
  };

  // Load initial data
  useEffect(() => {
    loadValues();
  }, [user?.companyId]);

  const handleAddValue = () => {
    if (!formData.description.trim() || !user?.companyId) return;

    const value: Value = {
      id: Date.now().toString(),
      description: formData.description.trim(),
      meaning: formData.meaning.trim(),
      companyId: user.companyId,
    };
    
    const allValues = getValues();
    const updatedValues = [...allValues, value];
    setValues(updatedValues);
    setValuesState(updatedValues.filter(v => v.companyId === user.companyId));
    setFormData({ description: '', meaning: '' });
    setShowForm(false);
    
    // Trigger animation for new item
    setShowAnimation(false);
    setTimeout(() => setShowAnimation(true), 100);
  };

  const handleEdit = (value: Value) => {
    setEditingId(value.id);
    setFormData({
      description: value.description,
      meaning: value.meaning
    });
    setShowForm(true);
  };

  const handleSaveEdit = () => {
    if (!formData.description.trim() || !editingId) return;

    const allValues = getValues();
    const updatedValues = allValues.map(v =>
      v.id === editingId ? { 
        ...v, 
        description: formData.description.trim(),
        meaning: formData.meaning.trim()
      } : v
    );
    
    setValues(updatedValues);
    setValuesState(updatedValues.filter(v => v.companyId === user?.companyId));
    setEditingId(null);
    setFormData({ description: '', meaning: '' });
    setShowForm(false);
    
    // Trigger animation after edit
    setShowAnimation(false);
    setTimeout(() => setShowAnimation(true), 100);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(t('values.confirmDelete'))) return;

    const allValues = getValues();
    const updatedValues = allValues.filter(v => v.id !== id);
    setValues(updatedValues);
    setValuesState(updatedValues.filter(v => v.companyId === user?.companyId));
  };

  if (!user?.companyId) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Gem className="h-8 w-8 text-indigo-600 animate-pulse" />
          <h1 className="text-3xl font-bold text-gray-900">Values</h1>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Value
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-[1.01]">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Value' : 'Add New Value'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter value description..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value Meaning
              </label>
              <textarea
                value={formData.meaning}
                onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={3}
                placeholder="Describe what this value means..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ description: '', meaning: '' });
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => editingId ? handleSaveEdit() : handleAddValue()}
                disabled={!formData.description.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {editingId ? 'Save Changes' : 'Add Value'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {values.map((value, index) => {
          const IconComponent = valueIcons[index % valueIcons.length];
          return (
            <div
              key={value.id}
              className={`transform transition-all duration-500 hover:scale-[1.02] ${
                showAnimation
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-4 w-4 text-indigo-500" />
                    <h3 className="text-lg font-medium text-gray-900">{value.description}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowMeaning(showMeaning === value.id ? null : value.id)}
                      className="text-gray-500 hover:text-indigo-600 transition-colors"
                      title="Show meaning"
                    >
                      <BookOpen className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(value)}
                      className="text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(value.id)}
                      className="text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Meaning Popup */}
                {showMeaning === value.id && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md animate-fade-in">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">{value.meaning || 'No meaning provided'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {values.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Gem className="h-12 w-12 text-indigo-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No values defined yet</h3>
          <p className="mt-2 text-gray-500">Get started by adding your company's core values.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add First Value
          </button>
        </div>
      )}
    </div>
  );
}