"use client";

import { useState } from 'react';
import type { ImplementationPlan, BuildPhase } from '../types/appConcept';
import { calculateProgress } from '../utils/planGenerator';

interface GuidedBuildViewProps {
  plan: ImplementationPlan;
  onPhaseStart: (phase: BuildPhase) => void;
  onUpdatePlan: (updatedPlan: ImplementationPlan) => void;
  onExit: () => void;
}

export default function GuidedBuildView({ plan, onPhaseStart, onUpdatePlan, onExit }: GuidedBuildViewProps) {
  const [showAllPhases, setShowAllPhases] = useState(false);
  const progress = calculateProgress(plan);

  const markPhaseComplete = (phaseId: string) => {
    const updatedPlan = {
      ...plan,
      phases: plan.phases.map(p =>
        p.id === phaseId ? { ...p, status: 'completed' as const, result: { completedAt: new Date().toISOString() } } : p
      ),
    };
    onUpdatePlan(updatedPlan);
  };

  const skipPhase = (phaseId: string) => {
    const updatedPlan = {
      ...plan,
      phases: plan.phases.map(p =>
        p.id === phaseId ? { ...p, status: 'skipped' as const } : p
      ),
    };
    onUpdatePlan(updatedPlan);
  };

  const getPhaseIcon = (phase: BuildPhase) => {
    if (phase.status === 'completed') return '✅';
    if (phase.status === 'in-progress') return '⚙️';
    if (phase.status === 'skipped') return '⏭️';
    return '⏸️';
  };

  const getPhaseColor = (phase: BuildPhase) => {
    if (phase.status === 'completed') return 'border-green-500/30 bg-green-500/10';
    if (phase.status === 'in-progress') return 'border-blue-500/30 bg-blue-500/10';
    if (phase.status === 'skipped') return 'border-slate-500/30 bg-slate-500/10';
    return 'border-white/10 bg-white/5';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-black/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🎯</span>
              <span>{plan.concept.name}</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">{plan.concept.description}</p>
          </div>
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-all text-sm"
          >
            Exit Guided Mode
          </button>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-300">Build Progress</span>
            <span className="text-blue-400 font-medium">{progress.percentComplete}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress.percentComplete}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
            <span>{progress.completed} of {progress.total} phases completed</span>
            {progress.nextPhase && <span>Next: {progress.nextPhase.name}</span>}
          </div>
        </div>
      </div>

      {/* Current/Next Phase */}
      {(progress.currentPhase || progress.nextPhase) && (
        <div className="px-6 py-6 border-b border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
          {progress.currentPhase ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">⚙️</span>
                <div>
                  <div className="text-sm text-blue-300 font-medium">Currently Building</div>
                  <h3 className="text-lg font-bold text-white">{progress.currentPhase.name}</h3>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-4">{progress.currentPhase.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => markPhaseComplete(progress.currentPhase!.id)}
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-all"
                >
                  ✓ Mark Complete
                </button>
                <button
                  onClick={() => skipPhase(progress.currentPhase!.id)}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-sm transition-all"
                >
                  Skip
                </button>
              </div>
            </div>
          ) : progress.nextPhase && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🚀</span>
                <div>
                  <div className="text-sm text-purple-300 font-medium">Up Next</div>
                  <h3 className="text-lg font-bold text-white">{progress.nextPhase.name}</h3>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-4">{progress.nextPhase.description}</p>

              <div className="bg-black/20 rounded-lg p-4 mb-4">
                <div className="text-xs text-slate-400 mb-2">AI Prompt for this phase:</div>
                <div className="text-sm text-slate-200 font-mono whitespace-pre-wrap">
                  {progress.nextPhase.prompt.slice(0, 200)}...
                </div>
              </div>

              <button
                onClick={() => onPhaseStart(progress.nextPhase!)}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all flex items-center gap-2"
              >
                <span>🚀</span>
                <span>Start This Phase</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* All Phases */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Implementation Plan</h3>
          <button
            onClick={() => setShowAllPhases(!showAllPhases)}
            className="text-sm text-blue-400 hover:text-blue-300 transition-all"
          >
            {showAllPhases ? 'Show Less' : 'Show All Details'}
          </button>
        </div>

        <div className="space-y-3">
          {plan.phases.map((phase, index) => {
            const isActive = progress.currentPhase?.id === phase.id;
            const isNext = progress.nextPhase?.id === phase.id;
            const isCompleted = phase.status === 'completed';

            return (
              <div
                key={phase.id}
                className={`border rounded-lg p-4 transition-all ${getPhaseColor(phase)} ${
                  isActive ? 'ring-2 ring-blue-500' : isNext ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getPhaseIcon(phase)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-400">Phase {phase.phaseNumber}</span>
                      {isActive && <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded">IN PROGRESS</span>}
                      {isNext && !isActive && <span className="text-xs px-2 py-0.5 bg-purple-500 text-white rounded">NEXT</span>}
                    </div>
                    <h4 className="font-semibold text-white mb-1">{phase.name}</h4>
                    <p className="text-sm text-slate-300 mb-2">{phase.description}</p>

                    {showAllPhases && (
                      <div className="mt-3 space-y-2">
                        <div>
                          <div className="text-xs text-slate-400 mb-1">Objectives:</div>
                          <ul className="text-sm text-slate-300 space-y-1">
                            {phase.objectives.map((obj, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-400">→</span>
                                <span>{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {phase.status === 'pending' && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <button
                              onClick={() => onPhaseStart(phase)}
                              disabled={phase.dependencies.some(depId => {
                                const dep = plan.phases.find(p => p.id === depId);
                                return dep?.status !== 'completed';
                              })}
                              className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              Start Phase
                            </button>
                          </div>
                        )}

                        {isCompleted && phase.result?.completedAt && (
                          <div className="text-xs text-green-400 mt-2">
                            ✓ Completed {new Date(phase.result.completedAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      phase.estimatedComplexity === 'simple'
                        ? 'bg-green-500/20 text-green-300'
                        : phase.estimatedComplexity === 'moderate'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {phase.estimatedComplexity}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {progress.percentComplete === 100 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-white mb-2">Build Complete!</h3>
            <p className="text-slate-300 mb-4">
              All phases have been completed. Your app "{plan.concept.name}" is ready!
            </p>
            <button
              onClick={onExit}
              className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all"
            >
              View Final App
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
