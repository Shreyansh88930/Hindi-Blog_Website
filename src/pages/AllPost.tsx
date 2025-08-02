import { useEffect, useState } from 'react'
import { getAllMedia } from '../lib/mediaApi'

type MediaItem = {
  id: string | number
  title: string
  description: string
  file_type: 'image' | 'video' | 'audio'
  url: string
}

const AllPosts = () => {
  const [media, setMedia] = useState<MediaItem[]>([])
  useEffect(() => {
    getAllMedia().then(({ data }) => setMedia(data || []))
  }, [])

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 grid gap-8 grid-cols-1 md:grid-cols-2">
      {media.map(item => (
        <div key={item.id} className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow border p-5">
          <h2 className="text-xl font-bold font-devanagari mb-1">{item.title}</h2>
          <p className="text-gray-600 font-devanagari">{item.description}</p>
          <div className="mt-2">
            {item.file_type === 'image' && <img src={item.url} alt="" className="rounded max-h-40" />}
            {item.file_type === 'video' && <video src={item.url} controls className="rounded max-h-40" />}
            {item.file_type === 'audio' && <audio src={item.url} controls className="w-full" />}
          </div>
        </div>
      ))}
    </div>
  )
}
export default AllPosts
