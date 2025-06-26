// Coimbatore mapping utilities
import type { LatLngExpression } from "leaflet"

// Coimbatore city center coordinates
export const COIMBATORE_CENTER: LatLngExpression = [11.0168, 76.9558]

// Zoom level for Coimbatore city view
export const COIMBATORE_ZOOM = 12

// Major areas in Coimbatore with their coordinates
export const COIMBATORE_AREAS = {
  cityCenter: { name: "Coimbatore City Center", coordinates: [11.0168, 76.9558] },
  gandhipuram: { name: "Gandhipuram", coordinates: [11.0183, 76.9626] },
  rsPuram: { name: "R.S. Puram", coordinates: [11.0069, 76.9498] },
  peelamedu: { name: "Peelamedu", coordinates: [11.0263, 77.0012] },
  singanallur: { name: "Singanallur", coordinates: [11.0066, 77.0285] },
  saibaba: { name: "Saibaba Colony", coordinates: [11.0305, 76.9499] },
  ganapathy: { name: "Ganapathy", coordinates: [11.0444, 76.9612] },
  ukkadam: { name: "Ukkadam", coordinates: [10.9948, 76.9542] },
  kuniyamuthur: { name: "Kuniyamuthur", coordinates: [10.9708, 76.9512] },
  thudiyalur: { name: "Thudiyalur", coordinates: [11.0742, 76.9336] },
  saravanampatti: { name: "Saravanampatti", coordinates: [11.0784, 77.0066] },
  hopes: { name: "Hopes College", coordinates: [11.0328, 76.9629] },
  raceCourse: { name: "Race Course", coordinates: [11.0019, 76.9683] },
  ondipudur: { name: "Ondipudur", coordinates: [11.0019, 77.0683] },
  sulur: { name: "Sulur", coordinates: [11.0233, 77.1283] },
}

// Major highways and roads in Coimbatore
export const COIMBATORE_ROADS = [
  { name: "Avinashi Road", start: [11.0168, 76.9558], end: [11.0263, 77.0012] },
  { name: "Trichy Road", start: [11.0168, 76.9558], end: [11.0066, 77.0285] },
  { name: "Sathy Road", start: [11.0168, 76.9558], end: [11.0444, 76.9612] },
  { name: "Mettupalayam Road", start: [11.0168, 76.9558], end: [11.0742, 76.9336] },
  { name: "Palakkad Road", start: [11.0168, 76.9558], end: [10.9708, 76.9512] },
  { name: "Thadagam Road", start: [11.0168, 76.9558], end: [11.0305, 76.9499] },
]

// Traffic patterns for different times of day in Coimbatore
export const TRAFFIC_PATTERNS = {
  morning: {
    avinashiRoad: "heavy",
    trichyRoad: "moderate",
    sathyRoad: "heavy",
    mettupalayamRoad: "heavy",
    palakkadRoad: "moderate",
    thadagamRoad: "light",
  },
  afternoon: {
    avinashiRoad: "moderate",
    trichyRoad: "light",
    sathyRoad: "moderate",
    mettupalayamRoad: "light",
    palakkadRoad: "light",
    thadagamRoad: "light",
  },
  evening: {
    avinashiRoad: "heavy",
    trichyRoad: "heavy",
    sathyRoad: "heavy",
    mettupalayamRoad: "heavy",
    palakkadRoad: "moderate",
    thadagamRoad: "moderate",
  },
}

// Calculate estimated travel time between two points in Coimbatore
// This is a simplified function and would need real traffic data for accuracy
export function calculateTravelTime(
  startPoint: LatLngExpression,
  endPoint: LatLngExpression,
  timeOfDay: "morning" | "afternoon" | "evening",
): number {
  // Calculate distance (very simplified)
  const startArr = Array.isArray(startPoint) ? startPoint : [startPoint.lat, startPoint.lng]
  const endArr = Array.isArray(endPoint) ? endPoint : [endPoint.lat, endPoint.lng]

  const lat1 = startArr[0]
  const lon1 = startArr[1]
  const lat2 = endArr[0]
  const lon2 = endArr[1]

  // Haversine formula for distance calculation
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km

  // Base speed depending on time of day (km/h)
  let baseSpeed
  switch (timeOfDay) {
    case "morning":
      baseSpeed = 20 // Slower in morning rush hour
      break
    case "afternoon":
      baseSpeed = 30 // Faster in afternoon
      break
    case "evening":
      baseSpeed = 15 // Slowest in evening rush hour
      break
    default:
      baseSpeed = 25
  }

  // Calculate time in minutes
  const timeInHours = distance / baseSpeed
  return timeInHours * 60 // Convert to minutes
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Get nearest landmarks for a given coordinate
export function getNearestLandmarks(position: LatLngExpression, limit = 3): Array<{ name: string; distance: number }> {
  const posArr = Array.isArray(position) ? position : [position.lat, position.lng]

  const landmarks = Object.values(COIMBATORE_AREAS).map((area) => {
    const areaCoords = area.coordinates
    const lat1 = posArr[0]
    const lon1 = posArr[1]
    const lat2 = areaCoords[0]
    const lon2 = areaCoords[1]

    // Haversine formula again
    const R = 6371
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return {
      name: area.name,
      distance: distance,
    }
  })

  // Sort by distance and return the closest ones
  return landmarks.sort((a, b) => a.distance - b.distance).slice(0, limit)
}
