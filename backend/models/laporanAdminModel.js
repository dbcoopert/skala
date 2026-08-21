const db = require("../config/db");

const laporanAdminModel = {
  // =================================
  // GET ALL PERIODE
  // =================================

  getAllPeriode: async () => {
    const query = `
      SELECT
        id_tahun,
        tahun,
        triwulan,
        keterangan
      FROM tahun
      ORDER BY tahun DESC, triwulan ASC
    `;

    const [rows] = await db.execute(query);

    return rows;
  },

  // =================================
  // DETAIL KEGIATAN
  // =================================

  getDetailKegiatan: async (idKegiatan) => {
    // =================================
    // DATA KEGIATAN
    // =================================

    const queryKegiatan = `
      SELECT
        k.id_kegiatan,
        k.id_user,
        k.id_indikator,
        k.id_kegiatan_master,
        k.tanggal,
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
        k.pic_rtl,
        k.created_at,

        u.nama AS nama_user,
        u.NIP AS nip_user,
        u.username AS username_user,
        u.role AS role_user,
        u.teknis AS teknis_user

      FROM kegiatan k

      LEFT JOIN users u
        ON k.id_user = u.id_user

      WHERE k.id_kegiatan = ?

      LIMIT 1
    `;

    const [kegiatanRows] = await db.execute(queryKegiatan, [idKegiatan]);

    const kegiatan = kegiatanRows[0];

    if (!kegiatan) {
      return {
        kegiatan: null,
        rtl: [],
        dokumentasi: [],
      };
    }

    // =================================
    // DATA RTL BERDASARKAN KEGIATAN
    // =================================

    const queryRTL = `
      SELECT
        p.id_pelaksanaan,
        p.id_kegiatan,
        p.tanggal,
        p.jam_mulai,
        p.jam_selesai,
        p.tempat,
        p.kegiatan,
        p.detail,
        p.judul,
        p.uraian,
        p.hasil,
        p.created_at,

        k.judul AS judul_kegiatan,
        k.rtl AS rencana_rtl,
        k.batas_rtl,
        k.pic_rtl,

        u.nama AS nama_user,
        u.NIP AS nip_user,
        u.username AS username_user,
        u.role AS role_user,
        u.teknis AS teknis_user

      FROM pelaksanaan_rtl p

      LEFT JOIN kegiatan k
        ON p.id_kegiatan = k.id_kegiatan

      LEFT JOIN users u
        ON k.id_user = u.id_user

      WHERE p.id_kegiatan = ?

      ORDER BY
        p.tanggal DESC,
        p.id_pelaksanaan DESC
    `;

    const [rtlRows] = await db.execute(queryRTL, [idKegiatan]);

    // =================================
    // DOKUMENTASI KEGIATAN
    // =================================

    const queryDokumentasi = `
      SELECT
        id_dokumentasi,
        id_kegiatan,
        nama_file,
        created_at

      FROM dokumentasi_kegiatan

      WHERE id_kegiatan = ?

      ORDER BY
        created_at DESC,
        id_dokumentasi DESC
    `;

    const [dokumentasiRows] = await db.execute(queryDokumentasi, [idKegiatan]);

    console.log("DETAIL KEGIATAN:", idKegiatan);
    console.log("JUMLAH RTL:", rtlRows.length);
    console.log("JUMLAH DOKUMENTASI KEGIATAN:", dokumentasiRows.length);

    return {
      kegiatan,
      rtl: rtlRows,
      dokumentasi: dokumentasiRows,
    };
  },

  // =================================
  // DETAIL RTL
  // =================================

  getDetailRTL: async (idPelaksanaan) => {
    // =================================
    // DATA RTL
    // =================================

    const queryRTL = `
      SELECT
        p.id_pelaksanaan,
        p.id_kegiatan,
        p.tanggal,
        p.jam_mulai,
        p.jam_selesai,
        p.tempat,
        p.kegiatan,
        p.detail,
        p.judul,
        p.uraian,
        p.hasil,
        p.created_at,

        k.id_user,
        k.judul AS judul_kegiatan,
        k.kegiatan AS kegiatan_asal,
        k.uraian AS uraian_kegiatan,
        k.hasil AS hasil_kegiatan,
        k.kendala,
        k.solusi,
        k.rtl AS rencana_rtl,
        k.batas_rtl,
        k.pic_rtl,

        u.nama AS nama_user,
        u.NIP AS nip_user,
        u.username AS username_user,
        u.role AS role_user,
        u.teknis AS teknis_user

      FROM pelaksanaan_rtl p

      INNER JOIN kegiatan k
        ON p.id_kegiatan = k.id_kegiatan

      LEFT JOIN users u
        ON k.id_user = u.id_user

      WHERE p.id_pelaksanaan = ?

      LIMIT 1
    `;

    const [rtlRows] = await db.execute(queryRTL, [idPelaksanaan]);

    const rtl = rtlRows[0];

    if (!rtl) {
      return null;
    }

    // =================================
    // DOKUMENTASI RTL
    // =================================

    const queryDokumentasi = `
      SELECT
        id_dokumentasi,
        id_pelaksanaan,
        nama_file,
        created_at

      FROM dokumentasi_rtl

      WHERE id_pelaksanaan = ?

      ORDER BY
        created_at DESC,
        id_dokumentasi DESC
    `;

    const [dokumentasiRows] = await db.execute(queryDokumentasi, [
      idPelaksanaan,
    ]);

    console.log("DETAIL RTL:", idPelaksanaan);
    console.log("JUMLAH DOKUMENTASI RTL:", dokumentasiRows.length);

    return {
      ...rtl,
      dokumentasi: dokumentasiRows,
    };
  },

  // =================================
  // KEGIATAN BERDASARKAN PERIODE
  // =================================

  getKegiatanByPeriode: async (tahun, triwulan) => {
    const query = `
      SELECT
        k.id_kegiatan,
        k.id_user,
        k.id_indikator,
        k.id_kegiatan_master,
        k.tanggal,
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
        k.pic_rtl,
        k.created_at,

        u.nama AS nama_user,
        u.NIP AS nip_user,
        u.teknis AS teknis_user,

        YEAR(k.tanggal) AS tahun,
        QUARTER(k.tanggal) AS triwulan

      FROM kegiatan k

      LEFT JOIN users u
        ON k.id_user = u.id_user

      WHERE YEAR(k.tanggal) = ?
        AND QUARTER(k.tanggal) = ?

      ORDER BY
        k.tanggal DESC,
        k.id_kegiatan DESC
    `;

    const [rows] = await db.execute(query, [tahun, triwulan]);

    return rows;
  },

  // =================================
  // RTL BERDASARKAN PERIODE
  // =================================

  getRTLByPeriode: async (tahun, triwulan) => {
    const query = `
      SELECT
        p.id_pelaksanaan,
        p.id_kegiatan,
        p.tanggal,
        p.jam_mulai,
        p.jam_selesai,
        p.tempat,
        p.kegiatan,
        p.detail,
        p.judul,
        p.uraian,
        p.hasil,
        p.created_at,

        k.id_user,
        k.judul AS judul_kegiatan,
        k.rtl AS rencana_rtl,
        k.batas_rtl,
        k.pic_rtl,

        u.nama AS nama_user,
        u.NIP AS nip_user,
        u.teknis AS teknis_user,

        YEAR(p.tanggal) AS tahun,
        QUARTER(p.tanggal) AS triwulan

      FROM pelaksanaan_rtl p

      INNER JOIN kegiatan k
        ON p.id_kegiatan = k.id_kegiatan

      LEFT JOIN users u
        ON k.id_user = u.id_user

      WHERE YEAR(p.tanggal) = ?
        AND QUARTER(p.tanggal) = ?

      ORDER BY
        p.tanggal DESC,
        p.id_pelaksanaan DESC
    `;

    const [rows] = await db.execute(query, [tahun, triwulan]);

    return rows;
  },

  // =================================
  // LAPORAN KEGIATAN + RTL
  // =================================

  getLaporanByPeriode: async (tahun, triwulan) => {
    const queryKegiatan = `
      SELECT
        k.id_kegiatan,
        k.id_user,
        k.id_indikator,
        k.id_kegiatan_master,
        k.tanggal,
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
        k.pic_rtl,
        k.created_at,

        u.nama AS nama_user,
        u.NIP AS nip_user,
        u.teknis AS teknis_user,

        YEAR(k.tanggal) AS tahun,
        QUARTER(k.tanggal) AS triwulan

      FROM kegiatan k

      LEFT JOIN users u
        ON k.id_user = u.id_user

      WHERE YEAR(k.tanggal) = ?
        AND QUARTER(k.tanggal) = ?

      ORDER BY
        k.tanggal DESC,
        k.id_kegiatan DESC
    `;

    const queryRTL = `
      SELECT
        p.id_pelaksanaan,
        p.id_kegiatan,
        p.tanggal,
        p.jam_mulai,
        p.jam_selesai,
        p.tempat,
        p.kegiatan,
        p.detail,
        p.judul,
        p.uraian,
        p.hasil,
        p.created_at,

        k.id_user,
        k.judul AS judul_kegiatan,
        k.rtl AS rencana_rtl,
        k.batas_rtl,
        k.pic_rtl,

        u.nama AS nama_user,
        u.NIP AS nip_user,
        u.teknis AS teknis_user,

        YEAR(p.tanggal) AS tahun,
        QUARTER(p.tanggal) AS triwulan

      FROM pelaksanaan_rtl p

      INNER JOIN kegiatan k
        ON p.id_kegiatan = k.id_kegiatan

      LEFT JOIN users u
        ON k.id_user = u.id_user

      WHERE YEAR(p.tanggal) = ?
        AND QUARTER(p.tanggal) = ?

      ORDER BY
        p.tanggal DESC,
        p.id_pelaksanaan DESC
    `;

    const [kegiatan] = await db.execute(queryKegiatan, [tahun, triwulan]);

    const [rtl] = await db.execute(queryRTL, [tahun, triwulan]);

    return {
      tahun: Number(tahun),
      triwulan: Number(triwulan),
      kegiatan,
      rtl,
    };
  },

  // =================================
  // STATISTIK PERIODE
  // =================================

  getStatistikPeriode: async () => {
    const query = `
      SELECT
        t.id_tahun,
        t.tahun,
        t.triwulan,

        COUNT(DISTINCT k.id_kegiatan) AS jumlah_kegiatan,

        COUNT(
          DISTINCT p.id_pelaksanaan
        ) AS jumlah_rtl

      FROM tahun t

      LEFT JOIN kegiatan k
        ON YEAR(k.tanggal) = t.tahun
        AND QUARTER(k.tanggal) = t.triwulan

      LEFT JOIN pelaksanaan_rtl p
        ON p.id_kegiatan = k.id_kegiatan

      GROUP BY
        t.id_tahun,
        t.tahun,
        t.triwulan

      ORDER BY
        t.tahun DESC,
        t.triwulan ASC
    `;

    const [rows] = await db.execute(query);

    return rows;
  },
};

module.exports = laporanAdminModel;
