const multer = require("multer");
const fs = require("fs");
const path = require("path");
const config = require("../config/index");
const ErrorCode = require("../constants/errors");
const AppError = require("../constants/app-error");

// ====== 1. STORAGE CONFIG ======
const storage = (folder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = `uploads/${folder}`;

      // tạo folder nếu chưa có
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true, //iúp tạo nhiều cấp folder nếu chưa tồn tại
        });
      }

      cb(null, dir); //lưu file
    },

    filename: function (req, file, cb) {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

      cb(null, uniqueName + path.extname(file.originalname));
    },
  });

// ====== 2. FILTER FILE ======
//chỉ upload ảnh
const fileFilter = (req, file, cb) => {
  if (!config.img.allowed.includes(file.mimetype)) {
    return cb(
      new AppError(1019, `Chỉ cho phép: ${config.img.allowed.join(", ")}`),
      false,
    );
  }

  cb(null, true);
};

// ====== 3. CREATE UPLOADER ======
const uploadImage = (folder) =>
  multer({
    storage: storage(folder),
    fileFilter,
    limits: {
      fileSize: config.img.size * 1024 * 1024, // 2MB
    },
  });

// ====== 4. DELETE OLD IMAGE ======
const deleteImage = (filePath) => {
  if (!filePath) return;

  const fullPath = path.join(process.cwd(), filePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
