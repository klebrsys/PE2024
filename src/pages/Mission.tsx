import React, { useState, useEffect } from 'react';
import { Edit2, Save, Target, Quote } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { getMissions, setMissions } from '../services/storage';
import type { Mission } from '../types';

export function Mission() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [mission, setMission] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  // Load mission data
  const loadMission = () => {
    if (user?.companyId) {
      const missions = getMissions();
      const companyMission = missions.find(m => m.companyId === user.companyId);
      if (companyMission) {
        setMission(companyMission.description);
      }
      setIsLoading(false);
      // Trigger animation after loading
      setTimeout(() => setShowAnimation(true), 100);
    }
  };

  // Load initial data
  useEffect(() => {
    loadMission();
  }, [user?.companyId]);

  const handleSave = () => {
    if (!user?.companyId) return;

    const allMissions = getMissions();
    const existingMissionIndex = allMissions.findIndex(m => m.companyId === user.companyId);
    
    const missionData: Mission = {
      id: existingMissionIndex >= 0 ? allMissions[existingMissionIndex].id : Date.now().toString(),
      description: mission.trim(),
      companyId: user.companyId,
    };

    let updatedMissions: Mission[];
    if (existingMissionIndex >= 0) {
      updatedMissions = allMissions.map((m, index) => 
        index === existingMissionIndex ? missionData : m
      );
    } else {
      updatedMissions = [...allMissions, missionData];
    }

    setMissions(updatedMissions);
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
          <Target className="h-8 w-8 text-emerald-600 animate-pulse" />
          <h1 className="text-3xl font-bold text-gray-900">Mission</h1>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 hover:shadow-xl"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            {t('mission.edit')}
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="inline-flex items-center rounded-md bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 hover:shadow-xl"
          >
            <Save className="h-4 w-4 mr-2" />
            {t('mission.save')}
          </button>
        )}
      </div>

      <div className="relative bg-gradient-to-br from-white to-emerald-50 rounded-xl shadow-xl p-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -mr-16 -mt-16 opacity-50" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-100 rounded-full -ml-12 -mb-12 opacity-50" />
        
        <div className="relative">
          {isEditing ? (
            <div className="transition-all duration-300 transform hover:scale-101">
              <textarea
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                className="w-full h-64 p-6 text-lg bg-white bg-opacity-50 backdrop-blur-sm border-2 border-emerald-100 rounded-lg shadow-inner focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                placeholder={t('mission.placeholder')}
              />
            </div>
          ) : (
            <div className="min-h-[16rem] flex items-center justify-center">
              {isLoading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="h-4 w-48 bg-emerald-200 rounded"></div>
                </div>
              ) : mission ? (
                <div className={`space-y-4 transform transition-all duration-700 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <Quote className="h-8 w-8 text-emerald-600 mx-auto mb-4" />
                  <p className="text-xl md:text-2xl text-gray-800 font-medium text-center leading-relaxed">
                    {mission}
                  </p>
                </div>
              ) : (
                <div className={`text-center transform transition-all duration-500 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <Target className="h-12 w-12 text-emerald-300 mx-auto mb-4" />
                  <p className="text-gray-500 italic">{t('mission.empty')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {mission && !isEditing && (
        <div className="flex justify-center space-x-4 mt-6">
          <div className="px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium animate-fade-in">
            Purpose Driven
          </div>
          <div className="px-4 py-2 bg-teal-50 rounded-full text-teal-700 text-sm font-medium animate-fade-in delay-100">
            Making Impact
          </div>
          <div className="px-4 py-2 bg-green-50 rounded-full text-green-700 text-sm font-medium animate-fade-in delay-200">
            Creating Value
          </div>
        </div>
      )}
    </div>
  );
}