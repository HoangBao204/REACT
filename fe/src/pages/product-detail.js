import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Review from "./review";
const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [listColors, setListColors] = useState([]);
  const [listSizes, setListSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedImages, setRelatedImages] = useState([]);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [message, setMessage] = useState("");

  const getProductInfo = () => {

    if (!id) return;

    axios.get(`http://localhost:3001/product/${id}`)
      .then(response => {
        setProduct(response.data.productInfo);
        setSelectedImage(`/img/${response.data.productInfo.img}`);
        const fallbackImages = {
          "Quần Jean Suông": ["v9.1.webp", "v9.2.webp", "v9.3.webp"],
          "Quần Jean Basic": ["v10.1.webp", "v10.2.webp", "v10.3.webp"],
          "Đồ Bộ Nam": ["c3.webp", "aokhoac2.webp", "aokhoac3.webp"],
          "Đồ Bộ Trẻ Em": ["c3.webp", "aokhoac2.webp", "aokhoac3.webp"],
          "Quần Thun Nữ": ["c3.webp", "aokhoac2.webp", "aokhoac3.webp"],
          "Áo Nỉ Nam": ["v1.1.webp", "v1.2.webp", "v1.3.webp"],
          "Quần Thun Nam": ["c1.webp", "jean2.webp", "jean3.webp"]
        };

        const images = fallbackImages[response.data.name] || [];
        setRelatedImages(images);
      })
      .catch(error => {
        setError(error);
      });
  }

  const getProductColors = () => {
    if (!id) return;
    axios.get(`http://localhost:3001/product/${id}/colors`)
      .then((response) => response.data)
      .then((response) => {

        if (response.colors.length > 0) {
          setSelectedColor(response.colors[0].id);
        }
        setListColors(response.colors);
      })
  }

  const getProductSizes = () => {
    if (!id) return;

    axios.get(`http://localhost:3001/product/${id}/sizes`)
      .then((response) => response.data)
      .then((response) => {
        if (response.sizes.length > 0) {
          setSelectedSize(response.sizes[0].id);
        }
        setListSizes(response.sizes);
      })
  }

  const getListProducts = () => {
    axios.get("http://localhost:3001/product/")
      .then(response => {
        if (Array.isArray(response.data.products)) {
          const filteredProducts = response.data.products
            .filter(p => p.id !== parseInt(id))
            .slice(0, 8);
          setRelatedProducts(filteredProducts);
        } else {
          console.error("Dữ liệu từ API không phải là mảng:", response.data);
        }
      })
      .catch(error => console.error("Lỗi khi lấy sản phẩm tương tự:", error));
  }

  useEffect(() => {

    Promise.all([getProductInfo(), getProductSizes(), getProductColors(), getListProducts()])
      .then((response) => { return response.data })
      .finally(() =>
        setLoading(false)
      )

  }, []);

  const addToCart = (item) => {

    if (!selectedSize || !selectedColor) {
      setMessage("Vui lòng chọn size và màu sắc!");
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const found = existingCart.find(product => product.id === item.id && product.size === selectedSize && product.color === selectedColor);

    if (found) {
      found.quantity += 1;
    } else {
      item.quantity = 1;
      item.size = selectedSize;
      item.sizeName = listSizes.find(_v => _v.id === selectedSize).name;
      item.color = selectedColor;
      item.colorName = listColors.find(_v => _v.id === selectedColor).name;
      existingCart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setMessage("Sản phẩm đã được thêm vào giỏ hàng");
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi khi lấy sản phẩm: {error.message}</p>;
  if (!product) return <p>Sản phẩm không tồn tại</p>;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-screen-xl mx-auto">
      <div className="flex flex-wrap justify-between w-4/5 mx-auto">
        <div className="w-full md:w-1/2 flex">
          <div className="p-5">
            <img src={selectedImage} alt={product.name} className="h-[400px] w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center space-y-2 p-5">
            {relatedImages.length > 0 && relatedImages.map((img, index) => (
              <img
                key={index}
                src={`/img/${img}`}
                alt=""
                className={`h-20 cursor-pointer border-2 ${selectedImage === `/img/${img}` ? "border-red-500" : "border-transparent"
                  }`}
                onClick={() => setSelectedImage(`/img/${img}`)}
              />
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/2 p-5">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="text-red-600 font-bold text-2xl py-5">{formatPrice(product.price)}</div>

          <div className="mt-4">
            <p className="text-lg font-medium">Kích cỡ:</p>
            <div className="flex space-x-2 mt-1">
              {listSizes?.map((size) => (
                <div
                  key={size.id}
                  className={`w-10 h-10 flex items-center justify-center border cursor-pointer ${selectedSize === size.id ? "border-blue-500" : "border-gray-300"}`}
                  onClick={() => setSelectedSize(size.id)}
                >
                  {size.name}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-lg font-medium">Màu sắc:</p>
            <div className="flex space-x-2 mt-1">
              {listColors?.map((color) => (
                <div
                  key={color.id}
                  className={`w-10 h-10 flex items-center justify-center border cursor-pointer ${selectedColor === color.id ? "border-blue-500" : "border-gray-300"}`}
                  onClick={() => setSelectedColor(color.id)}
                >
                  {color.name}
                </div>
              ))}
            </div>
          </div>
          {message && <p className="mt-2 text-red-500 font-medium">{message}</p>}

          <button className="block w-48 text-center text-white bg-gray-800 p-3 mt-4" onClick={() => addToCart(product)}>THÊM VÀO GIỎ HÀNG</button>
          <div className="mt-10">
            <ul className="list-disc pl-5">
              <li>Cam kết chất lượng như hình ảnh, video đăng tải trên Web</li>
              <li>Double Box kèm chống sốc khi giao hàng</li>
              <li>Giao hàng nhanh 60 phút trong nội thành Hà Nội và TP. HCM</li>
              <li>Nhận hàng và kiểm tra trước khi thanh toán.</li>
              <li>Hỗ trợ đổi trả size linh hoạt</li>
            </ul>
          </div>
          <div className="mt-5">
            <p><strong>Mã:</strong> {product.sku || "NAJ142"}</p>
            <p><strong>Thương hiệu: <Link to="#">{product.brand || "Không xác định"}</Link></strong></p>
          </div>
        </div>
      </div>

      <Review product_id={id} />

      {/* Related Products */}
      <div className="headline mt-10">
        <h3 className="text-center text-2xl font-bold">SẢN PHẨM TƯƠI TƯƠI</h3>
      </div>
      <div className="sanpham flex justify-center my-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {relatedProducts.map((product) => (
            <div key={product.id} className="border border-gray-300 relative overflow-hidden w-full">
              <div className="relative w-full h-[400px] overflow-hidden group">
                <img
                  src={`/img/${product.img}`}
                  alt={product.name}
                  className="w-full h-full object-cover absolute transition-transform duration-500 group-hover:translate-x-[-20%]"
                />
                <img
                  src={`/img/${product.imgHover}`}
                  alt={`${product.name} Hover`}
                  className="w-full h-full object-cover absolute opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:translate-x-0"
                />
              </div>
              <div className="info text-center p-4">
                <Link className="product-name no-underline text-black" to={`/product/${product.id}`}>
                  {product.name}
                </Link>
                <div className="giatien font-bold mt-2">{formatPrice(product.price)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;