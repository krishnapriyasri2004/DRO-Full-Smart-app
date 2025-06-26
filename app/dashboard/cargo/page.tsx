"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Package,
  Truck,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Loader2,
  Scale,
  Calculator,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { storeCargo } from "@/app/actions/store-cargo"
import { knapsackOptimization, priorityToValue, type KnapsackItem } from "@/lib/knapsack-algorithm"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Mock data for cargo items
const initialCargo = [
  {
    id: "PKG-001",
    name: "Electronics Bundle",
    weight: 5.2,
    dimensions: "40x30x20",
    status: "pending",
    priority: "high",
    destination: "Customer A",
    assignedTo: "John Doe",
    vehicle: "Van-01",
  },
  {
    id: "PKG-002",
    name: "Office Supplies",
    weight: 8.7,
    dimensions: "50x40x30",
    status: "in_transit",
    priority: "medium",
    destination: "Customer B",
    assignedTo: "Jane Smith",
    vehicle: "Truck-03",
  },
  {
    id: "PKG-003",
    name: "Furniture Set",
    weight: 42.5,
    dimensions: "120x80x60",
    status: "delivered",
    priority: "low",
    destination: "Customer C",
    assignedTo: "Mike Johnson",
    vehicle: "Truck-02",
  },
  {
    id: "PKG-004",
    name: "Medical Supplies",
    weight: 3.1,
    dimensions: "30x25x15",
    status: "pending",
    priority: "urgent",
    destination: "Hospital D",
    assignedTo: "Unassigned",
    vehicle: "Unassigned",
  },
  {
    id: "PKG-005",
    name: "Food Delivery",
    weight: 12.8,
    dimensions: "60x45x30",
    status: "in_transit",
    priority: "high",
    destination: "Restaurant E",
    assignedTo: "John Doe",
    vehicle: "Van-01",
  },
  {
    id: "PKG-006",
    name: "Construction Materials",
    weight: 78.3,
    dimensions: "200x100x50",
    status: "pending",
    priority: "medium",
    destination: "Site F",
    assignedTo: "Unassigned",
    vehicle: "Unassigned",
  },
  {
    id: "PKG-007",
    name: "Clothing Shipment",
    weight: 18.5,
    dimensions: "70x50x40",
    status: "delivered",
    priority: "low",
    destination: "Store G",
    assignedTo: "Jane Smith",
    vehicle: "Truck-03",
  },
]

// Mock data for vehicles
const vehicles = [
  { id: "Van-01", type: "Van", capacity: 500, driver: "John Doe", status: "active" },
  { id: "Truck-02", type: "Truck", capacity: 2000, driver: "Mike Johnson", status: "active" },
  { id: "Truck-03", type: "Truck", capacity: 1500, driver: "Jane Smith", status: "active" },
  { id: "Van-04", type: "Van", capacity: 600, driver: "Sarah Williams", status: "maintenance" },
]

export default function CargoManagement() {
  const [cargo, setCargo] = useState(initialCargo)
  const [filteredCargo, setFilteredCargo] = useState(initialCargo)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isOptimizationDialogOpen, setIsOptimizationDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [optimizationResults, setOptimizationResults] = useState<any>(null)
  const [newCargo, setNewCargo] = useState({
    name: "",
    weight: "",
    dimensions: "",
    priority: "medium",
    destination: "",
  })

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Filter cargo based on search query and status filter
    let filtered = cargo

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.destination.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    setFilteredCargo(filtered)
  }, [cargo, searchQuery, statusFilter])

  const handleAddCargo = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!newCargo.name || !newCargo.weight || !newCargo.dimensions || !newCargo.destination) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Create FormData object for server action
    const formData = new FormData()
    formData.append("name", newCargo.name)
    formData.append("weight", newCargo.weight)
    formData.append("dimensions", newCargo.dimensions)
    formData.append("priority", newCargo.priority)
    formData.append("destination", newCargo.destination)

    try {
      // Call server action to store in database
      const result = await storeCargo(formData)

      if (result.success) {
        // Add to local state
        const newItem = {
          id: `PKG-${Math.floor(1000 + Math.random() * 9000)}`,
          name: newCargo.name,
          weight: Number.parseFloat(newCargo.weight),
          dimensions: newCargo.dimensions,
          status: "pending",
          priority: newCargo.priority,
          destination: newCargo.destination,
          assignedTo: "Unassigned",
          vehicle: "Unassigned",
        }

        setCargo([newItem, ...cargo])
        setIsAddDialogOpen(false)
        setNewCargo({
          name: "",
          weight: "",
          dimensions: "",
          priority: "medium",
          destination: "",
        })

        toast({
          title: "Cargo Added",
          description: `${newCargo.name} has been added successfully`,
        })
      } else {
        throw new Error(result.error || "Failed to add cargo")
      }
    } catch (error) {
      console.error("Error adding cargo:", error)
      toast({
        title: "Error",
        description: "Failed to add cargo. Please try again.",
        variant: "destructive",
      })
    }
  }

  const runKnapsackOptimization = () => {
    if (!selectedVehicle) {
      toast({
        title: "No Vehicle Selected",
        description: "Please select a vehicle for optimization",
        variant: "destructive",
      })
      return
    }

    // Get selected vehicle
    const vehicle = vehicles.find((v) => v.id === selectedVehicle)
    if (!vehicle) return

    // Get unassigned cargo items
    const unassignedCargo = cargo.filter((item) => item.assignedTo === "Unassigned" && item.status === "pending")

    // Convert to knapsack items
    const knapsackItems: KnapsackItem[] = unassignedCargo.map((item) => ({
      id: item.id,
      name: item.name,
      weight: item.weight,
      value: priorityToValue(item.priority),
    }))

    // Run knapsack algorithm
    const result = knapsackOptimization(knapsackItems, vehicle.capacity)

    setOptimizationResults({
      vehicle,
      ...result,
      unassignedItems: result.remainingItems,
    })
  }

  const assignOptimizedCargo = () => {
    if (!optimizationResults) return

    // Update cargo assignments
    const updatedCargo = cargo.map((item) => {
      const selectedItem = optimizationResults.selectedItems.find((si: KnapsackItem) => si.id === item.id)
      if (selectedItem) {
        return {
          ...item,
          assignedTo: optimizationResults.vehicle.driver,
          vehicle: optimizationResults.vehicle.id,
        }
      }
      return item
    })

    setCargo(updatedCargo)
    setIsOptimizationDialogOpen(false)
    setOptimizationResults(null)

    toast({
      title: "Cargo Assigned",
      description: `${optimizationResults.selectedItems.length} items assigned to ${optimizationResults.vehicle.id}`,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-400" />
      case "in_transit":
        return <Clock className="h-4 w-4 text-blue-400" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />
      default:
        return <XCircle className="h-4 w-4 text-red-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered"
      case "in_transit":
        return "In Transit"
      case "pending":
        return "Pending"
      default:
        return "Unknown"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-900/30 text-red-400"
      case "high":
        return "bg-amber-900/30 text-amber-400"
      case "medium":
        return "bg-blue-900/30 text-blue-400"
      case "low":
        return "bg-green-900/30 text-green-400"
      default:
        return "bg-slate-900/30 text-slate-400"
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold">Cargo Management</h2>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="mr-2 h-4 w-4" />
                Add Cargo
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Add New Cargo</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Enter the details for the new cargo item.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCargo}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newCargo.name}
                      onChange={(e) => setNewCargo({ ...newCargo, name: e.target.value })}
                      className="col-span-3 bg-slate-900 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="weight" className="text-right">
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      value={newCargo.weight}
                      onChange={(e) => setNewCargo({ ...newCargo, weight: e.target.value })}
                      className="col-span-3 bg-slate-900 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dimensions" className="text-right">
                      Dimensions (cm)
                    </Label>
                    <Input
                      id="dimensions"
                      placeholder="LxWxH"
                      value={newCargo.dimensions}
                      onChange={(e) => setNewCargo({ ...newCargo, dimensions: e.target.value })}
                      className="col-span-3 bg-slate-900 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right">
                      Priority
                    </Label>
                    <Select
                      value={newCargo.priority}
                      onValueChange={(value) => setNewCargo({ ...newCargo, priority: value as any })}
                    >
                      <SelectTrigger id="priority" className="col-span-3 bg-slate-900 border-slate-700 text-white">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="destination" className="text-right">
                      Destination
                    </Label>
                    <Input
                      id="destination"
                      value={newCargo.destination}
                      onChange={(e) => setNewCargo({ ...newCargo, destination: e.target.value })}
                      className="col-span-3 bg-slate-900 border-slate-700 text-white"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="border-slate-700 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                    Add Cargo
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isOptimizationDialogOpen} onOpenChange={setIsOptimizationDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Calculator className="mr-2 h-4 w-4" />
                Optimize Cargo
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cargo Optimization (Knapsack Algorithm)</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Optimize cargo assignment based on weight capacity and priority.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="mb-4">
                  <Label htmlFor="vehicle">Select Vehicle</Label>
                  <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                    <SelectTrigger id="vehicle" className="mt-1 bg-slate-900 border-slate-700 text-white">
                      <SelectValue placeholder="Select a vehicle" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      {vehicles
                        .filter((v) => v.status === "active")
                        .map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.id} - {vehicle.type} ({vehicle.capacity} kg)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center my-4">
                  <Button onClick={runKnapsackOptimization} className="bg-emerald-500 hover:bg-emerald-600">
                    <Scale className="mr-2 h-4 w-4" />
                    Run Knapsack Algorithm
                  </Button>
                </div>

                {optimizationResults && (
                  <div className="mt-6 space-y-4">
                    <div className="bg-slate-900 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Truck className="mr-2 h-5 w-5 text-emerald-400" />
                        Optimization Results for {optimizationResults.vehicle.id}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Vehicle Capacity</p>
                          <p className="font-medium">{optimizationResults.vehicle.capacity} kg</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Utilized Capacity</p>
                          <p className="font-medium">
                            {optimizationResults.totalWeight.toFixed(1)} kg (
                            {Math.round((optimizationResults.totalWeight / optimizationResults.vehicle.capacity) * 100)}
                            %)
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Selected Items</p>
                          <p className="font-medium">{optimizationResults.selectedItems.length}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Remaining Items</p>
                          <p className="font-medium">{optimizationResults.remainingItems.length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Selected Items</h4>
                      {optimizationResults.selectedItems.length > 0 ? (
                        <div className="max-h-40 overflow-y-auto">
                          {optimizationResults.selectedItems.map((item: any) => {
                            const cargoItem = cargo.find((c) => c.id === item.id)
                            return (
                              <div
                                key={item.id}
                                className="flex justify-between items-center p-2 bg-slate-900 rounded-md mb-1"
                              >
                                <div className="flex items-center">
                                  <Package className="h-4 w-4 mr-2 text-emerald-400" />
                                  <span>{item.name}</span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-slate-400 mr-2">Weight:</span>
                                  <span>{item.weight} kg</span>
                                  {cargoItem && (
                                    <span
                                      className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getPriorityColor(cargoItem.priority)}`}
                                    >
                                      {cargoItem.priority}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">No items selected</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsOptimizationDialogOpen(false)}
                  className="border-slate-700 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={assignOptimizedCargo}
                  disabled={!optimizationResults}
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  Assign Cargo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700 text-white md:col-span-3">
          <CardHeader className="border-b border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Cargo Items</CardTitle>
                <CardDescription className="text-slate-400">Manage and track all cargo items</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search cargo..."
                    className="pl-8 bg-slate-900 border-slate-700 text-white w-full sm:w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white w-full sm:w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="border-slate-700 hover:bg-slate-700">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-slate-700 hover:bg-slate-700">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-800">
                  <TableHead className="text-slate-400">ID</TableHead>
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Weight</TableHead>
                  <TableHead className="text-slate-400">Dimensions</TableHead>
                  <TableHead className="text-slate-400">Priority</TableHead>
                  <TableHead className="text-slate-400">Destination</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCargo.length > 0 ? (
                  filteredCargo.map((item) => (
                    <TableRow key={item.id} className="border-slate-700 hover:bg-slate-750">
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.weight} kg</TableCell>
                      <TableCell>{item.dimensions}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}
                        >
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{item.destination}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(item.status)}
                          <span>{getStatusText(item.status)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.assignedTo}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-slate-400">
                      No cargo items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="border-t border-slate-700 flex items-center justify-between py-4">
            <div className="text-sm text-slate-400">
              Showing {filteredCargo.length} of {cargo.length} items
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-700">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="border-slate-700 bg-slate-700">
                1
              </Button>
              <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-700">
                2
              </Button>
              <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-700">
                3
              </Button>
              <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-700">
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Cargo Summary</CardTitle>
              <CardDescription className="text-slate-400">Overview of cargo status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-400">Total Items</div>
                  <div className="font-bold">{cargo.length}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-400">Pending</div>
                  <div className="font-bold">{cargo.filter((item) => item.status === "pending").length}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-400">In Transit</div>
                  <div className="font-bold">{cargo.filter((item) => item.status === "in_transit").length}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-400">Delivered</div>
                  <div className="font-bold">{cargo.filter((item) => item.status === "delivered").length}</div>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <div className="text-sm text-slate-400 mb-2">Delivery Progress</div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{
                        width: `${(cargo.filter((item) => item.status === "delivered").length / cargo.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 text-right">
                    {Math.round((cargo.filter((item) => item.status === "delivered").length / cargo.length) * 100)}%
                    Complete
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Available Vehicles</CardTitle>
              <CardDescription className="text-slate-400">Vehicles for cargo assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="p-3 rounded-lg border border-slate-700 bg-slate-900/50 flex items-center"
                  >
                    <div className="mr-3 p-2 bg-slate-900 rounded-lg">
                      <Truck className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-medium">{vehicle.id}</div>
                      <div className="text-xs text-slate-400">
                        {vehicle.type} • {vehicle.capacity} kg • {vehicle.driver}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          vehicle.status === "active"
                            ? "bg-green-900/30 text-green-400"
                            : "bg-amber-900/30 text-amber-400"
                        }`}
                      >
                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-slate-800 border-slate-700 text-white">
        <CardHeader>
          <CardTitle>Cargo Assignment</CardTitle>
          <CardDescription className="text-slate-400">Assign cargo to vehicles and delivery partners</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="unassigned">
            <TabsList className="bg-slate-900 border border-slate-700">
              <TabsTrigger
                value="unassigned"
                className="data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
              >
                Unassigned ({cargo.filter((item) => item.assignedTo === "Unassigned").length})
              </TabsTrigger>
              <TabsTrigger
                value="assigned"
                className="data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
              >
                Assigned
              </TabsTrigger>
              <TabsTrigger
                value="optimization"
                className="data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
              >
                Optimization
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unassigned" className="mt-4">
              <div className="space-y-4">
                {cargo.filter((item) => item.assignedTo === "Unassigned").length > 0 ? (
                  cargo
                    .filter((item) => item.assignedTo === "Unassigned")
                    .map((item) => (
                      <div key={item.id} className="p-4 rounded-lg border border-slate-700 bg-slate-900/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Package className="h-5 w-5 mr-2 text-emerald-400" />
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-slate-400">{item.id}</div>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}
                          >
                            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div>
                            <div className="text-xs text-slate-400">Weight</div>
                            <div>{item.weight} kg</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400">Dimensions</div>
                            <div>{item.dimensions}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400">Destination</div>
                            <div>{item.destination}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400">Status</div>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(item.status)}
                              <span>{getStatusText(item.status)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Select>
                            <SelectTrigger className="bg-slate-900 border-slate-700 text-white flex-1">
                              <SelectValue placeholder="Assign to vehicle" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                              {vehicles.map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                  {vehicle.id} ({vehicle.driver})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button className="bg-emerald-500 hover:bg-emerald-600">Assign</Button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-slate-400">No unassigned cargo items</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="assigned" className="mt-4">
              <div className="space-y-4">
                {cargo.filter((item) => item.assignedTo !== "Unassigned").length > 0 ? (
                  cargo
                    .filter((item) => item.assignedTo !== "Unassigned")
                    .map((item) => (
                      <div key={item.id} className="p-4 rounded-lg border border-slate-700 bg-slate-900/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Package className="h-5 w-5 mr-2 text-emerald-400" />
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-slate-400">{item.id}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}
                            >
                              {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                            </span>
                            <div className="flex items-center gap-1 text-sm">
                              {getStatusIcon(item.status)}
                              <span>{getStatusText(item.status)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div>
                            <div className="text-xs text-slate-400">Weight</div>
                            <div>{item.weight} kg</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400">Dimensions</div>
                            <div>{item.dimensions}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400">Destination</div>
                            <div>{item.destination}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400">Assigned To</div>
                            <div>
                              {item.assignedTo} ({item.vehicle})
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1 border-slate-700 hover:bg-slate-700">
                            Update Status
                          </Button>
                          <Button variant="outline" className="flex-1 border-slate-700 hover:bg-slate-700">
                            Reassign
                          </Button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-slate-400">No assigned cargo items</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="mt-4">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-slate-700 bg-slate-900/50">
                  <h3 className="text-lg font-medium mb-4">Cargo Assignment Optimization</h3>
                  <p className="text-slate-400 mb-4">
                    Optimize cargo assignments using advanced algorithms to maximize efficiency and minimize delivery
                    time.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="algorithm">Optimization Algorithm</Label>
                      <Select defaultValue="knapsack">
                        <SelectTrigger id="algorithm" className="w-[200px] bg-slate-900 border-slate-700 text-white">
                          <SelectValue placeholder="Select algorithm" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700 text-white">
                          <SelectItem value="knapsack">Knapsack Algorithm</SelectItem>
                          <SelectItem value="greedy">Greedy Algorithm</SelectItem>
                          <SelectItem value="dynamic">Dynamic Programming</SelectItem>
                          <SelectItem value="divide">Divide & Conquer</SelectItem>
                          <SelectItem value="backtracking">Backtracking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="priority">Optimization Priority</Label>
                      <Select defaultValue="value">
                        <SelectTrigger id="priority" className="w-[200px] bg-slate-900 border-slate-700 text-white">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700 text-white">
                          <SelectItem value="value">Priority Value</SelectItem>
                          <SelectItem value="time">Delivery Time</SelectItem>
                          <SelectItem value="cost">Cost Efficiency</SelectItem>
                          <SelectItem value="capacity">Capacity Utilization</SelectItem>
                          <SelectItem value="balanced">Balanced Workload</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="constraints">Additional Constraints</Label>
                      <Select defaultValue="none">
                        <SelectTrigger id="constraints" className="w-[200px] bg-slate-900 border-slate-700 text-white">
                          <SelectValue placeholder="Select constraints" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700 text-white">
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="time_windows">Time Windows</SelectItem>
                          <SelectItem value="vehicle_capacity">Vehicle Capacity</SelectItem>
                          <SelectItem value="driver_hours">Driver Hours</SelectItem>
                          <SelectItem value="all">All Constraints</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Run Optimization
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-slate-700 bg-slate-900/50">
                  <h3 className="text-lg font-medium mb-4">Optimization Results</h3>
                  <div className="text-center py-8 text-slate-400">Run the optimization to see results</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
