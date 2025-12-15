import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storyAPI, chapterAPI, progressAPI } from '@/api/client';
import Navbar from '@/components/Navbar';
import Pagination from '@/components/Pagination';
import RichTextRenderer from '@/components/RichTextRenderer';

export default function StoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [lastProgress, setLastProgress] = useState(null);
  const [summaryFontSize, setSummaryFontSize] = useState(16);
  const [summaryFontFamily, setSummaryFontFamily] = useState('serif');

  const fonts = {
    serif: { name: 'Serif (Noto Serif)', value: "'Noto Serif', Georgia, serif" },
    sansSerif: { name: 'Sans Serif (Inter)', value: "'Inter', 'Segoe UI', sans-serif" },
    monospace: { name: 'Monospace', value: "'Courier New', monospace" },
    georgia: { name: 'Georgia', value: "'Georgia', serif" },
    palatino: { name: 'Palatino', value: "'Palatino', serif" }
  };

  // load saved preferences
  useEffect(() => {
    const size = parseInt(localStorage.getItem('summaryFontSize') || '16');
    const family = localStorage.getItem('summaryFontFamily') || 'serif';
    setSummaryFontSize(size);
    setSummaryFontFamily(family);
  }, []);

  useEffect(() => {
    fetchStory();
    fetchChapters(currentPage);
  }, [id, currentPage]);

  const fetchStory = async () => {
    try {
      const response = await storyAPI.getStoryById(id);
      setStory(response.data);
      // if user logged in, fetch reading progress for this story
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const p = await progressAPI.getProgressForStory(id);
          setLastProgress(p.data.progress);
        } catch (e) {
          console.warn('failed to fetch progress', e);
        }
      }
    } catch (error) {
      console.error('Failed to fetch story:', error);
    }
  };

  const fetchChapters = async (page) => {
    try {
      setLoading(true);
      const response = await chapterAPI.getChaptersByStory(id, page, 20);
      setChapters(response.data.chapters);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Đang tải...</div>
        </div>
      </div>
    );
  }

  const coverUrl = story.coverUrl 
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${story.coverUrl}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-5 md:p-6 lg:p-8 mb-6 sm:mb-7 md:mb-8 lg:mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {/* Cover Image */}
            <div className="md:col-span-1">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={story.title}
                  className="w-full rounded-lg shadow-md h-auto"
                />
              ) : (
                <div className="w-full aspect-[3/4] rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl">
                  📖
                </div>
              )}
            </div>

            {/* Story Info */}
            <div className="md:col-span-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 md:mb-3">{story.title}</h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 mb-2 sm:mb-3 md:mb-4">{story.author}</p>
              
              {story.translator && (
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  <strong>Nhà dịch:</strong> {story.translator}
                </p>
              )}

              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6 flex-wrap">
                <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                  story.status === 'full' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {story.status === 'full' ? 'Hoàn thành' : 'Đang ra'}
                </span>
                <span className="text-xs sm:text-sm text-gray-600">
                  {story.chaptersCount} chương
                </span>
              </div>

              <h3 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3">Tóm tắt</h3>
              <div className="mb-4 flex items-center gap-2 sm:gap-3 md:gap-4 flex-col sm:flex-row flex-wrap">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-xs sm:text-sm font-semibold whitespace-nowrap">Kích thước:</label>
                  <input
                    type="range"
                    min="12"
                    max="28"
                    value={summaryFontSize}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      setSummaryFontSize(v);
                      localStorage.setItem('summaryFontSize', String(v));
                    }}
                    className="w-20 sm:w-24 md:w-32"
                  />
                  <span className="text-xs sm:text-sm whitespace-nowrap">{summaryFontSize}px</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-xs sm:text-sm font-semibold whitespace-nowrap">Phông chữ:</label>
                  <select
                    value={summaryFontFamily}
                    onChange={(e) => {
                      setSummaryFontFamily(e.target.value);
                      localStorage.setItem('summaryFontFamily', e.target.value);
                    }}
                    className="px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded"
                  >
                    {Object.entries(fonts).map(([key, { name }]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                className="mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm md:text-base"
                style={{ fontSize: `${summaryFontSize}px`, fontFamily: fonts[summaryFontFamily].value, lineHeight: '1.6' }}
              >
                <RichTextRenderer content={story.summary} />
              </div>

              {chapters.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 flex-wrap">
                  <button
                    onClick={() => navigate(`/read/${id}/1`)}
                    className="bg-primary hover:bg-green-700 text-white font-bold py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg text-xs sm:text-sm md:text-base"
                  >
                    Đọc Từ Đầu
                  </button>
                  {lastProgress && lastProgress.chapterNumber && (
                    <button
                      onClick={() => navigate(`/read/${id}/${lastProgress.chapterNumber}`)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg text-xs sm:text-sm md:text-base"
                    >
                      Đọc Tiếp (Chương {lastProgress.chapterNumber})
                    </button>
                  )}
                  {/* Edit story button for admins */}
                  {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && (
                    <button
                      onClick={() => navigate(`/edit-story/${id}`)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg text-xs sm:text-sm md:text-base"
                    >
                      Chỉnh sửa truyện
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-5 md:p-6 lg:p-8">
          <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6 flex-wrap">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">Chương</h2>
            {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && (
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => navigate(`/add-chapter/${id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-2.5 px-2 sm:px-3 md:px-4 rounded-lg text-xs sm:text-sm"
                >
                  + Thêm 1 chương
                </button>
                <button
                  onClick={() => navigate(`/add-bulk-chapters/${id}`)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 sm:py-2.5 px-2 sm:px-3 md:px-4 rounded-lg text-xs sm:text-sm"
                >
                  + Thêm nhiều chương
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-sm text-gray-600">Đang tải truyện...</div>
            </div>
          ) : chapters.length > 0 ? (
            <>
              <div className="space-y-1 sm:space-y-2">
                {chapters.map((chapter) => (
                  <div
                    key={chapter._id}
                    className="block p-2 sm:p-3 hover:bg-gray-100 rounded-lg transition flex items-center justify-between flex-wrap gap-2"
                  >
                    <a
                      href={`/read/${id}/${chapter.chapterNumber}`}
                      className="flex-1 min-w-0"
                    >
                      <span className="font-semibold text-primary text-xs sm:text-sm">
                        Chương {chapter.chapterNumber}:
                      </span>
                      <span className="ml-1 sm:ml-2 text-gray-700 text-xs sm:text-sm truncate">{chapter.title}</span>
                    </a>
                    {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && (
                      <a
                        href={`/edit-chapter/${id}/${chapter.chapterNumber}`}
                        className="text-green-600 hover:underline text-xs sm:text-sm whitespace-nowrap"
                      >
                        Sửa
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 sm:mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-600 text-sm">Chưa có chương nào</p>
          )}
        </div>
      </div>
    </div>
  );
}
