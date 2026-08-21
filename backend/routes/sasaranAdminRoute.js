const express = require('express');
const router = express.Router();
const sasaranAdminController = require('../controllers/sasaranAdminController');

// Definisikan endpoint CRUD untuk Sasaran (Terproteksi JWT)
router.post('/baru', sasaranAdminController.createSasaran);
router.get('/', sasaranAdminController.getAllSasaran);
router.put('/:id', sasaranAdminController.updateSasaran);
router.delete('/:id', sasaranAdminController.deleteSasaran);

module.exports = router;