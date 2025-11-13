import { createClient } from '@/utils/supabase/server';

export interface Conversation {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface CreateConversationInput {
  project_id?: string;
  title?: string;
}

export interface CreateMessageInput {
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
}

/**
 * Get all conversations for the current user
 */
export async function getConversations(): Promise<Conversation[]> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get conversations for a specific project
 */
export async function getConversationsByProject(projectId: string): Promise<Conversation[]> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('project_id', projectId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get a single conversation by ID
 */
export async function getConversation(id: string): Promise<Conversation | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('conversations')
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
 * Create a new conversation
 */
export async function createConversation(input: CreateConversationInput): Promise<Conversation> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: user.id,
      project_id: input.project_id || null,
      title: input.title || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a conversation
 */
export async function updateConversation(
  id: string,
  input: { title?: string; project_id?: string }
): Promise<Conversation> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('conversations')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a conversation
 */
export async function deleteConversation(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Get messages for a conversation
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Verify user owns this conversation
  const conversation = await getConversation(conversationId);
  if (!conversation) throw new Error('Conversation not found');

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Create a new message in a conversation
 */
export async function createMessage(input: CreateMessageInput): Promise<Message> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Verify user owns this conversation
  const conversation = await getConversation(input.conversation_id);
  if (!conversation) throw new Error('Conversation not found');

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: input.conversation_id,
      role: input.role,
      content: input.content,
      metadata: input.metadata || {},
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
