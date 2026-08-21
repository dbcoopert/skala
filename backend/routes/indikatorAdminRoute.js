const express = require('express');
const router = express.Router();
const indikatorAdminController = require('../controllers/indikatorAdminController');

// Routes CRUD (Terproteksi JWT)
router.get('/', indikatorAdminController.getAllIndikator);
router.get('/:id', indikatorAdminController.getIndikatorById);
router.post('/baru', indikatorAdminController.createIndikator);
router.put('/:id', indikatorAdminController.updateIndikator);
router.delete('/:id', indikatorAdminController.deleteIndikator);

module.exports = router;