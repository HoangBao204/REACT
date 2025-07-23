import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(existingCart);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const updateQuantity = (id, quantity) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, quantity) };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleInputChange = (id, value) => {
    const quantity = parseInt(value, 10);
    if (Number.isNaN(quantity) || quantity <= 0) {
      return;
    }
    updateQuantity(id, quantity);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };




  const handleCheckout = async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('Vui lòng đăng nhập để tiến hành thanh toán');
      navigate('/login');
      return;
    }

    try {
      navigate('/checkout');
      // Gọi API lấy thông tin user từ email
      // const userResponse = await fetch(`ps://www.loqlarchlinuxserver.xyzhtt/yesking/user/${userEmail}`);
      // const userData = await userResponse.json();

      // console.log(userData);


      // if (!userResponse.ok) {
      //   alert("Không tìm thấy thông tin người dùng");
      //   return;
      // }

      // const totalPrice = getTotalPrice();
      // const orderData = {
      //   id_user: userData.id,  // Lấy ID thực tế của user từ database

      //   cart: {
      //     totalPrice,
      //     items: cart
      //   }
      // };

      // // Gửi đơn hàng lên server
      // const response = await fetch('https://www.loqlarchlinuxserver.xyz/yesking/orders_detail', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(orderData),
      // });

      // if (response.ok) {
      //   alert('Đặt hàng thành công');

      // } else {
      //   alert('Có lỗi xảy ra khi đặt hàng');
      // }
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi đặt hàng');
    }
  };

  return (
    <div className="showcart">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-3xl font-bold my-8">Giỏ hàng</h1>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-2 px-4">Ảnh</th>
                <th className="py-2 px-4">Tên SP</th>
                <th className="py-2 px-4">Size</th>
                <th className="py-2 px-4">Màu sắc</th>
                <th className="py-2 px-4">Giá</th>
                <th className="py-2 px-4">Số Lượng</th>
                <th className="py-2 px-4">Thành Tiền</th>
                <th className="py-2 px-4">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id} className="border-b border-gray-300">
                  <td className="py-2 px-4 text-center">
                    <img src={`/img/${item.img}`} alt={item.name} className="w-16 h-16 object-cover m-auto" />
                  </td>
                  <td className="py-2 px-4 text-center">{item.name}</td>
                  <td className="py-2 px-4 text-center">{item.sizeName || 'Mặc định'}</td>
                  <td className="py-2 px-4 text-center">{item.colorName || 'Mặc định'}</td>
                  <td className="py-2 px-4 text-center">{formatPrice(item.price)}</td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex ml-20 items-center border border-gray-300 rounded-lg overflow-hidden w-24">
                      <button
                        className="w-8 h-8 flex items-center justify-center text-gray-600 text-xl hover:bg-gray-200 transition"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input
                        className="w-8 h-8  text-center text-lg font-medium focus:outline-none border-x border-gray-300"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleInputChange(item.id, e.target.value)}
                        readOnly
                      />
                      <button
                        className="w-8 h-8 flex items-center justify-center text-gray-600 text-xl hover:bg-gray-200 transition"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-center">{formatPrice(item.price * item.quantity)}</td>
                  <td className="py-2 px-4 text-center">
                    <button
                      className="text-black py-1 px-4 bg-white border border-gray-300 rounded-md"
                      onClick={() => removeItem(item.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-right mt-4">
          <span className="font-bold ">Tổng tiền:</span>
          <span id="tongtien" className="ml-2 text-red-600 ">{formatPrice(getTotalPrice())}</span>
        </div>
        <button
          className="bg-gray-800 text-white py-2 px-6 rounded-md mt-4"
          onClick={handleCheckout}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Cart;
