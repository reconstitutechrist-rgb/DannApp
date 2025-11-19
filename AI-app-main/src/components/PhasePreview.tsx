"use client";

import React from 'react';
import type { BuildPhase } from '../types/appConcept';

interface PhasePreviewProps {
  phase: BuildPhase;
  onStart: () => void;
  onCancel: () => void;
  onCustomize?: () => void;
}

/**
 * Preview component shown BEFORE building a phase
 * Lets user see what will be built and customize if needed
 */
export default function PhasePreview({
  phase,
  onStart,
  onCancel,
  onCustomize,
}: PhasePreviewProps) {
  const estimatedMinutes = phase.estimatedHours ? Math.round(phase.estimatedHours * 60) : null;
  const complexityColor = {
    simple: 'text-green-400',
    moderate: 'text-yellow-400',
    complex: 'text-orange-400',
  }[phase.estimatedComplexity];

  const complexityLabel = {
    simple: 'Simple',
    moderate: 'Moderate',
    complex: 'Complex',
  }[phase.estimatedComplexity];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-lg border border-white/[0.08] w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-neutral-925">
          <h2 className="text-xl font-semibold text-white">
            🚀 Ready to Build Phase {phase.phaseNumber}
          </h2>
          <p className="text-sm text-neutral-400 mt-1">{phase.name}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <p className="text-sm text-neutral-300">{phase.description}</p>
          </div>

          {/* Objectives */}
          {phase.objectives && phase.objectives.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-200 mb-3">
                📋 What will be built:
              </h3>
              <div className="space-y-2">
                {phase.objectives.map((objective, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-neutral-800 border border-white/[0.06]"
                  >
                    <span className="text-green-400 mt-0.5">✓</span>
                    <p className="text-sm text-neutral-300 flex-1">{objective}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {phase.features && phase.features.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-200 mb-3">
                ⚡ Features to implement:
              </h3>
              <div className="flex flex-wrap gap-2">
                {phase.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-xs font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dependencies */}
          {phase.dependencies && phase.dependencies.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-200 mb-3">
                🔗 Depends on:
              </h3>
              <div className="flex flex-wrap gap-2">
                {phase.dependencies.map((dep, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Implementation Notes */}
          {phase.notes && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <h3 className="text-sm font-semibold text-blue-300 mb-2">
                💡 Implementation Notes
              </h3>
              <p className="text-sm text-blue-200">{phase.notes}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-neutral-800 border border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 text-sm">Complexity:</span>
              <span className={`text-sm font-semibold ${complexityColor}`}>
                {complexityLabel}
              </span>
            </div>
            {estimatedMinutes && (
              <>
                <div className="w-px h-4 bg-white/[0.1]" />
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 text-sm">Estimated time:</span>
                  <span className="text-sm font-semibold text-white">
                    {estimatedMinutes < 60
                      ? `${estimatedMinutes} minutes`
                      : `${phase.estimatedHours} ${phase.estimatedHours === 1 ? 'hour' : 'hours'}`
                    }
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Preview Notice */}
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-sm text-green-300">
              ✨ <strong>You'll review the implementation</strong> before it's applied.
              No changes will be made without your approval.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-neutral-925 flex items-center justify-between gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition-colors"
          >
            Cancel
          </button>

          <div className="flex gap-3">
            {onCustomize && (
              <button
                onClick={onCustomize}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition-colors flex items-center gap-2"
              >
                ⚙️ Customize
              </button>
            )}
            <button
              onClick={onStart}
              className="px-6 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors flex items-center gap-2"
            >
              🚀 Start Building
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
