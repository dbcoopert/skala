const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.get("/me", auth.isLogin, auth.me);
router.post("/logout", authController.logout);

module.exports = router;
