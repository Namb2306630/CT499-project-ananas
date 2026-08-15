// module.exports = (schema) => {
//   return (req, res, next) => {
//     //chuyển từ res.file-> res.body
//     if (req.files) {
//       if (req.files.mainImage?.length) {
//         req.body.mainImage = req.files.mainImage[0].filename;
//       }

//       if (req.files.hoverImage?.length) {
//         req.body.hoverImage = req.files.hoverImage[0].filename;
//       }

//       let oldImages = [];
//       if (req.body.images) {
//         oldImages = Array.isArray(req.body.images)
//           ? req.body.images
//           : [req.body.images];
//       }

//       const newImages = req.files?.images
//         ? req.files.images.map((file) => file.path.replaceAll("\\", "/"))
//         : [];

//       req.body.images = [...oldImages, ...newImages];
//     }

//     const { error } = schema.validate(req.body, {
//       // abortEarly: true, //gặp lỗi đầu dừng
//       abortEarly: false,
//       allowUnknown: false, //ko co field laj
//     });

//     if (error) {
//       const errors = {};

//       error.details.forEach((err) => {
//         errors[err.path[0]] = err.message;
//       });

//       return next({
//         statusCode: 400,
//         message: "Dữ liệu không hợp lệ",
//         errors,
//       });
//     }

//     next();
//   };
// };
module.exports = (schema) => {
  return (req, res, next) => {
    // Chuyển từ file -> body
    if (req.files) {
      if (req.files.mainImage?.length) {
        req.body.mainImage = req.files.mainImage[0].filename;
      }

      if (req.files.hoverImage?.length) {
        req.body.hoverImage = req.files.hoverImage[0].filename;
      }

      let oldImages = [];

      if (req.body.images) {
        oldImages = Array.isArray(req.body.images)
          ? req.body.images
          : [req.body.images];
      }

      const newImages = req.files?.images
        ? req.files.images.map((file) => file.path.replaceAll("\\", "/"))
        : [];

      req.body.images = [...oldImages, ...newImages];
    }

    // FormData gửi object dưới dạng JSON string
    if (typeof req.body.megaMenu === "string") {
      try {
        req.body.megaMenu = JSON.parse(req.body.megaMenu);
      } catch (error) {
        return next({
          statusCode: 400,
          message: "megaMenu không hợp lệ",
          errors: {
            megaMenu: "megaMenu phải là JSON hợp lệ",
          },
        });
      }
    }

    // FormData gửi boolean thành string
    if (typeof req.body.isActive === "string") {
      req.body.isActive = req.body.isActive === "true";
    }

    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
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
