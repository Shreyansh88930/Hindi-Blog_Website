import React, { useState,useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';

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
  const [loading, setLoading] = useState(true); 
    
      useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200); // simulate loading delay
        return () => clearTimeout(timer);
      }, []);

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

  if (loading) return <LoadingSpinner loadingSpinner={loading}/>;

  return (
    <>
      <LoadingSpinner loadingSpinner={uploading || createMutation.isLoading} />

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2 sm:px-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-2xl p-4 sm:p-8 relative animate-fade-in-up max-h-screen overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-rose-600 transition"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 font-devanagari">
            नया पोस्ट जोड़ें
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl border text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400 dark:bg-gray-800 dark:text-white"
              placeholder="शीर्षक (Title)"
              value={formData.title}
              onChange={(e) => setFormData((v) => ({ ...v, title: e.target.value }))}
              required
            />

            {/* Description */}
            <textarea
              className="w-full px-4 py-2 rounded-xl border text-sm sm:text-base shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-400 dark:bg-gray-800 dark:text-white font-devanagari"
              placeholder="पोस्ट कंटेंट यहाँ लिखें..."
              value={formData.content}
              onChange={(e) => setFormData((v) => ({ ...v, content: e.target.value }))}
              rows={4}
            />

            {/* Content Type */}
            <select
              className="w-full px-4 py-2 rounded-xl border text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400 dark:bg-gray-800 dark:text-white"
              value={formData.contentType}
              onChange={(e) => setFormData((v) => ({ ...v, contentType: e.target.value }))}
            >
              <option value="text">पाठ</option>
              <option value="image">चित्र</option>
              <option value="video">वीडियो</option>
              <option value="audio">ऑडियो</option>
            </select>

            {/* Media Upload */}
            {formData.contentType !== "text" && (
              <div className="space-y-2">
                <input
                  type="file"
                  accept={
                    formData.contentType === "image"
                      ? "image/*"
                      : formData.contentType === "video"
                      ? "video/*"
                      : "audio/*"
                  }
                  onChange={handleMediaChange}
                  className="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200 transition"
                />

                {mediaPreview && formData.contentType === "image" && (
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="rounded-xl max-h-48 max-w-full h-auto border border-gray-300 dark:border-gray-600 shadow"
                  />
                )}
              </div>
            )}

            {/* Caption */}
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl border text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400 dark:bg-gray-800 dark:text-white"
              placeholder="मीडिया कैप्शन (Optional)"
              value={formData.mediaCaption}
              onChange={(e) => setFormData((v) => ({ ...v, mediaCaption: e.target.value }))}
            />

            {/* Author */}
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl border text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400 dark:bg-gray-800 dark:text-white"
              placeholder="लेखक का नाम"
              value={formData.authorName}
              onChange={(e) => setFormData((v) => ({ ...v, authorName: e.target.value }))}
              required
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                disabled={uploading}
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow transition text-sm sm:text-base disabled:opacity-60"
                disabled={uploading || createMutation.isLoading}
              >
                <Plus size={18} />
                {uploading || createMutation.isLoading ? 'पोस्ट जोड़ रहे हैं...' : 'पोस्ट जोड़ें'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddPost;