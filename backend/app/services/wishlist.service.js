const Wishlist = require("../models/wishlist.mode");
const ErrorCode = require("../constants/errors");
const ProVariItem = require("../models/product-variant-item.model");

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

    let quantity = payload.quantity || item.quantity;

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
    const wishlist = await Wishlist.findOne({
      user: idUser,
    });

    if (!wishlist) {
      return true;
    }

    wishlist.items = [];

    await wishlist.save();

    return true;
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
    return await Wishlist.findOne({
      user: idUser,
    });
  }
}

module.exports = new WishlistSerive();
