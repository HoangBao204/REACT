import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { toast, ToastContainer } from "react-toastify";

const AccordionItem = ({ title, children, iconType }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 text-black text-base font-normal"
        aria-expanded={open}
      >
        <span>{title}</span>
        {iconType === "plus" ? (
          <span className="text-xl font-thin">{open ? "−" : "+"}</span>
        ) : (
          <i
            className={`fas fa-chevron-${open ? "down" : "right"} text-base`}
          />
        )}
      </button>
      {open && <div className="pb-4 text-sm text-gray-600">{children}</div>}
    </div>
  );
};

const DetailProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [liked, setLiked] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(true);

  const [likedMap, setLikedMap] = useState({});
  const [spinningMap, setSpinningMap] = useState({});
  const navigate = useNavigate();

  const handleClick = (productId) => {
    setLikedMap((prev) => ({ ...prev, [productId]: !prev[productId] }));
    setSpinningMap((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setSpinningMap((prev) => ({ ...prev, [productId]: false }));
    }, 500);
  };

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/products/${id}`);
        const prod = res.data;
        setProduct(prod);

        const allProducts = await axios.get("http://localhost:3000/products");
        const related = allProducts.data.filter(
          (item) => item.category_id === prod.category_id && item.id !== prod.id
        );
        setRelatedProducts(related);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRelated();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (!user || !user.id) {
        toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
        return;
      }

      const idUser = user.id;
      const res = await axios.get(`http://localhost:3000/cart`, {
        params: { idUser, productId: product.id },
      });

      const existingItem = res.data[0];

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        const newTotal = newQuantity * existingItem.price_product;

        await axios.patch(`http://localhost:3000/cart/${existingItem.id}`, {
          quantity: newQuantity,
          total_price: newTotal,
          updatedAt: new Date().toISOString(),
        });

        toast.success("Đã thêm vào giỏ hàng", {
          onClose: () => navigate("/cart"),
          autoClose: 1500,
        });
      } else {
        const cartItem = {
          idUser,
          productId: product.id,
          title_product: product.title_product,
          img_product: product.img_product,
          price_product: product.price_product,
          quantity: 1,
          total_price: product.price_product,
          createdAt: new Date().toISOString(),
        };

        await axios.post("http://localhost:3000/cart", cartItem);
        toast.success("Đã thêm vào giỏ hàng", {
          onClose: () => navigate("/cart"),
          autoClose: 1500,
        });
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Thêm vào giỏ hàng thất bại");
    }
  };

  const handleBuyNow = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (!user || !user.id) {
        toast.error("Vui lòng đăng nhập để mua sản phẩm");
        return;
      }

      const checkoutItem = {
        idUser: user.id,
        productId: product.id,
        title_product: product.title_product,
        img_product: product.img_product,
        price_product: product.price_product,
        quantity: 1,
        total_price: product.price_product,
        createdAt: new Date().toISOString(),
      };

      // Gửi dữ liệu lên server
      const response = await axios.post(
        "http://localhost:3000/checkout",
        checkoutItem
      );

      const newCheckout = response.data;

      if (!newCheckout || !newCheckout.id) {
        toast.error("Không thể lấy thông tin đơn hàng từ server");
        return;
      }

      toast.success("Đang chuyển đến trang thanh toán...", {
        autoClose: 3000,
        onClose: () => {
          navigate(`/checkout/${newCheckout.id}`, {
            state: {
              selectedItems: [{ ...checkoutItem, id: newCheckout.id }], // Thêm đúng `id` từ server
              totalPrice: checkoutItem.total_price,
            },
          });
        },
      });
    } catch (err) {
      console.error("Lỗi khi xử lý mua ngay:", err);
      toast.error("Không thể mua sản phẩm lúc này");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải sản phẩm..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-center text-red-500">
        Không tìm thấy sản phẩm
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 flex justify-center items-center p-6">
          <img
            src={product.img_product}
            alt={product.description_product}
            className="max-w-full mr-12 h-auto"
          />
        </div>

        <div className="lg:w-1/2 bg-white p-6 md:p-12 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-xs font-normal text-black mb-1">
                #{product.id}
              </div>
              <h1 className="text-xl font-normal text-black leading-tight mb-1">
                {product.title_product}
              </h1>
              <div className="text-base font-normal text-black mb-6">
                {Number(product.price_product).toLocaleString("vi-VN")} ₫
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <button
                  onClick={handleAddToCart}
                  className="w-[280px] bg-black text-white rounded-2xl px-10 py-4 font-semibold text-md flex items-center justify-center gap-3 shadow-md hover:bg-gray-900 active:scale-95 transition-all duration-300"
                >
                  <i className="fas fa-shopping-cart text-xl"></i>
                  Thêm vào giỏ hàng
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-[280px] bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-2xl px-10 py-4 font-semibold text-md flex items-center justify-center gap-3 shadow-md hover:from-yellow-500 hover:to-yellow-600 active:scale-95 transition-all duration-300"
                >
                  <i className="fas fa-bolt text-xl"></i>
                  Mua ngay
                </button>
              </div>
            </div>

            <button
              aria-label="Add to wishlist"
              onClick={() => {
                setLiked(!liked);
                setSpinning(true);
                setTimeout(() => setSpinning(false), 500);
              }}
              className="ml-6 mt-1 text-xl transition-colors duration-300"
            >
              <i
                className={`fa-heart ${
                  liked ? "fas text-red-500" : "far text-black"
                } ${spinning ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          <div className="text-sm text-gray-700 leading-relaxed max-w-md mb-4">
            {product.description_product}
          </div>
          <a
            href="#"
            className="text-sm text-black underline mb-8 max-w-md inline-block"
          >
            Xem thêm
          </a>

          <AccordionItem title="Phát triển bền vững" iconType="plus">
            Nội dung phát triển bền vững...
          </AccordionItem>
          <AccordionItem title="Chăm sóc sản phẩm" iconType="plus">
            Hướng dẫn chăm sóc sản phẩm...
          </AccordionItem>
          <AccordionItem title="Dịch vụ tại cửa hàng" iconType="plus">
            Thông tin dịch vụ tại cửa hàng...
          </AccordionItem>

          <div className="mt-8 max-w-md">
            <button className="w-full flex justify-between items-center border-b border-gray-200 py-4 text-black text-base font-normal">
              <span>Chính sách giao hàng và đổi hàng</span>
              <i className="fas fa-chevron-right text-base"></i>
            </button>
            <button className="w-full flex justify-between items-center border-b border-gray-200 py-4 text-black text-base font-normal">
              <span>Nghệ thuật tặng quà</span>
              <i className="fas fa-chevron-right text-base"></i>
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="px-6 md:px-16 py-10">
          <h2 className="text-xl font-semibold mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
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
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DetailProduct;
