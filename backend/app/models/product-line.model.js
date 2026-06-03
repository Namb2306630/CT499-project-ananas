const mongoose = require("mongoose");

const productLineSchema = new mongoose.Schema({
  name: String, // Basic, Urbas, Vintas
  slug: String,
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },
  description: String,
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("ProductLine", productLineSchema);
