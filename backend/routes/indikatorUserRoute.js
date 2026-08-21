const express = require("express");
const router = express.Router();

const indikatorUserController = require("../controllers/indikatorUserController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth.isLogin, indikatorUserController.getAll);

module.exports = router;
