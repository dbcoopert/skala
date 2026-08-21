const express = require("express");
const router = express.Router();
const {
  getDashboardAdmin,
  getDashboardBulanan,
} = require("../controllers/dashboardAdminController");

router.get("/", getDashboardAdmin);
router.get("/monthly", getDashboardBulanan);

module.exports = router;
