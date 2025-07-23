// Import các module cần thiết
const express = require("express");
const mysql = require("mysql"); // Đảm bảo bạn đã import mysql ở đây
const cors = require("cors");
const XLSX = require("xlsx");
const multer = require("multer");
const router = express.Router();
const PORT = 3002;


// Tạo ứng dụng Express
const app = express();
const port = 3001;

// Sử dụng CORS middleware
app.use(cors());
app.use(express.json());

// Cấu hình multer cho file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file Excel (.xlsx, .xls)"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Thiết lập kết nối cơ sở dữ liệu
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Nhớ cập nhật mật khẩu nếu cần
  database: "asm1",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

// Định nghĩa route cơ bản
app.get("/", (req, res) => {
  res.json({ message: "Api node-js asm" });
});

app.post("/product", (req, res) => {
  const insertQuery =
    "INSERT INTO products (name, price, img, imgHover, id_cate, quantity) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    insertQuery,
    [
      req.body.name,
      req.body.price,
      req.body.imgMain,
      req.body.imgHover,
      req.body.id_cate,
      req.body.quantity || 0, // Default to 0 if not provided
    ],
    (err, result) => {
      if (err) {
        return res.json({ error: err });
      }

      return res.status(200).json({
        newProductId: result.insertId,
      });
    }
  );
});

// Định nghĩa route lấy sản phẩm theo ID

app.get("/product/:id", async (req, res) => {
  const productId = Number(req.params.id);
  const productQuery = `SELECT * FROM products WHERE id = ?`;

  db.query(productQuery, [productId], (err, result) => {
    if (err) {
      return res.json({ error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({
      productInfo: result[0],
    });
  });
});

app.put("/product/:id", (req, res) => {
  const productId = req.params.id;
  const { name, price, img, imgHover, id_cate, quantity } = req.body;
  const updateQuery =
    "UPDATE products SET name = ?, price = ?, img = ?, imgHover = ?, id_cate = ?, quantity = ? WHERE id = ?";

  db.query(
    updateQuery,
    [name, price, img, imgHover, id_cate, quantity, productId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product updated successfully" });
    }
  );
});

app.delete("/product/:id", (req, res) => {
  const productId = req.params.id;
  const deleteQuery = "DELETE FROM products WHERE id = ?";

  db.query(deleteQuery, [productId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  });
});

app.get("/product/:id/sizes", async (req, res) => {
  const productId = Number(req.params.id);
  const sizeQuery = `SELECT * FROM sizes WHERE id_product = ?`;

  db.query(sizeQuery, [productId], (err, result) => {
    if (err) {
      return res.json({ error: err });
    }

    return res.json({
      sizes: result,
    });
  });
});

app.post("/product/:id/sizes", (req, res) => {
  const productId = req.params.id;
  const { newSize } = req.body;

  const queryString = `INSERT INTO sizes(name, id_product) VALUE (?, ?)`;

  db.query(queryString, [newSize, productId], (err, result) => {
    if (err) {
      return res.json({ error: err });
    }

    console.log(result);

    res.json({ sizeId: result.insertId });
  });
});

app.delete("/product/:id/sizes/:sizeid", (req, res) => {
  const productId = req.params.id;
  const sizeId = req.params.sizeid;

  const queryString = `DELETE FROM sizes WHERE id = ? AND id_product = ?`;

  db.query(queryString, [sizeId, productId], (err, result) => {
    if (err) {
      return res.json({ error: err });
    }

    console.log(result);

    res.json({ status: "success" });
  });
});

app.get("/product/:id/colors", async (req, res) => {
  const productId = Number(req.params.id);
  const colorQuery = `SELECT * FROM colors WHERE id_product = ?`;

  db.query(colorQuery, [productId], (err, result) => {
    if (err) {
      return res.json({ error: err });
    }

    return res.json({
      colors: result,
    });
  });
});

app.post("/product/:id/colors", (req, res) => {
  const productId = req.params.id;

  const { newColor } = req.body;

  const queryString = `INSERT INTO colors(name, id_product) VALUE (?, ?)`;

  db.query(queryString, [newColor, productId], (err, result) => {
    if (err) {
      return res.json({ error: err });
    }

    res.json({ colorId: result.insertId });
  });
});

app.delete("/product/:id/colors/:colorid", (req, res) => {
  const productId = req.params.id;
  const colorId = req.params.colorid;

  const queryString = `DELETE FROM colors WHERE id = ? AND id_product = ?`;

  db.query(queryString, [colorId, productId], (err, result) => {
    if (err) {
      return res.json({ error: err });
    }

    console.log(result);

    res.json({ status: "success" });
  });
});

// Định nghĩa route lấy dữ liệu sản phẩm
app.get("/product", (req, res) => {
  const productsQuery = "SELECT * FROM products ORDER BY id DESC";

  db.query(productsQuery, (err, results) => {
    if (err) {
      return res.json({ error: err });
    }
    res.json({ products: results });
  });
});

app.get("/newproduct", (req, res) => {
  const productsQuery =
    "SELECT * FROM products WHERE id_cate = 2 ORDER BY id DESC LIMIT 8";

  db.query(productsQuery, (err, results) => {
    if (err) {
      return res.json({ error: err });
    }
    res.json({ newproducts: results });
  });
});

app.get("/shop/:id_cate", function (req, res) {
  let id_cate = req.params.id_cate;
  if (isNaN(id_cate)) return res.json({ Message: "Sản Phẩm Ko tồn tại" });

  let sql = "SELECT * FROM products WHERE id_cate = ? ORDER BY id_cate DESC";
  db.query(sql, [id_cate], function (err, results) {
    if (err) {
      res.json({ "có lỗi": err });
    } else if (results.length == 0) {
      res.json({ Message: "Ko có sản phẩm có id_cate trên" });
    } else {
      res.json({ products_all: results });
    }
  });
});

app.get("/categories", (req, res) => {
  console.log("Fetching categories...");

  // Thử query đơn giản trước
  const simpleQuery = `
    SELECT 
      c.id,
      c.name,
      COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.id_cate
    GROUP BY c.id, c.name
    ORDER BY c.id ASC
  `;

  console.log("Simple categories query:", simpleQuery);

  db.query(simpleQuery, (err, results) => {
    if (err) {
      console.error("Error fetching categories:", err);
      return res.status(500).json({ error: err.message });
    }

    console.log("Categories results:", results);

    // Nếu vẫn 0, thử query debug
    if (results.length > 0 && results.every((cat) => cat.product_count === 0)) {
      console.log("All product_count are 0, trying debug query...");

      const debugQuery = `
        SELECT 
          c.id,
          c.name,
          COUNT(p.id) as product_count,
          GROUP_CONCAT(p.id) as product_ids
        FROM categories c
        LEFT JOIN products p ON c.id = p.id_cate
        GROUP BY c.id, c.name
        ORDER BY c.id ASC
      `;

      db.query(debugQuery, (err2, debugResults) => {
        if (err2) {
          console.error("Error in debug query:", err2);
          return res.status(500).json({ error: err2.message });
        }

        console.log("Debug results:", debugResults);
        res.json({ categories: results, debug: debugResults });
      });
    } else {
      res.json({ categories: results });
    }
  });
});

// lấy thông tin người dùng từ user đổ lên cart
app.get("/user/:email", (req, res) => {
  const { email } = req.params;
  const sql = "SELECT * FROM user WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn database:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json(results[0]); // Trả về thông tin người dùng
  });
});

app.get("/user/:userId/orders", (req, res) => {
  const userId = req.params.userId;

  const sql = `SELECT * FROM orders WHERE id_user = ?`;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi truy vấn MySQL" });
    }
    res.json({ orders: results });
  });
});

app.post("/login", (req, res) => {
  const { email, pass } = req.body;
  console.log("Received login request:", req.body);
  const sql = "SELECT * FROM user WHERE email = ? AND pass = ?";

  db.query(sql, [email, pass], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    const { id, username, email, role } = user;

    res.status(200).json({
      message: "Login successful",
      id: id,
      username: username,
      email: email,
      role: role,
    });
  });
});

app.post("/register", (req, res) => {
  const { email, pass, username, phone, address } = req.body;
  console.log("Received registration request:", req.body);

  if (!email || !pass || !username) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql =
    "INSERT INTO user (email, pass, username,phone, address, role) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [email, pass, username, phone, address, 1], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ message: "Internal server error", error: err });
    }
    console.log("User registered successfully");
    res.status(201).json({ message: "User registered successfully" });
  });
});

// Search products by name
app.get("/search", (req, res) => {
  const searchTerm = req.query.q;
  const searchQuery = "SELECT * FROM products WHERE name LIKE ?";

  db.query(searchQuery, [`%${searchTerm}%`], (err, results) => {
    if (err) {
      return res.json({ error: err });
    }
    res.json({ products: results });
  });
});

app.get("/orders", (req, res, next) => {
  const sql = `select o.*, u.email, u.username
                        from orders as o
                        left join user as u 
                            on u.id = o.id_user`;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi truy vấn MySQL" });
    }
    res.json({ orders: results });
  });
});

app.get("/orders/:id", (req, res, next) => {
  const sql = `select o.*, u.email, u.username
                        from orders as o
                        left join user as u 
                            on u.id = o.id_user
                            WHERE o.id = ?`;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi truy vấn MySQL" });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: "Không tìm thấy đơn hàng" });
    }

    res.json({ orders: results[0] });
  });
});

app.get("/order-details/:id", (req, res) => {
  const sql = `SELECT odetails.*, p.name, p.img, s.name as 'sizeName', c.name as 'colorName' FROM asm1.orders_detail as odetails 
	join products as p on p.id = odetails.id_product
    left join sizes as s on s.id = odetails.size
    left join colors as c on c.id = odetails.color
where id_orders = ?`;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi truy vấn MySQL" });
    }

    res.json({ orderItems: results });
  });
});

// API tạo đơn hàng
app.post("/orders", (req, res) => {
  const {
    id_user,
    name,
    phone,
    email,
    address,
    cart,
    note,
    paymentMethod,
    totalPrice,
    couponCode,
  } = req.body;

  const orderSql =
    "INSERT INTO orders (id_user, name, phone, email, address, note, paymentMethod, totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  // return res.status(201).json({ message: "Đơn hàng đã được tạo!", orderId });

  db.query(
    orderSql,
    [
      id_user || null,
      name,
      phone,
      email,
      address,
      note,
      paymentMethod,
      totalPrice,
    ],
    (err, result) => {
      if (err) {
        console.error("Lỗi khi tạo đơn hàng:", err);
        return res.status(500).json({ message: "Lỗi server khi tạo đơn hàng" });
      }

      const orderId = result.insertId;
      console.log("Đơn hàng đã được tạo, ID:", orderId);

      const addOrderItemsQuery = `INSERT INTO orders_detail (id_orders, id_product, price, quantity, size, color) VALUES `;

      const cartItemsQuery = cart
        .map((item) => `(?, ?, ?, ?, ?, ?)`)
        .join(", ");
      const cartItemsValues = cart
        .map((item) => [
          orderId,
          item.id,
          item.price,
          item.quantity,
          item.size,
          item.color,
        ])
        .flat();

      console.log(
        "Các sản phẩm trong giỏ hàng:",
        cartItemsQuery,
        cartItemsValues
      ); // Debug

      db.query(
        addOrderItemsQuery + cartItemsQuery,
        [...cartItemsValues],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Lỗi server khi thêm sản phẩm vào đơn hàng" });
          }
          console.log(result);
        }
      );

      // Nếu có mã giảm giá, lưu vào bảng order_coupons
      if (couponCode) {
        const couponSql = "SELECT id FROM coupons WHERE code = ?";
        db.query(couponSql, [couponCode], (err, couponResult) => {
          if (err || couponResult.length === 0) {
            console.error("Lỗi khi kiểm tra mã giảm giá:", err);
            return res
              .status(400)
              .json({ message: "Mã giảm giá không hợp lệ" });
          }

          const couponId = couponResult[0].id;
          const orderCouponSql =
            "INSERT INTO order_coupons (order_id, couponS_id) VALUES (?, ?)";

          db.query(orderCouponSql, [orderId, couponId], (err) => {
            if (err) {
              console.error("Lỗi khi lưu mã giảm giá:", err);
              return res
                .status(500)
                .json({ message: "Lỗi server khi áp dụng mã giảm giá" });
            }

            res.status(201).json({
              message: "Đơn hàng đã được tạo và áp dụng mã giảm giá!",
              orderId,
            });
          });
        });
      } else {
        res.status(201).json({ message: "Đơn hàng đã được tạo!", orderId });
      }
    }
  );
});

app.put("/orders/:id/status", (req, res) => {
  const { newStatus } = req.body;

  const sql = `UPDATE orders SET status = ? WHERE id = ?`;

  db.query(sql, [newStatus, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi truy vấn MySQL" });
    }

    res.json({ message: "Cập nhật trạng thái đơn hàng thành công" });
  });
});

app.post("/orders_detail", (req, res) => {
  const { id_user, cart } = req.body;

  // Tạo một đơn hàng mới trong bảng orders
  const orderQuery = `INSERT INTO orders (id_user, totalPrice, status) VALUES (?, ?, 'pending')`;
  db.query(orderQuery, [id_user, cart.totalPrice], (err, result) => {
    if (err) throw err;

    const orderId = result.insertId;

    // Lưu từng sản phẩm trong giỏ hàng vào bảng orders_detail
    cart.items.forEach((item) => {
      const detailQuery = `INSERT INTO orders_detail (id_orders, id_product, price, quantity) VALUES (?, ?, ?, ?)`;
      db.query(
        detailQuery,
        [orderId, item.id, item.price, item.quantity],
        (err, result) => {
          if (err) throw err;
        }
      );
    });

    res.status(200).send("Order placed successfully");
  });
});

app.get("/coupons", (req, res) => {
  const sql = "SELECT id, code, discount_value FROM coupons";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách mã giảm giá:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
    res.status(200).json({ coupons: results });
  });
});

app.get("/coupons/:code", (req, res) => {
  const { code } = req.params;
  console.log("Mã giảm giá nhận được từ frontend:", code); // Debug

  const sql = "SELECT * FROM coupons WHERE code = ?";

  db.query(sql, [code], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn MySQL:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
    console.log("Kết quả truy vấn:", results); // Debug

    if (results.length === 0) {
      return res.status(404).json({ message: "Mã giảm giá không hợp lệ" });
    }

    res.status(200).json({ discount_value: results[0].discount_value });
  });
});

// // Lấy thông tin user theo email
// app.get('/user/:email', (req, res) => {
//   const email = req.params.email;
//   const sql = 'SELECT id, name, email FROM users WHERE email = ?';

//   db.query(sql, [email], (err, results) => {
//       if (err) {
//           return res.status(500).json({ message: 'Lỗi server', error: err });
//       }
//       if (results.length === 0) {
//           return res.status(404).json({ message: 'Người dùng không tồn tại' });
//       }
//       res.json(results[0]); // Trả về user đầu tiên tìm thấy
//   });
// });

// // Lấy danh sách đơn hàng của user theo userId
// app.get('/orders/user/:userId', (req, res) => {
//   const userId = req.params.userId;
//   const sql = 'SELECT * FROM orders WHERE id_user = ? ORDER BY created_at DESC';

//   db.query(sql, [userId], (err, results) => {
//       if (err) {
//           return res.status(500).json({ message: 'Lỗi server', error: err });
//       }
//       res.json(results);
//   });
// });

// Lấy danh sách review của sản phẩm
app.get("/reviews/:product_id", (req, res) => {
  const productId = req.params.product_id;
  const sql = "SELECT * FROM review WHERE product_id = ?";

  db.query(sql, [productId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi truy vấn MySQL" });
    }
    res.json(result);
  });
});

// Thêm review mới
app.post("/reviews", (req, res) => {
  const { product_id, user_id, content } = req.body;
  const updated_at = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại

  if (!product_id || !user_id || !content) {
    return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin" });
  }

  const sql =
    "INSERT INTO review (product_id, user_id, updated_at, content) VALUES (?, ?, ?, ?)";

  db.query(sql, [product_id, user_id, updated_at, content], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi thêm review" });
    }
    res.json({ success: true, message: "Review đã được thêm" });
  });
});

// Xóa review
app.delete("/reviews/:product_id/:user_id", (req, res) => {
  const { product_id, user_id } = req.params;
  const sql = "DELETE FROM review WHERE product_id = ? AND user_id = ?";

  db.query(sql, [product_id, user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi xóa review" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy review để xóa" });
    }
    res.json({ success: true, message: "Review đã bị xóa" });
  });
});

// ===== INVENTORY MANAGEMENT ROUTES =====

// Lấy thông tin tồn kho của tất cả sản phẩm
app.get("/inventory", (req, res) => {
  const { search, category, status, sort } = req.query;

  let inventoryQuery = `
    SELECT p.id, p.name, p.price, p.quantity, p.img, c.name as category_name,
           CASE 
             WHEN p.quantity = 0 THEN 'Hết hàng'
             WHEN p.quantity <= 10 THEN 'Sắp hết hàng'
             ELSE 'Còn hàng'
           END as stock_status
    FROM products p
    LEFT JOIN categories c ON p.id_cate = c.id
    WHERE 1=1
  `;

  const queryParams = [];

  // Search by name
  if (search) {
    inventoryQuery += ` AND (p.name LIKE ? OR c.name LIKE ?)`;
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  // Filter by category
  if (category && category !== "all") {
    inventoryQuery += ` AND c.id = ?`;
    queryParams.push(category);
  }

  // Filter by status
  if (status && status !== "all") {
    if (status === "out") {
      inventoryQuery += ` AND p.quantity = 0`;
    } else if (status === "low") {
      inventoryQuery += ` AND p.quantity <= 10 AND p.quantity > 0`;
    } else if (status === "in") {
      inventoryQuery += ` AND p.quantity > 10`;
    }
  }

  // Add sorting
  switch (sort) {
    case "id_asc":
      inventoryQuery += ` ORDER BY p.id ASC`;
      break;
    case "id_desc":
      inventoryQuery += ` ORDER BY p.id DESC`;
      break;
    case "name_asc":
      inventoryQuery += ` ORDER BY p.name ASC`;
      break;
    case "name_desc":
      inventoryQuery += ` ORDER BY p.name DESC`;
      break;
    case "price_asc":
      inventoryQuery += ` ORDER BY p.price ASC`;
      break;
    case "price_desc":
      inventoryQuery += ` ORDER BY p.price DESC`;
      break;
    case "quantity_asc":
      inventoryQuery += ` ORDER BY p.quantity ASC`;
      break;
    case "quantity_desc":
      inventoryQuery += ` ORDER BY p.quantity DESC`;
      break;
    default:
      inventoryQuery += ` ORDER BY p.id ASC`; // Default sort by ID ascending
  }

  db.query(inventoryQuery, queryParams, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ inventory: results });
  });
});

// Lấy danh sách sản phẩm sắp hết hàng (quantity <= 10)
app.get("/inventory/low-stock", (req, res) => {
  const lowStockQuery = `
    SELECT p.id, p.name, p.price, p.quantity, p.img, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.id_cate = c.id
    WHERE p.quantity <= 10
    ORDER BY p.quantity ASC
  `;

  db.query(lowStockQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ lowStockProducts: results });
  });
});

// Lấy danh sách sản phẩm hết hàng (quantity = 0)
app.get("/inventory/out-of-stock", (req, res) => {
  const outOfStockQuery = `
    SELECT p.id, p.name, p.price, p.quantity, p.img, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.id_cate = c.id
    WHERE p.quantity = 0
    ORDER BY p.name ASC
  `;

  db.query(outOfStockQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ outOfStockProducts: results });
  });
});

// Thống kê tồn kho
app.get("/inventory/stats", (req, res) => {
  const statsQuery = `
    SELECT 
      COUNT(*) as total_products,
      SUM(quantity) as total_stock,
      COUNT(CASE WHEN quantity = 0 THEN 1 END) as out_of_stock,
      COUNT(CASE WHEN quantity <= 10 AND quantity > 0 THEN 1 END) as low_stock,
      COUNT(CASE WHEN quantity > 10 THEN 1 END) as in_stock,
      AVG(quantity) as avg_stock
    FROM products
  `;

  db.query(statsQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ stats: results[0] });
  });
});

// Lấy thống kê tồn kho theo danh mục
app.get("/inventory/stats/by-category", (req, res) => {
  const categoryStatsQuery = `
    SELECT 
      c.id,
      c.name as category_name,
      COUNT(p.id) as total_products,
      SUM(p.quantity) as total_stock,
      COUNT(CASE WHEN p.quantity = 0 THEN 1 END) as out_of_stock,
      COUNT(CASE WHEN p.quantity <= 10 AND p.quantity > 0 THEN 1 END) as low_stock,
      COUNT(CASE WHEN p.quantity > 10 THEN 1 END) as in_stock,
      AVG(p.quantity) as avg_stock
    FROM categories c
    LEFT JOIN products p ON c.id = p.id_cate
    GROUP BY c.id, c.name
    ORDER BY c.name
  `;

  db.query(categoryStatsQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ categoryStats: results });
  });
});

// Lấy thông tin tồn kho của một sản phẩm cụ thể
app.get("/inventory/product/:productId", (req, res) => {
  const productId = req.params.productId;
  const inventoryQuery = `
    SELECT p.id, p.name, p.price, p.quantity, p.img, c.name as category_name,
           CASE 
             WHEN p.quantity = 0 THEN 'Hết hàng'
             WHEN p.quantity <= 10 THEN 'Sắp hết hàng'
             ELSE 'Còn hàng'
           END as stock_status
    FROM products p
    LEFT JOIN categories c ON p.id_cate = c.id
    WHERE p.id = ?
  `;

  db.query(inventoryQuery, [productId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ inventory: results[0] });
  });
});

// Cập nhật số lượng tồn kho
app.put("/inventory/product/:productId", (req, res) => {
  const productId = req.params.productId;
  const { quantity, action, amount } = req.body;

  console.log("Update inventory request:", {
    productId,
    body: req.body,
    action,
    quantity,
    amount,
  });

  // Validation
  if (!productId || isNaN(productId)) {
    console.log("Invalid product ID:", productId);
    return res.status(400).json({ message: "Invalid product ID" });
  }

  if (!action || !["add", "subtract", "set"].includes(action)) {
    console.log("Invalid action:", action);
    return res
      .status(400)
      .json({ message: "Invalid action. Use 'add', 'subtract', or 'set'" });
  }

  if (action === "set") {
    if (quantity === undefined || quantity === null || quantity < 0) {
      console.log("Invalid quantity for set action:", quantity);
      return res
        .status(400)
        .json({ message: "Quantity must be a non-negative number" });
    }
  }

  if (action === "add" || action === "subtract") {
    if (amount === undefined || amount === null || amount <= 0) {
      console.log("Invalid amount for add/subtract action:", amount);
      return res
        .status(400)
        .json({ message: "Amount must be a positive number" });
    }
  }

  let updateQuery;
  let queryParams;

  if (action === "add") {
    // Thêm vào kho
    updateQuery = "UPDATE products SET quantity = quantity + ? WHERE id = ?";
    queryParams = [parseInt(amount), parseInt(productId)];
  } else if (action === "subtract") {
    // Trừ khỏi kho
    updateQuery =
      "UPDATE products SET quantity = GREATEST(0, quantity - ?) WHERE id = ?";
    queryParams = [parseInt(amount), parseInt(productId)];
  } else if (action === "set") {
    // Đặt số lượng cụ thể
    updateQuery = "UPDATE products SET quantity = ? WHERE id = ?";
    queryParams = [parseInt(quantity), parseInt(productId)];
  }

  console.log("Executing query:", updateQuery, "with params:", queryParams);

  db.query(updateQuery, queryParams, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ error: "Database error occurred", details: err.message });
    }
    console.log("Update result:", result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({
      message: "Inventory updated successfully",
      affectedRows: result.affectedRows,
    });
  });
});
// quản lý người dùng
app.get('/api/ql_order', (req, res) => {
  const sql = 'SELECT * FROM orders'; // 
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Lỗi khi truy vấn dữ liệu' });
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

app.put("/api/ql_order/:id", (req, res) => {
  const orderId = req.params.id;
  const { name, email, phone, order_date, status } = req.body;

  const sql =
    "UPDATE orders SET name = ?, email = ?, phone = ?, order_date = ?, status = ? WHERE id = ?";
  const values = [name, email, phone, order_date, status, orderId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật đơn hàng:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.json({ message: "Cập nhật thành công" });
  });
});


// ===== EXCEL EXPORT ROUTES =====
app.get("/inventory/export/excel", (req, res) => {
  const { search, status, sort } = req.query;

  let inventoryQuery = `
    SELECT 
      p.id,
      p.name,
      p.price,
      p.quantity,
      c.name as category_name,
      CASE 
        WHEN p.quantity = 0 THEN 'Hết hàng'
        WHEN p.quantity <= 10 THEN 'Sắp hết hàng'
        ELSE 'Còn hàng'
      END as stock_status
    FROM products p
    LEFT JOIN categories c ON p.id_cate = c.id
    WHERE 1=1
  `;

  const queryParams = [];

  // Add search filter
  if (search) {
    inventoryQuery += ` AND (p.name LIKE ? OR c.name LIKE ?)`;
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  // Add status filter
  if (status && status !== "all") {
    switch (status) {
      case "out":
        inventoryQuery += ` AND p.quantity = 0`;
        break;
      case "low":
        inventoryQuery += ` AND p.quantity <= 10 AND p.quantity > 0`;
        break;
      case "in":
        inventoryQuery += ` AND p.quantity > 10`;
        break;
    }
  }

  // Add sorting
  switch (sort) {
    case "id_asc":
      inventoryQuery += ` ORDER BY p.id ASC`;
      break;
    case "id_desc":
      inventoryQuery += ` ORDER BY p.id DESC`;
      break;
    case "name_asc":
      inventoryQuery += ` ORDER BY p.name ASC`;
      break;
    case "name_desc":
      inventoryQuery += ` ORDER BY p.name DESC`;
      break;
    case "price_asc":
      inventoryQuery += ` ORDER BY p.price ASC`;
      break;
    case "price_desc":
      inventoryQuery += ` ORDER BY p.price DESC`;
      break;
    case "quantity_asc":
      inventoryQuery += ` ORDER BY p.quantity ASC`;
      break;
    case "quantity_desc":
      inventoryQuery += ` ORDER BY p.quantity DESC`;
      break;
    default:
      inventoryQuery += ` ORDER BY p.id ASC`; // Default sort by ID ascending
  }

  db.query(inventoryQuery, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching inventory for export:", err);
      return res.status(500).json({ error: err.message });
    }

    try {
      // Prepare data for Excel
      const excelData = results.map((item) => ({
        ID: item.id,
        "Tên sản phẩm": item.name,
        "Danh mục": item.category_name,
        "Giá (VNĐ)": item.price?.toLocaleString("vi-VN"),
        "Tồn kho": item.quantity,
        "Trạng thái": item.stock_status,
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const columnWidths = [
        { wch: 8 }, // ID
        { wch: 30 }, // Tên sản phẩm
        { wch: 20 }, // Danh mục
        { wch: 15 }, // Giá
        { wch: 12 }, // Tồn kho
        { wch: 15 }, // Trạng thái
      ];
      worksheet["!cols"] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Tồn kho");

      // Generate buffer
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      // Set headers for file download
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="inventory-${timestamp}.xlsx"`
      );

      res.send(buffer);
    } catch (error) {
      console.error("Error creating Excel file:", error);
      res.status(500).json({ error: "Error creating Excel file" });
    }
  });
});

// ===== EXCEL IMPORT ROUTES =====
app.post("/inventory/import/excel", upload.single("file"), (req, res) => {
  console.log("Import Excel request received");

  if (!req.file) {
    console.log("No file uploaded");
    return res.status(400).json({ error: "Không có file được upload" });
  }

  console.log("File uploaded:", req.file.originalname, "Size:", req.file.size);

  try {
    // Đọc file Excel
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    console.log("Excel sheet name:", sheetName);

    // Chuyển đổi thành JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    console.log("Total rows in Excel:", jsonData.length);
    console.log("Headers:", jsonData[0]);

    if (jsonData.length < 2) {
      return res
        .status(400)
        .json({ error: "File Excel không có dữ liệu hoặc thiếu header" });
    }

    // Lấy header (dòng đầu tiên)
    const headers = jsonData[0];
    const dataRows = jsonData.slice(1);

    console.log("Data rows to process:", dataRows.length);

    // Validate headers
    const requiredHeaders = [
      "ID",
      "Tên sản phẩm",
      "Danh mục",
      "Giá (VNĐ)",
      "Tồn kho",
      "Trạng thái",
    ];
    const missingHeaders = requiredHeaders.filter(
      (header) => !headers.includes(header)
    );

    if (missingHeaders.length > 0) {
      return res.status(400).json({
        error: `Thiếu các cột bắt buộc: ${missingHeaders.join(", ")}`,
      });
    }

    // Xử lý dữ liệu
    const results = {
      total: dataRows.length,
      success: 0,
      failed: 0,
      errors: [],
    };

    // Tạo promises cho tất cả các cập nhật
    const updatePromises = dataRows.map((row, index) => {
      return new Promise((resolve) => {
        try {
          console.log(`Processing row ${index + 2}:`, row);

          const id = parseInt(row[headers.indexOf("ID")]);
          const quantity = parseInt(row[headers.indexOf("Tồn kho")]);

          console.log(`Row ${index + 2} - ID: ${id}, Quantity: ${quantity}`);

          if (isNaN(id) || isNaN(quantity) || quantity < 0) {
            console.log(
              `Row ${index + 2} - Invalid data: ID=${id}, Quantity=${quantity}`
            );
            results.failed++;
            results.errors.push(
              `Dòng ${
                index + 2
              }: ID hoặc số lượng không hợp lệ (ID: ${id}, Quantity: ${quantity})`
            );
            resolve();
            return;
          }

          // Cập nhật quantity trong database
          const updateQuery = "UPDATE products SET quantity = ? WHERE id = ?";
          console.log(
            `Executing query: ${updateQuery} with params: [${quantity}, ${id}]`
          );

          db.query(updateQuery, [quantity, id], (err, result) => {
            if (err) {
              console.log(`Row ${index + 2} - Database error:`, err.message);
              results.failed++;
              results.errors.push(
                `Dòng ${index + 2}: Lỗi database - ${err.message}`
              );
            } else if (result.affectedRows === 0) {
              console.log(`Row ${index + 2} - No product found with ID: ${id}`);
              results.failed++;
              results.errors.push(
                `Dòng ${index + 2}: Không tìm thấy sản phẩm với ID ${id}`
              );
            } else {
              console.log(
                `Row ${index + 2} - Successfully updated, affected rows: ${
                  result.affectedRows
                }`
              );
              results.success++;
            }
            resolve();
          });
        } catch (error) {
          console.log(`Row ${index + 2} - Processing error:`, error.message);
          results.failed++;
          results.errors.push(
            `Dòng ${index + 2}: Lỗi xử lý - ${error.message}`
          );
          resolve();
        }
      });
    });

    // Chờ tất cả các cập nhật hoàn thành
    Promise.all(updatePromises).then(() => {
      console.log("Import results:", results);
      res.json({
        message: "Import Excel hoàn thành",
        results: results,
      });
    });
  } catch (error) {
    console.error("Error processing Excel file:", error);
    res.status(500).json({ error: "Lỗi xử lý file Excel" });
  }
});

// API để lấy template Excel
app.get("/inventory/template/excel", (req, res) => {
  try {
    // Tạo dữ liệu mẫu
    const templateData = [
      {
        ID: 1,
        "Tên sản phẩm": "Áo thun nam",
        "Danh mục": "Áo nam",
        "Giá (VNĐ)": "150,000",
        "Tồn kho": 50,
        "Trạng thái": "Còn hàng",
      },
      {
        ID: 2,
        "Tên sản phẩm": "Quần jean nữ",
        "Danh mục": "Quần nữ",
        "Giá (VNĐ)": "300,000",
        "Tồn kho": 0,
        "Trạng thái": "Hết hàng",
      },
    ];

    // Tạo workbook và worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(templateData);

    // Set column widths
    const columnWidths = [
      { wch: 8 }, // ID
      { wch: 30 }, // Tên sản phẩm
      { wch: 20 }, // Danh mục
      { wch: 15 }, // Giá
      { wch: 12 }, // Tồn kho
      { wch: 15 }, // Trạng thái
    ];
    worksheet["!cols"] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="inventory-template.xlsx"'
    );

    res.send(buffer);
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).json({ error: "Error creating template" });
  }
});

// Test API để kiểm tra cột quantity
app.get("/test/quantity", (req, res) => {
  const testQuery = `
    SELECT id, name, quantity, 
           CASE 
             WHEN quantity IS NULL THEN 'NULL'
             ELSE 'NOT NULL'
           END as quantity_status
    FROM products 
    LIMIT 5
  `;

  db.query(testQuery, (err, results) => {
    if (err) {
      console.error("Test query error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: "Quantity column test",
      results: results,
      totalProducts: results.length,
    });
  });
});

// Test API để kiểm tra tất cả sản phẩm
app.get("/test/products", (req, res) => {
  const testQuery = `
    SELECT id, name, quantity, price, id_cate
    FROM products 
    ORDER BY id
    LIMIT 10
  `;

  db.query(testQuery, (err, results) => {
    if (err) {
      console.error("Test products query error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: "Products test",
      results: results,
      totalProducts: results.length,
    });
  });
});

// Test API để kiểm tra categories và products
app.get("/test/categories-products", (req, res) => {
  console.log("Testing categories and products...");

  const testQuery = `
    SELECT 
      c.id as category_id,
      c.name as category_name,
      COUNT(p.id) as total_products,
      COUNT(CASE WHEN p.id_cate IS NOT NULL THEN p.id END) as valid_products,
      COUNT(CASE WHEN p.id_cate IS NULL THEN p.id END) as null_category_products
    FROM categories c
    LEFT JOIN products p ON c.id = p.id_cate
    GROUP BY c.id, c.name
    ORDER BY c.id
  `;

  console.log("Test query:", testQuery);

  db.query(testQuery, (err, results) => {
    if (err) {
      console.error("Test categories-products query error:", err);
      return res.status(500).json({ error: err.message });
    }

    console.log("Test results:", results);
    res.json({
      message: "Categories and Products test",
      results: results,
      totalCategories: results.length,
    });
  });
});

// Test API đơn giản để kiểm tra dữ liệu cơ bản
app.get("/test/basic-data", (req, res) => {
  console.log("Testing basic data...");

  // Kiểm tra categories
  const categoriesQuery = "SELECT COUNT(*) as count FROM categories";
  const productsQuery = "SELECT COUNT(*) as count FROM products";
  const productsWithCategoryQuery =
    "SELECT COUNT(*) as count FROM products WHERE id_cate IS NOT NULL";
  const productsWithoutCategoryQuery =
    "SELECT COUNT(*) as count FROM products WHERE id_cate IS NULL";

  db.query(categoriesQuery, (err1, categoriesResult) => {
    if (err1) {
      console.error("Error checking categories:", err1);
      return res.status(500).json({ error: err1.message });
    }

    db.query(productsQuery, (err2, productsResult) => {
      if (err2) {
        console.error("Error checking products:", err2);
        return res.status(500).json({ error: err2.message });
      }

      db.query(productsWithCategoryQuery, (err3, withCategoryResult) => {
        if (err3) {
          console.error("Error checking products with category:", err3);
          return res.status(500).json({ error: err3.message });
        }

        db.query(
          productsWithoutCategoryQuery,
          (err4, withoutCategoryResult) => {
            if (err4) {
              console.error("Error checking products without category:", err4);
              return res.status(500).json({ error: err4.message });
            }

            const basicData = {
              totalCategories: categoriesResult[0].count,
              totalProducts: productsResult[0].count,
              productsWithCategory: withCategoryResult[0].count,
              productsWithoutCategory: withoutCategoryResult[0].count,
            };

            console.log("Basic data results:", basicData);
            res.json({
              message: "Basic data test",
              data: basicData,
            });
          }
        );
      });
    });
  });
});

// Test API để kiểm tra dữ liệu mẫu
app.get("/test/sample-data", (req, res) => {
  console.log("Testing sample data...");

  // Lấy 5 categories đầu tiên
  const categoriesQuery =
    "SELECT id, name, description FROM categories LIMIT 5";
  // Lấy 5 products đầu tiên
  const productsQuery = "SELECT id, name, id_cate FROM products LIMIT 5";

  db.query(categoriesQuery, (err1, categoriesResult) => {
    if (err1) {
      console.error("Error fetching sample categories:", err1);
      return res.status(500).json({ error: err1.message });
    }

    db.query(productsQuery, (err2, productsResult) => {
      if (err2) {
        console.error("Error fetching sample products:", err2);
        return res.status(500).json({ error: err2.message });
      }

      console.log("Sample categories:", categoriesResult);
      console.log("Sample products:", productsResult);

      res.json({
        message: "Sample data test",
        categories: categoriesResult,
        products: productsResult,
      });
    });
  });
});

// Test API để kiểm tra relationship trực tiếp
app.get("/test/relationship", (req, res) => {
  console.log("Testing relationship...");

  // Test 1: Kiểm tra JOIN đơn giản
  const joinTestQuery = `
    SELECT 
      c.id as category_id,
      c.name as category_name,
      p.id as product_id,
      p.name as product_name,
      p.id_cate as product_category_id
    FROM categories c
    LEFT JOIN products p ON c.id = p.id_cate
    ORDER BY c.id, p.id
    LIMIT 10
  `;

  // Test 2: Kiểm tra COUNT theo từng category
  const countTestQuery = `
    SELECT 
      c.id,
      c.name,
      COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.id_cate
    GROUP BY c.id, c.name
    ORDER BY c.id
  `;

  // Test 3: Kiểm tra kiểu dữ liệu
  const dataTypeQuery = `
    SELECT 
      COLUMN_NAME,
      DATA_TYPE,
      IS_NULLABLE
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME IN ('categories', 'products')
    AND COLUMN_NAME IN ('id', 'id_cate')
    ORDER BY TABLE_NAME, COLUMN_NAME
  `;

  db.query(joinTestQuery, (err1, joinResults) => {
    if (err1) {
      console.error("Error in join test:", err1);
      return res.status(500).json({ error: err1.message });
    }

    db.query(countTestQuery, (err2, countResults) => {
      if (err2) {
        console.error("Error in count test:", err2);
        return res.status(500).json({ error: err2.message });
      }

      db.query(dataTypeQuery, (err3, dataTypeResults) => {
        if (err3) {
          console.error("Error in data type test:", err3);
          return res.status(500).json({ error: err3.message });
        }

        console.log("Join test results:", joinResults);
        console.log("Count test results:", countResults);
        console.log("Data type results:", dataTypeResults);

        res.json({
          message: "Relationship test",
          joinTest: joinResults,
          countTest: countResults,
          dataTypes: dataTypeResults,
        });
      });
    });
  });
});

// API để thêm cột quantity nếu chưa có
app.post("/setup/quantity", (req, res) => {
  const addColumnQuery = `
    ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 0
  `;

  const updateNullQuery = `
    UPDATE products 
    SET quantity = 50 
    WHERE quantity IS NULL OR quantity = 0
  `;

  db.query(addColumnQuery, (err, result) => {
    if (err) {
      console.error("Error adding quantity column:", err);
      return res.status(500).json({ error: err.message });
    }

    db.query(updateNullQuery, (err2, result2) => {
      if (err2) {
        console.error("Error updating null quantities:", err2);
        return res.status(500).json({ error: err2.message });
      }

      res.json({
        message: "Quantity column setup completed",
        columnAdded: result,
        rowsUpdated: result2.affectedRows,
      });
    });
  });
});

// ===== CATEGORIES API ROUTES =====

// Lấy một danh mục theo ID
app.get("/categories/:id", (req, res) => {
  const categoryId = req.params.id;
  const categoryQuery = `
    SELECT 
      c.id,
      c.name,
      COUNT(CASE WHEN p.id_cate IS NOT NULL THEN p.id END) as product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.id_cate
    WHERE c.id = ?
    GROUP BY c.id, c.name
  `;

  db.query(categoryQuery, [categoryId], (err, results) => {
    if (err) {
      console.error("Error fetching category:", err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ category: results[0] });
  });
});

// Thêm danh mục mới
app.post("/categories", (req, res) => {
  const { name, description } = req.body;

  // Validation
  if (!name || !name.trim()) {
    return res
      .status(400)
      .json({ message: "Tên danh mục không được để trống" });
  }

  // Kiểm tra danh mục đã tồn tại
  const checkQuery = "SELECT id FROM categories WHERE name = ?";
  db.query(checkQuery, [name.trim()], (err, results) => {
    if (err) {
      console.error("Error checking category:", err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: "Danh mục này đã tồn tại" });
    }

    // Thêm danh mục mới
    const insertQuery = "INSERT INTO categories (name) VALUES (?)";
    db.query(insertQuery, [name.trim()], (err, result) => {
      if (err) {
        console.error("Error adding category:", err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: "Thêm danh mục thành công",
        categoryId: result.insertId,
      });
    });
  });
});

// Cập nhật danh mục
app.put("/categories/:id", (req, res) => {
  const categoryId = req.params.id;
  const { name, description } = req.body;

  // Validation
  if (!name || !name.trim()) {
    return res
      .status(400)
      .json({ message: "Tên danh mục không được để trống" });
  }

  // Kiểm tra danh mục đã tồn tại (trừ danh mục hiện tại)
  const checkQuery = "SELECT id FROM categories WHERE name = ? AND id != ?";
  db.query(checkQuery, [name.trim(), categoryId], (err, results) => {
    if (err) {
      console.error("Error checking category:", err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: "Danh mục này đã tồn tại" });
    }

    // Cập nhật danh mục
    const updateQuery = "UPDATE categories SET name = ? WHERE id = ?";
    db.query(updateQuery, [name.trim(), categoryId], (err, result) => {
      if (err) {
        console.error("Error updating category:", err);
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Cập nhật danh mục thành công" });
    });
  });
});

// Xóa danh mục
app.delete("/categories/:id", (req, res) => {
  const categoryId = req.params.id;

  // Kiểm tra xem danh mục có sản phẩm không
  const checkProductsQuery =
    "SELECT COUNT(*) as product_count FROM products WHERE id_cate = ?";
  db.query(checkProductsQuery, [categoryId], (err, results) => {
    if (err) {
      console.error("Error checking products:", err);
      return res.status(500).json({ error: err.message });
    }
    if (results[0].product_count > 0) {
      return res.status(400).json({
        message:
          "Không thể xóa danh mục đang có sản phẩm. Vui lòng di chuyển hoặc xóa tất cả sản phẩm trước.",
      });
    }

    // Xóa danh mục
    const deleteQuery = "DELETE FROM categories WHERE id = ?";
    db.query(deleteQuery, [categoryId], (err, result) => {
      if (err) {
        console.error("Error deleting category:", err);
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Xóa danh mục thành công" });
    });
  });
});

// API để fix sản phẩm không có danh mục
app.post("/fix/products-categories", (req, res) => {
  // Tạo danh mục "Khác" nếu chưa có
  const createCategoryQuery = `
    INSERT IGNORE INTO categories (name, description) 
    VALUES ('Khác', 'Danh mục cho các sản phẩm chưa phân loại')
  `;

  db.query(createCategoryQuery, (err, result) => {
    if (err) {
      console.error("Error creating default category:", err);
      return res.status(500).json({ error: err.message });
    }

    // Lấy ID của danh mục "Khác"
    const getCategoryQuery = "SELECT id FROM categories WHERE name = 'Khác'";
    db.query(getCategoryQuery, (err2, results) => {
      if (err2) {
        console.error("Error getting default category:", err2);
        return res.status(500).json({ error: err2.message });
      }

      if (results.length === 0) {
        return res
          .status(500)
          .json({ error: "Không thể tạo danh mục mặc định" });
      }

      const defaultCategoryId = results[0].id;

      // Cập nhật tất cả sản phẩm có id_cate = NULL
      const updateProductsQuery = `
        UPDATE products 
        SET id_cate = ? 
        WHERE id_cate IS NULL
      `;

      db.query(updateProductsQuery, [defaultCategoryId], (err3, result3) => {
        if (err3) {
          console.error("Error updating products:", err3);
          return res.status(500).json({ error: err3.message });
        }

        res.json({
          message: "Đã cập nhật sản phẩm thành công",
          defaultCategoryId: defaultCategoryId,
          updatedProducts: result3.affectedRows,
        });
      });
    });
  });
});

// API để setup dữ liệu mẫu
app.post("/setup/sample-data", (req, res) => {
  console.log("Setting up sample data...");

  // Tạo categories mẫu
  const categoriesData = [
    { name: "Áo nam", description: "Các loại áo dành cho nam" },
    { name: "Áo nữ", description: "Các loại áo dành cho nữ" },
    { name: "Quần nam", description: "Các loại quần dành cho nam" },
    { name: "Quần nữ", description: "Các loại quần dành cho nữ" },
    { name: "Giày thể thao", description: "Các loại giày thể thao" },
  ];

  // Tạo products mẫu
  const productsData = [
    { name: "Áo thun nam cơ bản", price: 150000, quantity: 50, id_cate: 1 },
    { name: "Áo sơ mi nam công sở", price: 250000, quantity: 30, id_cate: 1 },
    { name: "Áo thun nữ dáng ôm", price: 120000, quantity: 40, id_cate: 2 },
    { name: "Quần jean nam slim", price: 350000, quantity: 25, id_cate: 3 },
    { name: "Quần jean nữ ống rộng", price: 280000, quantity: 35, id_cate: 4 },
    { name: "Giày thể thao nam", price: 450000, quantity: 20, id_cate: 5 },
    { name: "Giày thể thao nữ", price: 420000, quantity: 22, id_cate: 5 },
  ];

  // Thêm categories
  const insertCategoriesQuery =
    "INSERT INTO categories (name, description) VALUES ?";
  const categoriesValues = categoriesData.map((cat) => [
    cat.name,
    cat.description,
  ]);

  db.query(insertCategoriesQuery, [categoriesValues], (err1, result1) => {
    if (err1) {
      console.error("Error inserting categories:", err1);
      return res.status(500).json({ error: err1.message });
    }

    console.log("Categories inserted:", result1.affectedRows);

    // Thêm products
    const insertProductsQuery =
      "INSERT INTO products (name, price, quantity, id_cate) VALUES ?";
    const productsValues = productsData.map((prod) => [
      prod.name,
      prod.price,
      prod.quantity,
      prod.id_cate,
    ]);

    db.query(insertProductsQuery, [productsValues], (err2, result2) => {
      if (err2) {
        console.error("Error inserting products:", err2);
        return res.status(500).json({ error: err2.message });
      }

      console.log("Products inserted:", result2.affectedRows);

      res.json({
        message: "Setup sample data thành công",
        categoriesInserted: result1.affectedRows,
        productsInserted: result2.affectedRows,
      });
    });
  });
});

// Lắng nghe trên port được chỉ định
app.listen(port, () => {
  console.log(`Ứng dụng đang chạy trên server: http://localhost:${port}`);
});
