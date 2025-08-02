import React, { useState, useEffect } from 'react';
import { fetchAllMedia, fetchMediaByType } from '../lib/supabase';
import { MediaItem } from '../types';
import MediaGrid from '../components/MediaGrid';
import MediaUpload from '../components/MediaUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { Filter, Heart, Sparkles, Plus, Image, Video, Volume2 } from 'lucide-react';

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
    try {
      setLoading(true);
      let result;
      if (selectedType) {
        result = await fetchMediaByType(selectedType as 'image' | 'video' | 'audio');
      } else {
        result = await fetchAllMedia();
      }

      if (result.error) {
        console.error('Error fetching media:', result.error);
      } else {
        setMedia(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedType('');
  };

  const handleUploadComplete = (newMedia: MediaItem) => {
    setMedia(prev => [newMedia, ...prev]);
  };

  const getTypeStats = () => {
    const images = media.filter(item => item.file_type === 'image').length;
    const videos = media.filter(item => item.file_type === 'video').length;
    const audios = media.filter(item => item.file_type === 'audio').length;
    return { images, videos, audios };
  };

  const stats = getTypeStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-orange-400/20 dark:from-rose-900/20 dark:to-orange-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Heart className="h-16 w-16 text-rose-500 animate-pulse" />
                <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-bounce" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              प्रेरणा का स्रोत
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              हर दिन नई प्रेरणा के साथ अपने जीवन को सुंदर बनाएं
            </p>
            <div className="flex justify-center">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  ✨ कुल {media.length} मीडिया फाइलें ✨
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="flex items-center justify-center mb-2">
              <Heart className="h-8 w-8 text-rose-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{media.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">कुल मीडिया</div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="flex items-center justify-center mb-2">
              <Image className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.images}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">चित्र</div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="flex items-center justify-center mb-2">
              <Video className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.videos}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">वीडियो</div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="flex items-center justify-center mb-2">
              <Volume2 className="h-8 w-8 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.audios}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">ऑडियो</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">फ़िल्टर:</span>
              </div>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">सभी प्रकार</option>
                <option value="image">चित्र</option>
                <option value="video">वीडियो</option>
                <option value="audio">ऑडियो</option>
              </select>

              {selectedType && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
                >
                  फ़िल्टर साफ़ करें
                </button>
              )}
            </div>
            
            {user && (
              <button
                onClick={() => setShowUpload(true)}
                className="bg-rose-600 dark:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-rose-700 dark:hover:bg-rose-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>अपलोड करें</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <MediaGrid media={media} loading={loading} />
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <MediaUpload
          onUploadComplete={handleUploadComplete}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  );
};

export default Home;