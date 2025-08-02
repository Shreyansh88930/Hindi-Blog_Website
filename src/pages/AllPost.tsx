import { useEffect, useState } from 'react';
import { getAllMedia } from '../lib/mediaApi';
import LoadingSpinner from '../components/LoadingSpinner';

type MediaItem = {
  id: string | number;
  title: string;
  description: string;
  file_type: 'image' | 'video' | 'audio';
  url: string;
};

const AllPosts = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true); 
  
    useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 1200); // simulate loading delay
      return () => clearTimeout(timer);
    }, []);

  useEffect(() => {
    getAllMedia().then(({ data }) => setMedia(data || []));
  }, []);

  if (loading) return <LoadingSpinner loadingSpinner={loading}/>;

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <h1 className="text-4xl font-bold text-center mb-12 font-devanagari text-gray-800 dark:text-gray-100">
        सभी मीडिया पोस्ट्स
      </h1>

      <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {media.map(item => (
          <div
            key={item.id}
            className="group bg-white/90 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl rounded-3xl p-6 transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
          >
            <h2 className="text-2xl font-semibold font-devanagari text-gray-900 dark:text-white mb-3 break-words">
              {item.title}
            </h2>

            <p className="text-gray-700 dark:text-gray-300 font-devanagari text-sm leading-relaxed mb-4 break-words">
              {item.description}
            </p>

            <div className="overflow-hidden rounded-xl shadow-inner">
              {item.file_type === 'image' && (
                <img
                  src={item.url}
                  alt={item.title}
                  className="rounded-xl w-full max-h-64 object-cover transition duration-300 group-hover:scale-105"
                />
              )}
              {item.file_type === 'video' && (
                <video
                  src={item.url}
                  controls
                  className="w-full rounded-xl max-h-64 object-cover"
                />
              )}
              {item.file_type === 'audio' && (
                <audio
                  src={item.url}
                  controls
                  className="w-full rounded-md"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllPosts;
