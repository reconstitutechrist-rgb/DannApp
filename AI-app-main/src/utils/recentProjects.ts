// Recently opened projects tracking utility

export interface RecentProject {
  id: string;
  name: string;
  description?: string;
  lastOpened: string;
  thumbnail?: string;
  tags?: string[];
}

const STORAGE_KEY = 'recent_projects';
const MAX_RECENT_PROJECTS = 10;

/**
 * Get all recently opened projects
 */
export function getRecentProjects(): RecentProject[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const projects: RecentProject[] = JSON.parse(stored);
    // Sort by most recent first
    return projects.sort((a, b) =>
      new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime()
    );
  } catch (error) {
    console.error('Failed to get recent projects:', error);
    return [];
  }
}

/**
 * Add or update a project in recent projects list
 */
export function addRecentProject(project: Omit<RecentProject, 'lastOpened'>) {
  if (typeof window === 'undefined') return;

  try {
    const recentProjects = getRecentProjects();

    // Remove existing entry if present
    const filtered = recentProjects.filter(p => p.id !== project.id);

    // Add to the front with current timestamp
    const newEntry: RecentProject = {
      ...project,
      lastOpened: new Date().toISOString(),
    };

    const updated = [newEntry, ...filtered].slice(0, MAX_RECENT_PROJECTS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to add recent project:', error);
  }
}

/**
 * Remove a project from recent projects list
 */
export function removeRecentProject(projectId: string) {
  if (typeof window === 'undefined') return;

  try {
    const recentProjects = getRecentProjects();
    const filtered = recentProjects.filter(p => p.id !== projectId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove recent project:', error);
  }
}

/**
 * Clear all recent projects
 */
export function clearRecentProjects() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear recent projects:', error);
  }
}

/**
 * Get relative time string for display
 */
export function getRelativeTimeString(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}
