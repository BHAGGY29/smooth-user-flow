
-- Create a public storage bucket for video testimonials
INSERT INTO storage.buckets (id, name, public)
VALUES ('video-testimonials', 'video-testimonials', true);

-- Allow anyone to read/download videos (public bucket)
CREATE POLICY "Public read access for video testimonials"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'video-testimonials');

-- Allow authenticated admins to upload videos
CREATE POLICY "Admin upload video testimonials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'video-testimonials'
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated admins to delete videos
CREATE POLICY "Admin delete video testimonials"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'video-testimonials'
  AND public.has_role(auth.uid(), 'admin')
);
