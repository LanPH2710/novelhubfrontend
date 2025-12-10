import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storyAPI } from '@/api/client';
import Navbar from '@/components/Navbar';
import RichTextEditor from '@/components/RichTextEditor';

export default function AddStory() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [translator, setTranslator] = useState('');
  const [status, setStatus] = useState('ongoing');
  const [summary, setSummary] = useState('');
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCover(file);
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
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('translator', translator);
      formData.append('status', status);
      formData.append('summary', summary);
      if (cover) {
        formData.append('cover', cover);
      }

      const response = await storyAPI.createStory(formData);
      navigate(`/story/${response.data.story._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Add New Story</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">
                  Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">
                  Translator
                </label>
                <input
                  type="text"
                  value={translator}
                  onChange={(e) => setTranslator(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ongoing">Ongoing</option>
                <option value="full">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">Summary</label>
              <RichTextEditor
                value={summary}
                onChange={setSummary}
                placeholder="Write a short formatted summary (you can use bold, italic, underline)"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">
                Cover Image
              </label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {coverPreview && (
                  <img
                    src={coverPreview}
                    alt="Preview"
                    className="h-20 sm:h-24 rounded object-cover"
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-2 sm:py-3 px-4 rounded-lg text-sm sm:text-base disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Story'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
