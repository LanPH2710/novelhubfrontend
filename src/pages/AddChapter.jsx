import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chapterAPI } from '@/api/client';
import Navbar from '@/components/Navbar';
import RichTextEditor from '@/components/RichTextEditor';

export default function AddChapter() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [chapterNumber, setChapterNumber] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await chapterAPI.createChapter({
        storyId,
        chapterNumber: parseInt(chapterNumber),
        title,
        content
      });
      navigate(`/story/${storyId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create chapter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Add New Chapter</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">
                  Chapter Number
                </label>
                <input
                  type="number"
                  value={chapterNumber}
                  onChange={(e) => setChapterNumber(e.target.value)}
                  required
                  min="1"
                  className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">
                Content
              </label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your chapter content here. Use the toolbar above to format text."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-2 sm:py-3 px-4 rounded-lg text-sm sm:text-base disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Chapter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
