import React, { useEffect, useState } from 'react';
import { getAllMedia, deleteMedia } from '../lib/mediaApi';
import Footer from '../components/Footer';
import {
  Edit,
  Trash2,
  Plus,
  FileText,
  FileImage,
  FileVideo2,
  FileAudio2
} from 'lucide-react';
import AddEditPost from './AddEditPost';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [media, setMedia] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    const { data } = await getAllMedia();
    setMedia(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleEdit = (post) => {
    setSelectedPost(post);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this post?')) {
      await deleteMedia(id);
      loadMedia();
    }
  };

  const renderMediaPreview = (post) => {
    switch (post.file_type) {
      case 'image':
        return (
          <img
            src={post.url}
            alt="Uploaded"
            className="rounded-xl h-48 w-full object-cover border transition-transform duration-300 group-hover:scale-105"
          />
        );
      case 'video':
        return (
          <video
            src={post.url}
            controls
            className="rounded-xl h-48 w-full object-cover border"
          />
        );
      case 'audio':
        return <audio src={post.url} controls className="w-full my-2" />;
      case 'text':
      default:
        return (
          <div className="border rounded-xl p-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm font-devanagari whitespace-pre-wrap max-h-40 overflow-y-auto">
            {post.description}
          </div>
        );
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return <FileImage size={18} />;
      case 'video':
        return <FileVideo2 size={18} />;
      case 'audio':
        return <FileAudio2 size={18} />;
      default:
        return <FileText size={18} />;
    }
  };

  if (loading) return <LoadingSpinner loadingSpinner={loading} />;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-rose-50 via-orange-50 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-devanagari">
            डैशबोर्ड
          </h1>
          <button
            onClick={() => {
              setSelectedPost(null);
              setShowForm(true);
            }}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition"
          >
            <Plus size={20} />
            <span className="text-sm font-medium">नया पोस्ट</span>
          </button>
        </div>

        {media.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300 font-devanagari mt-20">
            कोई पोस्ट उपलब्ध नहीं है।
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {media.map((post) => (
              <div
                key={post.id}
                className="group bg-white/90 dark:bg-gray-900/80 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-md flex flex-col justify-between transition hover:shadow-lg hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between text-sm mb-3 text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    {getFileIcon(post.file_type)}
                    <span className="capitalize">{post.file_type}</span>
                  </div>
                  <span className="text-xs">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>

                <h2 className="text-lg font-bold text-gray-900 dark:text-white font-devanagari mb-2 break-words">
                  {post.title}
                </h2>

                {renderMediaPreview(post)}

                <div className="mt-4 flex justify-end gap-2 flex-wrap">
                  <button
                    onClick={() => handleEdit(post)}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-rose-500/90 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <AddEditPost
            post={selectedPost}
            onClose={() => {
              setShowForm(false);
              loadMedia();
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
