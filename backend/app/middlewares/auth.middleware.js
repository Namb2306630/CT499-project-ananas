const jwt = require("jsonwebtoken");
const config = require("../config/index");
const ErrorCode = require("../constants/errors");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(ErrorCode.UNAUTHORIZED());
    }

    if (!authHeader.startsWith("Bearer ")) {
      return next(ErrorCode.UNAUTHORIZED());
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, config.jwt.accessSecret);

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
