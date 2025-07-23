import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

const statusMap = {
  delivered: { text: "Đã giao", color: "bg-green-600" },
  pending: { text: "Chờ xử lý", color: "bg-orange-600" },
  cancelled: { text: "Đã hủy", color: "bg-red-600" },
  confirmed: { text: "Đã xác nhận", color: "bg-blue-400" },
  process: { text: "Đang xử lý", color: "bg-yellow-500" },
};

const UserManagement = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3002/api/ql_order");
      setOrders(res.data);
    } catch (err) {
      console.error("Lỗi gọi API:", err);
    }
  };

  

  const handleEdit = (order) => {
    setEditingOrder(order);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3001/api/ql_order/${editingOrder.id}`,
        editingOrder
      );
      setEditingOrder(null);
      fetchOrders();
    } catch (err) {
      console.error("Lỗi khi cập nhật đơn hàng:", err);
    }
  };

  const handleEditChange = (e) => {
    setEditingOrder({ ...editingOrder, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <section
        className={`flex-1 ${
          isSidebarOpen ? "ml-72" : "ml-20"
        } transition-all duration-300`}
      >
        <main className="p-6 bg-gray-100 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Quản lý người dùng</h1>
              <ul className="flex items-center text-gray-600">
                <li><a href="#">Quản lý người dùng</a></li>
                <li className="mx-2"><i className="bx bx-chevron-right"></i></li>
                <li><a href="#" className="text-blue-600">Trang chủ</a></li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Người đặt hàng gần đây</h3>
              <div className="flex items-center space-x-2">
                <i className="bx bx-search"></i>
                <i className="bx bx-filter"></i>
              </div>
            </div>

            <table className="w-full text-left border">
              <thead>
                <tr className="bg-gray-100 text-sm text-gray-700">
                  <th className="py-2 px-3 border-b">Người dùng</th>
                  <th className="py-2 px-3 border-b">Email</th>
                  <th className="py-2 px-3 border-b">Điện thoại</th>
                  <th className="py-2 px-3 border-b">Ngày đặt</th>
                  <th className="py-2 px-3 border-b">Trạng thái</th>
                  <th className="py-2 px-3 border-b">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 text-sm">
                    <td className="py-2 px-3">{order.name}</td>
                    <td className="py-2 px-3">{order.email}</td>
                    <td className="py-2 px-3">{order.phone}</td>
                    <td className="py-2 px-3">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-3 py-1 text-white rounded-full text-xs ${
                          statusMap[order.status]?.color || "bg-gray-400"
                        }`}
                      >
                        {statusMap[order.status]?.text || "Không xác định"}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => handleEdit(order)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2 text-xs"
                      >
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                Không có đơn hàng nào.
              </div>
            )}
          </div>

          {/* --- Form sửa --- */}
          {editingOrder && (
            <div className="mt-6 bg-white border p-4 rounded shadow">
              <h3 className="font-bold mb-4 text-lg text-blue-600">Sửa đơn hàng</h3>
              <form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={editingOrder.name}
                  onChange={handleEditChange}
                  placeholder="Tên người dùng"
                  className="border p-2 rounded"
                />
                <input
                  type="email"
                  name="email"
                  value={editingOrder.email}
                  onChange={handleEditChange}
                  placeholder="Email"
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="phone"
                  value={editingOrder.phone}
                  onChange={handleEditChange}
                  placeholder="Số điện thoại"
                  className="border p-2 rounded"
                />
                <input
                  type="date"
                  name="order_date"
                  value={editingOrder.order_date?.split("T")[0]}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                />
                <select
                  name="status"
                  value={editingOrder.status}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                >
                  {Object.keys(statusMap).map((key) => (
                    <option key={key} value={key}>
                      {statusMap[key].text}
                    </option>
                  ))}
                </select>
                <div className="col-span-2 flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingOrder(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </section>
    </div>
  );
};

export default UserManagement;
