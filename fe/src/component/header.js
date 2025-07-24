import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ userEmail, setUserEmail, role }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false); // Trạng thái để kiểm soát hiển thị của menu thả xuống cho người dùng
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái để giữ giá trị tìm kiếm từ ô nhập
  const [searchResults, setSearchResults] = useState([]); // Trạng thái để lưu trữ kết quả tìm kiếm
  const [searchDropdownVisible, setSearchDropdownVisible] = useState(false); // Trạng thái để kiểm soát hiển thị của menu thả xuống kết quả tìm kiếm
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate(); // Hook từ react-router-dom để điều hướng chương trình

  // Hàm chuyển đổi hiển thị menu thả xuống cho người dùng
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    setUserEmail(""); // Xóa trạng thái userEmail
    localStorage.removeItem("userEmail"); // Xóa email khỏi localStorage
    alert("Bạn đã đăng xuất thành công"); // Hiển thị thông báo thành công
  };

  // // Hàm xử lý tìm kiếm
  // const handleSearch = async () => {
  //   if (searchTerm.trim() === "") {
  //     setSearchDropdownVisible(false); // Ẩn menu thả xuống kết quả tìm kiếm nếu ô nhập trống
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `http://localhost:3001/search?q=${searchTerm}`
  //     ); // Gửi yêu cầu tìm kiếm đến API
  //     const data = await response.json(); // Chuyển đổi phản hồi thành JSON
  //     setSearchResults(data.products); // Lưu kết quả tìm kiếm vào trạng thái
  //     setSearchDropdownVisible(true); // Hiển thị menu thả xuống kết quả tìm kiếm
  //   } catch (error) {
  //     console.error("Lỗi khi lấy kết quả tìm kiếm:", error); // Xử lý lỗi nếu có
  //     setSearchDropdownVisible(false); // Ẩn menu thả xuống kết quả tìm kiếm nếu có lỗi
  //   }
  // };

  // // Hàm xử lý thay đổi ô nhập tìm kiếm
  // const handleInputChange = (e) => {
  //   setSearchTerm(e.target.value); // Cập nhật trạng thái searchTerm
  //   if (e.target.value.trim() === "") {
  //     setSearchDropdownVisible(false); // Ẩn menu thả xuống nếu ô nhập trống
  //   } else {
  //     handleSearch(); // Thực hiện tìm kiếm
  //   }
  // };

  // // Hàm xử lý nhấn phím Enter trong ô nhập tìm kiếm
  // const handleKeyPress = (e) => {
  //   if (e.key === "Enter") {
  //     navigate(`/shop/${searchTerm}`); // Điều hướng đến trang shop với từ khóa tìm kiếm
  //   }
  // };
  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      setSearchDropdownVisible(false);
      return;
    }

    // Làm sạch chuỗi tìm kiếm: xóa từ "giá", "dưới", "khoảng" nếu muốn
    const cleanedTerm = searchTerm
      .toLowerCase()
      .replace(/giá|dưới|khoảng/g, "")
      .trim();

    try {
      const response = await fetch(
        `http://localhost:3001/search?q=${encodeURIComponent(
          cleanedTerm
        )}`
      );
      const data = await response.json();
      setSearchResults(data.products);
      setSearchDropdownVisible(true);
    } catch (error) {
      console.error("Lỗi khi lấy kết quả tìm kiếm:", error);
      setSearchDropdownVisible(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === "") {
      setSearchDropdownVisible(false);
    } else {
      handleSearch();
    }
  };

const handleKeyPress = (e) => {
  if (e.key === "Enter") {
    const cleanedTerm = searchTerm.toLowerCase().replace(/giá|dưới|khoảng/g, "").trim();
    if (cleanedTerm === "") {
      e.preventDefault();
      setSearchDropdownVisible(false);
      return;
    }
    navigate(`/shop?search=${encodeURIComponent(cleanedTerm)}&page=1`);
    setSearchDropdownVisible(false);
  }
};


  const user = JSON.parse(sessionStorage.getItem("user"));
  const images = ["/img/v3.1.webp", "/img/v4.1.webp"];

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
          {/* Search Bar */}
          <div className="relative flex items-center w-full">
             <input
              type="text"
              placeholder="Tìm 'áo 300k', 'váy dưới 500k'..."
              value={searchTerm}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="border rounded-full px-4 py-2 pl-10 text-sm focus:outline-none bg-transparent"
            />
            <i
              className="fa-solid fa-magnifying-glass absolute left-4 cursor-pointer"
              onClick={handleSearch}
            ></i>
            {searchDropdownVisible && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border rounded-lg shadow-lg py-2 z-50">
                <ul>
                  {searchResults.map((product) => (
                    <li
                      key={product.id}
                      className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-4"
                    >
                      <img
                        src={"/img/" + product.img}
                        alt={product.name}
                        className="w-12 h-12 object-cover"
                      />
                      <Link
                        to={`/product/${product.id}`}
                        onClick={() => setSearchDropdownVisible(false)}
                      >
                        {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
    </div>
  );
};

export default Header;
