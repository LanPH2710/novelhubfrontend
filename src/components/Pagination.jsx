export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
        >
          Prev
        </button>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded ${
            page === currentPage
              ? 'bg-primary text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
        >
          Next
        </button>
      )}
    </div>
  );
}
