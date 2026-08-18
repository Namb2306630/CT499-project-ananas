const Order = require("../models/order.model");
const OrderItem = require("../models/order-item.model");
const Product = require("../models/product.model");
const ProductVariant = require("../models/product-variant.model");
const ProductVariantItem = require("../models/product-variant-item.model");
const SystemConfig = require("../models/system-config.model");
const ErrorCode = require("../constants/errors");
const ProductVariantService = require("./product-variant.service");
const ProVariItemService = require("./product-variant-item.service");
const Cart = require("../models/cart.model");
class OrderService {
  generateOrderCode() {
    const random = Math.floor(100000 + Math.random() * 900000);

    return `DH${Date.now()}${random}`;
  }

  async create(payload, userId) {
    const { items, paymentMethod } = payload;
    if (!items || items.length === 0) {
      throw ErrorCode.BAD_REQUEST("Đơn hàng rỗng");
    }
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const variantItem = await ProductVariantItem.findById(item.variantItem);

      if (!variantItem) {
        throw ErrorCode.PROVARI_ITEM_NOT_EXISTS();
      }

      // check stock
      if (variantItem.stock < item.quantity) {
        throw ErrorCode.BAD_REQUEST("Không đủ tồn kho");
      }
      const variant = await ProductVariant.findById(variantItem.variant);
      if (!variant) {
        throw ErrorCode.PRODUCT_VARI_NOT_EXISTS();
      }
      const product = await Product.findById(variant.product);
      if (!product) {
        throw ErrorCode.PRODUCT_NOT_EXISTS();
      }

      // giá tại thời điểm mua
      const unitPrice = product.sellingPrice;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;
      // trừ kho
      await ProVariItemService.purchase(variantItem._id, item.quantity);

      orderItems.push({
        product: product._id,
        variant: variant._id,
        variantItem: variantItem._id,
        // snapshot
        productName: product.name,
        colorName: variant.colorName,
        size: variantItem.size,
        sku: variantItem.sku,
        productImage: variant.mainImage,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });
    }

    // config hệ thống
    const systemConfig = await SystemConfig.findOne();

    // phí ship mặc định
    let shippingFee = 30000;

    // free ship
    if (systemConfig && subtotal >= systemConfig.freeShippingThreshold) {
      shippingFee = 0;
    }

    const productDiscount = 0;
    const voucherDiscount = 0;
    const totalAmount =
      subtotal - productDiscount - voucherDiscount + shippingFee;
    // tạo order
    const order = await Order.create({
      user: userId,
      orderCode: this.generateOrderCode(),
      subtotal,
      productDiscount,
      voucherDiscount,
      shippingFee,
      totalAmount,
      paymentMethod,
    });

    // tạo order items
    const finalItems = orderItems.map((item) => ({
      ...item,
      order: order._id,
    }));

    await OrderItem.insertMany(finalItems);

    // Xóa sản phẩm đã mua khỏi giỏ hàng
    await Cart.findOneAndUpdate(
      { user: userId },
      {
        $pull: {
          items: {
            productVariantItem: {
              $in: items.map((item) => item.variantItem),
            },
          },
        },
      },
    );

    return await Order.findById(order._id);
  }

  async findAll() {
    const orders = await Order.find()
      .populate("user", "userName phone")
      .sort({
        createdAt: -1,
      })
      .lean();

    const orderIds = orders.map((order) => order._id);

    const items = await OrderItem.find({
      order: { $in: orderIds },
    })
      .select(
        "order product variant variantItem productName colorName size sku productImage quantity unitPrice totalPrice",
      )
      .lean();

    const itemsByOrder = {};

    for (const item of items) {
      const orderId = item.order.toString();

      if (!itemsByOrder[orderId]) {
        itemsByOrder[orderId] = [];
      }

      itemsByOrder[orderId].push(item);
    }

    return orders.map((order) => ({
      ...order,
      items: itemsByOrder[order._id.toString()] || [],
    }));
  }

  async findById(id) {
    const order = await Order.findOne({ orderCode: id }).populate(
      "user",
      "userName phone",
    );

    if (!order) {
      throw ErrorCode.ORDER_NOT_EXISTS();
    }

    return order;
  }

  // async findByUser(userId) {
  //   return await Order.find({
  //     user: userId,
  //   })
  //     .populate("user")
  //     .sort({
  //       createdAt: -1,
  //     });
  // }
  async findByUser(userId) {
    const orders = await Order.find({ user: userId })
      .populate("user", "userName phone")
      .sort({
        createdAt: -1,
      })
      .lean();

    const orderIds = orders.map((order) => order._id);

    const items = await OrderItem.find({
      order: { $in: orderIds },
    })
      .select(
        "order product variant variantItem productName colorName size sku productImage quantity unitPrice totalPrice",
      )
      .lean();

    const itemsByOrder = {};

    for (const item of items) {
      const orderId = item.order.toString();

      if (!itemsByOrder[orderId]) {
        itemsByOrder[orderId] = [];
      }

      itemsByOrder[orderId].push(item);
    }

    return orders.map((order) => ({
      ...order,
      items: itemsByOrder[order._id.toString()] || [],
    }));
  }

  async update(id, payload) {
    const order = await Order.findById(id);

    if (!order) {
      throw ErrorCode.ORDER_NOT_EXISTS();
    }

    return await Order.findByIdAndUpdate(id, payload, {
      new: true,
    });
  }

  async cancelOrder(orderId, userId) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw ErrorCode.ORDER_NOT_EXISTS();
    }

    if (order.user.toString() !== userId.toString()) {
      throw ErrorCode.FORBIDDEN();
    }

    if (["completed", "cancelled"].includes(order.orderStatus)) {
      throw ErrorCode.BAD_REQUEST("Không thể hủy đơn hàng");
    }

    // lấy order items
    const orderItems = await OrderItem.find({
      order: orderId,
    });

    // hoàn stock
    for (const item of orderItems) {
      await ProVariItemService.restoreStock(item.variantItem, item.quantity);
    }
    order.orderStatus = "cancelled";

    await order.save();

    return order;
  }
  async updateStatus(orderCode, orderStatus) {
    const allowedStatus = [
      "pending",
      "confirmed",
      "shipping",
      "completed",
      "cancelled",
    ];

    if (!allowedStatus.includes(orderStatus)) {
      throw ErrorCode.INVALID_ORDER_STATUS();
    }

    const order = await Order.findOneAndUpdate(
      { orderCode },
      {
        $set: {
          orderStatus,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("user", "userName phone");

    if (!order) {
      throw ErrorCode.ORDER_NOT_EXISTS();
    }

    return order;
  }
}

module.exports = new OrderService();
