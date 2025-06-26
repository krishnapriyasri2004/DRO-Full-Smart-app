"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, Package, Clock, ArrowRight, ArrowUpRight, ArrowDownRight, MapIcon } from "lucide-react"

// Mock data for the dashboard
const mockStats = {
  totalDeliveries: 1248,
  activeDrivers: 42,
  pendingOrders: 37,
  avgDeliveryTime: "28 min",
  deliveryTrend: 12.5, // percentage increase
  revenueData: [
    { month: "Jan", value: 4200 },
    { month: "Feb", value: 4800 },
    { month: "Mar", value: 5100 },
    { month: "Apr", value: 4900 },
    { month: "May", value: 5600 },
    { month: "Jun", value: 6200 },
    { month: "Jul", value: 6800 },
  ],
  recentDeliveries: [
    { id: "ORD-7829", customer: "John Smith", address: "123 Main St", status: "Delivered", time: "10:45 AM" },
    { id: "ORD-7830", customer: "Sarah Johnson", address: "456 Oak Ave", status: "In Transit", time: "11:20 AM" },
    { id: "ORD-7831", customer: "Michael Brown", address: "789 Pine Rd", status: "Pending", time: "11:45 AM" },
    { id: "ORD-7832", customer: "Emily Davis", address: "321 Cedar Ln", status: "Delivered", time: "12:15 PM" },
    { id: "ORD-7833", customer: "David Wilson", address: "654 Maple Dr", status: "In Transit", time: "12:30 PM" },
  ],
}

export default function Dashboard() {
  const [stats, setStats] = useState(mockStats)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

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
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
            Export Report
          </Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600">New Delivery</Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Deliveries</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalDeliveries}</h3>
                <div className="flex items-center mt-1 text-emerald-400 text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>{stats.deliveryTrend}% increase</span>
                </div>
              </div>
              <div className="bg-emerald-900/30 p-3 rounded-lg">
                <Package className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400">Active Drivers</p>
                <h3 className="text-2xl font-bold mt-1">{stats.activeDrivers}</h3>
                <div className="flex items-center mt-1 text-emerald-400 text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>8% increase</span>
                </div>
              </div>
              <div className="bg-blue-900/30 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400">Pending Orders</p>
                <h3 className="text-2xl font-bold mt-1">{stats.pendingOrders}</h3>
                <div className="flex items-center mt-1 text-amber-400 text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>5 new today</span>
                </div>
              </div>
              <div className="bg-amber-900/30 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400">Avg. Delivery Time</p>
                <h3 className="text-2xl font-bold mt-1">{stats.avgDeliveryTime}</h3>
                <div className="flex items-center mt-1 text-green-400 text-sm">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span>3 min faster</span>
                </div>
              </div>
              <div className="bg-purple-900/30 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
            <CardDescription className="text-slate-400">Monthly delivery statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-end justify-between">
              {stats.revenueData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-12 bg-emerald-500 rounded-t-sm"
                    style={{
                      height: `${(item.value / 7000) * 200}px`,
                      opacity: 0.2 + (index / stats.revenueData.length) * 0.8,
                    }}
                  ></div>
                  <span className="mt-2 text-xs text-slate-400">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Deliveries</CardTitle>
              <CardDescription className="text-slate-400">Latest delivery status updates</CardDescription>
            </div>
            <Link href="/dashboard/deliveries">
              <Button
                variant="ghost"
                size="sm"
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">Order ID</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">Customer</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-slate-400 hidden md:table-cell">
                      Address
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">Status</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-slate-400">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentDeliveries.map((delivery, index) => (
                    <tr key={index} className="border-b border-slate-700 last:border-0">
                      <td className="py-3 px-2 text-sm">{delivery.id}</td>
                      <td className="py-3 px-2 text-sm">{delivery.customer}</td>
                      <td className="py-3 px-2 text-sm hidden md:table-cell">{delivery.address}</td>
                      <td className="py-3 px-2 text-sm">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            delivery.status === "Delivered"
                              ? "bg-green-900/30 text-green-400"
                              : delivery.status === "In Transit"
                                ? "bg-blue-900/30 text-blue-400"
                                : "bg-amber-900/30 text-amber-400"
                          }`}
                        >
                          {delivery.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm text-right">{delivery.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/route-optimizer">
          <Card className="bg-slate-800 border-slate-700 text-white hover:bg-slate-750 transition-colors cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="bg-emerald-900/30 p-3 rounded-lg w-fit mb-4">
                <MapIcon className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Route Optimizer</h3>
              <p className="text-slate-400 text-sm mb-4 flex-grow">
                Optimize delivery routes using advanced algorithms to reduce time and fuel costs.
              </p>
              <Button
                variant="ghost"
                className="justify-start p-0 text-emerald-400 hover:text-emerald-300 hover:bg-transparent"
              >
                Optimize Routes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/cargo">
          <Card className="bg-slate-800 border-slate-700 text-white hover:bg-slate-750 transition-colors cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="bg-blue-900/30 p-3 rounded-lg w-fit mb-4">
                <Package className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Cargo Management</h3>
              <p className="text-slate-400 text-sm mb-4 flex-grow">
                Manage cargo assignments, track packages, and optimize loading efficiency.
              </p>
              <Button
                variant="ghost"
                className="justify-start p-0 text-blue-400 hover:text-blue-300 hover:bg-transparent"
              >
                Manage Cargo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/partners">
          <Card className="bg-slate-800 border-slate-700 text-white hover:bg-slate-750 transition-colors cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="bg-purple-900/30 p-3 rounded-lg w-fit mb-4">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Delivery Partners</h3>
              <p className="text-slate-400 text-sm mb-4 flex-grow">
                Manage your delivery partners, track performance, and assign routes.
              </p>
              <Button
                variant="ghost"
                className="justify-start p-0 text-purple-400 hover:text-purple-300 hover:bg-transparent"
              >
                View Partners
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
