import React, { useState, useEffect } from 'react';
import { MapPin, ChevronUp, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { getPerspectives, getGoals } from '../services/storage';
import { calculateGoalCompletion } from '../services/storage/calculations';
import type { Perspective, Goal } from '../types';

interface PerspectiveWithGoals extends Perspective {
  goals: Goal[];
  totalCompletion: number;
  isExpanded?: boolean;
}

const PERSPECTIVE_COLORS = {
  'financial': 'bg-red-100 border-red-200 hover:bg-red-50',
  'customer': 'bg-emerald-100 border-emerald-200 hover:bg-emerald-50',
  'internal': 'bg-purple-100 border-purple-200 hover:bg-purple-50',
  'learning': 'bg-amber-100 border-amber-200 hover:bg-amber-50',
};

export function StrategicMap() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [perspectives, setPerspectives] = useState<PerspectiveWithGoals[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedView, setExpandedView] = useState(false);

  useEffect(() => {
    if (user?.companyId) {
      const loadData = async () => {
        const storedPerspectives = getPerspectives()
          .filter(p => p.companyId === user.companyId);
        
        const storedGoals = getGoals()
          .filter(g => g.companyId === user.companyId);

        const perspectivesWithGoals = storedPerspectives.map(perspective => {
          const perspectiveGoals = storedGoals
            .filter(goal => goal.perspectiveId === perspective.id);
          
          const totalCompletion = perspectiveGoals.length > 0
            ? perspectiveGoals.reduce((sum, goal) => sum + calculateGoalCompletion(goal.id), 0) / perspectiveGoals.length
            : 0;

          return {
            ...perspective,
            goals: perspectiveGoals,
            totalCompletion,
            isExpanded: true,
          };
        });

        setPerspectives(perspectivesWithGoals);
        setIsLoading(false);
      };

      loadData();
    }
  }, [user?.companyId]);

  const togglePerspective = (perspectiveId: string) => {
    setPerspectives(prev =>
      prev.map(p =>
        p.id === perspectiveId
          ? { ...p, isExpanded: !p.isExpanded }
          : p
      )
    );
  };

  const getColorClass = (index: number) => {
    const colors = Object.values(PERSPECTIVE_COLORS);
    return colors[index % colors.length];
  };

  if (!user?.companyId) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <MapPin className="h-8 w-8 text-indigo-600 animate-pulse" />
          <h1 className="text-3xl font-bold text-gray-900">{t('strategicMap.title')}</h1>
        </div>
        <button
          onClick={() => setExpandedView(!expandedView)}
          className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {expandedView ? (
            <>
              <Minimize2 className="h-4 w-4 mr-2" />
              {t('strategicMap.compactView')}
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4 mr-2" />
              {t('strategicMap.expandedView')}
            </>
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded-lg"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {perspectives.map((perspective, index) => (
            <div
              key={perspective.id}
              className={`rounded-lg border-2 transition-all duration-300 ${getColorClass(index)}`}
            >
              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => togglePerspective(perspective.id)}
              >
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {perspective.description}
                  </h3>
                  <div className="px-3 py-1 rounded-full bg-white text-sm font-medium">
                    {perspective.goals.length} {t('strategicMap.goals')}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${perspective.totalCompletion}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {Math.round(perspective.totalCompletion)}%
                    </span>
                  </div>
                </div>
                {perspective.isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>

              {perspective.isExpanded && (
                <div className={`p-4 pt-0 grid ${expandedView ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-4`}>
                  {perspective.goals.map(goal => (
                    <div
                      key={goal.id}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-sm font-medium text-gray-900 flex-1">
                          {goal.description}
                        </h4>
                        <span className="ml-2 px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">
                          {calculateGoalCompletion(goal.id)}%
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <span>{new Date(goal.startDate).toLocaleDateString()}</span>
                        <span>→</span>
                        <span>{new Date(goal.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${calculateGoalCompletion(goal.id)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {perspective.goals.length === 0 && (
                    <div className="col-span-full text-center py-4 text-gray-500 italic">
                      {t('strategicMap.noGoals')}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}