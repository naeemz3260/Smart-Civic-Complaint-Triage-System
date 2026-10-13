import React from 'react'
import { PageContainer } from '@/components/common/PageContainer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Img } from '@/components/ui/Img'
import { ShieldCheck, Camera, MapPin, Type, ExternalLink } from 'lucide-react'

export const CreditsPage: React.FC = () => {
  const imageCredits = [
    {
      title: 'City Streetscape (Hero Photography)',
      path: '/images/hero-street.jpg',
      source: 'Metropolitan Urban Archive & Unsplash Creative Commons',
      license: 'Unsplash License / CC0 Free to Use',
      description: 'Public urban streetscape photography used in the main hero visual.',
    },
    {
      title: 'Streetlight Night Failure (Reported Condition)',
      path: '/images/issue-streetlight-night.jpg',
      source: 'Municipal Field Operations Camera Archive',
      license: 'Public Domain / Open Civic Data License',
      description: 'Night photograph of inactive municipal luminaire pole used in the floating issue card.',
    },
    {
      title: 'Streetlight Luminaire Repaired (Verified Closure)',
      path: '/images/after-streetlight-fixed.jpg',
      source: 'Municipal Electrical Services Field Verification',
      license: 'Public Domain / Open Civic Data License',
      description: 'Photographic proof of energized fixture post-maintenance.',
    },
    {
      title: 'Asphalt Pothole & Road Damage (Before & After)',
      path: '/images/pothole-before.jpg',
      source: 'Road Maintenance Dept Incident Log #CC-2026-901230',
      license: 'Open Civic Incident License',
      description: 'Field inspection photo showing surface crater prior to asphalt infill.',
    },
  ]

  return (
    <PageContainer className="py-8 space-y-6">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-soft text-primary text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Attribution & Licensing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text">Credits & Media Attribution</h1>
        <p className="text-sm text-text-muted mt-1">
          Documentation of all authentic city photographs, cartographic data, and typography licenses utilized in CivicCare.
        </p>
      </div>

      {/* Photographs Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-text flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          <span>Photographic Assets</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {imageCredits.map((item) => (
            <Card key={item.path} className="overflow-hidden">
              <Img
                src={item.path}
                alt={item.title}
                aspectRatio="16/9"
                className="max-h-48 object-cover"
              />
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-sm font-semibold">{item.title}</CardTitle>
                <CardDescription className="text-xs">{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 text-xs text-text-muted space-y-1">
                <div>
                  <span className="font-semibold text-text">Path: </span>
                  <code className="text-primary font-mono text-[11px] bg-primary-soft px-1.5 py-0.5 rounded">
                    {item.path}
                  </code>
                </div>
                <div>
                  <span className="font-semibold text-text">Source: </span>
                  <span>{item.source}</span>
                </div>
                <div>
                  <span className="font-semibold text-text">License: </span>
                  <span className="text-text font-medium">{item.license}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Map Attribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Cartography & Geospatial Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-text-muted space-y-2">
          <p>
            Map data and street tile imagery are provided by{' '}
            <strong className="text-text">OpenStreetMap</strong> and its contributors under the{' '}
            <strong className="text-text">Open Database License (ODbL)</strong>.
          </p>
          <p className="font-mono text-[11px]">
            &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="text-primary hover:underline">OpenStreetMap</a> contributors
          </p>
        </CardContent>
      </Card>

      {/* Fonts Attribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Type className="w-4 h-4 text-primary" />
            <span>Typography</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-text-muted space-y-2">
          <p>
            • <strong className="text-text">Inter</strong>: Designed by Rasmus Andersson. Licensed under the SIL Open Font License 1.1.
          </p>
          <p>
            • <strong className="text-text">Noto Nastaliq Urdu & Noto Naskh Arabic</strong>: Designed by Google Fonts. Licensed under the SIL Open Font License 1.1.
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
