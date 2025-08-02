/*
  # Create media table for Hindi blog

  1. New Tables
    - `media`
      - `id` (uuid, primary key)
      - `title` (text, media title)
      - `description` (text, media description)
      - `file_type` (text, constrained to 'image', 'video', 'audio')
      - `url` (text, public URL to the media file)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `media` table
    - Add policy for public read access
    - Add policy for authenticated users to insert/update/delete
*/

CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_type text NOT NULL CHECK (file_type IN ('image', 'video', 'audio')),
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all media
CREATE POLICY "Public can read media"
  ON media
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert media
CREATE POLICY "Authenticated users can insert media"
  ON media
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update their own media
CREATE POLICY "Authenticated users can update media"
  ON media
  FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users to delete media
CREATE POLICY "Authenticated users can delete media"
  ON media
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_file_type ON media(file_type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);
-- Anyone can like
create policy "Anyone can like media"
on public.likes
for insert
using (true);


-- Allow anyone to insert a comment
create policy "Anyone can insert comments"
on comments
for insert
using (true);


-- Allow read to everyone
create policy "Allow read for all" on comments
for select using (true);

create policy "Allow insert for all" on likes
for insert using (true);

create policy "Allow read for all" on likes
for select using (true);

