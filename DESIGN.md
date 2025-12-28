# Design Document: Sitter (v2.0 - Planned)

## 1. Introduction
Sitter is a deployed, single-host dog sitting application similar to a simplified Rover. It allows a host (Tianyi) to manage bookings, set dynamic pricing, and receive instant notifications.
**v2.0 adds guest accounts, rich media (photos), and a dedicated interaction page for bookings.**

## 2. Goals & Objectives
- **Professional Presence:** A deployed web app (`sitter.vercel.app`) showcasing the host's profile and services.
- **Automation:** Automatic cost calculation (including holiday rates) and date blocking.
- **Management:** A secure admin dashboard to manage requests and settings without touching code/DB.
- **Trust & Transparency:** User accounts for guests to track history, and a shared "Request to Book" (RTB) page for clear communication.

## 3. Target Audience
- **Guests:** Dog owners looking to book services.
- **Host:** Myself (Tianyi) managing the business.

## 4. Functional Requirements
### Guest Side
- **Landing Page:** 
    - Dynamic profile fetching Host Name, Bio, Location, and Requirements.
    - **(New) Photo Gallery:** Display host-uploaded photos (home, past dogs, etc.).
- **Guest Accounts (New):**
    - Sign Up / Login / Logout.
    - "My Bookings" dashboard to view history and status.
- **Booking Widget:**
    - `react-day-picker` integration for selecting date ranges.
    - **Smart Blocking:** Automatically disables dates that overlap with confirmed bookings.
    - **Dynamic Pricing (Updated):** 
        - If *any* date in the selected range is a "Holiday", the **entire stay** is charged at the `holiday_rate`.
    - **Pre-fill:** Automatically fill Name/Phone if logged in.
- **RTB Interaction Page (New):**
    - Dedicated page (`/requests/[id]`) for a specific booking.
    - View current status (Pending, Confirmed, Rejected).
    - View booking details (Dates, Price).
    - **Messaging:** Simple chat/comment history between Host and Guest.

### Host Side
- **Secure Login:** Supabase Auth (Email/Password) protected by Next.js Middleware.
- **Dashboard:**
    - **List View:** See all pending/confirmed/rejected requests.
    - **(New) Reject Confirmed:** Allow rejecting previously confirmed bookings to free up the calendar.
    - **Calendar View:** A visual month-view calendar highlighting confirmed bookings.
    - **Actions:** "Confirm" (blocks dates) or "Reject" requests.
- **Settings Management:**
    - **Profile:** Update Name, Bio, Location.
    - **(New) Photo Management:** Upload, delete, and reorder profile photos via Supabase Storage.
    - **Pricing:** Set Base Rate and Holiday Rate.
    - **Holidays:** Add/Remove specific dates for surge pricing.
    - **(New) Unavailable Dates:** Manually block specific dates from being booked without creating a booking.
    - **Requirements:** Add/Remove guest requirements.
- **Notifications:**
    - **Email:** Sent via Gmail (Nodemailer).
    - **WeChat:** Sent via WxPusher (Instant push notification).

## 5. Non-Functional Requirements
- **Zero Cost:** Hosted on Vercel (Free), DB on Supabase (Free).
- **Security:** RLS (Row Level Security) enabled. Middleware protects admin routes and guest-only routes.

## 6. System Architecture
- **Frontend:** Next.js 14 (App Router) + React Server Components.
- **Styling:** Tailwind CSS + Lucide React.
- **Backend:** Next.js API Routes + Supabase Client.
- **Database:** Supabase (PostgreSQL).
- **Storage:** Supabase Storage (for images).
- **Auth:** Supabase Auth (Host & Guest roles).

## 7. Data Model Changes (v2.0)

### `bookings` (Updated)
- `id`: UUID (PK)
- `user_id`: UUID (FK to auth.users, nullable for guest checkout if we keep it, but preferred required for v2)
- `guest_email`: Text (for notifications)
- ... (existing fields: guest_name, phone, dates, price, status)

### `messages` (New)
- `id`: UUID (PK)
- `booking_id`: UUID (FK to bookings)
- `sender_id`: UUID (FK to auth.users)
- `content`: Text
- `created_at`: Timestamptz

### `settings` (Updated)
- ... (existing fields)
- `photos`: Text[] (Array of public image URLs from Storage)
- `unavailable_dates`: Date[] (Array of manually blocked dates)

## 8. UI/UX Design
- **Guest Dashboard:** Simple list of cards for "Upcoming" and "Past" stays.
- **RTB Page:** Split view. Left: Status/Details/Price. Right (or Bottom): Message thread.
- **Photo Upload:** Drag-and-drop or file picker in Admin Settings with preview.

## 9. Roadmap
- [x] **Phase 1-5:** Core booking & admin features (Completed).
- [x] **Phase 5.5: Host Improvements:**
    - [ ] **Pricing:** Holiday rate applies to whole stay if overlap.
    - [ ] **Blocking:** Manual "Unavailable" dates in Settings.
    - [ ] **Management:** Reject confirmed bookings.
- [ ] **Phase 6: Guest Auth:** Sign up/Login pages, link bookings to users.
- [ ] **Phase 7: Host Photos:** Supabase Storage setup, Upload UI, Gallery display.
- [ ] **Phase 8: RTB Page:** Shared interaction page with messaging.