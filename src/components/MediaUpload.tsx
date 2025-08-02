import React, { useState } from 'react';
import { Upload, Image, Video, Volume2, Save, X, FileText } from 'lucide-react';
import { uploadMediaFile, addMediaRecord } from '../lib/supabase';
import { MediaItem } from '../types';

interface MediaUploadProps {
  onUploadComplete: (media: MediaItem) => void;
  onClose: () => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onUploadComplete, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file_type: 'image' as 'image' | 'video' | 'audio' | 'text',
    file: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });

      if (file.type.startsWith('image/')) {
        setFormData((prev) => ({ ...prev, file_type: 'image' }));
      } else if (file.type.startsWith('video/')) {
        setFormData((prev) => ({ ...prev, file_type: 'video' }));
      } else if (file.type.startsWith('audio/')) {
        setFormData((prev) => ({ ...prev, file_type: 'audio' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.file_type !== 'text' && !formData.file) return;

    setUploading(true);
    try {
      let url = '';
      if (formData.file_type !== 'text' && formData.file) {
        const bucket = `${formData.file_type}s`;
        const { data: uploadData, error: uploadError } = await uploadMediaFile(formData.file, bucket);
        if (uploadError) throw uploadError;
        url = uploadData!.publicUrl;
      }

      const { data: mediaData, error: dbError } = await addMediaRecord({
        title: formData.title,
        description: formData.description,
        file_type: formData.file_type,
        url,
      });

      if (dbError) throw dbError;
      if (mediaData && mediaData[0]) onUploadComplete(mediaData[0]);

      setFormData({ title: '', description: '', file_type: 'image', file: null });
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      alert('अपलोड में त्रुटि हुई। कृपया दोबारा कोशिश करें।');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl transition-all duration-300 animate-fade-in" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-rose-600 dark:text-rose-300 tracking-tight">📁 नया मीडिया जोड़ें</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-rose-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="बंद करें"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-800 dark:text-gray-200">शीर्षक</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="मीडिया का शीर्षक..."
              className="w-full px-4 py-2 text-base rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-800 dark:text-gray-200">विवरण</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="मीडिया के बारे में जानकारी..."
              className="w-full px-4 py-2 text-base rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"
            />
          </div>

          {/* Media Type Selector */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">मीडिया प्रकार</label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: 'image', label: 'चित्र', icon: Image },
                { value: 'video', label: 'वीडियो', icon: Video },
                { value: 'audio', label: 'ऑडियो', icon: Volume2 },
                { value: 'text', label: 'पाठ', icon: FileText },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, file_type: value as any })}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition hover:shadow-sm ${
                    formData.file_type === value
                      ? 'border-rose-500 bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-rose-300'
                  }`}
                >
                  <Icon className="h-6 w-6 mb-1" />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* File Input */}
          {formData.file_type !== 'text' && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">मीडिया फाइल</label>
              <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center bg-gray-50 dark:bg-gray-800">
                <Upload className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                <input
                  type="file"
                  accept={
                    formData.file_type === 'image'
                      ? 'image/*'
                      : formData.file_type === 'video'
                      ? 'video/*'
                      : 'audio/*'
                  }
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  required
                />
                <label
                  htmlFor="file-upload"
                  className="text-sm font-medium cursor-pointer text-rose-600 dark:text-rose-400 hover:underline"
                >
                  फाइल चुनें
                </label>
                {formData.file && (
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">{formData.file.name}</p>
                )}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between pt-4 space-x-3">
            <button
              type="submit"
              disabled={uploading || (formData.file_type !== 'text' && !formData.file)}
              className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              {uploading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>अपलोड करें</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              रद्द करें
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MediaUpload;
