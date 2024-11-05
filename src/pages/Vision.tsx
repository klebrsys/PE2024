import React, { useState, useEffect } from 'react';
import { Edit2, Save, Lightbulb, Quote } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { getVisions, setVisions } from '../services/storage';
import type { Vision } from '../types';

export function Vision() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [vision, setVision] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  // Load vision data
  const loadVision = () => {
    if (user?.companyId) {
      const visions = getVisions();
      const companyVision = visions.find(v => v.companyId === user.companyId);
      if (companyVision) {
        setVision(companyVision.description);
      }
      setIsLoading(false);
      // Trigger animation after loading
      setTimeout(() => setShowAnimation(true), 100);
    }
  };

  // Load initial data
  useEffect(() => {
    loadVision();
  }, [user?.companyId]);

  const handleSave = () => {
    if (!user?.companyId) return;

    const allVisions = getVisions();
    const existingVisionIndex = allVisions.findIndex(v => v.companyId === user.companyId);
    
    const visionData: Vision = {
      id: existingVisionIndex >= 0 ? allVisions[existingVisionIndex].id : Date.now().toString(),
      description: vision.trim(),
      companyId: user.companyId,
    };

    let updatedVisions: Vision[];
    if (existingVisionIndex >= 0) {
      updatedVisions = allVisions.map((v, index) => 
        index === existingVisionIndex ? visionData : v
      );
    } else {
      updatedVisions = [...allVisions, visionData];
    }

    setVisions(updatedVisions);
    setIsEditing(false);
    // Trigger animation after saving
    setShowAnimation(false);
    setTimeout(() => setShowAnimation(true), 100);
  };

  if (!user?.companyId) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Lightbulb className="h-8 w-8 text-indigo-600 animate-pulse" />
          <h1 className="text-3xl font-bold text-gray-900">Vision</h1>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 hover:shadow-xl"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            {t('vision.edit')}
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="inline-flex items-center rounded-md bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 hover:shadow-xl"
          >
            <Save className="h-4 w-4 mr-2" />
            {t('vision.save')}
          </button>
        )}
      </div>

      <div className="relative bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-xl p-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -mr-16 -mt-16 opacity-50" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-100 rounded-full -ml-12 -mb-12 opacity-50" />
        
        <div className="relative">
          {isEditing ? (
            <div className="transition-all duration-300 transform hover:scale-101">
              <textarea
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                className="w-full h-64 p-6 text-lg bg-white bg-opacity-50 backdrop-blur-sm border-2 border-indigo-100 rounded-lg shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder={t('vision.placeholder')}
              />
            </div>
          ) : (
            <div className="min-h-[16rem] flex items-center justify-center">
              {isLoading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="h-4 w-48 bg-indigo-200 rounded"></div>
                </div>
              ) : vision ? (
                <div className={`space-y-4 transform transition-all duration-700 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <Quote className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
                  <p className="text-xl md:text-2xl text-gray-800 font-medium text-center leading-relaxed">
                    {vision}
                  </p>
                </div>
              ) : (
                <div className={`text-center transform transition-all duration-500 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <Lightbulb className="h-12 w-12 text-indigo-300 mx-auto mb-4" />
                  <p className="text-gray-500 italic">{t('vision.empty')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {vision && !isEditing && (
        <div className="flex justify-center space-x-4 mt-6">
          <div className="px-4 py-2 bg-indigo-50 rounded-full text-indigo-700 text-sm font-medium animate-fade-in">
            Inspiring the Future
          </div>
          <div className="px-4 py-2 bg-purple-50 rounded-full text-purple-700 text-sm font-medium animate-fade-in delay-100">
            Driving Innovation
          </div>
          <div className="px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium animate-fade-in delay-200">
            Creating Impact
          </div>
        </div>
      )}
    </div>
  );
}