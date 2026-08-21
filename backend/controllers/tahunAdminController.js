const tahunAdminModel = require("../models/tahunAdminModel");
const fs = require("fs");
const path = require("path");

// =====================================================
// FUNGSI HELPER
// HAPUS FILE DARI FOLDER
// =====================================================
const hapusFile = (folder, namaFile) => {
  try {
    if (!namaFile) return;

    const filePath = path.join(
      __dirname,
      "..",
      "public",
      "uploads",
      folder,
      namaFile,
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

      console.log(`File berhasil dihapus: ${filePath}`);
    } else {
      console.log(`File tidak ditemukan: ${filePath}`);
    }
  } catch (error) {
    console.error(`Gagal menghapus file ${namaFile}:`, error.message);
  }
};

// =====================================================
// HAPUS SEMUA FILE DOKUMENTASI
// =====================================================
const hapusSemuaDokumentasi = (data) => {
  // -----------------------------------------
  // Hapus dokumentasi kegiatan
  // Folder:
  // public/uploads/kegiatan
  // -----------------------------------------
  if (data.dokumentasiKegiatan && Array.isArray(data.dokumentasiKegiatan)) {
    data.dokumentasiKegiatan.forEach((item) => {
      hapusFile("kegiatan", item.nama_file);
    });
  }

  // -----------------------------------------
  // Hapus dokumentasi RTL
  // Folder:
  // public/uploads/rtl
  // -----------------------------------------
  if (data.dokumentasiRTL && Array.isArray(data.dokumentasiRTL)) {
    data.dokumentasiRTL.forEach((item) => {
      hapusFile("rtl", item.nama_file);
    });
  }
};

// =====================================================
// GET ALL TAHUN
// =====================================================
const getAllTahun = async (req, res) => {
  try {
    const data = await tahunAdminModel.getAll();

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil data tahun",
      data,
    });
  } catch (error) {
    console.error("Error getAllTahun:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =====================================================
// GET TAHUN BY ID
// =====================================================
const getTahunById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await tahunAdminModel.getById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data tahun tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error getTahunById:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE TAHUN
// =====================================================
const createTahun = async (req, res) => {
  try {
    const { tahun } = req.body;

    if (!tahun) {
      return res.status(400).json({
        success: false,
        message: "Tahun wajib diisi",
      });
    }

    const tahunNumber = Number(tahun);

    if (
      !Number.isInteger(tahunNumber) ||
      tahunNumber < 2000 ||
      tahunNumber > 2100
    ) {
      return res.status(400).json({
        success: false,
        message: "Tahun harus berupa angka antara 2000 sampai 2100",
      });
    }

    const existing = await tahunAdminModel.checkTahun(tahunNumber);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Tahun ${tahunNumber} sudah tersedia`,
      });
    }

    const data = await tahunAdminModel.create(tahunNumber);

    res.status(201).json({
      success: true,
      message: `Tahun ${tahunNumber} berhasil ditambahkan`,
      data,
    });
  } catch (error) {
    console.error("Error createTahun:", error);

    if (error.code === "ER_DUP_ENTRY" || error.code === "DUPLICATE_YEAR") {
      return res.status(409).json({
        success: false,
        message: error.message || "Tahun tersebut sudah tersedia",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE TAHUN
// =====================================================
const updateTahun = async (req, res) => {
  try {
    const { tahun } = req.params;

    const { tahun_baru } = req.body;

    if (!tahun) {
      return res.status(400).json({
        success: false,
        message: "Tahun lama wajib diberikan",
      });
    }

    if (!tahun_baru) {
      return res.status(400).json({
        success: false,
        message: "Tahun baru wajib diberikan",
      });
    }

    const tahunLama = Number(tahun);

    const tahunBaru = Number(tahun_baru);

    if (!Number.isInteger(tahunLama) || !Number.isInteger(tahunBaru)) {
      return res.status(400).json({
        success: false,
        message: "Tahun harus berupa angka",
      });
    }

    if (tahunBaru < 2000 || tahunBaru > 2100) {
      return res.status(400).json({
        success: false,
        message: "Tahun harus berada antara 2000 sampai 2100",
      });
    }

    if (tahunLama === tahunBaru) {
      return res.status(400).json({
        success: false,
        message: "Tahun baru sama dengan tahun lama",
      });
    }

    const data = await tahunAdminModel.updateByTahun(tahunLama, tahunBaru);

    res.status(200).json({
      success: true,
      message: `Tahun ${tahunLama} berhasil diubah menjadi ${tahunBaru}`,
      data,
    });
  } catch (error) {
    console.error("Error updateTahun:", error);

    if (error.code === "YEAR_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.code === "DUPLICATE_YEAR") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE SATU TRIWULAN BERDASARKAN ID
//
// Contoh:
// DELETE /tahun/5
//
// Yang dilakukan:
// 1. Ambil dokumentasi kegiatan
// 2. Ambil dokumentasi RTL
// 3. Hapus file fisik
// 4. Hapus data tahun
// 5. CASCADE hapus kegiatan dan RTL
// =====================================================
const deleteTahun = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID tahun wajib diberikan",
      });
    }

    // -----------------------------------------
    // CEK DATA TAHUN
    // -----------------------------------------
    const tahunData = await tahunAdminModel.getById(id);

    if (!tahunData) {
      return res.status(404).json({
        success: false,
        message: "Data tahun tidak ditemukan",
      });
    }

    // -----------------------------------------
    // AMBIL SEMUA FILE DOKUMENTASI
    // SEBELUM DATA DIHAPUS
    // -----------------------------------------
    const dokumentasi = await tahunAdminModel.getDokumentasiByIdTahun(id);

    // -----------------------------------------
    // HAPUS FILE FISIK
    // -----------------------------------------
    hapusSemuaDokumentasi(dokumentasi);

    // -----------------------------------------
    // HAPUS DATA TAHUN
    // Foreign key CASCADE akan menghapus
    // kegiatan + pelaksanaan RTL
    // -----------------------------------------
    const result = await tahunAdminModel.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tahun tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: `Triwulan ${tahunData.triwulan} tahun ${tahunData.tahun} berhasil dihapus beserta dokumentasinya`,
    });
  } catch (error) {
    console.error("Error deleteTahun:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE SEMUA TRIWULAN BERDASARKAN TAHUN
//
// Contoh:
// DELETE /tahun/tahun/2026
//
// Yang dihapus:
//
// TAHUN 2026
// ├── Triwulan I
// ├── Triwulan II
// ├── Triwulan III
// └── Triwulan IV
//
// Beserta:
// ├── Kegiatan
// ├── Dokumentasi Kegiatan
// ├── RTL
// └── Dokumentasi RTL
// =====================================================
const deleteTahunByTahun = async (req, res) => {
  try {
    const { tahun } = req.params;

    if (!tahun) {
      return res.status(400).json({
        success: false,
        message: "Tahun wajib diberikan",
      });
    }

    const tahunNumber = Number(tahun);

    if (!Number.isInteger(tahunNumber)) {
      return res.status(400).json({
        success: false,
        message: "Format tahun tidak valid",
      });
    }

    // -----------------------------------------
    // CEK APAKAH TAHUN ADA
    // -----------------------------------------
    const existing = await tahunAdminModel.checkTahun(tahunNumber);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Tahun ${tahunNumber} tidak ditemukan`,
      });
    }

    // -----------------------------------------
    // AMBIL SELURUH FILE DOKUMENTASI
    // SEBELUM DATABASE DIHAPUS
    // -----------------------------------------
    const dokumentasi =
      await tahunAdminModel.getDokumentasiByTahun(tahunNumber);

    // -----------------------------------------
    // HITUNG JUMLAH FILE
    // -----------------------------------------
    const jumlahDokumentasiKegiatan = dokumentasi.dokumentasiKegiatan.length;

    const jumlahDokumentasiRTL = dokumentasi.dokumentasiRTL.length;

    // -----------------------------------------
    // HAPUS SEMUA FILE FISIK
    // -----------------------------------------
    hapusSemuaDokumentasi(dokumentasi);

    // -----------------------------------------
    // HAPUS SELURUH DATA TAHUN
    //
    // ON DELETE CASCADE akan menghapus:
    //
    // tahun
    //   ↓
    // kegiatan
    //   ↓
    // dokumentasi_kegiatan
    //
    // kegiatan
    //   ↓
    // pelaksanaan_rtl
    //   ↓
    // dokumentasi_rtl
    // -----------------------------------------
    const result = await tahunAdminModel.deleteByTahun(tahunNumber);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Tahun ${tahunNumber} tidak ditemukan`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Tahun ${tahunNumber} berhasil dihapus beserta seluruh kegiatan, RTL, dan dokumentasinya`,
      deleted: {
        triwulan: result.affectedRows,
        dokumentasi_kegiatan: jumlahDokumentasiKegiatan,
        dokumentasi_rtl: jumlahDokumentasiRTL,
      },
    });
  } catch (error) {
    console.error("Error deleteTahunByTahun:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllTahun,
  getTahunById,
  createTahun,
  updateTahun,
  deleteTahun,
  deleteTahunByTahun,
};