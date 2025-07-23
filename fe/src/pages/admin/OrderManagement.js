import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
const OrderManagement = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [listOrders, setListOrders] = useState([]);

  const getListOrders = () => {
    axios
      .get(`http://localhost:3001/orders`)
      .then((response) => response.data)
      .then((response) => {
        setListOrders(response.orders);
        console.log(response.orders);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getListOrders();
  }, []);

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <Sidebar isSidebarOpen={isSidebarOpen} />
      {/* SIDEBAR */}

      {/* CONTENT */}
      <section
        className={`flex-1 ${
          isSidebarOpen ? "ml-72" : "ml-20"
        } transition-all duration-300`}
      >
        {/* NAVBAR */}
        <nav className="flex items-center justify-between px-6 py-1  bg-white shadow-md">
          <i
            className="bx bx-menu cursor-pointer"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          ></i>
          <a href="#" className="text-gray-700">
            Categories
          </a>
          <form action="#" className="flex items-center">
            <input
              type="search"
              placeholder="Search..."
              className="px-4 py-2 rounded-l-full bg-gray-200"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-r-full"
            >
              <i className="bx bx-search"></i>
            </button>
          </form>
          <input type="checkbox" id="switch-mode" hidden />
          <label htmlFor="switch-mode" className="ml-4 cursor-pointer"></label>
          <a href="#" className="relative">
            <i className="bx bxs-bell"></i>
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs flex items-center justify-center rounded-full">
              8
            </span>
          </a>
          <a href="#" className="ml-4">
            <img
              src="img/people.png"
              alt="profile"
              className="w-9 h-9 rounded-full"
            />
          </a>
        </nav>
        {/* NAVBAR */}

        {/* MAIN */}
        <main className="p-6 bg-gray-100 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Quản lý đặt hàng</h1>
              <ul className="flex items-center text-gray-600">
                <li>
                  <a href="#">Đặt hàng</a>
                </li>
                <li className="mx-2">
                  <i className="bx bx-chevron-right"></i>
                </li>
                <li>
                  <a href="#" className="text-blue-600">
                    Trang chủ
                  </a>
                </li>
              </ul>
            </div>
            <a
              href="#"
              className="px-4 py-2 bg-blue-600 text-white rounded-full flex items-center"
            >
              <i className="bx bxs-cloud-download"></i>
              <span className="ml-2">Tải xuống PDF</span>
            </a>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Đơn hàng gần đây</h3>
              <div className="flex items-center">
                <i className="bx bx-search mr-2"></i>
                <i className="bx bx-filter"></i>
              </div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-2 border-b">Mã đơn hàng</th>
                  <th className="pb-2 border-b">Khách hàng</th>
                  <th className="pb-2 border-b">Ngày đặt</th>
                  <th className="pb-2 border-b">Tổng tiền</th>
                  <th className="pb-2 border-b">Trạng thái</th>
                  <th className="pb-2 border-b">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listOrders.map((order) => (
                  <tr className="hover:bg-gray-100">
                    <td className="py-2 flex items-center">
                      <p>{order.id}</p>
                    </td>
                    <td className="py-2">
                      {order.username} - {order.email}
                    </td>
                    <td className="py-2">
                      <span className="px-4 py-1">
                        {new Date(order.order_date).toLocaleString("vi-VN")}
                      </span>
                    </td>
                    <td className="py-2">
                      <span className="px-4 py-1">
                        {order.totalPrice.toLocaleString()}đ
                      </span>
                    </td>
                    <td className="py-2">
                      
                      <span
                      
                        className={clsx(
                          "px-4 py-1 rounded-lg text-center capitalize",
                          {
                            "bg-yellow-200 text-yellow-800":
                              order.status === "pending",
                            "bg-red-500 text-white":
                              order.status === "cancelled",
                            "bg-blue-200 text-blue-800":
                              order.status === "confirmed",
                            "bg-green-200 text-green-800":
                              order.status === "delivering",
                            "bg-green-800 text-white":
                              order.status === "delivered",
                          }
                        )}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2">
                      <button
                        className="px-4 py-1 bg-blue-500 text-white rounded"
                        onClick={() => navigate(`/admin/ql_order/${order.id}`)}
                      >
                        Xem đơn hàng
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
        {/* MAIN */}
      </section>
      {/* CONTENT */}
    </div>
  );
};

export default OrderManagement;
