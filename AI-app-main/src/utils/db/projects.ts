import { createClient } from '@/utils/supabase/server';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  files: Record<string, any>;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  files: Record<string, any>;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  files?: Record<string, any>;
}

/**
 * Get all projects for the current user
 */
export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_deleted', false)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get a single project by ID
 */
export async function getProject(id: string): Promise<Project | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('is_deleted', false)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return data;
}

/**
 * Create a new project
 */
export async function createProject(input: CreateProjectInput): Promise<Project> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name: input.name,
      description: input.description || null,
      files: input.files,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing project
 */
export async function updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Soft delete a project
 */
export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('projects')
    .update({ is_deleted: true })
    .eq('id', id);

  if (error) throw error;
}

/**
 * Permanently delete a project
 */
export async function permanentlyDeleteProject(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
