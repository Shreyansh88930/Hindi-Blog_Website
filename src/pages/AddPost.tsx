import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';


const EMPTY_FORM = {
  title: '',
  content: '',
  contentType: 'text',
  mediaCaption: '',
  authorName: '',
};

type FormData = typeof EMPTY_FORM;

const AddPost = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  // Helper: Upload file to Supabase storage and return public URL
  const uploadFileToSupabase = async (file: File, contentType: string): Promise<string> => {
    try {
      let bucket = '';
      if (contentType === 'image') bucket = 'images';
      else if (contentType === 'video') bucket = 'videos';
      else if (contentType === 'audio') bucket = 'audios';
      else throw new Error("Unsupported media type for upload");

      // Create unique filepath e.g. media/timestamp_filename
      const filePath = `media/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error: any) {
      alert('Upload failed: ' + error.message);
      throw error;
    }
  };

  // Mutation to create post in Supabase table 'media'
  const createMutation = useMutation({
    mutationFn: async (postData: FormData & { mediaUrl?: string }) => {
      // Insert row into media table
      const { data, error } = await supabase.from('media').insert([
        {
          title: postData.title,
          description: postData.content,
          file_type: postData.contentType === 'text' ? null : postData.contentType, // null if text only, else type
          url: postData.mediaUrl || '', // empty string if no media
          // You can also store mediaCaption, authorName in additional columns if you add them
          created_at: new Date().toISOString(),
        }
      ]).select().single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      onClose();
    },
    onError: (error: any) => {
      alert('Failed to create post: ' + error.message);
    }
  });

  // Handle file selection and preview
  function handleMediaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setMediaPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setMediaPreview(null);
      }
    }
  }

  // Form submit handler: upload media first (if any), then create post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content && !mediaFile) {
      alert("Please add some content or a media file.");
      return;
    }

    try {
      setUploading(true);
      let mediaUrl = '';

      // Only upload if content type is media and file is selected
      if (mediaFile && formData.contentType !== 'text') {
        mediaUrl = await uploadFileToSupabase(mediaFile, formData.contentType);
      }

      await createMutation.mutateAsync({ ...formData, mediaUrl });
    } catch (error) {
      // error handled by mutate's onError
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-xl">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl max-w-xl w-full shadow-lg border border-gray-200 dark:border-gray-700 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-rose-500">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold font-devanagari text-gray-900 dark:text-white mb-4">
          नया पोस्ट जोड़ें
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="शीर्षक (Title)"
            value={formData.title}
            onChange={e => setFormData(v => ({ ...v, title: e.target.value }))}
          />

          <textarea
            className="w-full border rounded-lg px-3 py-2 font-devanagari"
            placeholder="पोस्ट कंटेंट यहाँ लिखें..."
            value={formData.content}
            onChange={e => setFormData(v => ({ ...v, content: e.target.value }))}
            rows={4}
          />

          {/* Content Type Select */}
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={formData.contentType}
            onChange={e => setFormData(v => ({ ...v, contentType: e.target.value }))}
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>

          {/* Media upload shown only if not text */}
          {formData.contentType !== 'text' && (
            <>
              <input
                type="file"
                accept={
                  formData.contentType === 'image'
                    ? 'image/*'
                    : formData.contentType === 'video'
                    ? 'video/*'
                    : 'audio/*'
                }
                onChange={handleMediaChange}
                className="mt-2"
              />
              {mediaPreview && (
                <img src={mediaPreview} alt="Preview" className="mt-2 rounded-lg max-h-40" />
              )}
            </>
          )}


          {/* Caption, Author name */}
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="मीडिया कैप्शन (Optional)"
            value={formData.mediaCaption}
            onChange={e => setFormData(v => ({ ...v, mediaCaption: e.target.value }))}
          />
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="लेखक का नाम"
            value={formData.authorName}
            onChange={e => setFormData(v => ({ ...v, authorName: e.target.value }))}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg gap-2 font-semibold"
              disabled={uploading || createMutation.isLoading}
            >
              <Plus size={16} />
              {uploading || createMutation.isLoading ? "Adding..." : "Add Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
