import React, { useEffect, useRef } from 'react'

interface MapPoint {
  id: string
  lat: number
  lng: number
  title?: string
  priority?: number
  category?: string
}

interface MapView2DProps {
  points?: MapPoint[]
  selectedLat?: number
  selectedLng?: number
  onSelectLocation?: (lat: number, lng: number) => void
  interactivePin?: boolean
}

export const MapView2D: React.FC<MapView2DProps> = ({
  points = [],
  selectedLat = 24.8562,
  selectedLng = 67.0261,
  onSelectLocation,
  interactivePin = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Bounding box approximation for demo metropolis area
  const minLat = 24.80
  const maxLat = 24.99
  const minLng = 66.98
  const maxLng = 67.12

  const project = (lat: number, lng: number, width: number, height: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * width
    const y = height - ((lat - minLat) / (maxLat - minLat)) * height
    return { x, y }
  }

  const unproject = (x: number, y: number, width: number, height: number) => {
    const lng = minLng + (x / width) * (maxLng - minLng)
    const lat = minLat + ((height - y) / height) * (maxLat - minLat)
    return { lat: Number(lat.toFixed(4)), lng: Number(lng.toFixed(4)) }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // 1. Draw Map Background / Grid
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, width, height)

    // Grid lines
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 1
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // 2. Ward Boundaries (Polygons)
    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 1.5
    ctx.fillStyle = 'rgba(56, 189, 248, 0.05)'
    
    // Ward 1 & Ward 2 simulation outlines
    ctx.beginPath()
    ctx.rect(40, height - 140, 160, 100)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#64748b'
    ctx.font = '10px monospace'
    ctx.fillText('WARD-01 (Coastal)', 50, height - 50)

    ctx.beginPath()
    ctx.rect(120, height - 260, 180, 100)
    ctx.fill()
    ctx.stroke()
    ctx.fillText('WARD-02 (Central)', 130, height - 170)

    // 3. Draw Points
    points.forEach((pt) => {
      const { x, y } = project(pt.lat, pt.lng, width, height)
      const p = pt.priority || 0.5

      // Glow circle
      ctx.beginPath()
      ctx.arc(x, y, 6 + p * 6, 0, Math.PI * 2)
      ctx.fillStyle = p >= 0.8 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(14, 165, 233, 0.3)'
      ctx.fill()

      // Core point
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = p >= 0.8 ? '#ef4444' : '#38bdf8'
      ctx.fill()
    })

    // 4. Draw Selected Location Pin
    if (selectedLat && selectedLng) {
      const { x, y } = project(selectedLat, selectedLng, width, height)
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fillStyle = '#f59e0b'
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }, [points, selectedLat, selectedLng])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactivePin || !onSelectLocation || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const { lat, lng } = unproject(x, y, canvasRef.current.width, canvasRef.current.height)
    onSelectLocation(lat, lng)
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner">
      <canvas
        ref={canvasRef}
        width={600}
        height={320}
        onClick={handleClick}
        className={`w-full h-72 md:h-80 object-cover ${interactivePin ? 'cursor-crosshair' : 'cursor-default'}`}
      />
      <div className="absolute bottom-2 left-2 bg-slate-900/90 text-[10px] text-slate-400 px-2 py-1 rounded border border-slate-700/60 font-mono">
        Lat: {selectedLat.toFixed(4)}, Lng: {selectedLng.toFixed(4)}
      </div>
      {interactivePin && (
        <div className="absolute top-2 right-2 bg-sky-950/80 text-sky-300 text-xs px-2.5 py-1 rounded border border-sky-800/60 font-medium">
          Click map to pin incident
        </div>
      )}
    </div>
  )
}
