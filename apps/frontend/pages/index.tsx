import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/platform/Sidebar';
import ContentCard from '../components/platform/ContentCard';
import { categories } from '../data/mock-data';
import { Sparkles, Mic2, PlayCircle, Zap } from 'lucide-react';

const HomePage: NextPage = () => {
  const [content, setContent] = useState<any>({ podcasts: [], videos: [], shorts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/content');
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const { shorts, podcasts, videos } = content;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Mawaba Learn | Global Education Platform</title>
        <meta name="description" content="Learning podcast, shorts, and videos platform for global education" />
      </Head>

      <Navbar />
      <Sidebar />

      <main className="lg:pl-64 pt-16">
        <div className="max-w-[1600px] mx-auto p-6 flex flex-col gap-10">

          {/* Category Pills */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-gray-50 transition-colors first:bg-black first:text-white first:border-black"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Hero / Featured */}
          <section className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-indigo-900 flex items-center px-8 md:px-16">
            <div className="absolute inset-0 opacity-40">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=60"
                alt="Featured"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-900/80 to-transparent" />
            </div>
            <div className="relative z-10 max-w-xl text-white">
              <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">New Mentorship Series</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Master Global Business with Marcus Thorne
              </h1>
              <p className="text-indigo-100 text-lg mb-8 line-clamp-2">
                Join our exclusive mentorship program and learn the secrets of building multi-billion dollar companies from the ground up.
              </p>
              <button className="bg-white text-indigo-900 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                Start Learning Now
              </button>
            </div>
          </section>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {/* Educational Shorts Section */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-6 h-6 text-orange-500 fill-current" />
                  <h2 className="text-2xl font-bold text-gray-900">Education Shorts</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {shorts && shorts.map((short: any) => (
                    <ContentCard
                      key={short.id}
                      title={short.title}
                      author={short.author || "Unknown"}
                      category={short.category || short.discipline}
                      thumbnail={short.thumbnail || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&auto=format&fit=crop&q=60"}
                      views={short.views || "1.2k"}
                      type="short"
                    />
                  ))}
                </div>
              </section>

              {/* Featured Podcasts Section */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Mic2 className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Trending Podcasts</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {podcasts && podcasts.map((podcast: any) => (
                    <ContentCard
                      key={podcast.id}
                      title={podcast.title}
                      author={podcast.author || "Host Name"}
                      category={podcast.category || podcast.discipline}
                      thumbnail={podcast.thumbnail || "https://images.unsplash.com/photo-1478737270239-2fccd27ee086?w=400&auto=format&fit=crop&q=60"}
                      duration={podcast.duration || "45:00"}
                      type="podcast"
                    />
                  ))}
                </div>
              </section>

              {/* Video Courses Section */}
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <PlayCircle className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900">In-depth Courses</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                  {videos && videos.map((video: any) => (
                    <ContentCard
                      key={video.id}
                      title={video.title}
                      author={video.author || "Instructor"}
                      category={video.category || video.discipline}
                      thumbnail={video.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"}
                      duration={video.duration || "12:30"}
                      views={video.views || "5.4k"}
                      type="video"
                    />
                  ))}
                </div>
              </section>
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default HomePage;
