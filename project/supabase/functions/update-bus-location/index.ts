import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface LocationUpdate {
  bus_id: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  current_location?: string;
  api_key: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body: LocationUpdate = await req.json();
    
    // Validate API key (you should store valid API keys in your database)
    const { data: validApiKey } = await supabase
      .from('bus_api_keys')
      .select('bus_id')
      .eq('api_key', body.api_key)
      .eq('is_active', true)
      .single();

    if (!validApiKey || validApiKey.bus_id !== body.bus_id) {
      return new Response('Unauthorized', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    // Reverse geocoding to get readable location (optional)
    let readableLocation = body.current_location || 'Unknown Location';
    
    // Update bus location in database
    const { data, error } = await supabase
      .from('buses')
      .update({
        latitude: body.latitude,
        longitude: body.longitude,
        current_location: readableLocation,
        last_updated: new Date().toISOString(),
        speed: body.speed || null,
        heading: body.heading || null
      })
      .eq('id', body.bus_id)
      .select();

    if (error) {
      console.error('Database error:', error);
      return new Response('Database error', { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    // Broadcast real-time update to all connected clients
    await supabase
      .channel('bus_locations')
      .send({
        type: 'broadcast',
        event: 'location_update',
        payload: {
          bus_id: body.bus_id,
          latitude: body.latitude,
          longitude: body.longitude,
          current_location: readableLocation,
          last_updated: new Date().toISOString()
        }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Location updated successfully',
        data: data[0]
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});