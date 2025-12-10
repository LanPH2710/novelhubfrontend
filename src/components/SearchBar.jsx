import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 sm:mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search novels..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm hover:bg-indigo-700"
        >
          Search
        </button>
      </div>
    </form>
  );
}
