import { Route, Routes } from "react-router-dom";
import "./App.css";
import ClientLayout from "./layouts/ClientLayout";
import Home from "./pages/client/Home";
import DetailProduct from "./pages/client/product/DetailProduct";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SearchResults from "./pages/client/product/SearchResults";
import Cart from "./pages/client/Cart";
import Checkout from "./pages/client/orders/Checkout";
import Orders from "./pages/client/orders/Orders";
import OrderDetail from "./pages/client/orders/OrderDetail";

function App() {
  return (
    <Routes>
      <Route path="" element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="products/:id" element={<DetailProduct />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/checkout/:id" element={<Checkout />} />
      </Route>

      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
    </Routes>
  );
}

export default App;
