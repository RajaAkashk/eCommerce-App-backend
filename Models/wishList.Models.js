const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
productInfo:{type: mongoose.Schema.Types.ObjectId, ref:"Ecommerce_Products"}
});

const Products_Wishlist = mongoose.model("Products_Wishlist", wishlistSchema);

module.exports = Products_Wishlist;
