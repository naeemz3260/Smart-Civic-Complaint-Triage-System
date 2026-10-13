import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageContainer } from '@/components/common/PageContainer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { QRCodeSVG } from 'qrcode.react'
import { CheckCircle2, ArrowRight, Copy, Search, Plus } from 'lucide-react'

export const ConfirmationPage: React.FC = () => {
  const { trackingCode } = useParams<{ trackingCode?: string }>()
  const code = trackingCode || 'CC-2026-901230'
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const trackingUrl = `${window.location.origin}/track/${code}`

  return (
    <PageContainer size="narrow" className="py-12">
      <Card className="text-center p-4 sm:p-8 border-primary/20 shadow-card">
        <div className="w-16 h-16 rounded-full bg-primary-soft text-primary flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-2xl font-bold text-text">
            Your complaint has been submitted!
          </CardTitle>
          <CardDescription className="text-sm pt-2 max-w-md mx-auto">
            Our AI triage engine is categorizing your report and checking for duplicates within 60 meters.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 space-y-6">
          {/* Tracking token callout */}
          <div className="bg-background border border-border rounded-control p-4 max-w-sm mx-auto">
            <span className="text-xs text-text-muted block mb-1">Official Tracking Code</span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl font-bold font-mono text-primary">{code}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded text-text-muted hover:text-text hover:bg-border/40 transition-colors"
                title="Copy tracking code"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && <span className="text-[11px] text-primary font-medium">Copied to clipboard!</span>}
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="p-3 bg-white border border-border rounded-control shadow-subtle">
              <QRCodeSVG value={trackingUrl} size={140} fgColor="#14231F" />
            </div>
            <span className="text-xs text-text-muted mt-2">Scan with smartphone to track on mobile</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to={`/track/${code}`}>
              <Button variant="primary" size="md" className="gap-2">
                <Search className="w-4 h-4" />
                <span>Track Complaint Status</span>
              </Button>
            </Link>
            <Link to="/report">
              <Button variant="outline" size="md" className="gap-2">
                <Plus className="w-4 h-4" />
                <span>Submit Another</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
