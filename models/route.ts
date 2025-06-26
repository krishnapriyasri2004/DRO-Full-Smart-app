import { query, getRow, insert, update, remove, transaction } from "@/lib/db"
import type mysql from "mysql2/promise"

export interface Route {
  id: number
  name: string
  start_location_id: number
  end_location_id: number
  distance?: number
  estimated_duration?: number
  status: "planned" | "in_progress" | "completed" | "cancelled"
  optimization_algorithm?: string
  user_id?: number
  created_at: Date
  updated_at: Date
}

export interface RouteInput {
  name: string
  start_location_id: number
  end_location_id: number
  distance?: number
  estimated_duration?: number
  status?: "planned" | "in_progress" | "completed" | "cancelled"
  optimization_algorithm?: string
  user_id?: number
}

export interface RouteWaypoint {
  id: number
  route_id: number
  location_id: number
  sequence_number: number
  estimated_arrival_time?: Date
  actual_arrival_time?: Date
  created_at: Date
  updated_at: Date
}

export interface RouteWaypointInput {
  route_id: number
  location_id: number
  sequence_number: number
  estimated_arrival_time?: Date
}

export async function getAllRoutes(): Promise<Route[]> {
  return query<Route[]>("SELECT * FROM routes ORDER BY created_at DESC")
}

export async function getRouteById(id: number): Promise<Route | null> {
  return getRow<Route>("SELECT * FROM routes WHERE id = ?", [id])
}

export async function getRoutesByStatus(status: string): Promise<Route[]> {
  return query<Route[]>("SELECT * FROM routes WHERE status = ? ORDER BY created_at DESC", [status])
}

export async function createRoute(routeData: RouteInput): Promise<number> {
  return insert("routes", routeData)
}

export async function updateRoute(id: number, routeData: Partial<RouteInput>): Promise<number> {
  return update("routes", routeData, "id = ?", [id])
}

export async function deleteRoute(id: number): Promise<number> {
  return remove("routes", "id = ?", [id])
}

export async function getRouteWaypoints(routeId: number): Promise<RouteWaypoint[]> {
  return query<RouteWaypoint[]>("SELECT * FROM route_waypoints WHERE route_id = ? ORDER BY sequence_number", [routeId])
}

export async function createRouteWithWaypoints(
  routeData: RouteInput,
  waypoints: Omit<RouteWaypointInput, "route_id">[],
): Promise<number> {
  return transaction(async (connection) => {
    // Insert route
    const [routeResult] = await connection.execute(
      `INSERT INTO routes (
        name, start_location_id, end_location_id, distance, 
        estimated_duration, status, optimization_algorithm, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        routeData.name,
        routeData.start_location_id,
        routeData.end_location_id,
        routeData.distance || null,
        routeData.estimated_duration || null,
        routeData.status || "planned",
        routeData.optimization_algorithm || null,
        routeData.user_id || null,
      ],
    )

    const routeId = (routeResult as mysql.ResultSetHeader).insertId

    // Insert waypoints
    for (const waypoint of waypoints) {
      await connection.execute(
        `INSERT INTO route_waypoints (
          route_id, location_id, sequence_number, estimated_arrival_time
        ) VALUES (?, ?, ?, ?)`,
        [routeId, waypoint.location_id, waypoint.sequence_number, waypoint.estimated_arrival_time || null],
      )
    }

    return routeId
  })
}

export async function getRouteWithWaypoints(routeId: number): Promise<{ route: Route; waypoints: RouteWaypoint[] }> {
  const route = await getRouteById(routeId)
  if (!route) {
    throw new Error(`Route with ID ${routeId} not found`)
  }

  const waypoints = await getRouteWaypoints(routeId)

  return { route, waypoints }
}
