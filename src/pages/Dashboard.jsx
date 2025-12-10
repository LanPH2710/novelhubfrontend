import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storyAPI } from '@/api/client';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchStories();
  }, [navigate]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await storyAPI.getStories(1, 100);
      setStories(response.data.stories);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (id) => {
    if (!confirm('Are you sure you want to delete this story?')) return;

    try {
      await storyAPI.deleteStory(id);
      setStories(stories.filter(story => story._id !== id));
    } catch (error) {
      console.error('Failed to delete story:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <a
            href="/add-story"
            className="bg-primary hover:bg-indigo-700 text-white font-bold py-2 px-4 sm:px-6 rounded text-sm sm:text-base whitespace-nowrap"
          >
            + Add Story
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-sm text-gray-600">Loading...</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <div className="inline-block min-w-full">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-semibold text-xs sm:text-sm">Title</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-semibold text-xs sm:text-sm hidden sm:table-cell">Author</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-semibold text-xs sm:text-sm">Ch</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-semibold text-xs sm:text-sm">Status</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left font-semibold text-xs sm:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stories.map((story) => (
                    <tr key={story._id} className="border-b hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-2 sm:py-4 font-semibold text-xs sm:text-sm truncate">{story.title}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm hidden sm:table-cell">{story.author}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm">{story.chaptersCount}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          story.status === 'full' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {story.status === 'full' ? '✓' : '◐'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4">
                        <div className="flex gap-1 sm:gap-2 flex-wrap">
                          <a
                            href={`/story/${story._id}`}
                            className="text-blue-600 hover:underline text-xs"
                            title="View Story"
                          >
                            V
                          </a>
                          <a
                            href={`/edit-story/${story._id}`}
                            className="text-green-600 hover:underline text-xs"
                            title="Edit Story"
                          >
                            E
                          </a>
                          <a
                            href={`/add-chapter/${story._id}`}
                            className="text-blue-600 hover:underline text-xs"
                            title="Add Chapter"
                          >
                            +
                          </a>
                          <button
                            onClick={() => handleDeleteStory(story._id)}
                            className="text-red-600 hover:underline text-xs"
                            title="Delete Story"
                          >
                            ×
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {stories.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-600 mb-4 text-sm">No stories yet</p>
                <a
                  href="/add-story"
                  className="text-primary hover:underline text-sm"
                >
                  Create your first story
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
