module.exports = (schema) => {
  return (req, res, next) => {
    //chuyển từ res.file-> res.body
    if (req.files) {
      if (req.files.mainImage?.length) {
        req.body.mainImage = req.files.mainImage[0].filename;
      }

      if (req.files.hoverImage?.length) {
        req.body.hoverImage = req.files.hoverImage[0].filename;
      }

      if (req.files.images?.length) {
        req.body.images = req.files.images.map((file) => file.filename);
      }
    }

    const { error } = schema.validate(req.body, {
      // abortEarly: true, //gặp lỗi đầu dừng
      abortEarly: false,
      allowUnknown: false, //ko co field laj
    });

    if (error) {
      const errors = {};

      error.details.forEach((err) => {
        errors[err.path[0]] = err.message;
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
