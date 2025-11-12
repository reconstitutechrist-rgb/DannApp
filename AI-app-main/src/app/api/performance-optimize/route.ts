import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface CodeFile {
  path: string;
  content: string;
}

interface PerformanceIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'render' | 'computation' | 'bundle' | 'memory' | 'network';
  file: string;
  line?: number;
  issue: string;
  impact: string; // How much this affects performance
  explanation: string;
  suggestion: string;
  autoFixable: boolean;
  estimatedImprovement: string; // "2x faster", "50% smaller bundle", etc.
  fix?: {
    type: 'replace' | 'insert' | 'wrap';
    oldCode?: string;
    newCode?: string;
    location?: string;
  };
}

interface PerformanceReport {
  overallScore: number; // 0-100
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
    estimatedSpeedupPotential: string; // "3-5x faster"
  };
  strengths: string[];
  recommendations: string[];
  quickWins: PerformanceIssue[]; // Top 3-5 issues with biggest impact
}

/**
 * Performance Optimizer Agent
 * Analyzes React apps for performance bottlenecks and provides optimizations
 */
export async function POST(request: NextRequest) {
  try {
    const { files, appName, appDescription } = await request.json();

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({
        error: 'Missing required parameter: files array'
      }, { status: 400 });
    }

    // Prepare code context for analysis
    const codeContext = files.map((f: CodeFile) =>
      `File: ${f.path}\n\`\`\`typescript\n${f.content}\n\`\`\``
    ).join('\n\n');

    const prompt = `You are an expert React performance engineer. Analyze the following app for performance issues and provide actionable optimizations.

**App Name:** ${appName || 'Unnamed App'}
**Description:** ${appDescription || 'No description provided'}

**Code to Analyze:**
${codeContext}

**Your Task:**
Identify performance issues in these categories:

1. **Render Performance** - Unnecessary re-renders, missing memoization, inline functions
2. **Computation Performance** - Expensive operations in render, missing useMemo
3. **Bundle Size** - Large dependencies, unused imports, code splitting opportunities
4. **Memory Issues** - Memory leaks, large data structures, inefficient data handling
5. **Network Issues** - Inefficient data fetching, missing caching

**Focus on:**
- React component re-renders (most common issue)
- Missing React.memo, useCallback, useMemo
- Inline function props causing parent re-renders
- Missing key props in lists
- Expensive computations in render methods
- Large bundle sizes from imports

**Output Format (JSON):**
\`\`\`json
{
  "overallScore": 75,
  "grade": "B",
  "summary": "Decent performance with room for improvement. Main issue: unnecessary re-renders",
  "issues": [
    {
      "severity": "high",
      "category": "render",
      "file": "src/components/ProductList.tsx",
      "line": 15,
      "issue": "Component re-renders on every parent state change",
      "impact": "Causes 10+ child components to re-render unnecessarily",
      "explanation": "ProductList receives inline function props and isn't memoized, causing it to re-render whenever the parent component updates, even when its props haven't changed",
      "suggestion": "Wrap component in React.memo and use useCallback for event handlers",
      "autoFixable": true,
      "estimatedImprovement": "3-5x faster UI updates",
      "fix": {
        "type": "wrap",
        "oldCode": "export default function ProductList({ products, onSelect }) {",
        "newCode": "export default React.memo(function ProductList({ products, onSelect }) {"
      }
    },
    {
      "severity": "high",
      "category": "computation",
      "file": "src/App.tsx",
      "line": 42,
      "issue": "Expensive filtering happens on every render",
      "impact": "Filters 1000+ items on every render, slowing down UI",
      "explanation": "The filtered products array is computed on every render without memoization, even when products array hasn't changed",
      "suggestion": "Wrap filtering logic in useMemo with dependencies",
      "autoFixable": true,
      "estimatedImprovement": "50-70% faster renders",
      "fix": {
        "type": "replace",
        "oldCode": "const filteredProducts = products.filter(p => p.price < maxPrice);",
        "newCode": "const filteredProducts = useMemo(() => products.filter(p => p.price < maxPrice), [products, maxPrice]);"
      }
    }
  ],
  "metrics": {
    "totalIssues": 7,
    "critical": 0,
    "high": 3,
    "medium": 3,
    "low": 1,
    "autoFixableCount": 6,
    "estimatedSpeedupPotential": "3-5x faster"
  },
  "strengths": [
    "Good component structure with separation of concerns",
    "Proper use of React hooks",
    "No memory leaks detected"
  ],
  "recommendations": [
    "Add React.memo to frequently updated components",
    "Use useCallback for all event handlers passed as props",
    "Consider virtualization for long lists (react-window)",
    "Implement code splitting for large routes"
  ],
  "quickWins": [
    {
      "severity": "high",
      "category": "render",
      "file": "src/components/ProductList.tsx",
      "line": 15,
      "issue": "Component re-renders on every parent state change",
      "impact": "Causes 10+ child components to re-render unnecessarily",
      "explanation": "ProductList receives inline function props and isn't memoized",
      "suggestion": "Wrap component in React.memo",
      "autoFixable": true,
      "estimatedImprovement": "3-5x faster UI updates",
      "fix": {
        "type": "wrap",
        "oldCode": "export default function ProductList({ products, onSelect }) {",
        "newCode": "export default React.memo(function ProductList({ products, onSelect }) {"
      }
    }
  ]
}
\`\`\`

**Important:**
- Prioritize issues by impact (how much they actually slow down the app)
- Include estimated performance improvements
- Focus on React-specific optimizations (memo, useCallback, useMemo)
- Provide "quick wins" - top 3-5 issues with biggest impact
- All fixes must be accurate and actually work`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const textContent = response.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from API');
    }

    // Extract JSON from response
    const jsonMatch = textContent.text.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      throw new Error('Failed to parse performance report from response');
    }

    const report: PerformanceReport = JSON.parse(jsonMatch[1]);

    // Ensure report has all required fields
    if (!report.overallScore || !report.grade || !report.issues) {
      throw new Error('Invalid report format from API');
    }

    return NextResponse.json({
      success: true,
      report,
      analyzedFiles: files.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Performance optimization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze performance'
      },
      { status: 500 }
    );
  }
}
