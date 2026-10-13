import { apiRequest } from './client'
import { Complaint, ReviewItem } from './types'

export async function transitionStatus(
  complaintId: string,
  toStatus: string,
  role: string,
  comment?: string,
  assignedTo?: string
): Promise<Complaint> {
  return apiRequest<Complaint>(
    `/workflow/${complaintId}/transition`,
    {
      method: 'POST',
      body: JSON.stringify({
        to_status: toStatus,
        comment,
        assigned_to: assignedTo,
      }),
    },
    role
  )
}

export async function verifyClosure(
  complaintId: string,
  afterPhotoFilename: string,
  comment?: string
) {
  return apiRequest(
    `/workflow/${complaintId}/verify-closure`,
    {
      method: 'POST',
      body: JSON.stringify({
        after_photo_filename: afterPhotoFilename,
        comment,
      }),
    },
    'staff'
  )
}

export async function getReviewQueue(): Promise<ReviewItem[]> {
  return apiRequest<ReviewItem[]>('/review/queue', {}, 'admin')
}

export async function decideReview(reviewItemId: number, confirmedCategory: string, comment?: string) {
  return apiRequest(
    '/review/decide',
    {
      method: 'POST',
      body: JSON.stringify({
        review_item_id: reviewItemId,
        confirmed_category: confirmedCategory,
        comment,
      }),
    },
    'admin'
  )
}
