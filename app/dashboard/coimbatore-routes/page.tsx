"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CoimbatoreMap from "@/components/coimbatore-map"
import { COIMBATORE_AREAS, calculateTravelTime } from "@/lib/coimbatore-mapping"

export default function CoimbatoreRoutesPage() {
  const [selectedTab, setSelectedTab] = useState("optimize")
  const [startLocation, setStartLocation] = useState("")
  const [destinations, setDestinations] = useState<string[]>([""])
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening">("morning")
  const [optimizedRoute, setOptimizedRoute] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Add a new destination input field
  const addDestination = () => {
    setDestinations([...destinations, ""])
  }

  // Update a destination at a specific index
  const updateDestination = (index: number, value: string) => {
    const newDestinations = [...destinations]
    newDestinations[index] = value
    setDestinations(newDestinations)
  }

  // Remove a destination at a specific index
  const removeDestination = (index: number) => {
    if (destinations.length > 1) {
      const newDestinations = [...destinations]
      newDestinations.splice(index, 1)
      setDestinations(newDestinations)
    }
  }

  // Simple greedy algorithm for route optimization
  // In a real app, you'd use a more sophisticated algorithm or API
  const optimizeRoute = () => {
    setIsLoading(true)

    // Simulate API call with timeout
    setTimeout(() => {
      try {
        // Get coordinates for start and all destinations
        const startCoords = COIMBATORE_AREAS[startLocation as keyof typeof COIMBATORE_AREAS]?.coordinates

        if (!startCoords) {
          throw new Error("Invalid start location")
        }

        const validDestinations = destinations
          .filter((dest) => dest && COIMBATORE_AREAS[dest as keyof typeof COIMBATORE_AREAS])
          .map((dest) => ({
            name: dest,
            coordinates: COIMBATORE_AREAS[dest as keyof typeof COIMBATORE_AREAS].coordinates,
          }))

        if (validDestinations.length === 0) {
          throw new Error("No valid destinations selected")
        }

        // Simple greedy algorithm - start from start point and always go to the nearest unvisited point
        let currentPoint = startCoords
        const route = [{ name: startLocation, coordinates: startCoords }]
        const remainingPoints = [...validDestinations]
        let totalTime = 0

        while (remainingPoints.length > 0) {
          // Find nearest point
          let nearestIdx = 0
          let minTime = Number.MAX_VALUE

          for (let i = 0; i < remainingPoints.length; i++) {
            const time = calculateTravelTime(currentPoint, remainingPoints[i].coordinates, timeOfDay)
            if (time < minTime) {
              minTime = time
              nearestIdx = i
            }
          }

          // Add nearest point to route
          const nextPoint = remainingPoints[nearestIdx]
          route.push(nextPoint)
          totalTime += minTime

          // Update current point and remove from remaining
          currentPoint = nextPoint.coordinates
          remainingPoints.splice(nearestIdx, 1)
        }

        // Add return to start if needed
        const returnTime = calculateTravelTime(currentPoint, startCoords, timeOfDay)
        totalTime += returnTime
        route.push({ name: `${startLocation} (Return)`, coordinates: startCoords })

        setOptimizedRoute({
          route,
          totalTime: Math.round(totalTime),
          points: route.map((point) => point.coordinates),
        })
      } catch (error) {
        console.error("Error optimizing route:", error)
        alert("Error optimizing route. Please check your selections.")
      } finally {
        setIsLoading(false)
      }
    }, 1500) // Simulate processing time
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Coimbatore Route Optimizer</h1>

      <Tabs defaultValue="optimize" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="optimize">Optimize Route</TabsTrigger>
          <TabsTrigger value="map">Coimbatore Map</TabsTrigger>
        </TabsList>

        <TabsContent value="optimize">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Route Parameters</CardTitle>
                <CardDescription>Enter your starting point and destinations in Coimbatore</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="startLocation">Starting Point</Label>
                    <Select value={startLocation} onValueChange={setStartLocation}>
                      <SelectTrigger id="startLocation">
                        <SelectValue placeholder="Select starting point" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(COIMBATORE_AREAS).map((key) => (
                          <SelectItem key={key} value={key}>
                            {COIMBATORE_AREAS[key as keyof typeof COIMBATORE_AREAS].name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Destinations</Label>
                    {destinations.map((dest, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Select value={dest} onValueChange={(value) => updateDestination(index, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={`Destination ${index + 1}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(COIMBATORE_AREAS).map((key) => (
                              <SelectItem key={key} value={key}>
                                {COIMBATORE_AREAS[key as keyof typeof COIMBATORE_AREAS].name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeDestination(index)}
                          disabled={destinations.length <= 1}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addDestination}>
                      Add Destination
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeOfDay">Time of Day</Label>
                    <Select
                      value={timeOfDay}
                      onValueChange={(value) => setTimeOfDay(value as "morning" | "afternoon" | "evening")}
                    >
                      <SelectTrigger id="timeOfDay">
                        <SelectValue placeholder="Select time of day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (Rush Hour)</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="evening">Evening (Rush Hour)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="button"
                    onClick={optimizeRoute}
                    disabled={!startLocation || destinations.some((d) => !d) || isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Optimizing..." : "Optimize Route"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimized Route</CardTitle>
                <CardDescription>The most efficient route through your destinations</CardDescription>
              </CardHeader>
              <CardContent>
                {optimizedRoute ? (
                  <div className="space-y-4">
                    <div className="h-[300px]">
                      <CoimbatoreMap
                        height="100%"
                        routes={[
                          {
                            id: "optimized-route",
                            points: optimizedRoute.points as [number, number][],
                            color: "#0070f3",
                            name: "Optimized Route",
                          },
                        ]}
                        markers={optimizedRoute.route.map((point: any, index: number) => ({
                          position: point.coordinates as [number, number],
                          title: `${index + 1}. ${point.name}`,
                        }))}
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Route Details:</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Estimated total time: <span className="font-medium">{optimizedRoute.totalTime} minutes</span>
                      </p>
                      <ol className="list-decimal list-inside space-y-1">
                        {optimizedRoute.route.map((point: any, index: number) => (
                          <li key={index} className="text-sm">
                            {point.name}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center text-gray-500">
                    <p>No route optimized yet.</p>
                    <p className="text-sm">Fill in the form and click "Optimize Route" to see results.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Coimbatore City Map</CardTitle>
              <CardDescription>Overview of major areas and landmarks in Coimbatore</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <CoimbatoreMap height="100%" showAllAreas={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
