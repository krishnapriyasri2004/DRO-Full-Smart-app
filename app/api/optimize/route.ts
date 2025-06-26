import { type NextRequest, NextResponse } from "next/server"
import { mergeSort, kruskalMST, solveTSP, assignDeliveries } from "@/lib/algorithms"
import type { Graph, Point, DeliveryPartner, DeliveryTask } from "@/lib/algorithms"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { algorithm, locations, partners, tasks } = data

    let result

    switch (algorithm) {
      case "divide_and_conquer":
        // Sort locations by distance from depot
        const depot = locations.find((loc) => loc.type === "depot")
        if (!depot) {
          return NextResponse.json({ error: "Depot location not found" }, { status: 400 })
        }

        const sortedLocations = mergeSort(
          locations.filter((loc) => loc.type !== "depot"),
          (a, b) => {
            const distA = Math.sqrt(Math.pow(a.lat - depot.lat, 2) + Math.pow(a.lng - depot.lng, 2))
            const distB = Math.sqrt(Math.pow(b.lat - depot.lat, 2) + Math.pow(b.lng - depot.lng, 2))
            return distA - distB
          },
        )

        result = {
          algorithm: "Divide and Conquer (Merge Sort)",
          sortedLocations: [depot, ...sortedLocations],
          routes: [
            {
              partnerId: partners[0].id,
              path: [depot.id, ...sortedLocations.map((loc) => loc.id), depot.id],
            },
          ],
        }
        break

      case "greedy":
        // Create a graph from locations
        const vertices = locations.length
        const edges: Graph["edges"] = []

        for (let i = 0; i < vertices; i++) {
          for (let j = i + 1; j < vertices; j++) {
            const weight = Math.sqrt(
              Math.pow(locations[i].lat - locations[j].lat, 2) + Math.pow(locations[i].lng - locations[j].lng, 2),
            )
            edges.push({
              source: i,
              target: j,
              weight,
            })
          }
        }

        const graph: Graph = { vertices, edges }
        const mst = kruskalMST(graph)

        // Convert MST to routes
        const depotIndex = locations.findIndex((loc) => loc.type === "depot")
        if (depotIndex === -1) {
          return NextResponse.json({ error: "Depot location not found" }, { status: 400 })
        }

        // Simple route creation from MST
        const route = [depotIndex]
        const visited = new Set([depotIndex])

        // DFS to create a route from the MST
        const adjacencyList: number[][] = Array(vertices)
          .fill(0)
          .map(() => [])
        for (const edge of mst) {
          adjacencyList[edge.source].push(edge.target)
          adjacencyList[edge.target].push(edge.source)
        }

        function dfs(node: number) {
          for (const neighbor of adjacencyList[node]) {
            if (!visited.has(neighbor)) {
              visited.add(neighbor)
              route.push(neighbor)
              dfs(neighbor)
            }
          }
        }

        dfs(depotIndex)
        route.push(depotIndex) // Return to depot

        result = {
          algorithm: "Greedy Method (Kruskal's Algorithm)",
          mst,
          routes: [
            {
              partnerId: partners[0].id,
              path: route.map((index) => locations[index].id),
            },
          ],
        }
        break

      case "dynamic":
        // Convert locations to points for TSP
        const points: Point[] = locations.map((loc, index) => ({
          id: loc.id,
          x: loc.lat,
          y: loc.lng,
        }))

        const tspPath = solveTSP(points)

        result = {
          algorithm: "Dynamic Programming (TSP)",
          path: tspPath.map((index) => locations[index].id),
          routes: [
            {
              partnerId: partners[0].id,
              path: tspPath.map((index) => locations[index].id),
            },
          ],
        }
        break

      case "backtracking":
        // Convert data for backtracking algorithm
        const deliveryPartners: DeliveryPartner[] = partners.map((p) => ({
          id: p.id,
          maxCapacity: p.capacity || 100,
          maxDistance: 1000, // Arbitrary large value
          currentLocation: {
            id: 0,
            x: locations.find((loc) => loc.type === "depot")?.lat || 0,
            y: locations.find((loc) => loc.type === "depot")?.lng || 0,
          },
        }))

        const deliveryTasks: DeliveryTask[] = locations
          .filter((loc) => loc.type !== "depot")
          .map((loc) => ({
            id: loc.id,
            location: {
              id: loc.id,
              x: loc.lat,
              y: loc.lng,
            },
            weight: 10, // Default weight
            priority: loc.priority || 1,
          }))

        const assignments = assignDeliveries(deliveryPartners, deliveryTasks)

        // Convert assignments to routes
        const depotId = locations.find((loc) => loc.type === "depot")?.id
        if (!depotId) {
          return NextResponse.json({ error: "Depot location not found" }, { status: 400 })
        }

        const backtrackingRoutes = assignments
          .map((assignment) => ({
            partnerId: assignment.partnerId,
            path: assignment.taskIds.length > 0 ? [depotId, ...assignment.taskIds, depotId] : [],
          }))
          .filter((route) => route.path.length > 0)

        result = {
          algorithm: "Backtracking (Constraint Satisfaction)",
          assignments,
          routes: backtrackingRoutes,
        }
        break

      default:
        return NextResponse.json({ error: "Invalid algorithm specified" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in route optimization:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
