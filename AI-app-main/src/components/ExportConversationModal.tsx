'use client';

import React, { useState } from 'react';
import { Download, Copy, FileText, FileJson, Code, File, X, Check } from 'lucide-react';
import {
  downloadConversation,
  copyConversationToClipboard,
  ChatMessage,
  ExportOptions,
} from '@/utils/exportConversation';

interface ExportConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
}

type ExportFormat = 'markdown' | 'json' | 'html' | 'txt';

export const ExportConversationModal: React.FC<ExportConversationModalProps> = ({
  isOpen,
  onClose,
  messages,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('markdown');
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [includeCode, setIncludeCode] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [copied, setCopied] = useState(false);

  const formats: { value: ExportFormat; label: string; icon: any; description: string }[] = [
    {
      value: 'markdown',
      label: 'Markdown',
      icon: FileText,
      description: 'Great for documentation and GitHub',
    },
    {
      value: 'json',
      label: 'JSON',
      icon: FileJson,
      description: 'Structured data for processing',
    },
    {
      value: 'html',
      label: 'HTML',
      icon: Code,
      description: 'Styled web page',
    },
    {
      value: 'txt',
      label: 'Plain Text',
      icon: File,
      description: 'Simple readable format',
    },
  ];

  const handleDownload = () => {
    const options: ExportOptions = {
      format: selectedFormat,
      includeTimestamps,
      includeCode,
      includeMetadata,
    };

    downloadConversation(messages, undefined, options);
  };

  const handleCopy = async () => {
    const options: ExportOptions = {
      format: selectedFormat,
      includeTimestamps,
      includeCode,
      includeMetadata,
    };

    const success = await copyConversationToClipboard(messages, options);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass border border-neutral-700/50 rounded-2xl shadow-2xl max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-700/30 flex items-center justify-between bg-gradient-to-r from-primary-500/10 to-violet-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-violet-500/20 flex items-center justify-center">
              <Download className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Export Conversation</h2>
              <p className="text-sm text-neutral-400">
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
            aria-label="Close export modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="text-sm font-medium text-neutral-300 block mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {formats.map((format) => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.value}
                    onClick={() => setSelectedFormat(format.value)}
                    className={`
                      glass-subtle rounded-xl p-4 transition-all text-left
                      ${
                        selectedFormat === format.value
                          ? 'border border-primary-500/50 bg-primary-500/10'
                          : 'border border-transparent hover:bg-white/5'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          selectedFormat === format.value ? 'text-primary-400' : 'text-neutral-400'
                        }`}
                      />
                      <div>
                        <p className="font-medium text-white text-sm">{format.label}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">{format.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="text-sm font-medium text-neutral-300 block mb-3">Options</label>
            <div className="glass-subtle rounded-xl p-4 space-y-3">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="text-sm text-white group-hover:text-primary-400 transition-colors">
                    Include timestamps
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Show when each message was sent
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={includeTimestamps}
                  onChange={(e) => setIncludeTimestamps(e.target.checked)}
                  className="w-4 h-4 accent-primary-500"
                />
              </label>

              <div className="border-t border-neutral-700/30" />

              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="text-sm text-white group-hover:text-primary-400 transition-colors">
                    Include code blocks
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Export generated code snippets
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={includeCode}
                  onChange={(e) => setIncludeCode(e.target.checked)}
                  className="w-4 h-4 accent-primary-500"
                />
              </label>

              <div className="border-t border-neutral-700/30" />

              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="text-sm text-white group-hover:text-primary-400 transition-colors">
                    Include metadata
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Add export date and message count
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  className="w-4 h-4 accent-primary-500"
                />
              </label>
            </div>
          </div>

          {/* Preview Info */}
          <div className="glass-subtle rounded-xl p-4 bg-blue-500/5 border border-blue-500/20">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-200 font-medium">Export Preview</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {selectedFormat === 'markdown' && 'Markdown format with syntax highlighting support'}
                  {selectedFormat === 'json' && 'Structured JSON data with all message properties'}
                  {selectedFormat === 'html' && 'Standalone HTML page with inline styling'}
                  {selectedFormat === 'txt' && 'Plain text format for maximum compatibility'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-700/30 bg-neutral-900/50 flex items-center justify-end gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg glass-subtle hover:bg-white/5 text-neutral-300 hover:text-white transition-all text-sm font-medium flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy to clipboard
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 hover:text-primary-300 transition-all text-sm font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download file
          </button>
        </div>
      </div>
    </div>
  );
};
