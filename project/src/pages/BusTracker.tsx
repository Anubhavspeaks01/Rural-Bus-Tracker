import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Navigation, AlertCircle, Loader } from 'lucide-react';
import { useBuses, BusWithRoute } from '../hooks/useBuses';
import BusLocationSimulator from '../components/BusLocationSimulator';

const BusTracker: React.FC = () => {
  const { buses, loading, error } = useBuses();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBus, setSelectedBus] = useState<BusWithRoute | null>(null);

  const filteredBuses = buses.filter(bus =>
    bus.route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.route.route_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.current_location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate ETA based on last_updated (mock calculation)
  const calculateETA = (lastUpdated: string) => {
    const now = new Date();
    const updated = new Date(lastUpdated);
    const diffMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));
    return Math.max(0, 15 - diffMinutes); // Mock ETA calculation
  };

  const getStatusColor = (eta: number, isActive: boolean) => {
    if (!isActive) return 'bg-gray-500';
    if (eta <= 5) return 'bg-red-500';
    if (eta <= 15) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = (eta: number, isActive: boolean) => {
    if (!isActive) return 'Not Active';
    if (eta === 0) return 'Arriving Now';
    if (eta === 1) return '1 min away';
    return `${eta} mins away`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading bus data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Bus Tracker</h1>
          <p className="text-lg text-gray-600">Track your bus in real-time and never miss your ride</p>
        </div>

        {/* Location Simulator for Demo */}
        <BusLocationSimulator />

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by destination or route number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bus List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Buses</h2>
              <div className="space-y-3">
                {filteredBuses.length === 0 ? (
                  <div className="text-center py-8">
                    <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No buses found</p>
                  </div>
                ) : (
                  filteredBuses.map((bus) => {
                    const eta = calculateETA(bus.last_updated);
                    return (
                      <div
                        key={bus.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedBus?.id === bus.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedBus(bus)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(eta, bus.is_active)}`} />
                            <span className="font-semibold text-gray-900">Route {bus.route.route_number}</span>
                          </div>
                          <span className="text-sm text-gray-500">{getStatusText(eta, bus.is_active)}</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          To: {bus.route.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          <Navigation className="h-4 w-4 inline mr-1" />
                          At: {bus.current_location}
                        </div>
                        {bus.speed && (
                          <div className="text-sm text-gray-600 mt-1">
                            Speed: {bus.speed} km/h
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 h-96">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Live Map</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Real-time updates</span>
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-lg h-full flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Map</h3>
                  <p className="text-gray-600 max-w-xs">
                    Real-time bus locations from Supabase database
                  </p>
                </div>

                {/* Real Bus Markers */}
                {filteredBuses.filter(bus => bus.is_active).map((bus, index) => (
                  <div
                    key={bus.id}
                    className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transform transition-all hover:scale-110 ${
                      selectedBus?.id === bus.id ? 'bg-blue-600' : 'bg-red-500'
                    }`}
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 10}%`
                    }}
                    onClick={() => setSelectedBus(bus)}
                    title={`Route ${bus.route.route_number} - ${bus.route.name}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Bus Details */}
        {selectedBus && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bus Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Route Information</h3>
                <p className="text-blue-800">Route {selectedBus.route.route_number}</p>
                <p className="text-blue-600">{selectedBus.route.name}</p>
                <p className="text-blue-500 text-sm mt-1">{selectedBus.route.description}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Current Status</h3>
                <p className="text-green-800">Location: {selectedBus.current_location}</p>
                <p className="text-green-600">ETA: {getStatusText(calculateETA(selectedBus.last_updated), selectedBus.is_active)}</p>
                <p className="text-green-500 text-sm mt-1">Bus: {selectedBus.bus_number}</p>
                {selectedBus.speed && (
                  <p className="text-green-500 text-sm">Speed: {selectedBus.speed} km/h</p>
                )}
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">Service Status</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(calculateETA(selectedBus.last_updated), selectedBus.is_active)}`} />
                  <span className="text-orange-800">
                    {selectedBus.is_active ? 'Active Service' : 'Not In Service'}
                  </span>
                </div>
                <p className="text-orange-500 text-sm mt-1">
                  Last updated: {new Date(selectedBus.last_updated).toLocaleTimeString()}
                </p>
                <p className="text-orange-500 text-sm">
                  Coordinates: {selectedBus.latitude?.toFixed(4)}, {selectedBus.longitude?.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Implementation Guide */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">🚌 Real-World Implementation Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
            <div>
              <h4 className="font-medium mb-2">Hardware Options:</h4>
              <ul className="space-y-1 text-yellow-700">
                <li>• GPS tracking devices (Teltonika, Queclink)</li>
                <li>• Mobile apps on driver phones</li>
                <li>• OBD-II port devices</li>
                <li>• Raspberry Pi + GPS modules</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Integration Steps:</h4>
              <ul className="space-y-1 text-yellow-700">
                <li>• Install GPS devices on buses</li>
                <li>• Configure cellular/WiFi connectivity</li>
                <li>• Set up API keys for each bus</li>
                <li>• Test location updates via edge function</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusTracker;