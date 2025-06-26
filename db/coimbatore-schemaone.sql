-- Add Coimbatore-specific fields to the locations table
ALTER TABLE locations ADD COLUMN area VARCHAR(100) AFTER type;
ALTER TABLE locations ADD INDEX idx_locations_area (area);

-- Create a table for Coimbatore areas
CREATE TABLE IF NOT EXISTS coimbatore_areas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  lat DECIMAL(10,8) NOT NULL,
  lng DECIMAL(11,8) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert common areas in Coimbatore
INSERT INTO coimbatore_areas (name, lat, lng, description) VALUES
('Peelamedu', 11.0279, 77.0254, 'Commercial and residential area near the airport'),
('R.S. Puram', 11.0069, 76.9498, 'Upscale residential area with shopping streets'),
('Gandhipuram', 11.0175, 76.9674, 'Central business district with bus terminal'),
('Singanallur', 11.0070, 77.0421, 'Industrial and residential area'),
('Saibaba Colony', 11.0233, 76.9342, 'Residential area in the northwest'),
('Ganapathy', 11.0400, 76.9900, 'Northern residential suburb'),
('Ukkadam', 10.9925, 76.9608, 'Southern commercial hub with bus terminal'),
('Ramanathapuram', 11.0023, 77.0101, 'Eastern residential area'),
('Podanur', 10.9790, 76.9700, 'Southern suburb with railway junction'),
('Thudiyalur', 11.0700, 76.9400, 'Northern suburb');

-- Create a table for Coimbatore landmarks
CREATE TABLE IF NOT EXISTS coimbatore_landmarks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  lat DECIMAL(10,8) NOT NULL,
  lng DECIMAL(11,8) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert major landmarks in Coimbatore
INSERT INTO coimbatore_landmarks (name, lat, lng, type, description) VALUES
('Coimbatore International Airport', 11.0300, 77.0430, 'airport', 'International airport serving Coimbatore'),
('Coimbatore Junction Railway Station', 11.0017, 76.9650, 'railway_station', 'Main railway station in Coimbatore'),
('Brookefields Mall', 11.0100, 76.9900, 'mall', 'Major shopping mall on Brookebond Road'),
('Prozone Mall', 11.0700, 76.9900, 'mall', 'Large shopping mall in Saravanampatti'),
('Coimbatore Medical College Hospital', 11.0200, 76.9800, 'hospital', 'Government medical college and hospital'),
('PSG Hospitals', 11.0300, 77.0300, 'hospital', 'Multi-specialty hospital in Peelamedu'),
('Kovai Pazhamudir Nilayam', 11.0200, 76.9700, 'supermarket', 'Popular fruits and vegetables supermarket chain');

-- Create a table for Coimbatore roads
CREATE TABLE IF NOT EXISTS coimbatore_roads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  start_lat DECIMAL(10,8) NOT NULL,
  start_lng DECIMAL(11,8) NOT NULL,
  end_lat DECIMAL(10,8) NOT NULL,
  end_lng DECIMAL(11,8) NOT NULL,
  road_type ENUM('highway', 'main_road', 'street') NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert major roads in Coimbatore
INSERT INTO coimbatore_roads (name, start_lat, start_lng, end_lat, end_lng, road_type, description) VALUES
('Avinashi Road', 11.0168, 76.9558, 11.0300, 77.0430, 'highway', 'Major highway connecting city center to airport'),
('Trichy Road', 11.0168, 76.9558, 10.9790, 77.0100, 'highway', 'Highway connecting to Trichy'),
('Mettupalayam Road', 11.0168, 76.9558, 11.0700, 76.9400, 'highway', 'Highway connecting to Mettupalayam'),
('Sathyamangalam Road', 11.0168, 76.9558, 11.0300, 77.0800, 'highway', 'Highway connecting to Sathyamangalam'),
('Pollachi Road', 11.0168, 76.9558, 10.9500, 76.9300, 'highway', 'Highway connecting to Pollachi'),
('DB Road', 11.0069, 76.9498, 11.0069, 76.9598, 'main_road', 'Commercial street in R.S. Puram'),
('100 Feet Road', 11.0175, 76.9674, 11.0175, 76.9774, 'main_road', 'Major road in Gandhipuram');

-- Add traffic data table for Coimbatore
CREATE TABLE IF NOT EXISTS coimbatore_traffic_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  road_id INT NOT NULL,
  day_of_week TINYINT NOT NULL, -- 0 = Sunday, 1 = Monday, etc.
  hour_of_day TINYINT NOT NULL, -- 0-23
  traffic_level ENUM('low', 'moderate', 'high', 'severe') NOT NULL,
  avg_speed DECIMAL(5,2), -- in km/h
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (road_id) REFERENCES coimbatore_roads(id) ON DELETE CASCADE
);

-- Sample traffic data for Avinashi Road
INSERT INTO coimbatore_traffic_data (road_id, day_of_week, hour_of_day, traffic_level, avg_speed) VALUES
(1, 1, 8, 'high', 15.5), -- Monday 8 AM
(1, 1, 9, 'severe', 10.2), -- Monday 9 AM
(1, 1, 18, 'high', 18.3), -- Monday 6 PM
(1, 2, 8, 'high', 16.1), -- Tuesday 8 AM
(1, 6, 11, 'moderate', 25.7); -- Saturday 11 AM
