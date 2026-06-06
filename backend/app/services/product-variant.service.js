const ProductVariant = require("../models/product-variant.model");
const ErrorCode = require("../constants/errors");
const updateFields = require("../utils/updateFields.until");
const { deleteImage, uploadImg } = require("../utils/uploadImage.util");
const Product = require("../models/product.model");

class ProductVariantService {
  async getByIdOrThrow(id) {
    const productVari = await ProductVariant.findById(id);

    if (!productVari) {
      throw ErrorCode.PRODUCT_VARI_NOT_EXISTS();
    }

    return productVari;
  }

  async create(payload, files) {
    const { product, colorCode } = payload;
    if (!files?.mainImage?.length) {
      throw ErrorCode.MAIN_IMAGE_REQUIRED();
    }
    if (!files?.hoverImage?.length) {
      throw ErrorCode.HOVER_IMAGE_REQUIRED();
    }
    if (!files?.images?.length) {
      throw ErrorCode.IMAGES_REQUIRED();
    }

    if (files?.images?.length > 10) {
      throw ErrorCode.MAX_IMAGES();
    }

    const existPro = await Product.findById(product);
    if (!existPro) throw ErrorCode.PRODUCT_NOT_EXISTS();

    const existProVari = await ProductVariant.findOne({
      product,
      colorCode,
    });

    if (existProVari) {
      if (existProVari.status === "discontinued") {
        existProVari.status = "active";

        await existProVari.save();

        return existProVari;
      }
      throw ErrorCode.PRODUCT_VARI_ALREADY_EXISTS();
    }

    payload.mainImage = files?.mainImage?.[0]?.path.replace(/\\/g, "/") || null;

    payload.hoverImage =
      files?.hoverImage?.[0]?.path.replace(/\\/g, "/") || null;

    payload.images =
      files?.images?.map((file) => file.path.replace(/\\/g, "/")) || [];

    const proVari = await ProductVariant.create({
      ...payload,
    });

    return proVari;
  }
  async update(id, payload, files) {
    const { colorCode, product } = payload;
    const proVari = await this.getByIdOrThrow(id);

    if (product) {
      const existPro = await Product.findById(product);
      if (!existPro) throw ErrorCode.PRODUCT_NOT_EXISTS();
    }
    if (colorCode) {
      const existProVari = await ProductVariant.findOne({
        product: payload.product || proVari.product,
        colorCode,
        _id: { $ne: id },
      });

      if (existProVari) throw ErrorCode.PRODUCT_VARI_ALREADY_EXISTS();
    }
    if (files?.mainImage) {
      deleteImage(proVari.mainImage);
      payload.mainImage = files.mainImage[0].path.replace(/\\/g, "/");
    }

    if (files?.hoverImage) {
      deleteImage(proVari.hoverImage);
      payload.hoverImage = files.hoverImage[0].path.replace(/\\/g, "/");
    }

    if (files?.images) {
      if (files?.images?.length > 10) {
        throw ErrorCode.MAX_IMAGES();
      }

      proVari.images.forEach((img) => deleteImage(img));
      payload.images = files.images.map((file) =>
        file.path.replace(/\\/g, "/"),
      );
    }
    updateFields(proVari, payload, [
      "product",
      "colorName",
      "colorCode",
      "mainImage",
      "hoverImage",
      "images",
      "status",
    ]);

    return await proVari.save();
  }
  async remove(id) {
    const proVari = await this.getByIdOrThrow(id);
    proVari.status = "discontinued";
    await proVari.save();
  }
  async getAll() {
    return await ProductVariant.find({
      status: { $ne: "inactive" },
    }).sort({
      createdAt: -1,
    });
  }
  async getById(id) {
    const proVari = await this.getByIdOrThrow(id);

    return proVari;
  }
  async getProductVariants(idProduct) {
    return await ProductVariant.find({
      product: idProduct,
    });
  }
  async updateOutOfStock(id) {
    const proVari = await this.getByIdOrThrow(id);
    proVari.status = "out_of_stock";
    return await proVari.save();
  }
  async checkExist(productId, colorCode) {
    if (!productId || !colorCode) {
      throw ErrorCode.INVALID_INPUT();
    }
    const exist = await ProductVariant.findOne({
      product: productId,
      colorCode,
    });

    if (!exist) {
      return {
        exists: false,
      };
    }

    return {
      exists: true,
      status: exist.status,
      data: exist,
    };
  }
}

module.exports = new ProductVariantService();
