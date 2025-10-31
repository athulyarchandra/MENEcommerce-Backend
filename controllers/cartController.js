import mongoose from "mongoose";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Orders from "../models/orderModel.js";

//  Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });
    if (quantity > product.stock)
      return res.status(400).json({ message: `Only ${product.stock} items left in stock` });

    let cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(req.user.id) });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal =
        (product.price - (product.price * (product.offer || 0) / 100)) *
        existingItem.quantity;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        images:
          product.productImages && product.productImages.length > 0
            ? product.productImages.map(img =>
                `${req.protocol}://${req.get("host")}/${img.replace(/\\/g, "/")}`
              )
            : [],

        quantity,
        size: product.size || "Default",
        color: product.color || "N/A",
        brand: product.brand || "N/A",
        offer: product.offer || 0,
        price: product.price,
        subtotal:
          (product.price - (product.price * (product.offer || 0) / 100)) * quantity,
      });
    }

    cart.grandTotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get Cart Items (Read)
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Update Item Quantity (Update)
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { action } = req.body; // "inc" or "dec"
    
    const userId = req.user?.id || req.session?.user;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user session found" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    if (action === "inc") {
      item.quantity += 1;
    } else if (action === "dec") {
      item.quantity = Math.max(1, item.quantity - 1);
    }

    item.subtotal = item.quantity * item.price;
    cart.grandTotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Quantity updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Remove a Single Item from Cart (Delete)
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      {
        $pull: { items: { productId } }
      },
      { new: true }
    );

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.grandTotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Clear Entire Cart (FULL DELETE) 
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.grandTotal = 0;
    await cart.save();

    res.status(200).json({ success: true, message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Checkout Cart
export const checkoutCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: `Product ${item.name} not found` });
      if (product.stock < item.quantity)
        return res.status(400).json({ message: `Only ${product.stock} items left for ${product.name}` });
    }

    const newOrder = new Orders({
      userId: req.user.id,
      items: cart.items,
      grandTotal: cart.grandTotal,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      status: "Pending",
    });

    await newOrder.save();

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    cart.items = [];
    cart.grandTotal = 0;
    cart.isCheckedOut = true;
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully! Stock updated.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ error: error.message });
  }
};
