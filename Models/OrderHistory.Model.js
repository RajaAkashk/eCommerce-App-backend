const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  productInfo: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ecommerce_Products",
      },
    },
  ],
  address: {
    type: String,
    require: true,
  },
  totalAmount: {
    type: Number,
    require: true,
  },
  orderData: {
    type: String,
    default: Date.now,
  },
});

const order_history = mongoose.model("order_history", orderSchema);

module.exports = order_history;
