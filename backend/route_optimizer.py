import numpy as np
import heapq
from typing import List, Dict, Tuple, Any, Optional
import json

# Data structures
class Location:
    def __init__(self, id: int, name: str, lat: float, lng: float, location_type: str = "delivery"):
        self.id = id
        self.name = name
        self.lat = lat
        self.lng = lng
        self.type = location_type  # "depot" or "delivery"
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "lat": self.lat,
            "lng": self.lng,
            "type": self.type
        }

class DeliveryPartner:
    def __init__(self, id: int, name: str, vehicle: str, capacity: int):
        self.id = id
        self.name = name
        self.vehicle = vehicle
        self.capacity = capacity
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "vehicle": self.vehicle,
            "capacity": self.capacity
        }

class Route:
    def __init__(self, partner_id: int, path: List[int], distance: float = 0):
        self.partner_id = partner_id
        self.path = path  # List of location IDs
        self.distance = distance
    
    def to_dict(self):
        return {
            "partnerId": self.partner_id,
            "path": self.path,
            "distance": self.distance
        }

# Utility functions
def calculate_distance(loc1: Location, loc2: Location) -> float:
    """Calculate Euclidean distance between two locations"""
    return np.sqrt((loc1.lat - loc2.lat)**2 + (loc1.lng - loc2.lng)**2)

def calculate_route_distance(locations: Dict[int, Location], path: List[int]) -> float:
    """Calculate the total distance of a route"""
    if len(path) < 2:
        return 0
    
    total_distance = 0
    for i in range(len(path) - 1):
        loc1 = locations[path[i]]
        loc2 = locations[path[i + 1]]
        total_distance += calculate_distance(loc1, loc2)
    
    return total_distance

# 1. Divide and Conquer - Merge Sort
def merge_sort(arr: List[Any], key=lambda x: x) -> List[Any]:
    """Sort array using merge sort (divide and conquer)"""
    if len(arr) <= 1:
        return arr
    
    # Divide
    mid = len(arr) // 2
    left = merge_sort(arr[:mid], key)
    right = merge_sort(arr[mid:], key)
    
    # Conquer (merge)
    return merge(left, right, key)

def merge(left: List[Any], right: List[Any], key=lambda x: x) -> List[Any]:
    """Merge two sorted arrays"""
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if key(left[i]) <= key(right[j]):
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result

def optimize_route_divide_conquer(locations: Dict[int, Location], partners: List[DeliveryPartner]) -> List[Route]:
    """Optimize routes using divide and conquer approach"""
    # Find depot
    depot = next((loc for loc in locations.values() if loc.type == "depot"), None)
    if not depot:
        raise ValueError("No depot found in locations")
    
    # Sort delivery locations by distance from depot
    delivery_locations = [loc for loc in locations.values() if loc.type == "delivery"]
    
    sorted_locations = merge_sort(
        delivery_locations,
        key=lambda loc: calculate_distance(depot, loc)
    )
    
    # Divide locations among partners
    routes = []
    if not partners:
        return routes
    
    locations_per_partner = len(sorted_locations) // len(partners)
    remainder = len(sorted_locations) % len(partners)
    
    start_idx = 0
    for i, partner in enumerate(partners):
        # Distribute remainder locations
        count = locations_per_partner + (1 if i < remainder else 0)
        if count == 0:
            continue
            
        partner_locations = sorted_locations[start_idx:start_idx + count]
        start_idx += count
        
        # Create route: depot -> locations -> depot
        path = [depot.id] + [loc.id for loc in partner_locations] + [depot.id]
        distance = calculate_route_distance(locations, path)
        
        routes.append(Route(partner.id, path, distance))
    
    return routes

# 2. Greedy Method - Kruskal's Algorithm
class DisjointSet:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int):
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return
        
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        else:
            self.parent[root_y] = root_x
            if self.rank[root_x] == self.rank[root_y]:
                self.rank[root_x] += 1

def kruskal_mst(locations: Dict[int, Location]) -> List[Tuple[int, int]]:
    """Find Minimum Spanning Tree using Kruskal's algorithm"""
    # Create list of all edges with weights
    edges = []
    location_ids = list(locations.keys())
    
    for i in range(len(location_ids)):
        for j in range(i + 1, len(location_ids)):
            loc1 = locations[location_ids[i]]
            loc2 = locations[location_ids[j]]
            weight = calculate_distance(loc1, loc2)
            edges.append((weight, i, j))
    
    # Sort edges by weight
    edges.sort()
    
    # Apply Kruskal's algorithm
    n = len(location_ids)
    disjoint_set = DisjointSet(n)
    mst = []
    
    for weight, u, v in edges:
        if disjoint_set.find(u) != disjoint_set.find(v):
            disjoint_set.union(u, v)
            mst.append((location_ids[u], location_ids[v]))
    
    return mst

def optimize_route_greedy(locations: Dict[int, Location], partners: List[DeliveryPartner]) -> List[Route]:
    """Optimize routes using greedy approach (Kruskal's algorithm)"""
    # Find depot
    depot = next((loc for loc in locations.values() if loc.type == "depot"), None)
    if not depot:
        raise ValueError("No depot found in locations")
    
    # Find MST
    mst = kruskal_mst(locations)
    
    # Convert MST to adjacency list
    adj_list = {loc_id: [] for loc_id in locations}
    for u, v in mst:
        adj_list[u].append(v)
        adj_list[v].append(u)
    
    # Create routes using DFS on MST
    routes = []
    if not partners:
        return routes
    
    # Divide the MST into connected components for each partner
    visited = set()
    
    for partner in partners:
        if len(visited) == len(locations):
            break
        
        # Find starting point (prefer depot if not visited)
        start = depot.id if depot.id not in visited else next((loc_id for loc_id in locations if loc_id not in visited), None)
        if start is None:
            continue
        
        # DFS to find path
        path = []
        stack = [start]
        local_visited = set()
        
        while stack:
            node = stack.pop()
            if node in local_visited:
                continue
                
            path.append(node)
            local_visited.add(node)
            visited.add(node)
            
            # Add neighbors to stack
            for neighbor in adj_list[node]:
                if neighbor not in local_visited:
                    stack.append(neighbor)
        
        # Ensure path starts and ends at depot
        if path[0] != depot.id:
            path = [depot.id] + path
        if path[-1] != depot.id:
            path.append(depot.id)
        
        distance = calculate_route_distance(locations, path)
        routes.append(Route(partner.id, path, distance))
    
    return routes

# 3. Dynamic Programming - Traveling Salesperson Problem
def solve_tsp_dp(locations: Dict[int, Location], start_id: int) -> List[int]:
    """Solve TSP using dynamic programming"""
    n = len(locations)
    location_ids = list(locations.keys())
    
    # Create distance matrix
    dist = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            if i != j:
                loc1 = locations[location_ids[i]]
                loc2 = locations[location_ids[j]]
                dist[i][j] = calculate_distance(loc1, loc2)
    
    # Map location IDs to indices
    id_to_idx = {loc_id: i for i, loc_id in enumerate(location_ids)}
    idx_to_id = {i: loc_id for i, loc_id in enumerate(location_ids)}
    
    start_idx = id_to_idx[start_id]
    
    # Initialize DP table
    # dp[mask][i] = min cost to visit all vertices in mask and end at vertex i
    dp = {}
    parent = {}
    
    # Base case: start at vertex start_idx
    for i in range(n):
        if i != start_idx:
            dp[(1 << start_idx) | (1 << i), i] = dist[start_idx][i]
            parent[(1 << start_idx) | (1 << i), i] = start_idx
    
    # Fill DP table
    for mask_size in range(3, n + 1):
        for mask in range(1 << n):
            if bin(mask).count('1') != mask_size:
                continue
                
            # Make sure start_idx is in the mask
            if not (mask & (1 << start_idx)):
                continue
                
            for i in range(n):
                if not (mask & (1 << i)) or i == start_idx:
                    continue
                    
                # Previous mask without vertex i
                prev_mask = mask ^ (1 << i)
                
                for j in range(n):
                    if not (prev_mask & (1 << j)) or j == i or j == start_idx:
                        continue
                        
                    # Check if we can get a better path to i by going through j
                    if (prev_mask, j) in dp:
                        cost = dp[(prev_mask, j)] + dist[j][i]
                        if (mask, i) not in dp or cost < dp[(mask, i)]:
                            dp[(mask, i)] = cost
                            parent[(mask, i)] = j
    
    # Find the optimal ending vertex
    end_mask = (1 << n) - 1
    min_cost = float('inf')
    end_vertex = -1
    
    for i in range(n):
        if i != start_idx and (end_mask, i) in dp:
            cost = dp[(end_mask, i)] + dist[i][start_idx]
            if cost < min_cost:
                min_cost = cost
                end_vertex = i
    
    if end_vertex == -1:
        return [start_id]  # No valid tour found
    
    # Reconstruct the path
    path = []
    mask = end_mask
    curr = end_vertex
    
    while curr != start_idx:
        path.append(idx_to_id[curr])
        new_curr = parent[(mask, curr)]
        mask ^= (1 << curr)
        curr = new_curr
    
    path.append(start_id)
    path.reverse()
    path.append(start_id)  # Return to start
    
    return path

def optimize_route_dynamic(locations: Dict[int, Location], partners: List[DeliveryPartner]) -> List[Route]:
    """Optimize routes using dynamic programming approach (TSP)"""
    # Find depot
    depot = next((loc for loc in locations.values() if loc.type == "depot"), None)
    if not depot:
        raise ValueError("No depot found in locations")
    
    # For small number of locations, solve TSP directly
    if len(locations) <= 15:
        path = solve_tsp_dp(locations, depot.id)
        distance = calculate_route_distance(locations, path)
        
        if partners:
            return [Route(partners[0].id, path, distance)]
        return []
    
    # For larger problems, divide locations and solve TSP for each subset
    delivery_locations = [loc for loc in locations.values() if loc.type == "delivery"]
    
    # Sort by distance from depot to create clusters
    sorted_locations = sorted(
        delivery_locations,
        key=lambda loc: calculate_distance(depot, loc)
    )
    
    routes = []
    if not partners:
        return routes
    
    # Divide locations among partners
    locations_per_partner = len(sorted_locations) // len(partners)
    remainder = len(sorted_locations) % len(partners)
    
    start_idx = 0
    for i, partner in enumerate(partners):
        # Distribute remainder locations
        count = locations_per_partner + (1 if i < remainder else 0)
        if count == 0:
            continue
            
        partner_locations = sorted_locations[start_idx:start_idx + count]
        start_idx += count
        
        # Create subset of locations including depot
        subset = {depot.id: depot}
        for loc in partner_locations:
            subset[loc.id] = loc
        
        # Solve TSP for this subset
        path = solve_tsp_dp(subset, depot.id)
        distance = calculate_route_distance(locations, path)
        
        routes.append(Route(partner.id, path, distance))
    
    return routes

# 4. Backtracking - Constraint Satisfaction
def is_valid_assignment(locations: Dict[int, Location], partner: DeliveryPartner, 
                       assigned_locations: List[int], new_location_id: int) -> bool:
    """Check if assigning a new location to a partner is valid"""
    # In a real system, we would check capacity, time windows, etc.
    # For this example, we'll just check a simple capacity constraint
    
    # Count total "weight" of assigned locations (using distance as proxy)
    depot = next((loc for loc in locations.values() if loc.type == "depot"), None)
    if not depot:
        return False
    
    total_distance = 0
    for loc_id in assigned_locations:
        loc = locations[loc_id]
        total_distance += calculate_distance(depot, loc)
    
    # Add new location
    new_loc = locations[new_location_id]
    total_distance += calculate_distance(depot, new_loc)
    
    # Check if total distance is within partner's capacity
    return total_distance <= partner.capacity * 10  # Arbitrary scaling factor

def backtrack_assign(locations: Dict[int, Location], partners: List[DeliveryPartner], 
                    delivery_ids: List[int], assignments: Dict[int, List[int]], 
                    location_idx: int) -> bool:
    """Recursively assign locations to partners using backtracking"""
    # Base case: all locations assigned
    if location_idx >= len(delivery_ids):
        return True
    
    location_id = delivery_ids[location_idx]
    
    # Try assigning to each partner
    for partner in partners:
        if is_valid_assignment(locations, partner, assignments[partner.id], location_id):
            # Try this assignment
            assignments[partner.id].append(location_id)
            
            # Recursively assign the next location
            if backtrack_assign(locations, partners, delivery_ids, assignments, location_idx + 1):
                return True
            
            # If we couldn't assign all locations with this choice, backtrack
            assignments[partner.id].remove(location_id)
    
    # If we tried all partners and couldn't assign this location, return false
    return False

def optimize_route_backtracking(locations: Dict[int, Location], partners: List[DeliveryPartner]) -> List[Route]:
    """Optimize routes using backtracking approach"""
    # Find depot
    depot = next((loc for loc in locations.values() if loc.type == "depot"), None)
    if not depot:
        raise ValueError("No depot found in locations")
    
    # Get delivery location IDs
    delivery_ids = [loc.id for loc in locations.values() if loc.type == "delivery"]
    
    # Sort by some priority (e.g., distance from depot)
    delivery_ids.sort(key=lambda loc_id: calculate_distance(depot, locations[loc_id]))
    
    # Initialize assignments
    assignments = {partner.id: [] for partner in partners}
    
    # Perform backtracking assignment
    success = backtrack_assign(locations, partners, delivery_ids, assignments, 0)
    
    # If backtracking failed, use a greedy approach
    if not success:
        # Simple greedy assignment: round-robin
        for i, loc_id in enumerate(delivery_ids):
            partner_idx = i % len(partners)
            assignments[partners[partner_idx].id].append(loc_id)
    
    # Convert assignments to routes
    routes = []
    for partner in partners:
        if not assignments[partner.id]:
            continue
            
        # For each partner, optimize the route of their assigned locations
        subset = {depot.id: depot}
        for loc_id in assignments[partner.id]:
            subset[loc_id] = locations[loc_id]
        
        if len(subset) <= 2:
            # Only depot and one location
            path = [depot.id] + assignments[partner.id] + [depot.id]
        else:
            # Solve TSP for this subset
            path = solve_tsp_dp(subset, depot.id)
        
        distance = calculate_route_distance(locations, path)
        routes.append(Route(partner.id, path, distance))
    
    return routes

# Main optimization function
def optimize_routes(locations_data: List[Dict], partners_data: List[Dict], algorithm: str) -> Dict:
    """Main function to optimize routes based on the selected algorithm"""
    # Convert input data to objects
    locations = {}
    for loc_data in locations_data:
        loc = Location(
            id=loc_data["id"],
            name=loc_data["name"],
            lat=loc_data["lat"],
            lng=loc_data["lng"],
            location_type=loc_data.get("type", "delivery")
        )
        locations[loc.id] = loc
    
    partners = []
    for partner_data in partners_data:
        partner = DeliveryPartner(
            id=partner_data["id"],
            name=partner_data["name"],
            vehicle=partner_data.get("vehicle", "Car"),
            capacity=partner_data.get("capacity", 100)
        )
        partners.append(partner)
    
    # Select algorithm and optimize
    if algorithm == "divide_and_conquer":
        routes = optimize_route_divide_conquer(locations, partners)
        algo_name = "Divide and Conquer (Merge Sort)"
    elif algorithm == "greedy":
        routes = optimize_route_greedy(locations, partners)
        algo_name = "Greedy Method (Kruskal's Algorithm)"
    elif algorithm == "dynamic":
        routes = optimize_route_dynamic(locations, partners)
        algo_name = "Dynamic Programming (TSP)"
    elif algorithm == "backtracking":
        routes = optimize_route_backtracking(locations, partners)
        algo_name = "Backtracking (Constraint Satisfaction)"
    else:
        raise ValueError(f"Unknown algorithm: {algorithm}")
    
    # Convert results to dictionary
    result = {
        "algorithm": algo_name,
        "routes": [route.to_dict() for route in routes]
    }
    
    return result

# Example usage
if __name__ == "__main__":
    # Sample data
    locations_data = [
        {"id": 1, "name": "Warehouse", "lat": 40.7128, "lng": -74.006, "type": "depot"},
        {"id": 2, "name": "Customer A", "lat": 40.7282, "lng": -73.9942, "type": "delivery"},
        {"id": 3, "name": "Customer B", "lat": 40.7031, "lng": -74.0102, "type": "delivery"},
        {"id": 4, "name": "Customer C", "lat": 40.7214, "lng": -73.9896, "type": "delivery"},
        {"id": 5, "name": "Customer D", "lat": 40.7069, "lng": -74.0113, "type": "delivery"},
    ]
    
    partners_data = [
        {"id": 1, "name": "John Doe", "vehicle": "Bike", "capacity": 5},
        {"id": 2, "name": "Jane Smith", "vehicle": "Car", "capacity": 10},
    ]
    
    # Test each algorithm
    algorithms = ["divide_and_conquer", "greedy", "dynamic", "backtracking"]
    
    for algo in algorithms:
        result = optimize_routes(locations_data, partners_data, algo)
        print(f"\n{result['algorithm']} Results:")
        for i, route in enumerate(result["routes"]):
            print(f"Route {i+1}: {route['path']} (Distance: {route['distance']:.2f})")
