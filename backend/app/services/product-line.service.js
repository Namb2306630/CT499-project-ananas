const ProductLine = require("../models/product-line.model.js");
const ErrorCode = require("../constants/errors");
const slugify = require("slugify");
const updateFields = require("../utils/updateFields.util");
const Product = require("../models/product.model.js");
const mongoose = require("mongoose");

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
    // const description =
    //   payload.description && payload.description.trim() !== ""
    //     ? payload.description
    //     : "Không có";

    if (!exist) {
      // CREATE NEW
      const doc = await ProductLine.create({
        ...payload,
        slug,
        // description,
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

    const hasProduct = await Product.exists({
      productLine: id,
      status: { $ne: "inactive" },
    });

    if (hasProduct) {
      throw ErrorCode.PRODUCT_LINE_HAS_PRODUCTS();
    }

    productLine.isActive = false;
    productLine.isDeleted = true;

    await productLine.save();
  }

  async getAllForAdmin() {
    return ProductLine.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "brand", //lấy id của brand
          foreignField: "_id", //ss id của brand với id của productline
          as: "brand",
        },
      },
      {
        // lookup trả về mảng -> unwind ép trả về đối tượng
        $unwind: {
          path: "$brand",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        // LEFT JOIN
        $lookup: {
          from: "products",
          //gán id của productLine vào productLineId
          let: {
            productLineId: "$_id",
          },
          //duyệt vào product
          pipeline: [
            {
              $match: {
                $expr: {
                  //kt 2 id có = ko
                  $eq: ["$productLine", "$$productLineId"],
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
        //thêm field mới vào doccument
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
    return ProductLine.aggregate([
      {
        $match: {
          isDeleted: false,
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "productLine",
          as: "products",
        },
      },
      {
        $addFields: {
          productCount: {
            //lấy độ dài của mảng
            $size: {
              //input: mảng cần duyệt (products).
              //as: đặt tên cho từng phần tử khi duyệt là product.
              //cond: điều kiện giữ lại.
              $filter: {
                input: "$products",
                as: "product",
                cond: {
                  $eq: ["$$product.status", "active"],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          products: 0,
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
    const [productLine] = await ProductLine.aggregate([
      {
        $match: {
          slug: slug,
          isDeleted: false,
        },
      },
      {
        //hiển thị thông tin của brand
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id", //ss id của brand với id của productline
          as: "brand",
        },
      },
      {
        // lookup trả về mảng -> unwind ép trả về đối tượng
        $unwind: {
          path: "$brand",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          let: {
            productLineId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$productLine", "$$productLineId"],
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
    if (!productLine) {
      throw ErrorCode.PRODUCT_LINE_NOT_EXISTS();
    }
    return productLine;
  }

  async getProducts(idLine) {
    const products = await Product.find({
      productLine: idLine,
      status: { $ne: "inactive" },
    }).populate("variants");

    return products;
  }
  async getOptions() {
    return await ProductLine.find(
      {
        isDeleted: false,
        isActive: true,
      },
      {
        name: 1,
      },
    ).sort({ name: 1 });
  }
}
module.exports = new ProductLineService();
