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

  validateFiles(files) {
    if (!files?.mainImage?.length) throw ErrorCode.MAIN_IMAGE_REQUIRED();

    if (!files?.hoverImage?.length) throw ErrorCode.HOVER_IMAGE_REQUIRED();

    if (!files?.images?.length) throw ErrorCode.IMAGES_REQUIRED();

    if (files.images.length > 10) throw ErrorCode.MAX_IMAGES();
  }

  async create(payload, files) {
    const { product, colorCode } = payload;

    this.validateFiles(files);

    const existPro = await Product.findById(product);
    if (!existPro) throw ErrorCode.PRODUCT_NOT_EXISTS();

    const exist = await ProductVariant.findOne({
      product,
      colorCode,
    });

    if (!exist) {
      const created = await ProductVariant.create({
        ...payload,
        mainImage: files.mainImage[0].path.replace(/\\/g, "/"),
        hoverImage: files.hoverImage[0].path.replace(/\\/g, "/"),
        images: files.images.map((f) => f.path.replace(/\\/g, "/")),
      });

      return {
        data: created,
        action: "created",
      };
    }

    if (exist.status === "discontinued") {
      exist.status = "active";

      exist.colorName = payload.colorName;
      exist.colorCode = colorCode;

      exist.mainImage = files.mainImage[0].path.replace(/\\/g, "/");
      exist.hoverImage = files.hoverImage[0].path.replace(/\\/g, "/");
      exist.images = files.images.map((f) => f.path.replace(/\\/g, "/"));

      await exist.save();

      return {
        data: exist,
        action: "restored",
      };
    }

    throw ErrorCode.PRODUCT_VARI_ALREADY_EXISTS();
  }
  async update(id, payload, files) {
    const proVari = await this.getByIdOrThrow(id);

    const oldFiles = {
      mainImage: proVari.mainImage,
      hoverImage: proVari.hoverImage,
      images: [...proVari.images],
    };

    // validate product
    if (payload.product) {
      const exist = await Product.findById(payload.product);
      if (!exist) throw ErrorCode.PRODUCT_NOT_EXISTS();
    }

    // validate color
    if (payload.colorCode) {
      const exist = await ProductVariant.findOne({
        product: payload.product || proVari.product,
        colorCode: payload.colorCode,
        _id: { $ne: id },
      });

      if (exist) throw ErrorCode.PRODUCT_VARI_ALREADY_EXISTS();
    }

    // update images
    if (files?.mainImage) {
      proVari.mainImage = files.mainImage[0].path.replace(/\\/g, "/");
    }

    if (files?.hoverImage) {
      proVari.hoverImage = files.hoverImage[0].path.replace(/\\/g, "/");
    }

    if (files?.images) {
      if (files.images.length > 10) throw ErrorCode.MAX_IMAGES();

      proVari.images = files.images.map((f) => f.path.replace(/\\/g, "/"));
    }

    updateFields(proVari, payload, [
      "product",
      "colorName",
      "colorCode",
      "status",
    ]);

    await proVari.save();

    // DELETE OLD FILES AFTER SUCCESS
    if (files?.mainImage) deleteImage(oldFiles.mainImage);
    if (files?.hoverImage) deleteImage(oldFiles.hoverImage);
    if (files?.images) oldFiles.images.forEach(deleteImage);

    return proVari;
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
