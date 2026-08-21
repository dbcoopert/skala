const express = require('express');
const router = express.Router();
const teknisController = require('../controllers/teknisAdminController');

router.get('/', teknisController.getSemua);
router.get('/:id', teknisController.getDetail);
router.post('/baru', teknisController.tambah);
router.put('/:id', teknisController.ubah);
router.delete('/:id', teknisController.hapus);

module.exports = router;