const AppError = require("./app-error");

const ErrorCode = {
  INVALID_PASSWORD: () =>
    new AppError(1001, "Mật khẩu phải có ít nhất 8 ký tự"),

  PHONE_ALREADY_EXISTS: () => new AppError(1002, "Số điện thoại đã tồn tại"),

  INVALID_USER_NAME: () => new AppError(1003, "Tên tài khoản không hợp lệ"),

  INVALID_PHONE: () => new AppError(1004, "Số điện thoại không hợp lệ"),

  UNAUTHORIZED: (message = "Bạn cần đăng nhập") => new AppError(1005, message),

  PASSWORD_NOT_MATCH: () => new AppError(1006, "Mật khẩu xác nhận không khớp"),

  INVALID_CREDENTIALS: () =>
    new AppError(1007, "Số điện thoại hoặc mật khẩu không đúng"),

  ADDRESS_NOT_EXISTS: () => new AppError(1008, "Địa chỉ không tồn tại"),

  CANNOT_DELETE_DEFAULT_ADDRESS: () =>
    new AppError(1009, "Không thể xóa địa chỉ mặc định"),

  SYSTEM_NOT_EXISTS: () =>
    new AppError(1010, "Không tìm thấy cấu hình hệ thống"),

  // INVALID_VAT_PERCENT: () => new AppError(1011, "Thuế VAT phải từ 0 đến 100"),

  // INVALID_OPERATING_COST_PERCENT: () =>
  //   new AppError(1012, "Chi phí vận hành phải từ 0 đến 100"),

  // INVALID_PROFIT_PERCENT: () =>
  //   new AppError(1013, "Lợi nhuận phải từ 0 đến 100"),

  // INVALID_FREE_SHIPPING_THRESHOLD: () =>
  //   new AppError(1014, "Ngưỡng miễn phí vận chuyển không hợp lệ"),

  CATEGORY_ALREADY_EXISTS: () => new AppError(1015, "Tên danh mục đã tồn tại"),
  CATEGORY_NOT_EXISTS: () => new AppError(1016, "Danh mục không tồn tại"),
  BRAND_NOT_EXISTS: () => new AppError(1017, "Thương hiệu không tồn tại"),
  BRAND_ALREADY_EXISTS: () => new AppError(1018, "Thương hiệu đã tồn tại"),

  IMAGE_TYPE_NOT_ALLOWED: () =>
    new AppError(1019, "Chỉ cho phép tải lên các tệp hình ảnh"),

  PRODUCT_LINE_NOT_EXISTS: () =>
    new AppError(1020, "Dòng sản phẩm không tồn tại"),
  PRODUCT_LINE_ALREADY_EXISTS: () =>
    new AppError(1021, "Dòng sản phẩm đã tồn tại"),

  STYLE_NOT_EXISTS: () =>
    new AppError(1022, "Kiểu dáng sản phẩm không tồn tại"),
  STYLE_ALREADY_EXISTS: () =>
    new AppError(1023, "Kiểu dáng sản phẩm đã tồn tại"),

  PRODUCT_NOT_EXISTS: () => new AppError(1024, "Sản phẩm không tồn tại"),
  PRODUCT_ID_ALREADY_EXISTS: () => new AppError(1025, "Mã sản phẩm đã tồn tại"),
  PRODUCT_SLUG_ALREADY_EXISTS: () =>
    new AppError(1025, "Tên sản phẩm đã tồn tại"),

  PRODUCT_VARI_NOT_EXISTS: () =>
    new AppError(1026, "Màu sản phẩm không tồn tại"),
  PRODUCT_VARI_ALREADY_EXISTS: () =>
    new AppError(1027, "Màu sản phẩm đã tồn tại"),

  PRODUCT_VARI_IMAGES: () =>
    new AppError(1028, "Ảnh chi tiết sản phẩm chỉ giới hạn tối đa là 10 ảnh"),

  LOGO_BRAND_REQUIRED: () =>
    new AppError(1029, "Logo thương hiệu không được để trống"),
  MAIN_IMAGE_REQUIRED: () =>
    new AppError(1030, "Ảnh sản phẩm không được để trống"),
  HOVER_IMAGE_REQUIRED: () =>
    new AppError(1031, "Ảnh hover sản phẩm không được để trống"),
  IMAGES_REQUIRED: () =>
    new AppError(1032, "Ảnh phụ sản phẩm không được để trống"),

  MAX_IMAGES: () => new AppError(1033, "Ảnh phụ sản phẩm tối ta 10 ảnh"),

  INVALID_INPUT: () =>
    new AppError(1034, "vui lòng nhập đầy đủ mã sản phẩm và màu sản phẩm"),
};

module.exports = ErrorCode;
