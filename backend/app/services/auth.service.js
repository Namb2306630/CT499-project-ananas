const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const ErrorCode = require("../constants/errors");
const REGEX = require("../utils/regex");
const jwt = require("jsonwebtoken");
const config = require("../config/index");

const generateUserName = async () => {
  let userName;
  let exists = true;

  while (exists) {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    userName = `user${randomNumber}`;

    const found = await User.findOne({ userName });

    exists = !!found; //true/false
  }
  return userName;
};

const generateAvatar = (userName) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName,
  )}&background=random&color=fff&size=128`;
};

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      role: user.role,
      version: user.jwtVersion,
    },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpires },
  );
};

const generateRefreshToke = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      version: user.jwtVersion,
    },
    config.jwt.refreshSecret,
    {
      expiresIn: config.jwt.refreshExpires,
    },
  );
};

class AuthService {
  //đăng ký
  async register(payload) {
    const { phone, password, confirmPassword } = payload;

    //check regex
    if (!REGEX.PHONE.test(phone)) {
      throw ErrorCode.INVALID_PHONE();
    }
    if (!REGEX.PASSWORD.test(password)) {
      throw ErrorCode.INVALID_PASSWORD();
    }

    //check confirm password
    if (password !== confirmPassword) {
      throw ErrorCode.PASSWORD_NOT_MATCH();
    }

    //check DB
    const existedUser = await User.findOne({
      phone,
    });

    if (existedUser) {
      throw ErrorCode.PHONE_ALREADY_EXISTS();
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userName = await generateUserName();
    const avatar = generateAvatar(userName);

    const user = await User.create({
      phone,
      password: hashedPassword,
      userName,
      avatar,
    });

    return user;
  }

  async login(payload) {
    const { phone, password } = payload;
    //console.log("phone:", phone);

    const user = await User.findOne({ phone });

    //console.log("user:", user);

    if (!user) {
      throw ErrorCode.INVALID_CREDENTIALS();
    }
    const isMatch = await bcrypt.compare(password, user.password);

    //console.log("isMatch:", isMatch);

    if (!isMatch) {
      throw ErrorCode.INVALID_CREDENTIALS();
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToke(user);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
      const user = await User.findById(decoded._id);
      if (!user) {
        throw ErrorCode.UNAUTHORIZED();
      }

      // check version (invalidate token khi đổi role/password)
      if (user.jwtVersion !== decoded.version) {
        throw ErrorCode.UNAUTHORIZED();
      }

      const newAccessToken = generateToken(user);
      const newRefreshToken = generateRefreshToke(user);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw ErrorCode.UNAUTHORIZED();
    }
  }
}

module.exports = new AuthService();
