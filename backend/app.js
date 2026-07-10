const express = require("express");
const cors = require("cors");
//chung
const authRouter = require("./app/routes/auth.route");
const provinceRouter = require("./app/routes/province.route");
const addressRouter = require("./app/routes/address.route");
const userRouter = require("./app/routes/user.route");

//admin
const systemConfigRouter = require("./app/routes/admin/system-config.route");
const categoryRouter = require("./app/routes/admin/category.route");
const brandRouter = require("./app/routes/admin/brand.route");
const productLineRouter = require("./app/routes/admin/product-line.route");
const styleRouter = require("./app/routes/admin/style.route");
const productRouter = require("./app/routes/admin/product.route");
const collectionRouter = require("./app/routes/admin/collection.route");
const ProVariItemRouter = require("./app/routes/admin/product-variant-item.route");
const productVariantRouter = require("./app/routes/admin/product-variant.route");
//user
const productLineUserRouter = require("./app/routes/user/product-line.route");
const categoryUserRouter = require("./app/routes/user/category.route");
const brandUserRouter = require("./app/routes/user/brand.route");
const styleUserRouter = require("./app/routes/user/style.route");
const productUserRouter = require("./app/routes/user/product.route");
const collectionUserRouter = require("./app/routes/user/collection.route");
const ProVariItemUserRouter = require("./app/routes/user/product-variant-item.route");
const wishlistUserRouter = require("./app/routes/user/wishlist.route");
const cartUserRouter = require("./app/routes/user/cart.route");
const orderUserRouter = require("./app/routes/user/order.route");
const orderItemUserRouter = require("./app/routes/user/order-item.route");
const productVariantUserRouter = require("./app/routes/user/product-variant.route");

const AppError = require("./app/constants/app-error");
const multer = require("multer");
const config = require("./app/config");
const app = express();

//cho phép gửi cookie và khác port gọi BE CORS
app.use(
  cors({
    origin: config.app.frontendUrl, //Cho phép request đến từ địa chỉ FE này
    credentials: true, //cho phép gửi thông tin xác thực kèm request
  }),
);

app.use(express.json()); //Express tự động đọc dữ liệu JSON từ request

app.get("/", (req, res) => {
  res.json({ message: "Welcome to ananas" });
});

app.use("/uploads", express.static("uploads"));

//chung
app.use("/api/auth", authRouter);
app.use("/api/provinces", provinceRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/users", userRouter);

//admin
app.use("/api/admin/system-config", systemConfigRouter);
app.use("/api/admin/categories", categoryRouter);
app.use("/api/admin/product-lines", productLineRouter);
app.use("/api/admin/product-lines", productLineRouter);
app.use("/api/admin/styles", styleRouter);
app.use("/api/admin/collections", collectionRouter);
app.use("/api/admin/products", productRouter);
app.use("/api/admin/product-variant-items", ProVariItemRouter);
app.use("/api/admin/brands", brandRouter);
//user
app.use("/api/brands", brandUserRouter);
app.use("/api/categories", categoryUserRouter);
app.use("/api/product-lines", productLineUserRouter);
app.use("/api/product-lines", productLineUserRouter);
app.use("/api/styles", styleUserRouter);
app.use("/api/collections", collectionUserRouter);
app.use("/api/products", productUserRouter);
app.use("/api/wishlists", wishlistUserRouter);
app.use("/api/carts", cartUserRouter);
app.use("/api/orders", orderUserRouter);
app.use("/api/order-items", orderItemUserRouter);
app.use("/api/product-lines", productVariantUserRouter);

app.use((req, res, next) => {
  return next(new AppError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  // Lỗi upload file
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        code: 1020,
        message: "Kích thước ảnh vượt quá giới hạn cho phép",
      });
    }

    return res.status(400).json({
      code: 1021,
      message: err.message,
    });
  }

  // Lỗi AppError của hệ thống
  if (err instanceof AppError) {
    // Lỗi khác
    return res.status(err.statusCode || 500).json({
      code: err.code || 9999,
      message: err.message || "Internal Server Error",
      errors: err.errors || {},
    });
  }

  // Lỗi khác (bao gồm Joi validate)
  return res.status(err.statusCode || 500).json({
    code: err.code || 9999,
    message: err.message || "Internal Server Error",
    errors: err.errors || {},
  });
});

module.exports = app;
//npm i cookie-parser
//const cookieParser = require("cookie-parser");
//sau => app.use(express.json());
//thêm app.use(cookieParser());
//thay app.use(express.json()); =>
// app.use(express.json({
//   limit: "10mb"
//}));
//
//
//
