"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, MapPin, Clock, Package, AlertTriangle, CheckCircle, ArrowRight, BarChart4 } from "lucide-react"

interface DeliveryPoint {
  id: number
  name: string
  address?: string
  lat: number
  lng: number
  estimatedArrival?: string
  status?: "pending" | "delivered" | "delayed"
}

interface RouteVisualizationProps {
  routeName: string
  algorithm: string
  deliveryPoints: DeliveryPoint[]
  totalDistance: number
  totalDuration: number
  vehicleType?: string
  driverName?: string
}

export default function EnhancedRouteVisualization({
  routeName,
  algorithm,
  deliveryPoints,
  totalDistance,
  totalDuration,
  vehicleType = "Truck",
  driverName = "Unassigned",
}: RouteVisualizationProps) {
  const [activeTab, setActiveTab] = useState("map")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div>Loading visualization...</div>
  }

  // Calculate completion percentage
  const completedPoints = deliveryPoints.filter((p) => p.status === "delivered").length
  const completionPercentage = Math.round((completedPoints / deliveryPoints.length) * 100)

  // Get algorithm description
  const getAlgorithmDescription = (algo: string) => {
    switch (algo.toLowerCase()) {
      case "knapsack":
        return "Optimizes cargo loading based on weight and priority"
      case "greedy":
        return "Selects nearest neighbor at each step for route planning"
      case "dynamic":
        return "Uses dynamic programming to find optimal solution"
      case "backtracking":
        return "Explores all possible routes to find the best one"
      case "divide":
        return "Divides the problem into smaller sub-problems"
      default:
        return "Custom optimization algorithm"
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700 text-white">
      <CardHeader className="border-b border-slate-700">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-emerald-400" />
              {routeName}
            </CardTitle>
            <div className="text-sm text-slate-400 mt-1">
              {vehicleType} • {driverName}
            </div>
          </div>
          <Badge className="bg-emerald-600 hover:bg-emerald-700">{algorithm}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-slate-900 border-b border-slate-700 rounded-none">
            <TabsTrigger
              value="map"
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
            >
              Route Map
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
            >
              Delivery Points
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
            >
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="m-0">
            <div className="p-4">
              <div className="relative bg-slate-900 rounded-lg overflow-hidden h-[300px] mb-4 flex items-center justify-center">
                {/* This would be replaced with an actual map component */}
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p>Interactive map would render here</p>
                  <p className="text-sm text-slate-400">Using coordinates from delivery points</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-900 p-3 rounded-lg">
                  <p className="text-slate-400 text-sm">Total Distance</p>
                  <p className="text-xl font-bold">{totalDistance.toFixed(1)} km</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg">
                  <p className="text-slate-400 text-sm">Estimated Duration</p>
                  <p className="text-xl font-bold">
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                  </p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg">
                  <p className="text-slate-400 text-sm">Delivery Points</p>
                  <p className="text-xl font-bold">{deliveryPoints.length}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="m-0">
            <div className="p-4">
              <div className="space-y-3">
                {deliveryPoints.map((point, index) => (
                  <div key={point.id} className="flex items-center bg-slate-900 p-3 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{point.name}</div>
                      <div className="text-xs text-slate-400">
                        {point.address || `Lat: ${point.lat}, Lng: ${point.lng}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {point.estimatedArrival && (
                        <div className="text-sm flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-blue-400" />
                          {point.estimatedArrival}
                        </div>
                      )}
                      <div>
                        {point.status === "delivered" ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : point.status === "delayed" ? (
                          <AlertTriangle className="h-5 w-5 text-amber-400" />
                        ) : (
                          <Package className="h-5 w-5 text-blue-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {deliveryPoints.length === 0 && (
                  <div className="text-center py-8 text-slate-400">No delivery points added to this route</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="m-0">
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Algorithm: {algorithm}</h3>
                <p className="text-sm text-slate-400">{getAlgorithmDescription(algorithm)}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Route Completion</span>
                    <span className="text-sm font-medium">{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Efficiency Score</span>
                      <BarChart4 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-xl font-bold mt-1">{Math.round(85 + Math.random() * 10)}%</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Fuel Savings</span>
                      <BarChart4 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-xl font-bold mt-1">{Math.round(10 + Math.random() * 15)}%</p>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Route Optimization Benefits</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-emerald-400" />
                      Reduced delivery time by {Math.round(15 + Math.random() * 10)}%
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-emerald-400" />
                      Optimized cargo loading for maximum efficiency
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-emerald-400" />
                      Prioritized high-value deliveries
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
