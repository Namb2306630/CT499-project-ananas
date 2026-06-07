const ProductLine = require("../models/product-line.model.js");
const ErrorCode = require("../constants/errors");
const slugify = require("slugify");
const updateFields = require("../utils/updateFields.until");
const Product = require("../models/product.model.js");

const slugName = (name) =>
  slugify(name, {
    lower: true,
    locale: "vi",
    strict: true,
  });

class ProductLineService {
  async getByIdOrThrow(id) {
    const productLine = await ProductLine.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!productLine) {
      throw ErrorCode.PRODUCT_LINE_NOT_EXISTS();
    }

    return productLine;
  }

  async create(payload) {
    const { name } = payload;
    const slug = slugName(name);

    const exist = await ProductLine.findOne({ slug });

    // CREATE NEW
    if (!exist) {
      const doc = await ProductLine.create({
        ...payload,
        slug,
      });

      return { data: doc, action: "created" };
    }

    // RESTORE + UPDATE
    if (exist.isDeleted) {
      exist.isDeleted = false;
      exist.isActive = true;

      exist.name = name;
      exist.slug = slug;

      await exist.save();

      return { data: exist, action: "restored" };
    }

    throw ErrorCode.PRODUCT_LINE_ALREADY_EXISTS();
  }

  async update(id, payload) {
    const productLine = await this.getByIdOrThrow(id);

    if (payload.name) {
      const newSlug = slugName(payload.name);

      const exist = await ProductLine.findOne({
        slug: newSlug,
        _id: { $ne: id },
        isDeleted: false,
      });

      if (exist) throw ErrorCode.PRODUCT_LINE_ALREADY_EXISTS();

      productLine.name = payload.name;
      productLine.slug = newSlug;
    }

    updateFields(productLine, payload, ["brand", "description", "isActive"]);

    await productLine.save();

    return productLine;
  }

  async delete(id) {
    const productLine = await this.getByIdOrThrow(id);
    productLine.isActive = false;
    productLine.isDeleted = true;
    await productLine.save();
  }

  async getAllForAdmin() {
    return ProductLine.find({ isDeleted: false }).sort({
      name: -1,
    });
  }

  async getAllForUser() {
    return ProductLine.find({ isDeleted: false, isActive: true }).sort({
      name: -1,
    });
  }

  async getById(id) {
    const productLine = await this.getByIdOrThrow(id);

    return productLine;
  }

  async getProducts(idLine) {
    const products = await Product.find({
      productLine: idLine,
      status: { $ne: "inactive" },
    }).populate("variants");

    return products;
  }
}
module.exports = new ProductLineService();
