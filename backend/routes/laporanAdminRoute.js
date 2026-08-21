const express = require("express");
const router = express.Router();

const {
  getAllPeriode,
  getKegiatanByPeriode,
  getRTLByPeriode,
  getLaporanByPeriode,
  getDetailKegiatan,
  getDetailRTL,
  getStatistikPeriode,
} = require("../controllers/laporanAdminController");

router.get("/periode", getAllPeriode);
router.get("/statistik", getStatistikPeriode);

// DETAIL
router.get("/kegiatan/:idKegiatan/detail", getDetailKegiatan);
router.get("/rtl/:idPelaksanaan/detail", getDetailRTL);

// PERIODE
router.get("/:tahun/triwulan/:triwulan/kegiatan", getKegiatanByPeriode);
router.get("/:tahun/triwulan/:triwulan/rtl", getRTLByPeriode);
router.get("/:tahun/triwulan/:triwulan", getLaporanByPeriode);

module.exports = router;
