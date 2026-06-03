const express = require("express");
const cors = require("cors");
const authRouter = require("./app/routes/auth.route");
const provinceRouter = require("./app/routes/province.route");
const addressRouter = require("./app/routes/address.route");
const systemConfigRouter = require("./app/routes/system-config.route");
const userRouter = require("./app/routes/user.route");
const categoryRouter = require("./app/routes/category.route");
const brandRouter = require("./app/routes/brand.route");
const productLineRouter = require("./app/routes/product-line.route");
const AppError = require("./app/constants/app-error");
const multer = require("multer");

const app = express();
app.use(cors()); // cho phép khác port gọi B

app.use(express.json()); //Express tự động đọc dữ liệu JSON từ request

app.get("/", (req, res) => {
  res.json({ message: "Welcome to ananas" });
});
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRouter);
app.use("/api", provinceRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/admin/system-config", systemConfigRouter);
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/brands", brandRouter);
app.use("/api/product-line", productLineRouter);

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
    return res.status(err.statusCode || 400).json({
      code: err.code,
      message: err.message,
    });
  }

  // Lỗi khác
  return res.status(500).json({
    code: 9999,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
