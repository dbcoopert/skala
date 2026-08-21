const express = require("express");

const router = express.Router();

const downloadAdminController = require("../controllers/downloadAdminController");

// =====================================================
// TAHUN
// GET /api/download/tahun
// =====================================================

router.get("/tahun", downloadAdminController.getTahun);

// =====================================================
// TUJUAN
// GET /api/download/tujuan?tahun=2025
// =====================================================

router.get("/tujuan", downloadAdminController.getTujuan);

// =====================================================
// SASARAN
// GET /api/download/sasaran?tahun=2025&id_tujuan=1
// =====================================================

router.get("/sasaran", downloadAdminController.getSasaran);

// =====================================================
// INDIKATOR
// GET /api/download/indikator
//     ?tahun=2025
//     &id_tujuan=1
//     &id_sasaran=1
// =====================================================

router.get("/indikator", downloadAdminController.getIndikator);

// =====================================================
// KEGIATAN
// GET /api/download/kegiatan
//     ?tahun=2025
//     &id_tujuan=1
//     &id_sasaran=1
//     &id_indikator=1
// =====================================================

router.get("/kegiatan", downloadAdminController.getKegiatan);

// =====================================================
// LAPORAN
// GET /api/download/laporan
//     ?tahun=2025
//     &id_tujuan=1
//     &id_sasaran=1
//     &id_indikator=1
//     &id_kegiatan_master=1
// =====================================================

router.get("/laporan", downloadAdminController.getLaporan);
router.get("/users", downloadAdminController.getUserFilter);

module.exports = router;
