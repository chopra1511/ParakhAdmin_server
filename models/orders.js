const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  order_details: {
    type: Object,
  },
  order_created: {
    type: Object,
  },
  order_updated: {
    type: Object,
  },
  order_tracking: {
    type: Object,
  },
});

module.exports = mongoose.model("Order", orderSchema);
