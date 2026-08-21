const Usermodel = require("../models/Usermodel");
const fs = require("fs");
const path = require("path");

// =====================================================
// HELPER
// HAPUS FILE DENGAN AMAN
// =====================================================
function hapusFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

      console.log("File berhasil dihapus:", filePath);

      return true;
    }

    console.log("File tidak ditemukan:", filePath);

    return false;
  } catch (error) {
    console.error("Gagal menghapus file:", filePath);
    console.error(error);

    return false;
  }
}

// =====================================================
// 1. CREATE USER
// =====================================================
exports.createUser = async (req, res) => {
  try {
    const { nama, NIP, teknis, username, password, role } = req.body;

    const ttdPath = req.file ? req.file.filename : null;

    if (!password) {
      return res.status(400).json({
        message: "Password wajib diisi!",
      });
    }

    const data = {
      nama: nama,
      NIP: NIP,
      teknis: teknis,
      username: username,
      password: password,
      role: role,
      ttd: ttdPath,
    };

    const result = await Usermodel.create(data);

    res.status(201).json({
      message: "User berhasil dibuat",
      insertId: result.insertId,
    });
  } catch (error) {
    console.error("Error Create User:", error);

    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

// =====================================================
// 2. GET ALL USERS
// =====================================================
exports.getUsers = async (req, res) => {
  try {
    const users = await Usermodel.findAll();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error Get Users:", error);

    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

// =====================================================
// 3. GET USER BY ID
// =====================================================
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Usermodel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error Get User By Id:", error);

    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

// =====================================================
// 4. UPDATE USER
// =====================================================
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { nama, NIP, teknis, username, password, role } = req.body;

    // =====================================================
    // CARI USER
    // =====================================================

    const existingUser = await Usermodel.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // =====================================================
    // TTD
    // =====================================================

    let ttdPath = existingUser.ttd;

    // Jika upload TTD baru
    if (req.file) {
      ttdPath = req.file.filename;

      // Hapus TTD lama
      if (existingUser.ttd) {
        const oldPath = path.join(
          __dirname,
          "../public/uploads/ttd",
          existingUser.ttd,
        );

        hapusFile(oldPath);
      }
    }

    // =====================================================
    // PASSWORD
    // =====================================================

    let finalPassword = existingUser.password;

    if (password && password.trim() !== "") {
      finalPassword = password;
    }

    // =====================================================
    // DATA UPDATE
    // =====================================================

    const data = {
      nama: nama !== undefined ? nama : existingUser.nama,

      NIP: NIP !== undefined ? NIP : existingUser.NIP,

      teknis: teknis !== undefined ? teknis : existingUser.teknis,

      username: username !== undefined ? username : existingUser.username,

      password: finalPassword,

      role: role !== undefined ? role : existingUser.role,

      ttd: ttdPath,
    };

    await Usermodel.update(id, data);

    res.status(200).json({
      message: "User berhasil diupdate",
    });
  } catch (error) {
    console.error("Error Update User:", error);

    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

// =====================================================
// 5. DELETE USER
//
// ALUR:
//
// 1. Cari user
// 2. Ambil dokumentasi kegiatan
// 3. Ambil dokumentasi RTL
// 4. Hapus user dari database
// 5. ON DELETE CASCADE menghapus:
//
//    kegiatan
//    dokumentasi_kegiatan
//    pelaksanaan_rtl
//    dokumentasi_rtl
//
// 6. Hapus file fisik:
//    uploads/kegiatan
//    uploads/rtl
//    uploads/ttd
// =====================================================

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // =====================================================
    // 1. CARI USER
    // =====================================================

    const user = await Usermodel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // =====================================================
    // 2. AMBIL SELURUH FILE DOKUMENTASI KEGIATAN
    // =====================================================

    const dokumentasiKegiatan =
      await Usermodel.getDokumentasiKegiatanByUser(id);

    // =====================================================
    // 3. AMBIL SELURUH FILE DOKUMENTASI RTL
    // =====================================================

    const dokumentasiRTL = await Usermodel.getDokumentasiRTLByUser(id);

    // =====================================================
    // LOG UNTUK MEMUDAHKAN DEBUG
    // =====================================================

    console.log("==========================================");

    console.log("MENGHAPUS USER:", user.nama);

    console.log("ID USER:", id);

    console.log("Jumlah dokumentasi kegiatan:", dokumentasiKegiatan.length);

    console.log("Jumlah dokumentasi RTL:", dokumentasiRTL.length);

    console.log("==========================================");

    // =====================================================
    // 4. HAPUS USER DARI DATABASE
    //
    // ON DELETE CASCADE AKAN MENGHAPUS:
    //
    // kegiatan
    // dokumentasi_kegiatan
    // pelaksanaan_rtl
    // dokumentasi_rtl
    // =====================================================

    await Usermodel.delete(id);

    // =====================================================
    // 5. HAPUS FILE TTD
    // =====================================================

    if (user.ttd) {
      const namaFileTTD = path.basename(user.ttd);

      const ttdPath = path.join(
        __dirname,
        "../public/uploads/ttd",
        namaFileTTD,
      );

      hapusFile(ttdPath);
    }

    // =====================================================
    // 6. HAPUS FILE DOKUMENTASI KEGIATAN
    //
    // Folder:
    // public/uploads/kegiatan/
    // =====================================================

    dokumentasiKegiatan.forEach((item) => {
      if (!item.nama_file) {
        return;
      }

      // basename agar lebih aman
      const namaFile = path.basename(item.nama_file);

      const filePath = path.join(
        __dirname,
        "../public/uploads/kegiatan",
        namaFile,
      );

      hapusFile(filePath);
    });

    // =====================================================
    // 7. HAPUS FILE DOKUMENTASI RTL
    //
    // Folder:
    // public/uploads/rtl/
    // =====================================================

    dokumentasiRTL.forEach((item) => {
      if (!item.nama_file) {
        return;
      }

      // basename agar lebih aman
      const namaFile = path.basename(item.nama_file);

      const filePath = path.join(__dirname, "../public/uploads/rtl", namaFile);

      hapusFile(filePath);
    });

    // =====================================================
    // RESPONSE BERHASIL
    // =====================================================

    res.status(200).json({
      message:
        "User beserta seluruh kegiatan, RTL, dokumentasi, dan file berhasil dihapus",

      data: {
        user: user.nama,

        dokumentasi_kegiatan: dokumentasiKegiatan.length,

        dokumentasi_rtl: dokumentasiRTL.length,
      },
    });
  } catch (error) {
    console.error("Error Delete User:", error);

    res.status(500).json({
      message: "Terjadi kesalahan saat menghapus user dan data terkait",

      error: error.message,
    });
  }
};

// =====================================================
// 6. GET MASTER TEKNIS
// =====================================================
exports.getMasterTeknis = async (req, res) => {
  try {
    const data = await Usermodel.getTeknis();

    res.json(data);
  } catch (err) {
    console.log("Error Get Master Teknis:", err);

    res.status(500).json({
      message: "Gagal mengambil master teknis",
    });
  }
};
