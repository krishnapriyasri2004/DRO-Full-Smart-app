import { query, getRow, insert, update, remove } from "@/lib/db"

export interface DeliveryAssignment {
  id: number
  route_id: number
  partner_id: number
  cargo_id: number
  status: "assigned" | "in_progress" | "completed" | "cancelled"
  assigned_at: Date
  started_at?: Date
  completed_at?: Date
  notes?: string
}

export interface DeliveryAssignmentInput {
  route_id: number
  partner_id: number
  cargo_id: number
  status?: "assigned" | "in_progress" | "completed" | "cancelled"
  notes?: string
}

export interface DeliveryStatusUpdate {
  id: number
  assignment_id: number
  status: "assigned" | "picked_up" | "in_transit" | "arrived" | "delivered" | "failed" | "cancelled"
  lat?: number
  lng?: number
  notes?: string
  timestamp: Date
}

export interface DeliveryStatusUpdateInput {
  assignment_id: number
  status: "assigned" | "picked_up" | "in_transit" | "arrived" | "delivered" | "failed" | "cancelled"
  lat?: number
  lng?: number
  notes?: string
}

export async function getAllAssignments(): Promise<DeliveryAssignment[]> {
  return query<DeliveryAssignment[]>("SELECT * FROM delivery_assignments ORDER BY assigned_at DESC")
}

export async function getAssignmentById(id: number): Promise<DeliveryAssignment | null> {
  return getRow<DeliveryAssignment>("SELECT * FROM delivery_assignments WHERE id = ?", [id])
}

export async function getAssignmentsByPartnerId(partnerId: number): Promise<DeliveryAssignment[]> {
  return query<DeliveryAssignment[]>(
    "SELECT * FROM delivery_assignments WHERE partner_id = ? ORDER BY assigned_at DESC",
    [partnerId],
  )
}

export async function getActiveAssignmentsByPartnerId(partnerId: number): Promise<DeliveryAssignment[]> {
  return query<DeliveryAssignment[]>(
    `SELECT * FROM delivery_assignments 
     WHERE partner_id = ? AND status IN ('assigned', 'in_progress') 
     ORDER BY assigned_at`,
    [partnerId],
  )
}

export async function createAssignment(assignmentData: DeliveryAssignmentInput): Promise<number> {
  return insert("delivery_assignments", assignmentData)
}

export async function updateAssignment(id: number, assignmentData: Partial<DeliveryAssignmentInput>): Promise<number> {
  return update("delivery_assignments", assignmentData, "id = ?", [id])
}

export async function updateAssignmentStatus(
  id: number,
  status: "assigned" | "in_progress" | "completed" | "cancelled",
): Promise<number> {
  const data: any = { status }

  if (status === "in_progress") {
    data.started_at = new Date()
  } else if (status === "completed") {
    data.completed_at = new Date()
  }

  return update("delivery_assignments", data, "id = ?", [id])
}

export async function deleteAssignment(id: number): Promise<number> {
  return remove("delivery_assignments", "id = ?", [id])
}

export async function recordDeliveryStatusUpdate(updateData: DeliveryStatusUpdateInput): Promise<number> {
  return insert("delivery_status_updates", updateData)
}

export async function getDeliveryStatusUpdates(assignmentId: number): Promise<DeliveryStatusUpdate[]> {
  return query<DeliveryStatusUpdate[]>(
    "SELECT * FROM delivery_status_updates WHERE assignment_id = ? ORDER BY timestamp",
    [assignmentId],
  )
}

export async function getLatestDeliveryStatus(assignmentId: number): Promise<DeliveryStatusUpdate | null> {
  const results = await query<DeliveryStatusUpdate[]>(
    "SELECT * FROM delivery_status_updates WHERE assignment_id = ? ORDER BY timestamp DESC LIMIT 1",
    [assignmentId],
  )
  return results.length > 0 ? results[0] : null
}

export async function getRecentDeliveryStatusUpdates(minutes = 30): Promise<DeliveryStatusUpdate[]> {
  return query<DeliveryStatusUpdate[]>(
    `SELECT * FROM delivery_status_updates 
     WHERE timestamp > DATE_SUB(NOW(), INTERVAL ? MINUTE) 
     ORDER BY timestamp DESC`,
    [minutes],
  )
}
