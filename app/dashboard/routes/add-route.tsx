"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Map, Plus, Trash2, ArrowRight, Save, RotateCcw, Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface DeliveryPoint {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  notes?: string
  estimatedTime?: number
}

export default function AddRoute() {
  const [routeName, setRouteName] = useState("")
  const [algorithm, setAlgorithm] = useState("greedy")
  const [vehicleType, setVehicleType] = useState("van")
  const [startingPoint, setStartingPoint] = useState("")
  const [startingPointCoords, setStartingPointCoords] = useState({ lat: 11.0168, lng: 76.9558 }) // Default Coimbatore
  const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPoint[]>([])
  const [newPoint, setNewPoint] = useState({
    name: "",
    address: "",
    lat: "",
    lng: "",
    notes: "",
    estimatedTime: "",
  })
  const [optimizeForTraffic, setOptimizeForTraffic] = useState(true)
  const [avoidTolls, setAvoidTolls] = useState(false)
  const [preferHighways, setPreferHighways] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddPoint = () => {
    if (!newPoint.name || !newPoint.address || !newPoint.lat || !newPoint.lng) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for the delivery point.",
        variant: "destructive",
      })
      return
    }

    const point: DeliveryPoint = {
      id: `point-${Date.now()}`,
      name: newPoint.name,
      address: newPoint.address,
      lat: Number.parseFloat(newPoint.lat),
      lng: Number.parseFloat(newPoint.lng),
      notes: newPoint.notes || undefined,
      estimatedTime: newPoint.estimatedTime ? Number.parseInt(newPoint.estimatedTime) : undefined,
    }

    setDeliveryPoints([...deliveryPoints, point])
    setNewPoint({
      name: "",
      address: "",
      lat: "",
      lng: "",
      notes: "",
      estimatedTime: "",
    })

    toast({
      title: "Delivery Point Added",
      description: `${point.name} has been added to the route.`,
    })
  }

  const handleRemovePoint = (id: string) => {
    setDeliveryPoints(deliveryPoints.filter((point) => point.id !== id))
    toast({
      title: "Delivery Point Removed",
      description: "The delivery point has been removed from the route.",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!routeName || !startingPoint || deliveryPoints.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and add at least one delivery point.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Here you would normally send the data to your server
      // For now, we'll simulate a server request
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Route Created",
        description: `${routeName} has been created successfully with ${deliveryPoints.length} delivery points.`,
      })

      // Reset form
      setRouteName("")
      setAlgorithm("greedy")
      setVehicleType("van")
      setStartingPoint("")
      setStartingPointCoords({ lat: 11.0168, lng: 76.9558 })
      setDeliveryPoints([])
      setOptimizeForTraffic(true)
      setAvoidTolls(false)
      setPreferHighways(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create route. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSearchLocation = (type: "starting" | "delivery") => {
    // In a real application, this would use a geocoding service
    // For now, we'll simulate finding coordinates for Coimbatore landmarks

    const searchTerm = type === "starting" ? startingPoint : newPoint.name

    if (!searchTerm) {
      toast({
        title: "Empty Search",
        description: "Please enter a location name to search.",
        variant: "destructive",
      })
      return
    }

    // Simulate geocoding with random coordinates near Coimbatore
    const baseCoords = { lat: 11.0168, lng: 76.9558 } // Coimbatore center
    const randomOffset = () => (Math.random() - 0.5) * 0.05 // Random offset within ~5km

    const coords = {
      lat: baseCoords.lat + randomOffset(),
      lng: baseCoords.lng + randomOffset(),
    }

    if (type === "starting") {
      setStartingPointCoords(coords)
      toast({
        title: "Starting Point Located",
        description: `Coordinates found for ${startingPoint}.`,
      })
    } else {
      setNewPoint({
        ...newPoint,
        lat: coords.lat.toFixed(6),
        lng: coords.lng.toFixed(6),
      })
      toast({
        title: "Delivery Point Located",
        description: `Coordinates found for ${newPoint.name}.`,
      })
    }
  }

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Create New Route</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-800 border-slate-700 text-white lg:col-span-2">
            <CardHeader>
              <CardTitle>Route Details</CardTitle>
              <CardDescription className="text-slate-400">
                Enter the basic information for your new delivery route
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="routeName">Route Name</Label>
                  <Input
                    id="routeName"
                    placeholder="e.g., Coimbatore Central Route"
                    className="bg-slate-900 border-slate-700 text-white"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="algorithm">Optimization Algorithm</Label>
                  <Select value={algorithm} onValueChange={setAlgorithm}>
                    <SelectTrigger id="algorithm" className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue placeholder="Select algorithm" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem value="greedy">Greedy Algorithm</SelectItem>
                      <SelectItem value="dynamic">Dynamic Programming</SelectItem>
                      <SelectItem value="knapsack">Knapsack Algorithm</SelectItem>
                      <SelectItem value="backtracking">Backtracking</SelectItem>
                      <SelectItem value="divide">Divide & Conquer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger id="vehicleType" className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem value="van">Delivery Van</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="bike">Motorcycle</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startingPoint">Starting Point</Label>
                  <div className="flex gap-2">
                    <Input
                      id="startingPoint"
                      placeholder="e.g., Gandhipuram Warehouse"
                      className="bg-slate-900 border-slate-700 text-white flex-1"
                      value={startingPoint}
                      onChange={(e) => setStartingPoint(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-700 hover:bg-slate-700"
                      onClick={() => handleSearchLocation("starting")}
                    >
                      Search
                    </Button>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Coordinates: {startingPointCoords.lat.toFixed(6)}, {startingPointCoords.lng.toFixed(6)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Optimization Preferences</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="optimize-traffic"
                      checked={optimizeForTraffic}
                      onCheckedChange={setOptimizeForTraffic}
                    />
                    <Label htmlFor="optimize-traffic">Optimize for Traffic</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="avoid-tolls" checked={avoidTolls} onCheckedChange={setAvoidTolls} />
                    <Label htmlFor="avoid-tolls">Avoid Toll Roads</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="prefer-highways" checked={preferHighways} onCheckedChange={setPreferHighways} />
                    <Label htmlFor="prefer-highways">Prefer Highways</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Route Summary</CardTitle>
              <CardDescription className="text-slate-400">Overview of your route details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-slate-400">Route Name</div>
                <div className="font-medium">{routeName || "Not specified"}</div>
              </div>

              <div>
                <div className="text-sm text-slate-400">Algorithm</div>
                <div className="font-medium capitalize">{algorithm}</div>
              </div>

              <div>
                <div className="text-sm text-slate-400">Vehicle Type</div>
                <div className="font-medium capitalize">{vehicleType}</div>
              </div>

              <div>
                <div className="text-sm text-slate-400">Starting Point</div>
                <div className="font-medium">{startingPoint || "Not specified"}</div>
              </div>

              <div>
                <div className="text-sm text-slate-400">Delivery Points</div>
                <div className="font-medium">{deliveryPoints.length}</div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <div className="text-sm text-slate-400 mb-2">Estimated Statistics</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-400">Total Distance</div>
                    <div className="font-medium">
                      {deliveryPoints.length ? `~${(deliveryPoints.length * 3.5).toFixed(1)} km` : "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Estimated Time</div>
                    <div className="font-medium">
                      {deliveryPoints.length ? `~${Math.ceil(deliveryPoints.length * 15)} min` : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Route...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Route
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="bg-slate-800 border-slate-700 text-white mt-6">
          <CardHeader>
            <CardTitle>Delivery Points</CardTitle>
            <CardDescription className="text-slate-400">Add all the delivery points for this route</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list">
              <TabsList className="bg-slate-900 border border-slate-700">
                <TabsTrigger
                  value="list"
                  className="data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
                >
                  List View
                </TabsTrigger>
                <TabsTrigger
                  value="map"
                  className="data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
                >
                  Map View
                </TabsTrigger>
                <TabsTrigger
                  value="add"
                  className="data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
                >
                  Add Point
                </TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="mt-4">
                {deliveryPoints.length > 0 ? (
                  <div className="space-y-3">
                    {deliveryPoints.map((point, index) => (
                      <div key={point.id} className="flex items-center bg-slate-900 p-3 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{point.name}</div>
                          <div className="text-xs text-slate-400">{point.address}</div>
                          {point.notes && <div className="text-xs text-slate-400 mt-1">Note: {point.notes}</div>}
                        </div>
                        <div className="flex items-center gap-2">
                          {point.estimatedTime && (
                            <div className="text-sm flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-blue-400" />
                              {point.estimatedTime} min
                            </div>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-red-400 hover:bg-red-900/20"
                            onClick={() => handleRemovePoint(point.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    No delivery points added yet. Add some points to create your route.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="map" className="mt-4">
                <div className="relative bg-slate-900 rounded-lg overflow-hidden h-[400px] flex items-center justify-center">
                  {/* This would be replaced with an actual map component */}
                  <div className="text-center">
                    <Map className="h-12 w-12 text-emerald-400 mx-auto mb-2 opacity-20" />
                    <p>Interactive map would render here</p>
                    <p className="text-sm text-slate-400">Showing {deliveryPoints.length} delivery points</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="add" className="mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pointName">Location Name</Label>
                      <Input
                        id="pointName"
                        placeholder="e.g., Customer Office"
                        className="bg-slate-900 border-slate-700 text-white"
                        value={newPoint.name}
                        onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pointAddress">Address</Label>
                      <div className="flex gap-2">
                        <Input
                          id="pointAddress"
                          placeholder="e.g., 123 Main St, Coimbatore"
                          className="bg-slate-900 border-slate-700 text-white flex-1"
                          value={newPoint.address}
                          onChange={(e) => setNewPoint({ ...newPoint, address: e.target.value })}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="border-slate-700 hover:bg-slate-700"
                          onClick={() => handleSearchLocation("delivery")}
                        >
                          Search
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pointLat">Latitude</Label>
                      <Input
                        id="pointLat"
                        placeholder="e.g., 11.0168"
                        className="bg-slate-900 border-slate-700 text-white"
                        value={newPoint.lat}
                        onChange={(e) => setNewPoint({ ...newPoint, lat: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pointLng">Longitude</Label>
                      <Input
                        id="pointLng"
                        placeholder="e.g., 76.9558"
                        className="bg-slate-900 border-slate-700 text-white"
                        value={newPoint.lng}
                        onChange={(e) => setNewPoint({ ...newPoint, lng: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pointNotes">Notes (Optional)</Label>
                      <Textarea
                        id="pointNotes"
                        placeholder="Any special instructions or notes"
                        className="bg-slate-900 border-slate-700 text-white"
                        value={newPoint.notes}
                        onChange={(e) => setNewPoint({ ...newPoint, notes: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pointTime">Estimated Time (minutes)</Label>
                      <Input
                        id="pointTime"
                        type="number"
                        placeholder="e.g., 15"
                        className="bg-slate-900 border-slate-700 text-white"
                        value={newPoint.estimatedTime}
                        onChange={(e) => setNewPoint({ ...newPoint, estimatedTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={handleAddPoint} className="bg-emerald-500 hover:bg-emerald-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Delivery Point
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              className="border-slate-700 hover:bg-slate-700"
              onClick={() => setDeliveryPoints([])}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear All Points
            </Button>

            <Button type="button" className="bg-blue-600 hover:bg-blue-700" disabled={deliveryPoints.length < 2}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Preview Route
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
\
## 8. Let's create a SQL script to set up the database schema for storing UI inputs:
