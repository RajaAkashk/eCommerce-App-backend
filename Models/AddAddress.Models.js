const mongoose = require("mongoose");

const AddAddressSchema = new mongoose.Schema({
  houseNumber: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
});

const User_Address = mongoose.model("User_Address", AddAddressSchema);

module.exports = User_Address;
