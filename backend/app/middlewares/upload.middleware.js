const { uploadImage } = require("../utils/uploadImage.util");

const uploadBrandLogo = uploadImage("brands").single("logo");
const uploadCategoryImage = uploadImage("categories").single("image");

module.exports = {
  uploadBrandLogo,
  uploadCategoryImage,
};
