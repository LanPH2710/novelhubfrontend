import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chapterAPI } from '@/api/client';
import Navbar from '@/components/Navbar';
import RichTextEditor from '@/components/RichTextEditor';

export default function EditChapter() {
  const { storyId, chapterNumber } = useParams();
  const navigate = useNavigate();
  const [chapterNum, setChapterNum] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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
    fetchChapter();
  }, [navigate, storyId, chapterNumber]);

  const fetchChapter = async () => {
    try {
      setLoading(true);
      const response = await chapterAPI.getChapterByNumber(storyId, chapterNumber);
      const chapter = response.data.chapter || response.data; // support both shapes
      setChapterNum(chapter.chapterNumber);
      setTitle(chapter.title);
      setContent(chapter.content);
    } catch (err) {
      setError('Failed to load chapter');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setSaving(true);

    try {
      await chapterAPI.updateChapter(storyId, chapterNumber, {
        chapterNumber: parseInt(chapterNum),
        title,
        content
      });
      setSuccessMessage('Chapter updated successfully!');
      setTimeout(() => {
        navigate(`/story/${storyId}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update chapter');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-sm text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Edit Chapter {chapterNumber}</h1>

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">
                  Chapter Number
                </label>
                <input
                  type="number"
                  value={chapterNum}
                  onChange={(e) => setChapterNum(e.target.value)}
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
                placeholder="Edit your chapter content here."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/story/${storyId}`)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
