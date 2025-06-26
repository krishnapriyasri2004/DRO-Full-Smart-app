import { query, getRow, insert, update, remove } from "@/lib/db"
import { isWithinCoimbatore, getNearestArea } from "@/lib/coimbatore-map-utils"

export interface Location {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  type: "depot" | "delivery" | "pickup"
  area: string
  user_id?: number
  created_at: Date
  updated_at: Date
}

export interface LocationInput {
  name: string
  address: string
  lat: number
  lng: number
  type: "depot" | "delivery" | "pickup"
  area?: string
  user_id?: number
}

export async function getAllLocations(): Promise<Location[]> {
  return query<Location[]>("SELECT * FROM locations ORDER BY name")
}

export async function getLocationById(id: number): Promise<Location | null> {
  return getRow<Location>("SELECT * FROM locations WHERE id = ?", [id])
}

export async function getLocationsByType(type: string): Promise<Location[]> {
  return query<Location[]>("SELECT * FROM locations WHERE type = ? ORDER BY name", [type])
}

export async function getLocationsByArea(area: string): Promise<Location[]> {
  return query<Location[]>("SELECT * FROM locations WHERE area = ? ORDER BY name", [area])
}

export async function createLocation(locationData: LocationInput): Promise<number> {
  // Validate if coordinates are within Coimbatore
  if (!isWithinCoimbatore(locationData.lat, locationData.lng)) {
    throw new Error("Location coordinates are outside Coimbatore city limits")
  }

  // If area is not provided, determine it based on coordinates
  if (!locationData.area) {
    locationData.area = getNearestArea(locationData.lat, locationData.lng)
  }

  return insert("locations", locationData)
}

export async function updateLocation(id: number, locationData: Partial<LocationInput>): Promise<number> {
  // If coordinates are updated, validate if they are within Coimbatore
  if (locationData.lat !== undefined && locationData.lng !== undefined) {
    if (!isWithinCoimbatore(locationData.lat, locationData.lng)) {
      throw new Error("Location coordinates are outside Coimbatore city limits")
    }

    // Update area based on new coordinates if not explicitly provided
    if (!locationData.area) {
      locationData.area = getNearestArea(locationData.lat, locationData.lng)
    }
  }

  return update("locations", locationData, "id = ?", [id])
}

export async function deleteLocation(id: number): Promise<number> {
  return remove("locations", "id = ?", [id])
}

export async function getLocationsWithinRadius(lat: number, lng: number, radiusKm: number): Promise<Location[]> {
  // Haversine formula to find locations within radius
  const sql = `
    SELECT *, 
      (6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) AS distance 
    FROM locations 
    HAVING distance < ? 
    ORDER BY distance
  `
  return query<Location[]>(sql, [lat, lng, lat, radiusKm])
}

export async function getCoimbatoreAreas(): Promise<string[]> {
  const result = await query<{ area: string }[]>("SELECT DISTINCT area FROM locations ORDER BY area")
  return result.map((row) => row.area)
}
