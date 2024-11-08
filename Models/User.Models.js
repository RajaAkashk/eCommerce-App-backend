const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  address: [
    {
      type: String,
      required: true,
    },
  ],
});

const UserDetail = mongoose.Model("UserDetail", UserSchema);

module.exports = UserDetail;
