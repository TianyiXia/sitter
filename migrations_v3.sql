-- Add unavailable_dates column to settings table
ALTER TABLE public.settings 
ADD COLUMN IF NOT EXISTS unavailable_dates date[] DEFAULT '{}';
