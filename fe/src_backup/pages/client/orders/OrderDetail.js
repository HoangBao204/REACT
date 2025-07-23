import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STATUS_COLORS = {
  "Chờ xác nhận": "bg-yellow-100 text-yellow-800",
  "Đã xác nhận": "bg-purple-100 text-purple-800",
  "Đang giao": "bg-blue-100 text-blue-800",
  "Hoàn tất": "bg-green-100 text-green-800",
  "Đã hủy": "bg-red-100 text-red-800",
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user] = useState(() => JSON.parse(sessionStorage.getItem("user")));

  useEffect(() => {
    fetch(`http://localhost:3000/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!user || data.userId !== user.id) {
          toast.error("Bạn không có quyền xem đơn hàng này.");
          navigate("/orders");
        } else {
          setOrder(data);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
        toast.error("Không thể tải đơn hàng.");
      })
      .finally(() => setLoading(false));
  }, [id, navigate, user]);

  const handleCancelOrder = () => {
    if (!order) return;

    if (order.status === "Chờ xác nhận") {
      fetch(`http://localhost:3000/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Đã hủy" }),
      })
        .then((res) => res.json())
        .then((updated) => {
          setOrder(updated);
          toast.success("Đơn hàng đã được hủy thành công!");
        })
        .catch(() => toast.error("Có lỗi xảy ra khi hủy đơn hàng."));
    } else if (order.status === "Đã hủy") {
      toast.info("Đơn hàng này đã bị hủy trước đó.");
    } else {
      toast.warning("Đơn hàng không thể hủy ở trạng thái hiện tại.");
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">Đang tải đơn hàng...</p>
    );
  }

  if (!order) {
    return (
      <p className="text-center mt-10 text-red-500">
        Không tìm thấy đơn hàng hoặc bạn không có quyền truy cập.
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <ToastContainer />
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline text-sm"
      >
        ← Quay lại
      </button>

      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Chi tiết đơn hàng #{order.id}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Danh sách sản phẩm bên trái (2/3) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </p>
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold ${
                STATUS_COLORS[order.status]
              }`}
            >
              {order.status}
            </span>
          </div>

          <h2 className="text-lg font-semibold">Sản phẩm</h2>
          <div className="divide-y divide-gray-200">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center gap-4">
                <img
                  src={item.img_product}
                  alt={item.title_product}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {item.title_product}
                  </p>
                  <p className="text-sm text-gray-500">
                    Số lượng: {item.quantity} | Giá:{" "}
                    {Number(item.total_price).toLocaleString("vi-VN")} ₫
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <p className="text-xl font-bold text-red-600">
              Tổng cộng: {order.total.toLocaleString("vi-VN")} ₫
            </p>
            <button
              onClick={handleCancelOrder}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                order.status === "Đã hủy"
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
              disabled={order.status === "Đã hủy"}
            >
              {order.status === "Đã hủy" ? "Đã hủy" : "Hủy đơn hàng"}
            </button>
          </div>
        </div>

        {/* Thông tin người nhận bên phải (1/3) */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
            📦 Thông tin người nhận
          </h2>

          <div className="text-sm space-y-4 text-gray-700">
            <p>
              <span className="font-semibold text-base text-gray-900 ">
                Họ tên:
              </span>{" "}
              <span className="text-red-500">{order.fullName}</span>
            </p>
            <p>
              <span className="font-semibold text-base text-gray-900">
                SĐT:
              </span>{" "}
              {order.phone}
            </p>
            <p>
              <span className="font-semibold text-base text-gray-900">
                Email:
              </span>{" "}
              {order.email}
            </p>
            <p>
              <span className="font-semibold text-base text-gray-900">
                Địa chỉ:
              </span>{" "}
              {order.address}
            </p>
            <p>
              <span className="font-semibold text-base text-gray-900">
                Ghi chú:
              </span>{" "}
              {order.note || "Không có"}
            </p>
            <p>
              <span className="font-semibold text-base text-gray-900">
                Phương thức thanh toán:
              </span>{" "}
              {order.paymentMethod === "online" ? "Online" : "COD"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
