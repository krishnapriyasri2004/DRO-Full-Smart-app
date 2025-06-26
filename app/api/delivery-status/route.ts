import { type NextRequest, NextResponse } from "next/server"
import { recordDeliveryStatusUpdate } from "@/models/delivery-assignment"
import { updateAssignmentStatus } from "@/models/delivery-assignment"
import { updateCargoStatus } from "@/models/cargo"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.assignment_id || !data.status) {
      return NextResponse.json({ error: "Missing required fields: assignment_id, status" }, { status: 400 })
    }

    // Record the delivery status update
    const updateId = await recordDeliveryStatusUpdate({
      assignment_id: data.assignment_id,
      status: data.status,
      lat: data.lat,
      lng: data.lng,
      notes: data.notes,
    })

    // Update the assignment status
    let assignmentStatus: "assigned" | "in_progress" | "completed" | "cancelled"
    let cargoStatus: "pending" | "in_transit" | "delivered" | "cancelled"

    // Map delivery status to assignment and cargo status
    switch (data.status) {
      case "picked_up":
      case "in_transit":
        assignmentStatus = "in_progress"
        cargoStatus = "in_transit"
        break
      case "delivered":
        assignmentStatus = "completed"
        cargoStatus = "delivered"
        break
      case "failed":
      case "cancelled":
        assignmentStatus = "cancelled"
        cargoStatus = "cancelled"
        break
      default:
        assignmentStatus = "assigned"
        cargoStatus = "pending"
    }

    // Update the assignment status
    await updateAssignmentStatus(data.assignment_id, assignmentStatus)

    // Update the cargo status if cargo_id is provided
    if (data.cargo_id) {
      await updateCargoStatus(data.cargo_id, cargoStatus)
    }

    return NextResponse.json({ success: true, updateId })
  } catch (error) {
    console.error("Error recording delivery status update:", error)
    return NextResponse.json({ error: "Failed to record delivery status update" }, { status: 500 })
  }
}
