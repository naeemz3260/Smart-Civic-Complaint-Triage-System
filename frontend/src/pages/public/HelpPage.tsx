import React from 'react'
import { PageContainer } from '@/components/common/PageContainer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Link } from 'react-router-dom'
import { HelpCircle, Phone, Mail, FileQuestion, ArrowRight, ShieldCheck, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const HelpPage: React.FC = () => {
  const faqs = [
    {
      q: 'How does AI triage work?',
      a: 'When you submit a complaint with description and an optional photo, our multimodal AI evaluates the text and image to predict the issue category, estimate severity, detect duplicate reports within 60 meters, and assign a priority score.',
    },
    {
      q: 'Do I need an account to report an issue?',
      a: 'No. Citizens can submit issues immediately without creating an account. You receive an official tracking code (e.g., CC-2026-901230) and QR code to track resolution progress anytime.',
    },
    {
      q: 'What are the municipal response SLAs?',
      a: 'Power hazards and live wires have a 12-hour maximum SLA. Sewage overflows are triaged within 24 hours. Road damage and potholes are targeted within 48 hours.',
    },
    {
      q: 'How do I track my complaint?',
      a: 'Navigate to the Track page and enter your 10-digit tracking token. You will see the complete live audit trail, including crew assignment and verified after-repair photographs.',
    },
  ]

  return (
    <PageContainer className="py-8 space-y-6">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-soft text-primary text-xs font-semibold mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Support & Resident Guidance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text">Help & Frequently Asked Questions</h1>
        <p className="text-sm text-text-muted mt-1">
          Learn how CivicCare connects residents with municipal field response teams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          {faqs.map((faq, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-text flex items-start gap-2">
                  <span className="text-primary font-bold">Q:</span>
                  <span>{faq.q}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-text-muted leading-relaxed">
                {faq.a}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Emergency Contacts</CardTitle>
              <CardDescription>For immediate life-safety hazards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-control bg-background border border-border flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <div>
                  <span className="font-semibold text-text block">Municipal Helpline</span>
                  <span className="text-text-muted font-mono">1122 / (021) 9920-1234</span>
                </div>
              </div>

              <div className="p-3 rounded-control bg-background border border-border flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <div>
                  <span className="font-semibold text-text block">Email Citizen Desk</span>
                  <span className="text-text-muted">support@civiccare.gov</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-white border-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-white">Have an issue to report?</CardTitle>
              <p className="text-xs text-white/80">Submit photos directly from your smartphone.</p>
            </CardHeader>
            <CardContent className="pt-2">
              <Link to="/report">
                <Button variant="secondary" size="sm" className="w-full bg-white text-primary hover:bg-white/90">
                  <span>Report an Issue</span>
                  <ArrowRight className="w-3.5 h-3.5 ms-1.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
