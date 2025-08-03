import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import {
  likePost,
  unlikePost,
  getLikesCount,
  isPostLikedByUser,
} from '../lib/mediaApi';

const LikeButton = ({ postId }: { postId: string }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const userId = null;

  useEffect(() => {
    getLikesCount(postId).then((res) => setLikesCount(res.count || 0));
    isPostLikedByUser(postId, userId).then((res) => setLiked(!!res.data));
  }, [postId]);

  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);
    if (liked) {
      await unlikePost(postId, userId);
      setLiked(false);
      setLikesCount((c) => Math.max(0, c - 1));
    } else {
      await likePost(postId, userId);
      setLiked(true);
      setLikesCount((c) => c + 1);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`
        group inline-flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2
        rounded-full border text-sm sm:text-base font-medium
        transition-all duration-300 ease-in-out
        ${liked ? 'bg-rose-100 border-rose-300 text-rose-600' : 'bg-gray-100 border-gray-300 text-gray-500'}
        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-md'}
      `}
    >
      <span
        className={`relative transition-all duration-300 ${
          liked ? 'text-rose-500 animate-like-pulse' : ''
        }`}
      >
        <Heart className="w-5 h-5 sm:w-6 sm:h-6" fill={liked ? '#f43f5e' : 'none'} />
        {liked && (
          <span className="absolute -inset-1 rounded-full blur-xl opacity-60 bg-rose-300 animate-ping z-[-1]" />
        )}
      </span>
      <span className="font-medium">{likesCount}</span>
    </button>
  );
};

export default LikeButton;
