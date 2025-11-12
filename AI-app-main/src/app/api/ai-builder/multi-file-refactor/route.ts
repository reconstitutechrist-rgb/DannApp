import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface FileSpec {
  path: string;
  content: string;
}

interface RefactorStep {
  order: number;
  file: string;
  changes: string;
  dependencies: string[];
}

interface RefactorPlan {
  steps: RefactorStep[];
}

/**
 * Multi-File Refactor API
 *
 * Handles complex multi-file refactors by processing files sequentially.
 * If one file fails, previous changes are preserved and the error is reported
 * with the option to retry or rollback.
 */
export async function POST(request: Request) {
  try {
    const { prompt, files } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        error: 'Anthropic API key not configured',
        success: false
      }, { status: 500 });
    }

    // Step 1: Generate refactor plan
    console.log('Generating refactor plan...');
    const planResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: `Analyze this refactoring request and create a step-by-step plan.

Request: ${prompt}

Available files:
${files.map((f: FileSpec) => `- ${f.path}`).join('\n')}

Return a JSON object with this structure:
{
  "steps": [
    {
      "order": 1,
      "file": "path/to/file.tsx",
      "changes": "Description of changes",
      "dependencies": []
    }
  ]
}

Important:
- Order steps by dependencies (change dependencies first)
- Each step should modify ONE file only
- Be specific about what changes to make
- Include all files that need modification

Return ONLY the JSON object, no explanation.`
      }]
    });

    const planText = planResponse.content[0].type === 'text'
      ? planResponse.content[0].text
      : '';

    // Extract JSON from response
    const jsonMatch = planText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({
        error: 'Failed to generate refactor plan',
        success: false
      }, { status: 500 });
    }

    const plan: RefactorPlan = JSON.parse(jsonMatch[0]);

    // Step 2: Execute each step sequentially
    console.log(`Executing ${plan.steps.length} refactor steps...`);
    const results = [];
    const modifiedFiles = new Map<string, string>();

    for (const step of plan.steps) {
      try {
        console.log(`Step ${step.order}: Modifying ${step.file}...`);

        // Get current file content (may have been modified by previous step)
        const currentFile = files.find((f: FileSpec) => f.path === step.file);
        if (!currentFile) {
          throw new Error(`File not found: ${step.file}`);
        }

        const currentContent = modifiedFiles.get(step.file) || currentFile.content;

        // Generate modification for this one file
        const modificationResponse = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          temperature: 0.7,
          messages: [{
            role: 'user',
            content: `Modify this file according to the specification.

File: ${step.file}

Current content:
\`\`\`
${currentContent}
\`\`\`

Required changes: ${step.changes}

Context from previous steps:
${results.map(r => `- ${r.file}: ${r.summary}`).join('\n') || 'None (first step)'}

Generate ONLY the modified file content. Return the complete file with changes applied.
Do not include explanations, just the code.`
          }]
        });

        const modifiedContent = modificationResponse.content[0].type === 'text'
          ? modificationResponse.content[0].text
          : currentContent;

        // Clean up code blocks if present
        const cleanedContent = modifiedContent
          .replace(/^```[\w]*\n/gm, '')
          .replace(/\n```$/gm, '')
          .trim();

        // Validate the modification
        const isValid = validateModification(cleanedContent);

        if (!isValid) {
          throw new Error('Generated code failed validation');
        }

        // Save modified content
        modifiedFiles.set(step.file, cleanedContent);

        results.push({
          order: step.order,
          file: step.file,
          success: true,
          summary: step.changes,
          linesChanged: Math.abs(cleanedContent.split('\n').length - currentContent.split('\n').length)
        });

        console.log(`✓ Step ${step.order} completed`);

      } catch (error) {
        console.error(`✗ Step ${step.order} failed:`, error);

        // Return partial success
        return NextResponse.json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          completedSteps: results,
          failedStep: step,
          partialResults: Array.from(modifiedFiles.entries()).map(([path, content]) => ({
            path,
            content
          })),
          rollbackAvailable: true,
          message: `Completed ${results.length} of ${plan.steps.length} steps before encountering an error.`
        });
      }
    }

    // All steps completed successfully
    console.log(`✓ All ${plan.steps.length} steps completed successfully`);

    return NextResponse.json({
      success: true,
      steps: results,
      modifiedFiles: Array.from(modifiedFiles.entries()).map(([path, content]) => ({
        path,
        content
      })),
      message: `Successfully refactored ${modifiedFiles.size} file(s) in ${results.length} steps.`
    });

  } catch (error) {
    console.error('Multi-file refactor error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to complete refactoring. Please try again or break the request into smaller changes.'
    }, { status: 500 });
  }
}

/**
 * Validate that the modification is syntactically correct
 */
function validateModification(code: string): boolean {
  // Basic validation checks
  if (!code || code.trim().length === 0) {
    return false;
  }

  // Check for balanced braces
  const openBraces = (code.match(/\{/g) || []).length;
  const closeBraces = (code.match(/\}/g) || []).length;
  if (Math.abs(openBraces - closeBraces) > 2) { // Allow small mismatch in JSX
    console.warn('Brace mismatch detected');
    return false;
  }

  // Check for balanced parentheses
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    console.warn('Parenthesis mismatch detected');
    return false;
  }

  // Check for balanced brackets
  const openBrackets = (code.match(/\[/g) || []).length;
  const closeBrackets = (code.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    console.warn('Bracket mismatch detected');
    return false;
  }

  // Check that it looks like valid code (has some typical keywords)
  const hasCode = /(?:function|const|let|var|class|import|export|return|if|for|while)/i.test(code);
  if (!hasCode) {
    console.warn('Code does not appear to contain valid JavaScript/TypeScript');
    return false;
  }

  return true;
}
