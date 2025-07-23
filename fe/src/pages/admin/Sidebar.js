import React from "react";
import { useLocation } from "react-router-dom";

export default function Sidebar({ isSidebarOpen }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <section
      className={`fixed top-0 left-0 h-full z-20 bg-white ${
        isSidebarOpen ? "w-72" : "w-20"
      } transition-all duration-300`}
    >
      <a
        href="#"
        className="flex items-center px-4 py-4 text-blue-600 text-2xl font-bold"
      >
        <i className="bx bxs-smile"></i>
        <span className={`ml-4 ${!isSidebarOpen && "hidden"}`}>AdminHub</span>
      </a>
      <ul className="mt-12">
        <li className={isActive("/admin") ? "bg-blue-200" : ""}>
          <a href="#" className="flex items-center px-4 py-2 text-black">
            <i className="bx bxs-dashboard"></i>
            <span className={`ml-4 ${!isSidebarOpen && "hidden"}`}>
              Bảng điều khiển
            </span>
          </a>
        </li>
        <li className={isActive("/admin/ql_product") ? "bg-blue-200" : ""}>
          <a
            href="/admin/ql_product"
            className="flex items-center px-4 py-2 text-black"
          >
            <i className="bx bxs-shopping-bag-alt"></i>
            <span className={`ml-4 ${!isSidebarOpen && "hidden"}`}>
              Quản lý sản phẩm
            </span>
          </a>
        </li>
        <li className={isActive("/admin/ql_categories") ? "bg-blue-200" : ""}>
          <a
            href="/admin/ql_categories"
            className="flex items-center px-4 py-2 text-black"
          >
            <i className="bx bxs-doughnut-chart"></i>
            <span className={`ml-4 ${!isSidebarOpen && "hidden"}`}>
              Quản lý danh mục
            </span>
          </a>
        </li>
        <li className={isActive("/admin/ql_inventory") ? "bg-blue-200" : ""}>
          <a
            href="/admin/ql_inventory"
            className="flex items-center px-4 py-2 text-black"
          >
            <i className="bx bxs-box"></i>
            <span className={`ml-4 ${!isSidebarOpen && "hidden"}`}>
              Quản lý tồn kho
            </span>
          </a>
        </li>
        <li className={isActive("/admin/ql_user") ? "bg-blue-200" : ""}>
          <a
            href="/admin/ql_user"
            className="flex items-center px-4 py-2 text-black"
          >
            <i className="bx bxs-user-detail"></i>
            <span className={`ml-4 ${!isSidebarOpen && "hidden"}`}>
              Quản lý người dùng
            </span>
          </a>
        </li>
        <li className={isActive("/admin/ql_order") ? "bg-blue-200" : ""}>
          <a
            href="/admin/ql_order"
            className="flex items-center px-4 py-2 text-black"
          >
            <i className="bx bxs-cart-alt"></i>
            <span className={`ml-4 ${!isSidebarOpen && "hidden"}`}>
              Quản lý đơn hàng
            </span>
          </a>
        </li>
      </ul>
      <ul className="mt-12">
        <li>
          <a href="#" className="flex items-center px-4 py-2 text-black">
            <i className="bx bxs-cog"></i>
            <span className={`ml-4 ${!isSidebarOpen && "hidden"}`}>
              Settings
            </span>
          </a>
        </li>
        <li>
          <a href="/login" className="flex items-center px-4 py-2 text-red-600">
            <i className="bx bxs-log-out-circle"></i>
            <span className={`ml-4 ${!isSidebarOpen && "hidden"}`}>Logout</span>
          </a>
        </li>
      </ul>
    </section>
  );
}
