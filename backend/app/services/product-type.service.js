const ProductType = require("../models/product-type.model");
const slugify = require("slugify");
const ErrorCode = require("../constants/errors");
const updateFields = require("../utils/updateFields.util");
const Product = require("../models/product.model");
const slugName = (name) =>
  slugify(name, {
    lower: true,
    locale: "vi",
    strict: true,
  });

class ProductTypeService {
  async getByIdOrThrow(id) {
    const type = await ProductType.findById(id);

    if (!type || type.isDeleted) {
      throw ErrorCode.PRODUCT_TYPE_NOT_EXISTS();
    }

    return type;
  }

  async create(payload) {
    const slug = slugName(payload.name);

    const exist = await ProductType.findOne({ slug });

    if (exist && !exist.isDeleted) {
      throw ErrorCode.PRODUCT_TYPE_ALREADY_EXISTS();
    }

    if (exist?.isDeleted) {
      exist.isDeleted = false;
      exist.isActive = true;
      exist.name = payload.name;
      exist.description = payload.description;

      await exist.save();

      return {
        data: exist,
        action: "restored",
      };
    }

    const type = await ProductType.create({
      ...payload,
      slug,
    });

    return {
      data: type,
      action: "created",
    };
  }

  async update(id, payload) {
    const type = await this.getByIdOrThrow(id);

    if (payload.name) {
      const slug = slugName(payload.name);

      const exist = await ProductType.findOne({
        slug,
        _id: {
          $ne: id,
        },
      });

      if (exist) {
        throw ErrorCode.PRODUCT_TYPE_ALREADY_EXISTS();
      }

      type.slug = slug;
      type.name = payload.name;
    }

    updateFields(type, payload, ["description", "isActive"]);

    await type.save();

    return type;
  }

  async remove(id) {
    const type = await this.getByIdOrThrow(id);

    const productExists = await Product.exists({
      productType: id,
      isDeleted: false,
    });

    if (productExists) {
      throw ErrorCode.PRODUCT_TYPE_IN_USE();
    }

    type.isDeleted = true;

    await type.save();
  }

  async getAllForAdmin() {
    // return ProductType.find({
    //   isDeleted: false,
    // }).sort({
    //   createdAt: -1,
    // });
    return ProductType.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "products",
          let: { productTypeId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$productType", "$$productTypeId"],
                },
                status: {
                  $ne: "discontinued",
                },
              },
            },
            {
              $count: "count",
            },
          ],
          as: "productCount",
        },
      },
      {
        $addFields: {
          productCount: {
            $ifNull: [
              {
                $arrayElemAt: ["$productCount.count", 0],
              },
              0,
            ],
          },
        },
      },
      {
        $sort: {
          name: -1,
        },
      },
    ]);
  }

  async getAllForUser() {
    // return ProductType.find({
    //   isDeleted: false,
    //   isActive: true,
    // }).sort({
    //   name: 1,
    // });
    return ProductType.aggregate([
      {
        $match: {
          isDeleted: false,
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "products",
          let: { productTypeId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$productType", "$$productTypeId"],
                },
                status: {
                  $ne: "discontinued",
                },
              },
            },
            {
              $count: "count",
            },
          ],
          as: "productCount",
        },
      },
      {
        $addFields: {
          productCount: {
            $ifNull: [
              {
                $arrayElemAt: ["$productCount.count", 0],
              },
              0,
            ],
          },
        },
      },
      {
        $sort: {
          name: -1,
        },
      },
    ]);
  }

  async getBySlug(slug) {
    const [productStyle] = await ProductType.aggregate([
      {
        $match: {
          slug: slug,
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "products",
          let: {
            productStyleId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$productType", "$$productStyleId"],
                },
                status: {
                  $ne: "discontinued",
                },
              },
            },
            {
              $count: "count",
            },
          ],
          as: "productCount",
        },
      },
      {
        $addFields: {
          productCount: {
            $ifNull: [
              {
                $arrayElemAt: ["$productCount.count", 0],
              },
              0,
            ],
          },
        },
      },
    ]);
    if (!productStyle) {
      throw ErrorCode.PRODUCT_TYPE_NOT_EXISTS();
    }
    return productStyle;
  }
}

module.exports = new ProductTypeService();
