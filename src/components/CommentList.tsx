import { getComments, addComment } from '../lib/mediaApi';
import { useAuth } from '../context/AuthContext';
import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function CommentsList({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [expanded, setExpanded] = useState(false);

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
    <div
      className={`transition-all duration-300 ${
        expanded
          ? 'max-w-4xl mx-auto w-full px-2 sm:px-4'  // Reduced padding
          : 'max-w-3xl mx-auto w-full px-4 sm:px-6 md:px-8'  // Normal mode
      }`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center text-sm text-blue-600 hover:underline"
        >
          {expanded ? (
            <>
              Hide Comments <ChevronUp className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              Show Comments ({comments.length}) <ChevronDown className="ml-1 h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Conditional rendering of comment box */}
      {expanded && (
        <>
          {/* Scrollable comment list */}
          <div className="max-h-64 overflow-y-auto mb-4 bg-white rounded-md border border-gray-200 p-4 space-y-3 shadow-sm">
            {comments.length > 0 ? (
              comments.map(c => (
                <div key={c.comment_id} className="border-b pb-2 last:border-none">
                  <small className="text-gray-600 text-xs block">
                    {c.name || 'Guest'} • {new Date(c.created_at).toLocaleString()}
                  </small>
                  <p className="text-sm mt-1 break-words">{c.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}
          </div>

          {/* Comment form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              required
              placeholder="Add your comment..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-blue-700 transition-all duration-200"
            >
              Add Comment
            </button>
          </form>
        </>
      )}
    </div>
  );
}
