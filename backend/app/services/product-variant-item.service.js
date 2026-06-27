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
    const cleanColorCode = colorCode.replace(/#/g, "");
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

    // lấy variant
    // const variant = await ProVariant.findById(payload.variant).populate(
    //   "product",
    // );

    const variant = await ProVariant.findById(payload.variant);

    if (!variant) {
      throw ErrorCode.PRODUCT_VARI_NOT_EXISTS();
    }

    // tạo SKU
    payload.sku = this.generateSku(
      variant._id,
      variant.colorCode,
      payload.size,
    );

    // trạng thái còn hàng
    payload.isInStock = payload.stock > 0;

    const created = await ProVariItem.create(payload);

    // sync variant status
    await ProVariantService.syncVariantStatus(payload.variant);

    return created;
  }

  async update(id, payload) {
    const proVariItem = await this.getByIdThrow(id);

    await this.validate(
      {
        variant: payload.variant || proVariItem.variant,
        size: payload.size || proVariItem.size,
      },
      id,
    );

    if (payload.variant !== undefined) {
      const variant = await ProVariant.findById(payload.variant);

      if (!variant) {
        throw ErrorCode.PRODUCT_VARI_NOT_EXISTS();
      }

      // tạo SKU
      payload.sku = this.generateSku(
        variant._id,
        variant.colorCode,
        payload.size,
      );
    }
    if (payload.stock !== undefined) {
      // cập nhật trạng thái sp
      payload.isInStock = payload.stock > 0;
    }

    updateFields(proVariItem, payload, [
      "variant",
      "size",
      "stock",
      "isInStock",
      "sku",
    ]);

    await proVariItem.save();

    // sync variant status
    await ProVariantService.syncVariantStatus(proVariItem.variant);

    return proVariItem;
  }

  async remove(id) {
    const proVariItem = await this.getByIdThrow(id);

    proVariItem.stock = 0;
    proVariItem.isInStock = proVariItem.stock > 0;
    // sync variant status
    await ProVariantService.syncVariantStatus(proVariItem.variant);

    await proVariItem.save();

    return true;
  }

  async getAll() {
    return await ProVariItem.find().populate("variant").sort({
      createdAt: -1,
    });
  }

  async getById(id) {
    return await this.getByIdThrow(id);
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

    item.isInStock = item.stock > 0;

    await item.save();

    await ProVariantService.syncVariantStatus(item.variant);

    return item;
  }

  async restoreStock(id, quantity) {
    const item = await this.getByIdThrow(id);

    item.stock += quantity;

    item.isInStock = item.stock > 0;

    await item.save();

    await ProVariantService.syncVariantStatus(item.variant);

    return item;
  }
}

module.exports = new ProVariItemService();
