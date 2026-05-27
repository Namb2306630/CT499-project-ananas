const express = require("express");
const cors = require("cors");

const app = express(); // để tạo ra một ứng dụng Express
app.use(cors()); // cho phép khác port gọi BE

app.use(express.json()); //Express tự động đọc dữ liệu JSON từ request

app.get("/", (req, res) => {
  res.json({ message: "Welcome to ananas" });
});

module.exports = app;
