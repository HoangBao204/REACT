import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

const OrderDetailsAdmin = () => {
  const navigate = useNavigate();

  const orderId = useParams().id;

  const [orderInfo, setOrderInfo] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const getOrderDetails = () => {
    axios
      .get(`http://localhost:3001/orders/${orderId}`)
      .then((response) => response.data)
      .then((response) => {
        setOrderInfo(response.orders);
      });
  };

  const getOrderItems = () => {
    axios
      .get(`http://localhost:3001/order-details/${orderId}`)
      .then((response) => response.data)
      .then((response) => {
        setOrderItems(response.orderItems);
      });
  };

  const getNextStatus = (currentStatus) => {
    if (currentStatus === "delivered") {
      return false;
    }

    switch (currentStatus) {
      case "pending":
        return "confirmed";
      case "confirmed":
        return "delivering";
      case "delivering":
        return "delivered";
      default:
        return false;
    }
  };

  const updateOrderStatus = (status) => {
    const newStatus = getNextStatus(status);

    if (!newStatus) {
      alert("Không tìm thấy trạng thái hợp lệ");
    }

    axios
      .put(`http://localhost:3001/orders/${orderId}/status`, {
        newStatus,
      })
      .then((response) => response.data)
      .then((response) => {
        getOrderDetails();
      })
      .catch((error) => console.log(error));
  };

  const cancelledOrder = () => {
    axios
      .put(`http://localhost:3001/orders/${orderId}/status`, {
        newStatus: "cancelled",
      })
      .then((response) => response.data)
      .then((response) => {
        getOrderDetails();
      })
      .catch((error) => console.log(error));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  useEffect(() => {
    Promise.all([getOrderDetails(), getOrderItems()]).then();
  }, []);

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

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
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <ul className="flex items-center text-gray-600">
                <li>
                  <a href="#">Dashboard</a>
                </li>
                <li className="mx-2">
                  <i className="bx bx-chevron-right"></i>
                </li>
                <li>
                  <a href="#" className="text-blue-600">
                    Home
                  </a>
                </li>
              </ul>
            </div>
            <div className={"flex items-center gap-4"}>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-full flex items-center"
                onClick={() => navigate("/admin/ql_order")}
              >
                <i class="bx bx-arrow-back"></i>
                <span className="ml-2">Quay lại</span>
              </button>
            </div>
          </div>

          <div id="wrapper" className="w-full">
            <main className="main">
              <div className="page_checkout">
                <div className="w-full mx-auto">
                  <div className="checkout flex flex-col md:flex-row gap-4">
                    <div className="info_checkout w-[670px] md:w-3/5 pt-5">
                      <div className="info">
                        <h3 className="checkout-title text-lg font-bold">
                          Thông tin thanh toán
                        </h3>
                        <div>
                          <label className="label text-sm text-black inline-block pt-5 pb-1">
                            Họ và tên
                          </label>
                          <input
                            className="w-full h-10 p-2.5 text-lg outline-none border border-gray-300 rounded focus:shadow-outline"
                            type="text"
                            value={orderInfo?.name}
                            readOnly={true}
                          />
                        </div>
                        <div>
                          <label className="label text-sm text-black inline-block pt-5 pb-1">
                            Địa chỉ
                          </label>
                          <input
                            className="w-full h-10 p-2.5 text-lg outline-none border border-gray-300 rounded focus:shadow-outline"
                            type="text"
                            value={orderInfo?.address}
                            readOnly={true}
                          />
                        </div>
                        <div>
                          <label className="label text-sm text-black inline-block pt-5 pb-1">
                            Email
                          </label>
                          <input
                            className="w-full h-10 p-2.5 text-lg outline-none border border-gray-300 rounded focus:shadow-outline"
                            type="text"
                            value={orderInfo?.email}
                            readOnly={true}
                          />
                        </div>
                        <div>
                          <label className="label text-sm text-black inline-block pt-5 pb-1">
                            Số điện thoại
                          </label>
                          <input
                            className="w-full h-10 p-2.5 text-lg outline-none border border-gray-300 rounded focus:shadow-outline"
                            type="text"
                            value={orderInfo?.phone}
                            readOnly={true}
                          />
                        </div>
                        <div className="info_additional pt-6">
                          <h3 className="checkout-title text-lg font-normal">
                            Thông tin bổ sung
                          </h3>
                          <p id="note">
                            <label className="label text-sm text-black inline-block pt-5 pb-1">
                              Ghi chú đơn hàng
                            </label>
                            <textarea
                              className="w-full h-28 p-2.5 text-lg outline-none border border-gray-300 rounded focus:shadow-outline"
                              name="note"
                              value={orderInfo?.note || "Không có"}
                              readOnly
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bill_checkout  w-[470px] md:w-2/5 p-5 mt-5 md:mt-0">
                      <h3 className="order_title text-lg font-bold mb-4">
                        Sản phẩm trong đơn hàng
                      </h3>
                      <table className="shop_table w-full">
                        <thead>
                          <tr className="flex justify-between border-b-4 border-gray-300 pb-1">
                            <th className="text-sm text-gray-700">Sản phẩm</th>
                            <th className="text-sm text-gray-700">Tạm tính</th>
                          </tr>
                        </thead>
                        <tbody id="cart">
                          {orderItems?.map((item, index) => (
                            <tr
                              className="flex justify-between w-full py-4 border-b border-gray-300"
                              key={index}
                            >
                              <td className="w-16">
                                <img
                                  src={`/img/${item.img}`}
                                  alt={item.name}
                                  className="w-full"
                                />
                              </td>
                              <td className="text-sm">
                                <div
                                  className={"flex flex-col items-center gap-1"}
                                >
                                  <strong>{item.name}</strong>
                                  <p>
                                    <strong>Size:</strong> {item.sizeName} |{" "}
                                    <strong>Color:</strong> {item.colorName}
                                  </p>
                                  <p>×{item.quantity}</p>
                                </div>
                              </td>
                              <td className="font-bold">
                                {formatPrice(item.price * item.quantity)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="checkout-payment">
                        <div
                          className={"py-2 flex items-center justify-between"}
                        >
                          <strong>Phương thức thanh toán:</strong>
                          <p>
                            {orderInfo?.paymentMethod === "1"
                              ? "Thanh toán khi nhận hàng"
                              : "Thanh toán qua chuyển khoản"}
                          </p>
                        </div>
                        <div className="order-total flex justify-between w-full pb-2 border-b border-gray-300">
                          <th>Tổng</th>
                          <td className="font-bold">
                            {formatPrice(orderInfo?.totalPrice)}
                          </td>
                        </div>
                        <div className="place-order mt-6">
                          {orderInfo?.status === "pending" && (
                            <div className={"flex items-center gap-2"}>
                              <button
                                onClick={() => cancelledOrder()}
                                className="w-full p-3 text-white bg-red-500 rounded"
                              >
                                Hủy đơn hàng
                              </button>
                              <button
                                onClick={() =>
                                  updateOrderStatus(orderInfo?.status)
                                }
                                className="w-full p-3 text-white bg-yellow-400 rounded"
                              >
                                Xác nhận đơn hàng
                              </button>
                            </div>
                          )}
                          {orderInfo?.status === "cancelled" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(orderInfo?.status)
                              }
                              className="w-full p-3 text-white bg-red-600 rounded"
                              disabled
                            >
                              Đã hủy
                            </button>
                          )}
                          {orderInfo?.status === "confirmed" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(orderInfo?.status)
                              }
                              className="w-full p-3 text-white bg-blue-400 rounded"
                            >
                              Chuyển trạng thái giao hàng
                            </button>
                          )}
                          {orderInfo?.status === "delivering" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(orderInfo?.status)
                              }
                              className="w-full p-3 text-white bg-green-400 rounded"
                            >
                              Xác nhận giao hàng thành công
                            </button>
                          )}
                          {orderInfo?.status === "delivered" && (
                            <button
                              className="w-full p-3 text-white bg-green-600 rounded"
                              disabled
                            >
                              Giao hàng thành công
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </main>
      </section>
    </div>
  );
};

export default OrderDetailsAdmin;
