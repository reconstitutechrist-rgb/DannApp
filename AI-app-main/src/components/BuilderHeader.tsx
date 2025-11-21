import React from 'react';
import ThemeSelector from './ThemeSelector';
import { ThemeManager } from '../utils/themeSystem';
import { GeneratedComponent, LayoutMode } from '../types/aiBuilderTypes';
import type { QualityReport } from '../utils/codeQuality';
import type { PerformanceReport as PerformanceReportType } from '../utils/performanceOptimization';
import { getGradeColor } from '../utils/codeQuality';
import { getPerformanceGradeColor } from '../utils/performanceOptimization';

interface BuilderHeaderProps {
  layoutMode: LayoutMode;
  onLayoutChange: (mode: LayoutMode) => void;
  themeManager: ThemeManager | null;
  showVersionHistory: boolean;
  setShowVersionHistory: (show: boolean) => void;
  currentComponent: GeneratedComponent | null;
  showLibrary: boolean;
  setShowLibrary: (show: boolean) => void;
  componentsCount: number;
  
  // New plan/act mode
  currentMode: 'PLAN' | 'ACT';
  setCurrentMode: (mode: 'PLAN' | 'ACT') => void;
  
  // Features
  setShowQuickStart: (show: boolean) => void;
  implementationPlan: any; // Typed loosely to avoid circular deps or big imports
  guidedBuildMode: boolean;
  setGuidedBuildMode: (mode: boolean) => void;
  
  // Quality & Performance
  handleRunCodeReview: () => void;
  isRunningReview: boolean;
  qualityReport: QualityReport | null;
  setShowQualityReport: (show: boolean) => void;
  autoReviewEnabled: boolean;
  setAutoReviewEnabled: (enabled: boolean) => void;
  
  handleRunPerformanceAnalysis: () => void;
  isRunningPerformanceAnalysis: boolean;
  performanceReport: PerformanceReportType | null;
  setShowPerformanceReport: (show: boolean) => void;
}

export const BuilderHeader = React.memo(function BuilderHeader({
  layoutMode,
  onLayoutChange,
  themeManager,
  showVersionHistory,
  setShowVersionHistory,
  currentComponent,
  showLibrary,
  setShowLibrary,
  componentsCount,
  currentMode,
  setCurrentMode,
  setShowQuickStart,
  implementationPlan,
  guidedBuildMode,
  setGuidedBuildMode,
  handleRunCodeReview,
  isRunningReview,
  qualityReport,
  setShowQualityReport,
  autoReviewEnabled,
  setAutoReviewEnabled,
  handleRunPerformanceAnalysis,
  isRunningPerformanceAnalysis,
  performanceReport,
  setShowPerformanceReport
}: BuilderHeaderProps) {
  return (
    <header className="border-b border-white/[0.06] bg-neutral-925/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-sm">✨</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-neutral-50 tracking-tight">AI App Builder</h1>
              <p className="text-2xs text-neutral-600">Build apps through conversation</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Plan/Act Mode Toggle - NEW LOCATION */}
            <div className="flex gap-0.5 bg-neutral-900 p-0.5 rounded-md border border-white/[0.06] mr-2">
              <button
                onClick={() => setCurrentMode('PLAN')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                  currentMode === 'PLAN'
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                }`}
                title="Plan Mode: AI discusses and explains (no code changes)"
              >
                <span>💭</span>
                <span className="hidden sm:inline">Plan</span>
              </button>
              <button
                onClick={() => setCurrentMode('ACT')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                  currentMode === 'ACT'
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                }`}
                title="Act Mode: AI can modify code"
              >
                <span>⚡</span>
                <span className="hidden sm:inline">Act</span>
              </button>
            </div>

            {/* App Concept Wizard Button */}
            <button
              onClick={() => setShowQuickStart(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white text-2xs font-medium transition-smooth"
              title="Plan your app with guided wizard"
            >
              <span className="text-xs">🎯</span>
              <span>Plan App</span>
            </button>

            {/* Resume Plan Button */}
            {implementationPlan && !guidedBuildMode && (
              <button
                onClick={() => setGuidedBuildMode(true)}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-accent-success hover:bg-accent-success/90 text-white text-2xs font-medium transition-smooth"
                title="Resume implementation plan"
              >
                <span className="text-xs">▶️</span>
                <span>Resume Plan</span>
              </button>
            )}

            {/* Layout Selector */}
            <div className="hidden md:flex items-center gap-0.5 bg-neutral-900 rounded-md p-0.5 border border-white/[0.06]">
              <button
                onClick={() => onLayoutChange('classic')}
                className={`px-1.5 py-0.5 rounded text-2xs transition-smooth ${
                  layoutMode === 'classic'
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-600 hover:text-neutral-400 hover:bg-white/[0.03]'
                }`}
                title="Classic (50/50 split)"
              >
                ⚖️
              </button>
              <button
                onClick={() => onLayoutChange('preview-first')}
                className={`px-1.5 py-0.5 rounded text-2xs transition-smooth ${
                  layoutMode === 'preview-first'
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-600 hover:text-neutral-400 hover:bg-white/[0.03]'
                }`}
                title="Preview First (70/30 split)"
              >
                🖼️
              </button>
              <button
                onClick={() => onLayoutChange('code-first')}
                className={`px-1.5 py-0.5 rounded text-2xs transition-smooth ${
                  layoutMode === 'code-first'
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-600 hover:text-neutral-400 hover:bg-white/[0.03]'
                }`}
                title="Code First (30/70 split)"
              >
                📝
              </button>
              <button
                onClick={() => onLayoutChange('stacked')}
                className={`px-1.5 py-0.5 rounded text-2xs transition-smooth ${
                  layoutMode === 'stacked'
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-600 hover:text-neutral-400 hover:bg-white/[0.03]'
                }`}
                title="Stacked (vertical)"
              >
                📱
              </button>
            </div>

            {/* Theme Selector */}
            {themeManager && (
              <ThemeSelector
                themeManager={themeManager}
                onThemeChange={(theme) => console.log('Theme changed to:', theme.name)}
                onCustomColorsChange={(colors) => console.log('Custom colors updated:', colors)}
              />
            )}

            {currentComponent && currentComponent.versions && currentComponent.versions.length > 0 && (
              <button
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                className="px-3 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-850 border border-white/[0.06] transition-colors text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5"
              >
                <span>🕒</span>
                <span className="hidden sm:inline">History</span>
                <span className="bg-primary-600/80 text-white text-2xs px-1.5 py-0.5 rounded font-medium">
                  {currentComponent.versions.length}
                </span>
              </button>
            )}

            {/* Code Quality & Performance Buttons */}
            {currentComponent && (
              <>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleRunCodeReview()}
                    disabled={isRunningReview}
                    className="px-3 py-1.5 rounded-md bg-accent-success/90 hover:bg-accent-success disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs text-white flex items-center gap-1.5"
                    title="Analyze code quality"
                  >
                    <span>🔍</span>
                    <span className="hidden md:inline">{isRunningReview ? 'Reviewing...' : 'Review'}</span>
                    {qualityReport && !isRunningReview && (
                      <span className={`text-2xs px-1.5 py-0.5 rounded font-medium ${getGradeColor(qualityReport.grade)}`}>
                        {qualityReport.grade}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setAutoReviewEnabled(!autoReviewEnabled)}
                    className={`px-2 py-1.5 rounded-md border transition-colors text-xs flex items-center gap-1 ${
                      autoReviewEnabled
                        ? 'bg-accent-success/80 border-accent-success/50 text-white'
                        : 'bg-neutral-900 border-white/[0.06] text-neutral-500 hover:bg-neutral-850 hover:text-neutral-300'
                    }`}
                    title={autoReviewEnabled ? 'Auto-review enabled' : 'Enable auto-review'}
                  >
                    <span>{autoReviewEnabled ? '🔄' : '⏸️'}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleRunPerformanceAnalysis()}
                  disabled={isRunningPerformanceAnalysis}
                  className="px-3 py-1.5 rounded-md bg-accent-warning/90 hover:bg-accent-warning disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs text-white flex items-center gap-1.5"
                  title="Analyze app performance"
                >
                  <span>⚡</span>
                  <span className="hidden md:inline">{isRunningPerformanceAnalysis ? 'Analyzing...' : 'Optimize'}</span>
                  {performanceReport && !isRunningPerformanceAnalysis && (
                    <span className={`text-2xs px-1.5 py-0.5 rounded font-medium ${getPerformanceGradeColor(performanceReport.grade)}`}>
                      {performanceReport.grade}
                    </span>
                  )}
                </button>
              </>
            )}

            <button
              onClick={() => setShowLibrary(!showLibrary)}
              className="px-3 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-850 border border-white/[0.06] transition-colors text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5"
            >
              <span>📂</span>
              <span className="hidden sm:inline">My Apps</span>
              {componentsCount > 0 && (
                <span className="bg-primary-600/80 text-white text-2xs px-1.5 py-0.5 rounded font-medium">
                  {componentsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
});
