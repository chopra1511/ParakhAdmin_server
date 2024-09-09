const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");



const productSchema = new Schema({
  id: { type: String, unique: true, default: uuidv4 },
  images: { type: String },
  name: { type: String },
  price: { type: Number },
  discountedPrice: { type: Number },
  skuID: { type: String, unique: true },
  variant: {
    material: { type: String },
    color: { type: String },
  },
  category: { type: String },
  description: { type: String },
  weight: { type: Number },
  available: { type: Boolean },
  stock: { type: Number },
  rating: {
    rate: { type: Number },
    count: { type: Number },
  },
  mostLoved: { type: Boolean },
});

module.exports = mongoose.model("Products", productSchema);
