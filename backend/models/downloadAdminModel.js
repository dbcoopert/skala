const db = require("../config/db");

const downloadAdminModel = {
  // =====================================================
  // GET TAHUN
  // =====================================================

  getTahun: async () => {
    const [rows] = await db.execute(`
      SELECT DISTINCT YEAR(k.tanggal) AS tahun
      FROM kegiatan k
      WHERE k.tanggal IS NOT NULL
      ORDER BY tahun DESC
    `);
    return rows;
  },

  // =====================================================
  // GET TUJUAN
  // =====================================================

  getTujuan: async (tahun, triwulan) => {
    let query = `
      SELECT DISTINCT
        t.id_tujuan,
        t.kode_tujuan,
        t.tujuan
      FROM tujuan_admin t
      INNER JOIN indikator_kinerja ik
        ON ik.tujuan_id = t.id_tujuan
      INNER JOIN kegiatan k
        ON k.id_indikator = ik.id_indikator
      WHERE 1 = 1
    `;

    const values = [];

    if (tahun) {
      query += ` AND YEAR(k.tanggal) = ? `;
      values.push(tahun);
    }

    if (triwulan) {
      query += ` AND QUARTER(k.tanggal) = ? `;
      values.push(triwulan);
    }

    query += `
      ORDER BY t.kode_tujuan ASC, t.id_tujuan ASC
    `;

    const [rows] = await db.execute(query, values);
    return rows;
  },

  // =====================================================
  // GET SASARAN
  // =====================================================

  getSasaran: async (tahun, triwulan, id_tujuan) => {
    let query = `
      SELECT DISTINCT
        s.id_sasaran,
        s.id_tujuan,
        s.kode_sasaran,
        s.deskripsi_sasaran
      FROM sasaran_admin s
      INNER JOIN indikator_kinerja ik
        ON ik.sasaran_id = s.id_sasaran
      INNER JOIN kegiatan k
        ON k.id_indikator = ik.id_indikator
      WHERE 1 = 1
    `;

    const values = [];

    if (tahun) {
      query += ` AND YEAR(k.tanggal) = ? `;
      values.push(tahun);
    }

    if (triwulan) {
      query += ` AND QUARTER(k.tanggal) = ? `;
      values.push(triwulan);
    }

    if (id_tujuan) {
      query += ` AND s.id_tujuan = ? `;
      values.push(id_tujuan);
    }

    query += `
      ORDER BY s.kode_sasaran ASC, s.id_sasaran ASC
    `;

    const [rows] = await db.execute(query, values);
    return rows;
  },

  // =====================================================
  // GET INDIKATOR
  // =====================================================

  getIndikator: async (tahun, triwulan, id_tujuan, id_sasaran) => {
    let query = `
      SELECT DISTINCT
        ik.id_indikator,
        ik.tujuan_id,
        ik.sasaran_id,
        ik.teknis_id,
        ik.kode_indikator,
        ik.uraian_indikator,
        ik.status,
        t.kode_tujuan,
        t.tujuan,
        s.kode_sasaran,
        s.deskripsi_sasaran,
        tek.teknis
      FROM indikator_kinerja ik
      LEFT JOIN tujuan_admin t
        ON ik.tujuan_id = t.id_tujuan
      LEFT JOIN sasaran_admin s
        ON ik.sasaran_id = s.id_sasaran
      LEFT JOIN teknis tek
        ON ik.teknis_id = tek.id_teknis
      INNER JOIN kegiatan k
        ON k.id_indikator = ik.id_indikator
      WHERE 1 = 1
    `;

    const values = [];

    if (tahun) {
      query += ` AND YEAR(k.tanggal) = ? `;
      values.push(tahun);
    }

    if (triwulan) {
      query += ` AND QUARTER(k.tanggal) = ? `;
      values.push(triwulan);
    }

    if (id_tujuan) {
      query += ` AND ik.tujuan_id = ? `;
      values.push(id_tujuan);
    }

    if (id_sasaran) {
      query += ` AND ik.sasaran_id = ? `;
      values.push(id_sasaran);
    }

    query += `
      ORDER BY ik.kode_indikator ASC, ik.id_indikator ASC
    `;

    const [rows] = await db.execute(query, values);
    return rows;
  },

  // =====================================================
  // GET KEGIATAN MASTER
  // =====================================================

  getKegiatan: async (tahun, triwulan, id_tujuan, id_sasaran, id_indikator) => {
    let query = `
      SELECT DISTINCT
        ka.id_kegiatan,
        ka.tambah_kegiatan,
        ik.id_indikator,
        ik.kode_indikator,
        ik.uraian_indikator,
        t.id_tujuan,
        t.kode_tujuan,
        t.tujuan,
        s.id_sasaran,
        s.kode_sasaran,
        s.deskripsi_sasaran
      FROM kegiatan_admin ka
      INNER JOIN kegiatan k
        ON k.id_kegiatan_master = ka.id_kegiatan
      INNER JOIN indikator_kinerja ik
        ON k.id_indikator = ik.id_indikator
      LEFT JOIN tujuan_admin t
        ON ik.tujuan_id = t.id_tujuan
      LEFT JOIN sasaran_admin s
        ON ik.sasaran_id = s.id_sasaran
      WHERE 1 = 1
    `;

    const values = [];

    if (tahun) {
      query += ` AND YEAR(k.tanggal) = ? `;
      values.push(tahun);
    }

    if (triwulan) {
      query += ` AND QUARTER(k.tanggal) = ? `;
      values.push(triwulan);
    }

    if (id_tujuan) {
      query += ` AND ik.tujuan_id = ? `;
      values.push(id_tujuan);
    }

    if (id_sasaran) {
      query += ` AND ik.sasaran_id = ? `;
      values.push(id_sasaran);
    }

    if (id_indikator) {
      query += ` AND k.id_indikator = ? `;
      values.push(id_indikator);
    }

    query += `
      ORDER BY ka.id_kegiatan ASC
    `;

    const [rows] = await db.execute(query, values);
    return rows;
  },

  // =====================================================
  // GET USER HASIL FILTER
  // =====================================================

  getUserFilter: async (filters) => {
    let query = `
      SELECT DISTINCT
        u.id_user,
        u.nama,
        u.NIP AS nip,
        u.username
      FROM kegiatan k
      INNER JOIN indikator_kinerja ik
        ON k.id_indikator = ik.id_indikator
      LEFT JOIN tujuan_admin t
        ON ik.tujuan_id = t.id_tujuan
      LEFT JOIN sasaran_admin s
        ON ik.sasaran_id = s.id_sasaran
      INNER JOIN users u
        ON k.id_user = u.id_user
      WHERE 1 = 1
    `;

    const values = [];

    if (filters.tahun) {
      query += ` AND YEAR(k.tanggal) = ? `;
      values.push(filters.tahun);
    }

    if (filters.triwulan) {
      query += ` AND QUARTER(k.tanggal) = ? `;
      values.push(filters.triwulan);
    }

    if (filters.id_tujuan) {
      query += ` AND ik.tujuan_id = ? `;
      values.push(filters.id_tujuan);
    }

    if (filters.id_sasaran) {
      query += ` AND ik.sasaran_id = ? `;
      values.push(filters.id_sasaran);
    }

    if (filters.id_indikator) {
      query += ` AND k.id_indikator = ? `;
      values.push(filters.id_indikator);
    }

    if (filters.id_kegiatan_master) {
      query += ` AND k.id_kegiatan_master = ? `;
      values.push(filters.id_kegiatan_master);
    }

    query += `
      ORDER BY u.nama ASC, u.id_user ASC
    `;

    const [rows] = await db.execute(query, values);
    return rows;
  },

  // =====================================================
  // GET LAPORAN
  // =====================================================

  getLaporan: async (filters) => {
    let query = `
      SELECT
        k.id_kegiatan,
        k.id_user,
        k.id_indikator,
        k.id_kegiatan_master,

        k.tanggal,
        DATE_FORMAT(k.tanggal, '%d-%m-%Y') AS tanggal_format,

        k.jam_mulai,
        k.jam_selesai,
        k.tempat,
        k.kegiatan,
        k.detail_survei,
        k.judul,
        k.uraian,
        k.hasil,
        k.kendala,
        k.solusi,

        k.rtl,
        k.batas_rtl,
        DATE_FORMAT(k.batas_rtl, '%d-%m-%Y') AS batas_rtl_format,
        k.pic_rtl,

        k.created_at,

        t.id_tujuan,
        t.kode_tujuan,
        t.tujuan,

        s.id_sasaran,
        s.kode_sasaran,
        s.deskripsi_sasaran,

        ik.kode_indikator,
        ik.uraian_indikator,
        ik.status AS status_indikator,

        ka.id_kegiatan AS id_kegiatan_master_ref,
        ka.tambah_kegiatan AS kegiatan_master,

        tek.id_teknis,
        tek.teknis,

        u.id_user AS user_id,
        u.nama AS nama_user,
        u.NIP AS nip_user,
        u.username,
        u.role,
        u.ttd AS ttd_user

      FROM kegiatan k

      INNER JOIN indikator_kinerja ik
        ON k.id_indikator = ik.id_indikator

      LEFT JOIN tujuan_admin t
        ON ik.tujuan_id = t.id_tujuan

      LEFT JOIN sasaran_admin s
        ON ik.sasaran_id = s.id_sasaran

      LEFT JOIN kegiatan_admin ka
        ON k.id_kegiatan_master = ka.id_kegiatan

      LEFT JOIN teknis tek
        ON ik.teknis_id = tek.id_teknis

      INNER JOIN users u
        ON k.id_user = u.id_user

      WHERE 1 = 1
    `;

    const values = [];

    if (filters.tahun) {
      query += ` AND YEAR(k.tanggal) = ? `;
      values.push(filters.tahun);
    }

    if (filters.triwulan) {
      query += ` AND QUARTER(k.tanggal) = ? `;
      values.push(filters.triwulan);
    }

    if (filters.id_tujuan) {
      query += ` AND ik.tujuan_id = ? `;
      values.push(filters.id_tujuan);
    }

    if (filters.id_sasaran) {
      query += ` AND ik.sasaran_id = ? `;
      values.push(filters.id_sasaran);
    }

    if (filters.id_indikator) {
      query += ` AND k.id_indikator = ? `;
      values.push(filters.id_indikator);
    }

    if (filters.id_kegiatan_master) {
      query += ` AND k.id_kegiatan_master = ? `;
      values.push(filters.id_kegiatan_master);
    }

    if (Array.isArray(filters.user_ids) && filters.user_ids.length > 0) {
      const placeholders = filters.user_ids.map(() => "?").join(",");

      query += `
        AND k.id_user IN (${placeholders})
      `;

      values.push(...filters.user_ids);
    }

    query += `
      ORDER BY
        u.nama ASC,
        k.tanggal ASC,
        k.id_kegiatan ASC
    `;

    const [rows] = await db.execute(query, values);
    return rows;
  },

  // =====================================================
  // GET DOKUMENTASI KEGIATAN
  // =====================================================

  getDokumentasi: async (id_kegiatan) => {
    const [rows] = await db.execute(
      `
      SELECT *
      FROM dokumentasi_kegiatan
      WHERE id_kegiatan = ?
      ORDER BY id_dokumentasi ASC
      `,
      [id_kegiatan],
    );

    return rows;
  },

  // =====================================================
  // GET PELAKSANAAN RTL
  // =====================================================

  getPelaksanaanRTL: async (id_kegiatan) => {
    const [rows] = await db.execute(
      `
      SELECT
        pr.id_pelaksanaan,
        pr.id_kegiatan,
        pr.tanggal,
        DATE_FORMAT(pr.tanggal, '%d-%m-%Y') AS tanggal_format,
        pr.jam_mulai,
        pr.jam_selesai,
        pr.tempat,
        pr.kegiatan,
        pr.detail,
        pr.judul,
        pr.uraian,
        pr.hasil,
        pr.created_at
      FROM pelaksanaan_rtl pr
      INNER JOIN kegiatan k
        ON pr.id_kegiatan = k.id_kegiatan
      WHERE pr.id_kegiatan = ?
      ORDER BY pr.tanggal ASC, pr.id_pelaksanaan ASC
      `,
      [id_kegiatan],
    );

    return rows;
  },

  // =====================================================
  // GET DOKUMENTASI RTL
  // =====================================================

  getDokumentasiRTL: async (id_pelaksanaan) => {
    const [rows] = await db.execute(
      `
      SELECT
        id_dokumentasi,
        id_pelaksanaan,
        nama_file
      FROM dokumentasi_rtl
      WHERE id_pelaksanaan = ?
      ORDER BY id_dokumentasi ASC
      `,
      [id_pelaksanaan],
    );

    return rows;
  },
};

module.exports = downloadAdminModel;
