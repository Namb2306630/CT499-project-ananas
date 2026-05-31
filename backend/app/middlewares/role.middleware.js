const ApiResponse = require("../constants/api-response");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền",
      });
    }
    next();
  };
};
