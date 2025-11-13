import { createClient } from '@/utils/supabase/server';

export interface Version {
  id: string;
  project_id: string;
  version_number: number;
  files: Record<string, any>;
  description: string | null;
  created_at: string;
}

export interface CreateVersionInput {
  project_id: string;
  files: Record<string, any>;
  description?: string;
}

/**
 * Get all versions for a project
 */
export async function getVersions(projectId: string): Promise<Version[]> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Verify user owns this project through RLS
  const { data, error } = await supabase
    .from('versions')
    .select('*')
    .eq('project_id', projectId)
    .order('version_number', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get a specific version
 */
export async function getVersion(id: string): Promise<Version | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('versions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return data;
}

/**
 * Create a new version
 */
export async function createVersion(input: CreateVersionInput): Promise<Version> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get the latest version number for this project
  const versions = await getVersions(input.project_id);
  const latestVersion = versions.length > 0 ? versions[0].version_number : 0;

  const { data, error } = await supabase
    .from('versions')
    .insert({
      project_id: input.project_id,
      version_number: latestVersion + 1,
      files: input.files,
      description: input.description || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Restore a project to a specific version
 */
export async function restoreVersion(versionId: string): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const version = await getVersion(versionId);
  if (!version) throw new Error('Version not found');

  // Update the project with the version's files
  const { error } = await supabase
    .from('projects')
    .update({ files: version.files })
    .eq('id', version.project_id);

  if (error) throw error;
}
