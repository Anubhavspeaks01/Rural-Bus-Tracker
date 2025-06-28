import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface BusWithRoute {
  id: string;
  bus_number: string;
  route_id: string;
  current_location: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  last_updated: string;
  route: {
    route_number: string;
    name: string;
    description: string;
  };
}

export const useBuses = () => {
  const [buses, setBuses] = useState<BusWithRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('buses')
        .select(`
          *,
          route:routes(
            route_number,
            name,
            description
          )
        `)
        .eq('is_active', true);

      if (error) throw error;

      setBuses(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();

    // Set up real-time subscription
    const subscription = supabase
      .channel('buses_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'buses'
        },
        () => {
          fetchBuses();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { buses, loading, error, refetch: fetchBuses };
};