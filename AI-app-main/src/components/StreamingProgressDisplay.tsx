'use client';

import React from 'react';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';

interface FileProgress {
  path: string;
  status: 'pending' | 'generating' | 'complete';
  content?: string;
}

interface StreamingProgressProps {
  phase: 'architecture' | 'files' | 'complete' | 'error';
  message: string;
  percentComplete: number;
  currentFile?: string;
  fileIndex?: number;
  totalFiles?: number;
  files: FileProgress[];
}

/**
 * Real-time progress display for streaming app generation
 * Shows architecture planning, file-by-file generation, and completion status
 */
export default function StreamingProgressDisplay({
  phase,
  message,
  percentComplete,
  currentFile,
  fileIndex,
  totalFiles,
  files
}: StreamingProgressProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
      {/* Header with main message */}
      <div className="flex items-center gap-3">
        {phase === 'complete' ? (
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
        ) : phase === 'error' ? (
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">!</span>
          </div>
        ) : (
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin flex-shrink-0" />
        )}
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          {message}
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {phase === 'architecture' && 'Planning app structure...'}
            {phase === 'files' && currentFile && `Generating ${currentFile}...`}
            {phase === 'complete' && 'Generation complete!'}
            {phase === 'error' && 'Error occurred'}
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {Math.round(percentComplete)}%
          </span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              phase === 'error'
                ? 'bg-red-500'
                : phase === 'complete'
                ? 'bg-green-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${percentComplete}%` }}
          />
        </div>

        {fileIndex && totalFiles && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            File {fileIndex} of {totalFiles}
          </p>
        )}
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Files:
          </h4>
          <div className="space-y-1">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm py-1 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {file.status === 'complete' ? (
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : file.status === 'generating' ? (
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                <span
                  className={`font-mono text-xs ${
                    file.status === 'complete'
                      ? 'text-gray-600 dark:text-gray-400'
                      : file.status === 'generating'
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {file.path}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
