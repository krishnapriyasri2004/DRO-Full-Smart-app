"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Icon } from "leaflet"
import { COIMBATORE_CENTER, COIMBATORE_ZOOM, COIMBATORE_AREAS } from "@/lib/coimbatore-mapping"

// Fix for default marker icon in Next.js
const defaultIcon = new Icon({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface CoimbatoreMapProps {
  routes?: Array<{
    id: string
    points: [number, number][]
    color?: string
    name?: string
  }>
  markers?: Array<{
    position: [number, number]
    title: string
    description?: string
    icon?: Icon
  }>
  showAllAreas?: boolean
  height?: string
  width?: string
}

export default function CoimbatoreMap({
  routes = [],
  markers = [],
  showAllAreas = false,
  height = "500px",
  width = "100%",
}: CoimbatoreMapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div style={{ height, width }} className="bg-gray-100 flex items-center justify-center">
        Loading map...
      </div>
    )
  }

  return (
    <MapContainer
      center={COIMBATORE_CENTER}
      zoom={COIMBATORE_ZOOM}
      style={{ height, width }}
      className="rounded-lg border border-gray-200"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Display all major areas in Coimbatore if requested */}
      {showAllAreas &&
        Object.entries(COIMBATORE_AREAS).map(([key, area]) => (
          <Marker key={key} position={area.coordinates as [number, number]} icon={defaultIcon}>
            <Popup>
              <strong>{area.name}</strong>
            </Popup>
          </Marker>
        ))}

      {/* Display custom markers */}
      {markers.map((marker, index) => (
        <Marker key={`marker-${index}`} position={marker.position} icon={marker.icon || defaultIcon}>
          <Popup>
            <strong>{marker.title}</strong>
            {marker.description && <p>{marker.description}</p>}
          </Popup>
        </Marker>
      ))}

      {/* Display routes */}
      {routes.map((route) => (
        <Polyline key={route.id} positions={route.points} color={route.color || "blue"} weight={4}>
          {route.name && (
            <Popup>
              <strong>{route.name}</strong>
            </Popup>
          )}
        </Polyline>
      ))}
    </MapContainer>
  )
}
