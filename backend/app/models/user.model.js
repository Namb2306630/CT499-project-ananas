const mongoose = require("mongoose");
const Role = require("../utils/role.util");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      default: null,
    },

    canChangeUserName: {
      type: Boolean,
      default: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },

    avatar: {
      type: String,
      default: null,
      trim: true,
    },

    provider: {
      type: String,
      default: "local",
      lowercase: true,
      trim: true,
    },

    googleId: {
      type: String,
      default: null,
      trim: true,
    },

    jwtVersion: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
