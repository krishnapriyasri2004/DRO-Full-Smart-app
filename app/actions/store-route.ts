"use server"

import { insert, query } from "@/lib/db"
import { revalidatePath } from "next/cache"

export interface RouteFormData {
  name: string
  algorithm: string
  vehicleType: string
  startingPoint: string
  startingPointCoords: { lat: number; lng: number }
  deliveryPoints: Array<{
    id: string
    name: string
    address: string
    lat: number
    lng: number
    notes?: string
    estimatedTime?: number
  }>
  optimizeForTraffic: boolean
  avoidTolls: boolean
  preferHighways: boolean
}

export async function storeRoute(formData: RouteFormData) {
  try {
    // 1. First, check if the starting location exists, if not create it
    let startingLocationId: number
    const startingLocationResult = await query("SELECT id FROM locations WHERE name = ? AND type = 'depot'", [
      formData.startingPoint,
    ])

    if (startingLocationResult.length === 0) {
      // Create new starting location
      startingLocationId = await insert("locations", {
        name: formData.startingPoint,
        address: formData.startingPoint,
        lat: formData.startingPointCoords.lat,
        lng: formData.startingPointCoords.lng,
        type: "depot",
      })
    } else {
      startingLocationId = startingLocationResult[0].id
    }

    // 2. Get a vehicle of the specified type
    const vehicleResult = await query("SELECT id FROM vehicles WHERE type = ? AND status = 'active' LIMIT 1", [
      formData.vehicleType,
    ])

    let vehicleId: number | null = null
    if (vehicleResult.length > 0) {
      vehicleId = vehicleResult[0].id
    }

    // 3. Create the route
    const routeId = await insert("routes", {
      name: formData.name,
      algorithm: formData.algorithm,
      vehicle_id: vehicleId,
      starting_location_id: startingLocationId,
      status: "planned",
      optimize_for_traffic: formData.optimizeForTraffic,
      avoid_tolls: formData.avoidTolls,
      prefer_highways: formData.preferHighways,
      total_distance: calculateTotalDistance(formData.deliveryPoints, formData.startingPointCoords),
      estimated_duration: calculateEstimatedDuration(formData.deliveryPoints),
    })

    // 4. Process each delivery point
    for (let i = 0; i < formData.deliveryPoints.length; i++) {
      const point = formData.deliveryPoints[i]

      // Check if location exists
      let locationId: number
      const locationResult = await query("SELECT id FROM locations WHERE name = ? AND type = 'delivery'", [point.name])

      if (locationResult.length === 0) {
        // Create new location
        locationId = await insert("locations", {
          name: point.name,
          address: point.address,
          lat: point.lat,
          lng: point.lng,
          type: "delivery",
        })
      } else {
        locationId = locationResult[0].id
      }

      // Add to route_points
      await insert("route_points", {
        route_id: routeId,
        location_id: locationId,
        sequence_number: i + 1,
        notes: point.notes || null,
        estimated_arrival_time: calculateEstimatedArrival(i, point.estimatedTime),
      })
    }

    revalidatePath("/dashboard/routes")

    return { success: true, routeId }
  } catch (error) {
    console.error("Error storing route:", error)
    return { success: false, error: String(error) }
  }
}

// Helper functions
function calculateTotalDistance(points: any[], startingPoint: { lat: number; lng: number }): number {
  let totalDistance = 0
  let prevPoint = startingPoint

  for (const point of points) {
    totalDistance += calculateHaversineDistance(prevPoint.lat, prevPoint.lng, point.lat, point.lng)
    prevPoint = point
  }

  return Number.parseFloat(totalDistance.toFixed(2))
}

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km
  return distance
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

function calculateEstimatedDuration(points: any[]): number {
  // Simple estimation: 15 minutes per delivery point
  return points.length * 15
}

function calculateEstimatedArrival(index: number, customTime?: number): Date {
  const now = new Date()
  // Add base time (30 minutes) plus index * 15 minutes or custom time
  const minutesToAdd = 30 + (customTime || index * 15)
  now.setMinutes(now.getMinutes() + minutesToAdd)
  return now
}
