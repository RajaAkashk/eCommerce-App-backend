const mongoose = require("mongoose");

const AddToCartSchema = new mongoose.Schema({
  productInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ecommerce_Products",
  },
  // productQuantity: {
  //   type: Number,
  //   required: true,
  //   default: 1,
  // },
  // productSize: {
  //   type: String,
  //   required: true,
  //   default: "M",
  //   enum: ["S", "M", "L", "XL", "XXL"],
  // },
});

const Cart_Products = mongoose.model("Cart_Products", AddToCartSchema);
module.exports = Cart_Products;
