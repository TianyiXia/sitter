-- Run this if you already created the tables before and just need to update them.

ALTER TABLE public.settings 
ADD COLUMN IF NOT EXISTS host_name text NOT NULL DEFAULT 'Tianyi';

ALTER TABLE public.settings 
ADD COLUMN IF NOT EXISTS host_location text NOT NULL DEFAULT 'San Francisco Bay Area';

ALTER TABLE public.settings 
ADD COLUMN IF NOT EXISTS host_bio text NOT NULL DEFAULT 'Hi, I''m Tianyi! I offer professional dog sitting services in a safe and loving environment.';

-- Update existing rows to ensure they have the default values (if they were null)
UPDATE public.settings 
SET 
  host_name = 'Tianyi', 
  host_location = 'San Francisco Bay Area', 
  host_bio = 'Hi, I''m Tianyi! I offer professional dog sitting services in a safe and loving environment.'
WHERE host_name IS NULL;
