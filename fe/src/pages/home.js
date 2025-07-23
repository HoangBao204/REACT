import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, } from "react-router-dom";
import ProductCard from "../component/product-card";


const images = [
  "/img/banner1.webp",
  "/img/banner2.webp",
  "/img/bannert3.webp",
];
const blog = [
  "/img/phoi-do-cho-nguoi-beo-1.jpg",
];



const Home = () => {
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productResponse = await axios.get("http://localhost:3001/product");
        setProducts(productResponse.data.products);
        const newProductResponse = await axios.get("http://localhost:3001/newproduct");
        console.log("Product API data:", productResponse.data);
console.log("New Product API data:", newProductResponse.data);
        setNewProducts(newProductResponse.data.newproducts);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };


    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const features = [
    {
      icon: "💰",
      title: "Thanh toán khi nhận hàng (COD)",
      description: "Giao hàng toàn quốc."
    },
    {
      icon: "🚚",
      title: "Miễn phí giao hàng",
      description: "Với đơn hàng trên 599.000đ."
    },
    {
      icon: "📦",
      title: "Đổi hàng miễn phí",
      description: "Trong 30 ngày kể từ ngày mua."
    }
  ];

  return (
    <section className="flex justify-center">
      <div className="w-full max-w-screen-xl">
        {/* Banner */}
        <div className="relative w-full h-[400px] overflow-hidden mb-10">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`banner ${index + 1}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
            />
          ))}
        </div>

        {/*  */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-8 border-b border-gray-300">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="bg-red-100 p-3 rounded-md">{feature.icon}</div>
              <div>
                <h3 className="text-gray-900 font-semibold text-lg">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SẢN PHẨM MỚI */}
        <div className="headline">
          <h3 className="text-center p-5 text-2xl font-bold">SẢN PHẨM MỚI</h3>
        </div>
        <div className="sanpham flex justify-center my-10 w-full" id="newProducts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {newProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                imgHover={product.imgHover}
                img={product.img}
                id={product.id}
              />
            ))}
          </div>
        </div>

        {/* SẢN PHẨM BÁN CHẠY */}
        <div className="headline">
          <h3 className="text-center text-2xl font-bold">SẢN PHẨM BÁN CHẠY</h3>
        </div>
        <div className="sanpham flex justify-center my-10 w-full" id="loadsp">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                imgHover={product.imgHover}
                img={product.img}
                id={product.id}
              />
            ))}
          </div>
        </div>
        {/*  */}
        <div className="bg-white-100 py-10 px-4 w-full text-center flex flex-col  ">
          <h2 className="text-2xl font-semibold ">Đăng ký nhận bản tin</h2>
          <p className="text-gray-500 mt-2">
            Cùng 6TL cập nhật những thông tin mới nhất về thời trang và phong cách sống.
          </p>

          <div className="mt-5 flex justify-center">
            <input
              type="email"
              placeholder="Nhập email đăng ký của bạn"
              className="border border-gray-300 px-4 py-2 rounded-l-md w-80 outline-none"
            />
            <button className="bg-red-500 text-white px-5 py-2 rounded-r-md font-semibold">
              <Link to="/signin" className="">Đăng ký</Link>
            </button>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <a href="/#" className="p-3 bg-white shadow-md rounded-full">
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a href="/#" className="p-3 bg-white shadow-md rounded-full">
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a href="/#" className="p-3 bg-white shadow-md rounded-full">
              <i className="fab fa-youtube text-xl"></i>
            </a>
            <a href="/#" className="p-3 bg-white shadow-md rounded-full">
              <i className="fab fa-tiktok text-xl"></i>
            </a>
          </div>
        </div>


        <div className="grid grid-cols-3  justify-center gap-3 mb-5">
          <div className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-md">
            <div className="md:block">
              <div className="md:shrink-0">
                <img
                  className=" w-full  md:h-full "
                  src={blog}
                  alt="Modern building architecture"
                />
              </div>
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  Nguyên tắc cách phối đồ cho người béo
                </div>
                <a href="/#" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                  15 Cách Phối Đồ Cho Người Béo Giúp Tự Tin Khoe Dáng
                </a>
                <p className="mt-2 text-slate-500">
                  Người béo nên mặc gì để tự tin hơn trong các hoạt động hàng ngày? Đọc ngay bài viết sau khám phá 15 cách phối đồ cho người béo từ Canifa để
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-md">
            <div className="md:block">
              <div className="md:shrink-0">
                <img
                  className=" w-full  md:h-full "
                  src={blog}
                  alt="Modern building architecture"
                />
              </div>
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  Nguyên tắc cách phối đồ cho người béo
                </div>
                <a href="/#" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                  15 Cách Phối Đồ Cho Người Béo Giúp Tự Tin Khoe Dáng
                </a>
                <p className="mt-2 text-slate-500">
                  Người béo nên mặc gì để tự tin hơn trong các hoạt động hàng ngày? Đọc ngay bài viết sau khám phá 15 cách phối đồ cho người béo từ Canifa để
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-md">
            <div className="md:block">
              <div className="md:shrink-0">
                <img
                  className=" w-full  md:h-full "
                  src={blog}
                  alt="Modern building architecture"
                />
              </div>
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  Nguyên tắc cách phối đồ cho người béo
                </div>
                <a href="/#" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                  15 Cách Phối Đồ Cho Người Béo Giúp Tự Tin Khoe Dáng
                </a>
                <p className="mt-2 text-slate-500">
                  Người béo nên mặc gì để tự tin hơn trong các hoạt động hàng ngày? Đọc ngay bài viết sau khám phá 15 cách phối đồ cho người béo từ Canifa để
                </p>
              </div>
            </div>
          </div>

        </div>

        {/*  */}
      </div>
    </section>

  );

};


export default Home;