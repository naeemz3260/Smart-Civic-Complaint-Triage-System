import React, { useState } from 'react'

interface BeforeAfterSliderProps {
  beforeUrl: string
  afterUrl: string
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeUrl, afterUrl }) => {
  const [sliderPos, setSliderPos] = useState<number>(50)

  return (
    <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden select-none border border-slate-700 bg-slate-900 shadow-xl">
      {/* After Image (Background) */}
      <img
        src={afterUrl}
        alt="After repair verification"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute top-3 right-3 bg-emerald-950/80 text-emerald-300 text-xs font-bold px-2 py-1 rounded border border-emerald-700/50">
        AFTER REPAIR
      </div>

      {/* Before Image (Clipped Overlay) */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeUrl}
          alt="Before complaint incident"
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="absolute top-3 left-3 bg-rose-950/80 text-rose-300 text-xs font-bold px-2 py-1 rounded border border-rose-700/50">
          BEFORE (REPORTED)
        </div>
      </div>

      {/* Divider Line & Handle */}
      <div
        className="absolute inset-y-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.8)] cursor-ew-resize flex items-center justify-center"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="w-7 h-7 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold text-xs shadow-md border-2 border-slate-800">
          ↔
        </div>
      </div>

      {/* Interactive Range Input Overlay */}
      <input
        type="range"
        min={0}
        max={100}
        value={sliderPos}
        onChange={(e) => setSliderPos(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
      />
    </div>
  )
}
