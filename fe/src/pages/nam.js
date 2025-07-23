import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Nam = () => {
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productResponse = await axios.get("http://localhost:3001/product");
        setProducts(productResponse.data.products);
        const newProductResponse = await axios.get("http://localhost:3001/newproduct");
        setNewProducts(newProductResponse.data.newproducts);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const visibleItems = 3;

  const handlePrev = (setIndex, currentIndex, length) => {
    setIndex(Math.max(currentIndex - visibleItems, 0));
  };

  const handleNext = (setIndex, currentIndex, length) => {
    setIndex(Math.min(currentIndex + visibleItems, length - visibleItems));
  };

  const renderSlider = (title, items, currentIndex, setIndex) => (
    <div className="w-2/3">
      <h3 className="text-center p-5 text-2xl font-bold">{title}</h3>
      <div className="relative w-full">
        <button
          onClick={() => handlePrev(setIndex, currentIndex, items.length)}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md z-10 disabled:opacity-50"
        >
          ❮
        </button>
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)` }}
          >
            {items.map((product) => (
              <div key={product.id} className="w-1/3 p-2 flex-shrink-0">
                <div className="border border-gray-300 relative overflow-hidden">
                  <div className="relative w-full h-[300px] overflow-hidden group">
                    <img 
                      src={"/img/" + product.img} 
                      alt={product.name} 
                      className="w-full h-full object-cover absolute transition-transform duration-500 group-hover:translate-x-[-20%]" 
                    />
                    <img 
                      src={"/img/" + product.imgHover} 
                      alt={product.name + " Hover"} 
                      className="w-full h-full object-cover absolute opacity-0 transition-opacity duration-500 group-hover:opacity-100" 
                    />
                  </div>
                  <div className="info text-center p-4">
                    <Link className="product-name no-underline text-black" to={`/product/${product.id}`}>
                      {product.name}
                    </Link>
                    <div className="giatien font-bold mt-2">{formatPrice(product.price)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => handleNext(setIndex, currentIndex, items.length)}
          disabled={currentIndex >= items.length - visibleItems}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full z-10 shadow-md disabled:opacity-50"
        >
          ❯
        </button>
      </div>
    </div>
  );

  return (
    <section className="flex justify-center">
      <div className="w-full p-8 max-w-screen-xl flex flex-col gap-10">
        {/* QUẦN JEAN */}
        <div className="flex">
          <div className="w-1/3 pr-4">
            <img src="/img/nam.webp" alt="Main Image" className="w-full h-full object-cover" />
          </div>
          {renderSlider("QUẦN JEAN", newProducts, currentIndex, setCurrentIndex)}
        </div>
        {/* ÁO SWEATER */}
        <div className="flex">
          <div className="w-1/3 pr-4">
            <img src="/img/nam2.webp" alt="Main Image" className="w-full h-full object-cover" />
          </div>
          {renderSlider("ÁO SWEATER", products, currentProductIndex, setCurrentProductIndex)}
        </div>
      </div>
    </section>
  );
};

export default Nam;
