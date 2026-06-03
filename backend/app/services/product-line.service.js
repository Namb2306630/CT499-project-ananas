const ProductLine = require("../models/product-line.model.js");
const ErrorCode = require("../constants/errors");
const slugify = require("slugify");
const updateFields = require("../utils/updateFields.until");

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

    const productLine = await ProductLine.findOne({ slug });

    if (productLine) {
      if (productLine.isDeleted) {
        productLine.isDeleted = false;
        productLine.isActive = true;

        await productLine.save();

        return productLine;
      }
      throw ErrorCode.PRODUCT_LINE_ALREADY_EXISTS();
    }
    return ProductLine.create({
      ...payload,
      slug,
    });
  }

  async update(id, payload) {
    const productLine = await this.getByIdOrThrow(id);

    const { name, slug, brand, description, isActive } = payload;

    if (name) {
      const slug = slugName(name);

      const eixisProductLine = await ProductLine.findOne({
        slug,
        _id: { $ne: id },
        isDeleted: false,
      });

      if (eixisProductLine) throw ErrorCode.PRODUCT_LINE_ALREADY_EXISTS();

      productLine.name = name;
      productLine.slug = slug;
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

  async getAll() {
    return ProductLine.find({ isDeleted: false, isActive: true }).sort({
      name: -1,
    });
  }

  async getById(id) {
    const productLine = await this.getByIdOrThrow(id);

    return productLine;
  }
}

module.exports = new ProductLineService();
