import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedItems = location.state?.selectedItems || [];
  const totalPrice = location.state?.totalPrice || 0;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    note: "",
    paymentMethod: "cod",
  });

  const [addressSuggestions, setAddressSuggestions] = useState([]);

  useEffect(() => {
    if (formData.address.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          formData.address
        )}&format=json&addressdetails=1&limit=5`
      )
        .then((res) => res.json())
        .then((data) => {
          setAddressSuggestions(data);
        })
        .catch((err) => {
          console.error("Lỗi lấy gợi ý địa chỉ:", err);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.address]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddressSelect = (display_name) => {
    setFormData((prev) => ({ ...prev, address: display_name }));
    setAddressSuggestions([]);
  };

  const handleReturnToCart = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (!user || !user.id) {
        toast.error("Không thể xác định người dùng.");
        return;
      }

      for (const item of selectedItems) {
        await fetch(`http://localhost:3000/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...item, userId: user.id }),
        });
      }

      toast.success("Đã chuyển lại sản phẩm vào giỏ hàng.");
      navigate("/cart");
    } catch (err) {
      console.error("Lỗi quay lại giỏ hàng:", err);
      toast.error("Quay lại giỏ hàng thất bại.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.city
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (!user || !user.id) {
        toast.error("Không thể xác định người dùng. Vui lòng đăng nhập.");
        return;
      }

      const newOrder = {
        userId: user.id,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        note: formData.note,
        paymentMethod: formData.paymentMethod,
        status: "Chờ xác nhận",
        items: selectedItems,
        total: Number(totalPrice),
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) throw new Error("Lỗi tạo đơn hàng");

      // Xoá item khỏi giỏ hàng và khỏi API /checkout
      for (const item of selectedItems) {
        await fetch(`http://localhost:3000/cart/${item.id}`, {
          method: "DELETE",
        });

        await fetch(`http://localhost:3000/checkout/${item.id}`, {
          method: "DELETE",
        });
      }

      toast.success("Đặt hàng thành công!");
      setTimeout(() => navigate("/orders"), 2000);
    } catch (error) {
      console.error("Lỗi khi gửi đơn hàng:", error);
      toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="bg-white text-black font-sans">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-6">Thanh toán</h1>
        <form
          className="flex flex-col md:flex-row gap-6"
          onSubmit={handleSubmit}
        >
          {/* Tóm tắt đơn hàng */}
          <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-xl shadow-md order-2 md:order-1">
            <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>
            {selectedItems.length === 0 ? (
              <p className="text-sm text-gray-500">Không có sản phẩm nào.</p>
            ) : (
              <div className="text-sm space-y-3">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.img_product}
                      alt={item.title_product}
                      className="w-14 h-14 object-cover rounded-md border"
                    />
                    <div className="flex-1">
                      <p className="font-medium">
                        {item.title_product}
                        <br />
                        <span className="text-xs text-gray-500">
                          ({Number(item.price_product).toLocaleString("vi-VN")}{" "}
                          đ)
                        </span>
                      </p>
                      <p className="text-gray-600 text-xs">x {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-black whitespace-nowrap">
                      {Number(item.total_price).toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t pt-3 text-red-600">
                  <span>Tổng cộng</span>
                  <span>{Number(totalPrice).toLocaleString("vi-VN")} ₫</span>
                </div>
              </div>
            )}
          </div>

          {/* Thông tin người nhận */}
          <div className="w-full md:w-2/3 order-1 md:order-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="fullName" className="text-sm font-medium mb-1">
                  Họ và tên*
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone" className="text-sm font-medium mb-1">
                  Số điện thoại*
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="city" className="text-sm font-medium mb-1">
                  Tỉnh/Thành phố*
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="VD: Hà Nội, TP.HCM..."
                  value={formData.city}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col relative">
                <label htmlFor="address" className="text-sm font-medium mb-1">
                  Địa chỉ nhận hàng*
                </label>
                <input
                  id="address"
                  type="text"
                  placeholder="Nhập địa chỉ cụ thể"
                  value={formData.address}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
                  autoComplete="off"
                />
                {addressSuggestions.length > 0 && (
                  <ul className="absolute z-10 top-full left-0 right-0 bg-white border rounded-md mt-1 max-h-60 overflow-y-auto shadow-md text-sm">
                    {addressSuggestions.map((sug) => (
                      <li
                        key={sug.place_id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleAddressSelect(sug.display_name)}
                      >
                        {sug.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col">
                <label htmlFor="note" className="text-sm font-medium mb-1">
                  Ghi chú (tuỳ chọn)
                </label>
                <textarea
                  id="note"
                  rows="3"
                  placeholder="Ghi chú thêm cho đơn hàng..."
                  value={formData.note}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium mb-2 block">
                Phương thức thanh toán
              </label>
              <div className="flex flex-col gap-2 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={() =>
                      setFormData({ ...formData, paymentMethod: "cod" })
                    }
                  />
                  Thanh toán khi nhận hàng (COD)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === "online"}
                    onChange={() =>
                      setFormData({ ...formData, paymentMethod: "online" })
                    }
                  />
                  Thanh toán online
                </label>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mt-4">
              <button
                type="button"
                className="bg-gray-200 text-black rounded-full px-8 py-3 text-sm font-medium hover:bg-gray-300 transition w-full md:w-fit"
                onClick={handleReturnToCart}
              >
                Quay lại giỏ hàng
              </button>

              <button
                type="submit"
                className="bg-black text-white rounded-full px-10 py-3 text-sm font-medium hover:bg-gray-900 transition w-full md:w-fit"
              >
                Xác nhận đặt hàng
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Checkout;
