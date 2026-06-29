module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      // abortEarly: true, //gặp lỗi đầu dừng
      abortEarly: false,
      allowUnknown: false, //ko co field laj
    });

    if (error) {
      const errors = {};
      error.details.forEach((err) => {
        const field = err.path[0];
        errors[field] = err.message;
      });
      return next({
        statusCode: 400,
        message: "Dữ liệu không hợp lệ",
        errors,
      });
    }

    next();
  };
};
