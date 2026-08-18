const ProductVariant = require("../models/product-variant.model");
const ErrorCode = require("../constants/errors");
const updateFields = require("../utils/updateFields.util");
const { deleteImage, uploadImg } = require("../utils/uploadImage.util");
const Product = require("../models/product.model");
const ProductVariantItem = require("../models/product-variant-item.model");
const mongoose = require("mongoose");
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
    const { product, colorCode, colorName, _id } = payload;

    const existID = await ProductVariant.findById(_id);

    if (existID) throw ErrorCode.PRODUCT_ID_ALREADY_EXISTS();

    this.validateFiles(files);

    const existPro = await Product.findById(product);
    if (!existPro) throw ErrorCode.PRODUCT_NOT_EXISTS();

    const exist = await ProductVariant.findOne({
      product,
      $or: [{ colorCode }, { colorName }],
    });

    if (!exist) {
      const created = await ProductVariant.create({
        ...payload,
        mainImage: files.mainImage[0].path.replaceAll("\\", "/"),
        hoverImage: files.hoverImage[0].path.replaceAll("\\", "/"),
        images: files.images.map((f) => f.path.replaceAll("\\", "/")),
      });
      const result = await this.getById(created._id);
      return {
        data: result,
        action: "created",
      };
    }

    if (exist.status === "discontinued") {
      exist.status = "active";

      exist.colorName = payload.colorName;
      exist.colorCode = colorCode;

      exist.mainImage = files.mainImage[0].path.replaceAll("\\", "/");
      exist.hoverImage = files.hoverImage[0].path.replaceAll("\\", "/");
      exist.images = files.images.map((f) => f.path.replaceAll("\\", "/"));

      await exist.save();

      return {
        data: await this.getById(exist._id),
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
    const product = payload.product ?? proVari.product;
    const colorCode = payload.colorCode ?? proVari.colorCode;
    const colorName = payload.colorName ?? proVari.colorName;

    const exist = await ProductVariant.findOne({
      product,
      _id: { $ne: id },
      $or: [{ colorCode }, { colorName }],
    });

    if (exist) {
      throw ErrorCode.PRODUCT_VARI_ALREADY_EXISTS();
    }

    // update images
    if (files?.mainImage) {
      proVari.mainImage = files.mainImage[0].path.replaceAll("\\", "/");
    }

    if (files?.hoverImage) {
      proVari.hoverImage = files.hoverImage[0].path.replaceAll("\\", "/");
    }
    // payload.images đã chứa cả ảnh cũ và ảnh mới
    let images = [];
    if (payload.images) {
      images = Array.isArray(payload.images)
        ? payload.images
        : [payload.images];
    }

    if (images.length > 10) {
      throw ErrorCode.MAX_IMAGES();
    }

    proVari.images = images;

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
    const deletedImages = oldFiles.images.filter(
      (img) => !proVari.images.includes(img),
    );

    deletedImages.forEach(deleteImage);

    return await this.getById(proVari._id);
  }
  async remove(id) {
    const proVari = await this.getByIdOrThrow(id);

    const exist = await ProductVariantItem.exists({
      variant: id,
    });

    if (exist) {
      throw ErrorCode.PRODUCT_VARIANT_IN_USE();
    }

    proVari.status = "discontinued";
    await proVari.save();
    return proVari;
  }
  async getAll() {
    return await ProductVariant.aggregate([
      // {
      //   $match: {
      //     status: { $ne: "discontinued" },
      //   },
      // },

      // join Product
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },

      {
        $unwind: "$product",
      },

      // join VariantItem
      {
        $lookup: {
          from: "productvariantitems",
          localField: "_id",
          foreignField: "variant",
          as: "variantItems",
        },
      },

      // đếm số size
      {
        $addFields: {
          variantItemCount: {
            $size: "$variantItems",
          },

          displayName: {
            $concat: ["$product.name", " - ", "$colorName"],
          },
        },
      },

      // bỏ dữ liệu không cần trả vê các tường này
      // 0 là bỏ, 1 là lấy
      {
        $project: {
          _id: 1,
          product: {
            _id: "$product._id",
            name: "$product.name",
            slug: "$product.slug",
          },
          colorName: 1,
          colorCode: 1,
          mainImage: 1,
          hoverImage: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          variantItemCount: 1,
          displayName: 1,
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
  }

  async getAllForUser() {
    return ProductVariant.aggregate([
      {
        $match: {
          status: {
            $in: ["active", "out_of_stock"],
          },
        },
      },

      {
        $lookup: {
          from: "products",
          let: {
            productId: "$product",
          },
          pipeline: [
            {
              $match: {
                status: "active",
                $expr: {
                  $eq: ["$_id", "$$productId"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                slug: 1,
                sellingPrice: 1,
                originalPrice: 1,
                discountPercent: 1,
                gender: 1,
                isBestSeller: 1,
                isNewArrival: 1,
                isSale: 1,
                ratingAverage: 1,
                ratingCount: 1,
              },
            },
          ],
          as: "product",
        },
      },

      // 3. Product bắt buộc phải tồn tại
      {
        $unwind: "$product",
      },

      // 4. Chỉ lấy field cần cho ProductList
      {
        $project: {
          _id: 1,
          product: 1,
          colorName: 1,
          colorCode: 1,
          mainImage: 1,
          hoverImage: 1,
          status: 1,
        },
      },

      // 5. Mới nhất trước
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
  }
  async getById(id) {
    const [proVari] = await ProductVariant.aggregate([
      {
        $match: {
          _id: id,
        },
      },

      // join Product
      {
        $lookup: {
          from: "products",
          let: {
            productId: "$product",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$productId"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                slug: 1,
              },
            },
          ],
          as: "product",
        },
      },

      {
        $unwind: "$product",
      },

      // join VariantItem
      {
        $lookup: {
          from: "productvariantitems",
          localField: "_id",
          foreignField: "variant",
          as: "variantItems",
        },
      },

      // đếm số size
      {
        $addFields: {
          variantItemCount: {
            $size: "$variantItems",
          },

          displayName: {
            $concat: ["$product.name", " - ", "$colorName"],
          },
        },
      },

      {
        $project: {
          variantItems: 0,
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    if (!proVari) throw ErrorCode.PRODUCT_VARI_NOT_EXISTS();

    return proVari;
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

  async getProductColor(idProduct, colorCode) {
    return await ProductVariant.findOne({
      product: idProduct,
      colorCode: colorCode,
    });
  }

  async getColors(colorCode) {
    return await ProductVariant.aggregate([
      {
        $match: {
          colorCode,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $lookup: {
          from: "productvariantitems",
          localField: "_id",
          foreignField: "variant",
          as: "variantItems",
        },
      },
      {
        $addFields: {
          displayName: {
            $concat: ["$product.name", " - ", "$colorName"],
          },
          variantItemCount: {
            $size: "$variantItems",
          },
          totalStock: {
            $sum: "$variantItems.stock",
          },
        },
      },
      {
        $project: {
          variantItems: 0,
        },
      },
    ]);
  }

  async syncVariantStatus(variantId) {
    const hasStock = await ProductVariantItem.exists({
      variant: variantId,
      stock: { $gt: 0 },
    });

    const status = hasStock ? "active" : "out_of_stock";

    await ProductVariant.updateOne({ _id: variantId }, { status });

    return status;
  }

  async getOptions(productId) {
    const filter = {
      status: {
        $nin: ["inactive", "discontinued"],
      },
    };

    if (productId) {
      filter.product = productId;
    }

    return await ProductVariant.find(filter, {
      colorName: 1,
      colorCode: 1,
      mainImage: 1,
      product: 1,
    })
      .populate("product", "name")
      .sort({ colorName: 1 });
  }

  async getDetailForUser(variantId) {
    const [variant] = await ProductVariant.aggregate([
      {
        $match: {
          _id: variantId,
          status: {
            $in: ["active", "out_of_stock"],
          },
        },
      },
      {
        $lookup: {
          from: "products",
          let: {
            productId: "$product",
          },
          pipeline: [
            {
              $match: {
                status: "active",
                $expr: {
                  $eq: ["$_id", "$$productId"],
                },
              },
            },
            {
              $lookup: {
                from: "producttypes",
                let: {
                  typeId: "$productType",
                },
                pipeline: [
                  {
                    $match: {
                      isActive: true,
                      isDeleted: false,
                      $expr: {
                        $eq: ["$_id", "$$typeId"],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                    },
                  },
                ],
                as: "productType",
              },
            },
            {
              $unwind: {
                path: "$productType",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $match: {
                status: "active",
                $expr: {
                  $eq: ["$_id", "$$productId"],
                },
              },
            },
            {
              $lookup: {
                from: "productlines",
                let: {
                  lineId: "$productLine",
                },
                pipeline: [
                  {
                    $match: {
                      isActive: true,
                      isDeleted: false,
                      $expr: {
                        $eq: ["$_id", "$$lineId"],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                    },
                  },
                ],
                as: "productLine",
              },
            },
            {
              $unwind: {
                path: "$productLine",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $project: {
                _id: 1,
                name: 1,
                slug: 1,

                sellingPrice: 1,
                originalPrice: 1,
                discountPercent: 1,

                gender: 1,

                isBestSeller: 1,
                isNewArrival: 1,
                isSale: 1,

                ratingAverage: 1,
                ratingCount: 1,

                productType: 1,
                productLine: 1,

                description: 1,
              },
            },
          ],
          as: "product",
        },
      },

      {
        $unwind: "$product",
      },
      {
        $lookup: {
          from: "productvariantitems",
          let: {
            variantId: "$_id",
          },
          pipeline: [
            {
              $match: {
                status: "active",
                stock: { $gt: 0 },
                $expr: {
                  $eq: ["$variant", "$$variantId"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                size: 1,
                stock: 1,
                status: 1,
              },
            },
            {
              $sort: {
                size: 1,
              },
            },
          ],
          as: "items",
        },
      },

      {
        $project: {
          _id: 1,
          product: 1,
          colorName: 1,
          colorCode: 1,
          mainImage: 1,
          hoverImage: 1,
          images: 1,
          status: 1,
          items: 1,
        },
      },
    ]);

    if (!variant) {
      throw ErrorCode.PRODUCT_VARI_NOT_EXISTS();
    }

    return variant;
  }
}

module.exports = new ProductVariantService();
