// This file contains the implementation of the algorithms used in the route optimization system

// Divide and Conquer - Merge Sort
export function mergeSort<T>(arr: T[], compareFn: (a: T, b: T) => number): T[] {
  if (arr.length <= 1) {
    return arr
  }

  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid), compareFn)
  const right = mergeSort(arr.slice(mid), compareFn)

  return merge(left, right, compareFn)
}

function merge<T>(left: T[], right: T[], compareFn: (a: T, b: T) => number): T[] {
  const result: T[] = []
  let leftIndex = 0
  let rightIndex = 0

  while (leftIndex < left.length && rightIndex < right.length) {
    if (compareFn(left[leftIndex], right[rightIndex]) <= 0) {
      result.push(left[leftIndex])
      leftIndex++
    } else {
      result.push(right[rightIndex])
      rightIndex++
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex))
}

// Greedy Method - Kruskal's Algorithm for Minimum Spanning Tree
export interface Edge {
  source: number
  target: number
  weight: number
}

export interface Graph {
  vertices: number
  edges: Edge[]
}

export function kruskalMST(graph: Graph): Edge[] {
  // Sort edges by weight (ascending)
  const sortedEdges = [...graph.edges].sort((a, b) => a.weight - b.weight)
  const parent: number[] = []
  const mst: Edge[] = []

  // Initialize parent array (each vertex is its own parent initially)
  for (let i = 0; i < graph.vertices; i++) {
    parent[i] = i
  }

  // Find function for Union-Find
  function find(i: number): number {
    if (parent[i] !== i) {
      parent[i] = find(parent[i])
    }
    return parent[i]
  }

  // Union function for Union-Find
  function union(x: number, y: number): void {
    parent[find(x)] = find(y)
  }

  // Process edges in ascending order of weight
  for (const edge of sortedEdges) {
    const sourceRoot = find(edge.source)
    const targetRoot = find(edge.target)

    // If including this edge doesn't create a cycle, add it to MST
    if (sourceRoot !== targetRoot) {
      mst.push(edge)
      union(sourceRoot, targetRoot)
    }

    // Stop when MST has (vertices-1) edges
    if (mst.length === graph.vertices - 1) {
      break
    }
  }

  return mst
}

// Dynamic Programming - Traveling Salesperson Problem
export interface Point {
  id: number
  x: number
  y: number
}

export function solveTSP(points: Point[]): number[] {
  const n = points.length
  if (n <= 1) return [0]

  // Calculate distances between all pairs of points
  const dist: number[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0))
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      dist[i][j] = Math.sqrt(Math.pow(points[i].x - points[j].x, 2) + Math.pow(points[i].y - points[j].y, 2))
    }
  }

  // Initialize DP table
  // dp[mask][i] = min cost to visit all vertices in mask and end at vertex i
  const INFINITY = Number.MAX_SAFE_INTEGER
  const dp: number[][] = Array(1 << n)
    .fill(0)
    .map(() => Array(n).fill(INFINITY))
  const parent: number[][] = Array(1 << n)
    .fill(0)
    .map(() => Array(n).fill(-1))

  // Base case: start at vertex 0
  dp[1][0] = 0 // 1 = binary 0001 = only vertex 0 visited

  // Fill DP table
  for (let mask = 1; mask < 1 << n; mask++) {
    for (let i = 0; i < n; i++) {
      // If vertex i is not in the mask, skip
      if (!(mask & (1 << i))) continue

      // Previous mask without vertex i
      const prevMask = mask ^ (1 << i)

      // If prevMask is 0, it means i is the only vertex in the mask
      if (prevMask === 0) continue

      // Try all possible previous vertices
      for (let j = 0; j < n; j++) {
        // If j is not in prevMask, skip
        if (!(prevMask & (1 << j))) continue

        // Check if we can get a better path to i by going through j
        if (dp[prevMask][j] + dist[j][i] < dp[mask][i]) {
          dp[mask][i] = dp[prevMask][j] + dist[j][i]
          parent[mask][i] = j
        }
      }
    }
  }

  // Find the optimal ending vertex
  const endMask = (1 << n) - 1 // All vertices visited
  let endVertex = 0
  for (let i = 1; i < n; i++) {
    if (dp[endMask][i] + dist[i][0] < dp[endMask][endVertex] + dist[endVertex][0]) {
      endVertex = i
    }
  }

  // Reconstruct the path
  const path: number[] = [endVertex]
  let currMask = endMask
  let currVertex = endVertex

  while (path.length < n) {
    const prevVertex = parent[currMask][currVertex]
    path.unshift(prevVertex)
    currMask ^= 1 << currVertex
    currVertex = prevVertex
  }

  // Add the starting vertex at the end to complete the cycle
  path.push(0)

  return path
}

// Backtracking - Constraint Satisfaction for Delivery Assignment
export interface DeliveryPartner {
  id: number
  maxCapacity: number
  maxDistance: number
  currentLocation: Point
}

export interface DeliveryTask {
  id: number
  location: Point
  weight: number
  priority: number
}

export interface Assignment {
  partnerId: number
  taskIds: number[]
}

export function assignDeliveries(partners: DeliveryPartner[], tasks: DeliveryTask[]): Assignment[] {
  const assignments: Assignment[] = partners.map((p) => ({
    partnerId: p.id,
    taskIds: [],
  }))

  // Sort tasks by priority (descending)
  const sortedTasks = [...tasks].sort((a, b) => b.priority - a.priority)

  // Helper function to calculate distance between points
  const distance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
  }

  // Helper function to check if a partner can handle a task
  const canAssign = (partner: DeliveryPartner, task: DeliveryTask, currentAssignment: number[]): boolean => {
    // Check weight capacity
    const currentWeight = currentAssignment.reduce((sum, taskId) => sum + tasks.find((t) => t.id === taskId)!.weight, 0)
    if (currentWeight + task.weight > partner.maxCapacity) {
      return false
    }

    // Check distance constraint
    const dist = distance(partner.currentLocation, task.location)
    if (dist > partner.maxDistance) {
      return false
    }

    return true
  }

  // Backtracking function to assign tasks
  const backtrack = (taskIndex: number): boolean => {
    // Base case: all tasks assigned
    if (taskIndex >= sortedTasks.length) {
      return true
    }

    const task = sortedTasks[taskIndex]

    // Try assigning to each partner
    for (let i = 0; i < partners.length; i++) {
      if (canAssign(partners[i], task, assignments[i].taskIds)) {
        // Try this assignment
        assignments[i].taskIds.push(task.id)

        // Recursively assign the next task
        if (backtrack(taskIndex + 1)) {
          return true
        }

        // If we couldn't assign all tasks with this choice, backtrack
        assignments[i].taskIds.pop()
      }
    }

    // If we tried all partners and couldn't assign this task, return false
    return false
  }

  // Start backtracking from the first task
  const success = backtrack(0)

  // If we couldn't assign all tasks, use a greedy approach as fallback
  if (!success) {
    // Reset assignments
    for (let i = 0; i < assignments.length; i++) {
      assignments[i].taskIds = []
    }

    // Assign each task to the partner with the most remaining capacity
    for (const task of sortedTasks) {
      let bestPartnerIndex = -1
      let maxRemainingCapacity = -1

      for (let i = 0; i < partners.length; i++) {
        const currentWeight = assignments[i].taskIds.reduce(
          (sum, taskId) => sum + tasks.find((t) => t.id === taskId)!.weight,
          0,
        )
        const remainingCapacity = partners[i].maxCapacity - currentWeight

        if (remainingCapacity >= task.weight && remainingCapacity > maxRemainingCapacity) {
          bestPartnerIndex = i
          maxRemainingCapacity = remainingCapacity
        }
      }

      if (bestPartnerIndex !== -1) {
        assignments[bestPartnerIndex].taskIds.push(task.id)
      }
    }
  }

  return assignments
}
