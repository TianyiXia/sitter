# Design Document: Sitter

## 1. Introduction
Sitter is an over-simplified Rover-like application for a single host (myself) to manage a dog-sitting business. v0 focuses on simplicity and serving a single host.

## 2. Goals & Objectives
- Provide a professional-looking landing page for guests.
- Automate the booking request process.
- Manage availability via a simple calendar.

## 3. Target Audience
- Guests looking to book dog-sitting services with me.

## 4. Functional Requirements
### Guest Side
- **Profile Page:** View my profile, services, and requirements.
- **Booking Request (RTB):**
    - Select pick-up and drop-off date/time.
    - View calculated cost (Base rate vs. Holiday rate).
    - Provide contact info: Name and Phone number.
    - Include an optional message.
    - View validation/requirements list (e.g., "No dogs under 1 year old").
- **Cost Calculation:** Simple logic for base vs. holiday rates.

### Host Side
- **Dashboard:** See current booking requests.
- **Calendar Management:**
    - View confirmed bookings.
    - Confirm/Reject requests.
    - Confirming a booking automatically blocks the dates on the guest-facing calendar (full-day blocks).
- **Notifications:** Receive a text message (SMS) on new RTB at 650-580-9382.

### Out of Scope (v0)
- In-app messaging (initial RTB message only).
- Payments.
- Support for multiple hosts.
- Accounts for guests (Name + Phone is enough).

## 5. Non-Functional Requirements
- **Simplicity:** Minimize complexity in the DB and UI.
- **Cost:** Use free-tier services.
- **Reliability:** Basic persistence for booking requests.

## 6. System Architecture
- **Web App:** Next.js (Frontend + API Routes).
- **Database:** Supabase (PostgreSQL) for simplicity and free tier.
- **Notifications:** Integration with a service like Twilio or an SMS gateway.

## 7. Technology Stack
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS + Lucide React (icons)
- **Database/Auth:** Supabase
- **Deployment:** Vercel (Free tier)
- **SMS:** Twilio (or similar)

## 8. Data Model
### `bookings`
- `id`: UUID (Primary Key)
- `guest_name`: String
- `guest_phone`: String
- `start_date`: Date
- `end_date`: Date
- `status`: Enum (pending, confirmed, rejected)
- `total_price`: Decimal
- `message`: Text
- `created_at`: Timestamp

### `settings` (Host Configuration)
- `base_rate`: Decimal
- `holiday_rate`: Decimal
- `holidays`: List of Dates
- `requirements`: List of Strings

## 9. UI/UX Design
- **Landing Page:** Large profile picture, "About Me" section, and a sticky "Book Now" sidebar.
- **Calendar:** Simple date-range picker highlighting available vs. blocked dates.
- **Host Dashboard:** A simple table of requests with "Approve/Deny" buttons.

## 10. Roadmap & Milestones
- **Phase 1:** Basic landing page and data schema.
- **Phase 2:** Booking request form and SMS notification.
- **Phase 3:** Host dashboard and calendar blocking logic.
- **Phase 4:** Polishing and deployment.
