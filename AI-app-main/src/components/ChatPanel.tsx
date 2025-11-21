import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types/aiBuilderTypes';
import PhaseProgress from './PhaseProgress';
import StreamingProgressDisplay from './StreamingProgressDisplay';

interface ChatPanelProps {
  messages: ChatMessage[];
  isGenerating: boolean;
  generationProgress: string;
  isStreaming: boolean;
  streamingProgress: any;
  userInput: string;
  setUserInput: (input: string) => void;
  onSendMessage: () => void;
  uploadedImage: string | null;
  onRemoveImage: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onViewComponent: () => void;
  currentMode: 'PLAN' | 'ACT';
  setCurrentMode: (mode: 'PLAN' | 'ACT') => void;
  newAppStagePlan: any; // Typed loosely to avoid circular deps
}

export const ChatPanel = React.memo(function ChatPanel({
  messages,
  isGenerating,
  generationProgress,
  isStreaming,
  streamingProgress,
  userInput,
  setUserInput,
  onSendMessage,
  uploadedImage,
  onRemoveImage,
  onImageUpload,
  onViewComponent,
  currentMode,
  setCurrentMode,
  newAppStagePlan
}: ChatPanelProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="bg-neutral-925 rounded-lg border border-white/[0.06] overflow-hidden flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-white/[0.06] bg-neutral-900/50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-neutral-200 flex items-center gap-2">
            <span>💬</span>
            <span>Conversation</span>
          </h2>
          
          {/* Plan/Act Mode Toggle */}
          <div className="flex gap-0.5 bg-neutral-900 p-0.5 rounded-md border border-white/[0.06]">
            <button
              onClick={() => setCurrentMode('PLAN')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                currentMode === 'PLAN'
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
              }`}
              title="Plan Mode: AI discusses and explains (no code changes)"
            >
              💭 Plan
            </button>
            <button
              onClick={() => setCurrentMode('ACT')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                currentMode === 'ACT'
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
              }`}
              title="Act Mode: AI can modify code"
            >
              ⚡ Act
            </button>
          </div>
        </div>
        
        {/* Mode Description */}
        <p className="text-xs text-neutral-600">
          {currentMode === 'PLAN'
            ? '💭 Plan Mode: AI will discuss and explain (no code changes)'
            : '⚡ Act Mode: AI can modify your app'
          }
        </p>
      </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3.5 py-2.5 ${
                message.role === 'user'
                  ? 'bg-primary-600/90 text-white'
                  : message.role === 'system'
                  ? 'bg-primary-600/5 text-primary-300 border border-primary-500/10'
                  : 'bg-neutral-850 text-neutral-200 border border-white/[0.06]'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              {message.componentPreview && (
                <button
                  onClick={onViewComponent}
                  className="mt-2.5 text-xs px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/15 transition-colors"
                >
                  👁️ View Component
                </button>
              )}
              <p className="text-xs opacity-40 mt-2" suppressHydrationWarning>
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {/* Phase Progress Indicator */}
        {newAppStagePlan && newAppStagePlan.phases && newAppStagePlan.phases.length > 0 && (
          <div className="my-6">
            <PhaseProgress
              phases={newAppStagePlan.phases}
              currentPhase={newAppStagePlan.currentPhase}
            />
          </div>
        )}

        {/* Streaming Progress Display */}
        {isStreaming && (
          <div className="my-4">
            <StreamingProgressDisplay
              phase={streamingProgress.phase}
              message={streamingProgress.message}
              percentComplete={streamingProgress.percentComplete}
              currentFile={streamingProgress.currentFile}
              fileIndex={streamingProgress.fileIndex}
              totalFiles={streamingProgress.totalFiles}
              files={streamingProgress.files}
            />
          </div>
        )}

        {isGenerating && !isStreaming && (
          <div className="flex justify-start">
            <div className="bg-neutral-850 rounded-lg px-3.5 py-2.5 border border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <div>
                  <div className="text-xs font-medium text-neutral-200">Generating your app...</div>
                  {generationProgress && (
                    <div className="text-xs text-neutral-500 mt-0.5">{generationProgress}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-white/[0.06] bg-neutral-900/50">
        {/* Image Preview */}
        {uploadedImage && (
          <div className="mb-2.5 relative inline-block">
            <img
              src={uploadedImage}
              alt="Uploaded inspiration"
              className="h-16 w-16 object-cover rounded-md border border-primary-500/50"
            />
            <button
              onClick={onRemoveImage}
              className="absolute -top-1.5 -right-1.5 bg-accent-error hover:bg-accent-error/90 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>
            <div className="text-xs text-neutral-500 mt-1">
              🎨 Design inspiration
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {/* Image Upload Button */}
          <label
            className="px-2.5 py-2.5 rounded-md bg-neutral-900 hover:bg-neutral-850 border border-white/[0.06] text-white cursor-pointer transition-colors flex items-center justify-center"
            title="Upload image for AI-inspired design"
          >
            <span className="text-base">🖼️</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
          </label>

          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe what you want to build or change..."
            disabled={isGenerating}
            className="flex-1 px-3 py-2.5 rounded-md bg-neutral-900 border border-white/[0.06] text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 disabled:opacity-50 text-sm"
          />
          <button
            onClick={onSendMessage}
            disabled={isGenerating || (!userInput.trim() && !uploadedImage)}
            data-send-button="true"
            className="px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isGenerating ? '⏳' : '🚀'}
          </button>
        </div>
      </div>
    </div>
  );
});
