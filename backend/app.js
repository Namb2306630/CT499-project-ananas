const express = require("express");
const cors = require("cors");
const authRouter = require("./app/routes/auth.route");
const provinceRouter = require("./app/routes/province.route");
const addressRouter = require("./app/routes/address.route");
const systemConfigRouter = require("./app/routes/system-config.route");
const userRouter = require("./app/routes/user.route");
const categoryRouter = require("./app/routes/category.route");
const AppError = require("./app/constants/app-error");

const app = express(); // để tạo ra một ứng dụng Express
app.use(cors()); // cho phép khác port gọi BE

app.use(express.json()); //Express tự động đọc dữ liệu JSON từ request

app.get("/", (req, res) => {
  res.json({ message: "Welcome to ananas" });
});

app.use("/api/auth", authRouter);
app.use("/api", provinceRouter);
app.use("/api/address", addressRouter);
app.use("/api/admin/system-config", systemConfigRouter);
app.use("/api", userRouter);
app.use("/api/category", categoryRouter);

app.use((req, res, next) => {
  return next(new AppError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    code: err.code || 9999,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
