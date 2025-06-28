import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ScheduleWithRoute {
  id: string;
  route_id: string;
  departure_time: string;
  arrival_time: string;
  frequency: string;
  days_of_week: string[];
  is_active: boolean;
  created_at: string;
  route: {
    route_number: string;
    name: string;
    description: string;
  };
}

export const useSchedules = () => {
  const [schedules, setSchedules] = useState<ScheduleWithRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schedules')
        .select(`
          *,
          route:routes(
            route_number,
            name,
            description
          )
        `)
        .eq('is_active', true)
        .order('departure_time');

      if (error) throw error;

      setSchedules(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();

    // Set up real-time subscription
    const subscription = supabase
      .channel('schedules_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'schedules'
        },
        () => {
          fetchSchedules();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { schedules, loading, error, refetch: fetchSchedules };
};