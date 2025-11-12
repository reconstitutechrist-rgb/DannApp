/**
 * Code Quality Utilities
 * Helper functions for code review, quality scoring, and auto-fixes
 */

export interface QualityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'bug' | 'performance' | 'security' | 'accessibility' | 'best-practice' | 'maintainability';
  file: string;
  line?: number;
  issue: string;
  explanation: string;
  suggestion: string;
  autoFixable: boolean;
  fix?: {
    type: 'replace' | 'insert' | 'delete';
    oldCode?: string;
    newCode?: string;
    location?: string;
  };
}

export interface QualityReport {
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  summary: string;
  issues: QualityIssue[];
  metrics: {
    totalIssues: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    autoFixableCount: number;
  };
  strengths: string[];
  recommendations: string[];
  delta?: {
    scoreChange: number;
    gradeChange: string;
    issuesAdded: number;
    issuesFixed: number;
    newIssues: QualityIssue[];
    fixedIssues: string[];
  };
  isIncremental?: boolean;
  modifiedFiles?: string[];
}

/**
 * Detect which files have been modified between two versions
 */
export function detectModifiedFiles(
  oldFiles: Array<{ path: string; content: string }>,
  newFiles: Array<{ path: string; content: string }>
): string[] {
  const modifiedPaths: string[] = [];

  // Create maps for quick lookup
  const oldFileMap = new Map(oldFiles.map(f => [f.path, f.content]));
  const newFileMap = new Map(newFiles.map(f => [f.path, f.content]));

  // Check for modified or new files
  for (const [path, newContent] of newFileMap) {
    const oldContent = oldFileMap.get(path);
    if (!oldContent || oldContent !== newContent) {
      modifiedPaths.push(path);
    }
  }

  // Note: We don't include deleted files in the review
  // as there's nothing to review

  return modifiedPaths;
}

/**
 * Get color for severity level
 */
export function getSeverityColor(severity: QualityIssue['severity']): string {
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
export function getCategoryIcon(category: QualityIssue['category']): string {
  switch (category) {
    case 'bug':
      return '🐛';
    case 'performance':
      return '⚡';
    case 'security':
      return '🔒';
    case 'accessibility':
      return '♿';
    case 'best-practice':
      return '✨';
    case 'maintainability':
      return '🔧';
  }
}

/**
 * Get grade color
 */
export function getGradeColor(grade: QualityReport['grade']): string {
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
 * Apply auto-fix to file content
 */
export function applyAutoFix(
  fileContent: string,
  fix: NonNullable<QualityIssue['fix']>
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
      // Simple insert at location (could be improved with AST)
      return fileContent.replace(fix.location, fix.location + '\n' + fix.newCode);

    case 'delete':
      if (!fix.oldCode) {
        throw new Error('Delete fix requires oldCode');
      }
      return fileContent.replace(fix.oldCode, '');

    default:
      throw new Error(`Unknown fix type: ${(fix as any).type}`);
  }
}

/**
 * Apply all auto-fixes to app files
 */
export function applyAllAutoFixes(
  files: Array<{ path: string; content: string }>,
  issues: QualityIssue[]
): Array<{ path: string; content: string }> {
  const fixableIssues = issues.filter(issue => issue.autoFixable && issue.fix);

  // Group fixes by file
  const fixesByFile = new Map<string, QualityIssue[]>();
  for (const issue of fixableIssues) {
    const existing = fixesByFile.get(issue.file) || [];
    existing.push(issue);
    fixesByFile.set(issue.file, existing);
  }

  // Apply fixes to each file
  return files.map(file => {
    const fileFixes = fixesByFile.get(file.path);
    if (!fileFixes || fileFixes.length === 0) {
      return file; // No fixes for this file
    }

    let updatedContent = file.content;
    for (const issue of fileFixes) {
      if (issue.fix) {
        try {
          updatedContent = applyAutoFix(updatedContent, issue.fix);
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
 * Calculate quality metrics from issues
 */
export function calculateMetrics(issues: QualityIssue[]): QualityReport['metrics'] {
  return {
    totalIssues: issues.length,
    critical: issues.filter(i => i.severity === 'critical').length,
    high: issues.filter(i => i.severity === 'high').length,
    medium: issues.filter(i => i.severity === 'medium').length,
    low: issues.filter(i => i.severity === 'low').length,
    autoFixableCount: issues.filter(i => i.autoFixable).length
  };
}

/**
 * Group issues by category for display
 */
export function groupIssuesByCategory(issues: QualityIssue[]): Map<QualityIssue['category'], QualityIssue[]> {
  const groups = new Map<QualityIssue['category'], QualityIssue[]>();

  for (const issue of issues) {
    const existing = groups.get(issue.category) || [];
    existing.push(issue);
    groups.set(issue.category, existing);
  }

  return groups;
}

/**
 * Sort issues by severity (critical first)
 */
export function sortIssuesBySeverity(issues: QualityIssue[]): QualityIssue[] {
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...issues].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

/**
 * Get human-readable severity label
 */
export function getSeverityLabel(severity: QualityIssue['severity']): string {
  switch (severity) {
    case 'critical':
      return 'Critical';
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
  }
}

/**
 * Get human-readable category label
 */
export function getCategoryLabel(category: QualityIssue['category']): string {
  switch (category) {
    case 'bug':
      return 'Bug';
    case 'performance':
      return 'Performance';
    case 'security':
      return 'Security';
    case 'accessibility':
      return 'Accessibility';
    case 'best-practice':
      return 'Best Practice';
    case 'maintainability':
      return 'Maintainability';
  }
}
