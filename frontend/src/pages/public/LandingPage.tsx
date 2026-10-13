import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '@/components/common/PageContainer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge'
import { Img } from '@/components/ui/Img'
import { TiltCard } from '@/components/common/TiltCard'
import { CountUp } from '@/components/common/CountUp'
import { useQuery } from '@tanstack/react-query'
import { getCityStats } from '@/lib/api'
import {
  FilePlus,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Camera,
  BrainCircuit,
  Wrench,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  TrendingUp,
} from 'lucide-react'

export const LandingPage: React.FC = () => {
  const { t } = useTranslation()

  const { data: stats } = useQuery({
    queryKey: ['cityStats'],
    queryFn: getCityStats,
  })

  const totalComplaints = stats?.total_complaints ?? 12480
  const resolvedCount = stats?.resolved_count ?? 8932
  const inProgressCount = stats?.pending_count ?? 3121
  const onTimePercentage = 98

  const steps = [
    {
      num: '01',
      title: 'Report',
      desc: 'Snap a photo and pin the location on our interactive map in under a minute.',
      icon: Camera,
      color: 'bg-primary-soft text-primary',
    },
    {
      num: '02',
      title: 'AI Triage',
      desc: 'Multimodal neural network scores urgency, detects duplicate reports, and routes to the correct department.',
      icon: BrainCircuit,
      color: 'bg-priority-medium-soft text-priority-medium',
    },
    {
      num: '03',
      title: 'Fix',
      desc: 'Dedicated municipal crews are dispatched with strict SLA timers and real-time status tracking.',
      icon: Wrench,
      color: 'bg-status-inprogress-soft text-status-inprogress',
    },
    {
      num: '04',
      title: 'Verify',
      desc: 'Staff must submit mandatory after-repair photographic proof before the ticket is verified and closed.',
      icon: CheckCircle2,
      color: 'bg-status-resolved-soft text-status-resolved',
    },
  ]

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-card border-b border-border py-12 lg:py-20">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cleaner Streets · Safer Communities · A Smarter City</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text leading-[1.15]">
                Report. Track.{' '}
                <span className="text-primary block sm:inline">See Real Change.</span>
              </h1>

              <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-xl">
                CivicCare uses multimodal AI triage to turn resident reports into verified municipal work orders in real-time. Transparent, accountable, and responsive city services.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/report">
                  <Button variant="primary" size="lg" className="shadow-subtle gap-2 px-6">
                    <FilePlus className="w-4 h-4" />
                    <span>{t('nav.report', { defaultValue: 'Report an Issue' })}</span>
                  </Button>
                </Link>

                <Link to="/track">
                  <Button variant="outline" size="lg" className="gap-2 px-6">
                    <Search className="w-4 h-4" />
                    <span>{t('nav.track', { defaultValue: 'Track Complaint' })}</span>
                  </Button>
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="flex items-center gap-6 pt-3 text-xs text-text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>No login required to report</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Photographic verification on closure</span>
                </span>
              </div>
            </div>

            {/* Right Visual Container with Real Streetscape & Floating Glass Tilt Card */}
            <div className="lg:col-span-5 relative">
              {/* Background Real City Street Photo Frame */}
              <div className="relative rounded-card overflow-hidden shadow-card border border-border">
                <Img
                  src="/images/hero-street.jpg"
                  alt="City street infrastructure in Karachi"
                  aspectRatio="4/3"
                  className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-text/70 via-text/20 to-transparent" />

                <div className="absolute bottom-3 start-3 end-3 text-white text-xs p-2 rounded bg-text/40 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      Metropolitan Central District
                    </span>
                    <span className="text-[10px] text-white/80">Real-time civic monitoring</span>
                  </div>
                </div>
              </div>

              {/* Floating Glass Streetlight Issue Card with 3D Tilt */}
              <TiltCard
                maxTilt={7}
                className="lg:absolute -bottom-8 -start-6 sm:-start-8 z-20 w-full max-w-[340px] mt-4 lg:mt-0"
              >
                <div className="backdrop-blur-md bg-white/95 border border-white/80 rounded-card p-4 shadow-floating">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-control overflow-hidden shrink-0 border border-border">
                      <Img
                        src="/images/issue-streetlight-night.jpg"
                        alt="Night view of inactive municipal luminaire"
                        aspectRatio="1/1"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <PriorityBadge level="high" />
                        <span className="text-[10px] font-mono text-text-muted">CC-2026-901230</span>
                      </div>
                      <h4 className="text-xs font-bold text-text truncate">
                        Streetlight Failure
                      </h4>
                      <p className="text-[11px] text-text-muted line-clamp-1">
                        Reported near Elm & 4th Junction
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/50 text-[10px]">
                        <span className="text-primary font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>In Progress</span>
                        </span>
                        <span className="text-text-muted">3 nearby merged</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 2. ANIMATED STATISTICS STRIP */}
      <section className="bg-background py-10 border-b border-border">
        <PageContainer>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-card p-5 rounded-card border border-border shadow-subtle flex flex-col justify-between">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Total Reports
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <CountUp
                  end={totalComplaints}
                  className="text-3xl sm:text-4xl font-extrabold text-text tabular-nums"
                />
              </div>
              <span className="text-[11px] text-text-muted mt-1">Logged across all wards</span>
            </div>

            <div className="bg-card p-5 rounded-card border border-border shadow-subtle flex flex-col justify-between">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Resolved
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <CountUp
                  end={resolvedCount}
                  className="text-3xl sm:text-4xl font-extrabold text-status-resolved tabular-nums"
                />
              </div>
              <span className="text-[11px] text-status-resolved font-medium mt-1">Verified with after-photos</span>
            </div>

            <div className="bg-card p-5 rounded-card border border-border shadow-subtle flex flex-col justify-between">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                In Progress
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <CountUp
                  end={inProgressCount}
                  className="text-3xl sm:text-4xl font-extrabold text-status-inprogress tabular-nums"
                />
              </div>
              <span className="text-[11px] text-text-muted mt-1">Field operations active</span>
            </div>

            <div className="bg-card p-5 rounded-card border border-border shadow-subtle flex flex-col justify-between">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                On Time SLA
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <CountUp
                  end={onTimePercentage}
                  suffix="%"
                  className="text-3xl sm:text-4xl font-extrabold text-primary tabular-nums"
                />
              </div>
              <span className="text-[11px] text-primary font-medium mt-1">Met departmental targets</span>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 3. FOUR-STEP HOW IT WORKS SECTION */}
      <section className="bg-card py-16 lg:py-20 border-b border-border">
        <PageContainer>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-semibold mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>End-to-End Workflow</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text">How CivicCare Works</h2>
            <p className="text-sm sm:text-base text-text-muted mt-2">
              From the moment a citizen snaps a photo to field crew completion and municipal audit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.num}
                  className="bg-background rounded-card border border-border p-6 flex flex-col justify-between relative group hover:border-primary/40 transition-colors"
                >
                  <span className="text-xs font-mono font-bold text-text-muted/60 absolute top-4 end-4">
                    {step.num}
                  </span>

                  <div>
                    <div className={`w-12 h-12 rounded-control flex items-center justify-center mb-4 ${step.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-text mb-2">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-border/50 text-[11px] text-primary font-semibold flex items-center gap-1">
                    <span>Explore details</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              )
            })}
          </div>
        </PageContainer>
      </section>

      {/* 4. RECENT RESOLVED ISSUES WITH REAL BEFORE/AFTER PHOTOGRAPHS */}
      <section className="bg-background py-16 lg:py-20 border-b border-border">
        <PageContainer>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-resolved-soft text-status-resolved text-xs font-semibold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Field Resolutions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text">
                Recent Resolved Issues
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Every ticket closure requires verifiable photographic proof from municipal staff.
              </p>
            </div>

            <Link to="/transparency">
              <Button variant="outline" size="sm" className="gap-1.5">
                <span>View All Resolved on Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Case 1: Streetlight Repair */}
            <Card className="overflow-hidden hover:shadow-card transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">CC-2026-901230</span>
                  <StatusBadge status="RESOLVED" />
                </div>
                <CardTitle className="text-base pt-1">
                  Streetlight luminaire failure restored
                </CardTitle>
                <CardDescription className="text-xs">
                  Municipal Electrical Services replaced blown driver and restored pedestrian illumination.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="rounded-control overflow-hidden border border-border aspect-[4/3]">
                      <Img
                        src="/images/issue-streetlight-night.jpg"
                        alt="Dark street before repair"
                        aspectRatio="4/3"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-status-onhold mt-1.5 block">
                      Before: Inactive Hazard
                    </span>
                  </div>

                  <div>
                    <div className="rounded-control overflow-hidden border border-border aspect-[4/3]">
                      <Img
                        src="/images/after-streetlight-fixed.jpg"
                        alt="Energized streetlight after repair"
                        aspectRatio="4/3"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-status-resolved mt-1.5 block">
                      After: Restored & Verified
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border/50">
                  <span>Ward 12 · Clifton Sector</span>
                  <span className="text-status-resolved font-medium">Resolved in 18 hours</span>
                </div>
              </CardContent>
            </Card>

            {/* Case 2: Pothole & Trench Repair */}
            <Card className="overflow-hidden hover:shadow-card transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">CC-2026-901233</span>
                  <StatusBadge status="RESOLVED" />
                </div>
                <CardTitle className="text-base pt-1">
                  Deep asphalt pothole patched and resurfaced
                </CardTitle>
                <CardDescription className="text-xs">
                  Road Maintenance Dept dispatched hot-mix asphalt crew following utility trench backfilling.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="rounded-control overflow-hidden border border-border aspect-[4/3]">
                      <Img
                        src="/images/pothole-before.jpg"
                        alt="Broken asphalt crater before repair"
                        aspectRatio="4/3"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-status-onhold mt-1.5 block">
                      Before: Traffic Hazard
                    </span>
                  </div>

                  <div>
                    <div className="rounded-control overflow-hidden border border-border aspect-[4/3]">
                      <Img
                        src="/images/pothole-after.jpg"
                        alt="Repaved clean asphalt road"
                        aspectRatio="4/3"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-status-resolved mt-1.5 block">
                      After: Repaved Smooth
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border/50">
                  <span>Ward 04 · Saddar Central</span>
                  <span className="text-status-resolved font-medium">Resolved in 24 hours</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </PageContainer>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="bg-primary text-white py-14">
        <PageContainer size="narrow" className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-primary-soft" />
            <span>Community Civic Action</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            See an issue in your neighborhood?
          </h2>

          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Help our municipal teams keep your streets safe and clean. Submit a photo report and track each step in real time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/report">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-subtle gap-2 font-semibold"
              >
                <FilePlus className="w-4 h-4" />
                <span>Report an Issue Now</span>
              </Button>
            </Link>

            <Link to="/track">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white bg-transparent hover:bg-white/10 gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Track an Existing Issue</span>
              </Button>
            </Link>
          </div>
        </PageContainer>
      </section>
    </div>
  )
}
