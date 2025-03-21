"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplet, Lightbulb, Fan, Flame, Trash2, BarChart } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeProvider } from "@/components/theme-provider"
import EmailModal from "@/components/email-modal"
import axios from "axios"

interface EnergyUsage {
  lights: { count: number; consumption: number }
  fan: { count: number; consumption: number }
  heater: { count: number; consumption: number }
}

interface UserData {
  water: number
  energy: EnergyUsage
  waste: number
}

export default function SmartAppliancesDashboard() {
  const [email, setEmail] = useState("")
  const [waterConsumption, setWaterConsumption] = useState(100)
  const [lights, setLights] = useState({ count: 5, consumption: 50 })
  const [fan, setFan] = useState({ count: 2, consumption: 75 })
  const [heater, setHeater] = useState({ count: 1, consumption: 1500 })
  const [wasteGenerated, setWasteGenerated] = useState(10)
  const [mounted, setMounted] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  const saveDataToFirebase = async (data: UserData) => {
    try {
      await axios.post("/api/saveData", { email, ...data })
    } catch (error) {
      console.error("Failed to save data to Firebase:", error)
    }
  }

  const handleEmailSubmit = (email: string) => {
    setEmail(email)
    setShowEmailModal(false)
  }

  const handleWaterChange = (newValue: number) => {
    if (newValue >= 0) {
      setWaterConsumption(newValue)
      saveDataToFirebase({
        water: newValue,
        energy: { lights, fan, heater },
        waste: wasteGenerated,
      })
    }
  }

  const handleLightsCountChange = (newCount: number) => {
    if (newCount >= 0) {
      setLights({ ...lights, count: newCount })
      saveDataToFirebase({
        water: waterConsumption,
        energy: { lights: { ...lights, count: newCount }, fan, heater },
        waste: wasteGenerated,
      })
    }
  }

  const handleLightsConsumptionChange = (newConsumption: number) => {
    if (newConsumption >= 0) {
      setLights({ ...lights, consumption: newConsumption })
      saveDataToFirebase({
        water: waterConsumption,
        energy: { lights: { ...lights, consumption: newConsumption }, fan, heater },
        waste: wasteGenerated,
      })
    }
  }

  const handleFanCountChange = (newCount: number) => {
    if (newCount >= 0) {
      setFan({ ...fan, count: newCount })
      saveDataToFirebase({
        water: waterConsumption,
        energy: { lights, fan: { ...fan, count: newCount }, heater },
        waste: wasteGenerated,
      })
    }
  }

  const handleFanConsumptionChange = (newConsumption: number) => {
    if (newConsumption >= 0) {
      setFan({ ...fan, consumption: newConsumption })
      saveDataToFirebase({
        water: waterConsumption,
        energy: { lights, fan: { ...fan, consumption: newConsumption }, heater },
        waste: wasteGenerated,
      })
    }
  }

  const handleHeaterCountChange = (newCount: number) => {
    if (newCount >= 0) {
      setHeater({ ...heater, count: newCount })
      saveDataToFirebase({
        water: waterConsumption,
        energy: { lights, fan, heater: { ...heater, count: newCount } },
        waste: wasteGenerated,
      })
    }
  }

  const handleHeaterConsumptionChange = (newConsumption: number) => {
    if (newConsumption >= 0) {
      setHeater({ ...heater, consumption: newConsumption })
      saveDataToFirebase({
        water: waterConsumption,
        energy: { lights, fan, heater: { ...heater, consumption: newConsumption } },
        waste: wasteGenerated,
      })
    }
  }

  const handleWasteChange = (newValue: number) => {
    if (newValue >= 0) {
      setWasteGenerated(newValue)
      saveDataToFirebase({
        water: waterConsumption,
        energy: { lights, fan, heater },
        waste: newValue,
      })
    }
  }

  if (!mounted) {
    return null
  }

  const totalEnergy =
    lights.count * lights.consumption + fan.count * fan.consumption + heater.count * heater.consumption

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-background/80 transition-colors duration-500">
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 dark:from-primary dark:to-primary/70">
              Smart Appliances Dashboard
            </h1>
            <ThemeToggle />
          </div>

          {showEmailModal && <EmailModal open={showEmailModal} onClose={() => setShowEmailModal(false)} onEmailSubmit={handleEmailSubmit} />}

          {!showEmailModal && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Water Usage Card */}
              <Card className="border-t-4 border-blue-500 dark:border-blue-400 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/10 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-blue-500 dark:text-blue-400 group-hover:animate-pulse" />
                    Water Usage
                  </CardTitle>
                  <CardDescription>Track your water consumption</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Consumption:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleWaterChange(waterConsumption - 1)}
                          className="hover:bg-blue-500/10 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        >
                          -
                        </Button>
                        <span className="w-16 text-center font-mono bg-muted/50 rounded-md py-1">
                          {waterConsumption} L
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleWaterChange(waterConsumption + 1)}
                          className="hover:bg-blue-500/10 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lights Card */}
              <Card className="border-t-4 border-yellow-500 dark:border-yellow-400 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 group">
                <CardHeader className="pb-2 bg-gradient-to-r from-yellow-500/10 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500 dark:text-yellow-400 group-hover:animate-pulse" />
                    Lights
                  </CardTitle>
                  <CardDescription>Manage your lighting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Bulbs:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleLightsCountChange(lights.count - 1)}
                          className="hover:bg-yellow-500/10 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                        >
                          -
                        </Button>
                        <span className="w-16 text-center font-mono bg-muted/50 rounded-md py-1">{lights.count}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleLightsCountChange(lights.count + 1)}
                          className="hover:bg-yellow-500/10 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Consumption:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleLightsConsumptionChange(lights.consumption - 5)}
                          className="hover:bg-yellow-500/10 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                        >
                          -
                        </Button>
                        <span className="w-16 text-center font-mono bg-muted/50 rounded-md py-1">
                          {lights.consumption} W
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleLightsConsumptionChange(lights.consumption + 5)}
                          className="hover:bg-yellow-500/10 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fan Card */}
              <Card className="border-t-4 border-green-500 dark:border-green-400 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 group">
                <CardHeader className="pb-2 bg-gradient-to-r from-green-500/10 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <Fan className="h-5 w-5 text-green-500 dark:text-green-400 group-hover:animate-spin" />
                    Fans
                  </CardTitle>
                  <CardDescription>Control your fans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Count:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleFanCountChange(fan.count - 1)}
                          className="hover:bg-green-500/10 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                        >
                          -
                        </Button>
                        <span className="w-16 text-center font-mono bg-muted/50 rounded-md py-1">{fan.count}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleFanCountChange(fan.count + 1)}
                          className="hover:bg-green-500/10 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Consumption:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleFanConsumptionChange(fan.consumption - 5)}
                          className="hover:bg-green-500/10 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                        >
                          -
                        </Button>
                        <span className="w-16 text-center font-mono bg-muted/50 rounded-md py-1">
                          {fan.consumption} W
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleFanConsumptionChange(fan.consumption + 5)}
                          className="hover:bg-green-500/10 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Heater Card */}
              <Card className="border-t-4 border-red-500 dark:border-red-400 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 group">
                <CardHeader className="pb-2 bg-gradient-to-r from-red-500/10 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-red-500 dark:text-red-400 group-hover:animate-pulse" />
                    Heaters
                  </CardTitle>
                  <CardDescription>Manage your heating</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Count:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleHeaterCountChange(heater.count - 1)}
                          className="hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          -
                        </Button>
                        <span className="w-16 text-center font-mono bg-muted/50 rounded-md py-1">{heater.count}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleHeaterCountChange(heater.count + 1)}
                          className="hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Consumption:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleHeaterConsumptionChange(heater.consumption - 100)}
                          className="hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          -
                        </Button>
                        <span className="w-16 text-center font-mono bg-muted/50 rounded-md py-1">
                          {heater.consumption} W
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleHeaterConsumptionChange(heater.consumption + 100)}
                          className="hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Waste Card */}
              <Card className="border-t-4 border-gray-500 dark:border-gray-400 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/10 group">
                <CardHeader className="pb-2 bg-gradient-to-r from-gray-500/10 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:animate-bounce" />
                    Waste Generated
                  </CardTitle>
                  <CardDescription>Track your waste</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Amount:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleWasteChange(wasteGenerated - 1)}
                          className="hover:bg-gray-500/10 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                        >
                          -
                        </Button>
                        <span className="w-16 text-center font-mono bg-muted/50 rounded-md py-1">
                          {wasteGenerated} kg
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleWasteChange(wasteGenerated + 1)}
                          className="hover:bg-gray-500/10 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Card */}
              <Card className="border-t-4 border-primary overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group md:col-span-2 lg:col-span-1">
                <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-primary group-hover:animate-pulse" />
                    Carbon Footprint Summary
                  </CardTitle>
                  <CardDescription>Your current usage statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                        Water:
                      </span>
                      <span className="font-mono bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md">
                        {waterConsumption} L
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                        Lights:
                      </span>
                      <span className="font-mono bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-md">
                        {lights.count} × {lights.consumption} W
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Fan className="h-4 w-4 text-green-500 dark:text-green-400" />
                        Fans:
                      </span>
                      <span className="font-mono bg-green-500/10 text-green-700 dark:text-green-300 px-2 py-1 rounded-md">
                        {fan.count} × {fan.consumption} W
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-red-500 dark:text-red-400" />
                        Heaters:
                      </span>
                      <span className="font-mono bg-red-500/10 text-red-700 dark:text-red-300 px-2 py-1 rounded-md">
                        {heater.count} × {heater.consumption} W
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        Waste:
                      </span>
                      <span className="font-mono bg-gray-500/10 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md">
                        {wasteGenerated} kg
                      </span>
                    </div>
                    <div className="pt-3 border-t mt-3">
                      <div className="flex justify-between font-medium items-center">
                        <span className="text-lg">Total Energy:</span>
                        <div className="relative">
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-red-500 to-red-700 opacity-20 rounded-md"
                            style={{
                              width: `${Math.min(100, (totalEnergy / 5000) * 100)}%`,
                              transition: "width 0.5s ease-in-out",
                            }}
                          />
                          <span className="relative font-mono text-lg font-bold px-2 py-1 rounded-md">
                            {totalEnergy} W
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="mt-8 p-6 bg-muted rounded-lg border border-border shadow-inner">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              Console Output
            </h2>
            <p className="text-sm text-muted-foreground">
              Check your browser console (F12) to see the data updates logged by the calculateUpdate function.
            </p>
            <div className="mt-4 p-3 bg-black/90 text-green-400 font-mono text-xs rounded-md overflow-x-auto">
              <p>// Example console output:</p>
              <p className="opacity-80">
                Updated data for lights: {"{"} energy: {"{"} lights: {"{"} count: 6, consumption: 50 {"}"}
                {"}"}
                {"}"};
              </p>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}