/**
 * Performance Optimization Utilities
 * Helper functions for performance analysis and optimization
 */

export interface PerformanceIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'render' | 'computation' | 'bundle' | 'memory' | 'network';
  file: string;
  line?: number;
  issue: string;
  impact: string;
  explanation: string;
  suggestion: string;
  autoFixable: boolean;
  estimatedImprovement: string;
  fix?: {
    type: 'replace' | 'insert' | 'wrap';
    oldCode?: string;
    newCode?: string;
    location?: string;
  };
}

export interface PerformanceReport {
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  summary: string;
  issues: PerformanceIssue[];
  metrics: {
    totalIssues: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    autoFixableCount: number;
    estimatedSpeedupPotential: string;
  };
  strengths: string[];
  recommendations: string[];
  quickWins: PerformanceIssue[];
}

/**
 * Get color for severity level
 */
export function getSeverityColor(severity: PerformanceIssue['severity']): string {
  switch (severity) {
    case 'critical':
      return 'text-red-500 bg-red-500/10 border-red-500/30';
    case 'high':
      return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
    case 'medium':
      return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    case 'low':
      return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
  }
}

/**
 * Get icon for category
 */
export function getCategoryIcon(category: PerformanceIssue['category']): string {
  switch (category) {
    case 'render':
      return '🔄';
    case 'computation':
      return '⚡';
    case 'bundle':
      return '📦';
    case 'memory':
      return '💾';
    case 'network':
      return '🌐';
  }
}

/**
 * Get category label
 */
export function getCategoryLabel(category: PerformanceIssue['category']): string {
  switch (category) {
    case 'render':
      return 'Render Performance';
    case 'computation':
      return 'Computation';
    case 'bundle':
      return 'Bundle Size';
    case 'memory':
      return 'Memory';
    case 'network':
      return 'Network';
  }
}

/**
 * Apply performance fix to file content
 */
export function applyPerformanceFix(
  fileContent: string,
  fix: NonNullable<PerformanceIssue['fix']>
): string {
  switch (fix.type) {
    case 'replace':
      if (!fix.oldCode || !fix.newCode) {
        throw new Error('Replace fix requires oldCode and newCode');
      }
      return fileContent.replace(fix.oldCode, fix.newCode);

    case 'insert':
      if (!fix.newCode || !fix.location) {
        throw new Error('Insert fix requires newCode and location');
      }
      return fileContent.replace(fix.location, fix.location + '\n' + fix.newCode);

    case 'wrap':
      if (!fix.oldCode || !fix.newCode) {
        throw new Error('Wrap fix requires oldCode and newCode');
      }
      // For wrapping (e.g., React.memo), replace the function declaration
      return fileContent.replace(fix.oldCode, fix.newCode);

    default:
      throw new Error(`Unknown fix type: ${(fix as any).type}`);
  }
}

/**
 * Apply all performance fixes to app files
 */
export function applyAllPerformanceFixes(
  files: Array<{ path: string; content: string }>,
  issues: PerformanceIssue[]
): Array<{ path: string; content: string }> {
  const fixableIssues = issues.filter(issue => issue.autoFixable && issue.fix);

  // Group fixes by file
  const fixesByFile = new Map<string, PerformanceIssue[]>();
  for (const issue of fixableIssues) {
    const existing = fixesByFile.get(issue.file) || [];
    existing.push(issue);
    fixesByFile.set(issue.file, existing);
  }

  // Apply fixes to each file
  return files.map(file => {
    const fileFixes = fixesByFile.get(file.path);
    if (!fileFixes || fileFixes.length === 0) {
      return file;
    }

    let updatedContent = file.content;
    for (const issue of fileFixes) {
      if (issue.fix) {
        try {
          updatedContent = applyPerformanceFix(updatedContent, issue.fix);
        } catch (error) {
          console.error(`Failed to apply fix for ${issue.issue}:`, error);
        }
      }
    }

    return {
      path: file.path,
      content: updatedContent
    };
  });
}

/**
 * Group issues by category
 */
export function groupIssuesByCategory(issues: PerformanceIssue[]): Map<PerformanceIssue['category'], PerformanceIssue[]> {
  const groups = new Map<PerformanceIssue['category'], PerformanceIssue[]>();

  for (const issue of issues) {
    const existing = groups.get(issue.category) || [];
    existing.push(issue);
    groups.set(issue.category, existing);
  }

  return groups;
}

/**
 * Sort issues by severity and impact
 */
export function sortIssuesByImpact(issues: PerformanceIssue[]): PerformanceIssue[] {
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...issues].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

/**
 * Get performance grade color
 */
export function getPerformanceGradeColor(grade: PerformanceReport['grade']): string {
  switch (grade) {
    case 'A':
      return 'text-green-500 bg-green-500/10';
    case 'B':
      return 'text-blue-500 bg-blue-500/10';
    case 'C':
      return 'text-yellow-500 bg-yellow-500/10';
    case 'D':
      return 'text-orange-500 bg-orange-500/10';
    case 'F':
      return 'text-red-500 bg-red-500/10';
  }
}

/**
 * Calculate estimated time saved from fixes
 */
export function calculateTimeSaved(issues: PerformanceIssue[]): string {
  const fixableIssues = issues.filter(i => i.autoFixable);
  const highImpactCount = fixableIssues.filter(i => i.severity === 'high' || i.severity === 'critical').length;

  if (highImpactCount >= 3) {
    return '3-5x faster';
  } else if (highImpactCount >= 1) {
    return '2-3x faster';
  } else if (fixableIssues.length >= 3) {
    return '30-50% faster';
  } else {
    return '10-20% faster';
  }
}
