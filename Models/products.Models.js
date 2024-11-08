const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    }, 
    // is whislisted add kro 
    rating: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5],
    },
    category: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Kids"],
    },
    size: [
      {
        type: String,
        required: true,
        enum: ["S", "M", "L", "XL", "XXL"],
      },
    ],
    productImg: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Ecommerce_Products = mongoose.model("Ecommerce_Products", ProductsSchema);

module.exports = Ecommerce_Products;
