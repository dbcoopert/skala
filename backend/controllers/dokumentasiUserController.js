const uploadKegiatanUserModel = require("../models/dokumetasiUserModel");

exports.uploadKegiatan = async (req, res) => {
  try {
    const { id_kegiatan } = req.body;

    if (!id_kegiatan) {
      return res.status(400).json({
        success: false,
        message: "ID kegiatan wajib diberikan",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Belum ada file yang dipilih",
      });
    }

    for (const file of req.files) {
      await uploadKegiatanUserModel.uploadKegiatanUserModel(id_kegiatan, file);
    }

    res.status(201).json({
      success: true,
      message: "Dokumentasi berhasil diupload",
      jumlah: req.files.length,
    });
  } catch (err) {
    console.error("Error upload dokumentasi:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};
