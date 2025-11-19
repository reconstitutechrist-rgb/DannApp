'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, X, Edit2, Trash2, Check } from 'lucide-react';
import {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
  getProjectTags,
  addTagToProject,
  removeTagFromProject,
  getTagColorClasses,
  TAG_COLORS,
  ProjectTag,
} from '@/utils/projectTags';

// Tag badge component
interface TagBadgeProps {
  tag: ProjectTag;
  onRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  tag,
  onRemove,
  size = 'md',
  removable = false,
}) => {
  const colorClasses = getTagColorClasses(tag.color);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`
        ${sizeClasses[size]}
        ${colorClasses.bg} ${colorClasses.text} ${colorClasses.border}
        rounded-full font-medium inline-flex items-center gap-1.5 border
      `}
    >
      <Tag className={iconSizes[size]} />
      {tag.name}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:bg-white/10 rounded-full p-0.5 transition-colors"
          aria-label="Remove tag"
        >
          <X className={iconSizes[size]} />
        </button>
      )}
    </span>
  );
};

// Project tag selector component
interface ProjectTagSelectorProps {
  projectId: string;
  onTagsChange?: (tags: ProjectTag[]) => void;
  maxDisplay?: number;
}

export const ProjectTagSelector: React.FC<ProjectTagSelectorProps> = ({
  projectId,
  onTagsChange,
  maxDisplay = 5,
}) => {
  const [projectTags, setProjectTags] = useState<ProjectTag[]>([]);
  const [allTags, setAllTags] = useState<ProjectTag[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadTags();
  }, [projectId]);

  const loadTags = () => {
    const tags = getProjectTags(projectId);
    const available = getAllTags();
    setProjectTags(tags);
    setAllTags(available);
  };

  const handleAddTag = (tagId: string) => {
    if (addTagToProject(projectId, tagId)) {
      loadTags();
      const updatedTags = getProjectTags(projectId);
      onTagsChange?.(updatedTags);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    if (removeTagFromProject(projectId, tagId)) {
      loadTags();
      const updatedTags = getProjectTags(projectId);
      onTagsChange?.(updatedTags);
    }
  };

  const availableTags = allTags.filter(
    (tag) => !projectTags.find((pt) => pt.id === tag.id)
  );

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 items-center">
        {projectTags.slice(0, maxDisplay).map((tag) => (
          <TagBadge key={tag.id} tag={tag} removable onRemove={() => handleRemoveTag(tag.id)} />
        ))}
        {projectTags.length > maxDisplay && (
          <span className="text-xs text-neutral-500 px-2">
            +{projectTags.length - maxDisplay} more
          </span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-6 h-6 rounded-full bg-neutral-800/60 hover:bg-neutral-700/60 flex items-center justify-center transition-colors text-neutral-400 hover:text-primary-400"
          aria-label="Add tag"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-2 left-0 z-50 glass border border-neutral-700/50 rounded-xl shadow-2xl p-3 min-w-[250px]">
            <p className="text-xs font-medium text-neutral-400 mb-2 px-2">Select tags</p>
            <div className="space-y-1 max-h-[200px] overflow-y-auto custom-scrollbar">
              {availableTags.length > 0 ? (
                availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => {
                      handleAddTag(tag.id);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-2 py-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    <TagBadge tag={tag} size="sm" />
                  </button>
                ))
              ) : (
                <p className="text-xs text-neutral-500 px-2 py-2">No available tags</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Tag management modal
interface TagManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TagManagementModal: React.FC<TagManagementModalProps> = ({ isOpen, onClose }) => {
  const [tags, setTags] = useState<ProjectTag[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0].value);

  useEffect(() => {
    if (isOpen) {
      loadTags();
    }
  }, [isOpen]);

  const loadTags = () => {
    setTags(getAllTags());
  };

  const handleCreate = () => {
    if (!newTagName.trim()) return;

    createTag(newTagName.trim(), newTagColor);
    setNewTagName('');
    setNewTagColor(TAG_COLORS[0].value);
    setIsCreating(false);
    loadTags();
  };

  const handleUpdate = (tagId: string, name: string, color: string) => {
    updateTag(tagId, { name, color });
    setEditingId(null);
    loadTags();
  };

  const handleDelete = (tagId: string) => {
    if (confirm('Delete this tag? It will be removed from all projects.')) {
      deleteTag(tagId);
      loadTags();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass border border-neutral-700/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-700/30 flex items-center justify-between bg-gradient-to-r from-primary-500/10 to-violet-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-violet-500/20 flex items-center justify-center">
              <Tag className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Manage Tags</h2>
              <p className="text-sm text-neutral-400">{tags.length} tags</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)] custom-scrollbar space-y-4">
          {/* Create new tag */}
          {isCreating ? (
            <div className="glass-subtle rounded-xl p-4 border border-primary-500/30">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Tag name"
                className="w-full bg-transparent text-white placeholder-neutral-500 outline-none mb-3"
                autoFocus
              />
              <div className="flex gap-2 mb-3 flex-wrap">
                {TAG_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNewTagColor(color.value)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      newTagColor === color.value ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.value }}
                    aria-label={color.name}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  disabled={!newTagName.trim()}
                  className="px-3 py-1.5 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 text-sm font-medium flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewTagName('');
                  }}
                  className="px-3 py-1.5 rounded-lg hover:bg-white/5 text-neutral-400 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full glass-subtle rounded-xl p-4 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-primary-400 border border-dashed border-neutral-700/50 hover:border-primary-500/30"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Create new tag</span>
            </button>
          )}

          {/* Existing tags */}
          <div className="space-y-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="glass-subtle rounded-xl p-4 flex items-center justify-between group"
              >
                <TagBadge tag={tag} />
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingId(tag.id)}
                    className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-primary-400 transition-colors"
                    aria-label="Edit tag"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors"
                    aria-label="Delete tag"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
