const mongoose = require("mongoose");

const AddToCartSchema = new mongoose.Schema({
  productInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ecommerce_Products",
  },
});

const Cart_Products = mongoose.model("Cart_Products", AddToCartSchema);
module.exports = Cart_Products;
