import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/client/Header";
import Footer from "../components/client/Footer";

const ClientLayout = () => {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
        <Header />
      </header>

      {/* Thêm padding để tránh bị Header đè lên */}
      <main className="pt-20">
        <Outlet />
      </main>

      <footer className="mt-5">
        <Footer />
      </footer>
    </>
  );
};

export default ClientLayout;
