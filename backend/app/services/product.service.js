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
const ProductType = require("../models/product-type.model");
const ProductVariant = require("../models/product-variant.model");
const mongoose = require("mongoose");
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

  //tạo tên cho product = line + collection + style
  async generateProductName(payload) {
    const productLine = await ProductLine.findById(payload.productLine);

    const collection = payload.productCollection
      ? await Collection.findById(payload.productCollection)
      : null;

    const style = payload.style ? await Style.findById(payload.style) : null;

    const prefix = [productLine?.name, collection?.name]
      .filter(Boolean)
      .join(" ");

    return style?.name ? `${prefix} - ${style.name}` : prefix;
  }

  async validateRelations(payload) {
    const {
      categories = [],
      productType,
      productLine,
      productCollection,
      style,
    } = payload;

    // Product Type
    const existProductType = await ProductType.findOne({
      _id: productType,
      isDeleted: false,
    });

    if (!existProductType) {
      throw ErrorCode.PRODUCT_TYPE_NOT_EXISTS();
    }

    // Product Line
    const existProductLine = await ProductLine.findOne({
      _id: productLine,
      isDeleted: false,
    });

    if (!existProductLine) {
      throw ErrorCode.PRODUCT_LINE_NOT_EXISTS();
    }

    // Categories
    const existCategories = await Category.find({
      _id: { $in: categories },
      isDeleted: false,
    });

    if (existCategories.length !== categories.length) {
      throw ErrorCode.CATEGORY_NOT_EXISTS();
    }

    // Collection (không bắt buộc)
    if (productCollection) {
      const existCollection = await Collection.findOne({
        _id: productCollection,
        isDeleted: false,
      });

      if (!existCollection) {
        throw ErrorCode.COLLECTION_NOT_EXISTS();
      }
    }

    // Style (không bắt buộc)
    if (style) {
      const existStyle = await Style.findOne({
        _id: style,
        isDeleted: false,
      });

      if (!existStyle) {
        throw ErrorCode.STYLE_NOT_EXISTS();
      }
    }

    return payload;
  }

  async create(payload) {
    const { categories = [], productLine } = payload;

    const validated = await this.validateRelations(payload);

    // Sinh tên sản phẩm
    const name = await this.generateProductName(validated);

    // Sinh slug
    const slug = slugName(name);

    const exist = await Product.findOne({ slug });

    // CREATE NEW
    if (!exist) {
      const validated = await this.validateRelations(payload);

      const system = await systemConfigService.get();

      const basePrice = calculateBasePrice({
        costPrice: payload.costPrice,
        // vatPercent: system.vatPercent,
        operatingCostPercent: system.operatingCostPercent,
        profitPercent: system.profitPercent,
      });

      const originalPrice = basePrice;

      const sellingPrice = calculateSellingPrice(
        originalPrice,
        payload.discountPercent,
      );

      const isSale = payload.discountPercent > 0;

      const product = await Product.create({
        ...validated,
        name,
        slug,
        basePrice,
        originalPrice,
        sellingPrice,
        isSale,
        status: "active",
      });

      const card = await this.getCardById(product._id);

      return {
        data: card,
        action: "created",
      };
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

    const { costPrice, discountPercent } = payload;

    // Validate các quan hệ nếu có thay đổi
    if (
      payload.categories !== undefined ||
      payload.productLine !== undefined ||
      payload.productCollection !== undefined ||
      payload.style !== undefined ||
      payload.productType !== undefined
    ) {
      await this.validateRelations({
        categories: payload.categories ?? product.categories,
        productLine: payload.productLine ?? product.productLine,
        productCollection:
          payload.productCollection ?? product.productCollection,
        style: payload.style ?? product.style,
        productType: payload.productType ?? product.productType,
      });
    }

    // Cập nhật các field
    updateFields(product, payload, [
      "description",
      "categories",
      "productLine",
      "productCollection",
      "productType",
      "style",
      "gender",
      "isBestSeller",
      "isNewArrival",
      // "isSale",
      "defaultVariant",
      "status",
    ]);

    // Nếu thay đổi thông tin tạo tên thì sinh lại name + slug
    if (
      payload.productLine !== undefined ||
      payload.productCollection !== undefined ||
      payload.style !== undefined
    ) {
      const name = await this.generateProductName({
        productLine: product.productLine,
        productCollection: product.productCollection,
        style: product.style,
      });

      const slug = slugName(name);

      const exist = await Product.findOne({
        slug,
        _id: { $ne: product._id },
      });

      if (exist) {
        throw ErrorCode.PRODUCT_SLUG_ALREADY_EXISTS();
      }

      product.name = name;
      product.slug = slug;
    }

    const system = await systemConfigService.get();
    if (!system) {
      throw ErrorCode.SYSTEM_NOT_EXISTS();
    }

    let newBasePrice = product.basePrice;

    if (costPrice !== undefined) {
      newBasePrice = calculateBasePrice({
        costPrice,
        vatPercent: system.vatPercent,
        operatingCostPercent: system.operatingCostPercent,
        profitPercent: system.profitPercent,
      });

      product.basePrice = newBasePrice;
      product.originalPrice = newBasePrice;
    }

    const finalDiscount = discountPercent ?? product.discountPercent;
    if (costPrice !== undefined || discountPercent !== undefined) {
      product.discountPercent = finalDiscount;
      product.isSale = finalDiscount > 0;
      product.sellingPrice = calculateSellingPrice(
        product.originalPrice,
        finalDiscount,
      );
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

  async getAllForAdmin(page = 1) {
    page = Number(page);
    const limit = 10;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.aggregate([
        // lấy productLine
        // {
        //   $lookup: {
        //     from: "productlines",
        //     localField: "productLine",
        //     foreignField: "_id",
        //     as: "productLine",
        //   },
        // },

        // // đổi array thành object
        // {
        //   $unwind: {
        //     path: "$productLine",
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },

        // lấy productType
        {
          $lookup: {
            from: "producttypes",
            localField: "productType",
            foreignField: "_id",
            as: "productType",
          },
        },

        {
          $unwind: {
            path: "$productType",
            preserveNullAndEmptyArrays: true,
          },
        },

        // đếm variant
        {
          $lookup: {
            from: "productvariants",
            let: {
              productId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$product", "$$productId"],
                  },
                },
              },
              {
                $count: "total",
              },
            ],
            as: "variantCount",
          },
        },

        // lấy số lượng ra ngoài
        {
          $addFields: {
            variantCount: {
              $ifNull: [
                {
                  $arrayElemAt: ["$variantCount.total", 0],
                },
                0,
              ],
            },
          },
        },

        // sắp xếp
        {
          $sort: {
            createdAt: -1,
          },
        },

        // phân trang
        {
          $skip: skip,
        },

        {
          $limit: limit,
        },
      ]),

      Product.countDocuments(),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasPrev: page > 1,
        hasNext: page < Math.ceil(total / limit),
      },
    };
  }

  async getAllForUser() {
    return Product.find({
      status: "active",
    }).sort({ createdAt: -1 });
  }

  async getBySlug(slug) {
    const [product] = await Product.aggregate([
      {
        $match: {
          slug,
          status: "active",
        },
      },

      // Categories (array)
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories",
        },
      },

      // Product Type
      {
        $lookup: {
          from: "producttypes",
          localField: "productType",
          foreignField: "_id",
          as: "productType",
        },
      },
      {
        $unwind: {
          path: "$productType",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Product Collection
      {
        $lookup: {
          from: "productcollections",
          localField: "productCollection",
          foreignField: "_id",
          as: "productCollection",
        },
      },
      {
        $unwind: {
          path: "$productCollection",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Product Line
      {
        $lookup: {
          from: "productlines",
          localField: "productLine",
          foreignField: "_id",
          as: "productLine",
        },
      },
      {
        $unwind: {
          path: "$productLine",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Style
      {
        $lookup: {
          from: "styles",
          localField: "style",
          foreignField: "_id",
          as: "style",
        },
      },
      {
        $unwind: {
          path: "$style",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

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

  async getCardById(id) {
    const [product] = await Product.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },

      {
        $lookup: {
          from: "producttypes",
          localField: "productType",
          foreignField: "_id",
          as: "productType",
        },
      },

      {
        $unwind: {
          path: "$productType",
          preserveNullAndEmptyArrays: true,
        },
      },

      // lookup variantCount...
    ]);

    return product;
  }
}

module.exports = new ProductService();
