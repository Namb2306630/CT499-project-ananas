const authService = require("../services/auth.service");
const ApiResponse = require("../constants/api-response");
const config = require("../config/index");
const ms = require("ms");
const User = require("../models/user.model");
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

    // lưu access token vào cookie
    res.cookie(config.jwt.accessToken, result.accessToken, {
      //JavaScript ở FE không được phép đọc cookie này
      httpOnly: true,
      //cookie có chỉ được gửi qua HTTPS không
      secure: false, //khi môi trường pro ghì true
      //Chống gửi cookie từ website khác
      sameSite: "strict", //=> origin sheme:domain:port phải giống nhau

      maxAge: ms(config.jwt.accessExpires),
    });

    //lưu refreshToken
    res.cookie(config.jwt.refreshToken, result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/api/auth/refresh-token",
    });

    return ApiResponse.success({
      res,

      data: {
        user: result.user,
      },
      message: "Đăng nhập thành công",
      statusCode: 200,
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const result = await authService.refreshToken(
      req.cookies[config.jwt.refreshToken],
    );

    //tạo token mới
    (res.cookie(config.jwt.accessToken, result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",

      maxAge: ms(config.jwt.accessExpires),
    }),
      //refreshToken mới
      res.cookie(config.jwt.refreshToken, result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",

        maxAge: ms(config.jwt.refreshExpires),
      }));

    return ApiResponse.success({
      res,

      data: null,

      message: "Refresh token thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // await authService.logout(req.user._id);

    res.clearCookie(config.jwt.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.clearCookie(config.jwt.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/api/auth/refresh-token",
    });

    return res.status(200).json({
      message: "Đăng xuất thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = (req, res) => {
  res.send({ message: "quên mật khẩu" });
};

exports.me = async (req, res, next) => {
  try {
    const user = await authService.me(req.user._id);

    return ApiResponse.success({
      res,
      data: user,
      message: "Lấy thông tin user thành công",
    });
  } catch (err) {
    next(err);
  }
};
