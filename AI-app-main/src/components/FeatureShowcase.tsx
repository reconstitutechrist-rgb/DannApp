'use client';

/**
 * Feature Showcase Component
 *
 * This component demonstrates all 8 quick win features in a single page.
 * Use this as a testing ground and reference for integration.
 *
 * Usage:
 * import { FeatureShowcase } from '@/components/FeatureShowcase';
 * <FeatureShowcase />
 */

import React, { useState } from 'react';
import {
  Skeleton,
  ChatMessageSkeleton,
  ProjectCardSkeleton,
  CodePreviewSkeleton,
} from './LoadingSkeleton';
import { ToastProvider, useToast, useSuccessToast, useErrorToast } from './Toast';
import { KeyboardShortcutsModal, useKeyboardShortcuts } from './KeyboardShortcutsModal';
import { RecentProjects } from './RecentProjects';
import { CopyCodeButton, CodeBlockWithCopy } from './CopyCodeButton';
import { SettingsPage } from './SettingsPage';
import { ExportConversationModal } from './ExportConversationModal';
import { ProjectTagSelector, TagManagementModal, TagBadge } from './ProjectTags';
import { getAllTags } from '@/utils/projectTags';
import {
  Sparkles,
  Zap,
  Keyboard,
  Clock,
  Copy,
  Settings,
  Download,
  Tag,
} from 'lucide-react';

const sampleCode = `import React from 'react';

export default function HelloWorld() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="p-6">
      <h1>Hello World!</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`;

const sampleMessages = [
  {
    id: '1',
    role: 'user' as const,
    content: 'Create a button component',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    role: 'assistant' as const,
    content: 'Here is a reusable button component with variants',
    timestamp: new Date().toISOString(),
    componentCode: sampleCode,
  },
];

function ShowcaseContent() {
  const [showLoading, setShowLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showTagManagement, setShowTagManagement] = useState(false);

  const { showToast } = useToast();
  const showSuccess = useSuccessToast();
  const showError = useErrorToast();
  const shortcuts = useKeyboardShortcuts();

  const demoProject = {
    id: 'demo-project',
    name: 'Demo Project',
    description: 'A sample project for testing',
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-12 h-12 text-primary-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
              Quick Wins Features Showcase
            </h1>
          </div>
          <p className="text-neutral-400 text-lg">
            All 8 features demonstrated in one place
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm border border-green-500/30">
              Production Ready
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm border border-blue-500/30">
              TypeScript
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm border border-purple-500/30">
              Fully Accessible
            </span>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Loading Skeletons */}
          <div className="glass-subtle rounded-2xl p-6 border border-neutral-700/30 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-violet-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Loading Skeletons</h3>
                <p className="text-xs text-neutral-500">Better perceived performance</p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowLoading(true);
                setTimeout(() => setShowLoading(false), 3000);
              }}
              className="w-full px-4 py-2 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 transition-all"
            >
              Toggle Loading State
            </button>

            {showLoading ? (
              <div className="space-y-4">
                <ProjectCardSkeleton />
                <ChatMessageSkeleton />
              </div>
            ) : (
              <div className="glass rounded-lg p-4">
                <p className="text-neutral-300">Content loaded successfully!</p>
              </div>
            )}
          </div>

          {/* 2. Toast Notifications */}
          <div className="glass-subtle rounded-2xl p-6 border border-neutral-700/30 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Toast Notifications</h3>
                <p className="text-xs text-neutral-500">User feedback system</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => showSuccess('Success!', 'Operation completed')}
                className="px-3 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm transition-all"
              >
                Success
              </button>
              <button
                onClick={() => showError('Error!', 'Something went wrong')}
                className="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition-all"
              >
                Error
              </button>
              <button
                onClick={() =>
                  showToast({ type: 'warning', message: 'Warning!', description: 'Be careful' })
                }
                className="px-3 py-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-sm transition-all"
              >
                Warning
              </button>
              <button
                onClick={() =>
                  showToast({ type: 'info', message: 'Info', description: 'Just so you know' })
                }
                className="px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm transition-all"
              >
                Info
              </button>
            </div>
          </div>

          {/* 3. Keyboard Shortcuts */}
          <div className="glass-subtle rounded-2xl p-6 border border-neutral-700/30 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Keyboard className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
                <p className="text-xs text-neutral-500">Power user productivity</p>
              </div>
            </div>

            <button
              onClick={shortcuts.toggle}
              className="w-full px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all flex items-center justify-center gap-2"
            >
              <Keyboard className="w-4 h-4" />
              Show Shortcuts (Ctrl+/)
            </button>

            <div className="text-xs text-neutral-500 space-y-1">
              <p>• Ctrl+Z - Undo</p>
              <p>• Ctrl+S - Save</p>
              <p>• Ctrl+K - Search</p>
              <p>• Ctrl+, - Settings</p>
            </div>
          </div>

          {/* 4. Recent Projects */}
          <div className="glass-subtle rounded-2xl p-6 border border-neutral-700/30 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Recent Projects</h3>
                <p className="text-xs text-neutral-500">Quick access</p>
              </div>
            </div>

            <RecentProjects
              onProjectClick={(project) => {
                showSuccess('Opened project', project.name);
              }}
              maxDisplay={3}
            />
          </div>

          {/* 5. Copy Code Button */}
          <div className="glass-subtle rounded-2xl p-6 border border-neutral-700/30 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center">
                <Copy className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Copy Code Button</h3>
                <p className="text-xs text-neutral-500">One-click copying</p>
              </div>
            </div>

            <CodeBlockWithCopy
              code={sampleCode}
              language="tsx"
              title="HelloWorld.tsx"
              maxHeight="200px"
              onCopy={() => showSuccess('Code copied to clipboard!')}
            />
          </div>

          {/* 6. Settings Page */}
          <div className="glass-subtle rounded-2xl p-6 border border-neutral-700/30 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                <Settings className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Settings Page</h3>
                <p className="text-xs text-neutral-500">Personalization</p>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(true)}
              className="w-full px-4 py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 transition-all flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Open Settings (Ctrl+,)
            </button>

            <div className="text-xs text-neutral-500 space-y-1">
              <p>• Model selection</p>
              <p>• Theme preferences</p>
              <p>• Editor settings</p>
            </div>
          </div>

          {/* 7. Conversation Export */}
          <div className="glass-subtle rounded-2xl p-6 border border-neutral-700/30 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center">
                <Download className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Conversation Export</h3>
                <p className="text-xs text-neutral-500">Save & share</p>
              </div>
            </div>

            <button
              onClick={() => setShowExport(true)}
              className="w-full px-4 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Conversation
            </button>

            <div className="text-xs text-neutral-500 space-y-1">
              <p>• Markdown format</p>
              <p>• JSON export</p>
              <p>• HTML & plain text</p>
            </div>
          </div>

          {/* 8. Project Tags */}
          <div className="glass-subtle rounded-2xl p-6 border border-neutral-700/30 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center">
                <Tag className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Project Tags</h3>
                <p className="text-xs text-neutral-500">Organization</p>
              </div>
            </div>

            <ProjectTagSelector projectId={demoProject.id} />

            <button
              onClick={() => setShowTagManagement(true)}
              className="w-full px-4 py-2 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 transition-all text-sm"
            >
              Manage Tags
            </button>

            <div className="flex gap-2 flex-wrap">
              {getAllTags()
                .slice(0, 4)
                .map((tag) => (
                  <TagBadge key={tag.id} tag={tag} size="sm" />
                ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 pb-4">
          <p className="text-neutral-500 text-sm">
            All features are production-ready and fully integrated with your design system
          </p>
          <p className="text-neutral-600 text-xs mt-2">
            Press <kbd className="px-2 py-1 rounded bg-neutral-800 text-neutral-400">Ctrl+/</kbd>{' '}
            to view all keyboard shortcuts
          </p>
        </div>
      </div>

      {/* Modals */}
      <KeyboardShortcutsModal isOpen={shortcuts.isOpen} onClose={shortcuts.close} />
      <SettingsPage
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentTheme="midnight"
      />
      <ExportConversationModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        messages={sampleMessages}
      />
      <TagManagementModal isOpen={showTagManagement} onClose={() => setShowTagManagement(false)} />
    </div>
  );
}

export function FeatureShowcase() {
  return (
    <ToastProvider>
      <ShowcaseContent />
    </ToastProvider>
  );
}
