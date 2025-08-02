import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { likePost, unlikePost, getLikesCount, isPostLikedByUser } from '../lib/mediaApi';



const LikeButton = ({ postId }: { postId: string }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Always use null for userId (anonymous like)
  const userId = null;

  useEffect(() => {
    getLikesCount(postId).then(res => setLikesCount(res.count || 0));
    isPostLikedByUser(postId, userId).then(res => setLiked(!!res.data));
  }, [postId]);

  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);
    if (liked) {
      await unlikePost(postId, userId);
      setLiked(false);
      setLikesCount(c => Math.max(0, c - 1));
    } else {
      await likePost(postId, userId);
      setLiked(true);
      setLikesCount(c => c + 1);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`flex items-center space-x-1 ${liked ? 'text-red-500' : 'text-gray-500'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Heart />
      <span>{likesCount}</span>
    </button>
  );
};


export default LikeButton;