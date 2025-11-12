import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface StreamProgress {
  type: 'architecture' | 'file' | 'complete' | 'error';
  message: string;
  fileName?: string;
  fileContent?: string;
  fileIndex?: number;
  totalFiles?: number;
  percentComplete?: number;
}

/**
 * Streaming Chunked Generation API
 *
 * Generates large apps file-by-file with real-time progress updates.
 * Uses streaming to send progress events as files are generated.
 */
export async function POST(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { prompt, conversationHistory } = await request.json();

        if (!process.env.ANTHROPIC_API_KEY) {
          const errorEvent: StreamProgress = {
            type: 'error',
            message: 'Anthropic API key not configured'
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`));
          controller.close();
          return;
        }

        // Send initial progress
        const startEvent: StreamProgress = {
          type: 'architecture',
          message: '🏗️ Analyzing your request and planning app architecture...',
          percentComplete: 5
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(startEvent)}\n\n`));

        // Step 1: Generate architecture plan
        const architectureResponse = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          temperature: 0.7,
          messages: [
            ...(conversationHistory || []).map((msg: any) => ({
              role: msg.role === 'system' ? 'user' : msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: `${prompt}

IMPORTANT: First, analyze this request and create a file structure plan.

Return ONLY a JSON object with this structure:
{
  "appName": "App Name",
  "description": "Brief description",
  "files": [
    {
      "path": "src/App.tsx",
      "purpose": "Main component",
      "priority": "high"
    }
  ]
}

Include all files needed. Be specific about file paths and purposes.`
            }
          ]
        });

        const architectureText = architectureResponse.content[0].type === 'text'
          ? architectureResponse.content[0].text
          : '';

        // Extract JSON from response
        const jsonMatch = architectureText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Failed to generate app architecture');
        }

        const architecture = JSON.parse(jsonMatch[0]);
        const files = architecture.files || [];

        // Send architecture complete event
        const archCompleteEvent: StreamProgress = {
          type: 'architecture',
          message: `📋 Plan created: ${files.length} files to generate`,
          totalFiles: files.length,
          percentComplete: 10
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(archCompleteEvent)}\n\n`));

        // Step 2: Generate each file with progress updates
        const generatedFiles: any[] = [];

        for (let i = 0; i < files.length; i++) {
          const fileSpec = files[i];
          const percentComplete = 10 + ((i / files.length) * 80); // 10% to 90%

          // Send file generation start event
          const fileStartEvent: StreamProgress = {
            type: 'file',
            message: `⚡ Generating ${fileSpec.path}...`,
            fileName: fileSpec.path,
            fileIndex: i + 1,
            totalFiles: files.length,
            percentComplete: Math.round(percentComplete)
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(fileStartEvent)}\n\n`));

          // Generate the file
          const fileResponse = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            temperature: 0.7,
            messages: [{
              role: 'user',
              content: `Generate ONLY the code for this file:

File: ${fileSpec.path}
Purpose: ${fileSpec.purpose}

App Context:
${architecture.description}

Already Generated Files:
${generatedFiles.map(f => `- ${f.path}: ${f.purpose}`).join('\n') || 'None (first file)'}

Generate the complete file content. Return ONLY the code, no explanations.`
            }]
          });

          const fileContent = fileResponse.content[0].type === 'text'
            ? fileResponse.content[0].text
            : '';

          // Clean code blocks if present
          const cleanedContent = fileContent
            .replace(/^```[\w]*\n/gm, '')
            .replace(/\n```$/gm, '')
            .trim();

          generatedFiles.push({
            path: fileSpec.path,
            content: cleanedContent,
            purpose: fileSpec.purpose
          });

          // Send file complete event
          const fileCompleteEvent: StreamProgress = {
            type: 'file',
            message: `✅ ${fileSpec.path} complete`,
            fileName: fileSpec.path,
            fileContent: cleanedContent,
            fileIndex: i + 1,
            totalFiles: files.length,
            percentComplete: Math.round(percentComplete + (80 / files.length))
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(fileCompleteEvent)}\n\n`));
        }

        // Send completion event
        const completeEvent: StreamProgress = {
          type: 'complete',
          message: `🎉 App generated successfully! ${generatedFiles.length} files created.`,
          percentComplete: 100
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(completeEvent)}\n\n`));

        // Send final result
        const result = {
          name: architecture.appName,
          description: architecture.description,
          files: generatedFiles,
          changeType: 'NEW_APP'
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'result', data: result })}\n\n`));

        controller.close();

      } catch (error) {
        console.error('Streaming generation error:', error);
        const errorEvent: StreamProgress = {
          type: 'error',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
