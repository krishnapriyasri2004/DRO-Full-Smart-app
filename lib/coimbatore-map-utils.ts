// Coimbatore, Tamil Nadu, India map utilities

// Approximate center coordinates of Coimbatore
export const COIMBATORE_CENTER = {
  lat: 11.0168,
  lng: 76.9558,
}

// Coimbatore city boundaries (approximate)
export const COIMBATORE_BOUNDS = {
  north: 11.1168, // North boundary
  south: 10.9168, // South boundary
  east: 77.0558, // East boundary
  west: 76.8558, // West boundary
}

// Major areas/neighborhoods in Coimbatore
export const COIMBATORE_AREAS = [
  { name: "Peelamedu", lat: 11.0279, lng: 77.0254 },
  { name: "R.S. Puram", lat: 11.0069, lng: 76.9498 },
  { name: "Gandhipuram", lat: 11.0175, lng: 76.9674 },
  { name: "Singanallur", lat: 11.007, lng: 77.0421 },
  { name: "Saibaba Colony", lat: 11.0233, lng: 76.9342 },
  { name: "Ganapathy", lat: 11.04, lng: 76.99 },
  { name: "Ukkadam", lat: 10.9925, lng: 76.9608 },
  { name: "Ramanathapuram", lat: 11.0023, lng: 77.0101 },
  { name: "Podanur", lat: 10.979, lng: 76.97 },
  { name: "Thudiyalur", lat: 11.07, lng: 76.94 },
]

// Major landmarks in Coimbatore
export const COIMBATORE_LANDMARKS = [
  { name: "Coimbatore International Airport", lat: 11.03, lng: 77.043, type: "airport" },
  { name: "Coimbatore Junction Railway Station", lat: 11.0017, lng: 76.965, type: "railway_station" },
  { name: "Brookefields Mall", lat: 11.01, lng: 76.99, type: "mall" },
  { name: "Prozone Mall", lat: 11.07, lng: 76.99, type: "mall" },
  { name: "Coimbatore Medical College Hospital", lat: 11.02, lng: 76.98, type: "hospital" },
  { name: "PSG Hospitals", lat: 11.03, lng: 77.03, type: "hospital" },
  { name: "Kovai Pazhamudir Nilayam", lat: 11.02, lng: 76.97, type: "supermarket" },
]

// Major roads in Coimbatore
export const COIMBATORE_MAJOR_ROADS = [
  { name: "Avinashi Road", start: { lat: 11.0168, lng: 76.9558 }, end: { lat: 11.03, lng: 77.043 } },
  { name: "Trichy Road", start: { lat: 11.0168, lng: 76.9558 }, end: { lat: 10.979, lng: 77.01 } },
  { name: "Mettupalayam Road", start: { lat: 11.0168, lng: 76.9558 }, end: { lat: 11.07, lng: 76.94 } },
  { name: "Sathyamangalam Road", start: { lat: 11.0168, lng: 76.9558 }, end: { lat: 11.03, lng: 77.08 } },
  { name: "Pollachi Road", start: { lat: 11.0168, lng: 76.9558 }, end: { lat: 10.95, lng: 76.93 } },
]

// Calculate distance between two points in Coimbatore (in kilometers)
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLng = deg2rad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km
  return distance
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Check if coordinates are within Coimbatore city limits
export function isWithinCoimbatore(lat: number, lng: number): boolean {
  return (
    lat >= COIMBATORE_BOUNDS.south &&
    lat <= COIMBATORE_BOUNDS.north &&
    lng >= COIMBATORE_BOUNDS.west &&
    lng <= COIMBATORE_BOUNDS.east
  )
}

// Get nearest area in Coimbatore based on coordinates
export function getNearestArea(lat: number, lng: number): string {
  let nearestArea = COIMBATORE_AREAS[0]
  let minDistance = calculateDistance(lat, lng, nearestArea.lat, nearestArea.lng)

  for (let i = 1; i < COIMBATORE_AREAS.length; i++) {
    const area = COIMBATORE_AREAS[i]
    const distance = calculateDistance(lat, lng, area.lat, area.lng)
    if (distance < minDistance) {
      minDistance = distance
      nearestArea = area
    }
  }

  return nearestArea.name
}

// Estimate travel time between two points in Coimbatore (in minutes)
// This is a simplified model - in a real app, you'd use a routing API
export function estimateTravelTime(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const distance = calculateDistance(lat1, lng1, lat2, lng2)

  // Average speed in Coimbatore city (km/h)
  const avgSpeed = 25

  // Convert to minutes: (distance / speed) * 60
  const timeInMinutes = (distance / avgSpeed) * 60

  // Add some buffer for traffic, signals, etc.
  const buffer = 5

  return Math.ceil(timeInMinutes + buffer)
}

// Generate sample delivery locations in Coimbatore
export function generateSampleLocations(count = 10) {
  const locations = []

  // Add a depot (warehouse) location
  locations.push({
    id: 1,
    name: "Central Warehouse",
    lat: 11.0168,
    lng: 76.9558,
    type: "depot",
  })

  // Add delivery locations
  for (let i = 0; i < count; i++) {
    // Generate random coordinates within Coimbatore bounds
    const lat = COIMBATORE_BOUNDS.south + Math.random() * (COIMBATORE_BOUNDS.north - COIMBATORE_BOUNDS.south)
    const lng = COIMBATORE_BOUNDS.west + Math.random() * (COIMBATORE_BOUNDS.east - COIMBATORE_BOUNDS.west)

    const area = getNearestArea(lat, lng)

    locations.push({
      id: i + 2,
      name: `Delivery Point ${i + 1} (${area})`,
      lat,
      lng,
      type: "delivery",
    })
  }

  return locations
}
