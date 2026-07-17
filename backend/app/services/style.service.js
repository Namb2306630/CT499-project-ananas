const Style = require("../models/style.model");
const ErrorCode = require("../constants/errors");
const updateFields = require("../utils/updateFields.util.js");
const slugify = require("slugify");
const Product = require("../models/product.model");

const slugName = (name) =>
  slugify(name, {
    lower: true,
    locale: "vi",
    strict: true,
  });

class StyleService {
  async getByIdOrThrow(id) {
    const style = await Style.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!style) {
      throw ErrorCode.STYLE_NOT_EXISTS();
    }

    return style;
  }

  async create(payload) {
    const { name } = payload;
    const slug = slugName(name);
    const style = await Style.findOne({ slug });

    if (style) {
      if (style.isDeleted) {
        style.isActive = true;
        style.isDeleted = false;

        style.name = name;
        if (payload.description) {
          style.description = payload.description;
        }

        await style.save();

        return {
          data: style,
          action: "restored",
        };
      }
      throw ErrorCode.STYLE_ALREADY_EXISTS();
    }

    const styleCreate = await Style.create({
      ...payload,
      slug,
    });

    return {
      data: styleCreate,
      action: "created",
    };
  }
  async update(id, payload) {
    const style = await this.getByIdOrThrow(id);
    const { name } = payload;
    if (name) {
      const slug = slugName(name);

      const eixisStyle = await Style.findOne({
        slug,
        _id: { $ne: id },
        isDeleted: false,
      });

      if (eixisStyle) throw ErrorCode.STYLE_ALREADY_EXISTS();

      style.name = name;
      style.slug = slug;
    }
    updateFields(style, payload, ["description", "isActive"]);
    await style.save();
    return style;
  }
  async remove(id) {
    const style = await this.getByIdOrThrow(id);

    const hasProduct = await Product.exists({
      styles: id,
      status: { $ne: "inactive" },
    });

    if (hasProduct) {
      throw ErrorCode.PRODUCT_LINE_HAS_PRODUCTS();
    }

    style.isActive = false;
    style.isDeleted = true;

    await style.save();
  }

  async getAllForUser() {
    // return await Style.find({
    //   isDeleted: false,
    //   isActive: true,
    // }).sort({ createdAt: -1 });

    return Style.aggregate([
      {
        $match: {
          isDeleted: false,
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "products",
          let: {
            styleId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$styles", "$$styleId"],
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
  }

  async getAllForAdmin() {
    // return await Style.find({
    //   isDeleted: false,
    // }).sort({ createdAt: -1 });

    return Style.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "products",
          let: {
            styleId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$style", "$$styleId"],
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
  }

  async getBySlug(slug) {
    // const style = await this.getByIdOrThrow(id);
    // return style;
    const [style] = await Style.aggregate([
      {
        $match: {
          slug: slug,
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "styles",
          pipeline: [
            {
              $match: {
                isDeleted: false,
              },
            },
          ],
          as: "product",
        },
      },
      {
        $addFields: {
          productCount: {
            $size: "$product",
          },
        },
      },
    ]);
    if (!style) {
      throw ErrorCode.STYLE_NOT_EXISTS();
    }
    return style;
  }

  async getProducts(idStyle) {
    const products = await Product.find({
      styles: idStyle,
      status: { $ne: "inactive" },
    }).populate("variants");

    return products;
  }
}

module.exports = new StyleService();
