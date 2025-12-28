-- Fix Storage Policies for 'photos' bucket

-- 1. Ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Host Upload" ON storage.objects;
DROP POLICY IF EXISTS "Host Delete" ON storage.objects;
DROP POLICY IF EXISTS "Host Update" ON storage.objects;

-- 3. Create Policy: Allow Public Read Access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'photos' );

-- 4. Create Policy: Allow Authenticated Users (Host) to Upload
CREATE POLICY "Host Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'photos' AND auth.role() = 'authenticated' );

-- 5. Create Policy: Allow Authenticated Users (Host) to Delete
CREATE POLICY "Host Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'photos' AND auth.role() = 'authenticated' );

-- 6. Create Policy: Allow Authenticated Users (Host) to Update
CREATE POLICY "Host Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'photos' AND auth.role() = 'authenticated' );
