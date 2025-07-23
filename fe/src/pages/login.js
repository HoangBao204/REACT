import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

const Login = ({ setUserEmail }) => {
  const [email, setEmail] = useState('');
  const [pass, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, pass }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserEmail(email);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', data.id);

        // Check the role and navigate accordingly
        if (data.role === 0) {
          // Role 0 means admin
          navigate('/admin/ql_product');
        } else if (data.role === 1) {
          // Role 1 means user
          navigate('/');
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Error during login');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Đăng nhập</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Địa chỉ Email</label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Nhập địa chỉ email của bạn"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-5"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Mật khẩu</label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                required
                value={pass}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-5"
              />
            </div>
          </div>

          <div className="text-sm flex justify-between items-center px-3">
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">Quên mật khẩu?</Link>

            <Link to="/signin" className="">Đăng ký</Link>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md  bg-gray-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm "
            >
              Đăng nhập
            </button>
             <GoogleOAuthProvider clientId="192345883280-o7odfvcemcnvaekuv5im8b5011lm8fg1.apps.googleusercontent.com">
             <GoogleLogin
              onSuccess={credentialResponse => {
              console.log(credentialResponse);
                     }}
               onError={() => {
             console.log('Login Failed');
             }}
            />
          </GoogleOAuthProvider>
          </div>
         
        </form>
        
      </div>
    </div>
  );
};

export default Login;
