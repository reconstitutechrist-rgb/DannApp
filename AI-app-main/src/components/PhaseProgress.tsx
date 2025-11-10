/**
 * PhaseProgress - Visual progress indicator for phased app building
 *
 * Features:
 * - Step-by-step progress visualization
 * - Phase status tracking
 * - Estimated time per phase
 * - Interactive phase navigation
 *
 * @version 1.0.0
 */

'use client';

import React from 'react';

export interface Phase {
  number: number;
  name: string;
  description: string;
  features?: string[];
  status: 'pending' | 'building' | 'complete' | 'error';
  estimatedTime?: number; // in seconds
  actualTime?: number;
  filesGenerated?: number;
}

interface PhaseProgressProps {
  phases: Phase[];
  currentPhase: number;
  onPhaseClick?: (phaseNumber: number) => void;
  compact?: boolean;
}

export default function PhaseProgress({ phases, currentPhase, onPhaseClick, compact = false }: PhaseProgressProps) {
  const totalPhases = phases.length;
  const completedPhases = phases.filter(p => p.status === 'complete').length;
  const progressPercentage = (completedPhases / totalPhases) * 100;

  // Calculate total time
  const totalEstimatedTime = phases.reduce((acc, p) => acc + (p.estimatedTime || 0), 0);
  const totalActualTime = phases.reduce((acc, p) => acc + (p.actualTime || 0), 0);

  const getStatusColor = (status: Phase['status']) => {
    switch (status) {
      case 'complete': return 'bg-green-500';
      case 'building': return 'bg-blue-500 animate-pulse';
      case 'error': return 'bg-red-500';
      default: return 'bg-slate-600';
    }
  };

  const getStatusIcon = (status: Phase['status']) => {
    switch (status) {
      case 'complete': return '✓';
      case 'building': return '⟳';
      case 'error': return '✕';
      default: return phase.number;
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        {/* Progress Bar */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">
              Phase {currentPhase}/{totalPhases}
            </span>
            <span className="text-xs text-slate-400">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Current Phase Name */}
        <div className="text-sm text-slate-300">
          {phases[currentPhase - 1]?.name || 'Complete'}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Building Progress</h3>
          <span className="text-sm text-slate-400">
            {completedPhases}/{totalPhases} phases complete
          </span>
        </div>

        {/* Overall Progress Bar */}
        <div className="relative">
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 transition-all duration-500 relative"
              style={{ width: `${progressPercentage}%` }}
            >
              {progressPercentage > 0 && progressPercentage < 100 && (
                <div className="absolute right-0 top-0 w-2 h-full bg-white/50 animate-pulse" />
              )}
            </div>
          </div>
          <span className="text-xs text-slate-400 mt-1 block text-right">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Phase List */}
      <div className="space-y-3">
        {phases.map((phase, index) => {
          const isActive = phase.number === currentPhase;
          const isClickable = onPhaseClick && phase.status === 'complete';

          return (
            <div
              key={phase.number}
              className={`
                group relative rounded-lg border transition-all
                ${isActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/50'}
                ${isClickable ? 'cursor-pointer hover:border-blue-400 hover:bg-slate-800' : ''}
              `}
              onClick={() => isClickable && onPhaseClick(phase.number)}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Phase Number/Status Icon */}
                  <div className={`
                    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                    text-white font-bold ${getStatusColor(phase.status)}
                  `}>
                    {getStatusIcon(phase.status)}
                  </div>

                  {/* Phase Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className={`
                          font-semibold mb-1
                          ${isActive ? 'text-white' : 'text-slate-300'}
                        `}>
                          {phase.name}
                        </h4>
                        <p className="text-sm text-slate-400">
                          {phase.description}
                        </p>
                      </div>

                      {/* Time Estimate */}
                      {(phase.estimatedTime || phase.actualTime) && (
                        <div className="text-xs text-slate-400 ml-4">
                          {phase.actualTime ? (
                            <span className="text-green-400">
                              {formatTime(phase.actualTime)}
                            </span>
                          ) : phase.estimatedTime ? (
                            <span>~{formatTime(phase.estimatedTime)}</span>
                          ) : null}
                        </div>
                      )}
                    </div>

                    {/* Features List */}
                    {phase.features && phase.features.length > 0 && (
                      <div className="mt-2">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-400">
                          {phase.features.slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-slate-600">▸</span>
                              <span className="flex-1">{feature}</span>
                            </li>
                          ))}
                          {phase.features.length > 4 && (
                            <li className="text-slate-500">
                              +{phase.features.length - 4} more...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Files Generated */}
                    {phase.filesGenerated && phase.filesGenerated > 0 && (
                      <div className="mt-2 text-xs text-slate-500">
                        📁 {phase.filesGenerated} files generated
                      </div>
                    )}

                    {/* Active Phase Indicator */}
                    {isActive && phase.status === 'building' && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs text-blue-400">Building...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Connection Line to Next Phase */}
                {index < phases.length - 1 && (
                  <div className={`
                    ml-5 mt-2 w-0.5 h-4 transition-colors
                    ${phase.status === 'complete' ? 'bg-green-500' : 'bg-slate-700'}
                  `} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      {totalActualTime > 0 && (
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Total Build Time:</span>
            <span className="font-semibold text-white">{formatTime(totalActualTime)}</span>
          </div>
          {totalEstimatedTime > 0 && totalActualTime !== totalEstimatedTime && (
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>Estimated:</span>
              <span>{formatTime(totalEstimatedTime)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
