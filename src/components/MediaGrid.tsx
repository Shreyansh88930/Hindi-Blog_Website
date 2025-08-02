import React from 'react';
import { MediaItem } from '../types';
import { Play, Volume2, Image as ImageIcon, Calendar } from 'lucide-react';
import LikeButton from './LikeButton';
import { CommentsList } from './CommentList';
import { Link } from 'react-router-dom';


interface MediaGridProps {
  media: MediaItem[];
  loading?: boolean;
}

const MediaGrid: React.FC<MediaGridProps> = ({ media, loading }) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-5 w-5 text-indigo-500" />;
      case 'audio': return <Volume2 className="h-5 w-5 text-pink-500" />;
      case 'image': return <ImageIcon className="h-5 w-5 text-green-500" />;
      default: return <ImageIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'वीडियो';
      case 'audio': return 'ऑडियो';
      case 'image': return 'चित्र';
      default: return 'मीडिया';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-md">
            <div className="bg-gray-300 dark:bg-gray-600 h-48 rounded-xl mb-4" />
            <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded mb-2 w-3/4" />
            <div className="bg-gray-300 dark:bg-gray-600 h-3 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-16">
        <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">कोई मीडिया नहीं मिला</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">अभी तक कोई मीडिया अपलोड नहीं किया गया है</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {media.map((item) => (
        <div
          key={item.id}
          className="bg-gradient-to-br from-white via-rose-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
          rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 
          hover:shadow-lg hover:scale-[1.01]"
        >
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {getTypeIcon(item.file_type)}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {getTypeLabel(item.file_type)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(item.created_at)}</span>
              </div>
            </div>

            <div className="mb-4">
              {item.file_type === 'image' && (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-52 object-cover rounded-xl shadow-sm transition duration-300 hover:opacity-90"
                  loading="lazy"
                />
              )}
              {item.file_type === 'video' && (
                <video
                  src={item.url}
                  controls
                  className="w-full h-52 object-cover rounded-xl shadow-sm"
                  preload="metadata"
                >
                  आपका ब्राउज़र वीडियो प्लेबैक का समर्थन नहीं करता।
                </video>
              )}
              {item.file_type === 'audio' && (
                <div className="bg-gradient-to-r from-rose-100 to-orange-100 dark:from-rose-900/30 dark:to-orange-900/30 rounded-xl p-6 text-center">
                  <Volume2 className="h-12 w-12 text-rose-500 mx-auto mb-4" />
                  <audio src={item.url} controls className="w-full" preload="metadata">
                    आपका ब्राउज़र ऑडियो प्लेबैक का समर्थन नहीं करता।
                  </audio>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white line-clamp-2">
                {item.title}
              </h3>
              {item.description && (
                <>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                    {item.description}
                  </p>
                  {(item.description.length > 120 || item.title.length > 60) && (
                    <Link
                      to={`/media/${item.id}`}
                      className="inline-block mt-2 text-rose-600 hover:underline text-sm font-medium"
                    >
                      और पढ़ें →
                    </Link>
                  )}
                </>
              )}
            </div>
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="mb-3">
                <LikeButton postId={item.id} />
              </div>
              <CommentsList postId={item.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaGrid;