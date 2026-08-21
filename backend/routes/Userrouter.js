const express = require('express');
const router = express.Router();
const userController = require('../controllers/Usercontrollers');
const upload = require('../middleware/upload'); // Panggil konfigurasi multer

router.post('/user', upload.single('ttd'), userController.createUser);
router.get('/user', userController.getUsers);

// Tiga rute di bawah ini udah disetting biar bisa pake ID polosan (contoh: /user/5)
router.get('/user/:id', userController.getUserById);
router.put('/user/:id', upload.single('ttd'), userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

//untuk memanggil teknis pada field teknis pengguna
router.get("/master-teknis", userController.getMasterTeknis);

module.exports = router;