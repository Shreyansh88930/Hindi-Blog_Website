import React, { useState } from 'react'
import { createMedia, updateMedia, uploadMediaFile } from '../lib/mediaApi'
import { X, Plus } from 'lucide-react'

const EMPTY = { title: '', description: '', file_type: 'text', url: '' }

const AddEditPost = ({ post, onClose }) => {
  const [form, setForm] = useState(post || EMPTY)
  const [mediaFile, setMediaFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (file) setMediaFile(file)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setUploading(true)

    let url = form.url

    if (form.file_type !== 'text' && mediaFile) {
      const { url: uploadedUrl, error } = await uploadMediaFile(mediaFile, form.file_type)
      if (error) {
        alert('File upload failed.')
        setUploading(false)
        return
      }
      url = uploadedUrl
    }

    const payload = { ...form, url }

    if (post) {
      await updateMedia(post.id, payload)
    } else {
      await createMedia(payload)
    }

    setUploading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4 sm:px-6">
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl w-full max-w-lg max-h-screen overflow-y-auto shadow-lg relative border border-gray-200 dark:border-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-rose-600 transition"
        >
          <X size={23} />
        </button>

        <h2 className="text-lg sm:text-xl mb-5 font-bold font-devanagari dark:text-white">
          {post ? 'Edit' : 'Add'} Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleInput}
            placeholder="Title"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
          />
          <textarea
            name="description"
            value={form.description || ''}
            onChange={handleInput}
            rows={3}
            placeholder="Description"
            className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
          />
          <select
            name="file_type"
            value={form.file_type}
            onChange={(e) => {
              setForm({ ...form, file_type: e.target.value, url: '' })
              setMediaFile(null)
            }}
            className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>

          {form.file_type !== 'text' && (
            <input
              type="file"
              accept={
                form.file_type === 'image'
                  ? 'image/*'
                  : form.file_type === 'video'
                  ? 'video/*'
                  : 'audio/*'
              }
              onChange={handleFileChange}
              className="w-full text-sm sm:text-base"
            />
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-400 text-sm sm:text-base hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded flex items-center gap-1 text-sm sm:text-base transition"
            >
              <Plus size={16} />
              {uploading ? 'Saving...' : post ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEditPost
