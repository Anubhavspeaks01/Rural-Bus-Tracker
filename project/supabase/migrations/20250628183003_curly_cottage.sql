/*
  # Seed Sample Data for Rural Bus Tracking System

  1. Sample Data
    - Insert sample routes
    - Insert sample bus stops
    - Insert sample buses
    - Insert sample schedules
    - Insert route-stop relationships

  This provides realistic test data for the rural bus tracking application.
*/

-- Insert sample routes
INSERT INTO routes (route_number, name, description, is_active) VALUES
('R101', 'Village to City Center', 'Main route connecting rural villages to the city center', true),
('R102', 'Village to Market Square', 'Route serving the weekly market and shopping areas', true),
('R103', 'Village to Hospital', 'Medical route connecting villages to the regional hospital', true),
('R104', 'Village to School District', 'School route for students (weekdays only)', false);

-- Insert sample bus stops
INSERT INTO bus_stops (name, latitude, longitude, address, is_active) VALUES
('Village Center', 40.7128, -74.0060, '123 Main St, Village Center', true),
('Oak Tree Corner', 40.7200, -74.0100, '456 Oak Ave, Village', true),
('Pine Hill Stop', 40.7300, -74.0200, '789 Pine Rd, Pine Hill', true),
('City Center Terminal', 40.7589, -73.9851, '100 Central Plaza, City Center', true),
('Market Square', 40.7614, -73.9776, '200 Market St, Downtown', true),
('Regional Hospital', 40.7505, -73.9934, '300 Health Blvd, Medical District', true),
('School District Hub', 40.7400, -74.0150, '400 Education Way, School District', true),
('Park Avenue', 40.7350, -74.0080, '500 Park Ave, Midtown', true);

-- Insert sample buses
INSERT INTO buses (bus_number, route_id, current_location, latitude, longitude, is_active, last_updated) VALUES
('BUS001', (SELECT id FROM routes WHERE route_number = 'R101'), 'Main Street', 40.7128, -74.0060, true, now()),
('BUS002', (SELECT id FROM routes WHERE route_number = 'R102'), 'Park Avenue', 40.7589, -73.9851, true, now()),
('BUS003', (SELECT id FROM routes WHERE route_number = 'R103'), 'Church Road', 40.7614, -73.9776, true, now()),
('BUS004', (SELECT id FROM routes WHERE route_number = 'R104'), 'Elm Street', 40.7505, -73.9934, false, now());

-- Insert sample schedules
INSERT INTO schedules (route_id, departure_time, arrival_time, frequency, days_of_week, is_active) VALUES
((SELECT id FROM routes WHERE route_number = 'R101'), '07:00', '08:30', 'Every 30 mins', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'], true),
((SELECT id FROM routes WHERE route_number = 'R101'), '07:30', '09:00', 'Every 30 mins', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'], true),
((SELECT id FROM routes WHERE route_number = 'R102'), '08:00', '09:15', 'Every 45 mins', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'], true),
((SELECT id FROM routes WHERE route_number = 'R103'), '06:30', '07:45', 'Every hour', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], true),
((SELECT id FROM routes WHERE route_number = 'R104'), '07:15', '08:00', 'School days only', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], false);

-- Insert route-stop relationships for R101 (Village to City Center)
INSERT INTO route_stops (route_id, stop_id, stop_order, estimated_time) VALUES
((SELECT id FROM routes WHERE route_number = 'R101'), (SELECT id FROM bus_stops WHERE name = 'Village Center'), 1, '0 minutes'),
((SELECT id FROM routes WHERE route_number = 'R101'), (SELECT id FROM bus_stops WHERE name = 'Oak Tree Corner'), 2, '10 minutes'),
((SELECT id FROM routes WHERE route_number = 'R101'), (SELECT id FROM bus_stops WHERE name = 'Pine Hill Stop'), 3, '25 minutes'),
((SELECT id FROM routes WHERE route_number = 'R101'), (SELECT id FROM bus_stops WHERE name = 'Park Avenue'), 4, '60 minutes'),
((SELECT id FROM routes WHERE route_number = 'R101'), (SELECT id FROM bus_stops WHERE name = 'City Center Terminal'), 5, '90 minutes');

-- Insert route-stop relationships for R102 (Village to Market Square)
INSERT INTO route_stops (route_id, stop_id, stop_order, estimated_time) VALUES
((SELECT id FROM routes WHERE route_number = 'R102'), (SELECT id FROM bus_stops WHERE name = 'Village Center'), 1, '0 minutes'),
((SELECT id FROM routes WHERE route_number = 'R102'), (SELECT id FROM bus_stops WHERE name = 'Oak Tree Corner'), 2, '10 minutes'),
((SELECT id FROM routes WHERE route_number = 'R102'), (SELECT id FROM bus_stops WHERE name = 'Park Avenue'), 3, '45 minutes'),
((SELECT id FROM routes WHERE route_number = 'R102'), (SELECT id FROM bus_stops WHERE name = 'Market Square'), 4, '75 minutes');

-- Insert route-stop relationships for R103 (Village to Hospital)
INSERT INTO route_stops (route_id, stop_id, stop_order, estimated_time) VALUES
((SELECT id FROM routes WHERE route_number = 'R103'), (SELECT id FROM bus_stops WHERE name = 'Village Center'), 1, '0 minutes'),
((SELECT id FROM routes WHERE route_number = 'R103'), (SELECT id FROM bus_stops WHERE name = 'Pine Hill Stop'), 2, '15 minutes'),
((SELECT id FROM routes WHERE route_number = 'R103'), (SELECT id FROM bus_stops WHERE name = 'Park Avenue'), 3, '45 minutes'),
((SELECT id FROM routes WHERE route_number = 'R103'), (SELECT id FROM bus_stops WHERE name = 'Regional Hospital'), 4, '75 minutes');

-- Insert route-stop relationships for R104 (Village to School District)
INSERT INTO route_stops (route_id, stop_id, stop_order, estimated_time) VALUES
((SELECT id FROM routes WHERE route_number = 'R104'), (SELECT id FROM bus_stops WHERE name = 'Village Center'), 1, '0 minutes'),
((SELECT id FROM routes WHERE route_number = 'R104'), (SELECT id FROM bus_stops WHERE name = 'Oak Tree Corner'), 2, '10 minutes'),
((SELECT id FROM routes WHERE route_number = 'R104'), (SELECT id FROM bus_stops WHERE name = 'School District Hub'), 3, '45 minutes');