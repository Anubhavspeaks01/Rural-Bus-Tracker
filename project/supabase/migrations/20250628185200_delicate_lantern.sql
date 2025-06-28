/*
  # Add API Keys for Bus Location Updates

  1. New Tables
    - `bus_api_keys`
      - `id` (uuid, primary key)
      - `bus_id` (uuid, foreign key to buses)
      - `api_key` (text, unique)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `last_used` (timestamp)

  2. Security
    - Enable RLS on `bus_api_keys` table
    - Only service role can access API keys

  3. Sample Data
    - Generate API keys for existing buses
*/

-- Create bus_api_keys table
CREATE TABLE IF NOT EXISTS bus_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id uuid REFERENCES buses(id) ON DELETE CASCADE,
  api_key text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_used timestamptz,
  UNIQUE(bus_id)
);

-- Enable Row Level Security
ALTER TABLE bus_api_keys ENABLE ROW LEVEL SECURITY;

-- Only service role can access API keys (for security)
CREATE POLICY "Service role can manage API keys"
  ON bus_api_keys
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_bus_api_keys_api_key ON bus_api_keys(api_key);
CREATE INDEX IF NOT EXISTS idx_bus_api_keys_bus_id ON bus_api_keys(bus_id);

-- Generate API keys for existing buses
INSERT INTO bus_api_keys (bus_id, api_key)
SELECT 
  id,
  'bus_' || encode(gen_random_bytes(16), 'hex')
FROM buses
WHERE id NOT IN (SELECT bus_id FROM bus_api_keys WHERE bus_id IS NOT NULL);

-- Add speed and heading columns to buses table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'buses' AND column_name = 'speed'
  ) THEN
    ALTER TABLE buses ADD COLUMN speed decimal(5,2);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'buses' AND column_name = 'heading'
  ) THEN
    ALTER TABLE buses ADD COLUMN heading decimal(5,2);
  END IF;
END $$;