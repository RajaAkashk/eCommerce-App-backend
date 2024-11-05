const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  productname: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  wishList: {
    type: Boolean,
    default: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

const Products_Wishlist = mongoose.model("Products_Wishlist", wishlistSchema);

module.exports = Products_Wishlist;
