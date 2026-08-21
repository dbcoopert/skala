const db = require("../config/db");

exports.uploadKegiatanUserModel = async (id_kegiatan, file) => {
  const [result] = await db.execute(
    `INSERT INTO dokumentasi_kegiatan
     (id_kegiatan, nama_file)
     VALUES (?, ?)`,
    [id_kegiatan, file.filename],
  );

  return result;
};
