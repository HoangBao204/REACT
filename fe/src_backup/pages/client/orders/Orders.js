import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const STATUS_COLORS = {
  "Chờ xác nhận": "bg-yellow-100 text-yellow-800",
  "Đã xác nhận": "bg-purple-100 text-purple-800",
  "Đang giao": "bg-blue-100 text-blue-800",
  "Hoàn tất": "bg-green-100 text-green-800",
  "Đã hủy": "bg-red-100 text-red-800",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user.id) {
      toast.error("Bạn chưa đăng nhập. Vui lòng đăng nhập");
      setTimeout(() => {
        navigate("/login");
      }, 3000);

      return;
    }

    fetch(`http://localhost:3000/orders?userId=${user.id}`)
      .then((res) => res.json())
      .then(setOrders)
      .catch((err) => console.error("Lỗi load orders:", err));
  }, [user?.id]);

  const filteredOrders = orders.filter((order) => {
    const matchStatus = filter === "Tất cả" || order.status === filter;
    const matchSearch =
      order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.title_product.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của bạn</h1>

      {/* Bộ lọc + Tìm kiếm */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>Tất cả</option>
          <option>Chờ xác nhận</option>
          <option>Đã xác nhận</option>
          <option>Đang giao</option>
          <option>Hoàn tất</option>
          <option>Đã hủy</option>
        </select>

        <input
          type="text"
          placeholder="Tìm theo tên người nhận hoặc sản phẩm..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full md:w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Danh sách đơn */}
      {filteredOrders.length === 0 ? (
        <p className="text-gray-500">Không có đơn hàng nào.</p>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order, index) => (
            <div key={order.id}>
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <p className="text-sm text-gray-500">
                      Mã đơn: <span className="font-medium">{order.id}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Ngày đặt:{" "}
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      STATUS_COLORS[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="mt-4 divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 flex gap-4 items-center">
                      <img
                        src={item.img_product}
                        alt={item.title_product}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.title_product}</p>
                        <p className="text-sm text-gray-500">
                          x {item.quantity} &bull;{" "}
                          {Number(item.total_price).toLocaleString("vi-VN")} ₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tổng + Chi tiết */}
                <div className="flex flex-col items-end mt-4 space-y-1">
                  <p className="font-bold text-red-600">
                    Tổng: {order.total.toLocaleString("vi-VN")} ₫
                  </p>
                  <button
                    className="text-sm font-medium text-blue-600 hover:underline"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    Xem chi tiết →
                  </button>
                </div>
              </div>

              {/* Đường kẻ giữa các đơn */}
              {index < filteredOrders.length - 1 && (
                <hr className="my-6 border-t border-gray-200" />
              )}
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Orders;
