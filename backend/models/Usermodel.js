const db = require("../config/db");

const Usermodel = {
  // =====================================================
  // CREATE USER
  // =====================================================
  create: async (data) => {
    const query = `
      INSERT INTO users (
        nama,
        NIP,
        teknis,
        username,
        password,
        role,
        ttd
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.nama,
      data.NIP,
      data.teknis,
      data.username,
      data.password,
      data.role,
      data.ttd,
    ];

    const [result] = await db.execute(query, values);

    return result;
  },

  // =====================================================
  // GET ALL USER
  // =====================================================
  findAll: async () => {
    const query = `
      SELECT *
      FROM users
      WHERE role = 'user'
      ORDER BY nama ASC
    `;

    const [rows] = await db.execute(query);

    return rows;
  },

  // =====================================================
  // FIND USER BY ID
  // =====================================================
  findById: async (id) => {
    const query = `
      SELECT *
      FROM users
      WHERE id_user = ?
    `;

    const [rows] = await db.execute(query, [id]);

    return rows[0];
  },

  // =====================================================
  // UPDATE USER
  // =====================================================
  update: async (id, data) => {
    const query = `
      UPDATE users 
      SET
        nama = ?,
        NIP = ?,
        teknis = ?,
        username = ?,
        password = ?,
        role = ?,
        ttd = ?
      WHERE id_user = ?
    `;

    const values = [
      data.nama,
      data.NIP,
      data.teknis,
      data.username,
      data.password,
      data.role,
      data.ttd,
      id,
    ];

    const [result] = await db.execute(query, values);

    return result;
  },

  // =====================================================
  // AMBIL SELURUH DOKUMENTASI KEGIATAN USER
  //
  // Relasi:
  // users -> kegiatan -> dokumentasi_kegiatan
  // =====================================================
  getDokumentasiKegiatanByUser: async (idUser) => {
    const query = `
      SELECT
        dk.id_dokumentasi,
        dk.nama_file,
        k.id_kegiatan
      FROM dokumentasi_kegiatan dk
      INNER JOIN kegiatan k
        ON dk.id_kegiatan = k.id_kegiatan
      WHERE k.id_user = ?
    `;

    const [rows] = await db.execute(query, [idUser]);

    return rows;
  },

  // =====================================================
  // AMBIL SELURUH DOKUMENTASI RTL USER
  //
  // Relasi:
  // users
  //   -> kegiatan
  //      -> pelaksanaan_rtl
  //         -> dokumentasi_rtl
  // =====================================================
  getDokumentasiRTLByUser: async (idUser) => {
    const query = `
      SELECT
        dr.id_dokumentasi,
        dr.nama_file,
        pr.id_pelaksanaan,
        k.id_kegiatan
      FROM dokumentasi_rtl dr
      INNER JOIN pelaksanaan_rtl pr
        ON dr.id_pelaksanaan = pr.id_pelaksanaan
      INNER JOIN kegiatan k
        ON pr.id_kegiatan = k.id_kegiatan
      WHERE k.id_user = ?
    `;

    const [rows] = await db.execute(query, [idUser]);

    return rows;
  },

  // =====================================================
  // HAPUS USER
  //
  // ON DELETE CASCADE akan otomatis menghapus:
  //
  // users
  //   -> kegiatan
  //      -> dokumentasi_kegiatan
  //      -> pelaksanaan_rtl
  //         -> dokumentasi_rtl
  // =====================================================
  delete: async (id) => {
    const query = `
      DELETE FROM users
      WHERE id_user = ?
    `;

    const [result] = await db.execute(query, [id]);

    return result;
  },

  // =====================================================
  // GET MASTER TEKNIS
  // =====================================================
  getTeknis: async () => {
    const query = `
      SELECT
        id_teknis,
        teknis
      FROM teknis
      ORDER BY teknis ASC
    `;

    const [rows] = await db.execute(query);

    return rows;
  },
};

module.exports = Usermodel;
