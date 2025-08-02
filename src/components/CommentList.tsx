import { getComments, addComment } from '../lib/mediaApi';
import { useAuth } from '../context/AuthContext';
import React, { useEffect, useState } from 'react';

export function CommentsList({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (!postId) return;
    getComments(postId).then(res => setComments(res.data || []));
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const userId = user?.id || null;
    const displayName = name.trim() || 'Guest';
    const { data } = await addComment(postId, text, userId, displayName);
    if (data) {
      setComments(prev => [...prev, data]);
      setText('');
      setName('');
    }
  };

  return (
    <div>
      {comments.map(c => (
        <div key={c.comment_id} className="border-b py-2">
          <small>
            {c.name || 'Guest'} • {new Date(c.created_at).toLocaleString()}
          </small>
          <p>{c.content}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full border rounded p-2 mb-2"
        />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          required
          placeholder="Add your comment..."
          className="w-full border rounded p-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
          Add Comment
        </button>
      </form>
    </div>
  );
}