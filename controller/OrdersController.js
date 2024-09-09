const Order = require("../models/orders");

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({
      message: "Order details fetched successfully",
      data: order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTracking = async (req, res) => {
  try {
    const { orderId, tracking } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { order_tracking: tracking },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    const io = req.app.get("socketio");
    io.emit("updatedOrder", updatedOrder);

    const date = new Date().toLocaleDateString().replace(/\//g, "-");

    res.status(200).json({
      message: "Order tracking updated successfully",
      updatedOrder,
      date,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
