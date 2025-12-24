# Design Document: Sitter (As Built - v1.0)

## 1. Introduction
Sitter is a deployed, single-host dog sitting application similar to a simplified Rover. It allows a host (Tianyi) to manage bookings, set dynamic pricing, and receive instant notifications.

## 2. Goals & Objectives
- **Professional Presence:** A deployed web app (`sitter.vercel.app`) showcasing the host's profile and services.
- **Automation:** Automatic cost calculation (including holiday rates) and date blocking.
- **Management:** A secure admin dashboard to manage requests and settings without touching code/DB.

## 3. Target Audience
- **Guests:** Dog owners looking to book services.
- **Host:** Myself (Tianyi) managing the business.

## 4. Functional Requirements (Implemented)
### Guest Side
- **Landing Page:** Dynamic profile fetching Host Name, Bio, Location, and Requirements from the DB.
- **Booking Widget:**
    - `react-day-picker` integration for selecting date ranges.
    - **Smart Blocking:** Automatically disables dates that overlap with confirmed bookings.
    - **Dynamic Pricing:** Calculates total cost by checking each night against "Holiday" dates in the DB.
    - **Form:** Collects Name, Phone, and Message.
- **Notifications:** Triggered on submission.

### Host Side
- **Secure Login:** Supabase Auth (Email/Password) protected by Next.js Middleware.
- **Dashboard:**
    - **List View:** See all pending/confirmed/rejected requests.
    - **Calendar View:** A visual month-view calendar highlighting confirmed bookings.
    - **Actions:** "Confirm" (blocks dates) or "Reject" requests.
- **Settings Management:**
    - **Profile:** Update Name, Bio, Location.
    - **Pricing:** Set Base Rate and Holiday Rate.
    - **Holidays:** Add/Remove specific dates for surge pricing.
    - **Requirements:** Add/Remove guest requirements.
- **Notifications:**
    - **Email:** Sent via Gmail (Nodemailer).
    - **WeChat:** Sent via WxPusher (Instant push notification).

### Out of Scope (Current)
- In-app messaging (Guest message is sent via notification only).
- Payments (Stripe integration).
- Multi-host support.

## 5. Non-Functional Requirements
- **Zero Cost:** Hosted on Vercel (Free), DB on Supabase (Free), Notifications via Personal Gmail/WeChat (Free).
- **Security:** RLS (Row Level Security) enabled on database. Middleware protects admin routes.

## 6. System Architecture
- **Frontend:** Next.js 14 (App Router) + React Server Components.
- **Styling:** Tailwind CSS + Lucide React.
- **Backend:** Next.js API Routes (`/api/notify`) + Supabase Client.
- **Database:** Supabase (PostgreSQL).
- **Auth:** Supabase Auth + Next.js Middleware.

## 7. Technology Stack
- **Framework:** Next.js
- **Language:** TypeScript
- **State/Data:** Supabase SSR (`@supabase/ssr`)
- **Date Handling:** `date-fns`
- **UI Components:** `react-day-picker`
- **Notifications:** `nodemailer` (SMTP), `fetch` (WxPusher API)
- **Deployment:** Vercel

## 8. Data Model
### `bookings`
- `id`: UUID (PK)
- `guest_name`: Text
- `guest_phone`: Text
- `start_date`: Date
- `end_date`: Date
- `total_price`: Numeric
- `message`: Text
- `status`: Text ('pending', 'confirmed', 'rejected')
- `created_at`: Timestamptz

### `settings`
- `id`: UUID (PK)
- `base_rate`: Numeric
- `holiday_rate`: Numeric
- `holidays`: Date[] (Array of dates)
- `requirements`: Text[] (Array of strings)
- `host_name`: Text
- `host_location`: Text
- `host_bio`: Text

## 9. UI/UX Design
- **Guest:** Clean, single-page layout with sticky booking widget. visual feedback for unavailable dates.
- **Admin:** Tabbed interface (List / Calendar / Settings) for easy management on mobile or desktop.

## 10. Roadmap
- [x] **Phase 1:** Basic landing page and data schema.
- [x] **Phase 2:** Booking request form and notifications (Email + WeChat).
- [x] **Phase 3:** Host dashboard, Calendar View, and Blocking logic.
- [x] **Phase 4:** Dynamic Holiday Pricing and Host Settings Page.
- [x] **Phase 5:** Deployment and Security (Middleware).
- [ ] **Future:** Payment integration (Stripe) and Guest Reviews.