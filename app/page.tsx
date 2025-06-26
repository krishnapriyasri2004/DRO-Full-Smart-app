import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Package, Map, BarChart3, ArrowRight, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import EnhancedRouteVisualization from "@/components/enhanced-route-visualization"
import StaffTrainingGuide from "@/components/staff-training-guide"

// Sample data for visualization
const sampleDeliveryPoints = [
  {
    id: 1,
    name: "Gandhipuram Central",
    address: "11 Main St, Gandhipuram",
    lat: 11.0175,
    lng: 76.9674,
    estimatedArrival: "09:15 AM",
    status: "delivered",
  },
  {
    id: 2,
    name: "R.S. Puram Office",
    address: "42 West Rd, R.S. Puram",
    lat: 11.0069,
    lng: 76.9498,
    estimatedArrival: "09:45 AM",
    status: "delivered",
  },
  {
    id: 3,
    name: "Peelamedu Tech Park",
    address: "78 East Ave, Peelamedu",
    lat: 11.0279,
    lng: 77.0254,
    estimatedArrival: "10:30 AM",
    status: "in_transit",
  },
  {
    id: 4,
    name: "Singanallur Warehouse",
    address: "105 Industrial Zone, Singanallur",
    lat: 11.007,
    lng: 77.0421,
    estimatedArrival: "11:15 AM",
    status: "pending",
  },
  {
    id: 5,
    name: "Saibaba Colony Retail",
    address: "23 North St, Saibaba Colony",
    lat: 11.0233,
    lng: 76.9342,
    estimatedArrival: "12:00 PM",
    status: "pending",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-emerald-600 hover:bg-emerald-700">Real-Time Optimization</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Optimize Delivery Routes in Real-Time</h1>
              <p className="text-slate-300 text-lg mb-6">
                Streamline your delivery operations with AI-powered route optimization, real-time tracking, and
                intelligent cargo management.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                  <Link href="/dashboard">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-slate-600 hover:bg-slate-800">
                  <Link href="/dashboard/routes">View Routes</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
                <Card className="bg-slate-800 border-slate-700 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 border-b border-slate-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-emerald-400 mr-2"></div>
                          <span className="text-sm font-medium">Live Route Tracking</span>
                        </div>
                        <Badge className="bg-emerald-600 hover:bg-emerald-700">Active</Badge>
                      </div>
                    </div>
                    <div className="relative bg-slate-900 h-64">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Map className="h-12 w-12 text-emerald-400 opacity-20" />
                      </div>
                      <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-sm p-2 rounded-lg">
                        <div className="text-xs text-slate-400">Current Route</div>
                        <div className="text-sm font-medium">Coimbatore Central Route</div>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-slate-800/80 backdrop-blur-sm p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-400 mr-1" />
                            <span className="text-xs">2</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 text-blue-400 mr-1" />
                            <span className="text-xs">1</span>
                          </div>
                          <div className="flex items-center">
                            <AlertTriangle className="h-3 w-3 text-amber-400 mr-1" />
                            <span className="text-xs">2</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Our delivery route optimization system combines advanced algorithms with user-friendly interfaces to
              streamline your logistics operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-900 border-slate-700 text-white">
              <CardContent className="pt-6">
                <div className="rounded-full bg-emerald-900/30 w-12 h-12 flex items-center justify-center mb-4">
                  <Map className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Route Optimization</h3>
                <p className="text-slate-300 mb-4">
                  AI-powered algorithms find the most efficient delivery routes, saving time and fuel costs.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                    <span>Multiple optimization algorithms</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                    <span>Real-time traffic integration</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                    <span>Coimbatore-specific mapping</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700 text-white">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-900/30 w-12 h-12 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cargo Management</h3>
                <p className="text-slate-300 mb-4">
                  Efficiently manage cargo assignments with knapsack algorithm optimization for maximum vehicle
                  utilization.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                    <span>Knapsack optimization algorithm</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                    <span>Priority-based cargo loading</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                    <span>Real-time status tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700 text-white">
              <CardContent className="pt-6">
                <div className="rounded-full bg-amber-900/30 w-12 h-12 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Analytics & Reporting</h3>
                <p className="text-slate-300 mb-4">
                  Comprehensive analytics and reporting tools to monitor performance and make data-driven decisions.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                    <span>Performance dashboards</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                    <span>Efficiency metrics</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
                    <span>Customizable reports</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* See It In Action Section */}
      <section className="py-16 px-4 bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">See It In Action</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Experience how our route optimization system works with this interactive demo.
            </p>
          </div>

          <Tabs defaultValue="visualization" className="w-full">
            <TabsList className="w-full max-w-md mx-auto bg-slate-800 border border-slate-700">
              <TabsTrigger
                value="visualization"
                className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
              >
                Route Visualization
              </TabsTrigger>
              <TabsTrigger
                value="training"
                className="flex-1 data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
              >
                Training Guide
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visualization" className="mt-6">
              <EnhancedRouteVisualization
                routeName="Coimbatore Central Route"
                algorithm="Knapsack"
                deliveryPoints={sampleDeliveryPoints}
                totalDistance={18.5}
                totalDuration={120}
                vehicleType="Delivery Van"
                driverName="Rajesh Kumar"
              />
            </TabsContent>

            <TabsContent value="training" className="mt-6">
              <StaffTrainingGuide />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Our system uses advanced algorithms to optimize delivery routes and cargo assignments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 text-white">
              <div className="rounded-full bg-slate-800 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-emerald-400">1</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Input Data</h3>
              <p className="text-slate-300">
                Enter delivery locations, cargo details, and vehicle information into the system.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 text-white">
              <div className="rounded-full bg-slate-800 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-emerald-400">2</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Algorithm Selection</h3>
              <p className="text-slate-300">
                Choose the appropriate optimization algorithm based on your specific requirements.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 text-white">
              <div className="rounded-full bg-slate-800 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-emerald-400">3</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Route Generation</h3>
              <p className="text-slate-300">
                The system calculates the optimal route and cargo assignments for maximum efficiency.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 text-white">
              <div className="rounded-full bg-slate-800 w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-emerald-400">4</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Real-Time Tracking</h3>
              <p className="text-slate-300">
                Monitor deliveries in real-time and adjust routes as needed based on changing conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Input Instructions Section */}
      <section className="py-16 px-4 bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How to Input Details</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Follow these simple steps to input route and cargo details for optimal results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Map className="h-5 w-5 mr-2 text-emerald-400" />
                  Route Input Instructions
                </h3>

                <ol className="space-y-4 text-slate-300">
                  <li className="flex">
                    <span className="bg-slate-900 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-emerald-400 shrink-0">
                      1
                    </span>
                    <div>
                      <p className="font-medium text-white">Navigate to Routes Page</p>
                      <p className="text-sm">Go to the Dashboard and select "Routes" from the sidebar navigation.</p>
                    </div>
                  </li>

                  <li className="flex">
                    <span className="bg-slate-900 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-emerald-400 shrink-0">
                      2
                    </span>
                    <div>
                      <p className="font-medium text-white">Create New Route</p>
                      <p className="text-sm">Click the "Create New Route" button and enter a descriptive name.</p>
                    </div>
                  </li>

                  <li className="flex">
                    <span className="bg-slate-900 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-emerald-400 shrink-0">
                      3
                    </span>
                    <div>
                      <p className="font-medium text-white">Add Starting Point</p>
                      <p className="text-sm">
                        Select a depot or warehouse as your starting point. For Coimbatore routes, select from
                        pre-loaded landmarks.
                      </p>
                    </div>
                  </li>

                  <li className="flex">
                    <span className="bg-slate-900 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-emerald-400 shrink-0">
                      4
                    </span>
                    <div>
                      <p className="font-medium text-white">Add Delivery Points</p>
                      <p className="text-sm">
                        Add all delivery locations by searching or clicking on the map. Include any special
                        instructions.
                      </p>
                    </div>
                  </li>

                  <li className="flex">
                    <span className="bg-slate-900 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-emerald-400 shrink-0">
                      5
                    </span>
                    <div>
                      <p className="font-medium text-white">Select Algorithm</p>
                      <p className="text-sm">
                        Choose the appropriate algorithm based on your needs (Greedy for speed, Dynamic for optimal
                        routes).
                      </p>
                    </div>
                  </li>

                  <li className="flex">
                    <span className="bg-slate-900 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-emerald-400 shrink-0">
                      6
                    </span>
                    <div>
                      <p className="font-medium text-white">Generate and Review</p>
                      <p className="text-sm">
                        Click "Generate Route" and review the suggested path. Make adjustments if needed.
                      </p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-blue-400" />
                  Cargo Input Instructions
                </h3>

                <ol className="space-y-4 text-slate-300">
                  <li className="flex">
                    <span className="bg-slate-900 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-blue-400 shrink-0">
                      1
                    </span>
                    <div>
                      <p className="font-medium text-white">Navigate to Cargo Page</p>
                      <p className="text-sm">Go to the Dashboard and select "Cargo" from the sidebar navigation.</p>
                    </div>
                  </li>

                  <li className="flex">
                    <span className="bg-slate-900 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-blue-400 shrink-0">
                      2
                    </span>
                    <div>
                      <p className="font-medium text-white">Add New Cargo</p>
                      <p className="text-sm">Click the "Add Cargo" button to open the cargo input form.</p>
                    </div>
                  </li>

                  <li className="flex">
                    <span className="bg-slate-900 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-blue-400 shrink-0">
                      3
                    </span>
                    <div>
                      <p className="font-medium text-white">Enter Cargo Details</p>
                      <p className="text-sm">Provide a name, accurate weight (in kg), and dimensions (LxWxH in cm).</p>
                    </div>
                  </li>

                  <li className="flex">
                    <span className="bg-slate-900 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-blue-400 shrink-0">
                      4
                    </span>
                    <div>
                      <p className="font-medium text-white">Set Priority Level</p>
                      <p className="text-sm">
                        Select the appropriate priority: Urgent (highest), High, Medium, or Low (lowest).
                      </p>
                    </div>
                  </li>

                  <li className="flex">
                    <span className="bg-slate-900 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-blue-400 shrink-0">
                      5
                    </span>
                    <div>
                      <p className="font-medium text-white">Specify Destination</p>
                      <p className="text-sm">Enter the delivery destination or select from existing locations.</p>
                    </div>
                  </li>

                  <li className="flex">
                    <span className="bg-slate-900 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-blue-400 shrink-0">
                      6
                    </span>
                    <div>
                      <p className="font-medium text-white">Run Optimization</p>
                      <p className="text-sm">
                        Use the "Optimize Cargo" button to run the knapsack algorithm for optimal loading.
                      </p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-emerald-900">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Optimize Your Deliveries?</h2>
          <p className="text-emerald-100 max-w-2xl mx-auto mb-8">
            Start using our real-time delivery route optimization system today and see the difference.
          </p>
          <Button asChild size="lg" className="bg-white text-emerald-900 hover:bg-emerald-100">
            <Link href="/dashboard">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 border-t border-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">Route Optimizer</h3>
              <p className="text-sm">
                Advanced delivery route optimization system with real-time tracking and cargo management.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li>Route Optimization</li>
                <li>Cargo Management</li>
                <li>Real-Time Tracking</li>
                <li>Analytics & Reporting</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Support Center</li>
                <li>Training Videos</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>Email: support@routeoptimizer.com</li>
                <li>Phone: +91 123 456 7890</li>
                <li>Address: Coimbatore, Tamil Nadu, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2023 Route Optimizer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
