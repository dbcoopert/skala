const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const kegiatanController = require("../controllers/kegiatanUserController");

// =====================================================
// SIMPAN KEGIATAN
// =====================================================

router.post("/", auth.isLogin, kegiatanController.tambah);

// =====================================================
// DETAIL SUKSES KEGIATAN
// =====================================================

router.get("/sukses/:id", auth.isLogin, kegiatanController.getSuccessKegiatan);

// =====================================================
// DETAIL KEGIATAN
// =====================================================

router.get("/:id", auth.isLogin, kegiatanController.detail);

module.exports = router;
