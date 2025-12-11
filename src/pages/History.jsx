import { useState, useEffect } from 'react';
import { progressAPI } from '@/api/client';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await progressAPI.getProgress();
      setProgress(res.data.progress || []);
    } catch (e) {
      console.error('Failed to fetch progress', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Lịch sử đọc</h1>

          {loading ? (
            <div className="text-sm text-gray-600">Đang tải...</div>
          ) : progress.length === 0 ? (
            <p className="text-sm text-gray-600">Bạn chưa có lịch sử đọc nào.</p>
          ) : (
            <div className="space-y-2 sm:space-y-4">
              {progress.map((item) => (
                <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs sm:text-sm truncate">{item.storyId?.title || 'Đề tài không xác định'}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Lần cuối đọc: Chương {item.chapterNumber}</div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => navigate(`/story/${item.storyId._id}`)}
                      className="flex-1 sm:flex-none text-primary hover:underline text-xs sm:text-sm font-medium"
                    >
                      Xem
                    </button>
                    <button
                      onClick={() => navigate(`/read/${item.storyId._id}/${item.chapterNumber}`)}
                      className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium"
                    >
                      Tiếp tục đọc
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
