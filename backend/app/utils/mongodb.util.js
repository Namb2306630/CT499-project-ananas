const mongoose = require("mongoose");

class MongoDB {
  static connect = async (uri) => {
    if (this.client) return;

    await mongoose.connect(uri);

    console.log("MongoDB connected");
  };
}

module.exports = MongoDB;
