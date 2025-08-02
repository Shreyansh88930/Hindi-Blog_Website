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
    <div className="mt-4">
      {/* Scrollable comment list */}
      <div className="max-h-20 overflow-y-auto mb-4 bg-white rounded border p-2 space-y-2">
        {comments.length > 0 ? (
          comments.map(c => (
            <div key={c.comment_id} className="border-b pb-2">
              <small className="text-gray-600">
                {c.name || 'Guest'} • {new Date(c.created_at).toLocaleString()}
              </small>
              <p className="text-sm mt-1">{c.content}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No comments yet.</p>
        )}
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full border rounded p-2 text-sm"
        />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          required
          placeholder="Add your comment..."
          className="w-full border rounded p-2 text-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Comment
        </button>
      </form>
    </div>
  );
}
