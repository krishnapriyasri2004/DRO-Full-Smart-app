import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Map, Package, BarChart3, Truck, AlertCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function StaffTrainingGuide() {
  return (
    <Card className="bg-slate-800 border-slate-700 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-400" />
          Staff Training Guide
        </CardTitle>
        <CardDescription className="text-slate-400">How to use the Route Optimizer system effectively</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="bg-slate-900 border border-slate-700 w-full">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="routes"
              className="data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
            >
              Routes
            </TabsTrigger>
            <TabsTrigger
              value="cargo"
              className="data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
            >
              Cargo
            </TabsTrigger>
            <TabsTrigger
              value="algorithms"
              className="data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-400"
            >
              Algorithms
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Map className="h-5 w-5 mr-2 text-emerald-400" />
                System Overview
              </h3>
              <p className="text-slate-400 mb-4">
                The Route Optimizer system helps you plan and optimize delivery routes in real-time, manage cargo
                assignments, and track delivery status.
              </p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-slate-700">
                  <AccordionTrigger className="hover:text-emerald-400">Key Features</AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Real-time route optimization using advanced algorithms</li>
                      <li>Cargo management with knapsack optimization</li>
                      <li>Delivery partner tracking and management</li>
                      <li>Detailed analytics and reporting</li>
                      <li>Coimbatore-specific mapping and landmarks</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-slate-700">
                  <AccordionTrigger className="hover:text-emerald-400">Navigation Guide</AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <strong>Dashboard:</strong> Overview of all deliveries and system status
                      </li>
                      <li>
                        <strong>Routes:</strong> Create and manage delivery routes
                      </li>
                      <li>
                        <strong>Cargo:</strong> Manage cargo items and assignments
                      </li>
                      <li>
                        <strong>Partners:</strong> Manage delivery partners and drivers
                      </li>
                      <li>
                        <strong>Analytics:</strong> View reports and performance metrics
                      </li>
                      <li>
                        <strong>Settings:</strong> Configure system preferences
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-slate-700">
                  <AccordionTrigger className="hover:text-emerald-400">Getting Started</AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Add delivery locations and landmarks</li>
                      <li>Create cargo items with weights and priorities</li>
                      <li>Add delivery partners and vehicles</li>
                      <li>Generate optimized routes</li>
                      <li>Track deliveries in real-time</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="routes" className="mt-4 space-y-4">
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Truck className="h-5 w-5 mr-2 text-emerald-400" />
                Route Management
              </h3>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="route-1" className="border-slate-700">
                  <AccordionTrigger className="hover:text-emerald-400">Creating a New Route</AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Navigate to the Routes section</li>
                      <li>Click "Create New Route" button</li>
                      <li>Select a starting depot location</li>
                      <li>
                        Add delivery points by:
                        <ul className="list-disc pl-5 mt-1">
                          <li>Searching for existing locations</li>
                          <li>Adding new locations with coordinates</li>
                          <li>Importing from a CSV file</li>
                        </ul>
                      </li>
                      <li>Select optimization algorithm (Greedy, Dynamic, etc.)</li>
                      <li>Click "Generate Route" to create the optimized path</li>
                      <li>Assign to a vehicle and delivery partner</li>
                      <li>Save and activate the route</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="route-2" className="border-slate-700">
                  <AccordionTrigger className="hover:text-emerald-400">Coimbatore-Specific Routes</AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    <p className="mb-2">For Coimbatore routes, use the specialized Coimbatore mapping features:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Select "Coimbatore" in the region dropdown</li>
                      <li>Use pre-loaded landmarks and areas</li>
                      <li>Enable traffic data integration for real-time updates</li>
                      <li>Consider local delivery zones for better optimization</li>
                      <li>Use Tamil language support for local addressing</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="route-3" className="border-slate-700">
                  <AccordionTrigger className="hover:text-emerald-400">Route Visualization</AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    <p className="mb-2">The route visualization provides several views:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <strong>Map View:</strong> Interactive map showing the complete route
                      </li>
                      <li>
                        <strong>List View:</strong> Sequential list of all delivery points
                      </li>
                      <li>
                        <strong>Statistics:</strong> Distance, time, and efficiency metrics
                      </li>
                      <li>
                        <strong>Timeline:</strong> Estimated arrival times for each point
                      </li>
                    </ul>
                    <p className="mt-2">Use the color coding to understand delivery status:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <span className="text-green-400">Green</span>: Delivered
                      </li>
                      <li>
                        <span className="text-blue-400">Blue</span>: In Transit
                      </li>
                      <li>
                        <span className="text-amber-400">Amber</span>: Pending
                      </li>
                      <li>
                        <span className="text-red-400">Red</span>: Delayed
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="cargo" className="mt-4 space-y-4">
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Package className="h-5 w-5 mr-2 text-emerald-400" />
                Cargo Management
              </h3>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="cargo-1" className="border-slate-700">
                  <AccordionTrigger className="hover:text-emerald-400">Adding Cargo Items</AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Navigate to the Cargo section</li>
                      <li>Click "Add Cargo" button</li>
                      <li>
                        Fill in the required details:
                        <ul className="list-disc pl-5 mt-1">
                          <li>
                            <strong>Name:</strong> Descriptive name for the cargo
                          </li>
                          <li>
                            <strong>Weight (kg):</strong> Accurate weight for optimization
                          </li>
                          <li>
                            <strong>Dimensions:</strong> Format as LxWxH in centimeters
                          </li>
                          <li>
                            <strong>Priority:</strong> Urgent, High, Medium, or Low
                          </li>
                          <li>
                            <strong>Destination:</strong> Delivery location
                          </li>
                        </ul>
                      </li>
                      <li>Click "Add Cargo" to save to the database</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cargo-2" className="border-slate-700">
                  <AccordionTrigger className="hover:text-emerald-400">Knapsack Optimization</AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    <p className="mb-2">The system uses the Knapsack algorithm to optimize cargo loading:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Click "Optimize Cargo" button</li>
                      <li>Select a vehicle from the dropdown</li>
                      <li>Click "Run Knapsack Algorithm"</li>
                      <li>
                        Review the optimization results:
                        <ul className="list-disc pl-5 mt-1">
                          <li>Selected items based on priority and weight</li>
                          <li>Total weight and capacity utilization</li>
                          <li>Items that couldn't be accommodated</li>
                        </ul>
                      </li>
                      <li>Click "Assign Cargo" to confirm the assignments</li>
                    </ol>
                    <p className="mt-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1 text-amber-400" />
                      <span>Higher priority items are given preference during optimization.</span>
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cargo-3" className="border-slate-700">
                  <AccordionTrigger className="hover:text-emerald-400">Managing Cargo Status</AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    <p className="mb-2">Cargo items can have the following statuses:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <strong>Pending:</strong> Not yet assigned or in transit
                      </li>
                      <li>
                        <strong>In Transit:</strong> Currently being delivered
                      </li>
                      <li>
                        <strong>Delivered:</strong> Successfully delivered to destination
                      </li>
                      <li>
                        <strong>Delayed:</strong> Experiencing delivery issues
                      </li>
                    </ul>
                    <p className="mt-2">To update cargo status:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Find the cargo item in the list</li>
                      <li>Click "Update Status" button</li>
                      <li>Select the new status from the dropdown</li>
                      <li>Add any notes if necessary</li>
                      <li>Save the changes</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="algorithms" className="mt-4 space-y-4">
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-emerald-400" />
                Optimization Algorithms
              </h3>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="algo-1" className="border-slate-700">
                  <AccordionTrigger className="hover:text-emerald-400">Knapsack Algorithm</AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    <p className="mb-2">Used for cargo loading optimization:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Maximizes the value (priority) of cargo within weight constraints</li>
                      <li>Ensures high-priority items are loaded first</li>
                      <li>Optimizes vehicle capacity utilization</li>
                      <li>Best for scenarios with weight constraints and varying item priorities</li>
                    </ul>
                    <p className="mt-2">Input parameters:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Cargo items with weights and priority values</li>
                      <li>Vehicle maximum capacity</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="algo-2" className="border-slate-700">
                  <AccordionTrigger className="hover:text-emerald-400">Greedy Algorithm</AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    <p className="mb-2">Used for route optimization:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Selects the nearest unvisited location at each step</li>
                      <li>Fast computation, suitable for real-time updates</li>
                      <li>May not always find the globally optimal solution</li>
                      <li>Good for scenarios with many delivery points</li>
                    </ul>
                    <p className="mt-2">Input parameters:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Starting depot location</li>
                      <li>Set of delivery locations with coordinates</li>
                      <li>Distance matrix between all points</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="algo-3" className="border-slate-700">
                  <AccordionTrigger className="hover:text-emerald-400">Dynamic Programming</AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    <p className="mb-2">Used for complex route optimization:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Finds the globally optimal solution</li>
                      <li>Breaks down the problem into overlapping subproblems</li>
                      <li>More computationally intensive than greedy approach</li>
                      <li>Best for scenarios with fewer delivery points (up to 20-25)</li>
                    </ul>
                    <p className="mt-2">Input parameters:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Complete set of locations</li>
                      <li>Distance matrix between all points</li>
                      <li>Additional constraints (time windows, etc.)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="algo-4" className="border-slate-700">
                  <AccordionTrigger className="hover:text-emerald-400">When to Use Each Algorithm</AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Knapsack:</strong> When loading vehicles with cargo of different priorities and weights
                      </li>
                      <li>
                        <strong>Greedy:</strong> For quick route planning with many delivery points
                      </li>
                      <li>
                        <strong>Dynamic Programming:</strong> When optimal routes are critical and you have fewer points
                      </li>
                      <li>
                        <strong>Divide & Conquer:</strong> For large-scale route planning that can be broken into
                        regions
                      </li>
                      <li>
                        <strong>Backtracking:</strong> When exploring all possible routes is feasible (small datasets)
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
