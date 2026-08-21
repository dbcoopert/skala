const db = require("../config/db");

const dashboardUserModel = require("../models/dashboardUserModel");

// =========================================================
// DASHBOARD UTAMA
// =========================================================

exports.index = async (req, res) => {
  try {
    // =======================================================
    // CEK SESSION
    // =======================================================

    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Silakan login terlebih dahulu.",
      });
    }

    // =======================================================
    // ID USER
    // =======================================================

    const idUser = req.session.user.id;

    console.log("USER DASHBOARD:", req.session.user);

    // =======================================================
    // KEGIATAN
    // =======================================================

    const [[minggu]] = await dashboardUserModel.mingguModel(idUser);

    const [[bulan]] = await dashboardUserModel.bulanModel(idUser);

    const [[triwulan]] = await dashboardUserModel.triwulanModel(idUser);

    const [[tahun]] = await dashboardUserModel.tahunModel(idUser);

    // =======================================================
    // TINDAK LANJUT
    // =======================================================

    const [[rtlMinggu]] = await dashboardUserModel.rtlMingguModel(idUser);

    const [[rtlBulan]] = await dashboardUserModel.rtlBulanModel(idUser);

    const [[rtlTriwulan]] = await dashboardUserModel.rtlTriwulanModel(idUser);

    const [[rtlTahun]] = await dashboardUserModel.rtlTahunModel(idUser);

    // =======================================================
    // PEMBANDING RTL TRIWULAN
    //
    // Jumlah KEGIATAN pada triwulan berjalan
    // yang mempunyai RTL.
    // =======================================================

    const [[rtlTriwulanPembanding]] =
      await dashboardUserModel.rtlTriwulanPembandingModel(idUser);

    // =======================================================
    // RESPONSE
    // =======================================================

    return res.json({
      success: true,

      user: req.session.user,

      statistik: {
        // ===================================================
        // KEGIATAN
        // ===================================================

        kegiatanMinggu: minggu?.total || 0,

        kegiatanBulan: bulan?.total || 0,

        kegiatanTriwulan: triwulan?.total || 0,

        kegiatanTahun: tahun?.total || 0,

        // ===================================================
        // TINDAK LANJUT
        //
        // BERDASARKAN pelaksanaan_rtl
        // ===================================================

        rtlMinggu: rtlMinggu?.total || 0,

        rtlBulan: rtlBulan?.total || 0,

        rtlTriwulan: rtlTriwulan?.total || 0,

        rtlTahun: rtlTahun?.total || 0,

        // ===================================================
        // PEMBANDING
        // ===================================================

        rtlTriwulanPembanding: rtlTriwulanPembanding?.total || 0,
      },
    });
  } catch (err) {
    console.error("ERROR DASHBOARD USER:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =========================================================
// MENU DASHBOARD / ARSIP
//
// FILTER:
// - tahun
// - triwulan
// - bulan
//
// WAJIB BERDASARKAN USER LOGIN
// =========================================================

exports.getMenuDashboard = async (req, res) => {
  try {
    // =======================================================
    // CEK SESSION
    // =======================================================

    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Silakan login terlebih dahulu.",
      });
    }

    // =======================================================
    // ID USER
    // =======================================================

    const idUser = req.session.user.id;

    // =======================================================
    // QUERY
    // =======================================================

    const { tahun, triwulan, bulan } = req.query;

    // =======================================================
    // VALIDASI TAHUN
    // =======================================================

    if (!tahun) {
      return res.status(400).json({
        success: false,
        message: "Tahun harus dipilih.",
      });
    }

    // =======================================================
    // SQL
    // =======================================================

    let sql = dashboardUserModel.sqlModel;

    const params = [idUser, tahun];

    // =======================================================
    // FILTER TRIWULAN
    // =======================================================

    if (triwulan && triwulan !== "") {
      sql += " AND QUARTER(k.tanggal) = ?";

      params.push(triwulan);
    }

    // =======================================================
    // FILTER BULAN
    // =======================================================

    if (bulan && bulan !== "") {
      sql += " AND MONTH(k.tanggal) = ?";

      params.push(bulan);
    }

    // =======================================================
    // ORDER
    // =======================================================

    sql += " ORDER BY k.tanggal DESC";

    // =======================================================
    // EXECUTE
    // =======================================================

    const [rows] = await db.execute(sql, params);

    // =======================================================
    // RESPONSE
    // =======================================================

    return res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("ERROR MENU DASHBOARD:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
