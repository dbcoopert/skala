const db = require('../config/db'); // Pake const db aja sesuai request lu wok

const kegiatanAdminModel = {
  // Ambil semua data
  getAll: () => {
    return db.query('SELECT * FROM kegiatan_admin');
  },
  
  // Ambil data by ID
  getById: (id_kegiatan) => {
    return db.query('SELECT * FROM kegiatan_admin WHERE id_kegiatan = ?', [id_kegiatan]);
  },
  
  // Tambah data
  create: (kegiatan_admin) => {
    return db.query('INSERT INTO kegiatan_admin (tambah_kegiatan) VALUES (?)', [kegiatan_admin]);
  },
  
  // Update data
  update: (id_kegiatan, tambah_kegiatan) => {
    return db.query('UPDATE kegiatan_admin SET tambah_kegiatan = ? WHERE id_kegiatan = ?', [tambah_kegiatan, id_kegiatan]);
  },
  
  // Hapus data
  delete: (id_kegiatan) => {
    return db.query('DELETE FROM kegiatan_admin WHERE id_kegiatan = ?', [id_kegiatan]);
  }
};

module.exports = kegiatanAdminModel;