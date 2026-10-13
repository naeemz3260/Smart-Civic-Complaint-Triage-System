import React from 'react'
import { PageContainer } from '@/components/common/PageContainer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { BrainCircuit, CheckCircle, ShieldAlert, Sparkles, BarChart2 } from 'lucide-react'

export const PublicModelReportPage: React.FC = () => {
  const metrics = [
    { label: 'Overall Accuracy', value: '86.7%', change: '+2.1% from v1.2' },
    { label: 'Precision', value: '84.2%', change: '+1.4%' },
    { label: 'Recall', value: '92.5%', change: '+3.0%' },
    { label: 'F1 Score', value: '88.1%', change: '+2.3%' },
  ]

  const categories = ['Pothole', 'Sewage', 'Electricity', 'Water', 'Garbage', 'Streetlight']

  return (
    <PageContainer className="py-8 space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-soft text-primary text-xs font-semibold mb-2">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Multimodal Text + Image Classifier</span>
        </div>
        <h1 className="text-2xl font-bold text-text">AI Model Performance Report</h1>
        <p className="text-sm text-text-muted">
          Public evaluation of triage classification accuracy, confidence thresholds, and safety override rules.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="p-4">
            <span className="text-xs text-text-muted">{m.label}</span>
            <p className="text-2xl font-bold text-text tabular-nums mt-1">{m.value}</p>
            <span className="text-[11px] text-primary font-medium mt-1 inline-block">
              {m.change}
            </span>
          </Card>
        ))}
      </div>

      {/* Confusion Matrix / Classification Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-base">Confusion Matrix Preview</CardTitle>
            <CardDescription>
              Diagonal density represents correct automated category predictions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-2 text-start text-text-muted">Actual \ Predicted</th>
                    {categories.map((c) => (
                      <th key={c} className="p-2 text-text font-semibold">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((actual, rowIdx) => (
                    <tr key={actual} className="border-b border-border/50">
                      <td className="p-2 text-start font-medium text-text">{actual}</td>
                      {categories.map((_, colIdx) => {
                        const isDiagonal = rowIdx === colIdx
                        const val = isDiagonal ? 88 + ((rowIdx * 3) % 9) : Math.max(0, 4 - Math.abs(rowIdx - colIdx))
                        return (
                          <td
                            key={colIdx}
                            className={`p-2 font-mono tabular-nums ${
                              isDiagonal
                                ? 'bg-primary-soft text-primary font-bold'
                                : val > 2
                                ? 'bg-background text-text-muted'
                                : 'text-text-muted/60'
                            }`}
                          >
                            {val}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Confidence Thresholds Guide */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-primary" />
              <span>Triage Policy Thresholds</span>
            </CardTitle>
            <CardDescription>Automated dispatch vs human escalation rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-3 rounded-control bg-primary-soft/50 border border-primary/20 space-y-1">
              <div className="flex items-center justify-between font-semibold text-primary">
                <span>Confidence &gt; 75%</span>
                <span>Auto-Triage</span>
              </div>
              <p className="text-text-muted">
                Directly assigns work order to municipal department without human queue delay.
              </p>
            </div>

            <div className="p-3 rounded-control bg-priority-medium-soft/50 border border-priority-medium/20 space-y-1">
              <div className="flex items-center justify-between font-semibold text-priority-medium">
                <span>50% - 75% Confidence</span>
                <span>Review Queue</span>
              </div>
              <p className="text-text-muted">
                Sent to Admin Review Sandbox for human confirmation.
              </p>
            </div>

            <div className="p-3 rounded-control bg-status-onhold-soft/50 border border-status-onhold/20 space-y-1">
              <div className="flex items-center justify-between font-semibold text-status-onhold">
                <span>Confidence &lt; 25%</span>
                <span>Flag Ambiguous</span>
              </div>
              <p className="text-text-muted">
                Flagged for incomplete data, noise, or unclear photo evidence.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
