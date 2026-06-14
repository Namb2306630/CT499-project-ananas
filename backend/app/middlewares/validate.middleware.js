module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: true, //gặp lỗi đầu dừng
      allowUnknown: false, //ko co field laj
    });

    if (error) {
      return next({
        statusCode: 400,
        message: error.details[0].message,
      });
    }

    next();
  };
};
