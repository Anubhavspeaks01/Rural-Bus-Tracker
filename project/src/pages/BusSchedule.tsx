import React, { useState } from 'react';
import { Search, Clock, MapPin, Filter, Calendar, ChevronDown, Loader, AlertCircle } from 'lucide-react';
import { useSchedules, ScheduleWithRoute } from '../hooks/useSchedules';

const BusSchedule: React.FC = () => {
  const { schedules, loading, error } = useSchedules();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique routes for filter
  const routes = Array.from(new Set(schedules.map(schedule => schedule.route.route_number)));
  
  // Time periods for filtering
  const timePeriods = [
    { value: 'all', label: 'All Day' },
    { value: 'morning', label: 'Morning (6AM-12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM-6PM)' },
    { value: 'evening', label: 'Evening (6PM-10PM)' }
  ];

  const filterByTime = (time: string, period: string) => {
    if (period === 'all') return true;
    
    const hour = parseInt(time.split(':')[0]);
    switch (period) {
      case 'morning': return hour >= 6 && hour < 12;
      case 'afternoon': return hour >= 12 && hour < 18;
      case 'evening': return hour >= 18 && hour <= 22;
      default: return true;
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = 
      schedule.route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.route.route_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRoute = selectedRoute === 'all' || schedule.route.route_number === selectedRoute;
    const matchesTime = filterByTime(schedule.departure_time, selectedTime);
    
    return matchesSearch && matchesRoute && matchesTime;
  });

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading schedule data...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bus Schedule</h1>
          <p className="text-lg text-gray-600">Find departure times and plan your journey</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by route or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Route Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Route
                  </label>
                  <select
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Routes</option>
                    {routes.map(route => (
                      <option key={route} value={route}>Route {route}</option>
                    ))}
                  </select>
                </div>

                {/* Time Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {timePeriods.map(period => (
                      <option key={period.value} value={period.value}>
                        {period.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Schedule Results */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Schedule Results ({filteredSchedules.length} found)
            </h2>
          </div>

          {filteredSchedules.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredSchedules.map((schedule) => (
                <div key={schedule.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          Route {schedule.route.route_number}
                        </span>
                        {getStatusBadge(schedule.is_active)}
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex items-center text-gray-900">
                          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="font-medium">{schedule.route.name}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{schedule.route.description}</p>
                      </div>

                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Frequency:</span> {schedule.frequency}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Days:</span> {schedule.days_of_week.join(', ')}
                      </div>
                    </div>

                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <div className="flex items-center space-x-4 text-center">
                        <div className="bg-green-50 px-4 py-3 rounded-lg">
                          <div className="text-sm text-green-600 font-medium mb-1">Departure</div>
                          <div className="text-lg font-bold text-green-800">
                            {formatTime(schedule.departure_time)}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-400">
                          <Clock className="h-5 w-5" />
                        </div>
                        
                        <div className="bg-blue-50 px-4 py-3 rounded-lg">
                          <div className="text-sm text-blue-600 font-medium mb-1">Arrival</div>
                          <div className="text-lg font-bold text-blue-800">
                            {formatTime(schedule.arrival_time)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Planning Your Trip?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 mt-0.5 text-blue-600" />
              <span>Arrive at your stop 5 minutes before departure time</span>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 mt-0.5 text-blue-600" />
              <span>Check the live tracker for real-time updates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusSchedule;