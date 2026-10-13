# Test E2E Scenarios for Civic Triage System

## Scenario 1: Citizen Reports Road Damage in Roman Urdu
1. Resident navigates to Report page (`/report`).
2. Enters description: `"Sadak pe bara khadda hai, bike walay gir rahay hain"`.
3. Selects map coordinates near general hospital.
4. Confirms duplicate check passes or displays nearby issues.
5. Submits complaint.
6. System verifies:
   - Language detected as `roman_ur`.
   - Category classified as `pothole`.
   - Vulnerability boost applied due to hospital proximity.
   - 8-character tracking code assigned.

## Scenario 2: Emergency Safety Keyword Override
1. Resident enters `"Danger live wire snapped sparking on road"`.
2. Submits complaint.
3. System verifies:
   - Life-safety keyword triggered.
   - Status transitions straight to `ASSIGNED`.
   - Priority score clamped to $\ge 0.95$.

## Scenario 3: Field Staff Resolution with Mandatory "After" Photo
1. User switches role to `Staff`.
2. Selects assigned ticket from Work Orders.
3. Attaches `pothole_after.jpg`.
4. Enters remarks and submits closure.
5. System verifies:
   - ClosureService checks perceptual diff and landmark preservation.
   - Ticket marked `RESOLVED`.
   - Audit event logged.

## Scenario 4: Admin Human-in-the-Loop Review
1. User switches role to `Admin`.
2. Opens Review Queue for low-confidence ticket.
3. Confirms category manually.
4. Ticket transitions to `TRIAGED` with confidence boosted to 1.0.
