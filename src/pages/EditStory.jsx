import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storyAPI } from '@/api/client';
import Navbar from '@/components/Navbar';
import RichTextEditor from '@/components/RichTextEditor';

export default function EditStory() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [translator, setTranslator] = useState('');
  const [status, setStatus] = useState('ongoing');
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchStory();
  }, [navigate, storyId]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const response = await storyAPI.getStoryById(storyId);
      const story = response.data;
      setTitle(story.title);
      setAuthor(story.author);
      setTranslator(story.translator || '');
      setStatus(story.status);
      setSummary(story.summary);
      if (story.coverUrl) {
        setCoverPreview(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${story.coverUrl}`);
      }
    } catch (err) {
      setError('Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('translator', translator);
      formData.append('status', status);
      formData.append('summary', summary);
      if (coverImage) {
        formData.append('cover', coverImage);
      }

      await storyAPI.updateStory(storyId, formData);
      setSuccessMessage('Story updated successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update story');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-sm text-gray-600">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Sửa truyện</h1>

          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 text-green-700 text-xs sm:text-sm rounded">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Tên *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:border-primary"
                placeholder="Tên truyện"
                required
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Tác giả *</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:border-primary"
                placeholder="Tên tác giả"
                required
              />
            </div>

            {/* Translator */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Nhà dịch (Đối - Tùy chọn)</label>
              <input
                type="text"
                value={translator}
                onChange={(e) => setTranslator(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:border-primary"
                placeholder="Tên nhà dịch"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Trạng thái *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:border-primary"
                required
              >
                <option value="ongoing">Đang càng</option>
                <option value="full">Hoàn thành</option>
              </select>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Tóm tắt *</label>
              <RichTextEditor
                value={summary}
                onChange={setSummary}
                placeholder="Tóm tắt truyện (hỗ trợ in đậm, in nghưa, gạch chân)"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Hình ảnh bìa (Đối - Tùy chọn)</label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:border-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, hoặc WebP</p>
                </div>
                {coverPreview && (
                  <div className="w-24 sm:w-32 flex-shrink-0">
                    <img
                      src={coverPreview}
                      alt="Xem trước bìa"
                      className="w-24 sm:w-32 h-32 sm:h-48 object-cover rounded shadow"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded text-sm sm:text-base"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
