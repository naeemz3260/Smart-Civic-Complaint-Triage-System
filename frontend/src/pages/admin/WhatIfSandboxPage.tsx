import React, { useState } from 'react'
import { PageContainer } from '@/components/common/PageContainer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useQuery, useMutation } from '@tanstack/react-query'
import { runWhatIfSimulation } from '@/lib/api'
import { Sliders, RotateCcw, ArrowUp, ArrowDown, Minus } from 'lucide-react'

export const WhatIfSandboxPage: React.FC = () => {
  const [weights, setWeights] = useState({
    severity: 0.35,
    impact: 0.25,
    urgency: 0.25,
    vulnerability: 0.15,
  })

  const { data: simulationItems, mutate, isPending } = useMutation({
    mutationFn: () => runWhatIfSimulation(weights),
  })

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    setWeights({
      severity: 0.35,
      impact: 0.25,
      urgency: 0.25,
      vulnerability: 0.15,
    })
  }

  return (
    <PageContainer className="py-8 space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-soft text-primary text-xs font-semibold mb-1.5">
          <Sliders className="w-3.5 h-3.5" />
          <span>Priority Engine Calibration</span>
        </div>
        <h1 className="text-2xl font-bold text-text">What-If Simulation Sandbox</h1>
        <p className="text-sm text-text-muted">
          Adjust priority factor weights to simulate queue reordering before applying policy changes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders panel */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-base">Weight Configuration</CardTitle>
            <CardDescription>Weights are normalized to calculate overall priority score.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span>Severity Weight</span>
                <span className="font-mono">{Math.round(weights.severity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.70"
                step="0.05"
                value={weights.severity}
                onChange={(e) => handleWeightChange('severity', parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span>Impact Weight</span>
                <span className="font-mono">{Math.round(weights.impact * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.70"
                step="0.05"
                value={weights.impact}
                onChange={(e) => handleWeightChange('impact', parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span>Urgency Weight</span>
                <span className="font-mono">{Math.round(weights.urgency * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.70"
                step="0.05"
                value={weights.urgency}
                onChange={(e) => handleWeightChange('urgency', parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span>Vulnerability Multiplier</span>
                <span className="font-mono">{Math.round(weights.vulnerability * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.70"
                step="0.05"
                value={weights.vulnerability}
                onChange={(e) => handleWeightChange('vulnerability', parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => mutate()}
              isLoading={isPending}
            >
              Run Simulation
            </Button>
          </CardFooter>
        </Card>

        {/* Results preview */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-base">Simulated Rank Shifts</CardTitle>
            <CardDescription>Predicted queue position changes based on updated weights.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(simulationItems || [
                { id: 't-1001', category: 'pothole', original_rank: 3, simulated_rank: 1, rank_delta: 2 },
                { id: 't-1002', category: 'sewage', original_rank: 2, simulated_rank: 2, rank_delta: 0 },
                { id: 't-1005', category: 'electricity', original_rank: 1, simulated_rank: 3, rank_delta: -2 },
              ]).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-control border border-border bg-background flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-text">{item.id}</span>
                    <span className="text-text-muted capitalize ms-2">({item.category})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-text-muted">
                      Rank #{item.original_rank} ➔ #{item.simulated_rank}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-bold ${
                        item.rank_delta > 0
                          ? 'bg-primary-soft text-primary'
                          : item.rank_delta < 0
                          ? 'bg-status-onhold-soft text-status-onhold'
                          : 'bg-card text-text-muted'
                      }`}
                    >
                      {item.rank_delta > 0 ? (
                        <>
                          <ArrowUp className="w-3 h-3" />
                          <span>+{item.rank_delta}</span>
                        </>
                      ) : item.rank_delta < 0 ? (
                        <>
                          <ArrowDown className="w-3 h-3" />
                          <span>{item.rank_delta}</span>
                        </>
                      ) : (
                        <>
                          <Minus className="w-3 h-3" />
                          <span>0</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
