const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
//chung
const authRouter = require("./app/routes/auth.route");
const provinceRouter = require("./app/routes/province.route");
const addressRouter = require("./app/routes/address.route");
const userRouter = require("./app/routes/user.route");
const productTypeRouter = require("./app/routes/product-type.route");
const styleRouter = require("./app/routes/style.route");
const productLineRouter = require("./app/routes/product-line.route");
const collectionRouter = require("./app/routes/collection.route");
const productVariantRouter = require("./app/routes/product-variant.route");
const productRouter = require("./app/routes/product.route");

//admin
const systemConfigAdminRouter = require("./app/routes/admin/system-config.route");
const categoryAdminRouter = require("./app/routes/admin/category.route");
const brandAdminRouter = require("./app/routes/admin/brand.route");
const productLineAdminRouter = require("./app/routes/admin/product-line.route");
const styleAdminRouter = require("./app/routes/admin/style.route");
const productAdminRouter = require("./app/routes/admin/product.route");
const collectionAdminRouter = require("./app/routes/admin/collection.route");
const ProVariItemAdminRouter = require("./app/routes/admin/product-variant-item.route");
const productVariantAdminRouter = require("./app/routes/admin/product-variant.route");
const productTypeAdminRouter = require("./app/routes/admin/product-type.route");
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
const productTypeUserRouter = require("./app/routes/user/product-type.route");

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
app.use(cookieParser()); //Cookie gửi từ trình duyệt lên BE nằm trong HTTP request header
//cookie-parser đứng giữa request và route
//Đọc Cookie mà browser đã gửi và chuyển nó thành req.cookies để code Express dễ sử dụng
app.get("/", (req, res) => {
  res.json({ message: "Welcome to ananas" });
});

app.use("/uploads", express.static("uploads"));

//chung
app.use("/api/auth", authRouter);
app.use("/api/provinces", provinceRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/users", userRouter);
app.use("/api/product-types/options", productTypeRouter);
app.use("/api/styles/options", styleRouter);
app.use("/api/collections/options", collectionRouter);
app.use("/api/product-lines/options", productLineRouter);
app.use("/api/product-variants/options", productVariantRouter);
app.use("/api/products/options", productRouter);

//admin
app.use("/api/admin/system-config", systemConfigAdminRouter);
app.use("/api/admin/categories", categoryAdminRouter);
app.use("/api/admin/product-lines", productLineAdminRouter);
app.use("/api/admin/styles", styleAdminRouter);
app.use("/api/admin/collections", collectionAdminRouter);
app.use("/api/admin/products", productAdminRouter);
app.use("/api/admin/product-variant-items", ProVariItemAdminRouter);
app.use("/api/admin/brands", brandAdminRouter);
app.use("/api/admin/product-variants", productVariantAdminRouter);
app.use("/api/admin/product-types", productTypeAdminRouter);
//user
app.use("/api/brands", brandUserRouter);
app.use("/api/categories", categoryUserRouter);
app.use("/api/product-lines", productLineUserRouter);
app.use("/api/product-variant-items", ProVariItemUserRouter);
app.use("/api/styles", styleUserRouter);
app.use("/api/collections", collectionUserRouter);
app.use("/api/products", productUserRouter);
app.use("/api/wishlists", wishlistUserRouter);
app.use("/api/carts", cartUserRouter);
app.use("/api/orders", orderUserRouter);
app.use("/api/order-items", orderItemUserRouter);
app.use("/api/product-variants", productVariantUserRouter);
app.use("/api/product-types", productTypeUserRouter);

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
