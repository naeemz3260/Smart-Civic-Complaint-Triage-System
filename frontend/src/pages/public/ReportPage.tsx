import React, { useState } from 'react'
import { MapView2D } from '../../components/maps/MapView2D'
import { checkNearbyDuplicates, createComplaint } from '../../api/complaints'
import { Complaint } from '../../api/types'
import { translate } from '../../i18n'
import { useAppState } from '../../store/AppStateContext'
import { AlertCircle, Camera, CheckCircle2, Send, MapPin } from 'lucide-react'

interface ReportPageProps {
  onSuccess: (complaint: Complaint) => void
}

export const ReportPage: React.FC<ReportPageProps> = ({ onSuccess }) => {
  const { language } = useAppState()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [lat, setLat] = useState(24.8562)
  const [lng, setLng] = useState(67.0261)
  const [photoFilename, setPhotoFilename] = useState<string | null>(null)
  const [nearbyDuplicates, setNearbyDuplicates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [submittedTicket, setSubmittedTicket] = useState<Complaint | null>(null)

  const handleLocationSelect = async (newLat: number, newLng: number) => {
    setLat(newLat)
    setLng(newLng)
    try {
      const dupes = await checkNearbyDuplicates(newLat, newLng)
      setNearbyDuplicates(dupes)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description) return
    setLoading(true)
    try {
      const result = await createComplaint({
        title,
        description,
        latitude: lat,
        longitude: lng,
        photo_filename: photoFilename || undefined,
      })
      setSubmittedTicket(result)
      onSuccess(result)
    } catch (err: any) {
      alert(`Submission Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (submittedTicket) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-white">Complaint Submitted & Triaged!</h2>
        <div className="glass-panel p-6 rounded-2xl border border-sky-500/30 text-left space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="text-xs text-slate-400">Tracking Code</span>
            <span className="font-mono text-base font-bold text-sky-400">{submittedTicket.tracking_code}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Assigned Ward</span>
            <span className="font-semibold text-slate-200">{submittedTicket.ward_id}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Department</span>
            <span className="font-semibold text-slate-200">{submittedTicket.department}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Priority Score</span>
            <span className="font-bold text-rose-400">{(submittedTicket.priority_score * 100).toFixed(0)}%</span>
          </div>
        </div>
        <button
          onClick={() => {
            setSubmittedTicket(null)
            setTitle('')
            setDescription('')
            setNearbyDuplicates([])
          }}
          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg"
        >
          Submit Another Issue
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">
          {translate('nav_report', language)}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {translate('hero_subheading', language)}
        </p>
      </div>

      {/* Duplicate Alert Banner */}
      {nearbyDuplicates.length > 0 && (
        <div className="glass-panel border-amber-500/40 bg-amber-950/20 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-300">
              {translate('duplicate_alert_title', language)} ({nearbyDuplicates.length} found)
            </h4>
            <p className="text-xs text-slate-300">
              {translate('duplicate_alert_desc', language)}
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              {nearbyDuplicates.map((dup) => (
                <span key={dup.id} className="text-[11px] bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700 text-slate-300">
                  {dup.title} ({dup.distance_meters}m away)
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Form Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              {translate('form_title', language)}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={translate('form_title_placeholder', language)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              {translate('form_desc', language)}
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={translate('form_desc_placeholder', language)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Photo upload mock selector */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              {translate('form_photo', language)}
            </label>
            <div className="flex gap-2">
              {['pothole_before.jpg', 'sewage_before.jpg', 'live_wire.jpg'].map((photo) => (
                <button
                  type="button"
                  key={photo}
                  onClick={() => setPhotoFilename(photo)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    photoFilename === photo
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  {photo.split('.')[0]}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-xl transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Processing Triage...' : translate('form_submit', language)}
          </button>
        </div>

        {/* Right Column: Interactive Map Pinning */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase text-slate-400">
            {translate('form_location', language)}
          </label>
          <MapView2D
            selectedLat={lat}
            selectedLng={lng}
            onSelectLocation={handleLocationSelect}
            interactivePin={true}
          />
        </div>
      </form>
    </div>
  )
}
