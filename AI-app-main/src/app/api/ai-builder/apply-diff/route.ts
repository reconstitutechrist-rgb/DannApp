import { NextRequest, NextResponse } from 'next/server';
import { applyDiff } from '@/utils/applyDiff';
import { analyzeMultipleFiles, generateExtractionMessage, type FileAnalysis } from '@/utils/componentExtractor';

export async function POST(request: NextRequest) {
  try {
    const { currentFiles, diffs } = await request.json();

    if (!currentFiles || !diffs) {
      return NextResponse.json({
        error: 'Missing required parameters: currentFiles and diffs'
      }, { status: 400 });
    }

    // Apply diffs server-side (where tree-sitter can run)
    const result = await applyDiff(currentFiles, diffs);

    // Analyze modified files for extraction opportunities
    const filesToAnalyze = result.modifiedFiles.map(file => ({
      path: file.path,
      content: file.content
    }));

    const analyses = analyzeMultipleFiles(filesToAnalyze);

    // Generate extraction suggestions if any files need it
    const extractionSuggestions: Array<{filePath: string; message: string; analysis: FileAnalysis}> = [];

    for (const analysis of analyses) {
      if (analysis.needsExtraction && analysis.suggestions.length > 0) {
        extractionSuggestions.push({
          filePath: analysis.filePath,
          message: generateExtractionMessage(analysis),
          analysis
        });
      }
    }

    // Add extraction suggestions to result
    return NextResponse.json({
      ...result,
      extractionSuggestions: extractionSuggestions.length > 0 ? extractionSuggestions : undefined
    });
    
  } catch (error) {
    console.error('Error applying diff:', error);
    return NextResponse.json(
      { 
        success: false,
        errors: [error instanceof Error ? error.message : 'Failed to apply diff'],
        modifiedFiles: []
      },
      { status: 500 }
    );
  }
}
