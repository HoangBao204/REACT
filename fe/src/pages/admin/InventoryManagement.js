import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";
import { saveAs } from "file-saver";

const InventoryManagement = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResults, setImportResults] = useState(null);

  const [updateForm, setUpdateForm] = useState({
    action: "set",
    amount: 0,
    quantity: 0,
  });

  // Fetch inventory data
  const fetchInventory = async () => {
    try {
      const [inventoryRes, statsRes] = await Promise.all([
        axios.get("http://localhost:3001/inventory"),
        axios.get("http://localhost:3001/inventory/stats"),
      ]);

      if (inventoryRes.data && inventoryRes.data.inventory) {
        setInventory(inventoryRes.data.inventory);
      } else {
        setInventory([]);
      }

      if (statsRes.data && statsRes.data.stats) {
        setStats(statsRes.data.stats);
      } else {
        setStats({});
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Lỗi khi tải dữ liệu tồn kho");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Handle inventory update
  const handleUpdateInventory = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      // Validation trước khi gửi request
      if (
        updateForm.action === "set" &&
        (updateForm.quantity < 0 || updateForm.quantity === "")
      ) {
        toast.error("Số lượng phải là số không âm");
        return;
      }

      if (
        (updateForm.action === "add" || updateForm.action === "subtract") &&
        (updateForm.amount <= 0 || updateForm.amount === "")
      ) {
        toast.error("Số lượng thêm/trừ phải là số dương");
        return;
      }

      await axios.put(
        `http://localhost:3001/inventory/product/${selectedProduct.id}`,
        updateForm
      );
      toast.success("Cập nhật tồn kho thành công");
      setShowUpdateModal(false);
      setSelectedProduct(null);
      setUpdateForm({ action: "set", amount: 0, quantity: 0 });
      fetchInventory(); // Refresh data
    } catch (error) {
      console.error("Error updating inventory:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Lỗi khi cập nhật tồn kho");
      }
    }
  };

  // Open update modal
  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setUpdateForm({
      action: "set",
      amount: 0,
      quantity: product.quantity,
    });
    setShowUpdateModal(true);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Hết hàng":
        return "text-red-600 bg-red-100";
      case "Sắp hết hàng":
        return "text-orange-600 bg-orange-100";
      case "Còn hàng":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Handle Excel export
  const handleExportExcel = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/inventory/export/excel",
        {
          responseType: "blob",
        }
      );

      // Tạo tên file với timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const fileName = `inventory-${timestamp}.xlsx`;

      // Download file
      saveAs(new Blob([response.data]), fileName);
      toast.success("Xuất Excel thành công!");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error("Lỗi khi xuất file Excel");
    }
  };

  // Handle Excel import
  const handleImportExcel = async (e) => {
    e.preventDefault();
    if (!importFile) {
      toast.error("Vui lòng chọn file Excel");
      return;
    }

    setImportLoading(true);
    const formData = new FormData();
    formData.append("file", importFile);

    try {
      const response = await axios.post(
        "http://localhost:3001/inventory/import/excel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImportResults(response.data.results);
      toast.success(
        `Import thành công ${response.data.results.success} sản phẩm`
      );

      // Refresh inventory data
      fetchInventory();

      // Reset form
      setImportFile(null);
      setShowImportModal(false);
    } catch (error) {
      console.error("Error importing Excel:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Lỗi khi import file Excel");
      }
    } finally {
      setImportLoading(false);
    }
  };

  // Handle template download
  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/inventory/template/excel",
        {
          responseType: "blob",
        }
      );

      saveAs(new Blob([response.data]), "inventory-template.xlsx");
      toast.success("Download template thành công!");
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Lỗi khi download template");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-72" : "ml-20"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Quản lý tồn kho
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-orange-600 text-white rounded-full flex items-center"
              >
                <i className="bx bx-upload"></i>
                <span className="ml-2">Nhập Excel</span>
              </button>
              <button
                onClick={handleExportExcel}
                className="px-4 py-2 bg-purple-600 text-white rounded-full flex items-center"
              >
                <i className="bx bx-download"></i>
                <span className="ml-2">Xuất Excel</span>
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Tổng sản phẩm
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {stats.total_products || 0}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Tổng tồn kho
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {stats.total_stock || 0}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Hết hàng</h3>
              <p className="text-2xl font-bold text-red-600">
                {stats.out_of_stock || 0}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Sắp hết hàng
              </h3>
              <p className="text-2xl font-bold text-orange-600">
                {stats.low_stock || 0}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Còn hàng</h3>
              <p className="text-2xl font-bold text-green-600">
                {stats.in_stock || 0}
              </p>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Danh sách tồn kho
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Danh mục
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tồn kho
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={`/img/${item.img}`}
                            alt={item.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {item.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.category_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.price?.toLocaleString("vi-VN")}đ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            item.stock_status
                          )}`}
                        >
                          {item.stock_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openUpdateModal(item)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors"
                        >
                          Cập nhật
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Update Inventory Modal */}
        {showUpdateModal && selectedProduct && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Cập nhật tồn kho - {selectedProduct.name}
                </h3>
                <form onSubmit={handleUpdateInventory}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hành động
                    </label>
                    <select
                      value={updateForm.action}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, action: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="set">Đặt số lượng</option>
                      <option value="add">Thêm vào kho</option>
                      <option value="subtract">Trừ khỏi kho</option>
                    </select>
                  </div>

                  {updateForm.action === "set" ? (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số lượng mới
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={updateForm.quantity}
                        onChange={(e) =>
                          setUpdateForm({
                            ...updateForm,
                            quantity: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số lượng {updateForm.action === "add" ? "thêm" : "trừ"}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={updateForm.amount}
                        onChange={(e) =>
                          setUpdateForm({
                            ...updateForm,
                            amount: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUpdateModal(false);
                        setSelectedProduct(null);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Cập nhật
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Import Excel Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Nhập dữ liệu từ Excel
                </h3>

                <div className="mb-4">
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
                  >
                    <i className="bx bx-download mr-2"></i>
                    Tải Template Excel
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Tải template để xem cấu trúc file Excel cần thiết
                  </p>
                </div>

                <form onSubmit={handleImportExcel}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn file Excel (.xlsx, .xls)
                    </label>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(e) => setImportFile(e.target.files[0])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-red-600 mt-1">
                      Chỉ cập nhật cột "Tồn kho" trong file Excel
                    </p>
                  </div>

                  {importResults && (
                    <div className="mb-4 p-3 bg-gray-100 rounded-md">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Kết quả import:
                      </h4>
                      <div className="text-sm text-gray-600">
                        <p>Tổng: {importResults.total}</p>
                        <p className="text-green-600">
                          Thành công: {importResults.success}
                        </p>
                        <p className="text-red-600">
                          Thất bại: {importResults.failed}
                        </p>
                        {importResults.errors.length > 0 && (
                          <div className="mt-2">
                            <p className="font-medium">Lỗi:</p>
                            <ul className="list-disc list-inside text-xs">
                              {importResults.errors
                                .slice(0, 3)
                                .map((error, index) => (
                                  <li key={index}>{error}</li>
                                ))}
                              {importResults.errors.length > 3 && (
                                <li>
                                  ... và {importResults.errors.length - 3} lỗi
                                  khác
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowImportModal(false);
                        setImportFile(null);
                        setImportResults(null);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={importLoading}
                      className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                    >
                      {importLoading ? (
                        <span className="flex items-center">
                          <i className="bx bx-loader-alt animate-spin mr-2"></i>
                          Đang xử lý...
                        </span>
                      ) : (
                        "Nhập Excel"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
