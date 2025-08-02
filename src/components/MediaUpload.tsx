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
    file: null as File | null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });

      // Auto-detect file type
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, file_type: 'image' }));
      } else if (file.type.startsWith('video/')) {
        setFormData(prev => ({ ...prev, file_type: 'video' }));
      } else if (file.type.startsWith('audio/')) {
        setFormData(prev => ({ ...prev, file_type: 'audio' }));
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
        const bucket = `${formData.file_type}s`; // images, videos, audios
        const { data: uploadData, error: uploadError } = await uploadMediaFile(formData.file, bucket);
        if (uploadError) throw uploadError;
        url = uploadData!.publicUrl;
      }

      // Save media record (with or without file)
      const { data: mediaData, error: dbError } = await addMediaRecord({
        title: formData.title,
        description: formData.description,
        file_type: formData.file_type,
        url
      });

      if (dbError) throw dbError;

      if (mediaData && mediaData[0]) {
        onUploadComplete(mediaData[0]);
      }

      setFormData({
        title: '',
        description: '',
        file_type: 'image',
        file: null
      });

      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      alert('अपलोड में त्रुटि हुई। कृपया दोबारा कोशिश करें।');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
        style={{ maxHeight: '90vh', overflowY: 'auto' }} // <-- Add this line
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            नया मीडिया अपलोड करें
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              शीर्षक
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="मीडिया का शीर्षक..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              विवरण
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
              placeholder="मीडिया के बारे में..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              मीडिया प्रकार
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'image', label: 'चित्र', icon: Image },
                { value: 'video', label: 'वीडियो', icon: Video },
                { value: 'audio', label: 'ऑडियो', icon: Volume2 },
                { value: 'text', label: 'पाठ', icon: FileText }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, file_type: value as any })}
                  className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center space-y-1 ${
                    formData.file_type === value
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {formData.file_type !== 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                फाइल चुनें
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={
                    formData.file_type === 'image'
                      ? 'image/*'
                      : formData.file_type === 'video'
                      ? 'video/*'
                      : 'audio/*'
                  }
                  className="hidden"
                  id="file-upload"
                  required
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium"
                >
                  फाइल चुनें
                </label>
                {formData.file && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {formData.file.name}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={uploading || (formData.file_type !== 'text' && !formData.file)}
              className="flex-1 bg-rose-600 dark:bg-rose-700 text-white py-2 rounded-lg font-medium hover:bg-rose-700 dark:hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>अपलोड करें</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
