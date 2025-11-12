import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface CodeFile {
  path: string;
  content: string;
}

interface QualityIssue {
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

interface QualityReport {
  overallScore: number; // 0-100
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
}

/**
 * Code Quality Reviewer Agent
 * Analyzes React/TypeScript apps for bugs, anti-patterns, and quality issues
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

    const prompt = `You are an expert code reviewer specializing in React, TypeScript, and web application best practices. Analyze the following app and provide a comprehensive quality review.

**App Name:** ${appName || 'Unnamed App'}
**Description:** ${appDescription || 'No description provided'}

**Code to Review:**
${codeContext}

**Your Task:**
Analyze this code for:
1. **Bugs** - Logical errors, potential runtime issues, null/undefined errors
2. **Performance Issues** - Unnecessary re-renders, expensive computations without memoization, missing keys
3. **Security Issues** - XSS vulnerabilities, exposed secrets, unsafe operations
4. **Accessibility Issues** - Missing alt text, poor keyboard navigation, ARIA issues
5. **Best Practice Violations** - React anti-patterns, TypeScript issues, code smells
6. **Maintainability Issues** - Code duplication, complex functions, poor naming

**Output Format (JSON):**
\`\`\`json
{
  "overallScore": 85,
  "grade": "B",
  "summary": "Good code quality with some performance concerns",
  "issues": [
    {
      "severity": "high",
      "category": "performance",
      "file": "src/App.tsx",
      "line": 42,
      "issue": "Component re-renders unnecessarily",
      "explanation": "The ProductList component re-renders on every parent state change because it's not memoized and receives inline function props",
      "suggestion": "Wrap ProductList in React.memo and use useCallback for event handlers",
      "autoFixable": true,
      "fix": {
        "type": "replace",
        "oldCode": "export default function ProductList({ products, onSelect }) {",
        "newCode": "export default React.memo(function ProductList({ products, onSelect }) {"
      }
    }
  ],
  "metrics": {
    "totalIssues": 8,
    "critical": 0,
    "high": 2,
    "medium": 4,
    "low": 2,
    "autoFixableCount": 5
  },
  "strengths": [
    "Clean component architecture",
    "Good TypeScript usage",
    "Proper error handling"
  ],
  "recommendations": [
    "Add React.memo to frequently re-rendered components",
    "Consider code splitting for better bundle size",
    "Add error boundaries for better resilience"
  ]
}
\`\`\`

Be thorough but focus on actionable issues. For each issue, provide a clear fix that can be automatically applied if possible.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      temperature: 0.3, // Lower temperature for more consistent analysis
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
      throw new Error('Failed to parse quality report from response');
    }

    const report: QualityReport = JSON.parse(jsonMatch[1]);

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
    console.error('Code review error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze code quality'
      },
      { status: 500 }
    );
  }
}
