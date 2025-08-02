/*
  # Create storage buckets for media files

  1. Storage Buckets
    - `images` - for image files
    - `videos` - for video files  
    - `audios` - for audio files

  2. Security
    - Enable public access for all buckets
    - Allow authenticated users to upload files
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('images', 'images', true),
  ('videos', 'videos', true),
  ('audios', 'audios', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view files
CREATE POLICY "Public can view images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'images');

CREATE POLICY "Public can view videos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'videos');

CREATE POLICY "Public can view audios"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'audios');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload audios"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'audios');

-- Allow authenticated users to update files
CREATE POLICY "Authenticated users can update images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can update videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can update audios"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'audios');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can delete audios"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'audios');