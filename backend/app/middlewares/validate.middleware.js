module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: true, // Gặp lỗi đầu tiên -> dừng luôn
      allowUnknown: false, // không cho field lạ
    });
    if (error) {
      return next({
        statusCode: 400,
        message: error.details.map((e) => e.message).join(", "),
      });
    }
    next();
  };
};
