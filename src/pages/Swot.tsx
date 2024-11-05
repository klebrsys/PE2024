import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { getSwotItems, setSwotItems } from '../services/storage';
import type { SwotItem } from '../types';

type SwotType = 'strength' | 'weakness' | 'opportunity' | 'threat';

const SWOT_LABELS = {
  strength: 'Strengths',
  weakness: 'Weaknesses',
  opportunity: 'Opportunities',
  threat: 'Threats'
};

export function Swot() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [items, setItems] = useState<SwotItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState('');
  const [selectedType, setSelectedType] = useState<SwotType>('strength');
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    if (user?.companyId) {
      const storedItems = getSwotItems();
      const companyItems = storedItems.filter(item => item.companyId === user.companyId);
      setItems(companyItems);
    }
  }, [user?.companyId]);

  const handleAddItem = () => {
    if (!newItem.trim() || !user?.companyId) return;

    const item: SwotItem = {
      id: Date.now().toString(),
      type: selectedType,
      description: newItem.trim(),
      companyId: user.companyId,
      createdAt: new Date(),
    };

    const updatedItems = [...items, item];
    setItems(updatedItems);
    setSwotItems([...getSwotItems(), item]);
    setNewItem('');
  };

  const handleEditItem = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setEditingId(id);
      setEditingText(item.description);
    }
  };

  const handleSaveEdit = (id: string) => {
    if (!editingText.trim()) return;

    const updatedItems = items.map(item =>
      item.id === id ? { ...item, description: editingText.trim() } : item
    );

    setItems(updatedItems);
    setSwotItems(getSwotItems().map(item =>
      item.id === id ? { ...item, description: editingText.trim() } : item
    ));
    setEditingId(null);
    setEditingText('');
  };

  const handleDeleteItem = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    setSwotItems(getSwotItems().filter(item => item.id !== id));
  };

  const getItemsByType = (type: SwotType) => {
    return items.filter(item => item.type === type);
  };

  const renderQuadrant = (type: SwotType, title: string, bgColor: string) => (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className={`text-lg font-semibold mb-4 ${bgColor} text-white p-2 rounded`}>
        {title}
      </h3>
      <div className="space-y-2">
        {getItemsByType(type).map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            {editingId === item.id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="flex-1 mr-2 p-1 border rounded"
              />
            ) : (
              <span className="flex-1">{item.description}</span>
            )}
            <div className="flex gap-2">
              {editingId === item.id ? (
                <button
                  onClick={() => handleSaveEdit(item.id)}
                  className="text-green-600 hover:text-green-900"
                >
                  <Save className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleEditItem(item.id)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!user?.companyId) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">SWOT Analysis</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <div className="flex gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as SwotType)}
              className="p-2 border rounded-md"
            >
              <option value="strength">Strengths</option>
              <option value="weakness">Weaknesses</option>
              <option value="opportunity">Opportunities</option>
              <option value="threat">Threats</option>
            </select>
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add new item..."
              className="flex-1 p-2 border rounded-md"
            />
            <button
              onClick={handleAddItem}
              disabled={!newItem.trim()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            {renderQuadrant('strength', 'Strengths', 'bg-blue-600')}
            {renderQuadrant('opportunity', 'Opportunities', 'bg-green-600')}
          </div>
          <div className="space-y-6">
            {renderQuadrant('weakness', 'Weaknesses', 'bg-red-600')}
            {renderQuadrant('threat', 'Threats', 'bg-yellow-600')}
          </div>
        </div>
      </div>
    </div>
  );
}