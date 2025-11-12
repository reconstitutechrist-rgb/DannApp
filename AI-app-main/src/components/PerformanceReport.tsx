'use client';

import React, { useState } from 'react';
import { Zap, TrendingUp, ChevronDown, ChevronRight, Wrench } from 'lucide-react';
import type { PerformanceReport as IPerformanceReport, PerformanceIssue } from '../utils/performanceOptimization';
import {
  getSeverityColor,
  getCategoryIcon,
  getCategoryLabel,
  getPerformanceGradeColor,
  groupIssuesByCategory,
  sortIssuesByImpact
} from '../utils/performanceOptimization';

interface PerformanceReportProps {
  report: IPerformanceReport;
  onApplyFixes?: (issues: PerformanceIssue[]) => void;
  onClose: () => void;
  isApplyingFixes?: boolean;
}

/**
 * Performance Report Display Component
 * Shows performance analysis with issues, quick wins, and optimizations
 */
export default function PerformanceReport({
  report,
  onApplyFixes,
  onClose,
  isApplyingFixes = false
}: PerformanceReportProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['render', 'computation']));
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'all' | 'quickWins'>('quickWins');

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleIssue = (issueIndex: number) => {
    const newSelected = new Set(selectedIssues);
    const key = `${issueIndex}`;
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedIssues(newSelected);
  };

  const selectAllQuickWins = () => {
    const quickWinIndexes = report.quickWins
      .map(quickWin => report.issues.findIndex(i => i.issue === quickWin.issue && i.file === quickWin.file))
      .filter(idx => idx >= 0 && report.issues[idx].autoFixable)
      .map(idx => `${idx}`);
    setSelectedIssues(new Set(quickWinIndexes));
  };

  const handleApplySelected = () => {
    const issuesToFix = report.issues.filter((_, idx) => selectedIssues.has(`${idx}`));
    onApplyFixes?.(issuesToFix);
  };

  const issuesByCategory = groupIssuesByCategory(report.issues);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-6xl w-full my-8">
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10 bg-gradient-to-r from-orange-500/10 to-yellow-500/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              <span>Performance Report</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-all text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Score & Grade */}
          <div className="flex items-center gap-6">
            <div className={`px-8 py-4 rounded-xl border ${getPerformanceGradeColor(report.grade)}`}>
              <div className="text-5xl font-bold text-center">{report.grade}</div>
              <div className="text-sm text-slate-400 text-center mt-1">Grade</div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Performance Score</span>
                <span className="text-xl font-bold text-white">{report.overallScore}/100</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    report.overallScore >= 90
                      ? 'bg-green-500'
                      : report.overallScore >= 70
                      ? 'bg-blue-500'
                      : report.overallScore >= 50
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${report.overallScore}%` }}
                />
              </div>
              <p className="text-sm text-slate-400 mt-2">{report.summary}</p>
              <div className="flex items-center gap-2 mt-2 text-orange-300 font-medium">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Potential: {report.metrics.estimatedSpeedupPotential}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="px-8 py-6 border-b border-white/10 bg-slate-800/50">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Performance Issues</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-300">{report.metrics.totalIssues}</div>
              <div className="text-xs text-slate-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{report.metrics.critical}</div>
              <div className="text-xs text-slate-500">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{report.metrics.high}</div>
              <div className="text-xs text-slate-500">High</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{report.metrics.medium}</div>
              <div className="text-xs text-slate-500">Medium</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{report.metrics.low}</div>
              <div className="text-xs text-slate-500">Low</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{report.metrics.autoFixableCount}</div>
              <div className="text-xs text-slate-500">Auto-fixable</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 py-4 border-b border-white/10 bg-slate-800/30">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('quickWins')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'quickWins'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Quick Wins ({report.quickWins.length})</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              All Issues ({report.issues.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 max-h-[500px] overflow-y-auto">
          {/* Quick Wins Tab */}
          {activeTab === 'quickWins' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-500" />
                    <span>Top Optimizations - Biggest Impact</span>
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Fix these first for maximum performance improvement
                  </p>
                </div>
                {report.quickWins.filter(q => q.autoFixable).length > 0 && (
                  <button
                    onClick={selectAllQuickWins}
                    className="text-xs px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-all"
                  >
                    Select All Quick Wins
                  </button>
                )}
              </div>

              {report.quickWins.map((issue, idx) => {
                const globalIdx = report.issues.findIndex(i => i.issue === issue.issue && i.file === issue.file);
                const isSelected = selectedIssues.has(`${globalIdx}`);

                return (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg border border-orange-500/30 p-4"
                  >
                    <div className="flex items-start gap-3">
                      {issue.autoFixable && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleIssue(globalIdx)}
                          className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10"
                        />
                      )}

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded border ${getSeverityColor(issue.severity)}`}>
                              {issue.severity.toUpperCase()}
                            </span>
                            <span className="font-medium text-white">{issue.issue}</span>
                          </div>
                          {issue.autoFixable && (
                            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-500/20 text-green-300 whitespace-nowrap">
                              <Wrench className="w-3 h-3" />
                              Auto-fix
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-400 mb-2">
                          📄 {issue.file}{issue.line ? `:${issue.line}` : ''}
                        </div>

                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-2">
                          <div className="text-sm font-semibold text-orange-300 mb-1">⚡ Impact:</div>
                          <p className="text-sm text-slate-300">{issue.impact}</p>
                          <div className="text-xs text-orange-400 mt-1 font-medium">
                            Estimated improvement: {issue.estimatedImprovement}
                          </div>
                        </div>

                        <p className="text-sm text-slate-300 mb-2">{issue.explanation}</p>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                          <div className="text-xs font-semibold text-blue-300 mb-1">💡 How to Fix:</div>
                          <p className="text-sm text-slate-300">{issue.suggestion}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* All Issues Tab */}
          {activeTab === 'all' && (
            <div className="space-y-4">
              {Array.from(issuesByCategory.entries()).map(([category, issues]) => (
                <div key={category} className="bg-slate-800/50 rounded-lg border border-white/10">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getCategoryIcon(category)}</span>
                      <span className="font-medium text-white">{getCategoryLabel(category)}</span>
                      <span className="text-xs px-2 py-1 rounded bg-white/10 text-slate-400">
                        {issues.length}
                      </span>
                    </div>
                    {expandedCategories.has(category) ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  {expandedCategories.has(category) && (
                    <div className="border-t border-white/10">
                      {issues.map((issue, idx) => {
                        const globalIdx = report.issues.indexOf(issue);
                        const isSelected = selectedIssues.has(`${globalIdx}`);

                        return (
                          <div
                            key={idx}
                            className="px-4 py-4 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-all"
                          >
                            <div className="flex items-start gap-3">
                              {issue.autoFixable && (
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleIssue(globalIdx)}
                                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10"
                                />
                              )}

                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 rounded border ${getSeverityColor(issue.severity)}`}>
                                      {issue.severity.toUpperCase()}
                                    </span>
                                    <span className="font-medium text-white">{issue.issue}</span>
                                  </div>
                                  {issue.autoFixable && (
                                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-500/20 text-green-300">
                                      <Wrench className="w-3 h-3" />
                                      Auto-fix
                                    </span>
                                  )}
                                </div>

                                <div className="text-xs text-slate-400 mb-2">
                                  📄 {issue.file}{issue.line ? `:${issue.line}` : ''} • {issue.estimatedImprovement}
                                </div>

                                <p className="text-sm text-slate-300 mb-2">{issue.explanation}</p>

                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                  <div className="text-xs font-semibold text-blue-300 mb-1">💡 Fix:</div>
                                  <p className="text-sm text-slate-300">{issue.suggestion}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Strengths & Recommendations */}
          <div className="mt-6 space-y-6">
            {report.strengths.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span>✅</span>
                  <span>Strengths</span>
                </h3>
                <div className="space-y-2">
                  {report.strengths.map((strength, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-green-300 text-sm">
                      <span>•</span>
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span>💡</span>
                  <span>Recommendations</span>
                </h3>
                <div className="space-y-2">
                  {report.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-blue-300 text-sm">
                      <span>•</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-white/10 bg-slate-800/50 flex items-center justify-between">
          <div className="text-sm text-slate-400">
            {selectedIssues.size > 0 && `${selectedIssues.size} optimization(s) selected`}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-all"
            >
              Close
            </button>
            {onApplyFixes && selectedIssues.size > 0 && (
              <button
                onClick={handleApplySelected}
                disabled={isApplyingFixes}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-medium transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isApplyingFixes ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Applying...</span>
                  </>
                ) : (
                  <>
                    <Wrench className="w-4 h-4" />
                    <span>Apply Selected Optimizations</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
