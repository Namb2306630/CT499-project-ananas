const AppError = require("./app-error");

const ErrorCode = {
  INVALID_PASSWORD: () =>
    new AppError(1001, "Mật khẩu phải có ít nhất 8 ký tự."),

  PHONE_ALREADY_EXISTS: () => new AppError(1002, "Số điện thoại đã tồn tại."),

  INVALID_USER_NAME: () => new AppError(1003, "Tên tài khoản không hợp lệ."),

  INVALID_PHONE: () => new AppError(1004, "Số điện thoại không hợp lệ."),

  UNAUTHORIZED: (message = "Bạn cần đăng nhập để thực hiện chức năng này.") =>
    new AppError(1005, message, 401),

  PASSWORD_NOT_MATCH: () => new AppError(1006, "Mật khẩu xác nhận không khớp."),

  INVALID_CREDENTIALS: () =>
    new AppError(1007, "Số điện thoại hoặc mật khẩu không chính xác."),

  ADDRESS_NOT_EXISTS: () => new AppError(1008, "Địa chỉ không tồn tại."),

  CANNOT_DELETE_DEFAULT_ADDRESS: () =>
    new AppError(1009, "Không thể xóa địa chỉ mặc định."),

  SYSTEM_NOT_EXISTS: () =>
    new AppError(1010, "Cấu hình hệ thống không tồn tại."),

  // INVALID_VAT_PERCENT: () => new AppError(1011, "Thuế VAT phải từ 0 đến 100"),

  // INVALID_OPERATING_COST_PERCENT: () =>
  //   new AppError(1012, "Chi phí vận hành phải từ 0 đến 100"),

  // INVALID_PROFIT_PERCENT: () =>
  //   new AppError(1013, "Lợi nhuận phải từ 0 đến 100"),

  // INVALID_FREE_SHIPPING_THRESHOLD: () =>
  //   new AppError(1014, "Ngưỡng miễn phí vận chuyển không hợp lệ"),

  BRAND_EXIST_PRODUCT: () =>
    new AppError(
      1014,
      "Không thể xóa thương hiệu vì vẫn còn sản phẩm thuộc thương hiệu này.",
    ),

  CATEGORY_ALREADY_EXISTS: () => new AppError(1015, "Danh mục đã tồn tại."),

  CATEGORY_NOT_EXISTS: () => new AppError(1016, "Danh mục không tồn tại."),

  BRAND_NOT_EXISTS: () => new AppError(1017, "Thương hiệu không tồn tại."),

  BRAND_ALREADY_EXISTS: () => new AppError(1018, "Thương hiệu đã tồn tại."),

  IMAGE_TYPE_NOT_ALLOWED: () =>
    new AppError(1019, "Chỉ cho phép tải lên tệp hình ảnh."),

  PRODUCT_LINE_NOT_EXISTS: () =>
    new AppError(1020, "Dòng sản phẩm không tồn tại."),

  PRODUCT_LINE_ALREADY_EXISTS: () =>
    new AppError(1021, "Dòng sản phẩm đã tồn tại."),

  STYLE_NOT_EXISTS: () => new AppError(1022, "Kiểu dáng không tồn tại."),

  STYLE_ALREADY_EXISTS: () => new AppError(1023, "Kiểu dáng đã tồn tại."),

  PRODUCT_NOT_EXISTS: () => new AppError(1024, "Sản phẩm không tồn tại."),

  PRODUCT_ID_ALREADY_EXISTS: () =>
    new AppError(1025, "Mã sản phẩm đã tồn tại."),

  PRODUCT_SLUG_ALREADY_EXISTS: () =>
    new AppError(1026, "Tên sản phẩm đã tồn tại."),

  PRODUCT_VARI_NOT_EXISTS: () =>
    new AppError(1027, "Biến thể sản phẩm không tồn tại."),

  PRODUCT_VARI_ALREADY_EXISTS: () =>
    new AppError(1028, "Biến thể sản phẩm đã tồn tại."),

  PRODUCT_VARI_IMAGES: () =>
    new AppError(
      1029,
      "Số lượng ảnh chi tiết của biến thể sản phẩm không được vượt quá 10 ảnh.",
    ),

  LOGO_BRAND_REQUIRED: () =>
    new AppError(1029, "Logo thương hiệu không được để trống."),

  MAIN_IMAGE_REQUIRED: () =>
    new AppError(1030, "Ảnh chính của biến thể sản phẩm không được để trống."),

  HOVER_IMAGE_REQUIRED: () =>
    new AppError(1031, "Ảnh hover của biến thể sản phẩm không được để trống."),

  IMAGES_REQUIRED: () =>
    new AppError(
      1032,
      "Ảnh chi tiết của biến thể sản phẩm không được để trống.",
    ),

  MAX_IMAGES: () =>
    new AppError(
      1033,
      "Biến thể sản phẩm chỉ được phép có tối đa 10 ảnh chi tiết.",
    ),

  INVALID_INPUT: () =>
    new AppError(1034, "Vui lòng cung cấp đầy đủ mã sản phẩm và mã màu."),

  COLLECTION_NOT_EXISTS: () => new AppError(1035, "Bộ sưu tập không tồn tại."),

  COLLECTION_ALREADY_EXISTS: () => new AppError(1036, "Bộ sưu tập đã tồn tại."),

  COLLECTION_SLUG_ALREADY_EXISTS: () =>
    new AppError(1037, "Tên bộ sưu tập đã tồn tại."),

  PROVARI_ITEM_NOT_EXISTS: () =>
    new AppError(1038, "Biến thể theo kích cỡ không tồn tại."),

  // PROVARI_ITEM_SIZE_ALREADY_EXISTS: () =>
  //   new AppError(1039, "Kích cỡ này đã tồn tại trong biến thể sản phẩm."),

  PRODUCT_OUT_OF_STOCK: () =>
    new AppError(1040, "Số lượng sản phẩm vượt quá số lượng tồn kho."),

  WISHLIST_NOT_EXISTS: () => ({
    code: 1041,
    message: "Danh sách yêu thích không tồn tại.",
  }),

  WISHLIST_ITEM_NOT_EXISTS: () => ({
    code: 1042,
    message: "Sản phẩm không có trong danh sách yêu thích.",
  }),

  CART_NOT_EXISTS: () => ({
    code: 1043,
    message: "Sản phẩm không có trong giỏ hàng.",
  }),
  CART_ITEM_NOT_EXISTS: () => ({
    code: 1044,
    message: "Sản phẩm không có trong giỏ hàng.",
  }),

  OUT_OF_STOCK: () => ({
    code: 1045,
    message: "Sản phẩm hiện đang hết hàng.",
  }),

  ORDER_NOT_EXISTS: () => new AppError(1046, "Đơn hàng không tồn tại."),

  ORDER_ALREADY_EXISTS: () => new AppError(1047, "Mã đơn hàng đã tồn tại."),

  ORDER_ITEM_NOT_EXISTS: () =>
    new AppError(1048, "Chi tiết đơn hàng không tồn tại."),

  ORDER_ITEM_ALREADY_EXISTS: () =>
    new AppError(1049, "Mã chi tiết đơn hàng đã tồn tại."),

  FORBIDDEN: (message = "Bạn không có quyền thực hiện chức năng này.") => ({
    code: 403,
    message,
  }),

  CATEGORY_INVALID_PARENT: () =>
    new AppError(1056, "Danh mục cha không hợp lệ hoặc không tồn tại."),

  CATEGORY_HAS_CHILD: () =>
    new AppError(
      1057,
      "Không thể xóa danh mục vì vẫn còn danh mục con thuộc danh mục này.",
    ),

  PRODUCT_LINE_HAS_PRODUCTS: () => ({
    code: 1058,
    message: "Không thể xóa dòng sản phẩm vì vẫn còn sản phẩm thuộc dòng này.",
  }),

  COLLECTION_HAS_PRODUCTS: () => ({
    code: 1044,
    message:
      "Không thể xóa bộ sưu tập vì vẫn còn sản phẩm thuộc bộ sưu tập này.",
  }),

  PRODUCT_TYPE_NOT_EXISTS: () => ({
    code: 1045,
    message: "Loại sản phẩm không tồn tại.",
  }),

  PRODUCT_TYPE_ALREADY_EXISTS: () => ({
    code: 1046,
    message: "Loại sản phẩm đã tồn tại.",
  }),

  PRODUCT_TYPE_IN_USE: () => ({
    code: 1047,
    message: "Không thể xóa loại sản phẩm vì vẫn còn sản phẩm thuộc loại này.",
  }),

  PRODUCT_IN_USE: () => ({
    code: 1048,
    message:
      "Không thể xóa sản phẩm vì vẫn còn biến thể sản phẩm thuộc sản phẩm này.",
  }),

  PRODUCT_VARIANT_IN_USE: () => ({
    code: 1049,
    message:
      "Không thể xóa biến thể sản phẩm vì vẫn còn kích cỡ thuộc biến thể này.",
  }),

  PROVARI_ITEM_SIZE_ALREADY_EXISTS: (sizes = []) => ({
    code: 1050,
    message: `Size ${sizes} đã tồn tại trong biến thể này!!!`,
  }),
  BAD_REQUEST: (message = "Lỗi") => new AppError(9998, message),
};

module.exports = ErrorCode;
