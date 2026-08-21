exports.isLogin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(401).json({
      success: false,
      message: "Silakan login terlebih dahulu.",
    });
  }
};

exports.me = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Belum login",
    });
  }

  return res.json({
    success: true,
    data: req.session.user,
  });
};