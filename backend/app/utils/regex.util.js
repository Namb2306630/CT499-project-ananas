const REGEX = {
  //.* → đi qua toàn chuỗi
  PASSWORD: /^(?=.*[A-Z])(?=.*\d).{8,}$/,

  PHONE: /^(0[3|5|7|8|9])+([0-9]{8})$/,

  _ID: /^[0-9a-fA-F]{24}$/,

  SIZE: /^(XS|S|M|L|XL|XXL|3[5-9]|4[0-6])$/,

};

module.exports = REGEX;
