import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleMediaById } from '../lib/mediaApi'; // You need this function
import { MediaItem } from '../types';
import LikeButton from '../components/LikeButton';
import { CommentsList } from '../components/CommentList';
import { Calendar, Play, Volume2, Image as ImageIcon } from 'lucide-react';
import Footer from './Footer';

const MediaDetail = () => {
  const { id } = useParams();
  const [media, setMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (id) {
      getSingleMediaById(id).then(setMedia);
    }
  }, [id]);

  if (!media) {
    return <div className="text-center p-10">लोड हो रहा है...</div>;
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-5 w-5 text-indigo-500" />;
      case 'audio': return <Volume2 className="h-5 w-5 text-pink-500" />;
      case 'image': return <ImageIcon className="h-5 w-5 text-green-500" />;
      default: return <ImageIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon(media.file_type)}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{media.file_type}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{new Date(media.created_at).toLocaleDateString('hi-IN')}</span>
          </div>
        </div>

        {media.file_type === 'image' && (
          <img src={media.url} alt={media.title} className="w-full h-auto rounded-xl" />
        )}

        {media.file_type === 'video' && (
          <video src={media.url} controls className="w-full h-auto rounded-xl" preload="metadata" />
        )}

        {media.file_type === 'audio' && (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl">
            <audio src={media.url} controls className="w-full" preload="metadata" />
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{media.title}</h2>
        <p className="text-gray-700 dark:text-gray-300">{media.description}</p>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          <LikeButton postId={media.id} />
          <CommentsList postId={media.id} />
        </div>
      </div>
    </div>
      <Footer />
      </div>
  );
};

export default MediaDetail;
