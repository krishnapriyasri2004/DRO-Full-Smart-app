"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Pencil, Trash2, Plus, Search, Car, Bike, Truck, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  fetchAllDeliveryPartners,
  addDeliveryPartner,
  updateDeliveryPartnerData,
  removeDeliveryPartner,
} from "@/app/actions/delivery-partners"
import { toast } from "@/components/ui/use-toast"

// Types
interface DeliveryPartner {
  id: number
  name: string
  phone: string
  email: string
  vehicle_type: "car" | "bike" | "truck" | "walk"
  capacity: number
  status: "active" | "inactive" | "on-delivery"
  current_lat?: number
  current_lng?: number
  last_location_update?: string
  created_at: string
  updated_at: string
}

// Vehicle icon mapping
const vehicleIcons = {
  car: Car,
  bike: Bike,
  truck: Truck,
  walk: ShoppingBag,
}

// Status color mapping
const statusColors = {
  active: "bg-green-500",
  inactive: "bg-gray-500",
  "on-delivery": "bg-blue-500",
}

export default function DeliveryPartnersPage() {
  const [partners, setPartners] = useState<DeliveryPartner[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPartner, setCurrentPartner] = useState<DeliveryPartner | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle_type: "car",
    capacity: "100",
    status: "active",
  })

  // Load partners on mount
  useEffect(() => {
    loadPartners()
  }, [])

  const loadPartners = async () => {
    setIsLoading(true)
    try {
      const result = await fetchAllDeliveryPartners()
      if (result.success) {
        setPartners(result.data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load delivery partners",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading partners:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter partners based on search term
  const filteredPartners = partners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.phone.includes(searchTerm),
  )

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      vehicle_type: "car",
      capacity: "100",
      status: "active",
    })
  }

  // Open edit dialog
  const openEditDialog = (partner: DeliveryPartner) => {
    setCurrentPartner(partner)
    setFormData({
      name: partner.name,
      phone: partner.phone,
      email: partner.email,
      vehicle_type: partner.vehicle_type,
      capacity: partner.capacity.toString(),
      status: partner.status,
    })
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (partner: DeliveryPartner) => {
    setCurrentPartner(partner)
    setIsDeleteDialogOpen(true)
  }

  // Add new partner
  const handleAddPartner = async () => {
    try {
      const result = await addDeliveryPartner(formData)
      if (result.success) {
        toast({
          title: "Success",
          description: "Delivery partner added successfully",
        })
        resetForm()
        setIsAddDialogOpen(false)
        loadPartners()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add delivery partner",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding partner:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  // Update partner
  const handleUpdatePartner = async () => {
    if (!currentPartner) return

    try {
      const result = await updateDeliveryPartnerData(currentPartner.id, formData)
      if (result.success) {
        toast({
          title: "Success",
          description: "Delivery partner updated successfully",
        })
        resetForm()
        setIsEditDialogOpen(false)
        loadPartners()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update delivery partner",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating partner:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  // Delete partner
  const handleDeletePartner = async () => {
    if (!currentPartner) return

    try {
      const result = await removeDeliveryPartner(currentPartner.id)
      if (result.success) {
        toast({
          title: "Success",
          description: "Delivery partner deleted successfully",
        })
        setIsDeleteDialogOpen(false)
        loadPartners()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete delivery partner",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting partner:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Delivery Partners</h2>
          <p className="text-slate-400">Manage your delivery personnel and their assignments</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Search partners..."
              className="pl-8 bg-slate-800 border-slate-700 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 text-white border-slate-700">
              <DialogHeader>
                <DialogTitle>Add New Delivery Partner</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    className="col-span-3 bg-slate-900 border-slate-700"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    className="col-span-3 bg-slate-900 border-slate-700"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="col-span-3 bg-slate-900 border-slate-700"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vehicle_type" className="text-right">
                    Vehicle
                  </Label>
                  <Select
                    value={formData.vehicle_type}
                    onValueChange={(value) => handleSelectChange("vehicle_type", value)}
                  >
                    <SelectTrigger className="col-span-3 bg-slate-900 border-slate-700">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="bike">Bike</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="walk">On Foot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">
                    Capacity (kg)
                  </Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    className="col-span-3 bg-slate-900 border-slate-700"
                    value={formData.capacity}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger className="col-span-3 bg-slate-900 border-slate-700">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="on-delivery">On Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAddPartner}>
                  Add Partner
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Partners grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPartners.map((partner) => {
          const VehicleIcon = vehicleIcons[partner.vehicle_type]

          return (
            <Card key={partner.id} className="bg-slate-800 border-slate-700 text-white">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {partner.name}
                      <span className={`inline-block w-2 h-2 rounded-full ${statusColors[partner.status]}`} />
                    </CardTitle>
                    <CardDescription className="text-slate-400">{partner.email}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-white"
                      onClick={() => openEditDialog(partner)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-400"
                      onClick={() => openDeleteDialog(partner)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <VehicleIcon className="h-4 w-4 text-emerald-400" />
                    <span className="capitalize">{partner.vehicle_type}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Capacity:</span> {partner.capacity} kg
                  </div>
                  <div>
                    <span className="text-slate-400">Phone:</span> {partner.phone}
                  </div>
                  <div>
                    <span className="text-slate-400">Status:</span> <span className="capitalize">{partner.status}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-700 pt-4 flex justify-between">
                <div>
                  <span className="text-slate-400 text-sm">Last update:</span>{" "}
                  {partner.last_location_update ? new Date(partner.last_location_update).toLocaleString() : "Never"}
                </div>
                <div>
                  <span className="text-slate-400 text-sm">ID:</span> {partner.id}
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Empty state */}
      {filteredPartners.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
            <Truck className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">No delivery partners found</h3>
          <p className="text-slate-400 mb-6">
            {searchTerm ? `No results found for "${searchTerm}"` : "Add your first delivery partner to get started"}
          </p>
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Partner
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Edit Delivery Partner</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                name="name"
                className="col-span-3 bg-slate-900 border-slate-700"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                Phone
              </Label>
              <Input
                id="edit-phone"
                name="phone"
                className="col-span-3 bg-slate-900 border-slate-700"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                className="col-span-3 bg-slate-900 border-slate-700"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-vehicle_type" className="text-right">
                Vehicle
              </Label>
              <Select
                value={formData.vehicle_type}
                onValueChange={(value) => handleSelectChange("vehicle_type", value)}
              >
                <SelectTrigger className="col-span-3 bg-slate-900 border-slate-700">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="bike">Bike</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="walk">On Foot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-capacity" className="text-right">
                Capacity (kg)
              </Label>
              <Input
                id="edit-capacity"
                name="capacity"
                type="number"
                className="col-span-3 bg-slate-900 border-slate-700"
                value={formData.capacity}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger className="col-span-3 bg-slate-900 border-slate-700">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on-delivery">On Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleUpdatePartner}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p>Are you sure you want to delete {currentPartner?.name}?</p>
            <p className="text-slate-400 mt-2">This action cannot be undone.</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePartner}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
