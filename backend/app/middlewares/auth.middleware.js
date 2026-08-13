const jwt = require("jsonwebtoken");
const config = require("../config/index");
const ErrorCode = require("../constants/errors");

const authMiddleware = async (req, res, next) => {
  try {
    //lấy từ Local
    // const authHeader = req.headers.authorization;

    // lấy token từ cookie FE gửi lên
    const token = req.cookies?.[config.jwt.accessToken];

    if (!token) {
      return next(ErrorCode.UNAUTHORIZED());
    }
    //cho local
    // const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, config.jwt.accessSecret);


    //gửi kèm request
    req.user = decoded;
    //     {
    //   _id: "123",
    //   role: "user",
    //   iat: 1710000000,
    //   exp: 1710003600
    // }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(ErrorCode.UNAUTHORIZED("Token đã hết hạn"));
    }

    if (error.name === "JsonWebTokenError") {
      return next(ErrorCode.UNAUTHORIZED("Token không hợp lệ"));
    }

    return next(error);
  }
};

module.exports = authMiddleware;
