import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";
const ProductManagement = ({ setUserEmail }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [loading, setLoading] = useState(true); // k xài tới
  const [error, setError] = useState(null); // k xài tới

  const [listProducts, setListProducts] = useState([]);
  const [listCategories, setListCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    imgMain: "",
    imgHover: "",
    id_cate: "",
    quantity: "",
  });

  const [newColor, setNewColor] = useState("");

  const [newSize, setNewSize] = useState("");

  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showProductDetailsForm, setShowProductDetailsForm] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef();

  const [selectedId, setSelectedId] = useState(null);
  const [selectedProductData, setSelectedProductData] = useState({
    productInfo: null,
    colors: null,
    sizes: null,
  });
  const fetchProducts = async () => {
    try {
      const productResponse = await axios.get("http://localhost:3001/product");
      console.log(productResponse.data.products);
      setListProducts(productResponse.data.products);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesResponse = await axios.get(
        "http://localhost:3001/categories"
      );
      setListCategories(categoriesResponse.data.categories);
      setNewProduct({
        ...newProduct,
        id_cate:
          categoriesResponse.data.categories.length > 0
            ? categoriesResponse.data.categories[0].id
            : "",
      });
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const fetchProductById = async (productId) => {
    try {
      const [productInfo, listColors, listSizes] = await Promise.all([
        axios.get(`http://localhost:3001/product/${productId}`),
        axios.get(`http://localhost:3001/product/${productId}/colors`),
        axios.get(`http://localhost:3001/product/${productId}/sizes`),
      ]);

      setSelectedProductData(() => ({
        productInfo: productInfo.data.productInfo,
        sizes: listSizes.data.sizes,
        colors: listColors.data.colors,
      }));

      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleLogout = () => {
    setUserEmail(""); // Reset userEmail
    alert("Bạn đã đăng xuất thành công");
    navigate("/login"); // Redirect to the login page
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:3001/product/${productId}`);
      setListProducts(
        listProducts.filter((product) => product.id !== productId)
      );
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProductData((prev) => ({
      ...prev,
      productInfo: {
        ...prev.productInfo,
        [name]: value,
      },
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/product",
        newProduct
      );
      fetchProducts();
      setNewProduct({
        name: "",
        price: "",
        imgMain: "",
        imgHover: "",
        id_cate: "",
        quantity: "",
      });
      setShowAddProductForm(false);
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedId) {
      return;
    }

    axios
      .put(`http://localhost:3001/product/${selectedId}`, {
        ...selectedProductData.productInfo,
      })
      .then((response) => response.data)
      .then((response) => {
        toast.success("Cập nhật sản phẩm thành công");
        Promise.all([fetchProductById(selectedId), fetchProducts()]).then(
          (response) => response.data
        );
      });
  };

  const handleAddNewColor = async () => {
    if (!selectedId) {
      return;
    }

    try {
      await axios
        .post(`http://localhost:3001/product/${selectedId}/colors`, {
          newColor,
        })
        .then((response) => response.data)
        .then((response) => {
          toast.success("Thêm kích thước mới thành công");
          fetchProductById(selectedId);
          setNewColor("");
        });
    } catch (err) {
      console.error("Failed to add product color:", err);
    }
  };

  const handleAddNewSize = async () => {
    if (!selectedId) {
      return;
    }

    try {
      await axios
        .post(`http://localhost:3001/product/${selectedId}/sizes`, { newSize })
        .then((response) => response.data)
        .then((response) => {
          toast.success("Thêm kích thước mới thành công");
          fetchProductById(selectedId);
          setNewSize("");
        });
    } catch (err) {
      console.error("Failed to add product size:", err);
    }
  };

  const handleDeleteSize = async (sizeId) => {
    if (!selectedId) {
      return;
    }

    try {
      await axios
        .delete(`http://localhost:3001/product/${selectedId}/sizes/${sizeId}`)
        .then((response) => response.data)
        .then((response) => {
          toast.success("Xóa kích thước thành công");
          fetchProductById(selectedId);
        });
    } catch (err) {
      console.error("Failed to delete product size:", err);
    }
  };

  const handleDeleteColor = async (colorId) => {
    if (!selectedId) {
      return;
    }

    try {
      await axios
        .delete(`http://localhost:3001/product/${selectedId}/colors/${colorId}`)
        .then((response) => response.data)
        .then((response) => {
          toast.success("Xóa màu thành công");
          fetchProductById(selectedId);
        });
    } catch (err) {
      console.error("Failed to delete product color:", err);
    }
  };

  const handleShowProductDetails = (productId) => {
    console.log("okma");

    setSelectedId(productId);

    setShowProductDetailsForm(true);

    fetchProductById(productId);
    // fetch
  };

  const handleClickOutside = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setShowAddProductForm(false);
    }
  };

  useEffect(() => {
    if (showAddProductForm) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddProductForm]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = listProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(listProducts.length / productsPerPage);

  useEffect(() => {
    console.log(selectedProductData);
  }, [selectedProductData]);

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <Sidebar isSidebarOpen={isSidebarOpen} />
      {/* SIDEBAR */}

      {/* CONTENT */}
      <section
        className={`flex-1 ${
          isSidebarOpen ? "ml-72" : "ml-20"
        } transition-all duration-300`}
      >
        {/* NAVBAR */}
        <nav className="flex items-center justify-between px-6 py-1  bg-white shadow-md">
          <i
            className="bx bx-menu cursor-pointer"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          ></i>
          <a href="#" className="text-gray-700">
            Categories
          </a>
          <form action="#" className="flex items-center">
            <input
              type="search"
              placeholder="Search..."
              className="px-4 py-2 rounded-l-full bg-gray-200"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-r-full"
            >
              <i className="bx bx-search"></i>
            </button>
          </form>
          <input type="checkbox" id="switch-mode" hidden />
          <label htmlFor="switch-mode" className="ml-4 cursor-pointer"></label>
          <a href="#" className="relative">
            <i className="bx bxs-bell"></i>
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs flex items-center justify-center rounded-full">
              8
            </span>
          </a>
          <a href="#" className="ml-4">
            <img
              src="img/people.png"
              alt="profile"
              className="w-9 h-9 rounded-full"
            />
          </a>
        </nav>
        {/* NAVBAR */}

        {/* MAIN */}
        <main className="p-6 bg-gray-100 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <ul className="flex items-center text-gray-600">
                <li>
                  <a href="#">Dashboard</a>
                </li>
                <li className="mx-2">
                  <i className="bx bx-chevron-right"></i>
                </li>
                <li>
                  <a href="#" className="text-blue-600">
                    Home
                  </a>
                </li>
              </ul>
            </div>
            <div className={"flex items-center gap-4"}>
              <button
                onClick={() => setShowAddProductForm(!showAddProductForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-full flex items-center"
              >
                <i className="bx bxs-plus-circle"></i>
                <span className="ml-2">Tạo sản phẩm</span>
              </button>
            </div>
          </div>

          {showAddProductForm && (
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
              ref={formRef}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                <button
                  type="button"
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  onClick={() => setShowAddProductForm(false)}
                >
                  &#x2715;
                </button>
                <h2 className="text-2xl font-bold mb-4">Thêm sản phẩm</h2>
                <form onSubmit={handleAddProduct}>
                  <div className="mb-4">
                    <label className="block text-gray-700">
                      Ảnh chính (URL hoặc tên ảnh đã lưu):
                    </label>
                    <input
                      type="text"
                      name="imgMain"
                      value={newProduct.imgMain}
                      onChange={handleAddInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">
                      Ảnh phụ (URL hoặc tên ảnh đã lưu):
                    </label>
                    <input
                      type="text"
                      name="imgHover"
                      value={newProduct.imgHover}
                      onChange={handleAddInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Tên danh mục:</label>

                    <select
                      value={newProduct.id_cate}
                      name="id_cate"
                      onChange={handleAddInputChange}
                      className={"px-4 py-2 border rounded-lg"}
                    >
                      {listCategories.map((category) => (
                        <option value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Tên sản phẩm:</label>
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleAddInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Giá:</label>
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleAddInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Số lượng:</label>
                    <input
                      type="number"
                      name="quantity"
                      value={newProduct.quantity}
                      onChange={handleAddInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      min="0"
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Thêm sản phẩm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showProductDetailsForm && selectedProductData && (
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
              ref={formRef}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl relative grid grid-cols-3 gap-4">
                <button
                  type="button"
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  onClick={() => setShowProductDetailsForm(false)}
                >
                  &#x2715;
                </button>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Cập nhật sản phẩm</h2>
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Ảnh chính (URL hoặc tên ảnh đã lưu):
                      </label>
                      <input
                        type="text"
                        name="img"
                        value={selectedProductData.productInfo?.img ?? "-"}
                        onChange={handleUpdateInputChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Ảnh phụ (URL hoặc tên ảnh đã lưu):
                      </label>
                      <input
                        type="text"
                        name="imgHover"
                        value={selectedProductData.productInfo?.imgHover ?? "-"}
                        onChange={handleUpdateInputChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Tên danh mục:
                      </label>
                      <select
                        value={selectedProductData.productInfo?.id_cate ?? ""}
                        name="id_cate"
                        onChange={handleUpdateInputChange}
                        className={"px-4 py-2 border rounded-lg"}
                      >
                        {listCategories.map((category) => (
                          <option value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Tên sản phẩm:
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={selectedProductData.productInfo?.name ?? "-"}
                        onChange={handleUpdateInputChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Giá:</label>
                      <input
                        type="number"
                        name="price"
                        value={selectedProductData.productInfo?.price ?? "-"}
                        onChange={handleUpdateInputChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Số lượng:</label>
                      <input
                        type="number"
                        name="quantity"
                        value={selectedProductData.productInfo?.quantity ?? 0}
                        onChange={handleUpdateInputChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        min="0"
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-yellow-400 text-white rounded"
                        onClick={handleUpdateProduct}
                      >
                        Cập nhật sản phẩm
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Danh sách kích thước
                  </h2>
                  <div className={"flex flex-wrap gap-1 mb-4"}>
                    {selectedProductData.sizes?.map((size) => (
                      <div
                        className={"border px-4 py-2 flex items-center gap-4"}
                      >
                        {size.name}
                        <button
                          type="button"
                          className="text-red-600 hover:text-gray-800 transition-colors duration-200"
                          onClick={() => handleDeleteSize(size.id)}
                        >
                          &#x2715;
                        </button>
                      </div>
                    ))}
                  </div>
                  <hr className={"mb-4"} />
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Kích thước mới:
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={newSize}
                        onChange={(e) => setNewSize(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddNewSize()
                        }
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                        placeholder={"Nhập tên kích thước"}
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        className="px-4 py-2 bg-green-400 text-white rounded"
                        onClick={handleAddNewSize}
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Danh sách màu</h2>
                  <div className={"flex flex-wrap gap-1 mb-4"}>
                    {selectedProductData.colors?.map((color) => (
                      <div
                        className={"border px-4 py-2 flex items-center gap-4"}
                      >
                        {color.name}
                        <button
                          type="button"
                          className="text-red-600 hover:text-gray-800 transition-colors duration-200"
                          onClick={() => handleDeleteColor(color.id)}
                        >
                          &#x2715;
                        </button>
                      </div>
                    ))}
                  </div>
                  <hr className={"mb-4"} />
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Màu mới:</label>
                      <input
                        type="text"
                        name="price"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddNewColor()
                        }
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                        placeholder={"Nhập tên màu"}
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        className="px-4 py-2 bg-green-400 text-white rounded"
                        onClick={handleAddNewColor}
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <div className="flex items-center">
                <i className="bx bx-search mr-2"></i>
                <i className="bx bx-filter"></i>
              </div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-2 border-b">Img</th>
                  <th className="pb-2 border-b">Name</th>
                  <th className="pb-2 border-b">Price</th>
                  <th className="pb-2 border-b">Tồn kho</th>
                  <th className="pb-2 border-b">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr className="hover:bg-gray-100" key={product.id}>
                    <td className="py-2 flex items-center">
                      <img
                        src={`/img/${product.img}`}
                        alt="product"
                        className="w-9 h-9 rounded-full mr-3"
                      />
                    </td>
                    <td className="py-2">
                      <p>{product.name}</p>
                    </td>
                    <td className="py-2">
                      {product.price.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.quantity === 0
                            ? "bg-red-100 text-red-800"
                            : product.quantity <= 10
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.quantity || 0}
                      </span>
                    </td>
                    <td className="py-2">
                      <div className={"flex items-center gap-2"}>
                        <button
                          className="px-4 py-1 bg-yellow-400 text-white rounded"
                          onClick={() => handleShowProductDetails(product.id)}
                        >
                          Xem
                        </button>
                        <button
                          className="px-4 py-1 bg-red-600 text-white rounded"
                          onClick={() => handleDelete(product.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`px-3 py-1 mx-1 border rounded ${
                    index + 1 === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600"
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </main>
        {/* MAIN */}
      </section>
      {/* CONTENT */}
    </div>
  );
};

export default ProductManagement;
