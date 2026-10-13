"""
Interactive Civic Complaint Tester
===================================
Run this script to submit custom text, coordinates, and photos
directly through the backend triage engine and inspect the results.
"""

import sys
import os

# Ensure project root is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.core.database import SessionLocal
from backend.app.schemas.complaint import ComplaintCreate
from backend.app.services.complaint_service import ComplaintService

def test_custom_input():
    print("=" * 65)
    print("      SMART CIVIC COMPLAINT TRIAGE - INTERACTIVE TESTER")
    print("=" * 65)
    print("Enter your own custom civic complaint below.")
    print("Supports English, Urdu (اردو), or Roman Urdu (e.g. 'pani ka pipe toot gaya')\n")

    title = input("1. Enter Issue Title: ").strip()
    if not title:
        title = "Severe Pothole on Main Road"
        print(f"   -> Using default: '{title}'")

    description = input("2. Enter Description: ").strip()
    if not description:
        description = "Sadak pe bohot bara khadda hai car gir rahi hai"
        print(f"   -> Using default: '{description}'")

    lat_str = input("3. Latitude (Press Enter for 24.8562 - Saddar Ward 2): ").strip()
    lat = float(lat_str) if lat_str else 24.8562

    lng_str = input("4. Longitude (Press Enter for 67.0261 - near Hospital): ").strip()
    lng = float(lng_str) if lng_str else 67.0261

    photo_str = input("5. Evidence Photo (e.g. pothole_before.jpg, or press Enter): ").strip()
    photo_filename = photo_str if photo_str else None

    print("\n[INFO] Submitting through Multimodal NLP & Scoring Pipeline...")
    db = SessionLocal()
    try:
        data = ComplaintCreate(
            title=title,
            description=description,
            latitude=lat,
            longitude=lng,
            photo_filename=photo_filename
        )
        complaint = ComplaintService.create_complaint(db, data, actor_name="Terminal User")

        print("\n" + "=" * 65)
        print("                 TRIAGE RESULTS & AUDIT")
        print("=" * 65)
        print(f"Ticket ID          : {complaint.id}")
        print(f"Tracking Token     : {complaint.tracking_code}")
        print(f"Language Detected  : {complaint.language.upper()}")
        print(f"Assigned Category  : {complaint.category.upper()}")
        print(f"Department Routed  : {complaint.department}")
        print(f"Ward Inferred      : {complaint.ward_id}")
        print(f"Initial Status     : {complaint.status}")
        print(f"ML Confidence      : {complaint.confidence * 100:.1f}%")
        print(f"Safety Override    : {'YES (CRITICAL)' if complaint.is_critical_override else 'No'}")
        print(f"SLA Due At         : {complaint.sla_due_at.strftime('%Y-%m-%d %H:%M:%S UTC')}")
        print("-" * 65)
        print(f"COMPOSITE PRIORITY : {complaint.priority_score * 100:.1f} / 100")
        print(f"  • Severity Factor    : {complaint.severity_factor:.2f}")
        print(f"  • Impact Factor      : {complaint.impact_factor:.2f}")
        print(f"  • Urgency Factor     : {complaint.urgency_factor:.2f}")
        print(f"  • Vulnerability Boost: {complaint.vulnerability_factor:.2f}")
        print("=" * 65)
        print(f"Public Tracking URL: /track/{complaint.tracking_code}\n")

    except Exception as e:
        print(f"[ERROR] Failed to triage complaint: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_custom_input()
