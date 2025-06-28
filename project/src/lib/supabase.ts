import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      routes: {
        Row: {
          id: string;
          route_number: string;
          name: string;
          description: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          route_number: string;
          name: string;
          description?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          route_number?: string;
          name?: string;
          description?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      buses: {
        Row: {
          id: string;
          bus_number: string;
          route_id: string;
          current_location: string;
          latitude: number;
          longitude: number;
          is_active: boolean;
          last_updated: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          bus_number: string;
          route_id: string;
          current_location?: string;
          latitude?: number;
          longitude?: number;
          is_active?: boolean;
          last_updated?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          bus_number?: string;
          route_id?: string;
          current_location?: string;
          latitude?: number;
          longitude?: number;
          is_active?: boolean;
          last_updated?: string;
          created_at?: string;
        };
      };
      schedules: {
        Row: {
          id: string;
          route_id: string;
          departure_time: string;
          arrival_time: string;
          frequency: string;
          days_of_week: string[];
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          route_id: string;
          departure_time: string;
          arrival_time: string;
          frequency?: string;
          days_of_week?: string[];
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          route_id?: string;
          departure_time?: string;
          arrival_time?: string;
          frequency?: string;
          days_of_week?: string[];
          is_active?: boolean;
          created_at?: string;
        };
      };
      bus_stops: {
        Row: {
          id: string;
          name: string;
          latitude: number;
          longitude: number;
          address: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          latitude: number;
          longitude: number;
          address?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          latitude?: number;
          longitude?: number;
          address?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          message: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string;
          message: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          message?: string;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
}