import mongoose from "mongoose";
import  Cart  from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Orders from "../models/orderModel.js";

//addToCart
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
//getCartItems
export const getCart = async (req, res) => {
    console.log("User ID in addToCart:", req.user?.id);
      console.log("Inside getCart controller..");

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//Update quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//removeItemFromCArt
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { items: { productId } } },
      { new: true }
    );

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// checkoutCart 
export const checkoutCart = async (req, res) => {
  console.log("Inside checkoutCart");

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Only ${product.stock} items left for ${product.name}`,
        });
      }
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


