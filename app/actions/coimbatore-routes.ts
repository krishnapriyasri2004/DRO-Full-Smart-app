"use server"

import { COIMBATORE_AREAS, calculateDistance, estimateTravelTime, isWithinCoimbatore } from "@/lib/coimbatore-map-utils"
import { query } from "@/lib/db"

interface Location {
  id: number
  name: string
  lat: number
  lng: number
  type: string
}

interface DeliveryPartner {
  id: number
  name: string
  vehicle_type: string
  capacity: number
}

interface RouteRequest {
  algorithm: string
  locations: Location[]
  partners: DeliveryPartner[]
}

interface RouteResponse {
  algorithm: string
  routes: {
    partnerId: number
    path: number[]
    distance: number
    duration: number
  }[]
}

export async function optimizeCoimbatoreRoutes(data: RouteRequest): Promise<RouteResponse> {
  try {
    // Validate that all locations are within Coimbatore
    for (const location of data.locations) {
      if (!isWithinCoimbatore(location.lat, location.lng)) {
        throw new Error(`Location ${location.name} is outside Coimbatore city limits`)
      }
    }

    // Find depot
    const depot = data.locations.find((loc) => loc.type === "depot")
    if (!depot) {
      throw new Error("No depot location found")
    }

    // Get delivery locations
    const deliveryLocations = data.locations.filter((loc) => loc.type === "delivery")
    if (deliveryLocations.length === 0) {
      throw new Error("No delivery locations found")
    }

    // Get traffic data for Coimbatore roads
    const currentHour = new Date().getHours()
    const currentDay = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.

    const trafficData = await query(
      `
      SELECT r.name as road_name, t.traffic_level, t.avg_speed
      FROM coimbatore_roads r
      JOIN coimbatore_traffic_data t ON r.id = t.road_id
      WHERE t.day_of_week = ? AND t.hour_of_day = ?
      ORDER BY r.name
    `,
      [currentDay, currentHour],
    )

    // Generate routes based on the selected algorithm
    let routes = []

    switch (data.algorithm) {
      case "greedy":
        routes = generateGreedyRoutes(depot, deliveryLocations, data.partners, trafficData)
        break
      case "dynamic":
        routes = generateDynamicRoutes(depot, deliveryLocations, data.partners, trafficData)
        break
      case "divide":
        routes = generateDivideAndConquerRoutes(depot, deliveryLocations, data.partners, trafficData)
        break
      case "backtracking":
        routes = generateBacktrackingRoutes(depot, deliveryLocations, data.partners, trafficData)
        break
      default:
        throw new Error(`Unknown algorithm: ${data.algorithm}`)
    }

    return {
      algorithm: data.algorithm,
      routes,
    }
  } catch (error) {
    console.error("Error optimizing routes:", error)
    throw error
  }
}

// Helper function to generate greedy routes
function generateGreedyRoutes(
  depot: Location,
  deliveryLocations: Location[],
  partners: DeliveryPartner[],
  trafficData: any[],
): any[] {
  const routes = []
  const locationsPerPartner = Math.ceil(deliveryLocations.length / partners.length)

  for (let i = 0; i < partners.length; i++) {
    const partnerLocations = deliveryLocations.slice(
      i * locationsPerPartner,
      Math.min((i + 1) * locationsPerPartner, deliveryLocations.length),
    )

    if (partnerLocations.length > 0) {
      // Sort locations by distance from depot
      partnerLocations.sort((a, b) => {
        const distA = calculateDistance(depot.lat, depot.lng, a.lat, a.lng)
        const distB = calculateDistance(depot.lat, depot.lng, b.lat, b.lng)
        return distA - distB
      })

      const path = [depot.id, ...partnerLocations.map((loc) => loc.id), depot.id]

      // Calculate total distance and duration
      let totalDistance = 0
      let totalDuration = 0

      for (let j = 0; j < path.length - 1; j++) {
        const locA = [depot, ...deliveryLocations].find((loc) => loc.id === path[j])
        const locB = [depot, ...deliveryLocations].find((loc) => loc.id === path[j + 1])

        if (locA && locB) {
          const distance = calculateDistance(locA.lat, locA.lng, locB.lat, locB.lng)
          totalDistance += distance
          totalDuration += estimateTravelTime(locA.lat, locA.lng, locB.lat, locB.lng)
        }
      }

      routes.push({
        partnerId: partners[i].id,
        path,
        distance: Number.parseFloat(totalDistance.toFixed(2)),
        duration: Math.round(totalDuration),
      })
    }
  }

  return routes
}

// Placeholder functions for other algorithms
function generateDynamicRoutes(
  depot: Location,
  deliveryLocations: Location[],
  partners: DeliveryPartner[],
  trafficData: any[],
): any[] {
  // Simplified implementation for demo purposes
  return generateGreedyRoutes(depot, deliveryLocations, partners, trafficData)
}

function generateDivideAndConquerRoutes(
  depot: Location,
  deliveryLocations: Location[],
  partners: DeliveryPartner[],
  trafficData: any[],
): any[] {
  // Simplified implementation for demo purposes
  const routes = []

  // Sort locations by longitude (east-west division)
  const sortedLocations = [...deliveryLocations].sort((a, b) => a.lng - b.lng)

  // Divide locations among partners
  const partnerCount = Math.min(partners.length, 3) // Limit to 3 partners for demo
  const locationsPerPartner = Math.ceil(sortedLocations.length / partnerCount)

  for (let i = 0; i < partnerCount; i++) {
    const partnerLocations = sortedLocations.slice(
      i * locationsPerPartner,
      Math.min((i + 1) * locationsPerPartner, sortedLocations.length),
    )

    if (partnerLocations.length > 0) {
      const path = [depot.id, ...partnerLocations.map((loc) => loc.id), depot.id]

      // Calculate total distance and duration
      let totalDistance = 0
      let totalDuration = 0

      for (let j = 0; j < path.length - 1; j++) {
        const locA = [depot, ...deliveryLocations].find((loc) => loc.id === path[j])
        const locB = [depot, ...deliveryLocations].find((loc) => loc.id === path[j + 1])

        if (locA && locB) {
          const distance = calculateDistance(locA.lat, locA.lng, locB.lat, locB.lng)
          totalDistance += distance
          totalDuration += estimateTravelTime(locA.lat, locA.lng, locB.lat, locB.lng)
        }
      }

      routes.push({
        partnerId: partners[i].id,
        path,
        distance: Number.parseFloat(totalDistance.toFixed(2)),
        duration: Math.round(totalDuration),
      })
    }
  }

  return routes
}

function generateBacktrackingRoutes(depot: Location, deliveryLocations: Location[], partners: DeliveryPartner[], trafficData: any[]): any[] {
  // Simplified implementation for demo purposes
  // Group locations by area
  const locationsByArea = {}
  
  for (const location of deliveryLocations) {
    const nearestArea = COIMBATORE_AREAS.reduce((nearest, area) => {
      const distance = calculateDistance(location.lat, location.lng, area.lat, area.lng)
      if (!nearest || distance < nearest.distance) {
        return { area, distance }
      }
      return nearest
    }, null)
    
    if (nearestArea) {
      const areaName = nearestArea.area.name
      if (!locationsByArea[areaName]) {
        locationsByArea[areaName] = []
      }
      locationsByArea[areaName].push(location)
    }
  }
  
  // Assign areas to partners
  const routes = []
  const areas = Object.keys(locationsByArea)
  const partnerCount = Math.min(partners.length, areas.length)
  
  for (let i = 0; i < partnerCount; i++) {
    const partnerAreas = areas.filter((_, index) => index % partnerCount === i)
    const partnerLocations = []
    
    for (const area of partnerAreas) {
      partnerLocations.push(...locationsByArea[area])
    }
    
    if (partnerLocations.length > 0) {
      const path = [depot.id, ...partnerLocations.map(loc => loc.id), depot.id]
      
      // Calculate
\
Let's create a new file for Coimbatore-specific mapping:
