import React, { useState } from "react";
import Footer from "./../components/client/Footer";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bcrypt from "bcryptjs";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
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
    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    try {
      // ✅ Chỉ tìm theo email
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("token", data.accessToken);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Đăng nhập thành công!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error("Email hoặc mật khẩu không đúng!");
      }
    } catch (err) {
      toast.error("Đã xảy ra lỗi khi đăng nhập");
    }
  };

  return (
    <div>
      <div className="bg-white text-black font-sans">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <h1 className="text-base font-normal mb-4">Đăng nhập</h1>
          <p className="text-sm font-normal mb-2 max-w-[600px]">
            Đăng nhập để tiếp tục trải nghiệm mua sắm cùng My Mode.
          </p>
          <p className="text-sm font-normal mb-10 max-w-[600px]">
            Bạn chưa có tài khoản?{" "}
            <a href="/register" className="underline">
              Đăng ký tại đây
            </a>
          </p>

          <form
            className="max-w-[600px] mx-auto flex flex-col gap-6"
            onSubmit={handleSubmit}
          >
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
                className="absolute right-3 top-1/2 text-gray-600 text-sm cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <label htmlFor="remember">Ghi nhớ đăng nhập</label>
              </div>
              <a href="#" className="underline">
                Quên mật khẩu?
              </a>
            </div>

            <div className="mt-6 flex flex-col items-end gap-3">
              {/* Nút đăng nhập */}
              <button
                type="submit"
                className="bg-black text-white rounded-full px-12 py-3 text-sm font-normal w-full max-w-[220px] hover:bg-gray-900 transition"
              >
                Đăng nhập
              </button>

              {/* Nút quay lại trang chủ */}
              <Link
                to="/"
                className="text-sm text-black underline hover:text-gray-700 transition"
              >
                ← Quay lại Trang chủ
              </Link>

              <p className="text-[10px] text-black mt-3 max-w-[220px] text-right leading-tight">
                Nếu bạn chưa có tài khoản, vui lòng đăng ký để bắt đầu trải
                nghiệm mua sắm.
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Login;
