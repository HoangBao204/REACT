import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";

const CategoriesManagement = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/categories");
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Lỗi khi tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle add category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Tên danh mục không được để trống");
      return;
    }

    try {
      await axios.post("http://localhost:3001/categories", formData);
      toast.success("Thêm danh mục thành công");
      setShowAddModal(false);
      setFormData({ name: "", description: "" });
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Lỗi khi thêm danh mục");
      }
    }
  };

  // Handle edit category
  const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Tên danh mục không được để trống");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3001/categories/${selectedCategory.id}`,
        formData
      );
      toast.success("Cập nhật danh mục thành công");
      setShowEditModal(false);
      setSelectedCategory(null);
      setFormData({ name: "", description: "" });
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Lỗi khi cập nhật danh mục");
      }
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/categories/${categoryId}`);
      toast.success("Xóa danh mục thành công");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Lỗi khi xóa danh mục");
      }
    }
  };

  // Open edit modal
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setShowEditModal(true);
  };

  // Filter categories
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <Sidebar isSidebarOpen={isSidebarOpen} />
      {/* CONTENT */}
      <section
        className={`flex-1 ${
          isSidebarOpen ? "ml-72" : "ml-20"
        } transition-all duration-300`}
      >
        {/* NAVBAR */}
        <nav className="flex items-center justify-between px-6 py-1 bg-white shadow-md">
          <i
            className="bx bx-menu cursor-pointer"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          ></i>
          <a href="#" className="text-gray-700">
            Quản lý Danh mục
          </a>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center"
          >
            <input
              type="search"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <h1 className="text-3xl font-bold text-gray-800">
                Quản lý Danh mục
              </h1>
              <ul className="flex items-center text-gray-600">
                <li>
                  <a href="#">Dashboard</a>
                </li>
                <li className="mx-2">
                  <i className="bx bx-chevron-right"></i>
                </li>
                <li>
                  <a href="#" className="text-blue-600">
                    Danh mục
                  </a>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-full flex items-center"
            >
              <i className="bx bx-plus"></i>
              <span className="ml-2">Thêm danh mục</span>
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Tổng danh mục
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {categories.length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Danh mục có sản phẩm
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {categories.filter((cat) => cat.product_count > 0).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Danh mục trống
              </h3>
              <p className="text-2xl font-bold text-orange-600">
                {categories.filter((cat) => cat.product_count === 0).length}
              </p>
            </div>
          </div>

          {/* Categories Table */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Danh sách danh mục</h3>
              <div className="flex items-center">
                <i className="bx bx-search mr-2"></i>
                <i className="bx bx-filter"></i>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <i className="bx bx-loader-alt bx-spin text-2xl text-blue-600"></i>
                <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="pb-2 border-b">ID</th>
                    <th className="pb-2 border-b">Tên danh mục</th>
                    <th className="pb-2 border-b">Số sản phẩm</th>
                    <th className="pb-2 border-b">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-8 text-gray-500"
                      >
                        {searchTerm
                          ? "Không tìm thấy danh mục nào"
                          : "Chưa có danh mục nào"}
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-100">
                        <td className="py-2">{category.id}</td>
                        <td className="py-2 font-medium">{category.name}</td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              category.product_count > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {category.product_count || 0} sản phẩm
                          </span>
                        </td>
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(category)}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                              <i className="bx bx-edit-alt"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                              disabled={category.product_count > 0}
                            >
                              <i className="bx bx-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
        {/* MAIN */}

        {/* Add Category Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Thêm danh mục mới</h3>
              <form onSubmit={handleAddCategory}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên danh mục *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên danh mục"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mô tả (tùy chọn)"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({ name: "", description: "" });
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Thêm
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Chỉnh sửa danh mục</h3>
              <form onSubmit={handleEditCategory}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên danh mục *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên danh mục"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mô tả (tùy chọn)"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedCategory(null);
                      setFormData({ name: "", description: "" });
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
      {/* CONTENT */}
    </div>
  );
};

export default CategoriesManagement;
