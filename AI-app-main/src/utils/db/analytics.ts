import { createClient } from '@/utils/supabase/server';

export interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_type: string;
  event_data: Record<string, any>;
  created_at: string;
}

export interface CreateAnalyticsEventInput {
  event_type: string;
  event_data?: Record<string, any>;
}

/**
 * Track an analytics event
 */
export async function trackEvent(input: CreateAnalyticsEventInput): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return; // Don't track for unauthenticated users

  const { error } = await supabase
    .from('analytics')
    .insert({
      user_id: user.id,
      event_type: input.event_type,
      event_data: input.event_data || {},
    });

  if (error) {
    console.error('Failed to track analytics event:', error);
  }
}

/**
 * Get analytics events for the current user
 */
export async function getAnalyticsEvents(
  limit: number = 100,
  eventType?: string
): Promise<AnalyticsEvent[]> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  let query = supabase
    .from('analytics')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (eventType) {
    query = query.eq('event_type', eventType);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

/**
 * Get analytics summary for the current user
 */
export async function getAnalyticsSummary(): Promise<{
  total_events: number;
  events_by_type: Record<string, number>;
  recent_events: AnalyticsEvent[];
}> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const events = await getAnalyticsEvents(1000);

  const eventsByType: Record<string, number> = {};
  events.forEach((event) => {
    eventsByType[event.event_type] = (eventsByType[event.event_type] || 0) + 1;
  });

  return {
    total_events: events.length,
    events_by_type: eventsByType,
    recent_events: events.slice(0, 10),
  };
}
