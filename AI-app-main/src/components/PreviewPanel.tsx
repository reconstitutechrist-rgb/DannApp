import React, { memo } from 'react';
import CodePreview from './CodePreview';
import FullAppPreview from './FullAppPreview';
import { GeneratedComponent, ActiveTab } from '../types/aiBuilderTypes';

interface PreviewPanelProps {
  activeTab: ActiveTab;
  currentComponent: GeneratedComponent | null;
  onSetActiveTab: (tab: ActiveTab) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onFork: (component: GeneratedComponent) => void;
  onExport: (component: GeneratedComponent) => void;
  onDownload: () => void;
  isExporting: boolean;
}

export const PreviewPanel = memo(function PreviewPanel({
  activeTab,
  currentComponent,
  onSetActiveTab,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onFork,
  onExport,
  onDownload,
  isExporting
}: PreviewPanelProps) {
  return (
    <div className="bg-neutral-925 rounded-lg border border-white/[0.06] overflow-hidden h-full flex flex-col">
      {/* Tabs */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06] bg-neutral-900/50">
        <button
          onClick={() => onSetActiveTab('preview')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'preview'
              ? 'bg-primary-600 text-white'
              : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
          }`}
        >
          👁️ Preview
        </button>
        <button
          onClick={() => onSetActiveTab('code')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'code'
              ? 'bg-primary-600 text-white'
              : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
          }`}
        >
          💻 Code
        </button>

        {currentComponent && (
          <>
            {/* Undo/Redo Controls */}
            <div className="flex items-center gap-0.5 ml-1.5 px-1.5 py-1 rounded-md bg-neutral-900 border border-white/[0.06]">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className="p-1 rounded text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                title="Undo"
              >
                ↶
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className="p-1 rounded text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                title="Redo"
              >
                ↷
              </button>
            </div>

            {/* Fork Button */}
            <button
              onClick={() => onFork(currentComponent)}
              className="px-2.5 py-1.5 rounded-md bg-neutral-900 border border-white/[0.06] hover:bg-neutral-850 text-neutral-400 hover:text-neutral-200 text-xs font-medium transition-colors flex items-center gap-1.5"
              title="Fork this app"
            >
              <span>🍴</span>
              <span className="hidden lg:inline">Fork</span>
            </button>
          </>
        )}

        <div className="flex-1"></div>

        {currentComponent && (
          <>
            <button
              onClick={() => onExport(currentComponent)}
              disabled={isExporting}
              className="px-3 py-1.5 rounded-md bg-accent-violet/90 hover:bg-accent-violet text-white text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>{isExporting ? '⏳' : '📦'}</span>
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={onDownload}
              className="px-3 py-1.5 rounded-md bg-accent-success/90 hover:bg-accent-success text-white text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <span>📥</span>
              <span className="hidden sm:inline">Download</span>
            </button>
          </>
        )}
      </div>

      {/* Preview Content */}
      <div className="p-4 flex-1 overflow-hidden">
        {!currentComponent ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-3 opacity-80">💬</div>
            <h3 className="text-base font-medium text-neutral-200 mb-1.5">
              Start Building Your App
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
              Describe what you want to build in the chat, and I'll create a complete app with live preview for you.
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Component Info */}
            <div className="mb-3 p-3 rounded-md bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-sm font-medium text-neutral-200 mb-0.5">
                {currentComponent.name}
              </h3>
              <p className="text-xs text-neutral-500 line-clamp-2">
                {currentComponent.description}
              </p>
            </div>

            {activeTab === 'preview' && (
              <div className="flex-1 min-h-0">
                <FullAppPreview appDataJson={currentComponent.code} />
              </div>
            )}

            {activeTab === 'code' && (
              <div className="flex-1 min-h-0 overflow-auto">
                <CodePreview code={currentComponent.code} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
