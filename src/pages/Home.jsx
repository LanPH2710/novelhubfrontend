import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storyAPI } from '@/api/client';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import StoryCard from '@/components/StoryCard';
import Pagination from '@/components/Pagination';

export default function Home() {
  const [stories, setStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStories(currentPage);
  }, [currentPage]);

  const fetchStories = async (page) => {
    try {
      setLoading(true);
      const response = await storyAPI.getStories(page, 12);
      setStories(response.data.stories);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    // Implement search functionality
    console.log('Search:', query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2 sm:mb-3 md:mb-4">Chào mừng đến Novel Hub by Bear</h1>
        <p className="text-center text-xs sm:text-sm md:text-base text-gray-600 mb-6 sm:mb-7 md:mb-8 lg:mb-10">
          Khám phá và đọc hàng ngàn truyện light novel
        </p>

        <SearchBar onSearch={handleSearch} />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">Đang tải...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
              {stories.map((story) => (
                <StoryCard key={story._id} story={story} />
              ))}
            </div>

            {stories.length === 0 && (
              <div className="flex justify-center items-center h-64">
                <p className="text-xl text-gray-600">Không tìm thấy truyện nào</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 sm:mt-10 md:mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
