import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { ValidationError } from '@/utils/wizardValidation';

interface ValidationMessageProps {
  error?: ValidationError | null;
  className?: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({ error, className = '' }) => {
  if (!error) return null;

  const config = {
    error: {
      icon: AlertCircle,
      bgClass: 'bg-red-500/10',
      borderClass: 'border-red-500/30',
      textClass: 'text-red-400',
      iconClass: 'text-red-400',
    },
    warning: {
      icon: AlertTriangle,
      bgClass: 'bg-yellow-500/10',
      borderClass: 'border-yellow-500/30',
      textClass: 'text-yellow-400',
      iconClass: 'text-yellow-400',
    },
  };

  const { icon: Icon, bgClass, borderClass, textClass, iconClass } = config[error.type];

  return (
    <div
      className={`flex items-start gap-2 p-3 rounded-lg border ${bgClass} ${borderClass} ${className} animate-fade-in`}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconClass}`} />
      <p className={`text-sm ${textClass}`}>{error.message}</p>
    </div>
  );
};

// Character counter component
interface CharacterCounterProps {
  current: number;
  max: number;
  className?: string;
}

export const CharacterCounter: React.FC<CharacterCounterProps> = ({
  current,
  max,
  className = '',
}) => {
  const percentage = (current / max) * 100;
  const isNearLimit = percentage >= 80;
  const isOverLimit = current > max;

  const textColor = isOverLimit
    ? 'text-red-400'
    : isNearLimit
    ? 'text-yellow-400'
    : 'text-neutral-500';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`text-xs ${textColor} transition-colors`}>
        {current} / {max}
      </span>
      {isOverLimit && <AlertCircle className="w-3 h-3 text-red-400" />}
      {isNearLimit && !isOverLimit && <AlertTriangle className="w-3 h-3 text-yellow-400" />}
    </div>
  );
};

// Success message component
interface SuccessMessageProps {
  message: string;
  className?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, className = '' }) => {
  return (
    <div
      className={`flex items-start gap-2 p-3 rounded-lg border bg-green-500/10 border-green-500/30 ${className} animate-fade-in`}
    >
      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-400" />
      <p className="text-sm text-green-400">{message}</p>
    </div>
  );
};

// Info message component
interface InfoMessageProps {
  message: string;
  className?: string;
}

export const InfoMessage: React.FC<InfoMessageProps> = ({ message, className = '' }) => {
  return (
    <div
      className={`flex items-start gap-2 p-3 rounded-lg border bg-blue-500/10 border-blue-500/30 ${className} animate-fade-in`}
    >
      <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
      <p className="text-sm text-blue-400">{message}</p>
    </div>
  );
};

// Form field wrapper with validation
interface ValidatedFieldProps {
  label: string;
  error?: ValidationError | null;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
  characterCount?: { current: number; max: number };
  className?: string;
}

export const ValidatedField: React.FC<ValidatedFieldProps> = ({
  label,
  error,
  required = false,
  children,
  hint,
  characterCount,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {characterCount && (
          <CharacterCounter current={characterCount.current} max={characterCount.max} />
        )}
      </div>

      {children}

      {hint && !error && <p className="text-xs text-neutral-500">{hint}</p>}

      <ValidationMessage error={error} />
    </div>
  );
};

// Multiple errors display
interface ValidationSummaryProps {
  errors: ValidationError[];
  warnings: ValidationError[];
  className?: string;
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  errors,
  warnings,
  className = '',
}) => {
  if (errors.length === 0 && warnings.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {errors.length > 0 && (
        <div className="glass-subtle rounded-xl p-4 border border-red-500/30 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h4 className="font-medium text-red-400">
              {errors.length} {errors.length === 1 ? 'Error' : 'Errors'} Found
            </h4>
          </div>
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-300">
              • {error.message}
            </p>
          ))}
        </div>
      )}

      {warnings.length > 0 && (
        <div className="glass-subtle rounded-xl p-4 border border-yellow-500/30 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h4 className="font-medium text-yellow-400">
              {warnings.length} {warnings.length === 1 ? 'Warning' : 'Warnings'}
            </h4>
          </div>
          {warnings.map((warning, index) => (
            <p key={index} className="text-sm text-yellow-300">
              • {warning.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
