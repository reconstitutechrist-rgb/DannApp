/**
 * Component Extractor - Auto-detects large files and suggests component extraction
 *
 * Features:
 * - Detects files > 300 lines
 * - Analyzes JSX blocks for extraction candidates
 * - Generates extraction suggestions with props
 * - Creates new component files
 *
 * @version 1.0.1
 */

// Pre-compiled regex patterns for better performance (compiled once at module load)
const JSX_BLOCK_PATTERNS = [
  // Large div blocks
  {
    pattern: /<div className="[^"]*"[^>]*>[\s\S]{200,}?<\/div>/g,
    name: 'Section',
    reason: 'Large div block detected'
  },
  // Form elements
  {
    pattern: /<form[\s\S]{100,}?<\/form>/g,
    name: 'Form',
    reason: 'Form element detected'
  },
  // Modal/Dialog patterns
  {
    pattern: /<div[^>]*modal[^>]*>[\s\S]{100,}?<\/div>/gi,
    name: 'Modal',
    reason: 'Modal component detected'
  },
  // Card patterns
  {
    pattern: /<div[^>]*card[^>]*>[\s\S]{100,}?<\/div>/gi,
    name: 'Card',
    reason: 'Card component detected'
  },
  // Header patterns
  {
    pattern: /<header[\s\S]{100,}?<\/header>/g,
    name: 'Header',
    reason: 'Header component detected'
  },
  // Footer patterns
  {
    pattern: /<footer[\s\S]{100,}?<\/footer>/g,
    name: 'Footer',
    reason: 'Footer component detected'
  },
  // List rendering with map
  {
    pattern: /\{[\s\S]*?\.map\([^)]+\)\s*=>[\s\S]{50,}?\)/g,
    name: 'Item',
    reason: 'Repeated list rendering detected'
  }
] as const;

export interface ExtractionSuggestion {
  reason: string;
  targetJSX: string;
  suggestedComponentName: string;
  estimatedProps: string[];
  lineCount: number;
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface FileAnalysis {
  filePath: string;
  totalLines: number;
  needsExtraction: boolean;
  suggestions: ExtractionSuggestion[];
  complexityScore: number;
}

/**
 * Analyze a file and detect if it needs component extraction
 */
export function analyzeFile(filePath: string, code: string): FileAnalysis {
  const lines = code.split('\n');
  const totalLines = lines.length;

  const analysis: FileAnalysis = {
    filePath,
    totalLines,
    needsExtraction: totalLines > 300,
    suggestions: [],
    complexityScore: calculateComplexity(code, totalLines)
  };

  // If file is too large, analyze for extraction candidates
  if (analysis.needsExtraction) {
    analysis.suggestions = findExtractionCandidates(code, filePath);
  }

  return analysis;
}

/**
 * Calculate complexity score based on multiple factors
 */
function calculateComplexity(code: string, lineCount: number): number {
  let score = 0;

  // Line count (0-40 points)
  score += Math.min(lineCount / 10, 40);

  // Number of useState calls (0-20 points)
  const useStateCount = (code.match(/useState/g) || []).length;
  score += Math.min(useStateCount * 2, 20);

  // Number of useEffect calls (0-20 points)
  const useEffectCount = (code.match(/useEffect/g) || []).length;
  score += Math.min(useEffectCount * 3, 20);

  // Number of functions (0-20 points)
  const functionCount = (code.match(/const \w+ = \(|function \w+\(/g) || []).length;
  score += Math.min(functionCount, 20);

  return Math.min(score, 100);
}

/**
 * Find candidates for component extraction
 * Uses pre-compiled regex patterns for better performance
 */
function findExtractionCandidates(code: string, filePath: string): ExtractionSuggestion[] {
  const suggestions: ExtractionSuggestion[] = [];

  for (const { pattern, name, reason } of JSX_BLOCK_PATTERNS) {
    // String.match() with global regex always starts from beginning, no reset needed
    const matches = code.match(pattern);

    if (matches) {
      for (let i = 0; i < Math.min(matches.length, 3); i++) {
        const match = matches[i];
        const lineCount = match.split('\n').length;

        // Estimate props based on variables used in the JSX
        const estimatedProps = extractPotentialProps(match);

        const componentName = generateComponentName(filePath, name, i);

        suggestions.push({
          reason,
          targetJSX: match,
          suggestedComponentName: componentName,
          estimatedProps,
          lineCount,
          complexity: lineCount > 50 ? 'HIGH' : lineCount > 25 ? 'MEDIUM' : 'LOW'
        });
      }
    }
  }

  return suggestions;
}

/**
 * Extract potential props from JSX code
 */
function extractPotentialProps(jsx: string): string[] {
  const props: Set<string> = new Set();

  // Find variables in curly braces
  const variablePattern = /\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}/g;
  let match;

  while ((match = variablePattern.exec(jsx)) !== null) {
    const varName = match[1];
    // Filter out common React/JS keywords
    if (!['true', 'false', 'null', 'undefined', 'this', 'props', 'children'].includes(varName)) {
      props.add(varName);
    }
  }

  return Array.from(props);
}

/**
 * Generate a component name based on context
 */
function generateComponentName(filePath: string, baseName: string, index: number): string {
  // Extract parent component name from file path
  const fileName = filePath.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '') || 'Component';
  const parentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

  const suffix = index > 0 ? index + 1 : '';
  return `${parentName}${baseName}${suffix}`;
}

/**
 * Generate extraction recommendation message
 */
export function generateExtractionMessage(analysis: FileAnalysis): string {
  if (!analysis.needsExtraction || analysis.suggestions.length === 0) {
    return '';
  }

  let message = `🔍 **Large File Detected** (${analysis.totalLines} lines)\n\n`;
  message += `**Complexity Score:** ${analysis.complexityScore.toFixed(0)}/100\n\n`;
  message += `**Recommended Extractions:**\n\n`;

  for (let i = 0; i < Math.min(analysis.suggestions.length, 3); i++) {
    const suggestion = analysis.suggestions[i];
    message += `${i + 1}. **${suggestion.suggestedComponentName}** (${suggestion.lineCount} lines)\n`;
    message += `   - ${suggestion.reason}\n`;
    message += `   - Complexity: ${suggestion.complexity}\n`;
    if (suggestion.estimatedProps.length > 0) {
      message += `   - Props: ${suggestion.estimatedProps.slice(0, 5).join(', ')}${suggestion.estimatedProps.length > 5 ? '...' : ''}\n`;
    }
    message += `\n`;
  }

  message += `**Benefits of Extraction:**\n`;
  message += `- ✅ Improved code organization\n`;
  message += `- ✅ Better reusability\n`;
  message += `- ✅ Easier testing\n`;
  message += `- ✅ Reduced file complexity\n\n`;

  message += `Would you like me to extract any of these components?`;

  return message;
}

/**
 * Batch analyze multiple files
 */
export function analyzeMultipleFiles(files: Array<{ path: string; content: string }>): FileAnalysis[] {
  return files
    .map(file => analyzeFile(file.path, file.content))
    .filter(analysis => analysis.needsExtraction)
    .sort((a, b) => b.complexityScore - a.complexityScore); // Sort by complexity, highest first
}

/**
 * Check if extraction should be suggested for a modification
 */
export function shouldSuggestExtraction(
  filePath: string,
  originalCode: string,
  modifiedCode: string
): boolean {
  const originalAnalysis = analyzeFile(filePath, originalCode);
  const modifiedAnalysis = analyzeFile(filePath, modifiedCode);

  // Suggest if:
  // 1. Modified code crosses the 300-line threshold
  // 2. Or complexity increased significantly (>20 points)
  return (
    (!originalAnalysis.needsExtraction && modifiedAnalysis.needsExtraction) ||
    (modifiedAnalysis.complexityScore - originalAnalysis.complexityScore > 20)
  );
}
