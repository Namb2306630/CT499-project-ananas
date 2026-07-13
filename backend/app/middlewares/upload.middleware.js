const { uploadImage } = require("../utils/uploadImage.util");

const uploadBrandLogo = uploadImage("brands").single("logo");
const uploadCategoryImage = uploadImage("categories").single("image");
const uploadProductVariantImage = uploadImage("product-variant").fields([
  { name: "mainImage", maxCount: 1 },
  { name: "hoverImage", maxCount: 1 },
  { name: "images", maxCount: 20 },
]);
const uploadCollectionImage = uploadImage("collection").single("banner");
const uploadNotFoundImage = uploadImage("system").single("image");
module.exports = {
  uploadBrandLogo,
  uploadCategoryImage,
  uploadProductVariantImage,
  uploadCollectionImage,
  uploadNotFoundImage,
};
