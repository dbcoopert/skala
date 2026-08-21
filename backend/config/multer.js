const multer = require("multer");
const path = require("path");
const fs = require("fs");

function createStorage(folder) {
  const uploadPath = path.join(__dirname, "..", "uploads", folder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination(req, file, cb) {
      cb(null, uploadPath);
    },

    filename(req, file, cb) {
      const ext = path.extname(file.originalname);

      const filename =
        Date.now() + "-" + Math.round(Math.random() * 100000) + ext;

      cb(null, filename);
    },
  });
}

const uploadKegiatan = multer({
  storage: createStorage("kegiatan"),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {
    const allowed = /jpg|jpeg|png/;

    const ext = allowed.test(path.extname(file.originalname).toLowerCase());

    const mime = allowed.test(file.mimetype);

    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("File harus JPG atau PNG"));
    }
  },
});

const uploadRTL = multer({
  storage: createStorage("rtl"),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  uploadKegiatan,
  uploadRTL,
};
