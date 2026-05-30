const AppError = require("./app-error");

const ErrorCode = {
  INVALID_PASSWORD: () =>
    new AppError(1001, "Mật khẩu phải có ít nhất 8 ký tự"),

  PHONE_ALREADY_EXISTS: () => new AppError(1002, "Số điện thoại đã tồn tại"),

  INVALID_USER_NAME: () => new AppError(1003, "Tên tài khoản không hợp lệ"),

  INVALID_PHONE: () => new AppError(1004, "Số điện thoại không hợp lệ"),

  UNAUTHORIZED: () => new AppError(1005, "Bạn chưa đăng nhập"),

  PASSWORD_NOT_MATCH: () => new AppError(1006, "Mật khẩu xác nhận không khớp"),

  INVALID_CREDENTIALS: () =>
    new AppError(1007, "Số điện thoại hoặc mật khẩu không đúng"),
};

module.exports = ErrorCode;
