"use client"

import type React from "react"

import { useState } from "react"
import { Save, Bell, Moon, Sun, Lock, User, Mail, Shield, MapPin, Truck, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  // Profile settings
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Logistics",
    bio: "Logistics manager with 5+ years of experience in route optimization and delivery management.",
  })

  // Account settings
  const [account, setAccount] = useState({
    language: "english",
    timezone: "utc-8",
    theme: "dark",
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    deliveryUpdates: true,
    systemAlerts: true,
    marketingEmails: false,
  })

  // Route optimization settings
  const [routeSettings, setRouteSettings] = useState({
    defaultAlgorithm: "dynamic",
    avoidHighways: false,
    avoidTolls: true,
    preferFastestRoute: true,
    maxDistancePerDriver: 100,
  })

  // Handle profile input changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle account select changes
  const handleAccountSelectChange = (name: string, value: string) => {
    setAccount((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle notification switch changes
  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  // Handle route settings changes
  const handleRouteSettingChange = (name: string, value: any) => {
    setRouteSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-slate-400">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-emerald-900/50 data-[state=active]:text-emerald-400"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="data-[state=active]:bg-emerald-900/50 data-[state=active]:text-emerald-400"
          >
            <Lock className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-emerald-900/50 data-[state=active]:text-emerald-400"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="route"
            className="data-[state=active]:bg-emerald-900/50 data-[state=active]:text-emerald-400"
          >
            <Truck className="h-4 w-4 mr-2" />
            Route Settings
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription className="text-slate-400">
                Manage your personal information and company details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      className="bg-slate-900 border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="bg-slate-900 border-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className="bg-slate-900 border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      name="company"
                      value={profile.company}
                      onChange={handleProfileChange}
                      className="bg-slate-900 border-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleProfileChange}
                    className="min-h-[100px] bg-slate-900 border-slate-700"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account">
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription className="text-slate-400">
                Manage your account preferences and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={account.language}
                      onValueChange={(value) => handleAccountSelectChange("language", value)}
                    >
                      <SelectTrigger className="bg-slate-900 border-slate-700">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={account.timezone}
                      onValueChange={(value) => handleAccountSelectChange("timezone", value)}
                    >
                      <SelectTrigger className="bg-slate-900 border-slate-700">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="utc-12">UTC-12:00</SelectItem>
                        <SelectItem value="utc-8">UTC-08:00 (PST)</SelectItem>
                        <SelectItem value="utc-5">UTC-05:00 (EST)</SelectItem>
                        <SelectItem value="utc">UTC+00:00</SelectItem>
                        <SelectItem value="utc+1">UTC+01:00</SelectItem>
                        <SelectItem value="utc+5.5">UTC+05:30 (IST)</SelectItem>
                        <SelectItem value="utc+8">UTC+08:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex gap-4">
                    <div
                      className={`flex items-center gap-2 p-3 rounded-md cursor-pointer border ${
                        account.theme === "dark" ? "border-emerald-500 bg-slate-700" : "border-slate-700 bg-slate-900"
                      }`}
                      onClick={() => handleAccountSelectChange("theme", "dark")}
                    >
                      <Moon className="h-5 w-5 text-slate-300" />
                      <span>Dark</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 p-3 rounded-md cursor-pointer border ${
                        account.theme === "light" ? "border-emerald-500 bg-slate-700" : "border-slate-700 bg-slate-900"
                      }`}
                      onClick={() => handleAccountSelectChange("theme", "light")}
                    >
                      <Sun className="h-5 w-5 text-yellow-400" />
                      <span>Light</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 p-3 rounded-md cursor-pointer border ${
                        account.theme === "system" ? "border-emerald-500 bg-slate-700" : "border-slate-700 bg-slate-900"
                      }`}
                      onClick={() => handleAccountSelectChange("theme", "system")}
                    >
                      <Palette className="h-5 w-5 text-purple-400" />
                      <span>System</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Security</Label>
                  <div className="p-4 rounded-md bg-slate-900 border border-slate-700">
                    <Button variant="outline" className="w-full justify-start">
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="mr-2 h-4 w-4" />
                        Two-Factor Authentication
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription className="text-slate-400">
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Notification Channels</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>Email Notifications</span>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-slate-400" />
                        <span>Push Notifications</span>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>SMS Notifications</span>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notification Types</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Delivery Updates</div>
                        <div className="text-sm text-slate-400">
                          Receive notifications about delivery status changes
                        </div>
                      </div>
                      <Switch
                        checked={notifications.deliveryUpdates}
                        onCheckedChange={(checked) => handleNotificationChange("deliveryUpdates", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">System Alerts</div>
                        <div className="text-sm text-slate-400">Important system notifications and alerts</div>
                      </div>
                      <Switch
                        checked={notifications.systemAlerts}
                        onCheckedChange={(checked) => handleNotificationChange("systemAlerts", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Marketing Emails</div>
                        <div className="text-sm text-slate-400">Receive updates about new features and promotions</div>
                      </div>
                      <Switch
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Route Settings */}
        <TabsContent value="route">
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Route Optimization Settings</CardTitle>
              <CardDescription className="text-slate-400">
                Configure your default route optimization preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultAlgorithm">Default Algorithm</Label>
                  <Select
                    value={routeSettings.defaultAlgorithm}
                    onValueChange={(value) => handleRouteSettingChange("defaultAlgorithm", value)}
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700">
                      <SelectValue placeholder="Select algorithm" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="divide_and_conquer">Divide and Conquer</SelectItem>
                      <SelectItem value="greedy">Greedy Method</SelectItem>
                      <SelectItem value="dynamic">Dynamic Programming</SelectItem>
                      <SelectItem value="backtracking">Backtracking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Route Preferences</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>Avoid Highways</span>
                      </div>
                      <Switch
                        checked={routeSettings.avoidHighways}
                        onCheckedChange={(checked) => handleRouteSettingChange("avoidHighways", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>Avoid Tolls</span>
                      </div>
                      <Switch
                        checked={routeSettings.avoidTolls}
                        onCheckedChange={(checked) => handleRouteSettingChange("avoidTolls", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>Prefer Fastest Route</span>
                      </div>
                      <Switch
                        checked={routeSettings.preferFastestRoute}
                        onCheckedChange={(checked) => handleRouteSettingChange("preferFastestRoute", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxDistance">Maximum Distance per Driver (km)</Label>
                  <Input
                    id="maxDistance"
                    type="number"
                    value={routeSettings.maxDistancePerDriver}
                    onChange={(e) => handleRouteSettingChange("maxDistancePerDriver", Number.parseInt(e.target.value))}
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
