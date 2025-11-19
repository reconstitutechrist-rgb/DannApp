'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyCodeButtonProps {
  code: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'ghost';
  showLabel?: boolean;
  onCopy?: () => void;
}

export const CopyCodeButton: React.FC<CopyCodeButtonProps> = ({
  code,
  className = '',
  size = 'md',
  variant = 'default',
  showLabel = false,
  onCopy,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopy?.();

      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const variantClasses = {
    default:
      'glass-subtle border border-neutral-700/30 hover:border-primary-500/30 hover:bg-primary-500/10',
    minimal: 'bg-neutral-800/40 hover:bg-neutral-700/40',
    ghost: 'hover:bg-white/5',
  };

  const Icon = copied ? Check : Copy;
  const iconColor = copied ? 'text-green-400' : 'text-neutral-400 group-hover:text-primary-400';

  return (
    <button
      onClick={handleCopy}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg transition-all group
        flex items-center gap-2
        ${className}
      `}
      aria-label={copied ? 'Copied!' : 'Copy code'}
      title={copied ? 'Copied!' : 'Copy code'}
    >
      <Icon className={`${iconSizes[size]} ${iconColor} transition-colors`} />
      {showLabel && (
        <span
          className={`font-medium ${
            copied ? 'text-green-400' : 'text-neutral-400 group-hover:text-primary-400'
          } transition-colors`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </span>
      )}
    </button>
  );
};

// Code block with integrated copy button
interface CodeBlockWithCopyProps {
  code: string;
  language?: string;
  title?: string;
  maxHeight?: string;
  showLineNumbers?: boolean;
  onCopy?: () => void;
}

export const CodeBlockWithCopy: React.FC<CodeBlockWithCopyProps> = ({
  code,
  language = 'typescript',
  title,
  maxHeight = '500px',
  showLineNumbers = true,
  onCopy,
}) => {
  const lines = code.split('\n');

  return (
    <div className="glass-subtle rounded-xl border border-neutral-700/30 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-700/30 flex items-center justify-between bg-neutral-900/50">
        <div className="flex items-center gap-3">
          {title && <span className="text-sm font-medium text-neutral-300">{title}</span>}
          {language && (
            <span className="px-2 py-0.5 rounded bg-neutral-800/60 text-xs text-neutral-500 uppercase">
              {language}
            </span>
          )}
        </div>
        <CopyCodeButton code={code} size="sm" variant="ghost" showLabel onCopy={onCopy} />
      </div>

      {/* Code */}
      <div
        className="overflow-auto custom-scrollbar"
        style={{ maxHeight }}
      >
        <pre className="p-4 text-sm">
          <code className="font-mono">
            {showLineNumbers ? (
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index}>
                      <td className="pr-4 text-right text-neutral-600 select-none align-top w-[1%] whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="text-neutral-200">
                        <span className="whitespace-pre">{line || ' '}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span className="text-neutral-200 whitespace-pre">{code}</span>
            )}
          </code>
        </pre>
      </div>
    </div>
  );
};

// Floating copy button for preview panels
export const FloatingCopyButton: React.FC<{
  code: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onCopy?: () => void;
}> = ({ code, position = 'top-right', onCopy }) => {
  const positionClasses = {
    'top-right': 'top-2 right-2',
    'top-left': 'top-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'bottom-left': 'bottom-2 left-2',
  };

  return (
    <div className={`absolute ${positionClasses[position]} z-10`}>
      <CopyCodeButton
        code={code}
        variant="default"
        size="sm"
        showLabel={false}
        onCopy={onCopy}
      />
    </div>
  );
};
