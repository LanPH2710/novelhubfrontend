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
              📖 Novel Hub by Bear
            </a>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4">
            <a href="/" className="text-gray-600 hover:text-primary text-sm">
              Trang chủ
            </a>
            <a href="/history" className="text-gray-600 hover:text-primary text-sm">
              Lịch sử
            </a>
            {isAdmin && (
              <>
                <a href="/dashboard" className="text-gray-600 hover:text-primary text-sm">
                  Bảng điều khiển
                </a>
                <a href="/add-story" className="text-gray-600 hover:text-primary text-sm">
                  Thêm truyện
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
                  Đăng xuất
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="bg-primary hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
              >
                Đăng nhập
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
                Đăng xuất
              </button>
            ) : (
              <a
                href="/login"
                className="bg-primary hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
              >
                Đăng nhập
              </a>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-50 border-t py-2">
            <a href="/" className="block px-4 py-2 text-gray-600 hover:text-primary text-sm">
              Trang chủ
            </a>
            <a href="/history" className="block px-4 py-2 text-gray-600 hover:text-primary text-sm">
              Lịch sử
            </a>
            {isAdmin && (
              <>
                <a href="/dashboard" className="block px-4 py-2 text-gray-600 hover:text-primary text-sm">
                  Bảng điều khiển
                </a>
                <a href="/add-story" className="block px-4 py-2 text-gray-600 hover:text-primary text-sm">
                  Thêm truyện
                </a>
              </>
            )}
            {user.username && <div className="px-4 py-2 text-sm text-gray-600">Đăng nhập với tư {user.username}</div>}
          </div>
        )}
      </div>
    </nav>
  );
}
