import Orders from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.session?.user;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const cart = await Cart.findOne({ userId });
    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate stock
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Only ${product.stock} items left for ${product.name}`
        });
      }
    }

    // Build order from cart
    const newOrder = new Orders({
      userId,
      items: cart.items.map(i => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        color: i.color,
        size: i.size,
        brand: i.brand,
        offer: i.offer,
        subtotal: i.subtotal
      })),
      grandTotal: cart.grandTotal,
      shippingAddress: req.body.shippingAddress || "Default Shipping Address",
      paymentMethod: req.body.paymentMethod || "Cash on Delivery",
      status: "Pending",
      userDeleted: false
    });

    await newOrder.save();

    // DecreaseProduct stock
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock = Math.max(0, (product.stock || 0) - (item.quantity || 0));
        await product.save();
      }
    }

    // Clear cart
    cart.items = [];
    cart.grandTotal = 0;
    cart.isCheckedOut = true;
    await cart.save();

    return res.status(201).json({ success: true, message: "Order placed", order: newOrder });
  } catch (err) {
    console.error("createOrderFromCart error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.session?.user;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const orders = await Orders.find({ userId, userDeleted: { $ne: true } }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("getUserOrders error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Cancel 
export const cancelOrderByUser = async (req, res) => {
  try {
    const userId = req.session?.user;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const { orderId } = req.params;
    const order = await Orders.findOne({ _id: orderId, userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Order cannot be cancelled at this stage" });
    }

    order.status = "Cancelled";
    order.userDeleted = true;
    await order.save();

    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock = (product.stock || 0) + (item.quantity || 0);
        await product.save();
      }
    }

    return res.status(200).json({ success: true, message: "Order cancelled & hidden from your view", order });
  } catch (err) {
    console.error("cancelOrderByUser error:", err);
    return res.status(500).json({ error: err.message });
  }
};
//getOrderDetails
export const getOrderDetails = async (req, res) => {
  try {
    const userId = req.session?.user;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const { orderId } = req.params;

    const order = await Orders.findOne({
      _id: orderId,
      userId,
      userDeleted: { $ne: true },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ success: true, order });

  } catch (err) {
    console.error("getOrderDetails error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// GetAllOrders for admin
export const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Orders.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("getAllOrdersForAdmin error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// GetSingleOrder 
export const getOrderByIdForAdmin = async (req, res) => {
  try {
    const order = await Orders.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("getOrderByIdForAdmin error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Orders.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    return res.status(500).json({ error: err.message });
  }
};
