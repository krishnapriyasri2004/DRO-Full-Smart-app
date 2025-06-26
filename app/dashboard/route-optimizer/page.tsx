"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, Plus, Trash2, Save, Download, Upload, Settings, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  COIMBATORE_CENTER,
  COIMBATORE_AREAS,
  COIMBATORE_LANDMARKS,
  generateSampleLocations,
  calculateDistance,
  estimateTravelTime,
} from "@/lib/coimbatore-map-utils"

// Generate sample locations in Coimbatore
const initialLocations = generateSampleLocations(8)

// Mock data for delivery partners
const deliveryPartners = [
  { id: 1, name: "Rajesh Kumar", vehicle: "Bike", capacity: 5, color: "#4ade80" },
  { id: 2, name: "Priya Sharma", vehicle: "Car", capacity: 10, color: "#60a5fa" },
  { id: 3, name: "Mohan Singh", vehicle: "Van", capacity: 20, color: "#f97316" },
]

// Algorithm options
const algorithms = [
  { id: "greedy", name: "Greedy Algorithm", description: "Fast solution using Kruskal's algorithm" },
  { id: "dynamic", name: "Dynamic Programming", description: "Optimal solution for TSP" },
  { id: "divide", name: "Divide & Conquer", description: "Efficient sorting and partitioning" },
  { id: "backtracking", name: "Backtracking", description: "Constraint-based assignment" },
]

export default function RouteOptimizer() {
  const [locations, setLocations] = useState(initialLocations)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("greedy")
  const [isSimulating, setIsSimulating] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [routes, setRoutes] = useState<any[]>([])
  const [newLocation, setNewLocation] = useState({ name: "", type: "delivery" })
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  // Initialize the canvas when component mounts
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      // Set canvas dimensions
      const resizeCanvas = () => {
        const parent = canvas.parentElement
        if (parent) {
          canvas.width = parent.clientWidth
          canvas.height = parent.clientHeight
          drawMap()
        }
      }

      resizeCanvas()
      window.addEventListener("resize", resizeCanvas)

      return () => {
        window.removeEventListener("resize", resizeCanvas)
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Update the canvas when locations or routes change
  useEffect(() => {
    drawMap()
  }, [locations, routes])

  // Draw the map with locations and routes
  const drawMap = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate bounds
    const padding = 50
    const minLat = Math.min(...locations.map((loc) => loc.lat))
    const maxLat = Math.max(...locations.map((loc) => loc.lat))
    const minLng = Math.min(...locations.map((loc) => loc.lng))
    const maxLng = Math.max(...locations.map((loc) => loc.lng))

    // Scale factor
    const latRange = maxLat - minLat || 0.01
    const lngRange = maxLng - minLng || 0.01
    const xScale = (canvas.width - padding * 2) / lngRange
    const yScale = (canvas.height - padding * 2) / latRange

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * (canvas.width - padding * 2)
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, canvas.height - padding)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = padding + (i / 10) * (canvas.height - padding * 2)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.stroke()
    }

    // Draw major areas of Coimbatore (as circles with labels)
    COIMBATORE_AREAS.forEach((area) => {
      const x = padding + (area.lng - minLng) * xScale
      const y = padding + (maxLat - area.lat) * yScale

      // Draw area circle
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.fill()

      // Draw area name
      ctx.font = "10px Arial"
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
      ctx.textAlign = "center"
      ctx.fillText(area.name, x, y - 8)
    })

    // Draw landmarks
    COIMBATORE_LANDMARKS.forEach((landmark) => {
      const x = padding + (landmark.lng - minLng) * xScale
      const y = padding + (maxLat - landmark.lat) * yScale

      // Draw landmark
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 215, 0, 0.6)" // Gold color for landmarks
      ctx.fill()
    })

    // Draw routes
    routes.forEach((route, index) => {
      const partner = deliveryPartners[index % deliveryPartners.length]
      ctx.strokeStyle = partner.color
      ctx.lineWidth = 2

      if (route.path && route.path.length > 1) {
        ctx.beginPath()

        route.path.forEach((locId: number, i: number) => {
          const location = locations.find((l) => l.id === locId)
          if (!location) return

          const x = padding + (location.lng - minLng) * xScale
          const y = padding + (maxLat - location.lat) * yScale

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        })

        ctx.stroke()
      }
    })

    // Draw locations
    locations.forEach((location) => {
      const x = padding + (location.lng - minLng) * xScale
      const y = padding + (maxLat - location.lat) * yScale

      // Draw point
      ctx.beginPath()
      ctx.arc(x, y, location.type === "depot" ? 8 : 6, 0, Math.PI * 2)
      ctx.fillStyle = location.type === "depot" ? "#f97316" : "#60a5fa"
      ctx.fill()

      // Draw label
      ctx.font = "12px Arial"
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      ctx.fillText(location.name, x, y - 12)
    })
  }

  // Start the simulation
  const startSimulation = () => {
    setIsSimulating(true)
    setOptimizationProgress(0)
    setRoutes([])

    // Simulate optimization progress
    const interval = setInterval(() => {
      setOptimizationProgress((prev) => {
        const newProgress = prev + Math.random() * 5
        if (newProgress >= 100) {
          clearInterval(interval)
          generateRoutes()
          return 100
        }
        return newProgress
      })
    }, 100)
  }

  // Stop the simulation
  const stopSimulation = () => {
    setIsSimulating(false)
  }

  // Reset the simulation
  const resetSimulation = () => {
    setIsSimulating(false)
    setOptimizationProgress(0)
    setRoutes([])
  }

  // Generate routes based on the selected algorithm
  const generateRoutes = () => {
    // In a real application, this would call the Python backend
    // For now, we'll generate mock routes

    const depot = locations.find((loc) => loc.type === "depot")
    if (!depot) return

    const deliveryLocations = locations.filter((loc) => loc.type === "delivery")

    // Different route generation based on algorithm
    const generatedRoutes = []

    switch (selectedAlgorithm) {
      case "greedy":
        // Simple greedy algorithm - assign locations to partners in order
        const locationsPerPartner = Math.ceil(deliveryLocations.length / deliveryPartners.length)

        for (let i = 0; i < deliveryPartners.length; i++) {
          const partnerLocations = deliveryLocations.slice(
            i * locationsPerPartner,
            Math.min((i + 1) * locationsPerPartner, deliveryLocations.length),
          )

          if (partnerLocations.length > 0) {
            generatedRoutes.push({
              partnerId: deliveryPartners[i].id,
              path: [depot.id, ...partnerLocations.map((loc) => loc.id), depot.id],
            })
          }
        }
        break

      case "dynamic":
        // For demo purposes, create a single optimized route
        const shuffled = [...deliveryLocations].sort(() => 0.5 - Math.random())
        generatedRoutes.push({
          partnerId: deliveryPartners[0].id,
          path: [depot.id, ...shuffled.map((loc) => loc.id), depot.id],
        })
        break

      case "divide":
        // Split into two routes
        const sorted = [...deliveryLocations].sort((a, b) => a.lng - b.lng)
        const midpoint = Math.floor(sorted.length / 2)

        generatedRoutes.push({
          partnerId: deliveryPartners[0].id,
          path: [depot.id, ...sorted.slice(0, midpoint).map((loc) => loc.id), depot.id],
        })

        if (midpoint < sorted.length) {
          generatedRoutes.push({
            partnerId: deliveryPartners[1].id,
            path: [depot.id, ...sorted.slice(midpoint).map((loc) => loc.id), depot.id],
          })
        }
        break

      case "backtracking":
        // Create routes based on location proximity
        const clusters = []
        const clusterCount = Math.min(3, deliveryPartners.length)

        // Simple clustering for demo
        for (let i = 0; i < clusterCount; i++) {
          clusters.push([])
        }

        deliveryLocations.forEach((loc, index) => {
          clusters[index % clusterCount].push(loc)
        })

        clusters.forEach((cluster, i) => {
          if (cluster.length > 0) {
            generatedRoutes.push({
              partnerId: deliveryPartners[i].id,
              path: [depot.id, ...cluster.map((loc) => loc.id), depot.id],
            })
          }
        })
        break
    }

    setRoutes(generatedRoutes)
  }

  // Add a new location
  const addLocation = () => {
    if (!newLocation.name) return

    // If an area is selected, use its coordinates
    let newLat = COIMBATORE_CENTER.lat
    let newLng = COIMBATORE_CENTER.lng

    if (selectedArea) {
      const area = COIMBATORE_AREAS.find((a) => a.name === selectedArea)
      if (area) {
        newLat = area.lat
        newLng = area.lng

        // Add a small random offset to avoid exact overlap
        newLat += (Math.random() - 0.5) * 0.01
        newLng += (Math.random() - 0.5) * 0.01
      }
    } else {
      // Generate random coordinates within Coimbatore
      newLat = 10.9168 + Math.random() * 0.2
      newLng = 76.8558 + Math.random() * 0.2
    }

    const newLoc = {
      id: Math.max(...locations.map((loc) => loc.id)) + 1,
      name: newLocation.name,
      lat: newLat,
      lng: newLng,
      type: newLocation.type,
    }

    setLocations([...locations, newLoc])
    setNewLocation({ name: "", type: "delivery" })
    setSelectedArea(null)
  }

  // Remove a location
  const removeLocation = (id: number) => {
    setLocations(locations.filter((loc) => loc.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold">Coimbatore Route Optimizer</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600">
            <Save className="mr-2 h-4 w-4" />
            Save Routes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div className="space-y-6">
          {/* Algorithm selection */}
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Optimization Algorithm</CardTitle>
              <CardDescription className="text-slate-400">Select an algorithm for route optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {algorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedAlgorithm === algorithm.id
                        ? "bg-emerald-900/30 border-emerald-500"
                        : "bg-slate-900/50 border-slate-700 hover:border-slate-600"
                    }`}
                    onClick={() => setSelectedAlgorithm(algorithm.id)}
                  >
                    <div className="font-medium">{algorithm.name}</div>
                    <div className="text-sm text-slate-400 mt-1">{algorithm.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Locations */}
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Locations in Coimbatore</CardTitle>
              <CardDescription className="text-slate-400">Manage delivery locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Location name"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <Select
                    value={newLocation.type}
                    onValueChange={(value) => setNewLocation({ ...newLocation, type: value })}
                  >
                    <SelectTrigger className="w-32 bg-slate-900 border-slate-700 text-white">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem value="depot">Depot</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={selectedArea || "random"} onValueChange={setSelectedArea}>
                    <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-white">
                      <SelectValue placeholder="Select area in Coimbatore" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem value="random">Random Location</SelectItem>
                      {COIMBATORE_AREAS.map((area) => (
                        <SelectItem key={area.name} value={area.name}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={addLocation} className="w-full bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Location
                </Button>

                <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 border border-slate-700"
                    >
                      <div>
                        <div className="font-medium">{location.name}</div>
                        <div className="text-xs text-slate-400">
                          {location.type === "depot" ? "Depot" : "Delivery Point"}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeLocation(location.id)}
                        className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Partners */}
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Delivery Partners</CardTitle>
              <CardDescription className="text-slate-400">Available delivery personnel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {deliveryPartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex items-center p-2 rounded-lg bg-slate-900/50 border border-slate-700"
                  >
                    <div
                      className="h-8 w-8 rounded-full mr-3 flex items-center justify-center text-white"
                      style={{ backgroundColor: partner.color }}
                    >
                      {partner.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{partner.name}</div>
                      <div className="text-xs text-slate-400">
                        {partner.vehicle} • Capacity: {partner.capacity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map */}
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader className="border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Coimbatore Route Map</CardTitle>
                  <CardDescription className="text-slate-400">
                    Visualization of delivery routes in Coimbatore
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {isSimulating ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={stopSimulation}
                      className="border-slate-700 hover:bg-slate-700"
                    >
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={startSimulation}
                      className="border-slate-700 hover:bg-slate-700"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetSimulation}
                    className="border-slate-700 hover:bg-slate-700"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8 border-slate-700 hover:bg-slate-700">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-slate-700 text-white">
                        <p>Map Settings</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8 border-slate-700 hover:bg-slate-700">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-slate-700 text-white">
                        <p>Map Legend</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <canvas ref={canvasRef} className="w-full h-[400px]"></canvas>

                {isSimulating && optimizationProgress < 100 && (
                  <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center">
                    <div className="text-lg font-bold mb-2">Optimizing Routes in Coimbatore...</div>
                    <div className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${optimizationProgress}%` }}></div>
                    </div>
                    <div className="mt-2 text-sm text-slate-400">{Math.round(optimizationProgress)}% Complete</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Optimization Results</CardTitle>
              <CardDescription className="text-slate-400">
                Generated routes and statistics for Coimbatore
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="routes">
                <TabsList className="bg-slate-900 border border-slate-700">
                  <TabsTrigger
                    value="routes"
                    className="data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
                  >
                    Routes
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
                  >
                    Statistics
                  </TabsTrigger>
                  <TabsTrigger
                    value="comparison"
                    className="data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
                  >
                    Algorithm Comparison
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="routes" className="mt-4">
                  {routes.length > 0 ? (
                    <div className="space-y-4">
                      {routes.map((route, index) => {
                        const partner =
                          deliveryPartners.find((p) => p.id === route.partnerId) ||
                          deliveryPartners[index % deliveryPartners.length]

                        // Calculate total distance for this route
                        let totalDistance = 0
                        let totalTime = 0

                        for (let i = 0; i < route.path.length - 1; i++) {
                          const locA = locations.find((l) => l.id === route.path[i])
                          const locB = locations.find((l) => l.id === route.path[i + 1])

                          if (locA && locB) {
                            const distance = calculateDistance(locA.lat, locA.lng, locB.lat, locB.lng)
                            totalDistance += distance
                            totalTime += estimateTravelTime(locA.lat, locA.lng, locB.lat, locB.lng)
                          }
                        }

                        return (
                          <div key={index} className="p-3 rounded-lg border border-slate-700 bg-slate-900/50">
                            <div className="flex items-center mb-2">
                              <div
                                className="h-6 w-6 rounded-full mr-2"
                                style={{ backgroundColor: partner.color }}
                              ></div>
                              <div className="font-medium">{partner.name}</div>
                            </div>
                            <div className="text-sm">
                              <span className="text-slate-400">Route: </span>
                              {route.path.map((locId: number, i: number) => {
                                const location = locations.find((l) => l.id === locId)
                                return location ? (
                                  <span key={i}>
                                    {location.name}
                                    {i < route.path.length - 1 && " → "}
                                  </span>
                                ) : null
                              })}
                            </div>
                            <div className="text-sm mt-1">
                              <span className="text-slate-400">Stops: </span>
                              {route.path.length - 2} deliveries
                            </div>
                            <div className="text-sm mt-1">
                              <span className="text-slate-400">Distance: </span>
                              {totalDistance.toFixed(2)} km
                            </div>
                            <div className="text-sm mt-1">
                              <span className="text-slate-400">Est. Time: </span>
                              {Math.floor(totalTime / 60)} hr {Math.round(totalTime % 60)} min
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      {isSimulating ? (
                        <div>Calculating optimal routes in Coimbatore...</div>
                      ) : (
                        <div>
                          <div className="mb-2">No routes generated yet</div>
                          <Button onClick={startSimulation} className="bg-emerald-500 hover:bg-emerald-600">
                            <Play className="mr-2 h-4 w-4" />
                            Start Optimization
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="stats" className="mt-4">
                  {routes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border border-slate-700 bg-slate-900/50">
                        <div className="text-sm text-slate-400 mb-1">Total Distance</div>
                        <div className="text-2xl font-bold">42.8 km</div>
                      </div>
                      <div className="p-4 rounded-lg border border-slate-700 bg-slate-900/50">
                        <div className="text-sm text-slate-400 mb-1">Estimated Time</div>
                        <div className="text-2xl font-bold">1h 45m</div>
                      </div>
                      <div className="p-4 rounded-lg border border-slate-700 bg-slate-900/50">
                        <div className="text-sm text-slate-400 mb-1">Fuel Consumption</div>
                        <div className="text-2xl font-bold">5.2 L</div>
                      </div>
                      <div className="p-4 rounded-lg border border-slate-700 bg-slate-900/50">
                        <div className="text-sm text-slate-400 mb-1">CO₂ Emissions</div>
                        <div className="text-2xl font-bold">12.4 kg</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">Run the optimization to see statistics</div>
                  )}
                </TabsContent>

                <TabsContent value="comparison" className="mt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Algorithm</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Distance</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Time</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Computation</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-700">
                          <td className="py-3 px-4">Greedy Algorithm</td>
                          <td className="py-3 px-4">42.8 km</td>
                          <td className="py-3 px-4">1h 45m</td>
                          <td className="py-3 px-4">0.2s</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-3 px-4">Dynamic Programming</td>
                          <td className="py-3 px-4">38.2 km</td>
                          <td className="py-3 px-4">1h 32m</td>
                          <td className="py-3 px-4">1.5s</td>
                        </tr>
                        <tr className="border-b border-slate-700">
                          <td className="py-3 px-4">Divide & Conquer</td>
                          <td className="py-3 px-4">40.5 km</td>
                          <td className="py-3 px-4">1h 38m</td>
                          <td className="py-3 px-4">0.8s</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4">Backtracking</td>
                          <td className="py-3 px-4">37.9 km</td>
                          <td className="py-3 px-4">1h 30m</td>
                          <td className="py-3 px-4">2.3s</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
