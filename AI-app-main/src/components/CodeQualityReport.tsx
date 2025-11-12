'use client';

import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, XCircle, ChevronDown, ChevronRight, Wrench } from 'lucide-react';
import type { QualityReport, QualityIssue } from '../utils/codeQuality';
import {
  getSeverityColor,
  getCategoryIcon,
  getGradeColor,
  groupIssuesByCategory,
  sortIssuesBySeverity,
  getSeverityLabel,
  getCategoryLabel
} from '../utils/codeQuality';

interface CodeQualityReportProps {
  report: QualityReport;
  onApplyFixes?: (issues: QualityIssue[]) => void;
  onClose: () => void;
  isApplyingFixes?: boolean;
}

/**
 * Code Quality Report Display Component
 * Shows comprehensive code analysis with issues, strengths, and recommendations
 */
export default function CodeQualityReport({
  report,
  onApplyFixes,
  onClose,
  isApplyingFixes = false
}: CodeQualityReportProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['bug', 'security']));
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set());

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

  const selectAllAutoFixable = () => {
    const autoFixableIndexes = report.issues
      .map((issue, idx) => ({ issue, idx }))
      .filter(({ issue }) => issue.autoFixable)
      .map(({ idx }) => `${idx}`);
    setSelectedIssues(new Set(autoFixableIndexes));
  };

  const handleApplySelected = () => {
    const issuesToFix = report.issues.filter((_, idx) => selectedIssues.has(`${idx}`));
    onApplyFixes?.(issuesToFix);
  };

  const issuesByCategory = groupIssuesByCategory(report.issues);
  const sortedIssues = sortIssuesBySeverity(report.issues);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-6xl w-full my-8">
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🔍</span>
              <span>Code Quality Report</span>
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
            <div className={`px-8 py-4 rounded-xl border ${getGradeColor(report.grade)}`}>
              <div className="text-5xl font-bold text-center">{report.grade}</div>
              <div className="text-sm text-slate-400 text-center mt-1">Grade</div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Overall Score</span>
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
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="px-8 py-6 border-b border-white/10 bg-slate-800/50">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Issues Found</h3>
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

        {/* Content */}
        <div className="px-8 py-6 max-h-[500px] overflow-y-auto">
          {/* Issues by Category */}
          {report.issues.length > 0 ? (
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Issues</h3>
                {report.metrics.autoFixableCount > 0 && (
                  <button
                    onClick={selectAllAutoFixable}
                    className="text-xs px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all"
                  >
                    Select All Auto-fixable ({report.metrics.autoFixableCount})
                  </button>
                )}
              </div>

              {Array.from(issuesByCategory.entries()).map(([category, issues]) => (
                <div key={category} className="bg-slate-800/50 rounded-lg border border-white/10">
                  {/* Category Header */}
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

                  {/* Category Issues */}
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
                              {/* Checkbox for auto-fixable */}
                              {issue.autoFixable && (
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleIssue(globalIdx)}
                                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10"
                                />
                              )}

                              <div className="flex-1">
                                {/* Issue Header */}
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 rounded border ${getSeverityColor(issue.severity)}`}>
                                      {getSeverityLabel(issue.severity)}
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

                                {/* File & Line */}
                                <div className="text-xs text-slate-400 mb-2">
                                  📄 {issue.file}{issue.line ? `:${issue.line}` : ''}
                                </div>

                                {/* Explanation */}
                                <p className="text-sm text-slate-300 mb-2">{issue.explanation}</p>

                                {/* Suggestion */}
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                  <div className="text-xs font-semibold text-blue-300 mb-1">💡 Suggestion:</div>
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
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Perfect Code!</h3>
              <p className="text-slate-400">No issues found. Your code is production-ready.</p>
            </div>
          )}

          {/* Strengths */}
          {report.strengths.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span>✅</span>
                <span>Strengths</span>
              </h3>
              <div className="space-y-2">
                {report.strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-green-300">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {report.recommendations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span>💡</span>
                <span>Recommendations</span>
              </h3>
              <div className="space-y-2">
                {report.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-blue-300">
                    <span className="text-sm">•</span>
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-white/10 bg-slate-800/50 flex items-center justify-between">
          <div className="text-sm text-slate-400">
            {selectedIssues.size > 0 && `${selectedIssues.size} issue(s) selected`}
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
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isApplyingFixes ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Applying...</span>
                  </>
                ) : (
                  <>
                    <Wrench className="w-4 h-4" />
                    <span>Apply Selected Fixes</span>
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
