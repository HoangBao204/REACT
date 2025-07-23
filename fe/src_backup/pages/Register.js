import React, { useState } from "react";
import Footer from "./../components/client/Footer";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bcrypt from "bcryptjs";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    title: "",
    firstName: "",
    lastName: "",
    dob: "",
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password, confirmPassword, agree, ...rest } = formData;

    if (!email || !password || !confirmPassword || !agree) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không trùng khớp.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, ...rest }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || "Lỗi đăng ký");
      }

      const user = await response.json();
      sessionStorage.setItem(
        "user",
        JSON.stringify({ id: user.id, email: user.email })
      );

      toast.success("Đăng ký thành công!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.message || "Lỗi khi đăng ký");
    }
  };

  return (
    <div>
      <div className="bg-white text-black font-sans">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <h1 className="text-base font-normal mb-4">Tạo tài khoản</h1>
          <p className="text-sm font-normal mb-2 max-w-[600px]">
            Tạo tài khoản để tận hưởng trải nghiệm được cá nhân hóa.
          </p>
          <p className="text-sm font-normal mb-10 max-w-[600px]">
            Bạn đã có tài khoản My Mode?{" "}
            <a href="login" className="underline">
              Đăng nhập tại đây
            </a>
          </p>

          {error && (
            <p className="text-sm text-red-500 mb-6 font-medium">{error}</p>
          )}

          <form
            className="flex flex-wrap justify-between gap-y-6"
            onSubmit={handleSubmit}
          >
            <div className="w-full md:w-[48%] flex flex-col gap-6">
              <div className="flex flex-col">
                <label htmlFor="email" className="text-xs mb-1">
                  Email*
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="flex flex-col relative">
                <label htmlFor="password" className="text-xs mb-1">
                  Mật khẩu*
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
                <span
                  className="absolute right-3 top-1/2 mt-2.5 -translate-y-1/2 transform text-gray-600 text-base cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </span>
              </div>

              <div className="flex flex-col relative">
                <label htmlFor="confirmPassword" className="text-xs mb-1">
                  Xác nhận lại mật khẩu*
                </label>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
                <span
                  className="absolute right-3 top-1/2 mt-2.5 -translate-y-1/2 transform text-gray-600 text-base cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i
                    className={`fas ${
                      showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="agree"
                  type="checkbox"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <label htmlFor="agree" className="text-xs font-normal">
                  Tôi đã đọc và đồng ý với{" "}
                  <a href="#" className="underline">
                    Chính sách quyền riêng tư
                  </a>
                  . *
                </label>
              </div>
            </div>

            <div className="w-full md:w-[48%] flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <label htmlFor="title" className="text-xs">
                  Tiêu đề*
                </label>
                <span className="text-[10px]">Thông tin bắt buộc*</span>
              </div>
              <select
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 text-xs text-gray-400 appearance-none focus:outline-none focus:ring-1 focus:ring-black"
                aria-label="Chọn danh xưng"
              >
                <option value="">Chọn danh xưng</option>
                <option>Ông</option>
                <option>Bà</option>
                <option>Khác</option>
              </select>

              <div className="flex flex-col">
                <label htmlFor="firstName" className="text-xs mb-1">
                  Tên*
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="lastName" className="text-xs mb-1">
                  Họ*
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="dob" className="text-xs mb-1">
                  Ngày sinh*
                </label>
                <input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="mt-12 flex flex-col items-end">
                <button
                  type="submit"
                  className="bg-black text-white rounded-full px-12 py-3 text-sm font-normal w-full max-w-[220px] hover:bg-gray-900 transition"
                >
                  Tiếp tục
                </button>
                <Link
                  to="/"
                  className="text-sm text-black underline hover:text-gray-700 transition"
                >
                  ← Quay lại Trang chủ
                </Link>
                <p className="text-[10px] text-black mt-3 max-w-[220px] text-right leading-tight">
                  Bạn sẽ nhận được mã kích hoạt qua email để xác thực việc tạo
                  tài khoản của mình.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Register;
