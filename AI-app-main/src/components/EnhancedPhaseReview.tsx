"use client";

import React, { useState } from 'react';
import type { BuildPhase } from '../types/appConcept';

interface FileDiff {
  path: string;
  action: 'MODIFY' | 'CREATE' | 'DELETE';
  changes: any[];
  matchedObjective?: string; // Which objective does this file fulfill?
  aiExplanation?: string; // What does this file do?
}

interface EnhancedPhaseReviewProps {
  phase: BuildPhase;
  files: FileDiff[];
  summary: string;
  onApprove: () => void;
  onReject: () => void;
  onRequestChanges?: (feedback: string) => void;
  onAskQuestion?: (question: string) => void;
}

export default function EnhancedPhaseReview({
  phase,
  files,
  summary,
  onApprove,
  onReject,
  onRequestChanges,
  onAskQuestion,
}: EnhancedPhaseReviewProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [showChangesMode, setShowChangesMode] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [question, setQuestion] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const toggleFile = (path: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFiles(newExpanded);
  };

  // Auto-match files to objectives
  const matchFileToObjective = (filePath: string): string | null => {
    const fileName = filePath.split('/').pop()?.toLowerCase() || '';

    for (const objective of phase.objectives || []) {
      const objectiveLower = objective.toLowerCase();

      // Check for keyword matches
      if (
        (objectiveLower.includes('auth') && fileName.includes('auth')) ||
        (objectiveLower.includes('login') && fileName.includes('login')) ||
        (objectiveLower.includes('register') && fileName.includes('register')) ||
        (objectiveLower.includes('form') && fileName.includes('form')) ||
        (objectiveLower.includes('middleware') && fileName.includes('middleware')) ||
        (objectiveLower.includes('route') && fileName.includes('route')) ||
        (objectiveLower.includes('database') && (fileName.includes('db') || fileName.includes('database'))) ||
        (objectiveLower.includes('supabase') && fileName.includes('supabase'))
      ) {
        return objective;
      }
    }

    return null;
  };

  // Generate AI explanation for file
  const generateFileExplanation = (file: FileDiff): string => {
    const fileName = file.path.split('/').pop() || '';

    if (file.action === 'CREATE') {
      if (fileName.includes('Form')) {
        return 'New form component with validation and error handling';
      } else if (fileName.includes('middleware')) {
        return 'Middleware for route protection and authentication checks';
      } else if (fileName.includes('supabase') || fileName.includes('db')) {
        return 'Database client configuration and connection setup';
      } else if (fileName.includes('page')) {
        return 'Next.js page component with routing';
      } else if (fileName.includes('layout')) {
        return 'Layout component for page structure';
      }
    }

    return file.action === 'CREATE' ? 'New file created' : file.action === 'MODIFY' ? 'Existing file modified' : 'File deleted';
  };

  // Check if all objectives are met
  const checkObjectivesCoverage = (): { met: string[]; unmet: string[] } => {
    const met: string[] = [];
    const unmet: string[] = [];

    for (const objective of phase.objectives || []) {
      const hasMatchingFile = files.some(file =>
        matchFileToObjective(file.path) === objective
      );

      if (hasMatchingFile) {
        met.push(objective);
      } else {
        unmet.push(objective);
      }
    }

    return { met, unmet };
  };

  const { met: metObjectives, unmet: unmetObjectives } = checkObjectivesCoverage();
  const allObjectivesMet = unmetObjectives.length === 0;

  const getActionColor = (action: FileDiff['action']) => {
    const colors = {
      'MODIFY': 'border-blue-500/30 bg-blue-500/10 text-blue-400',
      'CREATE': 'border-green-500/30 bg-green-500/10 text-green-400',
      'DELETE': 'border-red-500/30 bg-red-500/10 text-red-400'
    };
    return colors[action];
  };

  const getActionIcon = (action: FileDiff['action']) => {
    return action === 'CREATE' ? '✨' : action === 'MODIFY' ? '📝' : '🗑️';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-lg border border-white/[0.08] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-neutral-925">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                🔍 Phase {phase.phaseNumber} Review: {phase.name}
              </h2>
              <p className="text-sm text-neutral-400 mt-1">{phase.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowChangesMode(!showChangesMode)}
                className="px-3 py-1.5 text-xs rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              >
                {showChangesMode ? '📋 Checklist View' : '🔍 Details View'}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!showChangesMode ? (
            // Checklist View (Default)
            <div className="p-6 space-y-6">
              {/* Plan vs Implementation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Plan */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">
                    📋 Expected (from plan)
                  </h3>

                  <div className="space-y-3">
                    {phase.objectives && phase.objectives.length > 0 ? (
                      phase.objectives.map((objective, idx) => {
                        const isMet = metObjectives.includes(objective);
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border ${
                              isMet
                                ? 'bg-green-500/10 border-green-500/30'
                                : 'bg-yellow-500/10 border-yellow-500/30'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-lg">{isMet ? '✅' : '⚠️'}</span>
                              <div className="flex-1">
                                <p className={`text-sm ${isMet ? 'text-green-300' : 'text-yellow-300'}`}>
                                  {objective}
                                </p>
                                {isMet && (
                                  <p className="text-xs text-neutral-500 mt-1">
                                    Implemented ✓
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-neutral-500">No specific objectives defined</p>
                    )}
                  </div>

                  {phase.notes && (
                    <div className="p-3 rounded-lg bg-neutral-800 border border-white/[0.06]">
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                        Implementation Notes
                      </p>
                      <p className="text-sm text-neutral-300">{phase.notes}</p>
                    </div>
                  )}
                </div>

                {/* Right: Implementation */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">
                    ✅ Implementation
                  </h3>

                  <div className="space-y-2">
                    {files.map((file, idx) => {
                      const matchedObjective = matchFileToObjective(file.path);
                      const explanation = generateFileExplanation(file);

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border ${getActionColor(file.action)}`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg">{getActionIcon(file.action)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-mono truncate">
                                {file.path}
                              </p>
                              <p className="text-xs text-neutral-400 mt-1">
                                {explanation}
                              </p>
                              {matchedObjective && (
                                <p className="text-xs text-green-400 mt-1">
                                  ✓ Matches: "{matchedObjective.substring(0, 50)}..."
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => toggleFile(file.path)}
                              className="text-xs text-neutral-500 hover:text-neutral-300"
                            >
                              {expandedFiles.has(file.path) ? '▼' : '▶'}
                            </button>
                          </div>

                          {/* Expanded changes */}
                          {expandedFiles.has(file.path) && file.changes.length > 0 && (
                            <div className="mt-3 pl-6 border-l-2 border-white/[0.1] space-y-1">
                              {file.changes.map((change, changeIdx) => (
                                <div key={changeIdx} className="text-xs text-neutral-500">
                                  {change.type}: {change.searchFor?.substring(0, 40) || 'N/A'}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-lg bg-neutral-800 border border-white/[0.06]">
                <p className="text-sm text-neutral-300">{summary}</p>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-lg border ${
                allObjectivesMet
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-yellow-500/10 border-yellow-500/30'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{allObjectivesMet ? '✅' : '⚠️'}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${
                      allObjectivesMet ? 'text-green-300' : 'text-yellow-300'
                    }`}>
                      {allObjectivesMet
                        ? `All ${metObjectives.length} objectives met`
                        : `${metObjectives.length}/${phase.objectives?.length || 0} objectives met`
                      }
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {files.length} files {files.length === 1 ? 'created' : 'total'} •
                      {phase.estimatedHours ? ` Estimated: ${phase.estimatedHours} hours` : ' No time estimate'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Details View (File-by-file changes)
            <div className="p-6 space-y-4">
              <p className="text-sm text-neutral-400">
                Detailed view of all {files.length} file changes
              </p>
              {/* Original DiffPreview content would go here */}
              <div className="text-sm text-neutral-500 text-center py-8">
                Detailed diff view - to be implemented with existing DiffPreview component
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-neutral-925">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setShowQuestionForm(true)}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition-colors flex items-center gap-2"
              >
                💬 Ask Questions
              </button>
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium transition-colors flex items-center gap-2"
              >
                ⚠️ Request Changes
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onReject}
                className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              >
                ❌ Reject
              </button>
              <button
                onClick={onApprove}
                className="px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
              >
                ✅ Approve & Continue
              </button>
            </div>
          </div>

          {/* Feedback Form */}
          {showFeedbackForm && (
            <div className="mt-4 p-4 rounded-lg bg-neutral-800 border border-yellow-500/30">
              <p className="text-sm font-semibold text-yellow-300 mb-2">
                What would you like changed?
              </p>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="E.g., Add email verification to the registration form..."
                className="w-full px-3 py-2 bg-neutral-900 border border-white/[0.08] rounded text-sm text-white placeholder-neutral-600 resize-none"
                rows={3}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setShowFeedbackForm(false)}
                  className="px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-neutral-300 text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (onRequestChanges && feedback.trim()) {
                      onRequestChanges(feedback);
                      setFeedback('');
                      setShowFeedbackForm(false);
                    }
                  }}
                  disabled={!feedback.trim()}
                  className="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Changes Request
                </button>
              </div>
            </div>
          )}

          {/* Question Form */}
          {showQuestionForm && (
            <div className="mt-4 p-4 rounded-lg bg-neutral-800 border border-blue-500/30">
              <p className="text-sm font-semibold text-blue-300 mb-2">
                Ask a question about this implementation
              </p>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="E.g., How does the authentication middleware work?"
                className="w-full px-3 py-2 bg-neutral-900 border border-white/[0.08] rounded text-sm text-white placeholder-neutral-600 resize-none"
                rows={2}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setShowQuestionForm(false)}
                  className="px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-neutral-300 text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (onAskQuestion && question.trim()) {
                      onAskQuestion(question);
                      setQuestion('');
                      setShowQuestionForm(false);
                    }
                  }}
                  disabled={!question.trim()}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Ask AI
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
