const { uploadImage } = require("../utils/uploadImage.util");

const uploadBrandLogo = uploadImage("brands").single("logo");
const uploadCategoryImage = uploadImage("categories").single("image");
const uploadProductVariantImage = uploadImage("product-variant").fields([
  { name: "mainImage", maxCount: 1 },
  { name: "hoverImage", maxCount: 1 },
  { name: "images", maxCount: 20 },
]);

module.exports = {
  uploadBrandLogo,
  uploadCategoryImage,
  uploadProductVariantImage,
};
