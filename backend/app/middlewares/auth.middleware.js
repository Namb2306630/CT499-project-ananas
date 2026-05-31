const jwt = require("jsonwebtoken");
const config = require("../config/index");
const ErrorCode = require("../constants/errors");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next(ErrorCode.UNAUTHORIZED());
    }

    if (!authHeader.startsWith("Bearer ")) {
      return next(ErrorCode.UNAUTHORIZED());
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, config.jwt.accessSecret);

    req.user = decoded;
    next();
  } catch {
    next(ErrorCode.UNAUTHORIZED());
  }
};

module.exports = authMiddleware;
