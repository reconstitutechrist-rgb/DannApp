'use client';

import React, { useEffect, useState } from 'react';
import { X, Keyboard, Command, Option } from 'lucide-react';

interface KeyboardShortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: KeyboardShortcut[] = [
  // Editing
  { keys: ['Ctrl', 'Z'], description: 'Undo last change', category: 'Editing' },
  { keys: ['Ctrl', 'Y'], description: 'Redo last change', category: 'Editing' },
  { keys: ['Ctrl', 'S'], description: 'Save project', category: 'Editing' },
  { keys: ['Ctrl', 'Shift', 'S'], description: 'Save as new version', category: 'Editing' },

  // Navigation
  { keys: ['Ctrl', 'K'], description: 'Focus search/command palette', category: 'Navigation' },
  { keys: ['Ctrl', 'B'], description: 'Toggle component library', category: 'Navigation' },
  { keys: ['Ctrl', 'H'], description: 'Toggle version history', category: 'Navigation' },
  { keys: ['Ctrl', '`'], description: 'Toggle preview mode', category: 'Navigation' },

  // Code Actions
  { keys: ['Ctrl', 'Enter'], description: 'Send message/Generate code', category: 'Code Actions' },
  { keys: ['Ctrl', 'Shift', 'C'], description: 'Copy code to clipboard', category: 'Code Actions' },
  { keys: ['Ctrl', 'Shift', 'E'], description: 'Export conversation', category: 'Code Actions' },
  { keys: ['Ctrl', 'Shift', 'R'], description: 'Run code quality review', category: 'Code Actions' },

  // View Management
  { keys: ['Ctrl', '1'], description: 'Switch to classic layout', category: 'View' },
  { keys: ['Ctrl', '2'], description: 'Switch to preview-first layout', category: 'View' },
  { keys: ['Ctrl', '3'], description: 'Switch to code-first layout', category: 'View' },
  { keys: ['Ctrl', '4'], description: 'Switch to stacked layout', category: 'View' },

  // General
  { keys: ['Ctrl', ','], description: 'Open settings', category: 'General' },
  { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts', category: 'General' },
  { keys: ['Escape'], description: 'Close modal/Cancel action', category: 'General' },
];

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass border border-neutral-700/50 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-700/30 flex items-center justify-between bg-gradient-to-r from-primary-500/10 to-violet-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-violet-500/20 flex items-center justify-center">
              <Keyboard className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Keyboard Shortcuts</h2>
              <p className="text-sm text-neutral-400">Master your workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
            aria-label="Close shortcuts modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] custom-scrollbar">
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-4">
                  {category}
                </h3>
                <div className="space-y-3">
                  {shortcuts
                    .filter((s) => s.category === category)
                    .map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg glass-subtle hover:bg-white/5 transition-colors group"
                      >
                        <span className="text-neutral-200 group-hover:text-white transition-colors">
                          {shortcut.description}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {shortcut.keys.map((key, i) => (
                            <React.Fragment key={i}>
                              {i > 0 && (
                                <span className="text-neutral-500 text-xs mx-0.5">+</span>
                              )}
                              <kbd className="px-2.5 py-1.5 rounded-md bg-neutral-800/80 border border-neutral-700/50 text-xs font-mono text-neutral-300 shadow-sm min-w-[2.5rem] text-center">
                                {key}
                              </kbd>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Platform Note */}
          <div className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <Command className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-200 font-medium">macOS Users</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Replace <kbd className="px-1.5 py-0.5 rounded bg-neutral-800/80 text-neutral-300 font-mono">Ctrl</kbd> with{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-800/80 text-neutral-300 font-mono">⌘ Cmd</kbd> for most shortcuts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-700/30 bg-neutral-900/50 flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800/80 text-neutral-300 font-mono">Ctrl</kbd>{' '}
            + <kbd className="px-1.5 py-0.5 rounded bg-neutral-800/80 text-neutral-300 font-mono">/</kbd> anytime to toggle this modal
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 hover:text-primary-300 transition-all text-sm font-medium"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook to manage keyboard shortcuts modal
export const useKeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+/ or Cmd+/
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
};
