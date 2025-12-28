-- V2.0 Database Migration

-- 1. SETTINGS: Add photos support
ALTER TABLE public.settings 
ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';

-- 2. BOOKINGS: Add user linking
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS guest_email TEXT;

-- 3. MESSAGES: Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id),
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id)
);

-- 4. SECURITY: Update Booking Policies for Guest Access
-- First, drop the broad "authenticated" policy that allowed any logged-in user to see all bookings
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON public.bookings;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.bookings;

-- Re-create stricter policies
-- Host can see everything
CREATE POLICY "Host can view all bookings" ON public.bookings
  FOR SELECT USING (auth.jwt() ->> 'email' = 'tianyixia55@gmail.com');

CREATE POLICY "Host can update all bookings" ON public.bookings
  FOR UPDATE USING (auth.jwt() ->> 'email' = 'tianyixia55@gmail.com');

-- Guests can see their own bookings
CREATE POLICY "Guests can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Guests can update (cancel?) own bookings - maybe strictly for now just View. 
-- We'll keep it as View only for guests for now.

-- 5. SECURITY: Message Policies
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Host can view all messages" ON public.messages
  FOR SELECT USING (auth.jwt() ->> 'email' = 'tianyixia55@gmail.com');

CREATE POLICY "Guests can view messages for their bookings" ON public.messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.bookings WHERE id = messages.booking_id
    )
  );

CREATE POLICY "Host can insert messages" ON public.messages
  FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = 'tianyixia55@gmail.com');

CREATE POLICY "Guests can insert messages for their bookings" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.bookings WHERE id = booking_id
    )
  );
