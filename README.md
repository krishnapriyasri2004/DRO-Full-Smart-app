```markdown
# Real-Time Delivery Route Optimization System

A comprehensive system for optimizing delivery routes, managing cargo, and tracking deliveries in real-time, with special features for the Coimbatore region.

🌐 **Live Demo**: [https://dro-full-smart-app-production.up.railway.app](https://dro-full-smart-app-production.up.railway.app)  
📧 **Email**: krishnapriyasri04@gmail.com  
📞 **Phone**: +91 90475 47774

---

## Features

- **Route Optimization**: Multiple algorithms for efficient route planning
- **Cargo Management**: Knapsack algorithm for optimal cargo loading
- **Real-Time Tracking**: Monitor deliveries and update statuses
- **Coimbatore Mapping**: Specialized features for the Coimbatore region
- **Analytics Dashboard**: Performance metrics and reporting

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+
- Docker (optional, for containerized deployment)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```

DB\_HOST=localhost
DB\_PORT=your\_port
DB\_USER=your\_mysql\_username
DB\_PASSWORD=your\_mysql\_password
DB\_NAME=route\_optimizer
NEXT\_PUBLIC\_API\_URL=[http://localhost/api](http://localhost/api)

````

---

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/krishnapriyasri2004/DRO-Full-Smart-app.git
   cd delivery-route-optimizer
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   ```bash
   mysql -u your_mysql_username -p < db/schema.sql
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Docker Setup

1. Build the Docker image:

   ```bash
   docker build -t delivery-route-optimizer .
   ```

2. Run the container:

   ```bash
   docker run -p 3000:3000 --env-file .env delivery-route-optimizer
   ```

---

## Usage Guide

### Route Management

1. Navigate to the Routes section
2. Click "Create New Route"
3. Enter route details and starting point
4. Add delivery points
5. Select optimization algorithm
6. Generate and review the route
7. Assign to a vehicle and driver

### Cargo Management

1. Navigate to the Cargo section
2. Add cargo items with weight, dimensions, and priority
3. Use the "Optimize Cargo" feature to run the knapsack algorithm
4. Review optimization results
5. Assign cargo to vehicles

### Coimbatore-Specific Features

1. Select "Coimbatore" in the region dropdown
2. Use pre-loaded landmarks and areas
3. Enable traffic data integration
4. Use Tamil language support for local addressing

---

## Algorithms

### Knapsack Algorithm

Used for cargo loading optimization:

* Maximizes the value (priority) of cargo within weight constraints
* Ensures high-priority items are loaded first
* Optimizes vehicle capacity utilization

### Greedy Algorithm

Used for route optimization:

* Selects the nearest unvisited location at each step
* Fast computation, suitable for real-time updates
* Good for scenarios with many delivery points

### Dynamic Programming

Used for complex route optimization:

* Finds the globally optimal solution
* More computationally intensive than greedy approach
* Best for scenarios with fewer delivery points

---

## Database Schema

The system uses the following main tables:

* `locations`: Stores all delivery points, depots, and pickup locations
* `vehicles`: Information about delivery vehicles
* `cargo`: Details of cargo items
* `routes`: Route information and settings
* `route_points`: Individual points in a route
* `coimbatore_areas`: Coimbatore-specific area information
* `coimbatore_landmarks`: Important landmarks in Coimbatore

---

## Staff Training

For detailed staff training materials, please refer to the Training Guide section in the application.

---

## Support

For any issues or questions, feel free to contact:

* 📧 **Email**: [krishnapriyasri04@gmail.com](mailto:krishnapriyasri04@gmail.com)
* 📞 **Phone**: +91 90475 47774
