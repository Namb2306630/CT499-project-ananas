exports.profile = (req, res) => {
  res.send({ message: "thông tin cá nhân" });
};

exports.updateProfile = (req, res) => {
  res.send({ message: "cập nhật thông tin cá nhân" });
};


exports.findOne = (req, res) => {
  res.send({ message: "tìm user" });
};

exports.findAll = (req, res) => {
  res.send({ message: "lấy hết user" });
};