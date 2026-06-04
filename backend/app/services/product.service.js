const Product = require("../models/product.model");
const Brand = require("../models/brand.model");
const Category = require("../models/category.model");
const ProductLine = require("../models/product-line.model");
const Style = require("../models/style.model");
const ErrorCode = require("../constants/errors");
const slugify = require("slugify");
const updateFields = require("../utils/updateFields.until");
const systemConfigService = require("./system-config.service");

const {
  calculateBasePrice,
  calculateSellingPrice,
} = require("../utils/calcPrice.util");

const slugName = (name) =>
  slugify(name, {
    lower: true,
    locale: "vi",
    strict: true,
  });

class ProductService {
  async getByIdOrThrow(id) {
    const product = await Product.findById(id);

    if (!product) {
      throw ErrorCode.PRODUCT_NOT_EXISTS();
    }

    return product;
  }

  async create(payload) {
    const { name, categories = [], brand, productLine, styles = [] } = payload;

    // Tạo slug
    const slug = slugName(name);

    // Kiểm tra sản phẩm đã tồn tại chưa
    const existProduct = await Product.findOne({ slug });

    if (existProduct) {
      // Nếu đã ngừng kinh doanh thì mở lại
      if (existProduct.status === "discontinued") {
        existProduct.status = "active";

        updateFields(existProduct, payload, [
          "description",
          "categories",
          "brand",
          "productLine",
          "costPrice",
          "sellingPrice",
          "gender",
          "discountPercent",
          "styles",
          "isBestSeller",
          "isNewArrival",
          "isSale",
          "defaultColor",
        ]);

        await existProduct.save();

        return existProduct;
      }

      throw ErrorCode.PRODUCT_ALREADY_EXISTS();
    }

    const existBrand = await Brand.findOne({
      _id: brand,
      isDeleted: false,
    });

    if (!existBrand) {
      throw ErrorCode.BRAND_NOT_EXISTS();
    }

    const existProductLine = await ProductLine.findOne({
      _id: productLine,
      isDeleted: false,
    });

    if (!existProductLine) {
      throw ErrorCode.PRODUCT_LINE_NOT_EXISTS();
    }

    const existCategories = await Category.find({
      _id: { $in: categories },
      isDeleted: false,
    });

    if (existCategories.length !== categories.length) {
      throw ErrorCode.CATEGORY_NOT_EXISTS();
    }

    if (styles.length > 0) {
      const existStyles = await Style.find({
        _id: { $in: styles },
        isDeleted: false,
      });

      if (existStyles.length !== styles.length) {
        throw ErrorCode.STYLE_NOT_EXISTS();
      }
    }

    const system = await systemConfigService.get();

    const basePrice = calculateBasePrice({
      costPrice: payload.costPrice,
      vatPercent: system.vatPercent,
      operatingCostPercent: system.operatingCostPercent,
      profitPercent: system.profitPercent,
    });

    const sellingPrice = calculateSellingPrice(
      basePrice,
      payload.discountPercent,
    );

    return Product.create({
      ...payload,
      slug,
      basePrice,
      sellingPrice,
    });
  }

  async update(id, payload) {
    const product = await this.getByIdOrThrow(id);

    const { name } = payload;

    if (name) {
      const slug = slugName(name);

      const existProduct = await Product.findOne({
        slug,
        _id: { $ne: id },
      });

      if (existProduct) {
        throw ErrorCode.PRODUCT_ALREADY_EXISTS();
      }

      product.name = name;
      product.slug = slug;
    }
    updateFields(product, payload, [
      "description",
      "categories",
      "brand",
      "productLine",
      "costPrice",
      "gender",
      "discountPercent",
      "styles",
      "isBestSeller",
      "isNewArrival",
      "isSale",
      "defaultColor",
      "status",
    ]);

    const system = await systemConfigService.get();

    if (!system) {
      throw ErrorCode.SYSTEM_NOT_EXISTS();
    }

    let basePrice = product.basePrice;

    if (payload.costPrice !== undefined) {
      basePrice = calculateBasePrice({
        costPrice: payload.costPrice,
        vatPercent: system.vatPercent,
        operatingCostPercent: system.operatingCostPercent,
        profitPercent: system.profitPercent,
      });

      product.basePrice = basePrice;
    }

    const discountPercent =
      payload.discountPercent ?? product.discountPercent ?? 0;

    if (
      payload.costPrice !== undefined ||
      payload.discountPercent !== undefined
    ) {
      product.sellingPrice = calculateSellingPrice(basePrice, discountPercent);
    }
    await product.save();

    return product;
  }

  async remove(id) {
    const product = await this.getByIdOrThrow(id);

    product.status = "discontinued";

    await product.save();
  }

  async getAllForAdmin() {
    return Product.find()
      .populate("brand")
      .populate("productLine")
      .populate("categories")
      .sort({ createdAt: -1 });
  }

  async getAllForUser() {
    return Product.find({
      status: "active",
    })
      .populate("defaultColor")
      .sort({ createdAt: -1 });
  }

  async getBySlug(slug) {
    const product = await Product.findOne({
      slug,
      status: "active",
    })
      .populate("brand")
      .populate("categories")
      .populate("styles")
      .populate("productLine")
      .populate("defaultColor");

    if (!product) {
      throw ErrorCode.PRODUCT_NOT_EXISTS();
    }

    return product;
  }

  async search(keyword = "") {
    return Product.find({
      name: {
        $regex: keyword,
        $options: "i",
      },

      status: "active",
    }).sort({
      createdAt: -1,
    });
  }
}

module.exports = new ProductService();
