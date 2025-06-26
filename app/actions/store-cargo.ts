"use server"

import { insert, query } from "@/lib/db"
import { revalidatePath } from "next/cache"

export interface CargoFormData {
  name: string
  weight: number
  dimensions: string
  priority: "low" | "medium" | "high" | "urgent"
  destination: string
  pickup_location_id?: number
}

export async function storeCargo(formData: FormData) {
  try {
    const cargoData: CargoFormData = {
      name: formData.get("name") as string,
      weight: Number(formData.get("weight")),
      dimensions: formData.get("dimensions") as string,
      priority: formData.get("priority") as "low" | "medium" | "high" | "urgent",
      destination: formData.get("destination") as string,
    }

    // Get or create delivery location
    const locationResult = await query("SELECT id FROM locations WHERE name = ?", [cargoData.destination])

    let delivery_location_id: number

    if (locationResult.length === 0) {
      // Create new location with default coordinates (would be better with geocoding)
      delivery_location_id = await insert("locations", {
        name: cargoData.destination,
        lat: 11.0168, // Default Coimbatore coordinates
        lng: 76.9558,
        type: "delivery",
      })
    } else {
      delivery_location_id = locationResult[0].id
    }

    // Insert cargo into database
    const cargoId = await insert("cargo", {
      name: cargoData.name,
      weight: cargoData.weight,
      dimensions: cargoData.dimensions,
      status: "pending",
      priority: cargoData.priority,
      delivery_location_id,
      created_at: new Date(),
      updated_at: new Date(),
    })

    revalidatePath("/dashboard/cargo")

    return { success: true, cargoId }
  } catch (error) {
    console.error("Error storing cargo:", error)
    return { success: false, error: String(error) }
  }
}
