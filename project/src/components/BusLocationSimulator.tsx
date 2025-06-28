import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Bus {
  id: string;
  bus_number: string;
  route: {
    route_number: string;
    name: string;
  };
}

const BusLocationSimulator: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    const { data } = await supabase
      .from('buses')
      .select(`
        id,
        bus_number,
        route:routes(
          route_number,
          name
        )
      `)
      .eq('is_active', true);
    
    setBuses(data || []);
  };

  const simulateLocationUpdate = async (bus: Bus) => {
    // Generate random coordinates around a central point (simulating movement)
    const baseLatitude = 40.7128 + (Math.random() - 0.5) * 0.1;
    const baseLongitude = -74.0060 + (Math.random() - 0.5) * 0.1;
    const speed = Math.random() * 60 + 20; // 20-80 km/h
    const heading = Math.random() * 360; // 0-360 degrees

    try {
      // Call our edge function to update location
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-bus-location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          bus_id: bus.id,
          latitude: baseLatitude,
          longitude: baseLongitude,
          speed: speed,
          heading: heading,
          current_location: `Simulated Location ${Math.floor(Math.random() * 100)}`,
          api_key: 'simulation_key' // In real implementation, each bus would have its own API key
        })
      });

      if (!response.ok) {
        console.error('Failed to update location for bus:', bus.bus_number);
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const startSimulation = () => {
    setIsSimulating(true);
    const interval = setInterval(() => {
      buses.forEach(bus => {
        simulateLocationUpdate(bus);
      });
    }, 5000); // Update every 5 seconds
    setSimulationInterval(interval);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
  };

  const resetLocations = async () => {
    // Reset all buses to their original positions
    for (const bus of buses) {
      await supabase
        .from('buses')
        .update({
          latitude: 40.7128,
          longitude: -74.0060,
          current_location: 'Village Center',
          speed: null,
          heading: null,
          last_updated: new Date().toISOString()
        })
        .eq('id', bus.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Location Simulator</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={isSimulating ? stopSimulation : startSimulation}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isSimulating
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isSimulating ? 'Stop' : 'Start'} Simulation</span>
          </button>
          <button
            onClick={resetLocations}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        <p className="mb-2">
          <strong>Demo Mode:</strong> This simulates real bus GPS updates for testing.
        </p>
        <p>
          <strong>Active Buses:</strong> {buses.length} buses will move randomly every 5 seconds when simulation is running.
        </p>
      </div>
      
      {isSimulating && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            🟢 Simulation running - Bus locations are being updated in real-time
          </p>
        </div>
      )}
    </div>
  );
};

export default BusLocationSimulator;