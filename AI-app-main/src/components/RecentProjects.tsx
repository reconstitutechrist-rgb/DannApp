'use client';

import React, { useEffect, useState } from 'react';
import { Clock, FileCode, Trash2, ArrowRight } from 'lucide-react';
import {
  getRecentProjects,
  removeRecentProject,
  getRelativeTimeString,
  RecentProject,
} from '@/utils/recentProjects';

interface RecentProjectsProps {
  onProjectClick?: (project: RecentProject) => void;
  maxDisplay?: number;
  showActions?: boolean;
}

export const RecentProjects: React.FC<RecentProjectsProps> = ({
  onProjectClick,
  maxDisplay = 5,
  showActions = true,
}) => {
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);

  useEffect(() => {
    loadRecentProjects();
  }, []);

  const loadRecentProjects = () => {
    const projects = getRecentProjects().slice(0, maxDisplay);
    setRecentProjects(projects);
  };

  const handleRemove = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    removeRecentProject(projectId);
    loadRecentProjects();
  };

  if (recentProjects.length === 0) {
    return (
      <div className="glass-subtle rounded-xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-800/50 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-neutral-600" />
        </div>
        <h3 className="text-lg font-medium text-neutral-400 mb-2">No recent projects</h3>
        <p className="text-sm text-neutral-500">
          Projects you work on will appear here for quick access
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary-400" />
        <h3 className="text-lg font-semibold text-white">Recently Opened</h3>
      </div>

      <div className="space-y-2">
        {recentProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => onProjectClick?.(project)}
            className="glass-subtle rounded-xl p-4 cursor-pointer hover:bg-white/5 transition-all group border border-transparent hover:border-primary-500/20"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500/20 to-violet-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <FileCode className="w-6 h-6 text-primary-400" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate group-hover:text-primary-400 transition-colors">
                      {project.name}
                    </h4>
                    {project.description && (
                      <p className="text-sm text-neutral-400 line-clamp-1 mt-0.5">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-neutral-500">
                      {getRelativeTimeString(project.lastOpened)}
                    </span>
                    {showActions && (
                      <button
                        onClick={(e) => handleRemove(e, project.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/20 text-neutral-500 hover:text-red-400"
                        aria-label="Remove from recent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-neutral-800/60 text-xs text-neutral-400"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-0.5 rounded-full bg-neutral-800/60 text-xs text-neutral-500">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Arrow */}
              <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Compact version for homepage
export const RecentProjectsCompact: React.FC<{
  onProjectClick?: (project: RecentProject) => void;
}> = ({ onProjectClick }) => {
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);

  useEffect(() => {
    const projects = getRecentProjects().slice(0, 3);
    setRecentProjects(projects);
  }, []);

  if (recentProjects.length === 0) return null;

  return (
    <div className="space-y-2">
      {recentProjects.map((project) => (
        <button
          key={project.id}
          onClick={() => onProjectClick?.(project)}
          className="w-full text-left glass-subtle rounded-lg p-3 hover:bg-white/5 transition-all group flex items-center gap-3"
        >
          <FileCode className="w-4 h-4 text-primary-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate group-hover:text-primary-400 transition-colors">
              {project.name}
            </p>
            <p className="text-xs text-neutral-500">
              {getRelativeTimeString(project.lastOpened)}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
        </button>
      ))}
    </div>
  );
};
