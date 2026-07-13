const Product = require("../models/product.model");
const Brand = require("../models/brand.model");
const Category = require("../models/category.model");
const ProductLine = require("../models/product-line.model");
const Style = require("../models/style.model");
const Collection = require("../models/collection.model");
const ErrorCode = require("../constants/errors");
const slugify = require("slugify");
const updateFields = require("../utils/updateFields.util");
const systemConfigService = require("./system-config.service");
const ProductVari = require("../models/product-variant.model");

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

  async validateRelations(payload) {
    const {
      categories = [],
      productLine,
      styles = [],
      productCollection,
    } = payload;

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

    const existCollection = await Collection.findOne({
      _id: productCollection,
      isDeleted: false,
    });

    if (!existCollection) {
      throw ErrorCode.COLLECTION_NOT_EXISTS();
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

    return payload;
  }

  async create(payload) {
    const { name, categories = [], productLine, styles = [] } = payload;

    const slug = slugName(name);

    const exist = await Product.findOne({ slug });

    // CREATE NEW
    if (!exist) {
      const validated = await this.validateRelations(payload);

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

      const product = await Product.create({
        ...validated,
        slug,
        basePrice,
        sellingPrice,
        status: "active",
      });
      return { data: product, action: "created" };
    }

    //  RESTORE (soft delete)
    if (exist.status === "discontinued") {
      await this.validateRelations({
        categories: exist.categories,
      });

      exist.status = "active";

      await exist.save();

      return {
        data: exist,
        action: "restored",
      };
    }

    throw ErrorCode.PRODUCT_SLUG_ALREADY_EXISTS();
  }

  async update(id, payload) {
    const product = await this.getByIdOrThrow(id);

    // lưu category cũ trước khi update
    // const oldCategories = product.categories.map((id) => id.toString());

    const { name, costPrice, discountPercent } = payload;

    if (name) {
      const slug = slugName(name);

      const exist = await Product.findOne({
        slug,
        _id: { $ne: id },
      });

      if (exist) {
        throw ErrorCode.PRODUCT_SLUG_ALREADY_EXISTS();
      }

      product.name = name;
      product.slug = slug;
    }

    if (payload.categories || payload.productLine || payload.styles) {
      await this.validateRelations(payload);
    }

    updateFields(product, payload, [
      "description",
      "categories",
      "productLine",
      "gender",
      "isBestSeller",
      "isNewArrival",
      "isSale",
      "defaultColor",
      "status",
    ]);

    // cập nhật productCount nếu đổi category
    // if (Array.isArray(payload.categories)) {
    //   await this.updateCategoryCount(oldCategories, payload.categories);
    // }

    const system = await systemConfigService.get();
    if (!system) throw ErrorCode.SYSTEM_NOT_EXISTS();

    let newBasePrice = product.basePrice;

    if (costPrice !== undefined) {
      newBasePrice = calculateBasePrice({
        costPrice,
        vatPercent: system.vatPercent,
        operatingCostPercent: system.operatingCostPercent,
        profitPercent: system.profitPercent,
      });

      product.basePrice = newBasePrice;
    }

    const finalDiscount = discountPercent ?? product.discountPercent ?? 0;

    if (costPrice !== undefined || discountPercent !== undefined) {
      product.sellingPrice = calculateSellingPrice(newBasePrice, finalDiscount);
    }

    await product.save();

    return product;
  }

  async remove(id) {
    const product = await this.getByIdOrThrow(id);

    // đã xóa rồi thì không làm nữa
    if (product.status === "discontinued") {
      return;
    }

    product.status = "discontinued";

    await product.save();
  }

  async getAllForAdmin() {
    return Product.find()
      .populate("productLine")
      .populate("categories")
      .sort({ createdAt: -1 });
  }

  async getAllForUser() {
    return Product.find({
      status: "active",
    }).sort({ createdAt: -1 });
  }

  async getBySlug(slug) {
    const product = await Product.findOne({
      slug,
      status: "active",
    })
      .populate("categories")
      .populate("styles")
      .populate("productLine");
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

  async getVariants(idProduct) {
    const exist = await this.getByIdOrThrow(idProduct);
    if (!exist) {
      throw ErrorCode.PRODUCT_NOT_EXISTS();
    }

    const product = await Product.findOne({
      _id: idProduct,
      status: { $ne: "inactive" },
    }).populate("variants");
    return product.variants;
  }

}

module.exports = new ProductService();
