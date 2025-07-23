import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    setIsSearchOpen(false);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmLogout) {
      sessionStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="relative flex flex-col">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 z-50 overflow-y-auto ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <span className="text-sm font-medium">Đóng</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-xl text-black"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <ul className="p-4 space-y-4 text-lg font-medium text-black">
          <li>
            <Link
              to="/about"
              className="hover:text-yellow-600 transition-colors"
            >
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="hover:text-yellow-600 transition-colors"
            >
              Liên hệ
            </Link>
          </li>
          <li>
            <Link to="/faq" className="hover:text-yellow-600 transition-colors">
              Câu hỏi thường gặp
            </Link>
          </li>
          <li>
            <Link
              to="/policy/privacy"
              className="hover:text-yellow-600 transition-colors"
            >
              Chính sách bảo mật
            </Link>
          </li>
          <li>
            <Link
              to="/policy/terms"
              className="hover:text-yellow-600 transition-colors"
            >
              Điều khoản sử dụng
            </Link>
          </li>
          <li>
            <Link
              to="/returns"
              className="hover:text-yellow-600 transition-colors"
            >
              Chính sách đổi trả
            </Link>
          </li>
          <li>
            <Link
              to="/shipping"
              className="hover:text-yellow-600 transition-colors"
            >
              Giao hàng & Thanh toán
            </Link>
          </li>
          <li>
            <Link
              to="/store-locator"
              className="hover:text-yellow-600 transition-colors"
            >
              Hệ thống cửa hàng
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 md:px-10 h-16 border-b border-gray-200 bg-white z-10 relative">
        <div className="flex items-center space-x-4">
          <button
            aria-label="Menu"
            onClick={() => setIsMenuOpen(true)}
            className="text-black text-xl focus:outline-none"
          >
            <i className="fas fa-bars"></i>
          </button>
          <span className="text-base font-normal text-black select-none">
            Menu
          </span>
          <button
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-black text-lg focus:outline-none"
          >
            <i className="fas fa-search"></i>
          </button>
          <span className="text-base font-normal text-black select-none">
            Tìm kiếm
          </span>
        </div>

        <div className="text-center flex-1">
          <h1 className="font-bold text-2xl mt-4 tracking-widest select-none">
            <Link to="/">THE MODE</Link>
          </h1>
        </div>

        <div className="flex items-center space-x-4 text-black text-sm">
          <span className="select-none">Liên hệ với chúng tôi</span>

          <button aria-label="Favorites" className="text-xl focus:outline-none">
            <i className="far fa-heart"></i>
          </button>

          <Link
            to="/cart"
            className="hover:text-red-600 transition-colors"
            title="Giỏ hàng"
          >
            <i className="fas fa-shopping-cart text-lg"></i>
          </Link>

          <Link
            to="/orders"
            className="hover:text-red-600 transition-colors"
            title="Lịch sử đơn hàng"
          >
            <i className="fas fa-box text-lg"></i>
          </Link>

          {user ? (
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="text-xl text-red-600 hover:text-red-800 transition"
              title="Đăng xuất"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          ) : (
            <Link
              to="/login"
              className="text-xl hover:text-red-600"
              title="Đăng nhập"
            >
              <i className="far fa-user"></i>
            </Link>
          )}
        </div>
      </header>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow z-20 p-4 border-b">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 px-4"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 transition text-sm"
            >
              Tìm
            </button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="ml-2 text-gray-600 text-lg"
              title="Đóng"
            >
              <i className="fas fa-times"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Header;
