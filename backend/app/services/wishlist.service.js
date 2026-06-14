const Wishlist = require("../models/wishlist.mode");
const ErrorCode = require("../constants/errors");
const ProVariItem = require("../models/product-variant-item.model");
const Cart = require("../models/cart.model");
class WishlistSerive {
  async create(idUser, payload) {
    let wishlist = await Wishlist.findOne({
      user: idUser,
    });
    let proVariItem = null;
    // user đã chọn size
    if (payload.productVariantItem) {
      proVariItem = await ProVariItem.findById(payload.productVariantItem);
    }
    // user chưa chọn size
    else if (payload.variant) {
      proVariItem = await ProVariItem.findOne({
        variant: payload.variant,
        stock: { $gt: 0 },
      }).sort({ size: 1 });
    }

    if (!proVariItem) {
      throw ErrorCode.PROVARI_ITEM_NOT_EXISTS();
    }
    const quantity = 1;
    // chưa có wishlist
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: idUser,
        items: [
          {
            productVariantItem: proVariItem._id,
            quantity,
          },
        ],
      });
      return wishlist;
    }
    // check tồn tại
    const existItem = (wishlist.items || []).find((item) => {
      if (!item?.productVariantItem) return false;

      return item.productVariantItem.toString() === proVariItem._id.toString();
    });
    if (existItem) {
      return wishlist;
    }
    wishlist.items.push({
      productVariantItem: proVariItem._id,
      quantity,
    });

    await wishlist.save();

    return wishlist;
  }

  async update(idUser, id, payload) {
    const wishlist = await Wishlist.findOne({
      user: idUser,
    });

    if (!wishlist) {
      throw ErrorCode.WISHLIST_NOT_EXISTS();
    }

    // id là itemId
    const item = wishlist.items.id(id);

    if (!item) {
      throw ErrorCode.WISHLIST_ITEM_NOT_EXISTS();
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

    await wishlist.save();

    return wishlist;
  }

  async removeId(idUser, itemId) {
    const wishlist = await Wishlist.findOne({
      user: idUser,
    });

    if (!wishlist) {
      throw ErrorCode.WISHLIST_NOT_EXISTS();
    }

    const item = wishlist.items.id(itemId);

    if (!item) {
      throw ErrorCode.WISHLIST_ITEM_NOT_EXISTS();
    }

    wishlist.items.pull({
      _id: itemId,
    });

    await wishlist.save();

    return true;
  }

  async removeAll(idUser) {
    await Wishlist.updateOne({ user: idUser }, { $set: { items: [] } });
  }

  async getAll(idUser) {
    // return await Wishlist.findOne({
    //   user: idUser,
    // }).populate({
    //   path: "items.productVariantItem",
    //   populate: {
    //     path: "variant",
    //     populate: {
    //       path: "product",
    //     },
    //   },
    // });
    return await Wishlist.findOne({ user: idUser }).populate(
      "items.productVariantItem",
    );
  }

  async moveToCart(id, idUser) {
    // id = wishlist item id

    const wishlist = await Wishlist.findOne({
      user: idUser,
    });

    if (!wishlist) {
      throw ErrorCode.WISHLIST_NOT_EXISTS();
    }

    // tìm item trong wishlist
    const wishItem = wishlist.items.id(id);

    if (!wishItem) {
      throw ErrorCode.WISHLIST_ITEM_NOT_EXISTS();
    }

    // kiểm tra sản phẩm
    const proVariItem = await ProVariItem.findById(wishItem.productVariantItem);

    if (!proVariItem) {
      throw ErrorCode.PROVARI_ITEM_NOT_EXISTS();
    }

    const stock = proVariItem.stock || 0;

    if (stock <= 0) {
      throw ErrorCode.OUT_OF_STOCK();
    }

    // tìm cart
    let cart = await Cart.findOne({
      user: idUser,
    });

    // chưa có cart tạo rỗng
    if (!cart) {
      cart = await Cart.create({
        user: idUser,
        items: [],
      });
    }

    // kiểm tra item đã tồn tại trong cart
    const existItem = cart.items.find((item) => {
      if (!item?.productVariantItem) return false;

      return (
        item.productVariantItem.toString() ===
        wishItem.productVariantItem.toString()
      );
    });

    // đã tồn tại -> cộng quantity
    if (existItem) {
      let newQty = existItem.quantity + wishItem.quantity;

      if (newQty > stock) {
        newQty = stock;
      }

      existItem.quantity = newQty;
    }
    // chưa có -> thêm mới
    else {
      const finalQty = Math.min(wishItem.quantity, stock);

      cart.items.push({
        productVariantItem: wishItem.productVariantItem,
        quantity: finalQty,
      });
    }

    await cart.save();

    // xóa khỏi wishlist
    wishlist.items.pull(id);

    await wishlist.save();

    return cart;
  }
}

module.exports = new WishlistSerive();
