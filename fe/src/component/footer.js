import React from "react";

const Footer = () => {
  return (
    <>
      <div class="border-t border-gray-200">
        <div class="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-8">
          <div>
            <h3 class="text-xs font-semibold tracking-wide mb-4 uppercase">
              HỖ TRỢ
            </h3>
            <p class="mb-3 text-sm leading-relaxed">
              Quý khách có thể liên hệ với chúng tôi qua Hotline
              <a class="underline" href="tel:+842838614107">
                +84 2838614107
              </a>
              ,
              <a class="underline" href="#">
                Zalo
              </a>
              ,
              <a class="underline" href="mailto:">
                Email
              </a>
              , hoặc{" "}
              <a class="underline" href="#">
                các phương thức liên hệ khác.
              </a>
            </p>
            <p class="mb-3 text-sm leading-relaxed">Câu hỏi thường gặp</p>
            <p class="mb-3 text-sm leading-relaxed">Chăm sóc sản phẩm</p>
            <p class="mb-3 text-sm leading-relaxed">Cửa hàng</p>
          </div>
          <div>
            <h3 class="text-xs font-semibold tracking-wide mb-4 uppercase">
              DỊCH VỤ
            </h3>
            <p class="mb-3 text-sm leading-relaxed">Dịch vụ bảo hành</p>
            <p class="mb-3 text-sm leading-relaxed">Dịch vụ cá nhân hóa</p>
            <p class="mb-3 text-sm leading-relaxed">Nghệ thuật tặng quà</p>
            <p class="mb-3 text-sm leading-relaxed">
              Tải ứng dụng của chúng tôi
            </p>
          </div>
          <div>
            <h3 class="text-xs font-semibold tracking-wide mb-4 uppercase">
              VỀ THE MODE
            </h3>
            <p class="mb-3 text-sm leading-relaxed">
              Buổi trình diễn thời trang
            </p>
            <p class="mb-3 text-sm leading-relaxed">Nghệ thuật &amp; Văn hóa</p>
            <p class="mb-3 text-sm leading-relaxed">La Maison</p>
            <p class="mb-3 text-sm leading-relaxed">Phát triển bền vững</p>
            <p class="mb-3 text-sm leading-relaxed">Tin mới nhất</p>
            <p class="mb-3 text-sm leading-relaxed">Nghề nghiệp</p>
            <p class="mb-3 text-sm leading-relaxed">Foundation THE MODE</p>
          </div>
          <div>
            <h3 class="text-xs font-semibold tracking-wide mb-4 uppercase">
              KẾT NỐI VỚI CHÚNG TÔI
            </h3>
            <p class="mb-3 text-sm leading-relaxed">
              <a class="underline" href="#">
                Đăng ký{" "}
              </a>
              nhận thư điện tử để cập nhật những tin tức mới nhất từ Louis
              Vuitton, bao gồm các buổi ra mắt độc quyền trực tuyến và bộ sưu
              tập mới.
            </p>
            <p class="mb-3 text-sm leading-relaxed">Theo dõi chúng tôi</p>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-100 mt-10">
        <div class="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-6 flex flex-col sm:flex-row justify-between items-center text-sm">
          <div class="mb-4 sm:mb-0 flex items-center gap-2">
            <img
              alt="Vietnam flag with red background and yellow star"
              class="inline-block"
              height="14"
              src="https://storage.googleapis.com/a1aa/image/ee047965-546d-40a9-1aae-eada0dfa9f95.jpg"
              width="20"
            />
            <a class="underline" href="#">
              Việt Nam
            </a>
          </div>
          <div class="flex gap-8">
            <a class="hover:underline" href="#">
              Sơ đồ trang web
            </a>
            <a class="hover:underline" href="#">
              Pháp lý &amp; Quyền riêng tư
            </a>
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-6 flex justify-center">
        <h2 class="font-montserrat text-lg font-bold tracking-wide">
          THE MODE{" "}
        </h2>
      </div>
    </>
  );
};

export default Footer;
