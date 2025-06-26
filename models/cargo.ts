import { query, getRow, insert, update, remove } from "@/lib/db"

export interface Cargo {
  id: number
  name: string
  weight: number
  dimensions?: string
  status: "pending" | "in_transit" | "delivered" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  pickup_location_id?: number
  delivery_location_id: number
  user_id?: number
  created_at: Date
  updated_at: Date
}

export interface CargoInput {
  name: string
  weight: number
  dimensions?: string
  status?: "pending" | "in_transit" | "delivered" | "cancelled"
  priority?: "low" | "medium" | "high" | "urgent"
  pickup_location_id?: number
  delivery_location_id: number
  user_id?: number
}

export async function getAllCargo(): Promise<Cargo[]> {
  return query<Cargo[]>("SELECT * FROM cargo ORDER BY created_at DESC")
}

export async function getPendingCargo(): Promise<Cargo[]> {
  return query<Cargo[]>('SELECT * FROM cargo WHERE status = "pending" ORDER BY priority DESC, created_at ASC')
}

export async function getCargoById(id: number): Promise<Cargo | null> {
  return getRow<Cargo>("SELECT * FROM cargo WHERE id = ?", [id])
}

export async function getCargoByStatus(status: string): Promise<Cargo[]> {
  return query<Cargo[]>("SELECT * FROM cargo WHERE status = ? ORDER BY priority DESC, created_at ASC", [status])
}

export async function createCargo(cargoData: CargoInput): Promise<number> {
  return insert("cargo", cargoData)
}

export async function updateCargo(id: number, cargoData: Partial<CargoInput>): Promise<number> {
  return update("cargo", cargoData, "id = ?", [id])
}

export async function updateCargoStatus(
  id: number,
  status: "pending" | "in_transit" | "delivered" | "cancelled",
): Promise<number> {
  return update("cargo", { status }, "id = ?", [id])
}

export async function deleteCargo(id: number): Promise<number> {
  return remove("cargo", "id = ?", [id])
}
