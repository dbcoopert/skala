const laporanAdminModel = require("../models/laporanAdminModel");

// =================================
// VALIDASI PERIODE
// =================================

const validasiPeriode = (tahun, triwulan) => {
  const tahunNumber = Number(tahun);
  const triwulanNumber = Number(triwulan);

  if (!Number.isInteger(tahunNumber) || !Number.isInteger(triwulanNumber)) {
    return {
      valid: false,
      message: "Format tahun atau triwulan tidak valid",
    };
  }

  if (triwulanNumber < 1 || triwulanNumber > 4) {
    return {
      valid: false,
      message: "Triwulan hanya boleh 1 sampai 4",
    };
  }

  return {
    valid: true,
    tahun: tahunNumber,
    triwulan: triwulanNumber,
  };
};

// =================================
// GET ALL PERIODE
// =================================

const getAllPeriode = async (req, res) => {
  try {
    const data = await laporanAdminModel.getAllPeriode();

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil data periode",
      data,
    });
  } catch (error) {
    console.error("Error getAllPeriode:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =================================
// GET KEGIATAN BERDASARKAN PERIODE
// =================================

const getKegiatanByPeriode = async (req, res) => {
  try {
    const { tahun, triwulan } = req.params;

    const validasi = validasiPeriode(tahun, triwulan);

    if (!validasi.valid) {
      return res.status(400).json({
        success: false,
        message: validasi.message,
      });
    }

    const data = await laporanAdminModel.getKegiatanByPeriode(
      validasi.tahun,
      validasi.triwulan,
    );

    return res.status(200).json({
      success: true,
      tahun: validasi.tahun,
      triwulan: validasi.triwulan,
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("Error getKegiatanByPeriode:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =================================
// GET RTL BERDASARKAN PERIODE
// =================================

const getRTLByPeriode = async (req, res) => {
  try {
    const { tahun, triwulan } = req.params;

    const validasi = validasiPeriode(tahun, triwulan);

    if (!validasi.valid) {
      return res.status(400).json({
        success: false,
        message: validasi.message,
      });
    }

    const data = await laporanAdminModel.getRTLByPeriode(
      validasi.tahun,
      validasi.triwulan,
    );

    return res.status(200).json({
      success: true,
      tahun: validasi.tahun,
      triwulan: validasi.triwulan,
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("Error getRTLByPeriode:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =================================
// GET LAPORAN BERDASARKAN PERIODE
// =================================

const getLaporanByPeriode = async (req, res) => {
  try {
    const { tahun, triwulan } = req.params;

    const validasi = validasiPeriode(tahun, triwulan);

    if (!validasi.valid) {
      return res.status(400).json({
        success: false,
        message: validasi.message,
      });
    }

    const data = await laporanAdminModel.getLaporanByPeriode(
      validasi.tahun,
      validasi.triwulan,
    );

    return res.status(200).json({
      success: true,
      message: `Berhasil mengambil laporan tahun ${validasi.tahun} Triwulan ${validasi.triwulan}`,
      data,
    });
  } catch (error) {
    console.error("Error getLaporanByPeriode:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =================================
// GET DETAIL KEGIATAN
// =================================

const getDetailKegiatan = async (req, res) => {
  try {
    const { idKegiatan } = req.params;

    const id = Number(idKegiatan);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID kegiatan tidak valid",
      });
    }

    const data = await laporanAdminModel.getDetailKegiatan(id);

    if (!data.kegiatan) {
      return res.status(404).json({
        success: false,
        message: "Data kegiatan tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil detail kegiatan beserta dokumentasi",
      data,
    });
  } catch (error) {
    console.error("Error getDetailKegiatan:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =================================
// GET DETAIL RTL
// =================================

const getDetailRTL = async (req, res) => {
  try {
    const { idPelaksanaan } = req.params;

    const id = Number(idPelaksanaan);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID RTL tidak valid",
      });
    }

    const data = await laporanAdminModel.getDetailRTL(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data RTL tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil detail RTL beserta dokumentasi",
      data,
    });
  } catch (error) {
    console.error("Error getDetailRTL:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =================================
// GET STATISTIK PERIODE
// =================================

const getStatistikPeriode = async (req, res) => {
  try {
    const data = await laporanAdminModel.getStatistikPeriode();

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil statistik kegiatan dan RTL",
      data,
    });
  } catch (error) {
    console.error("Error getStatistikPeriode:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =================================
// EXPORT
// =================================

module.exports = {
  getAllPeriode,
  getKegiatanByPeriode,
  getRTLByPeriode,
  getLaporanByPeriode,
  getDetailKegiatan,
  getDetailRTL,
  getStatistikPeriode,
};
