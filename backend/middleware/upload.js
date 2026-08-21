// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Gunakan path absolut agar folder tidak nyasar
// const uploadDir = path.join(__dirname, '../public/uploads/ttd');

// // Fitur tambahan: Otomatis membuat folder jika belum ada
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     // Penamaan file agar unik
//     cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Hanya diperbolehkan mengunggah file gambar!'), false);
//   }
// };

// const upload = multer({ storage: storage, fileFilter: fileFilter });

// module.exports = upload;

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =====================================
// PATH UPLOAD TTD
// =====================================

const uploadDir = path.join(__dirname, "../public/uploads/ttd");

// =====================================
// BUAT FOLDER JIKA BELUM ADA
// =====================================

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// =====================================
// STORAGE
// =====================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const namaFile =
      Date.now() +
      "-" +
      Math.round(Math.random() * 100000) +
      path.extname(file.originalname);

    cb(null, namaFile);
  },
});

// =====================================
// FILTER FILE
// =====================================

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Hanya diperbolehkan mengunggah file JPG, JPEG, atau PNG!"),
      false,
    );
  }
};

// =====================================
// MULTER
// =====================================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;