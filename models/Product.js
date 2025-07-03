const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Product", productsSchema);
