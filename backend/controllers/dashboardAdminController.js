const dashboardAdminModel = require("../models/dashboardAdminModel");

// =====================================================
// HELPER VALIDASI TAHUN
// =====================================================

function getTahun(value) {
  const tahunNumber = Number(value);

  if (
    Number.isInteger(tahunNumber) &&
    tahunNumber >= 2000 &&
    tahunNumber <= 2100
  ) {
    return tahunNumber;
  }

  return new Date().getFullYear();
}

// =====================================================
// DASHBOARD ADMIN
//
// GET:
// /api/dashboard-admin?tahun=2026
// =====================================================

const getDashboardAdmin = async (req, res) => {
  try {
    const tahun = getTahun(req.query.tahun);

    // =================================================
    // AMBIL REKAP BULANAN
    // =================================================

    const data = await dashboardAdminModel.getRekapTahunan(tahun);

    // =================================================
    // AMBIL TOTAL KEGIATAN
    // =================================================

    const totalKegiatan = await dashboardAdminModel.getTotalKegiatan(tahun);

    // =================================================
    // AMBIL TOTAL RTL
    // =================================================

    const totalTindakLanjut =
      await dashboardAdminModel.getTotalTindakLanjut(tahun);

    // =================================================
    // AMBIL TOTAL PENGGUNA
    // =================================================

    const totalPengguna = await dashboardAdminModel.getTotalPengguna();

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message: "Berhasil mengambil data dashboard",

      tahun: tahun,

      data: data,

      total: {
        kegiatan: Number(totalKegiatan),

        tindak_lanjut: Number(totalTindakLanjut),

        pengguna: Number(totalPengguna),
      },
    });
  } catch (error) {
    console.error("ERROR GET DASHBOARD ADMIN:", error);

    return res.status(500).json({
      success: false,

      message: "Gagal mengambil data dashboard",

      error: error.message,
    });
  }
};

// =====================================================
// DETAIL DASHBOARD BULANAN
//
// GET:
// /api/dashboard-admin/bulanan?tahun=2026&bulan=8
// =====================================================

const getDashboardBulanan = async (req, res) => {
  try {
    const tahun = getTahun(req.query.tahun);

    const bulanNumber = Number(req.query.bulan);

    // =================================================
    // VALIDASI BULAN
    // =================================================

    if (!Number.isInteger(bulanNumber) || bulanNumber < 1 || bulanNumber > 12) {
      return res.status(400).json({
        success: false,

        message: "Bulan tidak valid",
      });
    }

    // =================================================
    // AMBIL DETAIL
    // =================================================

    const data = await dashboardAdminModel.getDetailBulanan(tahun, bulanNumber);

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message: "Berhasil mengambil detail dashboard",

      tahun: tahun,

      bulan: bulanNumber,

      data: data,
    });
  } catch (error) {
    console.error("ERROR GET DASHBOARD BULANAN ADMIN:", error);

    return res.status(500).json({
      success: false,

      message: "Gagal mengambil detail dashboard",

      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getDashboardAdmin,

  getDashboardBulanan,
};
