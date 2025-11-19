'use client';

import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';
import {
  type KeyboardShortcut,
  formatShortcut,
  groupShortcutsByCategory,
} from '../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
  appName?: string;
}

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose,
  shortcuts,
  appName = 'App',
}) => {
  if (!isOpen) return null;

  const groupedShortcuts = groupShortcutsByCategory(shortcuts);
  const categories = Object.keys(groupedShortcuts).sort();

  // Category icons
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'navigation':
        return '🧭';
      case 'editing':
        return '✏️';
      case 'actions':
        return '⚡';
      case 'view':
        return '👁️';
      case 'general':
        return '⚙️';
      default:
        return '📌';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-2xl border border-white/10 max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/20">
              <Keyboard className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
              <p className="text-sm text-slate-400">
                Boost your productivity with these shortcuts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-all text-slate-400"
            aria-label="Close shortcuts help"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {shortcuts.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Keyboard className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No shortcuts configured</p>
              <p className="text-sm mt-2">Keyboard shortcuts will appear here when available</p>
            </div>
          ) : (
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{getCategoryIcon(category)}</span>
                    <h3 className="text-lg font-semibold text-white capitalize">
                      {category}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {groupedShortcuts[category].map((shortcut, index) => (
                      <div
                        key={`${category}-${index}`}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all group"
                      >
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                          {shortcut.description}
                        </span>
                        <kbd className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-semibold shadow-sm">
                          {formatShortcut(shortcut)}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          {shortcuts.length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <Command className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Pro Tips</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        Press <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono mx-1">?</kbd> anytime to open this help dialog
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        Most shortcuts work globally, even when focused on inputs
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        On Mac, <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono mx-1">Ctrl</kbd> shortcuts also work with <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono mx-1">Cmd</kbd>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10 bg-slate-950/50">
          <div className="text-xs text-slate-500">
            Keyboard shortcuts for {appName}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
