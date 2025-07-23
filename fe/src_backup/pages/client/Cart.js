import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowLeft, FaCreditCard } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user || !user.id) {
      toast.error("Bạn cần đăng nhập để xem giỏ hàng");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/cart", {
        params: { idUser: user.id },
      });
      setCartItems(res.data);
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
      toast.error("Không thể tải giỏ hàng");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const toggleItemSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + Number(item.total_price), 0);

  const handleQuantityChange = async (id, newQuantity, price) => {
    if (newQuantity < 1) return;

    try {
      await axios.patch(`http://localhost:3000/cart/${id}`, {
        quantity: newQuantity,
        total_price: newQuantity * price,
        updatedAt: new Date().toISOString(),
      });
      fetchCart();
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
      toast.error("Không thể cập nhật số lượng");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      await axios.delete(`http://localhost:3000/cart/${id}`);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      fetchCart();
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const handleCheckout = async () => {
    const selected = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );

    if (selected.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    const user = JSON.parse(sessionStorage.getItem("user"));

    try {
      // Tạo đơn hàng
      const res = await axios.post("http://localhost:3000/checkout", {
        userId: user.id,
        items: selected,
      });

      const orderId = res.data.id;

      // Xoá các sản phẩm khỏi giỏ hàng
      await Promise.all(
        selected.map((item) =>
          axios.delete(`http://localhost:3000/cart/${item.id}`)
        )
      );

      toast.success("Tạo đơn hàng thành công");
      navigate(`/checkout/${orderId}`, {
        state: {
          selectedItems: selected,
          totalPrice,
        },
      });
    } catch (error) {
      toast.error("Thanh toán thất bại");
      console.error(error);
    }
  };

  return (
    <div className="bg-[#f9f9f9] min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-black">
          🛒 Giỏ hàng của bạn
        </h2>

        <div className="space-y-6">
          {cartItems.length > 0 ? (
            cartItems.map((item) => {
              const price = Number(item.price_product);
              const total = price * item.quantity;

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 border-b pb-4 items-center"
                >
                  {/* Checkbox */}
                  <div className="md:col-span-1 flex justify-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="w-5 h-5 accent-yellow-500"
                    />
                  </div>

                  {/* Hình ảnh + Tên */}
                  <div className="md:col-span-3 flex items-center gap-4">
                    <img
                      src={item.img_product}
                      alt={item.title_product}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-black">
                        {item.title_product}
                      </h3>
                    </div>
                  </div>

                  {/* Đơn giá */}
                  <div className="md:col-span-2 text-sm text-gray-600">
                    {price.toLocaleString("vi-VN")} ₫
                  </div>

                  {/* Số lượng */}
                  <div className="md:col-span-3 flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1, price)
                      }
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-black font-bold"
                    >
                      -
                    </button>
                    <span className="min-w-[32px] text-center text-sm font-medium text-black">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1, price)
                      }
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-black font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Thành tiền */}
                  <div className="md:col-span-2 text-md font-semibold text-yellow-600">
                    {total.toLocaleString("vi-VN")} ₫
                  </div>

                  {/* Xóa */}
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">Giỏ hàng trống</p>
          )}
        </div>

        {/* Tổng cộng */}
        <div className="flex justify-between items-center mt-8 border-t pt-6">
          <span className="text-lg font-semibold text-black">Tổng cộng:</span>
          <span className="text-xl font-bold text-red-500">
            {Number(totalPrice).toLocaleString("vi-VN")} ₫
          </span>
        </div>

        {/* Nút hành động */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            to="/"
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-gray-800 to-black text-white font-semibold text-base hover:shadow-lg transition-all duration-300 active:scale-95"
          >
            <FaArrowLeft />
            Tiếp tục mua sắm
          </Link>

          <button
            onClick={handleCheckout}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold text-base hover:from-yellow-500 hover:to-yellow-600 hover:shadow-lg transition-all duration-300 active:scale-95"
          >
            <FaCreditCard />
            Thanh toán
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Cart;
