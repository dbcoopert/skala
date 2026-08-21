const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const dokumentasiUserController = require("../controllers/dokumentasiUserController");

router.post(
  "/kegiatan",
  auth.isLogin,
  uploadMiddleware.array("foto", 10),
  dokumentasiUserController.uploadKegiatan,
);

module.exports = router;
