const Cart = require("../models/cart.model");
const ErrorCode = require("../constants/errors");
const ProVariItem = require("../models/product-variant-item.model");

class CartSerive {
  async create(idUser, payload) {
    const { variantId, size, quantity } = payload;

    let cart = await Cart.findOne({
      user: idUser,
    });

    const proVariItem = await ProVariItem.findOne({
      variant: variantId,
      size: size,
      status: "active",
    });

    if (!proVariItem) {
      throw ErrorCode.PROVARI_ITEM_NOT_EXISTS();
    }

    const stock = proVariItem.stock ?? 0;

    if (stock <= 0) {
      throw ErrorCode.OUT_OF_STOCK();
    }

    const addQuantity = Math.min(quantity, stock);

    if (!cart) {
      cart = await Cart.create({
        user: idUser,
        items: [
          {
            productVariantItem: proVariItem._id,
            quantity: addQuantity,
          },
        ],
      });

      return cart;
    }

    const existItem = cart.items.find(
      (item) =>
        item.productVariantItem &&
        item.productVariantItem.toString() === proVariItem._id.toString(),
    );

    if (existItem) {
      const newQuantity = existItem.quantity + quantity;

      if (newQuantity > stock) {
        existItem.quantity = stock;
      } else {
        existItem.quantity = newQuantity;
      }

      await cart.save();

      return cart;
    }

    cart.items.push({
      productVariantItem: proVariItem._id,
      quantity: addQuantity,
    });

    await cart.save();

    return cart;
  }
  async update(idUser, id, payload) {
    const cart = await Cart.findOne({
      user: idUser,
    });

    if (!cart) {
      throw ErrorCode.CART_NOT_EXISTS();
    }

    const item = cart.items.id(id);

    if (!item) {
      throw ErrorCode.CART_ITEM_NOT_EXISTS();
    }

    const proVariItemId = payload.productVariantItem || item.productVariantItem;
    const proVariItem = await ProVariItem.findOne({
      _id: proVariItemId,
      status: "active",
    });

    if (!proVariItem) {
      throw ErrorCode.PROVARI_ITEM_NOT_EXISTS();
    }

    if (proVariItem.stock <= 0) {
      throw ErrorCode.OUT_OF_STOCK();
    }

    let quantity =
      payload.quantity !== undefined ? payload.quantity : item.quantity;

    quantity = Math.min(quantity, proVariItem.stock);
    item.productVariantItem = proVariItemId;
    item.quantity = quantity;
    await cart.save();
    return await this.getAll(idUser);
  }

  async removeId(idUser, itemId) {
    const cart = await Cart.findOne({
      user: idUser,
    });

    if (!cart) {
      throw ErrorCode.CART_NOT_EXISTS();
    }

    const item = cart.items.id(itemId);

    if (!item) {
      throw ErrorCode.CART_ITEM_NOT_EXISTS();
    }

    cart.items.pull({
      _id: itemId,
    });

    await cart.save();

    return true;
  }

  async removeAll(idUser) {
    await Cart.updateOne({ user: idUser }, { $set: { items: [] } });
  }

  async getAll(idUser) {
    const cart = await Cart.findOne({ user: idUser }).populate({
      path: "items.productVariantItem",
      select: "variant size sku stock",
      populate: {
        path: "variant",
        select: "product colorName colorCode mainImage",
        populate: {
          path: "product",
          select: "name sellingPrice originalPrice discountPercent",
        },
      },
    });

    if (!cart) {
      return null;
    }

    // Lấy các variant đang có trong cart
    const variantIds = cart.items
      .map((item) => item.productVariantItem?.variant?._id)
      .filter(Boolean);

    // Lấy toàn bộ size của các variant chỉ bằng 1 query
    const variantItems = await ProVariItem.find({
      variant: { $in: variantIds },
      status: "active",
      stock: { $gt: 0 },
    }).select("variant size sku stock");

    // Gắn danh sách size vào từng cart item
    const result = cart.toObject();

    result.items = result.items.map((item) => {
      const productVariantItem = item.productVariantItem;

      if (!productVariantItem) {
        return {
          ...item,
          isEnoughStock: false,
          stock: 0,
          variantItems: [],
        };
      }

      const stock = productVariantItem.stock ?? 0;

      return {
        ...item,
        stock,
        isEnoughStock: item.quantity <= stock,
        variantItems: variantItems.filter(
          (variantItem) =>
            variantItem.variant.toString() ===
            productVariantItem.variant._id.toString(),
        ),
      };
    });

    return result;
  }
}

module.exports = new CartSerive();
