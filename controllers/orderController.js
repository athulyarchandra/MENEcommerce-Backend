import Orders from "../models/orderModel.js";

//getOrders-user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Orders.find({ userId: req.user.id })
      .populate("items.productId", "name price brand grandTotal paymentMethod")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//getAllOrders-Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find()
      .populate("userId", "username email")
      .populate("items.productId", "name price brand")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// userUpdates shipping details before shipment
export const updateShippingAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { shippingAddress } = req.body;

    const order = await Orders.findOne({ _id: id, userId: req.user.id });

    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.status !== "Pending")
      return res.status(400).json({ error: "Cannot update shipped or delivered order" });

    order.shippingAddress = shippingAddress;
    await order.save();

    res.status(200).json({ message: "Address updated successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// updateOrder (Admin only)
export const updateOrder = async (req, res) => {
        console.log("Inside updateOrder controller");
            console.log("Update Order called");
    console.log("Order ID:", req.params.id);
    console.log("Body:", req.body);
  try {
    const { id } = req.params; 
    const updates = req.body; 

    const updatedOrder = await Orders.findByIdAndUpdate(id, updates, {
      new: true, 
      runValidators: true,
    }).populate("userId", "name email"); 
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// deleteOrder (Admin or User)
export const deleteOrder = async (req, res) => {
  try {
    console.log("Inside deleteOrder controller...");
    console.log("Order ID:", req.params.id);

    const order = await Orders.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      message: "Order deleted successfully!",
      deletedOrder: order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

