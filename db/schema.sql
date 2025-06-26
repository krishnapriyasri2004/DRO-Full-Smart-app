-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS route_optimizer;
USE route_optimizer;

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  lat DECIMAL(10,8) NOT NULL,
  lng DECIMAL(11,8) NOT NULL,
  type ENUM('depot', 'delivery', 'pickup') NOT NULL,
  area VARCHAR(100),
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_locations_type (type),
  INDEX idx_locations_area (area)
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL,
  capacity DECIMAL(10,2) NOT NULL,
  driver_id INT,
  status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cargo table
CREATE TABLE IF NOT EXISTS cargo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  dimensions VARCHAR(50),
  status ENUM('pending', 'in_transit', 'delivered', 'delayed') DEFAULT 'pending',
  priority ENUM('urgent', 'high', 'medium', 'low') DEFAULT 'medium',
  delivery_location_id INT,
  pickup_location_id INT,
  vehicle_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (delivery_location_id) REFERENCES locations(id) ON DELETE SET NULL,
  FOREIGN KEY (pickup_location_id) REFERENCES locations(id) ON DELETE SET NULL,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
  INDEX idx_cargo_status (status),
  INDEX idx_cargo_priority (priority)
);

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  algorithm VARCHAR(50) NOT NULL,
  vehicle_id INT,
  starting_location_id INT,
  status ENUM('planned', 'in_progress', 'completed', 'cancelled') DEFAULT 'planned',
  optimize_for_traffic BOOLEAN DEFAULT TRUE,
  avoid_tolls BOOLEAN DEFAULT FALSE,
  prefer_highways BOOLEAN DEFAULT TRUE,
  total_distance DECIMAL(10,2),
  estimated_duration INT, -- in minutes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
  FOREIGN KEY (starting_location_id) REFERENCES locations(id) ON DELETE SET NULL
);

-- Route points table (for delivery points in a route)
CREATE TABLE IF NOT EXISTS route_points (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route_id INT NOT NULL,
  location_id INT NOT NULL,
  sequence_number INT NOT NULL,
  estimated_arrival_time DATETIME,
  actual_arrival_time DATETIME,
  status ENUM('pending', 'in_transit', 'delivered', 'skipped') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
  UNIQUE KEY unique_route_sequence (route_id, sequence_number)
);

-- Coimbatore-specific tables
CREATE TABLE IF NOT EXISTS coimbatore_areas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  lat DECIMAL(10,8) NOT NULL,
  lng DECIMAL(11,8) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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

-- Insert sample data for Coimbatore areas
INSERT INTO coimbatore_areas (name, lat, lng, description) 
SELECT * FROM (
  SELECT 'Peelamedu', 11.0279, 77.0254, 'Commercial and residential area near the airport' UNION ALL
  SELECT 'R.S. Puram', 11.0069, 76.9498, 'Upscale residential area with shopping streets' UNION ALL
  SELECT 'Gandhipuram', 11.0175, 76.9674, 'Central business district with bus terminal' UNION ALL
  SELECT 'Singanallur', 11.0070, 77.0421, 'Industrial and residential area' UNION ALL
  SELECT 'Saibaba Colony', 11.0233, 76.9342, 'Residential area in the northwest'
) AS tmp
WHERE NOT EXISTS (
  SELECT name FROM coimbatore_areas WHERE name = tmp.name
) LIMIT 5;

-- Insert sample vehicles
INSERT INTO vehicles (name, type, capacity, status)
SELECT * FROM (
  SELECT 'Van-01', 'van', 500, 'active' UNION ALL
  SELECT 'Truck-02', 'truck', 2000, 'active' UNION ALL
  SELECT 'Truck-03', 'truck', 1500, 'active' UNION ALL
  SELECT 'Van-04', 'van', 600, 'maintenance'
) AS tmp
WHERE NOT EXISTS (
  SELECT name FROM vehicles WHERE name = tmp.name
) LIMIT 4;
