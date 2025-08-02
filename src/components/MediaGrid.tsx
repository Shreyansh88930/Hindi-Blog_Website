import React from 'react';
import { MediaItem } from '../types';
import { Play, Volume2, Image as ImageIcon, Calendar } from 'lucide-react';
import LikeButton from './LikeButton';
import { CommentsList } from './CommentList';


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
      case 'video': return <Play className="h-5 w-5" />;
      case 'audio': return <Volume2 className="h-5 w-5" />;
      case 'image': return <ImageIcon className="h-5 w-5" />;
      default: return <ImageIcon className="h-5 w-5" />;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 animate-pulse">
            <div className="bg-gray-300 dark:bg-gray-600 h-48 rounded-lg mb-4" />
            <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded mb-2" />
            <div className="bg-gray-300 dark:bg-gray-600 h-3 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-16">
        <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">कोई मीडिया नहीं मिला</h3>
        <p className="text-gray-600 dark:text-gray-400">अभी तक कोई मीडिया अपलोड नहीं किया गया है</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {media.map((item) => (
        <div key={item.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group card-hover">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getTypeIcon(item.file_type)}
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{getTypeLabel(item.file_type)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(item.created_at)}</span>
              </div>
            </div>

            <div className="mb-4">
              {item.file_type === 'image' && (
                <img src={item.url} alt={item.title} className="w-full h-48 object-cover rounded-lg shadow-sm" loading="lazy" />
              )}
              {item.file_type === 'video' && (
                <video src={item.url} controls className="w-full h-48 object-cover rounded-lg shadow-sm" preload="metadata">
                  आपका ब्राउज़र वीडियो प्लेबैक का समर्थन नहीं करता।
                </video>
              )}
              {item.file_type === 'audio' && (
                <div className="bg-gradient-to-r from-rose-100 to-orange-100 dark:from-rose-900/30 dark:to-orange-900/30 rounded-lg p-8 text-center">
                  <Volume2 className="h-16 w-16 text-rose-500 mx-auto mb-4" />
                  <audio src={item.url} controls className="w-full" preload="metadata">
                    आपका ब्राउज़र ऑडियो प्लेबैक का समर्थन नहीं करता।
                  </audio>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">{item.title}</h3>
              {item.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">{item.description}</p>
              )}
            </div>

            <div className="pt-4 border-t mt-4 space-y-4">
              {item?.id && <LikeButton postId={item.id} />}
              {item?.id && <CommentsList postId={item.id} />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaGrid;
