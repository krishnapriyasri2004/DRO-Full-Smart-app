import { query, insert } from "@/lib/db"

export interface LocationUpdate {
  id: number
  partner_id: number
  lat: number
  lng: number
  speed?: number
  heading?: number
  accuracy?: number
  battery_level?: number
  timestamp: Date
}

export interface LocationUpdateInput {
  partner_id: number
  lat: number
  lng: number
  speed?: number
  heading?: number
  accuracy?: number
  battery_level?: number
}

export async function recordLocationUpdate(updateData: LocationUpdateInput): Promise<number> {
  return insert("location_updates", updateData)
}

export async function getLocationHistory(partnerId: number, limit = 100): Promise<LocationUpdate[]> {
  return query<LocationUpdate[]>(
    "SELECT * FROM location_updates WHERE partner_id = ? ORDER BY timestamp DESC LIMIT ?",
    [partnerId, limit],
  )
}

export async function getRecentLocationUpdates(minutes = 15): Promise<LocationUpdate[]> {
  return query<LocationUpdate[]>(
    `SELECT * FROM location_updates 
     WHERE timestamp > DATE_SUB(NOW(), INTERVAL ? MINUTE) 
     ORDER BY partner_id, timestamp DESC`,
    [minutes],
  )
}

export async function getLatestLocationByPartner(partnerId: number): Promise<LocationUpdate | null> {
  const results = await query<LocationUpdate[]>(
    "SELECT * FROM location_updates WHERE partner_id = ? ORDER BY timestamp DESC LIMIT 1",
    [partnerId],
  )
  return results.length > 0 ? results[0] : null
}
