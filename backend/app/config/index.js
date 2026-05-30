require("dotenv").config();

const config = {
  app: {
    port: process.env.PORT || 3000,
    provinceApiUrl: process.env.PROVINCE_API_URL,
  },
  db: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpires: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshExpires: process.env.JWT_REFRESH_EXPIRES_IN,
  },
};

module.exports = config;
