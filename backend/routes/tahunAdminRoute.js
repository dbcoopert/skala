const express = require("express");
const router = express.Router();

const {
  getAllTahun,
  getTahunById,
  createTahun,
  updateTahun,
  deleteTahun,
  deleteTahunByTahun,
} = require("../controllers/tahunAdminController");

router.get("/", getAllTahun);
router.get("/:id", getTahunById);
router.post("/baru", createTahun);
router.put("/by-tahun/:tahun", updateTahun);
router.delete("/id/:id", deleteTahun);
router.delete("/by-tahun/:tahun", deleteTahunByTahun);

module.exports = router;
