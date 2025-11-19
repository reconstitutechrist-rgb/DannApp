import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  animation = 'pulse',
  width,
  height,
}) => {
  const baseClasses = 'bg-gradient-to-r from-neutral-800/50 via-neutral-700/50 to-neutral-800/50';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-[wave_2s_ease-in-out_infinite]',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'circular' ? '40px' : undefined),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// Skeleton for chat messages
export const ChatMessageSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start gap-3">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="flex-1 space-y-2">
          <Skeleton width="30%" height={16} />
          <Skeleton width="90%" height={12} />
          <Skeleton width="75%" height={12} />
        </div>
      </div>
    </div>
  );
};

// Skeleton for project cards
export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="glass-subtle rounded-xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <Skeleton width="60%" height={20} />
          <Skeleton width="100%" height={12} />
          <Skeleton width="80%" height={12} />
        </div>
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton width={60} height={24} className="rounded-full" />
        <Skeleton width={80} height={24} className="rounded-full" />
        <Skeleton width={70} height={24} className="rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-neutral-700/30">
        <Skeleton width={100} height={12} />
        <Skeleton width={80} height={12} />
      </div>
    </div>
  );
};

// Skeleton for code preview
export const CodePreviewSkeleton: React.FC = () => {
  return (
    <div className="glass-subtle rounded-xl p-6 space-y-3">
      <div className="flex items-center justify-between mb-4">
        <Skeleton width={120} height={16} />
        <Skeleton width={80} height={32} className="rounded-lg" />
      </div>
      <Skeleton width="95%" height={14} />
      <Skeleton width="80%" height={14} />
      <Skeleton width="90%" height={14} />
      <Skeleton width="70%" height={14} />
      <Skeleton width="85%" height={14} />
      <Skeleton width="95%" height={14} />
      <Skeleton width="75%" height={14} />
      <Skeleton width="88%" height={14} />
      <Skeleton width="92%" height={14} />
      <Skeleton width="65%" height={14} />
    </div>
  );
};

// Skeleton for library component list
export const ComponentListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-subtle rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton width="40%" height={16} />
            <Skeleton variant="circular" width={24} height={24} />
          </div>
          <Skeleton width="100%" height={12} />
          <Skeleton width="85%" height={12} />
          <div className="flex gap-2 pt-2">
            <Skeleton width={60} height={20} className="rounded-full" />
            <Skeleton width={80} height={20} className="rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Skeleton for settings page
export const SettingsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-subtle rounded-xl p-6 space-y-4">
          <Skeleton width="30%" height={20} />
          <Skeleton width="100%" height={12} />
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Skeleton height={40} className="rounded-lg" />
            <Skeleton height={40} className="rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Full page loading skeleton
export const PageLoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <Skeleton width={200} height={32} />
          <div className="flex gap-3">
            <Skeleton width={100} height={40} className="rounded-lg" />
            <Skeleton width={100} height={40} className="rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      </div>
    </div>
  );
};
