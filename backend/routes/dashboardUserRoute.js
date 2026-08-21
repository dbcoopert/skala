const express = require("express");

const router = express.Router();

const dashboardUserController = require("../controllers/dashboardUserController");

const auth = require("../middleware/authMiddleware");

// =====================================================
// DASHBOARD UTAMA
// =====================================================

router.get("/", auth.isLogin, dashboardUserController.index);

// =====================================================
// ARSIP / MENU DASHBOARD
// =====================================================

router.get("/arsip", auth.isLogin, dashboardUserController.getMenuDashboard);

module.exports = router;
