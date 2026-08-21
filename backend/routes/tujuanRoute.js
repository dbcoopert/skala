const express = require("express");
const router = express.Router();
const TujuanAdminController = require("../controllers/tujuanAdminController.js");

router.get("/", TujuanAdminController.getAll);
router.get("/:id", TujuanAdminController.getById);
router.post("/baru", TujuanAdminController.create);
router.put("/:id", TujuanAdminController.update);
router.delete("/:id", TujuanAdminController.delete);

module.exports = router;
