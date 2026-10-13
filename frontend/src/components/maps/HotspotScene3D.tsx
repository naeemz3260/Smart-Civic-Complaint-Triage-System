import React, { useEffect, useRef } from 'react'
import { HotspotPoint } from '../../api/types'

interface HotspotScene3DProps {
  points: HotspotPoint[]
}

export const HotspotScene3D: React.FC<HotspotScene3DProps> = ({ points }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let angle = 0

    const render = () => {
      angle += 0.005
      const width = canvas.width
      const height = canvas.height

      ctx.fillStyle = '#090d16'
      ctx.fillRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2 + 30

      // Render 3D isometric plane grid
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = 1
      for (let i = -150; i <= 150; i += 30) {
        const x1 = centerX + (i - 150) * Math.cos(angle) - (-150) * Math.sin(angle) * 0.5
        const y1 = centerY + (i - 150) * Math.sin(angle) * 0.3 + (-150) * Math.cos(angle) * 0.3
        const x2 = centerX + (i + 150) * Math.cos(angle) - (150) * Math.sin(angle) * 0.5
        const y2 = centerY + (i + 150) * Math.sin(angle) * 0.3 + (150) * Math.cos(angle) * 0.3

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      // Render 3D Volumetric Columns for Hotspots
      points.forEach((pt, idx) => {
        const radius = 100 + (idx % 3) * 30
        const itemAngle = angle + (idx * (Math.PI * 2)) / (points.length || 1)
        const colX = centerX + Math.cos(itemAngle) * radius
        const colY = centerY + Math.sin(itemAngle) * radius * 0.4
        const colHeight = 30 + pt.intensity * 80

        // Cylinder / Pillar Base
        ctx.beginPath()
        ctx.ellipse(colX, colY, 8, 4, 0, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(14, 165, 233, 0.3)'
        ctx.fill()

        // Column Extrusion
        const grad = ctx.createLinearGradient(colX, colY, colX, colY - colHeight)
        if (pt.intensity >= 0.8) {
          grad.addColorStop(0, 'rgba(239, 68, 68, 0.4)')
          grad.addColorStop(1, '#ef4444')
        } else {
          grad.addColorStop(0, 'rgba(14, 165, 233, 0.4)')
          grad.addColorStop(1, '#38bdf8')
        }

        ctx.fillStyle = grad
        ctx.fillRect(colX - 6, colY - colHeight, 12, colHeight)

        // Top Cap
        ctx.beginPath()
        ctx.ellipse(colX, colY - colHeight, 6, 3, 0, 0, Math.PI * 2)
        ctx.fillStyle = pt.intensity >= 0.8 ? '#f87171' : '#7dd3fc'
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [points])

  return (
    <div className="relative rounded-2xl overflow-hidden glass-panel border border-slate-800 shadow-2xl">
      <div className="absolute top-3 left-4 z-10">
        <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
          3D Spatio-Temporal Hotspot Density
        </h4>
        <p className="text-[11px] text-slate-400">
          Interactive volumetric columns represent cluster density and incident priority
        </p>
      </div>
      <canvas ref={canvasRef} width={640} height={340} className="w-full h-80 object-cover" />
    </div>
  )
}
