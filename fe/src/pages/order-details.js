import React, { useState, useEffect } from 'react';

import axios from "axios"
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const OrderDetails = () => {

  const { orderId } = useParams();

  const [orderInfo, setOrderInfo] = useState();
  const [orderItems, setOrderItems] = useState();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getOrderDetails = () => {
    axios.get(`http://localhost:3001/orders/${orderId}`)
      .then((response) => response.data)
      .then((response) => {
        setOrderInfo(response.orders)
      })
  }

  const getOrderItems = () => {
    axios.get(`http://localhost:3001/order-details/${orderId}`)
      .then((response) => response.data)
      .then((response) => {
        setOrderItems(response.orderItems)
      })
  }


  const cancelledOrder = () => {

    axios.put(`http://localhost:3001/orders/${orderId}/status`, {
      newStatus: "cancelled"
    }).then((response) => response.data)
      .then((response) => {
        getOrderDetails();
      })
      .catch(error => console.log(error));

  }

  useEffect(() => {
    Promise.all([getOrderDetails(), getOrderItems()])
      .then()
      .finally(() => setLoading(false));
  }, []);


  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="container mx-auto p-6">
      <div className={"w-full flex items-center justify-between mb-4"}>
        <h2 className="text-xl font-semibold">Chi tiết đơn hàng</h2>
        <div className={"flex items-center gap-2"}>
          {orderInfo?.status === 'pending' && <button onClick={cancelledOrder} className="w-max px-4 py-2 rounded-3xl text-white bg-red-500">Hủy đơn hàng</button>}
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-full flex items-center"
            onClick={() => navigate("/order-history")}
          >
            <i class='bx bx-arrow-back'></i>
            <span className="ml-2">Quay lại</span>
          </button>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          className="w-full mx-auto"
        >
          <div className="checkout flex flex-col md:flex-row gap-4">
            <div className="info_checkout w-[670px] md:w-3/5 pt-5">
              <div className="info">
                <h3 className="checkout-title text-lg font-bold">Thông tin thanh toán</h3>
                <div>
                  <label className="label text-sm text-black inline-block pt-5 pb-1">Họ và tên</label>
                  <input
                    className="w-full h-10 p-2.5 text-lg outline-none border border-gray-300 rounded focus:shadow-outline"
                    type="text"
                    value={orderInfo?.name}
                    readOnly={true}
                  />
                </div>
                <div>
                  <label className="label text-sm text-black inline-block pt-5 pb-1">Địa chỉ</label>
                  <input
                    className="w-full h-10 p-2.5 text-lg outline-none border border-gray-300 rounded focus:shadow-outline"
                    type="text"
                    value={orderInfo?.address}
                    readOnly={true}
                  />
                </div>
                <div>
                  <label className="label text-sm text-black inline-block pt-5 pb-1">Email</label>
                  <input
                    className="w-full h-10 p-2.5 text-lg outline-none border border-gray-300 rounded focus:shadow-outline"
                    type="text"
                    value={orderInfo?.email}
                    readOnly={true}
                  />
                </div>
                <div>
                  <label className="label text-sm text-black inline-block pt-5 pb-1">Số điện thoại</label>
                  <input
                    className="w-full h-10 p-2.5 text-lg outline-none border border-gray-300 rounded focus:shadow-outline"
                    type="text"
                    value={orderInfo?.phone}
                    readOnly={true}
                  />
                </div>
                <div className="info_additional pt-6">
                  <h3 className="checkout-title text-lg font-normal">Thông tin bổ sung</h3>
                  <p id="note">
                    <label className="label text-sm text-black inline-block pt-5 pb-1">Ghi chú đơn hàng</label>
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
              <h3 className="order_title text-lg font-bold mb-4">Sản phẩm trong đơn hàng</h3>
              <table className="shop_table w-full">
                <thead>
                  <tr className="flex justify-between border-b-4 border-gray-300 pb-1">
                    <th className="text-sm text-gray-700">Sản phẩm</th>
                    <th className="text-sm text-gray-700">Tạm tính</th>
                  </tr>
                </thead>
                <tbody id="cart">
                  {orderItems?.map((item, index) => (
                    <tr className="flex justify-between w-full py-4 border-b border-gray-300" key={index}>
                      <td className="w-16">
                        <img src={`/img/${item.img}`} alt={item.name} className="w-full" />
                      </td>
                      <td className="text-sm">
                        <div className={"flex flex-col items-center gap-1"}>
                          <strong>{item.name}</strong>
                          <p><strong>Size:</strong> {item.sizeName} | <strong>Color:</strong> {item.colorName}</p>
                          <p>×{item.quantity}</p>
                        </div>
                      </td>
                      <td className="font-bold">{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="checkout-payment">
                <div className={"py-2 flex items-center justify-between"}>
                  <strong>
                    Phương thức thanh toán:
                  </strong>
                  <p >
                    {orderInfo?.paymentMethod === '1' ? "Thanh toán khi nhận hàng" : "Thanh toán qua chuyển khoản"}
                  </p>
                </div>
                <div className="order-total flex justify-between w-full pb-2 border-b border-gray-300">
                  <th>Tổng</th>
                  <td className="font-bold">{formatPrice(orderInfo?.totalPrice)}</td>
                </div>
                <div className="place-order mt-4 flex justify-between items-center gap-8">
                  <p className={'min-w-max'}>Trạng thái đơn hàng:</p>

                  {orderInfo?.status === 'cancelled' && <p className="w-max px-4 py-2 rounded-3xl text-white bg-red-600">Đơn đã bị hủy</p>}
                  {orderInfo?.status === 'pending' && <p className="w-max px-4 py-2 rounded-3xl text-white bg-yellow-400">Đang chờ xác nhận</p>}
                  {orderInfo?.status === 'confirmed' && <p className="w-max px-4 py-2 rounded-3xl text-white bg-blue-400">Đã xác nhận</p>}
                  {orderInfo?.status === 'delivering' && <p className="w-max px-4 py-2 rounded-3xl text-white bg-green-400">Đơn hàng đang được giao</p>}
                  {orderInfo?.status === 'delivered' && <p className="w-max px-4 py-2 rounded-3xl text-white bg-green-600">Giao thành công</p>}

                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
