const ProVariItem = require("../models/product-variant-item.model");
const ErrorCode = require("../constants/errors");
const updateFields = require("../utils/updateFields.util");
const ProVariant = require("../models/product-variant.model");
const ProVariantService = require("./product-variant.service");
const ProductVariant = require("../models/product-variant.model");

class ProVariItemService {
  // generateSku(productId, colorCode, size) {
  //   return `${productId}-${colorCode}-${size}`.toUpperCase();
  // }

  generateSku(variantId, colorCode, size) {
    const cleanColorCode = colorCode.replaceAll("#", "");
    return `${variantId}-${cleanColorCode}-${size}`.toUpperCase();
  }

  async getByIdThrow(id) {
    const proVariItem = await ProVariItem.findById(id);

    if (!proVariItem) {
      throw ErrorCode.PROVARI_ITEM_NOT_EXISTS();
    }

    return proVariItem;
  }

  async validate(payload, id = null) {
    // validate size trùng trong cùng variant
    if (payload.size && payload.variant) {
      const exist = await ProVariItem.findOne({
        variant: payload.variant,
        size: payload.size,
        _id: { $ne: id },
      });

      if (exist) {
        throw ErrorCode.PROVARI_ITEM_SIZE_ALREADY_EXISTS();
      }
    }

    // validate variant tồn tại
    if (payload.variant) {
      const variant = await ProVariant.findById(payload.variant);

      if (!variant) {
        throw ErrorCode.PRODUCT_VARI_NOT_EXISTS();
      }
    }

    return true;
  }

  async create(payload) {
    await this.validate(payload);

    const variant = await ProVariant.findById(payload.variant);

    if (!variant) {
      throw ErrorCode.PRODUCT_VARI_NOT_EXISTS();
    }

    const docs = payload.sizes.map((item) => ({
      variant: payload.variant,
      size: item.size,
      stock: item.stock,
      sku: this.generateSku(variant._id, variant.colorCode, item.size),
      // isInStock: item.stock > 0,
    }));

    // check SKU tồn tại
    const skus = docs.map((item) => item.sku);

    //lấy các sản phẩm đã tồn tại bị trùng size trên cũng một variant
    const exists = await ProVariItem.find({
      sku: { $in: skus },
    }).select("size"); // chỉ yêu cầu mongo trả về size ko cần trả về các trường khác

    if (exists.length > 0) {
      const duplicateSizes = exists.map((item) => item.size);

      throw ErrorCode.PROVARI_ITEM_SIZE_ALREADY_EXISTS(duplicateSizes);
    }

    const created = await ProVariItem.insertMany(docs);

    await ProVariantService.syncVariantStatus(payload.variant);

    const ids = created.map((item) => item._id);
    const result = await ProVariItem.aggregate([
      {
        $match: {
          _id: { $in: ids },
        },
      },
      {
        $lookup: {
          from: "productvariants",
          let: {
            variantId: "$variant",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$variantId"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                colorName: 1,
              },
            },
          ],
          as: "variant",
        },
      },
      {
        $unwind: {
          path: "$variant",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          variant: 1,
          size: 1,
          sku: 1,
          stock: 1,
          status: 1,
          createdAt: 1,
        },
      },
    ]);

    return result;

  }
  async update(id, payload) {
    const proVariItem = await this.getByIdThrow(id);

    await this.validate(
      {
        variant: payload.variant ?? proVariItem.variant,
        size: payload.size ?? proVariItem.size,
      },
      id,
    );

    let variant = null;

    if (payload.variant) {
      variant = await ProVariant.findById(payload.variant);

      if (!variant) {
        throw ErrorCode.PRODUCT_VARI_NOT_EXISTS();
      }
    } else {
      variant = await ProVariant.findById(proVariItem.variant);
    }

    if (payload.variant !== undefined || payload.size !== undefined) {
      payload.sku = this.generateSku(
        variant._id,
        variant.colorCode,
        payload.size ?? proVariItem.size,
      );
    }
    // if (payload.stock !== undefined) {
    //   // cập nhật trạng thái sp
    //   payload.isInStock = payload.stock > 0;
    // }

    updateFields(proVariItem, payload, [
      "variant",
      "size",
      "stock",
      // "isInStock",
      "sku",
    ]);

    await proVariItem.save();

    // sync variant status
    await ProVariantService.syncVariantStatus(proVariItem.variant);

    return proVariItem;
  }

  async remove(id) {
    const item = await this.getByIdThrow(id);

    item.status = "discontinued";
    // item.stock = 0;
    // item.isInStock = false;

    await item.save();

    // Đồng bộ trạng thái ProductVariant sau khi cập nhật Item
    await ProVariantService.syncVariantStatus(item.variant);

    // return true;

    return item;
  }

  async getAll() {
    // return await ProVariItem.find().populate("variant").sort({
    //   createdAt: -1,
    // });
    return await ProVariItem.aggregate([
      {
        $lookup: {
          from: "productvariants",
          let: {
            variantId: "$variant",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$variantId"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                colorName: 1,
              },
            },
          ],
          as: "variant",
        },
      },
      {
        $unwind: {
          path: "$variant",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          variant: 1,
          size: 1,
          sku: 1,
          stock: 1,
          status: 1,
          createdAt: 1,
        },
      },
    ]);
  }

  async getBySku(sku) {
    const item = await ProVariItem.findOne({ sku });

    if (!item) {
      throw ErrorCode.PROVARI_ITEM_NOT_EXISTS();
    }

    return item;
  }

  async getSizesByVariant(idVariant) {
    return await ProVariItem.find({
      variant: idVariant,
    }).sort({
      size: 1,
    });
  }

  async getSize(size) {
    const data = await ProVariItem.find({
      size,
    });

    if (data.length === 0) {
      throw ErrorCode.PROVARI_ITEM_NOT_EXISTS();
    }

    return data;
  }

  async purchase(id, quantity) {
    const item = await this.getByIdThrow(id);

    if (item.stock < quantity) throw ErrorCode.PRODUCT_OUT_OF_STOCK();

    item.stock -= quantity;

    // item.isInStock = item.stock > 0;

    await item.save();

    await ProVariantService.syncVariantStatus(item.variant);

    return item;
  }

  async restoreStock(id, quantity) {
    const item = await this.getByIdThrow(id);

    item.stock += quantity;

    // item.isInStock = item.stock > 0;

    await item.save();

    await ProVariantService.syncVariantStatus(item.variant);

    return item;
  }
}

module.exports = new ProVariItemService();
