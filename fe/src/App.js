// App.js

import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./component/header";
import Footer from "./component/footer";
import Home from "./pages/home";
import Contact from "./pages/contact";
import ProductDetail from "./pages/product-detail";
import Shop from "./pages/shop";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import OrderHistory from "./pages/orderhistory";
import Login from "./pages/login";
import Signup from "./pages/signin";
import Review from "./pages/review";
import ProductManagement from "./pages/admin/ProductManagement";
import CategoriesManagement from "./pages/admin/CategoriesManagement";
import UserManagement from "./pages/admin/UserManagement";
import AdminHeader from "./component/AdminHeader";
import AdminFooter from "./component/AdminFooter";
import Nam from "./pages/nam";
import OrderManagement from "./pages/admin/OrderManagement";
import OrderDetailsAdmin from "./pages/admin/OrderDetailsAdmin";
import OrderDetails from "./pages/order-details";
import InventoryManagement from "./pages/admin/InventoryManagement";

function App() {
  const [userEmail, setUserEmail] = useState("");

  // Load userEmail from localStorage when the app starts
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  // Save userEmail to localStorage whenever it changes
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem("userEmail", userEmail);
    } else {
      localStorage.removeItem("userEmail");
    }
  }, [userEmail]);

  return (
    <>
      <Routes>
        <Route
          path="/*"
          element={<Header userEmail={userEmail} setUserEmail={setUserEmail} />}
        />{" "}
        {/* Header for user pages */}
        <Route path="/admin/*" element={<AdminHeader />} />{" "}
        {/* Header for admin pages */}
      </Routes>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/order-history/:orderId" element={<OrderDetails />} />
        <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
        <Route path="/signin" element={<Signup />} />
        <Route
          path="/admin/ql_product"
          element={<ProductManagement setUserEmail={setUserEmail} />}
        />
        <Route path="/admin/ql_categories" element={<CategoriesManagement />} />
        <Route path="/admin/ql_user" element={<UserManagement />} />
        <Route path="/admin/ql_order" element={<OrderManagement />} />
        <Route path="/admin/ql_order/:id" element={<OrderDetailsAdmin />} />
        <Route path="/admin/ql_inventory" element={<InventoryManagement />} />
        <Route path="/review/:id" element={<Review />} />{" "}
        {/* Review page for single product */}
        <Route path="/nam" element={<Nam />} /> {/* Nam page */}
      </Routes>
      <Routes>
        <Route path="/*" element={<Footer />} /> {/* Footer for user pages */}
        <Route path="/admin/*" element={<AdminFooter />} />{" "}
        {/* Footer for admin pages */}
      </Routes>
    </>
  );
}

export default App;
