import { type NextRequest, NextResponse } from "next/server"
import { recordLocationUpdate } from "@/models/location-tracking"
import { updateDeliveryPartnerLocation } from "@/models/delivery-partner"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.partner_id || !data.lat || !data.lng) {
      return NextResponse.json({ error: "Missing required fields: partner_id, lat, lng" }, { status: 400 })
    }

    // Record the location update
    const updateId = await recordLocationUpdate({
      partner_id: data.partner_id,
      lat: data.lat,
      lng: data.lng,
      speed: data.speed,
      heading: data.heading,
      accuracy: data.accuracy,
      battery_level: data.battery_level,
    })

    // Update the delivery partner's current location
    await updateDeliveryPartnerLocation(data.partner_id, data.lat, data.lng)

    return NextResponse.json({ success: true, updateId })
  } catch (error) {
    console.error("Error recording location update:", error)
    return NextResponse.json({ error: "Failed to record location update" }, { status: 500 })
  }
}
