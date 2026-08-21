const tindakLanjutUserModel = require("../models/tindakLanjutUserModel");

// =====================================================
// GET KEGIATAN RTL
// =====================================================

exports.getKegiatanRTL = async (req, res) => {
  try {
    const id_user = req.session.user.id;
    const id_indikator = req.params.id_indikator;

    if (!id_user) {
      return res.status(401).json({
        success: false,
        message: "Session user tidak ditemukan.",
      });
    }

    if (!id_indikator) {
      return res.status(400).json({
        success: false,
        message: "ID indikator tidak ditemukan.",
      });
    }

    const rows = await tindakLanjutUserModel.getKegiatanTindakLanjut(
      id_user,
      id_indikator,
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("ERROR GET KEGIATAN RTL:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// DETAIL KEGIATAN RTL
// =====================================================

exports.getDetailKegiatanRTL = async (req, res) => {
  try {
    const id_user = req.session.user.id;
    const id_kegiatan = req.params.id_kegiatan;

    const rows = await tindakLanjutUserModel.getDetailKegiatanTindakLanjut(
      id_kegiatan,
      id_user,
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kegiatan RTL tidak ditemukan atau bukan milik Anda.",
      });
    }

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("ERROR DETAIL RTL:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// SIMPAN PELAKSANAAN RTL
// =====================================================

exports.simpanPelaksanaan = async (req, res) => {
  try {
    const id_user = req.session.user.id;

    const data = {
      ...req.body,
    };

    // ===================================================
    // VALIDASI DATA
    // ===================================================

    if (
      !data.id_kegiatan ||
      !data.tanggal ||
      !data.jam_mulai ||
      !data.jam_selesai ||
      !data.tempat
    ) {
      return res.status(400).json({
        success: false,
        message: "Data pelaksanaan belum lengkap.",
      });
    }

    // ===================================================
    // CEK KEPEMILIKAN KEGIATAN
    // ===================================================

    const kegiatan = await tindakLanjutUserModel.cekKegiatanRTL(
      data.id_kegiatan,
      id_user,
    );

    if (kegiatan.length === 0) {
      return res.status(403).json({
        success: false,
        message:
          "Anda tidak memiliki akses untuk menindaklanjuti kegiatan ini.",
      });
    }

    // ===================================================
    // VALIDASI JAM
    // ===================================================

    if (data.jam_selesai <= data.jam_mulai) {
      return res.status(400).json({
        success: false,
        message: "Jam selesai harus lebih besar dari jam mulai.",
      });
    }

    // ===================================================
    // SIMPAN
    // ===================================================

    const result = await tindakLanjutUserModel.simpanPelaksanaan(data);

    return res.json({
      success: true,

      message: "Pelaksanaan RTL berhasil disimpan.",

      data: {
        id_pelaksanaan: result.insertId,
        id_kegiatan: data.id_kegiatan,
      },
    });
  } catch (err) {
    console.error("ERROR SIMPAN PELAKSANAAN RTL:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// UPLOAD DOKUMENTASI RTL
// =====================================================

exports.uploadDokumentasiRTL = async (req, res) => {
  try {
    const id_pelaksanaan = req.body.id_pelaksanaan;

    // ===================================================
    // VALIDASI ID
    // ===================================================

    if (!id_pelaksanaan) {
      return res.status(400).json({
        success: false,
        message: "ID pelaksanaan tidak ditemukan.",
      });
    }

    // ===================================================
    // VALIDASI FILE
    // ===================================================

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Belum ada dokumentasi yang dipilih.",
      });
    }

    // ===================================================
    // USER LOGIN
    // ===================================================

    const id_user = req.session.user.id;

    // ===================================================
    // CEK KEPEMILIKAN PELAKSANAAN
    // ===================================================

    const pelaksanaan = await tindakLanjutUserModel.getDetailPelaksanaan(
      id_pelaksanaan,
      id_user,
    );

    if (pelaksanaan.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Pelaksanaan tidak ditemukan atau bukan milik Anda.",
      });
    }

    // ===================================================
    // SIMPAN SEMUA FILE
    // ===================================================

    for (const file of req.files) {
      await tindakLanjutUserModel.uploadDokumentasi(id_pelaksanaan, file);
    }

    // ===================================================
    // AMBIL JUMLAH DOKUMENTASI TERBARU
    // ===================================================

    const jumlah =
      await tindakLanjutUserModel.getJumlahDokumentasi(id_pelaksanaan);

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.json({
      success: true,

      message: "Dokumentasi berhasil diupload.",

      data: {
        id_pelaksanaan: id_pelaksanaan,
        jumlah_foto: jumlah,
      },
    });
  } catch (err) {
    console.error("ERROR UPLOAD DOKUMENTASI RTL:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// DETAIL PELAKSANAAN RTL
// Digunakan oleh:
// /detail-upload/:id
// /detail-pelaksanaan/:id
// =====================================================

exports.detailPelaksanaanRTL = async (req, res) => {
  try {
    const id_user = req.session.user.id;

    const id_pelaksanaan = req.params.id;

    if (!id_pelaksanaan) {
      return res.status(400).json({
        success: false,
        message: "ID pelaksanaan tidak ditemukan.",
      });
    }

    const rows = await tindakLanjutUserModel.getDetailPelaksanaan(
      id_pelaksanaan,
      id_user,
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data pelaksanaan tidak ditemukan.",
      });
    }

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("ERROR DETAIL PELAKSANAAN:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// DATA HALAMAN SUKSES
// =====================================================

exports.suksesPelaksanaanRTL = async (req, res) => {
  try {
    const id_user = req.session.user.id;

    const id_pelaksanaan = req.params.id;

    if (!id_pelaksanaan) {
      return res.status(400).json({
        success: false,
        message: "ID pelaksanaan tidak ditemukan.",
      });
    }

    // ===================================================
    // AMBIL DATA SUKSES
    // ===================================================

    const rows = await tindakLanjutUserModel.getDataSuksesPelaksanaan(
      id_pelaksanaan,
      id_user,
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data pelaksanaan tidak ditemukan atau bukan milik Anda.",
      });
    }

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("ERROR DATA SUKSES RTL:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// RIWAYAT PELAKSANAAN RTL
// =====================================================

exports.getRiwayatPelaksanaan = async (req, res) => {
  try {
    const id_user = req.session.user.id;

    const id_kegiatan = req.params.id_kegiatan;

    const rows = await tindakLanjutUserModel.getRiwayatPelaksanaan(
      id_kegiatan,
      id_user,
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("ERROR RIWAYAT RTL:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
