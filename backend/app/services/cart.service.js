const Cart = require("../models/cart.model");
const ErrorCode = require("../constants/errors");
const ProVariItem = require("../models/product-variant-item.model");

class CartSerive {
  async create(idUser, payload) {
    let cart = await Cart.findOne({
      user: idUser,
    });

    let proVariItem = null;
    if (payload.size) {
      proVariItem = await ProVariItem.findOne({
        variant: payload.variantId,
        size: payload.size,
      });
    }

    if (!proVariItem) {
      throw ErrorCode.PROVARI_ITEM_NOT_EXISTS();
    }
    const quantity = payload.quantity;

    //tồn kho
    const stock = proVariItem.stock || 0;

    //chưa có cart
    if (!cart) {
      cart = await Cart.create({
        user: idUser,
        items: [
          {
            productVariantItem: proVariItem._id,
            quantity,
          },
        ],
      });
      return cart;
    }
    // check items đã tồn tại
    const existItem = (cart.items || []).find((item) => {
      if (!item?.productVariantItem) return false;

      return item.productVariantItem.toString() === proVariItem._id.toString();
    });
    if (existItem) {
      //cập nhật số lượng
      let newQuantity = existItem.quantity + quantity;

      if (stock <= 0) {
        throw ErrorCode.OUT_OF_STOCK();
      }

      if (newQuantity > stock) {
        newQuantity = stock;
      }

      existItem.quantity = newQuantity;
      await cart.save();
      return cart;
    }
    //chưa có items
    const finalQty = Math.min(quantity, stock);
    cart.items.push({
      productVariantItem: proVariItem._id,
      quantity: finalQty,
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

    // id là itemId
    const item = cart.items.id(id);

    if (!item) {
      throw ErrorCode.CART_ITEM_NOT_EXISTS();
    }

    let proVariItemId = payload.productVariantItem || item.productVariantItem;

    const proVariItem = await ProVariItem.findById(proVariItemId);

    if (!proVariItem) {
      throw ErrorCode.PROVARI_ITEM_NOT_EXISTS();
    }

    let quantity =
      payload.quantity !== undefined ? payload.quantity : item.quantity;

    // không vượt kho
    if (quantity > proVariItem.stock) {
      quantity = proVariItem.stock;
    }

    item.productVariantItem = proVariItemId;
    item.quantity = quantity;

    await cart.save();

    return cart;
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
    return await Cart.findOne({ user: idUser }).populate(
      "items.productVariantItem",
    );
  }
}

module.exports = new CartSerive();
