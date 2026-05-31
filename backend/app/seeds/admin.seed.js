const User = require("../models/user.model");
const bycrypt = require("bcryptjs");

const seedAdmin = async () => {
  const superAdminExists = await User.findOne({ role: "super-admin" });

  if (superAdminExists) return;

  const hashedPassword = await bycrypt.hash("admin123", 10);

  await User.create({
    userName: "Admin",
    email: "admin@gmail.com",
    phone: "0909090909",
    password: hashedPassword,
    role: "super-admin",
  });
};

module.exports = seedAdmin;
