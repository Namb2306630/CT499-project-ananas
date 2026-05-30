exports.profile = (req, res) => {
  res.send({ message: "thông tin cá nhân" });
};

exports.updateProfile = (req, res) => {
  res.send({ message: "cập nhật thông tin cá nhân" });
};

exports.address = (req, res) => {
  res.send({ message: "thêm địa chỉ" });
};

exports.updateAddress = (req, res) => {
  res.send({ message: "cập nhật địa chỉ" });
};

exports.findOne = (req, res) => {
  res.send({ message: "tìm user" });
};

exports.findAll = (req, res) => {
  res.send({ message: "lấy hết user" });
};