import { query, getRow, insert, update, remove } from "@/lib/db"

export interface DeliveryPartner {
  id: number
  user_id?: number
  name: string
  email: string
  phone: string
  vehicle_type: "car" | "bike" | "truck" | "walk"
  capacity: number
  status: "active" | "inactive" | "on-delivery"
  current_lat?: number
  current_lng?: number
  last_location_update?: Date
  created_at: Date
  updated_at: Date
}

export interface DeliveryPartnerInput {
  user_id?: number
  name: string
  email: string
  phone: string
  vehicle_type: "car" | "bike" | "truck" | "walk"
  capacity: number
  status?: "active" | "inactive" | "on-delivery"
  current_lat?: number
  current_lng?: number
}

export async function getAllDeliveryPartners(): Promise<DeliveryPartner[]> {
  return query<DeliveryPartner[]>("SELECT * FROM delivery_partners ORDER BY name")
}

export async function getActiveDeliveryPartners(): Promise<DeliveryPartner[]> {
  return query<DeliveryPartner[]>('SELECT * FROM delivery_partners WHERE status = "active" ORDER BY name')
}

export async function getDeliveryPartnerById(id: number): Promise<DeliveryPartner | null> {
  return getRow<DeliveryPartner>("SELECT * FROM delivery_partners WHERE id = ?", [id])
}

export async function createDeliveryPartner(partnerData: DeliveryPartnerInput): Promise<number> {
  return insert("delivery_partners", partnerData)
}

export async function updateDeliveryPartner(id: number, partnerData: Partial<DeliveryPartnerInput>): Promise<number> {
  return update("delivery_partners", partnerData, "id = ?", [id])
}

export async function deleteDeliveryPartner(id: number): Promise<number> {
  return remove("delivery_partners", "id = ?", [id])
}

export async function updateDeliveryPartnerLocation(id: number, lat: number, lng: number): Promise<number> {
  return update(
    "delivery_partners",
    {
      current_lat: lat,
      current_lng: lng,
      last_location_update: new Date(),
    },
    "id = ?",
    [id],
  )
}

export async function getDeliveryPartnersWithinRadius(
  lat: number,
  lng: number,
  radiusKm: number,
): Promise<DeliveryPartner[]> {
  // Haversine formula to find partners within radius
  const sql = `
    SELECT *, 
      (6371 * acos(cos(radians(?)) * cos(radians(current_lat)) * cos(radians(current_lng) - radians(?)) + sin(radians(?)) * sin(radians(current_lat)))) AS distance 
    FROM delivery_partners 
    WHERE status = 'active' 
    HAVING distance < ? 
    ORDER BY distance
  `
  return query<DeliveryPartner[]>(sql, [lat, lng, lat, radiusKm])
}
