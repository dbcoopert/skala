const downloadAdminModel = require("../models/downloadAdminModel");

// =====================================================
// GET TAHUN
// =====================================================

exports.getTahun = async (req, res) => {
  try {
    const data = await downloadAdminModel.getTahun();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("ERROR GET TAHUN DOWNLOAD:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data tahun.",
      error: error.message,
    });
  }
};

// =====================================================
// GET TUJUAN
// =====================================================

exports.getTujuan = async (req, res) => {
  try {
    const { tahun, triwulan } = req.query;

    const data = await downloadAdminModel.getTujuan(tahun, triwulan);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("ERROR GET TUJUAN DOWNLOAD:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data tujuan.",
      error: error.message,
    });
  }
};

// =====================================================
// GET SASARAN
// =====================================================

exports.getSasaran = async (req, res) => {
  try {
    const { tahun, triwulan, id_tujuan } = req.query;

    if (!id_tujuan) {
      return res.status(400).json({
        success: false,
        message: "id_tujuan wajib diisi.",
      });
    }

    const data = await downloadAdminModel.getSasaran(
      tahun,
      triwulan,
      id_tujuan,
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("ERROR GET SASARAN DOWNLOAD:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data sasaran.",
      error: error.message,
    });
  }
};

// =====================================================
// GET INDIKATOR
// =====================================================

exports.getIndikator = async (req, res) => {
  try {
    const { tahun, triwulan, id_tujuan, id_sasaran } = req.query;

    if (!id_tujuan || !id_sasaran) {
      return res.status(400).json({
        success: false,
        message: "Tujuan dan sasaran wajib diisi.",
      });
    }

    const data = await downloadAdminModel.getIndikator(
      tahun,
      triwulan,
      id_tujuan,
      id_sasaran,
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("ERROR GET INDIKATOR DOWNLOAD:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data indikator.",
      error: error.message,
    });
  }
};

// =====================================================
// GET KEGIATAN
// =====================================================

exports.getKegiatan = async (req, res) => {
  try {
    const { tahun, triwulan, id_tujuan, id_sasaran, id_indikator } = req.query;

    if (!id_indikator) {
      return res.status(400).json({
        success: false,
        message: "id_indikator wajib diisi.",
      });
    }

    const data = await downloadAdminModel.getKegiatan(
      tahun,
      triwulan,
      id_tujuan,
      id_sasaran,
      id_indikator,
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("ERROR GET KEGIATAN DOWNLOAD:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data kegiatan.",
      error: error.message,
    });
  }
};

// =====================================================
// GET USER HASIL FILTER
// =====================================================

exports.getUserFilter = async (req, res) => {
  try {
    const {
      tahun,
      triwulan,
      id_tujuan,
      id_sasaran,
      id_indikator,
      id_kegiatan_master,
    } = req.query;

    if (!tahun) {
      return res.status(400).json({
        success: false,
        message: "Tahun wajib dipilih.",
      });
    }

    const filters = {
      tahun,
      triwulan: triwulan || null,
      id_tujuan: id_tujuan || null,
      id_sasaran: id_sasaran || null,
      id_indikator: id_indikator || null,
      id_kegiatan_master: id_kegiatan_master || null,
    };

    const data = await downloadAdminModel.getUserFilter(filters);

    return res.status(200).json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("ERROR GET USER FILTER DOWNLOAD:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil user hasil filter.",
      error: error.message,
    });
  }
};

// =====================================================
// GET LAPORAN
// =====================================================

exports.getLaporan = async (req, res) => {
  try {
    const {
      tahun,
      triwulan,
      id_tujuan,
      id_sasaran,
      id_indikator,
      id_kegiatan_master,
      user_ids,
    } = req.query;

    if (!tahun) {
      return res.status(400).json({
        success: false,
        message: "Tahun wajib dipilih.",
      });
    }

    let parsedUserIds = [];

    if (user_ids) {
      try {
        parsedUserIds = JSON.parse(user_ids);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Format user_ids tidak valid.",
        });
      }
    }

    if (!Array.isArray(parsedUserIds)) {
      parsedUserIds = [];
    }

    parsedUserIds = parsedUserIds
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0);

    const filters = {
      tahun,
      triwulan: triwulan || null,
      id_tujuan: id_tujuan || null,
      id_sasaran: id_sasaran || null,
      id_indikator: id_indikator || null,
      id_kegiatan_master: id_kegiatan_master || null,
      user_ids: parsedUserIds,
    };

    const data = await downloadAdminModel.getLaporan(filters);

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tidak ditemukan laporan kegiatan sesuai filter.",
        data: [],
      });
    }

    for (const item of data) {
      item.dokumentasi = await downloadAdminModel.getDokumentasi(
        item.id_kegiatan,
      );

      item.pelaksanaan_rtl = await downloadAdminModel.getPelaksanaanRTL(
        item.id_kegiatan,
      );

      for (const rtl of item.pelaksanaan_rtl) {
        rtl.dokumentasi = await downloadAdminModel.getDokumentasiRTL(
          rtl.id_pelaksanaan,
        );
      }
    }

    return res.status(200).json({
      success: true,
      total: data.length,
      filter: filters,
      data,
    });
  } catch (error) {
    console.error("ERROR GET LAPORAN DOWNLOAD:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil laporan.",
      error: error.message,
    });
  }
};
