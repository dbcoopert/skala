const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/tidakLanjutUserController");
const uploadRTL = require("../middleware/uploadRTL");

// =====================================================
// DAFTAR KEGIATAN YANG BISA DITINDAKLANJUTI
// =====================================================

router.get("/kegiatan/:id_indikator", auth.isLogin, controller.getKegiatanRTL);

// =====================================================
// DETAIL KEGIATAN RTL
// =====================================================

router.get(
  "/detail/:id_kegiatan",
  auth.isLogin,
  controller.getDetailKegiatanRTL,
);

// =====================================================
// SIMPAN PELAKSANAAN RTL
// =====================================================

router.post("/pelaksanaan", auth.isLogin, controller.simpanPelaksanaan);

// =====================================================
// DETAIL PELAKSANAAN UNTUK HALAMAN UPLOAD
// =====================================================

router.get("/detail-upload/:id", auth.isLogin, controller.detailPelaksanaanRTL);

// =====================================================
// UPLOAD DOKUMENTASI
// =====================================================

router.post(
  "/dokumentasi",
  auth.isLogin,
  uploadRTL.array("foto", 10),
  controller.uploadDokumentasiRTL,
);

// =====================================================
// DETAIL SATU PELAKSANAAN
// =====================================================

router.get(
  "/detail-pelaksanaan/:id",
  auth.isLogin,
  controller.detailPelaksanaanRTL,
);

// =====================================================
// DATA SUKSES PELAKSANAAN
// =====================================================

router.get("/sukses/:id", auth.isLogin, controller.suksesPelaksanaanRTL);

// =====================================================
// RIWAYAT PELAKSANAAN SATU KEGIATAN
// =====================================================

router.get(
  "/riwayat/:id_kegiatan",
  auth.isLogin,
  controller.getRiwayatPelaksanaan,
);

module.exports = router;
