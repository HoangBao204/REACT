import React from "react";

const images = [
  "/img/dmca.png",
  "/img/bocongthuong.png",
  "/img/bancode.png",
  "/img/googleplay.png",
  "/img/appstore.png",
  "/img/tien.png",
  "/img/zalo.png"
];

const Footer = () => {
  return (
    <footer className="bg-white py-12 ml border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Cột 1 - Thông tin công ty */}
          <div>
            <h3 className="text-lg font-bold text-gray-900">CÔNG TY CỔ PHẦN 6TL</h3>
            <p className="text-sm text-gray-600 mt-2">
              Số ĐKKD: 0107574310, ngày cấp: 23/09/2016, nơi cấp: Sở Kế hoạch và đầu tư Hà Nội.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Địa chỉ trụ sở: 688 Đường Quang Trung, Phường La Khê, Quận Hà Đông, Thành phố Hà Nội.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Điện thoại: +8424 - 7303.0222
            </p>
            <p className="text-sm text-gray-600">Email: hello@canifa.com</p>

            {/* Mạng xã hội */}
            <div className="flex space-x-4 mt-4">
              <a href="/#" className="text-gray-500 hover:text-gray-700">
                <i className="fab fa-facebook text-2xl"></i>
              </a>
              <a href="/#" className="text-gray-500 hover:text-gray-700">
                <i className="fab fa-instagram text-2xl"></i>
              </a>
              <a href="/#" className="text-gray-500 hover:text-gray-700">
                <i className="fab fa-youtube text-2xl"></i>
              </a>
              <a href="/#" className="text-gray-500 hover:text-gray-700">
                <i className="fab fa-tiktok text-2xl"></i>
              </a>
            </div>
          </div>

          {/* Cột 2 - Thương hiệu */}
          <div>
            <h3 className="text-lg font-bold text-gray-900">THƯƠNG HIỆU</h3>
            <ul className="mt-2 space-y-2 text-gray-600">
              <li><a href="/#" className="hover:text-gray-900">Giới thiệu</a></li>
              <li><a href="/#" className="hover:text-gray-900">Tin tức</a></li>
              <li><a href="/#" className="hover:text-gray-900">Tuyển dụng</a></li>
              <li><a href="/#" className="hover:text-gray-900">Với cộng đồng</a></li>
              <li><a href="/#" className="hover:text-gray-900">Hệ thống cửa hàng</a></li>
              <li><a href="/#" className="hover:text-gray-900">Liên hệ</a></li>
            </ul>
          </div>

          {/* Cột 3 - Hỗ trợ */}
          <div>
            <h3 className="text-lg font-bold text-gray-900">HỖ TRỢ</h3>
            <ul className="mt-2 space-y-2 text-gray-600">
              <li><a href="/#" className="hover:text-gray-900">Hỏi đáp</a></li>
              <li><a href="/#" className="hover:text-gray-900">Chính sách KHTT</a></li>
              <li><a href="/#" className="hover:text-gray-900">Điều khoản Chính sách KHTT</a></li>
              <li><a href="/#" className="hover:text-gray-900">Chính sách vận chuyển</a></li>
              <li><a href="/#" className="hover:text-gray-900">Kiểm tra đơn hàng</a></li>
              <li><a href="/#" className="hover:text-gray-900">Chính sách bảo mật thông tin KH</a></li>
            </ul>
          </div>

          {/* Cột 4 - Ứng dụng và thanh toán */}
          <div>
            <h3 className="text-lg font-bold text-gray-900">TẢI ỨNG DỤNG</h3>
            <div className="flex space-x-2 mt-2">
              <img src={images[2]} alt="QR Code" className="w-20 h-20" />
              <div>
                <a href="/#">
                  <img src={images[3]} alt="Google Play" className="w-32" />
                </a>
                <a href="/#" className="mt-2 block">
                  <img src={images[4]} alt="App Store" className="w-32" />
                </a>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mt-2">PHƯƠNG THỨC THANH TOÁN</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <img src={images[6]} alt="" className="w-12 h-8" />
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-600">&copy; 2025 6TL</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <img src={images[0]} alt="DMCA Protected" className="w-24" />
            <img src={images[1]} alt="Bộ Công Thương" className="w-24" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: repeat(2, 1fr); /* Chia thành 2 cột ở chế độ mobile */
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;