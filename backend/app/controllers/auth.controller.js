const authService = require("../services/auth.service");
const ApiResponse = require("../constants/api-response");

exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);

    return ApiResponse.success({
      res,
      data: user,
      message: "Đăng ký tài khoản thành công",
      statusCode: 201,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    return ApiResponse.success({
      res,
      data: result,
      message: "Đăng nhập thành công",
      statusCode: 200,
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const result = await authService.refreshToken(req.body.refreshToken);

    return ApiResponse.success({
      res,
      data: result,
      message: "Refresh token thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.send({ message: "đăng xuất" });
};

exports.forgotPassword = (req, res) => {
  res.send({ message: "quên mật khẩu" });
};
