const multer = require("multer");
const fs = require("fs");
const path = require("path");
const config = require("../config/index");
const ErrorCode = require("../constants/errors");
const AppError = require("../constants/app-error");
// ====== 1. STORAGE CONFIG ======/
//destination xác định thư mục lưu file
const storage = (folder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = `uploads/${folder}`;

      // tạo folder nếu chưa có
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true, //giúp tạo nhiều cấp folder nếu chưa tồn tại
        });
      }

      cb(null, dir); //lưu file cb là callback, cb(error, destination)
      //hông lỗi (null) và lưu vào thư dir
      //dir = "uploads/brands";
    },

    filename: function (req, file, cb) {
      // const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      // cb(null, uniqueName + path.extname(file.originalname));

      const ext = path.extname(file.originalname);
      const originalName = path.basename(file.originalname, ext);
      const safeName = originalName
        .replace(/\s+/g, "_")
        .replace(/[^\w\-]/g, "");

      cb(null, `${safeName}_${Date.now()}${ext}`);

      //1780326848831-427389156.png
    },
    //uploads/brands
    // +
    // 1780326848831-427389156.png
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

  //cb(error, acceptFile)
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
  //truyền đường dẫn được lưu trong database vào, ví dụ: uploads/brands/1780326848831-427389156.png
  const fullPath = path.join(process.cwd(), filePath);
  //process.cwd() trả về đường dẫn gốc của project, ví dụ: D:\CT499\project\ananas\backend
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

// {
//   fieldname: 'logo',
//   originalname: 'ananas.png',
//   filename: '1780326848831-427389156.png',
//   path: 'uploads\\brands\\1780326848831-427389156.png'
// }

// xóa ảnh khi ko lưu thành công vì multer luôn lưu file trước khi kiểm tra điều kiện
const removeUploadedFiles = (files) => {
  if (!files) return;

  Object.values(files)
    .flat()
    .forEach((file) => {
      deleteImage(file.path);
    });
};

module.exports = {
  uploadImage,
  deleteImage,
  removeUploadedFiles,
};
