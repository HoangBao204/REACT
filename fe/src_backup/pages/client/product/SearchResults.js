import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho icon "Yêu thích"
  const [likedMap, setLikedMap] = useState({});
  const [spinningMap, setSpinningMap] = useState({});

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/products");
        const filtered = res.data.filter((item) =>
          item.title_product.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  // Xử lý khi click vào icon trái tim
  const handleClick = (id) => {
    setSpinningMap((prev) => ({ ...prev, [id]: true }));

    setTimeout(() => {
      setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
      setSpinningMap((prev) => ({ ...prev, [id]: false }));
    }, 400);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">
        Kết quả tìm kiếm cho: "{query}"
      </h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : results.length === 0 ? (
        <p>Không tìm thấy sản phẩm nào.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {results.map((product) => (
            <div key={product.id}>
              <div className="relative bg-[#eee] rounded overflow-hidden">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.img_product}
                    alt={product.description_product}
                    className="w-full h-[300px] object-cover"
                  />
                </Link>
                <i
                  aria-hidden="true"
                  onClick={() => handleClick(product.id)}
                  className={`absolute top-3 right-3 text-lg cursor-pointer transition-all duration-300 
                    ${
                      likedMap[product.id]
                        ? "fas text-red-500"
                        : "far text-black"
                    } 
                    fa-heart 
                    ${spinningMap[product.id] ? "animate-spin" : ""}`}
                />
              </div>
              <p className="mt-3 text-sm line-clamp-1">
                {product.title_product}
              </p>
              <p className="text-xs text-gray-500">
                {Number(product.price_product).toLocaleString("vi-VN")} ₫
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
