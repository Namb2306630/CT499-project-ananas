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

  ADDRESS_NOT_EXISTS: () => new AppError(1008, "Địa chỉ không tồn tại"),

  CANNOT_DELETE_DEFAULT_ADDRESS: () =>
    new AppError(1009, "Không thể xóa địa chỉ mặc định"),

  SYSTEM_NOT_EXISTS: () =>
    new AppError(1010, "Không tìm thấy cấu hình hệ thống"),

  INVALID_VAT_PERCENT: () => new AppError(1011, "Thuế VAT phải từ 0 đến 100"),

  INVALID_OPERATING_COST_PERCENT: () =>
    new AppError(1012, "Chi phí vận hành phải từ 0 đến 100"),

  INVALID_PROFIT_PERCENT: () =>
    new AppError(1013, "Lợi nhuận phải từ 0 đến 100"),

  INVALID_FREE_SHIPPING_THRESHOLD: () =>
    new AppError(1014, "Ngưỡng miễn phí vận chuyển không hợp lệ"),
};

module.exports = ErrorCode;
