import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '@/components/common/PageContainer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createTicket } from '@/lib/api'
import { MOCK_CATEGORIES } from '@/mock/mockData'
import type { CategoryId } from '@/types'
import { MapPin, Camera, AlertTriangle, ArrowRight } from 'lucide-react'

export const ReportPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<CategoryId>('pothole')
  const [latitude, setLatitude] = useState(24.8607)
  const [longitude, setLongitude] = useState(67.0011)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      setError('Please provide both a title and description for the report.')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      const ticket = await createTicket({
        title,
        description,
        category,
        latitude,
        longitude,
        photo_filename: 'pothole_before.jpg',
      })
      navigate(`/confirmation/${ticket.tracking_code}`)
    } catch {
      setError('Failed to submit report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer size="narrow" className="py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Report a Civic Issue</h1>
        <p className="text-sm text-text-muted">
          Submit details and GPS location to trigger AI triage and municipal dispatch.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Issue Information</CardTitle>
            <CardDescription>
              Select category and describe the observed hazard or problem.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {error && (
              <div className="p-3 rounded-control bg-status-onhold-soft text-status-onhold text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-text mb-1.5">
                Issue Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full h-10 rounded-control border border-border bg-card px-3 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {MOCK_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1.5">
                Short Summary / Title *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep pothole causing tire damage on Main Boulevard"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1.5">
                Detailed Description *
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide landmarks, estimated dimensions, or safety hazards..."
                rows={4}
                required
              />
            </div>

            {/* Location selector preview */}
            <div className="pt-2 border-t border-border/60">
              <label className="block text-xs font-semibold text-text mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Incident Coordinates</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-text-muted">Latitude</span>
                  <Input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <span className="text-[11px] text-text-muted">Longitude</span>
                  <Input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Photo Attachment Placeholder */}
            <div className="pt-2 border-t border-border/60">
              <label className="block text-xs font-semibold text-text mb-2 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-primary" />
                <span>Issue Photo (Optional)</span>
              </label>
              <div className="border border-dashed border-border rounded-control p-6 text-center bg-background/50 hover:bg-background transition-colors cursor-pointer">
                <Camera className="w-8 h-8 text-text-muted mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium text-text">Click to upload photo or drag & drop</p>
                <p className="text-[11px] text-text-muted mt-0.5">JPEG, PNG up to 10MB (EXIF privacy sanitized)</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="gap-2"
            >
              <span>Submit Issue</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </form>
    </PageContainer>
  )
}
