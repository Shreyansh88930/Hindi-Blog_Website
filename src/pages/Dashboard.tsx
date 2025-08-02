import React, { useEffect, useState } from 'react'
import { getAllMedia, deleteMedia } from '../lib/mediaApi'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Edit, Trash2, Plus, FileText, FileImage, FileVideo2, FileAudio2 } from 'lucide-react'
import AddEditPost from './AddEditPost'

const Dashboard = () => {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  const loadMedia = async () => {
    setLoading(true);
    const { data } = await getAllMedia();
    setMedia(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadMedia()
  }, [])

  const handleEdit = (post) => {
    setSelectedPost(post)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this post?')) {
      await deleteMedia(id)
      loadMedia()
    }
  }

  const renderMediaPreview = (post) => {
    switch (post.file_type) {
      case 'image':
        return <img src={post.url} className="rounded-lg h-40 w-full object-cover my-2 border" alt="Uploaded" />
      case 'video':
        return <video src={post.url} controls className="rounded-lg h-40 w-full object-cover my-2 border" />
      case 'audio':
        return <audio src={post.url} controls className="w-full my-2" />
      case 'text':
      default:
        return (
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 my-2 text-sm font-devanagari whitespace-pre-wrap">
            {post.description}
          </div>
        )
    }
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <FileImage size={20} />
      case 'video': return <FileVideo2 size={20} />
      case 'audio': return <FileAudio2 size={20} />
      default: return <FileText size={20} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-devanagari text-gray-900 dark:text-white">डैशबोर्ड</h1>
          <button
            onClick={() => { setSelectedPost(null); setShowForm(true) }}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 shadow transition-colors"
          >
            <Plus size={20} /> <span>नया पोस्ट</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-300">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {media.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 font-devanagari">कोई पोस्ट उपलब्ध नहीं है।</div>
            ) : (
              media.map(post => (
                <div key={post.id} className="bg-white/90 dark:bg-gray-900/70 rounded-xl shadow-md border p-5 flex flex-col h-full relative transition-all hover:scale-[1.01] hover:shadow-lg">
                  <div className="flex items-center justify-between mb-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1 font-semibold">{getFileIcon(post.file_type)} <span className="capitalize">{post.file_type}</span></div>
                    <span className="text-xs opacity-70">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-lg font-bold font-devanagari text-gray-900 dark:text-white mb-2">{post.title}</h2>

                  {renderMediaPreview(post)}

                  <div className="flex justify-end gap-2 mt-auto pt-4">
                    <button
                      onClick={() => handleEdit(post)}
                      className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="bg-rose-500/80 hover:bg-rose-700 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
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
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard
