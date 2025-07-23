import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Component Header nhận các props: userEmail, setUserEmail và role
const Header = ({ userEmail, setUserEmail, role }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false); // Trạng thái để kiểm soát hiển thị của menu thả xuống cho người dùng
  const [searchTerm, setSearchTerm] = useState(''); // Trạng thái để giữ giá trị tìm kiếm từ ô nhập
  const [searchResults, setSearchResults] = useState([]); // Trạng thái để lưu trữ kết quả tìm kiếm
  const [searchDropdownVisible, setSearchDropdownVisible] = useState(false); // Trạng thái để kiểm soát hiển thị của menu thả xuống kết quả tìm kiếm
  const navigate = useNavigate(); // Hook từ react-router-dom để điều hướng chương trình

  // Hàm chuyển đổi hiển thị menu thả xuống cho người dùng
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    setUserEmail(''); // Xóa trạng thái userEmail
    localStorage.removeItem('userEmail'); // Xóa email khỏi localStorage
    alert('Bạn đã đăng xuất thành công'); // Hiển thị thông báo thành công
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setSearchDropdownVisible(false); // Ẩn menu thả xuống kết quả tìm kiếm nếu ô nhập trống
      return;
    }

    try {
      const response = await fetch(`https://www.loqlarchlinuxserver.xyz/yesking/search?q=${searchTerm}`); // Gửi yêu cầu tìm kiếm đến API
      const data = await response.json(); // Chuyển đổi phản hồi thành JSON
      setSearchResults(data.products); // Lưu kết quả tìm kiếm vào trạng thái
      setSearchDropdownVisible(true); // Hiển thị menu thả xuống kết quả tìm kiếm
    } catch (error) {
      console.error('Lỗi khi lấy kết quả tìm kiếm:', error); // Xử lý lỗi nếu có
      setSearchDropdownVisible(false); // Ẩn menu thả xuống kết quả tìm kiếm nếu có lỗi
    }
  };

  // Hàm xử lý thay đổi ô nhập tìm kiếm
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value); // Cập nhật trạng thái searchTerm
    if (e.target.value.trim() === '') {
      setSearchDropdownVisible(false); // Ẩn menu thả xuống nếu ô nhập trống
    } else {
      handleSearch(); // Thực hiện tìm kiếm
    }
  };

  // Hàm xử lý nhấn phím Enter trong ô nhập tìm kiếm
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      navigate(`/shop/${searchTerm}`); // Điều hướng đến trang shop với từ khóa tìm kiếm
    }
  };
  const images = [
    "/img/v3.1.webp",
    "/img/v4.1.webp",
  
  ];

  return (

    <div className="sticky top-0 bg-white z-50">
      <header className="px-4 md:px-12 py-4 flex flex-col md:flex-row justify-between items-center border">
        <div className="text-xl md:text-2xl font-bold mb-2 md:mb-0">
          <Link to="/">6TL</Link>
        </div>
        <nav className="mb-2 md:mb-0">
          <ul className="flex space-x-4 md:space-x-6 items-center text-sm md:text-base">
            <li>
              <Link to="/" className="flex items-center space-x-2 hover:text-yellow-400 transition-colors">
                <i className="fa-solid fa-house"></i>
                <span>Trang chủ</span>
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-yellow-400 transition-colors">Cửa hàng</Link>
            </li>
            {/*  */}
            <li className="relative group">
                <Link to="/nam" className="hover:text-yellow-400 transition-colors">
                  Nam/Nữ
                </Link>
                {/* Menu hiển thị khi hover */}
                <div className="absolute left-0 top-4 mt-2 w-64 bg-white shadow-lg border hidden group-hover:block">
                  <div className="p-4">
                    <div className="new">
                      <h3 className="font-bold">MỚI & XU HƯỚNG</h3>
                      <p><a href="/">Hàng mới về</a></p>
                      <p><a href="/">Hàng sắp về</a></p>
                      <p><a href="/">Top bán chạy</a></p>
                    </div>
                    <div className="new mt-4">
                      <h3 className="font-bold">QUẦN ÁO</h3>
                      <p><Link to="/shop/1" className="">Áo khoác</Link></p>
                      <p><Link to="/shop/2" className="">Quần jean</Link></p>
                      <p><Link to="/shop/3" className="">Đồ bộ</Link></p>
                      
                    </div>
                    <div className="flex gap-2 mt-4">
                      <img src={images[0]} alt="" className="w-24 h-24 object-cover" />
                      <img src={images[1]} alt="" className="w-24 h-24 object-cover" />
                    </div>
                  </div>
                </div>
        </li>

            {/*  */}
          
            <li>
              <Link to="/contact" className="hover:text-yellow-400 transition-colors">Liên hệ</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-yellow-400 transition-colors">Giới thiệu</Link>
            </li>
          </ul>
        </nav>
        <div className="search-container flex items-center space-x-2 relative md:mt-0 mt-4">
          <div className="relative flex items-center w-full">
            <input
              type="text"
              className="border rounded-full px-4 py-2 focus:ring-0 focus:outline-none bg-transparent pl-10 text-sm md:text-base"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <i className="fa-solid fa-magnifying-glass absolute left-4 cursor-pointer" onClick={handleSearch}></i>
            {searchDropdownVisible && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border rounded-lg shadow-lg py-2 z-50">
                <ul>
                  {searchResults.map((product) => (
                    <li key={product.id} className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-4">
                      <img src={"/img/" + product.img} alt={product.name} className="w-12 h-12 object-cover" />
                      <Link to={`/product/${product.id}`} onClick={() => setSearchDropdownVisible(false)}>
                        {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Link to="/cart" className="border rounded-full px-3 py-3 flex items-center space-x-2">
            <i className="fa-solid fa-cart-shopping"></i>
          </Link>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="border rounded-full px-3.5 py-3 flex items-center space-x-2"
            >
              <i className="fa-solid fa-user"></i>
            </button>
            {dropdownVisible && (
              <div className="absolute right-0 mt-3 w-48 bg-white border rounded-lg shadow-lg py-2">
                <div className="absolute right-4 -top-2 w-4 h-4 bg-white border-t border-l border-gray-300 rotate-45"></div>
                {userEmail ? (
                  <>
                    <a className="block px-4 py-2 hover:bg-gray-100">
                      {userEmail}
                    </a>
                    <Link to="/order-history" className="block px-4 py-2 hover:bg-gray-100">
                      Lịch sử đơn hàng
                    </Link>
                    <a className="block text-red-400 px-4 py-2 hover:bg-gray-100" onClick={handleLogout}>
                      Đăng xuất
                    </a>
                  </>
                ) : (
                  <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">
                    Đăng nhập
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </div>

  );
};

export default Header;
