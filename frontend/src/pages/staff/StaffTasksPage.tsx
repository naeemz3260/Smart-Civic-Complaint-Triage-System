import React, { useEffect, useState } from 'react'
import { fetchComplaints } from '../../api/complaints'
import { verifyClosure } from '../../api/workflow'
import { Complaint } from '../../api/types'
import { TicketCard } from '../../components/tickets/TicketCard'
import { HardHat, Camera, Check, RefreshCw } from 'lucide-react'

export const StaffTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Complaint[]>([])
  const [selectedTask, setSelectedTask] = useState<Complaint | null>(null)
  const [closurePhoto, setClosurePhoto] = useState('pothole_after.jpg')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any | null>(null)

  const loadTasks = async () => {
    try {
      const all = await fetchComplaints({ status: 'IN_PROGRESS' })
      const assigned = await fetchComplaints({ status: 'ASSIGNED' })
      setTasks([...all, ...assigned])
      if (all.length > 0 && !selectedTask) {
        setSelectedTask(all[0])
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleVerify = async () => {
    if (!selectedTask) return
    setSubmitting(true)
    try {
      const res = await verifyClosure(selectedTask.id, closurePhoto, comment)
      setVerificationResult(res)
      loadTasks()
    } catch (e: any) {
      alert(`Error verifying closure: ${e.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-amber-400">
            <HardHat className="w-5 h-5" />
            <h1 className="text-xl font-bold">Field Staff Dispatch Work Orders</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Execute assignments sorted by priority & submit photo evidence for closure.
          </p>
        </div>
        <button
          onClick={loadTasks}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Task List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Active Work Orders ({tasks.length})
          </h3>
          {tasks.length === 0 ? (
            <div className="glass-panel p-6 rounded-xl text-center text-xs text-slate-500">
              No pending work orders assigned.
            </div>
          ) : (
            tasks.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedTask(t)
                  setVerificationResult(null)
                }}
                className={`cursor-pointer transition-all ${
                  selectedTask?.id === t.id ? 'ring-2 ring-amber-400 rounded-xl' : ''
                }`}
              >
                <TicketCard ticket={t} />
              </div>
            ))
          )}
        </div>

        {/* Right: Resolution & Photo Proof Panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTask ? (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="font-mono text-xs text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  {selectedTask.tracking_code}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{selectedTask.title}</h2>
                <p className="text-xs text-slate-400 mt-1">{selectedTask.description}</p>
              </div>

              {/* Photo Resolution Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Mandatory "After" Completion Proof Photo
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-800 rounded-xl p-3 bg-slate-900/40 text-center space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Before (Citizen Evidence)
                    </span>
                    <div className="w-full h-32 bg-slate-800 rounded-lg flex items-center justify-center text-xs text-slate-400">
                      Initial Photo
                    </div>
                  </div>

                  <div className="border border-slate-800 rounded-xl p-3 bg-slate-900/40 text-center space-y-2">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">
                      Select After Resolution Photo
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {['pothole_after.jpg', 'sewage_after.jpg', 'light_after.jpg'].map((photo) => (
                        <button
                          key={photo}
                          type="button"
                          onClick={() => setClosurePhoto(photo)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between ${
                            closurePhoto === photo
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          <span>{photo}</span>
                          {closurePhoto === photo && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Staff Resolution Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Work completed according to municipal specification..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  onClick={handleVerify}
                  disabled={submitting}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  {submitting ? 'Running Vision Match...' : 'Submit Evidence & Mark Resolved'}
                </button>

                {verificationResult && (
                  <div className="glass-panel border-emerald-500/40 bg-emerald-950/20 p-4 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      Vision Verification Passed!
                    </div>
                    <div className="text-slate-300">
                      Visual Difference Score: {(verificationResult.verification.visual_difference_score * 100).toFixed(0)}%
                    </div>
                    <div className="text-slate-300">
                      Landmark Match Score: {(verificationResult.verification.landmark_match_score * 100).toFixed(0)}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center text-slate-500 text-sm">
              Select a work order from the left to view details and submit completion proof.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
