import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {

  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    address: '',
    phone: '',
    email: '',
    note: '',
    paymentMethod: '',
  });

  const [selectedPayment, setSelectedPayment] = useState('1');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [idUser, setIdUser] = useState(null); // Lưu ID người dùng

  useEffect(() => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(Array.isArray(existingCart) ? existingCart : []);

    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      fetch(`http://localhost:3001/user/${userEmail}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            setFormData(prevState => ({
              ...prevState,
              id_user: data.id,
              username: data.username || '',
              address: data.address || '',
              phone: data.phone || '',
              email: data.email || '',
            }));
            setIdUser(data.id_user); // Lưu ID người dùng
          }
        })
        .catch(error => console.error("Lỗi lấy thông tin người dùng:", error));
    }
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0) - discount;
  };


  const handleCouponApply = async () => {
    if (!couponCode) {
      alert("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/coupons/${couponCode}`);
      const data = await response.json();

      if (response.ok && data.discount_value) {
        setDiscount(data.discount_value);
        alert("Áp dụng mã giảm giá thành công!");
      } else {
        alert("Mã giảm giá không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi kiểm tra mã giảm giá:", error);
    }
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

  const handleQuantityChange = (id, value) => {
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống! Vui lòng thêm sản phẩm trước khi đặt hàng.");
      return;
    }

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert("Bạn cần đăng nhập trước khi thanh toán.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: formData.id_user,
          name: formData.username,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          cart,
          note: formData.note,
          paymentMethod: '1',
          couponCode,
          totalPrice: getTotalPrice(),
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert("Đặt hàng thành công!");
        localStorage.removeItem('cart');
        setCart([]);
        navigate('/order-history');

      } else {
        alert("Đặt hàng thất bại: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
    }
  };

  const handlePaymentChange = (e) => {
    const { value } = e.target;
    setSelectedPayment(value);
    setFormData(prevState => ({
      ...prevState,
      paymentMethod: value
    }));
  };

  const getPaymentClass = (paymentId) => {
    return selectedPayment === paymentId ? 'black ' : 'gray-200';
  };

  return (
    <div id="wrapper" className="w-full px-4 p-8">
      <main className="main">
        <div className="page_checkout">
          <form
            className="form_checkout max-w-[1140px] mx-auto pt-12"
            method="post"
            id="checkoutform"
            onSubmit={handleSubmit}
          >
            <div className="line w-full md:w-[670px] border-b-2 border-gray-300 "></div>
            <div className="checkout flex flex-col md:flex-row">
              <div className="info_checkout w-full md:w-[670px] pt-5">
                <div className="info">
                  <h3 className="checkout-title text-lg font-normal">Thông tin thanh toán</h3>
                  {['username', 'address', 'phone', 'email'].map((field, index) => (
                    <p key={index} id={field}>
                      <label className="label text-sm text-black inline-block pt-5 pb-1" htmlFor={field}>{field === 'username' ? 'Họ và tên' : field.charAt(0).toUpperCase() + field.slice(1)} *</label>
                      <input
                        className="w-full h-10 p-2.5 text-lg outline-none border border-gray-300 rounded focus:shadow-outline"
                        type="text"
                        name={field}
                        placeholder={`Nhập ${field}`}
                        value={formData[field]}
                        onChange={handleFormChange}
                        readOnly={field === 'email'}
                      />
                      <div className="error-message text-red-500 text-sm pt-1" id={`${field}-error`}></div>
                    </p>
                  ))}
                </div>
                <div className="info_additional pt-6">
                  <h3 className="checkout-title text-lg font-normal">Thông tin bổ sung</h3>
                  <p id="note">
                    <label className="label text-sm text-black inline-block pt-5 pb-1" htmlFor="note">Ghi chú đơn hàng</label>
                    <textarea
                      className="w-full h-28 p-2.5 text-lg outline-none border border-gray-300 rounded focus:shadow-outline"
                      name="note"
                      placeholder="Ghi chú về đơn hàng..."
                      value={formData.note}
                      onChange={handleFormChange}
                    />
                  </p>
                </div>
              </div>
              <div className="bill_checkout  w-full md:w-[470px] p-5 border-2 border-black/50 mt-5 md:mt-0">
                <h3 className="order_title text-lg font-normal">Đơn hàng của bạn</h3>
                <table className="shop_table w-full">
                  <thead>
                    <tr className="flex justify-between border-b-4 border-gray-300 pb-1">
                      <th className="text-sm text-gray-700">Sản phẩm</th>
                      <th className="text-sm text-gray-700">Tạm tính</th>
                    </tr>
                  </thead>
                  <tbody id="cart">
                    {cart.map((item, index) => (
                      <tr className="flex justify-between w-full py-4 border-b border-gray-300" key={index}>
                        <td className="w-16">
                          <img src={`/img/${item.img}`} alt={item.name} className="w-full" />
                        </td>
                        <td className="text-sm">{item.name} ×{item.quantity}</td>
                        <td className="font-bold">{formatPrice(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="checkout-payment">
                  <ul className="payment_methods">
                    {[{ id: '1', label: 'Trả tiền mặt khi nhận hàng' }, { id: '2', label: 'Chuyển Khoản Zalopay' }].map(({ id, label }) => (
                      <li key={id} className={`pb-2 border-b border-gray-300 ${getPaymentClass(id)}`}>
                        <input
                          id={`payment_method_${id}`}
                          type="radio"
                          name="payment_method"
                          value={id}
                          checked={selectedPayment === id}
                          onChange={handlePaymentChange}
                        />
                        <label className="pl-2.5 text-lg" htmlFor={`payment_method_${id}`}>{label}</label>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center mt-4 gap-2 ">
                    <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Nhập mã giảm giá" className="border border-gray-300 p-2 rounded flex-grow mr-2" />
                    <button type="button" onClick={handleCouponApply} className="bg-gray-800 text-white p-2 rounded">Áp dụng</button>
                  </div>
                  <div className="order-total flex justify-between w-full pb-2 border-b border-gray-300">
                    <th>Tổng</th>
                    <td className="font-bold">{formatPrice(getTotalPrice())}</td>
                  </div>
                  <div className="place-order mt-6">
                    <button type="submit" className="w-full p-3 text-white bg-gray-800 rounded">Đặt hàng</button>
                  </div>
                </div>
                <div className="privacy-policy-text leading-loose text-lg text-gray-700 pb-6">
                  <p>Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng, tăng trải nghiệm sử dụng website, và cho các mục đích cụ thể khác đã được mô tả trong <a href="#" className="privacy-policy-link text-blue-500 hover:underline" target="_blank">chính sách riêng tư</a></p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );

};

export default Checkout;
