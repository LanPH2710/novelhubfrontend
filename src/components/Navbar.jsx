import { useState } from 'react';
import '@/styles/index.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl sm:text-2xl font-bold text-primary">
              📖 NovelHub
            </a>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4">
            <a href="/" className="text-gray-600 hover:text-primary text-sm">
              Home
            </a>
            <a href="/history" className="text-gray-600 hover:text-primary text-sm">
              History
            </a>
            {isAdmin && (
              <>
                <a href="/dashboard" className="text-gray-600 hover:text-primary text-sm">
                  Dashboard
                </a>
                <a href="/add-story" className="text-gray-600 hover:text-primary text-sm">
                  Add Story
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-primary"
          >
            ☰
          </button>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {user.username ? (
              <>
                <span className="text-gray-600 text-sm">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="bg-primary hover:bg-indigo-700 text-white px-3 py-2 rounded text-sm"
              >
                Login
              </a>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center space-x-1">
            {user.username ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
              >
                Logout
              </button>
            ) : (
              <a
                href="/login"
                className="bg-primary hover:bg-indigo-700 text-white px-2 py-1 rounded text-xs"
              >
                Login
              </a>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-50 border-t py-2">
            <a href="/" className="block px-4 py-2 text-gray-600 hover:text-primary text-sm">
              Home
            </a>
            <a href="/history" className="block px-4 py-2 text-gray-600 hover:text-primary text-sm">
              History
            </a>
            {isAdmin && (
              <>
                <a href="/dashboard" className="block px-4 py-2 text-gray-600 hover:text-primary text-sm">
                  Dashboard
                </a>
                <a href="/add-story" className="block px-4 py-2 text-gray-600 hover:text-primary text-sm">
                  Add Story
                </a>
              </>
            )}
            {user.username && <div className="px-4 py-2 text-sm text-gray-600">Logged in as {user.username}</div>}
          </div>
        )}
      </div>
    </nav>
  );
}
