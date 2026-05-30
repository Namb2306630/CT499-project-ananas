const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    canChangeUserName: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "super-admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "",
    },
    provider: {
      type: String,
      default: "local",
    },
    googleId: {
      type: String,
      default: "",
    },
    jwtVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
