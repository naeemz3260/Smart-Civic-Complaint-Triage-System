import React, { useEffect, useState } from 'react'
import { fetchComplaints } from '../../api/complaints'
import { getReviewQueue, decideReview } from '../../api/workflow'
import { fetchHotspots, simulateWhatIf, fetchModelReport } from '../../api/stats'
import { Complaint, ReviewItem, HotspotPoint, WhatIfItem } from '../../api/types'
import { TicketCard } from '../../components/tickets/TicketCard'
import { HotspotScene3D } from '../../components/maps/HotspotScene3D'
import { ShieldAlert, Sliders, Layers, FileText, Check, AlertCircle } from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'queue' | 'review' | 'hotspots' | 'whatif' | 'ml'>('queue')
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([])
  const [hotspots, setHotspots] = useState<HotspotPoint[]>([])
  const [whatIfResults, setWhatIfResults] = useState<WhatIfItem[]>([])
  const [modelReport, setModelReport] = useState<any | null>(null)

  // What-If Weights
  const [sevWeight, setSevWeight] = useState(0.35)
  const [impWeight, setImpWeight] = useState(0.25)
  const [urgWeight, setUrgWeight] = useState(0.25)
  const [vulnWeight, setVulnWeight] = useState(0.15)

  const loadData = async () => {
    try {
      const [cmps, reviews, hspots, ml] = await Promise.all([
        fetchComplaints(),
        getReviewQueue(),
        fetchHotspots(),
        fetchModelReport(),
      ])
      setComplaints(cmps)
      setReviewItems(reviews)
      setHotspots(hspots)
      setModelReport(ml)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const runSimulation = async () => {
    try {
      const res = await simulateWhatIf({
        severity_weight: sevWeight,
        impact_weight: impWeight,
        urgency_weight: urgWeight,
        vulnerability_weight: vulnWeight,
      })
      setWhatIfResults(res)
    } catch (e) {
      console.error(e)
    }
  }

  const handleReviewDecision = async (id: number, category: string) => {
    try {
      await decideReview(id, category, 'Admin verified classification')
      loadData()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h1 className="text-xl font-bold">Municipal Admin Command Center</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            SLA supervision, human-in-the-loop triage, 3D hotspots, and policy simulations.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'queue' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Tickets ({complaints.length})
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'review' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Review Queue
            {reviewItems.length > 0 && (
              <span className="w-4 h-4 bg-purple-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                {reviewItems.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('hotspots')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'hotspots' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3D Hotspots
          </button>
          <button
            onClick={() => setActiveTab('whatif')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'whatif' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Policy "What-If"
          </button>
          <button
            onClick={() => setActiveTab('ml')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'ml' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ML Reports
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complaints.map((c) => (
            <TicketCard key={c.id} ticket={c} />
          ))}
        </div>
      )}

      {activeTab === 'review' && (
        <div className="space-y-4">
          <div className="glass-panel p-4 rounded-xl border border-purple-500/30 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-purple-400" />
            <p className="text-xs text-purple-200">
              Complaints below the confidence threshold (70%) are routed here for human validation before field dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviewItems.map((item) => (
              <div key={item.review_id} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs text-sky-400">{item.complaint_id}</span>
                    <h3 className="font-bold text-sm text-white mt-1">{item.title}</h3>
                  </div>
                  <span className="text-xs font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                    Confidence: {(item.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-slate-400">{item.description}</p>
                <div className="text-[11px] text-slate-500 italic">Flag reason: {item.reason}</div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Confirm Category:</span>
                  <div className="flex gap-1.5">
                    {['pothole', 'sewage', 'garbage', 'electricity', 'water', 'streetlight'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleReviewDecision(item.review_id, cat)}
                        className={`text-[11px] px-2.5 py-1 rounded border capitalize transition-all ${
                          item.predicted_category === cat
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500 font-bold'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {reviewItems.length === 0 && (
              <div className="col-span-2 glass-panel p-12 text-center text-slate-500 text-xs">
                No tickets currently require human review. All predictions exceed confidence thresholds!
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'hotspots' && (
        <div className="space-y-4">
          <HotspotScene3D points={hotspots} />
        </div>
      )}

      {activeTab === 'whatif' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h3 className="font-bold text-base text-white">Policy "What-If" Priority Simulator</h3>
            <p className="text-xs text-slate-400 mt-1">
              Test hypothetical weighting policies to simulate how municipal priority rankings would adjust across the city.
            </p>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Severity:</span>
                <span className="font-bold text-rose-400">{sevWeight.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={sevWeight}
                onChange={(e) => setSevWeight(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Impact:</span>
                <span className="font-bold text-amber-400">{impWeight.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={impWeight}
                onChange={(e) => setImpWeight(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Urgency:</span>
                <span className="font-bold text-yellow-400">{urgWeight.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={urgWeight}
                onChange={(e) => setUrgWeight(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Vulnerability:</span>
                <span className="font-bold text-purple-400">{vulnWeight.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={vulnWeight}
                onChange={(e) => setVulnWeight(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <button
            onClick={runSimulation}
            className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
          >
            Run Policy Simulation
          </button>

          {/* Simulation Output Table */}
          {whatIfResults.length > 0 && (
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] uppercase bg-slate-900/80 text-slate-400">
                  <tr>
                    <th className="p-2.5">Ticket ID</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Original Score</th>
                    <th className="p-2.5">Simulated Score</th>
                    <th className="p-2.5">Orig Rank</th>
                    <th className="p-2.5">Sim Rank</th>
                    <th className="p-2.5">Rank Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {whatIfResults.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40">
                      <td className="p-2.5 font-mono text-sky-400">{item.id}</td>
                      <td className="p-2.5 capitalize">{item.category}</td>
                      <td className="p-2.5">{item.original_score.toFixed(2)}</td>
                      <td className="p-2.5 font-bold text-amber-300">{item.simulated_score.toFixed(2)}</td>
                      <td className="p-2.5">#{item.original_rank}</td>
                      <td className="p-2.5 font-bold">#{item.simulated_rank}</td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            item.rank_delta > 0
                              ? 'bg-rose-500/20 text-rose-300'
                              : item.rank_delta < 0
                              ? 'bg-slate-800 text-slate-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {item.rank_delta > 0 ? `+${item.rank_delta}` : item.rank_delta}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ml' && modelReport && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h3 className="font-bold text-base text-white">Machine Learning Classification Metrics</h3>
            <p className="text-xs text-slate-400 mt-1">
              Evaluation performance benchmarked on held-out test dataset.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-500 block">Accuracy</span>
              <span className="text-xl font-bold text-emerald-400">
                {(modelReport.metrics.accuracy * 100).toFixed(1)}%
              </span>
            </div>
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-500 block">F1 Macro Score</span>
              <span className="text-xl font-bold text-sky-400">
                {(modelReport.metrics.f1_macro * 100).toFixed(1)}%
              </span>
            </div>
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-500 block">Test Samples</span>
              <span className="text-xl font-bold text-slate-200">
                {modelReport.metrics.total_samples}
              </span>
            </div>
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-500 block">Correct Predictions</span>
              <span className="text-xl font-bold text-indigo-400">
                {modelReport.metrics.correct}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
