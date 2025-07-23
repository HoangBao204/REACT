import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Shop = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams(); 
  const [listFiltered, setListFiltered] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;
  const searchKeyword = searchParams.get("search") || "";

    useEffect(() => {
      if (searchKeyword) {
        fetchProductsBySearch(searchKeyword);
      } else if (!id) {
        fetchProducts();
      } else {
        fetchProductsByCategory(id);
      }
    }, [id, sortOrder, currentPage, searchKeyword]);
    // 1. Tìm kiếm
    const fetchProductsBySearch = (keyword) => {
      let url = `http://localhost:3001/search?q=${encodeURIComponent(keyword)}`;
      axios.get(url)
        .then(response => {
          setListFiltered(response.data.products || []);
          setTotalPages(1); // Không phân trang kết quả tìm kiếm (hoặc tự chia nếu muốn)
        })
        .catch(error => {
          console.error("Lỗi tìm kiếm:", error);
          setListFiltered([]);
        });
    };


  useEffect(() => {
    axios.get('http://localhost:3001/categories')
      .then(response => {
        setCategories(response.data.categories.filter(c => c.name !== 'Tất cả'));
      })
      .catch(error => console.error('Error loading categories:', error));
  }, []);
    // 2. Tất cả sản phẩm
  const fetchProducts = () => {
    let url = `http://localhost:3001/product?page=${currentPage}&limit=${itemsPerPage}`;
    if (sortOrder) url += `&sort=${sortOrder}`;
    axios.get(url)
      .then(response => {
        setListFiltered(response.data.products);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      })
      .catch(error => console.error('Error fetching products:', error));
  };
  // 3. Theo danh mục
  const fetchProductsByCategory = (categoryId) => {
    let url = `http://localhost:3001/product/category/${categoryId}?page=${currentPage}&limit=${itemsPerPage}`;
    if (sortOrder) url += `&sort=${sortOrder}`;
    axios.get(url)
      .then(response => {
        setListFiltered(response.data.products_all);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      })
      .catch(error => console.error('Error fetching products by category:', error));
  };

  // useEffect(() => {
  //   if (!id) {
  //     fetchProducts();
  //   } else {
  //     fetchProductsByCategory(id);
  //   }
  // }, [id, sortOrder, currentPage]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
    setSearchParams({ page: 1 });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ page });
  };

  return (
    <div className="container mx-auto grid grid-cols-4 p-8 gap-4 mt-5 w-10/12 m-auto">
      {/* Sidebar menu */}
      <div className="col-span-1">
        <ul className="list-group">
          <li className="list-group-item">
            <Link to="/shop" className="block px-4 py-2 hover:bg-gray-100">Tất cả</Link>
          </li>
          {categories.map(category => (
            <li key={category.id} className="list-group-item">
              <Link to={`/shop/${category.id}?page=1`} className="block px-4 py-2 hover:bg-gray-100">
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Sản phẩm + bộ lọc */}
      <div className="col-span-3">
        <div className="flex justify-end mb-4">
          <select
            onChange={handleSortChange}
            value={sortOrder}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="">-- Sắp xếp theo giá --</option>
            <option value="asc">Giá thấp đến cao</option>
            <option value="desc">Giá cao đến thấp</option>
          </select>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {listFiltered.map(item => (
            <div key={item.id} className="border border-gray-300">
              <div className="w-full h-[300px] overflow-hidden">
                <img src={`/img/${item.img}`} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-center p-2">
                <Link to={`/product/${item.id}`} className="text-black no-underline">{item.name}</Link>
                <div className="font-semibold">{formatPrice(item.price)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
