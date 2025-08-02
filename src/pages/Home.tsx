import React, { useState, useEffect } from 'react';
import { fetchAllMedia, fetchMediaByType } from '../lib/supabase';
import { MediaItem } from '../types';
import MediaGrid from '../components/MediaGrid';
import MediaUpload from '../components/MediaUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import {
  Heart, Star, HandHeart, Image, Video, Volume2,
  Filter, Plus
} from 'lucide-react';
import Footer from '../components/Footer';
import DailyQuote from '../components/DailyQuote';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('');
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, [selectedType]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const result = selectedType
        ? await fetchMediaByType(selectedType as 'image' | 'video' | 'audio')
        : await fetchAllMedia();
      if (result.error) console.error(result.error);
      else setMedia(result.data || []);
    } catch (err) {
      console.error('Media fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (newMedia: MediaItem) => {
    setMedia(prev => [newMedia, ...prev]);
  };

  const clearFilters = () => setSelectedType('');

  const stats = {
    images: media.filter(m => m.file_type === 'image').length,
    videos: media.filter(m => m.file_type === 'video').length,
    audios: media.filter(m => m.file_type === 'audio').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <LoadingSpinner loadingSpinner={loading} />
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-400/10 to-orange-400/10 dark:from-rose-900/10 dark:to-orange-900/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <HandHeart className="h-16 w-16 text-rose-500 animate-pulse" />
              <Star className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight drop-shadow-sm text-center">
            पी.एल. फाउंडेशन
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mt-4 max-w-3xl mx-auto text-center">
            "सेवा ही सच्चा धर्म है।"
          </p>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto text-center italic">
            "समाज की भलाई ही हमारी सच्ची प्रेरणा है।"
          </p>
          <div className="mt-6">
            <span className="inline-block bg-white/70 dark:bg-gray-800/70 px-6 py-2 rounded-full border border-gray-300 dark:border-gray-600 backdrop-blur-sm text-gray-800 dark:text-white font-medium shadow-sm">
              ✨ कुल {media.length} मीडिया फाइलें ✨
            </span>
          </div>
        </div>
      </div>
        <DailyQuote />

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: <Heart className="text-rose-500" />, value: media.length, label: 'कुल मीडिया' },
          { icon: <Image className="text-sky-500" />, value: stats.images, label: 'चित्र' },
          { icon: <Video className="text-green-500" />, value: stats.videos, label: 'वीडियो' },
          { icon: <Volume2 className="text-purple-500" />, value: stats.audios, label: 'ऑडियो' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center shadow-md backdrop-blur-lg"
          >
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-md p-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="text-gray-600 dark:text-gray-400" />
            <span className="font-medium text-gray-800 dark:text-gray-300">फ़िल्टर:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-rose-500"
            >
              <option value="">सभी प्रकार</option>
              <option value="image">चित्र</option>
              <option value="video">वीडियो</option>
              <option value="audio">ऑडियो</option>
            </select>
            {selectedType && (
              <button
                onClick={clearFilters}
                className="text-sm text-rose-600 dark:text-rose-400 hover:underline"
              >
                फ़िल्टर हटाएं
              </button>
            )}
          </div>
          {user && (
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              अपलोड करें
            </button>
          )}
        </div>
      </div>

      {/* Media Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <MediaGrid media={media} loading={loading} />
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <MediaUpload
          onUploadComplete={handleUploadComplete}
          onClose={() => setShowUpload(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Home;
