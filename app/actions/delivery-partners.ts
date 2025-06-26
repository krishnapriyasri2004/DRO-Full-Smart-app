"use server"

import {
  getAllDeliveryPartners,
  getDeliveryPartnerById,
  createDeliveryPartner,
  updateDeliveryPartner,
  deleteDeliveryPartner,
} from "@/models/delivery-partner"
import { getLocationHistory } from "@/models/location-tracking"
import { getActiveAssignmentsByPartnerId } from "@/models/delivery-assignment"

export async function fetchAllDeliveryPartners() {
  try {
    return { success: true, data: await getAllDeliveryPartners() }
  } catch (error) {
    console.error("Error fetching delivery partners:", error)
    return { success: false, error: "Failed to fetch delivery partners" }
  }
}

export async function fetchDeliveryPartnerDetails(id: number) {
  try {
    const partner = await getDeliveryPartnerById(id)
    if (!partner) {
      return { success: false, error: "Delivery partner not found" }
    }

    // Get additional data
    const locationHistory = await getLocationHistory(id, 50)
    const activeAssignments = await getActiveAssignmentsByPartnerId(id)

    return {
      success: true,
      data: {
        partner,
        locationHistory,
        activeAssignments,
      },
    }
  } catch (error) {
    console.error("Error fetching delivery partner details:", error)
    return { success: false, error: "Failed to fetch delivery partner details" }
  }
}

export async function addDeliveryPartner(partnerData: any) {
  try {
    const id = await createDeliveryPartner({
      name: partnerData.name,
      email: partnerData.email,
      phone: partnerData.phone,
      vehicle_type: partnerData.vehicle_type,
      capacity: Number.parseFloat(partnerData.capacity),
      status: partnerData.status || "active",
      user_id: partnerData.user_id,
    })

    return { success: true, id }
  } catch (error) {
    console.error("Error adding delivery partner:", error)
    return { success: false, error: "Failed to add delivery partner" }
  }
}

export async function updateDeliveryPartnerData(id: number, partnerData: any) {
  try {
    await updateDeliveryPartner(id, {
      name: partnerData.name,
      email: partnerData.email,
      phone: partnerData.phone,
      vehicle_type: partnerData.vehicle_type,
      capacity: Number.parseFloat(partnerData.capacity),
      status: partnerData.status,
      user_id: partnerData.user_id,
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating delivery partner:", error)
    return { success: false, error: "Failed to update delivery partner" }
  }
}

export async function removeDeliveryPartner(id: number) {
  try {
    await deleteDeliveryPartner(id)
    return { success: true }
  } catch (error) {
    console.error("Error deleting delivery partner:", error)
    return { success: false, error: "Failed to delete delivery partner" }
  }
}
