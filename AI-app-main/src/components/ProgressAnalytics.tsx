'use client';

import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  Target,
  Calendar,
  BarChart3,
  Activity,
  X,
} from 'lucide-react';
import type { ImplementationPlan, BuildPhase } from '../types/appConcept';

interface ProgressAnalyticsProps {
  plan: ImplementationPlan;
  isOpen: boolean;
  onClose: () => void;
}

interface PhaseMetrics {
  phase: BuildPhase;
  estimatedHours: number;
  actualHours?: number;
  variance?: number;
  isBottleneck: boolean;
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  plan,
  isOpen,
  onClose,
}) => {
  // Calculate phase metrics
  const phaseMetrics = useMemo((): PhaseMetrics[] => {
    return plan.phases.map((phase) => {
      const estimatedHours =
        phase.estimatedComplexity === 'simple' ? 4 :
        phase.estimatedComplexity === 'moderate' ? 8 : 16;

      // Simulate actual hours based on status (in real app, track actual time)
      let actualHours: number | undefined;
      if (phase.status === 'completed' && phase.result?.completedAt) {
        // Simulate: add some variance (-20% to +40%)
        const variance = 0.8 + Math.random() * 0.6;
        actualHours = Math.round(estimatedHours * variance);
      } else if (phase.status === 'in-progress') {
        // Simulate partial completion
        actualHours = Math.round(estimatedHours * (0.3 + Math.random() * 0.4));
      }

      const variance = actualHours ? actualHours - estimatedHours : undefined;
      const isBottleneck = variance ? variance > estimatedHours * 0.3 : false;

      return {
        phase,
        estimatedHours,
        actualHours,
        variance,
        isBottleneck,
      };
    });
  }, [plan.phases]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalPhases = plan.phases.length;
    const completedPhases = plan.phases.filter(p => p.status === 'completed').length;
    const inProgressPhases = plan.phases.filter(p => p.status === 'in-progress').length;
    const remainingPhases = totalPhases - completedPhases - inProgressPhases;

    const totalEstimated = phaseMetrics.reduce((sum, m) => sum + m.estimatedHours, 0);
    const completedHours = phaseMetrics
      .filter(m => m.phase.status === 'completed')
      .reduce((sum, m) => sum + (m.actualHours || m.estimatedHours), 0);
    const remainingHours = totalEstimated - completedHours;

    const bottlenecks = phaseMetrics.filter(m => m.isBottleneck);

    // Calculate velocity (hours per completed phase)
    const velocity = completedPhases > 0 ? completedHours / completedPhases : 0;

    // Estimate completion date
    const avgHoursPerDay = 6; // Assume 6 productive hours per day
    const daysRemaining = remainingHours / avgHoursPerDay;
    const estimatedCompletion = new Date();
    estimatedCompletion.setDate(estimatedCompletion.getDate() + Math.ceil(daysRemaining));

    // Calculate trend (are we getting faster or slower?)
    const recentPhases = phaseMetrics.filter(m => m.phase.status === 'completed').slice(-3);
    const earlyPhases = phaseMetrics.filter(m => m.phase.status === 'completed').slice(0, 3);

    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (recentPhases.length >= 2 && earlyPhases.length >= 2) {
      const recentAvg = recentPhases.reduce((sum, m) => sum + (m.actualHours || 0), 0) / recentPhases.length;
      const earlyAvg = earlyPhases.reduce((sum, m) => sum + (m.actualHours || 0), 0) / earlyPhases.length;

      if (recentAvg < earlyAvg * 0.9) trend = 'improving';
      else if (recentAvg > earlyAvg * 1.1) trend = 'declining';
    }

    return {
      totalPhases,
      completedPhases,
      inProgressPhases,
      remainingPhases,
      totalEstimated,
      completedHours,
      remainingHours,
      velocity,
      estimatedCompletion,
      bottlenecks,
      trend,
      percentComplete: totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0,
    };
  }, [phaseMetrics, plan.phases]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/20">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Progress Analytics</h2>
              <p className="text-sm text-slate-400">
                Insights and metrics for {plan.concept.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-all text-slate-400"
            aria-label="Close analytics"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Completion Rate */}
            <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-xs font-semibold text-green-400">Completion Rate</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.percentComplete}%
              </div>
              <p className="text-xs text-green-300/70">
                {stats.completedPhases} of {stats.totalPhases} phases done
              </p>
            </div>

            {/* Velocity */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-blue-400">Velocity</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.velocity.toFixed(1)}h
              </div>
              <p className="text-xs text-blue-300/70">per completed phase</p>
            </div>

            {/* Time Remaining */}
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-purple-400">Time Remaining</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.remainingHours}h
              </div>
              <p className="text-xs text-purple-300/70">
                ~{Math.ceil(stats.remainingHours / 6)} work days left
              </p>
            </div>

            {/* Trend */}
            <div className={`bg-gradient-to-br rounded-xl p-4 border ${
              stats.trend === 'improving'
                ? 'from-cyan-600/20 to-cyan-600/5 border-cyan-500/30'
                : stats.trend === 'declining'
                ? 'from-amber-600/20 to-amber-600/5 border-amber-500/30'
                : 'from-slate-600/20 to-slate-600/5 border-slate-500/30'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {stats.trend === 'improving' ? (
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                ) : stats.trend === 'declining' ? (
                  <TrendingDown className="w-4 h-4 text-amber-400" />
                ) : (
                  <Activity className="w-4 h-4 text-slate-400" />
                )}
                <span className={`text-xs font-semibold ${
                  stats.trend === 'improving' ? 'text-cyan-400' :
                  stats.trend === 'declining' ? 'text-amber-400' : 'text-slate-400'
                }`}>
                  Trend
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-1 capitalize">
                {stats.trend}
              </div>
              <p className={`text-xs ${
                stats.trend === 'improving' ? 'text-cyan-300/70' :
                stats.trend === 'declining' ? 'text-amber-300/70' : 'text-slate-300/70'
              }`}>
                {stats.trend === 'improving' && 'Getting faster over time'}
                {stats.trend === 'declining' && 'Slowing down recently'}
                {stats.trend === 'stable' && 'Consistent pace'}
              </p>
            </div>
          </div>

          {/* Estimated Completion */}
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Estimated Completion</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {stats.estimatedCompletion.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <p className="text-sm text-slate-300">
              Based on current velocity of {stats.velocity.toFixed(1)}h per phase and{' '}
              {stats.remainingHours}h remaining
            </p>
          </div>

          {/* Phase Progress Chart */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Phase Progress Overview
            </h3>
            <div className="space-y-3">
              {phaseMetrics.map((metric, index) => {
                const progressPercent =
                  metric.phase.status === 'completed' ? 100 :
                  metric.phase.status === 'in-progress' ? 50 : 0;

                const isOverBudget = metric.variance && metric.variance > 0;
                const isUnderBudget = metric.variance && metric.variance < 0;

                return (
                  <div key={metric.phase.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Phase {metric.phase.phaseNumber}</span>
                        <span className="text-white font-medium">{metric.phase.name}</span>
                        {metric.isBottleneck && (
                          <span className="px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 text-xs border border-red-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Bottleneck
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-slate-400">
                          {metric.actualHours || 0}h / {metric.estimatedHours}h
                        </span>
                        {metric.variance !== undefined && (
                          <span className={`font-medium ${
                            isOverBudget ? 'text-red-400' :
                            isUnderBudget ? 'text-green-400' : 'text-slate-400'
                          }`}>
                            {metric.variance > 0 ? '+' : ''}{metric.variance}h
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
                      {/* Estimated bar background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-700/50 to-slate-600/50" />

                      {/* Actual progress bar */}
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                          metric.phase.status === 'completed'
                            ? isOverBudget
                              ? 'bg-gradient-to-r from-red-600 to-red-500'
                              : 'bg-gradient-to-r from-green-600 to-green-500'
                            : metric.phase.status === 'in-progress'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500'
                            : 'bg-slate-700'
                        }`}
                        style={{
                          width: `${progressPercent}%`,
                        }}
                      />

                      {/* Variance indicator */}
                      {metric.actualHours && metric.variance && (
                        <div
                          className="absolute inset-y-0 w-1 bg-white/50"
                          style={{
                            left: `${(metric.estimatedHours / (metric.actualHours + metric.estimatedHours)) * 100}%`,
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottlenecks */}
          {stats.bottlenecks.length > 0 && (
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-semibold text-white">Identified Bottlenecks</h3>
              </div>
              <div className="space-y-3">
                {stats.bottlenecks.map((metric) => (
                  <div
                    key={metric.phase.id}
                    className="bg-red-600/10 border border-red-500/20 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-white mb-1">
                          Phase {metric.phase.phaseNumber}: {metric.phase.name}
                        </h4>
                        <p className="text-sm text-slate-300">{metric.phase.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-400">
                          +{metric.variance}h
                        </div>
                        <div className="text-xs text-red-300/70">over estimate</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-red-500/20">
                      <p className="text-xs text-red-200/80">
                        <strong>Impact:</strong> This phase took{' '}
                        {metric.actualHours && metric.estimatedHours
                          ? Math.round((metric.actualHours / metric.estimatedHours - 1) * 100)
                          : 0}
                        % longer than estimated. Consider breaking similar phases into smaller tasks
                        or allocating more time for complex features.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="mt-8 bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Key Insights
            </h3>
            <div className="space-y-3">
              {stats.percentComplete >= 75 && (
                <div className="flex items-start gap-3 p-3 bg-green-600/10 border border-green-500/30 rounded-lg">
                  <div className="p-1 bg-green-600/20 rounded">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-green-200 font-medium mb-1">Great Progress!</p>
                    <p className="text-xs text-green-300/80">
                      You're {stats.percentComplete}% complete. Keep up the momentum to finish strong!
                    </p>
                  </div>
                </div>
              )}

              {stats.trend === 'improving' && (
                <div className="flex items-start gap-3 p-3 bg-cyan-600/10 border border-cyan-500/30 rounded-lg">
                  <div className="p-1 bg-cyan-600/20 rounded">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-cyan-200 font-medium mb-1">Velocity Improving</p>
                    <p className="text-xs text-cyan-300/80">
                      Your completion speed has increased recently. You're building momentum!
                    </p>
                  </div>
                </div>
              )}

              {stats.trend === 'declining' && (
                <div className="flex items-start gap-3 p-3 bg-amber-600/10 border border-amber-500/30 rounded-lg">
                  <div className="p-1 bg-amber-600/20 rounded">
                    <TrendingDown className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-amber-200 font-medium mb-1">Pace Slowing Down</p>
                    <p className="text-xs text-amber-300/80">
                      Recent phases are taking longer. Consider reviewing task complexity or taking
                      breaks to maintain productivity.
                    </p>
                  </div>
                </div>
              )}

              {stats.bottlenecks.length === 0 && stats.completedPhases > 2 && (
                <div className="flex items-start gap-3 p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                  <div className="p-1 bg-blue-600/20 rounded">
                    <Target className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-blue-200 font-medium mb-1">Smooth Sailing</p>
                    <p className="text-xs text-blue-300/80">
                      No bottlenecks detected! All phases are completing within expected timeframes.
                    </p>
                  </div>
                </div>
              )}

              {stats.remainingPhases <= 3 && stats.remainingPhases > 0 && (
                <div className="flex items-start gap-3 p-3 bg-purple-600/10 border border-purple-500/30 rounded-lg">
                  <div className="p-1 bg-purple-600/20 rounded">
                    <Calendar className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-purple-200 font-medium mb-1">Final Sprint!</p>
                    <p className="text-xs text-purple-300/80">
                      Only {stats.remainingPhases} phase{stats.remainingPhases !== 1 ? 's' : ''} left.
                      You're almost there!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-white/10 bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressAnalytics;
