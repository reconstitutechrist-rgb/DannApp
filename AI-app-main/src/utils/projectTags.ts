// Project tags management utility

export interface ProjectTag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface ProjectWithTags {
  id: string;
  tags: string[]; // Array of tag IDs
}

const TAGS_STORAGE_KEY = 'project_tags';
const PROJECT_TAGS_STORAGE_KEY = 'project_tag_assignments';

// Predefined tag colors
export const TAG_COLORS = [
  { name: 'Cyan', value: '#00ffcc', bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  { name: 'Purple', value: '#a855f7', bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  { name: 'Blue', value: '#3b82f6', bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  { name: 'Green', value: '#10b981', bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  { name: 'Yellow', value: '#f59e0b', bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  { name: 'Red', value: '#ef4444', bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  { name: 'Pink', value: '#ec4899', bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
  { name: 'Orange', value: '#f97316', bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  { name: 'Emerald', value: '#059669', bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  { name: 'Indigo', value: '#6366f1', bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30' },
];

// Default tags
const DEFAULT_TAGS: ProjectTag[] = [
  { id: 'web', name: 'Web App', color: TAG_COLORS[0].value, createdAt: new Date().toISOString() },
  { id: 'mobile', name: 'Mobile', color: TAG_COLORS[1].value, createdAt: new Date().toISOString() },
  { id: 'dashboard', name: 'Dashboard', color: TAG_COLORS[2].value, createdAt: new Date().toISOString() },
  { id: 'ecommerce', name: 'E-commerce', color: TAG_COLORS[3].value, createdAt: new Date().toISOString() },
  { id: 'prototype', name: 'Prototype', color: TAG_COLORS[4].value, createdAt: new Date().toISOString() },
  { id: 'production', name: 'Production', color: TAG_COLORS[5].value, createdAt: new Date().toISOString() },
];

/**
 * Get all available tags
 */
export function getAllTags(): ProjectTag[] {
  if (typeof window === 'undefined') return DEFAULT_TAGS;

  try {
    const stored = localStorage.getItem(TAGS_STORAGE_KEY);
    if (!stored) {
      // Initialize with default tags
      localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(DEFAULT_TAGS));
      return DEFAULT_TAGS;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to get tags:', error);
    return DEFAULT_TAGS;
  }
}

/**
 * Create a new tag
 */
export function createTag(name: string, color: string): ProjectTag {
  const tags = getAllTags();
  const newTag: ProjectTag = {
    id: `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    color,
    createdAt: new Date().toISOString(),
  };

  const updatedTags = [...tags, newTag];
  localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(updatedTags));
  return newTag;
}

/**
 * Update an existing tag
 */
export function updateTag(tagId: string, updates: Partial<Omit<ProjectTag, 'id' | 'createdAt'>>): boolean {
  try {
    const tags = getAllTags();
    const tagIndex = tags.findIndex(t => t.id === tagId);

    if (tagIndex === -1) return false;

    tags[tagIndex] = { ...tags[tagIndex], ...updates };
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
    return true;
  } catch (error) {
    console.error('Failed to update tag:', error);
    return false;
  }
}

/**
 * Delete a tag
 */
export function deleteTag(tagId: string): boolean {
  try {
    const tags = getAllTags();
    const filtered = tags.filter(t => t.id !== tagId);
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(filtered));

    // Remove tag from all projects
    const assignments = getProjectTagAssignments();
    Object.keys(assignments).forEach(projectId => {
      assignments[projectId] = assignments[projectId].filter(id => id !== tagId);
    });
    localStorage.setItem(PROJECT_TAGS_STORAGE_KEY, JSON.stringify(assignments));

    return true;
  } catch (error) {
    console.error('Failed to delete tag:', error);
    return false;
  }
}

/**
 * Get tag by ID
 */
export function getTagById(tagId: string): ProjectTag | undefined {
  const tags = getAllTags();
  return tags.find(t => t.id === tagId);
}

/**
 * Get all project tag assignments
 */
function getProjectTagAssignments(): Record<string, string[]> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(PROJECT_TAGS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to get project tag assignments:', error);
    return {};
  }
}

/**
 * Get tags for a specific project
 */
export function getProjectTags(projectId: string): ProjectTag[] {
  const assignments = getProjectTagAssignments();
  const tagIds = assignments[projectId] || [];
  const allTags = getAllTags();

  return tagIds
    .map(id => allTags.find(t => t.id === id))
    .filter((tag): tag is ProjectTag => tag !== undefined);
}

/**
 * Add a tag to a project
 */
export function addTagToProject(projectId: string, tagId: string): boolean {
  try {
    const assignments = getProjectTagAssignments();
    const projectTags = assignments[projectId] || [];

    if (projectTags.includes(tagId)) {
      return false; // Tag already exists
    }

    assignments[projectId] = [...projectTags, tagId];
    localStorage.setItem(PROJECT_TAGS_STORAGE_KEY, JSON.stringify(assignments));
    return true;
  } catch (error) {
    console.error('Failed to add tag to project:', error);
    return false;
  }
}

/**
 * Remove a tag from a project
 */
export function removeTagFromProject(projectId: string, tagId: string): boolean {
  try {
    const assignments = getProjectTagAssignments();
    const projectTags = assignments[projectId] || [];

    assignments[projectId] = projectTags.filter(id => id !== tagId);
    localStorage.setItem(PROJECT_TAGS_STORAGE_KEY, JSON.stringify(assignments));
    return true;
  } catch (error) {
    console.error('Failed to remove tag from project:', error);
    return false;
  }
}

/**
 * Set all tags for a project (replaces existing tags)
 */
export function setProjectTags(projectId: string, tagIds: string[]): boolean {
  try {
    const assignments = getProjectTagAssignments();
    assignments[projectId] = tagIds;
    localStorage.setItem(PROJECT_TAGS_STORAGE_KEY, JSON.stringify(assignments));
    return true;
  } catch (error) {
    console.error('Failed to set project tags:', error);
    return false;
  }
}

/**
 * Get all projects with a specific tag
 */
export function getProjectsWithTag(tagId: string): string[] {
  const assignments = getProjectTagAssignments();
  return Object.entries(assignments)
    .filter(([_, tags]) => tags.includes(tagId))
    .map(([projectId]) => projectId);
}

/**
 * Get tag statistics
 */
export function getTagStats(tagId: string): {
  projectCount: number;
  tag: ProjectTag | undefined;
} {
  return {
    projectCount: getProjectsWithTag(tagId).length,
    tag: getTagById(tagId),
  };
}

/**
 * Search tags by name
 */
export function searchTags(query: string): ProjectTag[] {
  const tags = getAllTags();
  const lowerQuery = query.toLowerCase();
  return tags.filter(tag => tag.name.toLowerCase().includes(lowerQuery));
}

/**
 * Get color classes for a tag color value
 */
export function getTagColorClasses(colorValue: string) {
  const colorConfig = TAG_COLORS.find(c => c.value === colorValue);
  return colorConfig || {
    bg: 'bg-neutral-500/20',
    text: 'text-neutral-400',
    border: 'border-neutral-500/30',
  };
}
