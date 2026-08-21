// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/uploads/kegiatan");
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname).toLowerCase();
//     const namaFile =
//       Date.now() + "-" + Math.round(Math.random() * 100000) + ext;
//     cb(null, namaFile);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

//   if (allowed.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Format file harus JPG, JPEG, PNG, atau PDF"));
//   }
// };

// module.exports = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//     files: 10,
//   },
// });

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =====================================
// PATH UPLOAD KEGIATAN
// =====================================

const uploadDir = path.join(__dirname, "../public/uploads/kegiatan");

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
    const ext = path.extname(file.originalname).toLowerCase();

    const namaFile =
      Date.now() + "-" + Math.round(Math.random() * 100000) + ext;

    cb(null, namaFile);
  },
});

// =====================================
// FILTER FILE
// =====================================

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format file harus JPG, JPEG, PNG, atau PDF"), false);
  }
};

// =====================================
// EXPORT MULTER
// =====================================

module.exports = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,

    files: 10,
  },
});