const User = require("../models/user.model");
const bycrypt = require("bcryptjs");
const Role = require("../utils/role.util");

const seedAdmin = async () => {
  const superAdminExists = await User.findOne({ role: Role.SUPER_ADMIN });

  if (superAdminExists) return;

  const hashedPassword = await bycrypt.hash("admin123", 10);

  await User.create({
    userName: "Admin",
    email: "admin@gmail.com",
    phone: "0909090909",
    password: hashedPassword,
    role: Role.SUPER_ADMIN,
  });
};

module.exports = seedAdmin;
