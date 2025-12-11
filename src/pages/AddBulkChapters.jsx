import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chapterAPI } from '@/api/client';
import Navbar from '@/components/Navbar';

export default function AddBulkChapters() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  
  const [content, setContent] = useState('');
  const [separator, setSeparator] = useState('_________________');
  const [startChapterNumber, setStartChapterNumber] = useState('1');
  const [previewChapters, setPreviewChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  // Parse chapters from content
  const handleParseChapters = () => {
    if (!content.trim()) {
      setError('Please enter chapter content');
      setPreviewChapters([]);
      return;
    }

    setError('');
    const chapters = content.split(separator).filter(ch => ch.trim());
    
    if (chapters.length === 0) {
      setError('No chapters found. Check if separator is correct.');
      setPreviewChapters([]);
      return;
    }

    const parsed = chapters.map((chapter, index) => {
      const lines = chapter.trim().split('\n');
      const title = lines[0].trim() || `Chapter ${parseInt(startChapterNumber) + index}`;
      const chapterContent = lines.slice(1).join('\n').trim();
      
      return {
        chapterNumber: parseInt(startChapterNumber) + index,
        title,
        content: chapterContent,
        preview: chapterContent.substring(0, 100) + (chapterContent.length > 100 ? '...' : '')
      };
    });

    setPreviewChapters(parsed);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (previewChapters.length === 0) {
      setError('Please parse chapters first');
      return;
    }

    setError('');
    setSuccessMessage('');
    setLoading(true);
    setUploadProgress({ current: 0, total: previewChapters.length });

    const results = [];
    
    for (let i = 0; i < previewChapters.length; i++) {
      const chapter = previewChapters[i];
      try {
        await chapterAPI.createChapter({
          storyId,
          chapterNumber: chapter.chapterNumber,
          title: chapter.title,
          content: chapter.content
        });
        
        setUploadProgress({ current: i + 1, total: previewChapters.length });
        results.push({ success: true, chapterNumber: chapter.chapterNumber, title: chapter.title });
      } catch (err) {
        results.push({ 
          success: false, 
          chapterNumber: chapter.chapterNumber, 
          title: chapter.title,
          error: err.response?.data?.message || 'Failed to create chapter'
        });
      }
    }

    setLoading(false);

    // Check results
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    if (failed === 0) {
      setSuccessMessage(`✓ Successfully created ${successful} chapters!`);
      setTimeout(() => {
        navigate(`/story/${storyId}`);
      }, 2000);
    } else if (successful > 0) {
      setError(`Created ${successful} chapters but ${failed} failed. Check the failed chapters below.`);
      setPreviewChapters(previewChapters.map((ch, idx) => ({
        ...ch,
        uploadStatus: results[idx]
      })));
    } else {
      setError('Failed to create all chapters. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
            Thêm nhiều chương
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm mb-6 sm:mb-8">
            Dán nhiều chương cách nhau bởi một dấu phân tách. Dòng đầu tiên của mỗi chương sẽ trở thành tên chương.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3 rounded mb-4">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Settings Section */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Cài đặt</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">
                    Bắt đầu từ số chương
                  </label>
                  <input
                    type="number"
                    value={startChapterNumber}
                    onChange={(e) => setStartChapterNumber(e.target.value)}
                    min="1"
                    className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">
                    Dấu phân tách chương
                  </label>
                  <input
                    type="text"
                    value={separator}
                    onChange={(e) => setSeparator(e.target.value)}
                    placeholder="ví dụ: ________________"
                    className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Content Input */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">
                Nội dung chương
              </label>
              <p className="text-gray-600 text-xs mb-2">
                Dán tất cả các chương ở đây. Sử dụng dấu phân tách ở trên để chia các chương.
              </p>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Dán các chương của bạn ở đây..."
                className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                rows="20"
              />
            </div>

            {/* Parse Button */}
            <button
              type="button"
              onClick={handleParseChapters}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 sm:py-3 px-4 rounded-lg text-sm sm:text-base disabled:opacity-50"
            >
              Xem trước các chương
            </button>

            {/* Preview Section */}
            {previewChapters.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                  Tìm thấy {previewChapters.length} chương
                </h2>
                
                <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
                  {previewChapters.map((chapter) => (
                    <div key={chapter.chapterNumber} className="bg-white rounded p-3 sm:p-4 border border-blue-100">
                      <div className="flex items-start justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-xs sm:text-sm text-gray-800 break-words">
                            Chapter {chapter.chapterNumber}: {chapter.title}
                          </h3>
                          <p className="text-gray-600 text-xs mt-1 break-words">
                            {chapter.preview}
                          </p>
                        </div>
                        {chapter.uploadStatus && (
                          <div className="flex-shrink-0">
                            {chapter.uploadStatus.success ? (
                              <span className="text-green-600 text-xs sm:text-sm font-semibold">✓ Hoàn tất</span>
                            ) : (
                              <span className="text-red-600 text-xs sm:text-sm font-semibold">✗ Lỗi</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {loading && uploadProgress.total > 0 && (
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                <p className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                  Đang tải lên: {uploadProgress.current} trong {uploadProgress.total}
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            {previewChapters.length > 0 && (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-2 sm:py-3 px-4 rounded-lg text-sm sm:text-base disabled:opacity-50"
              >
                {loading ? `Đang tải lên... (${uploadProgress.current}/${uploadProgress.total})` : `Tạo ${previewChapters.length} chương`}
              </button>
            )}

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => navigate(`/story/${storyId}`)}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 sm:py-3 px-4 rounded-lg text-sm sm:text-base"
            >
              Hủy
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
