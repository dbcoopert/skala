const express = require('express');
const router = express.Router();
const kegiatanAdminController = require('../controllers/kegiatanAdminController');

router.get('/', kegiatanAdminController.getAll);
router.get('/:id', kegiatanAdminController.getById);
router.post('/baru', kegiatanAdminController.create);
router.put('/:id', kegiatanAdminController.update);
router.delete('/:id', kegiatanAdminController.delete);

module.exports = router;