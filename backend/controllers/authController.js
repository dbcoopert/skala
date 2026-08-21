const authModel = require("../models/authModel.js")

//login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan Password wajib diisi",
      });
    }

    const [rows] = await authModel(username);

    if (rows.length === 0) {
      return res.json({
        success: false,
        message: "Username tidak ditemukan",
      });
    }

    const user = rows[0];

    if (password !== user.password) {
      return res.json({
        success: false,
        message: "Password salah",
      });
    }

    delete user.password;

    req.session.user = {
      id: user.id_user,
      NIP: user.NIP,
      nama: user.nama,
      username: user.username,
      role: user.role,
      teknis: user.teknis,
    };

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Gagal menyimpan session",
        });
      }

      return res.json({
        success: true,
        message: "Login berhasil",
        role: user.role,
        redirect:
          user.role === "admin"
            ? "./admin/dashboard/dashboard.html"
            : "./users/dashboard.html",

        data: req.session.user,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout gagal",
      });
    }

    res.clearCookie("connect.sid");

    return res.json({
      success: true,
      message: "Logout berhasil",
    });
  });
};

