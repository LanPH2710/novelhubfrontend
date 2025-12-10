export default function StoryCard({ story }) {
  return (
    <a
      href={`/story/${story._id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
    >
      <div className="h-40 sm:h-48 lg:h-64 bg-gray-200 overflow-hidden">
        {story.coverUrl ? (
          <img
            src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${story.coverUrl}`}
            alt={story.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white text-2xl sm:text-3xl lg:text-4xl">
            📖
          </div>
        )}
      </div>
      <div className="p-2 sm:p-3 lg:p-4">
        <h3 className="font-bold text-xs sm:text-sm lg:text-lg truncate">{story.title}</h3>
        <p className="text-gray-600 text-xs mb-1 sm:mb-2">{story.author}</p>
        <p className="text-gray-500 text-xs mb-2 sm:mb-3 line-clamp-2">{story.summary}</p>
        <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
          <span className={`px-2 py-1 rounded ${story.status === 'full' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
            {story.status}
          </span>
          <span className="text-gray-600 truncate">{story.chaptersCount} ch</span>
        </div>
      </div>
    </a>
  );
}
