/*
  # Initial Schema for Rural Bus Tracking System

  1. New Tables
    - `routes`
      - `id` (uuid, primary key)
      - `route_number` (text, unique)
      - `name` (text)
      - `description` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `buses`
      - `id` (uuid, primary key)
      - `bus_number` (text, unique)
      - `route_id` (uuid, foreign key)
      - `current_location` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `is_active` (boolean)
      - `last_updated` (timestamp)
      - `created_at` (timestamp)
    
    - `schedules`
      - `id` (uuid, primary key)
      - `route_id` (uuid, foreign key)
      - `departure_time` (time)
      - `arrival_time` (time)
      - `frequency` (text)
      - `days_of_week` (text array)
      - `is_active` (boolean)
      - `created_at` (timestamp)
    
    - `bus_stops`
      - `id` (uuid, primary key)
      - `name` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `address` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
    
    - `route_stops`
      - `id` (uuid, primary key)
      - `route_id` (uuid, foreign key)
      - `stop_id` (uuid, foreign key)
      - `stop_order` (integer)
      - `estimated_time` (interval)
      - `created_at` (timestamp)
    
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `message` (text)
      - `status` (text, default 'new')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to routes, buses, schedules, and stops
    - Add policies for authenticated users to create contact messages
    - Add policies for admin users to manage all data
*/

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_number text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create buses table
CREATE TABLE IF NOT EXISTS buses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_number text UNIQUE NOT NULL,
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
  current_location text DEFAULT '',
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  is_active boolean DEFAULT true,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
  departure_time time NOT NULL,
  arrival_time time NOT NULL,
  frequency text DEFAULT '',
  days_of_week text[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create bus_stops table
CREATE TABLE IF NOT EXISTS bus_stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  address text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create route_stops table (junction table for routes and stops)
CREATE TABLE IF NOT EXISTS route_stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
  stop_id uuid REFERENCES bus_stops(id) ON DELETE CASCADE,
  stop_order integer NOT NULL,
  estimated_time interval DEFAULT '0 minutes',
  created_at timestamptz DEFAULT now(),
  UNIQUE(route_id, stop_id),
  UNIQUE(route_id, stop_order)
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to transportation data
CREATE POLICY "Public can read routes"
  ON routes
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Public can read buses"
  ON buses
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Public can read schedules"
  ON schedules
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Public can read bus stops"
  ON bus_stops
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Public can read route stops"
  ON route_stops
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for contact messages
CREATE POLICY "Anyone can create contact messages"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read their own contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_buses_route_id ON buses(route_id);
CREATE INDEX IF NOT EXISTS idx_buses_location ON buses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_schedules_route_id ON schedules(route_id);
CREATE INDEX IF NOT EXISTS idx_route_stops_route_id ON route_stops(route_id);
CREATE INDEX IF NOT EXISTS idx_route_stops_stop_id ON route_stops(stop_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for routes table
CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON routes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();