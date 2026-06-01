const mongoose = require("mongoose");

const productLineSchema = new mongoose.Schema({
  name: String, // Basic, Urbas, Vintas
  slug: String,
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },
  description: String,
});

module.exports = mongoose.model("ProductLine", productLineSchema);
