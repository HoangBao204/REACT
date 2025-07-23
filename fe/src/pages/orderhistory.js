import React, { useState, useEffect } from 'react';

import axios from "axios"
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';


const OrderHistory = () => {
  const [listOrders, setListOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Old fetch
  // const fetchOrders = async () => {
  //   try {
  //     const userEmail = localStorage.getItem('userEmail');

  //     if (!userEmail) {
  //       console.warn('User email not found in localStorage');
  //       setLoading(false);
  //       return;
  //     }

  //     const userResponse = await fetch(`http://localhost:3001/user/${userEmail}`);
  //     const userData = await userResponse.json();

  //     if (!userResponse.ok || !userData.id) {
  //       console.error('User not found in database');
  //       setLoading(false);
  //       return;
  //     }

  //     const response = await fetch(`http://localhost:3001/orders/user/${userData.id}`);
  //     const data = await response.json();
  //     if (response.ok) {
  //       setOrders(data);
  //     } else {
  //       console.error('Failed to fetch orders:', data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching orders:', error);
  //   }
  //   setLoading(false);
  // };

  // fetchOrders();

  const navigate = useNavigate();

  const getUserOrders = () => {

    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("Không tìm thấy userId");
    }

    axios.get(`http://localhost:3001/user/${userId}/orders`)
      .then((response) => response.data)
      .then((response) => {
        setListOrders(response.orders);
        toast.success("Lấy dữ liệu thành công");
      }).finally(() => {
        setLoading(false);
      })
  }



  useEffect(() => {
    getUserOrders();
  }, []);


  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Lịch sử đơn hàng</h2>
      {loading ? (
        <p>Loading...</p>
      ) : listOrders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="grid gap-4">
          {listOrders?.map(order => (
            <div key={order.id} className="border p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Mã đơn hàng: {order.id}</h3>
                <p>Ngày đặt: {new Date(order.order_date).toLocaleString("vi-VN")}</p>
                <p>Tổng tiền: {formatPrice(order.totalPrice)}</p>
                {/* <p className={`status ${order.status}`}>Trạng thái: {order.status}</p> */}

                <div className={"flex items-center gap-2"}>
                  <p>Trạng thái: </p>
                  <span className={clsx("px-4 py-1 rounded-lg text-center capitalize", {
                    "bg-yellow-200 text-yellow-800": order.status === "pending",
                    "bg-red-500 text-white": order.status === "cancelled",
                    "bg-blue-200 text-blue-800": order.status === "confirmed",
                    "bg-green-200 text-green-800": order.status === "delivering",
                    "bg-green-800 text-white": order.status === "delivered",
                  })}>
                    {order.status}
                  </span>
                </div>
              </div>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"
                onClick={() => navigate("/order-history/" + order.id)}
              >
                <span className="ml-2">Xem đơn hàng</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
