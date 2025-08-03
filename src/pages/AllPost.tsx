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
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getAllMedia().then(({ data }) => setMedia(data || []));
  }, []);

  if (loading) return <LoadingSpinner loadingSpinner={loading} />;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 font-devanagari text-gray-800 dark:text-gray-100">
        सभी मीडिया पोस्ट्स
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
        {media.map((item) => (
          <div
            key={item.id}
            className="min-w-0 group bg-white/90 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl rounded-3xl p-4 sm:p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold font-devanagari text-gray-900 dark:text-white mb-2 sm:mb-3 break-words">
              {item.title}
            </h2>

            <p className="text-gray-700 dark:text-gray-300 font-devanagari text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words">
              {item.description}
            </p>

            <div className="overflow-hidden rounded-xl shadow-inner">
              {item.file_type === 'image' && (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-52 sm:h-56 md:h-64 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
              )}
              {item.file_type === 'video' && (
                <video
                  src={item.url}
                  controls
                  className="w-full h-52 sm:h-56 md:h-64 object-cover rounded-xl"
                />
              )}
              {item.file_type === 'audio' && (
                <audio
                  src={item.url}
                  controls
                  className="w-full mt-2 rounded-md"
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
