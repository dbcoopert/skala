const db = require("../config/db");

const tindakLanjutUserModel = {
  // =====================================================
  // GET KEGIATAN YANG BISA DITINDAKLANJUTI
  // =====================================================

  getKegiatanTindakLanjut: async (id_user, id_indikator) => {
    const [rows] = await db.execute(
      `
      SELECT
          k.id_kegiatan,
          k.id_user,
          k.id_indikator,

          k.tanggal,
          DATE_FORMAT(
              k.tanggal,
              '%d-%m-%Y'
          ) AS tanggal_format,

          k.jam_mulai,
          k.jam_selesai,
          k.tempat,

          k.kegiatan,
          k.detail_survei,
          k.judul,

          k.rtl,
          k.batas_rtl,
          k.pic_rtl,

          COUNT(pr.id_pelaksanaan)
              AS jumlah_pelaksanaan

      FROM kegiatan k

      LEFT JOIN pelaksanaan_rtl pr
          ON k.id_kegiatan =
             pr.id_kegiatan

      WHERE
          k.id_user = ?
          AND k.id_indikator = ?

          AND TRIM(
              COALESCE(k.rtl, '')
          ) <> ''

          AND k.batas_rtl IS NOT NULL

          AND TRIM(
              COALESCE(k.pic_rtl, '')
          ) <> ''

      GROUP BY
          k.id_kegiatan,
          k.id_user,
          k.id_indikator,
          k.tanggal,
          k.jam_mulai,
          k.jam_selesai,
          k.tempat,
          k.kegiatan,
          k.detail_survei,
          k.judul,
          k.rtl,
          k.batas_rtl,
          k.pic_rtl

      ORDER BY
          k.tanggal DESC,
          k.id_kegiatan DESC
      `,
      [id_user, id_indikator],
    );

    return rows;
  },

  // =====================================================
  // DETAIL KEGIATAN RTL
  // =====================================================

  getDetailKegiatanTindakLanjut: async (id_kegiatan, id_user) => {
    const [rows] = await db.execute(
      `
      SELECT
          k.id_kegiatan,
          k.id_user,
          k.id_indikator,

          k.kegiatan,
          k.detail_survei,
          k.judul,

          k.rtl,

          DATE_FORMAT(
              k.batas_rtl,
              '%d-%m-%Y'
          ) AS batas_rtl,

          k.pic_rtl

      FROM kegiatan k

      WHERE
          k.id_kegiatan = ?
          AND k.id_user = ?

          AND TRIM(
              COALESCE(k.rtl, '')
          ) <> ''

          AND k.batas_rtl IS NOT NULL

          AND TRIM(
              COALESCE(k.pic_rtl, '')
          ) <> ''

      LIMIT 1
      `,
      [id_kegiatan, id_user],
    );

    return rows;
  },

  // =====================================================
  // SIMPAN PELAKSANAAN RTL
  // =====================================================

  simpanPelaksanaan: async (data) => {
    const [result] = await db.execute(
      `
      INSERT INTO pelaksanaan_rtl
      (
          id_kegiatan,
          tanggal,
          jam_mulai,
          jam_selesai,
          tempat,
          kegiatan,
          detail,
          judul,
          uraian,
          hasil
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.id_kegiatan,
        data.tanggal,
        data.jam_mulai,
        data.jam_selesai,
        data.tempat,
        data.kegiatan,
        data.detail,
        data.judul,
        data.uraian,
        data.hasil,
      ],
    );

    return result;
  },

  // =====================================================
  // CEK KEGIATAN MILIK USER
  // =====================================================

  cekKegiatanRTL: async (id_kegiatan, id_user) => {
    const [rows] = await db.execute(
      `
      SELECT
          id_kegiatan,
          id_user,
          rtl,
          batas_rtl,
          pic_rtl

      FROM kegiatan

      WHERE
          id_kegiatan = ?
          AND id_user = ?

          AND TRIM(
              COALESCE(rtl, '')
          ) <> ''

          AND batas_rtl IS NOT NULL

          AND TRIM(
              COALESCE(pic_rtl, '')
          ) <> ''

      LIMIT 1
      `,
      [id_kegiatan, id_user],
    );

    return rows;
  },

  // =====================================================
  // UPLOAD DOKUMENTASI
  // =====================================================

  uploadDokumentasi: async (id_pelaksanaan, file) => {
    const [result] = await db.execute(
      `
      INSERT INTO dokumentasi_rtl
      (
          id_pelaksanaan,
          nama_file
      )
      VALUES (?, ?)
      `,
      [id_pelaksanaan, file.filename],
    );

    return result;
  },

  // =====================================================
  // JUMLAH DOKUMENTASI
  // =====================================================

  getJumlahDokumentasi: async (id_pelaksanaan) => {
    const [rows] = await db.execute(
      `
      SELECT
          COUNT(*) AS jumlah

      FROM dokumentasi_rtl

      WHERE
          id_pelaksanaan = ?
      `,
      [id_pelaksanaan],
    );

    return rows[0]?.jumlah || 0;
  },

  // =====================================================
  // DETAIL PELAKSANAAN
  // =====================================================

  getDetailPelaksanaan: async (id_pelaksanaan, id_user) => {
    const [rows] = await db.execute(
      `
      SELECT
          pr.id_pelaksanaan,
          pr.id_kegiatan,

          pr.tanggal,
          pr.jam_mulai,
          pr.jam_selesai,
          pr.tempat,

          pr.kegiatan,
          pr.detail,
          pr.judul,
          pr.uraian,
          pr.hasil,

          k.rtl,
          k.batas_rtl,
          k.pic_rtl

      FROM pelaksanaan_rtl pr

      INNER JOIN kegiatan k
          ON pr.id_kegiatan =
             k.id_kegiatan

      WHERE
          pr.id_pelaksanaan = ?
          AND k.id_user = ?

      LIMIT 1
      `,
      [id_pelaksanaan, id_user],
    );

    return rows;
  },

  // =====================================================
  // DATA HALAMAN SUKSES
  // =====================================================

  getDataSuksesPelaksanaan: async (id_pelaksanaan, id_user) => {
    const [rows] = await db.execute(
      `
      SELECT

          pr.id_pelaksanaan,

          pr.id_kegiatan,

          pr.tanggal,

          pr.jam_mulai,

          pr.jam_selesai,

          pr.tempat,

          pr.kegiatan,

          pr.detail,

          pr.judul,

          pr.uraian,

          pr.hasil,

          k.rtl,

          k.batas_rtl,

          k.pic_rtl,

          i.uraian_indikator,

          COUNT(
              dr.id_dokumentasi
          ) AS jumlah_foto,

          MAX(
              dr.created_at
          ) AS waktu_upload

      FROM pelaksanaan_rtl pr

      INNER JOIN kegiatan k
          ON pr.id_kegiatan =
             k.id_kegiatan

      LEFT JOIN indikator_kinerja i
          ON k.id_indikator =
             i.id_indikator

      LEFT JOIN dokumentasi_rtl dr
          ON pr.id_pelaksanaan =
             dr.id_pelaksanaan

      WHERE
          pr.id_pelaksanaan = ?
          AND k.id_user = ?

      GROUP BY

          pr.id_pelaksanaan,
          pr.id_kegiatan,

          pr.tanggal,
          pr.jam_mulai,
          pr.jam_selesai,

          pr.tempat,

          pr.kegiatan,
          pr.detail,
          pr.judul,
          pr.uraian,
          pr.hasil,

          k.rtl,
          k.batas_rtl,
          k.pic_rtl,

          i.uraian_indikator

      LIMIT 1
      `,
      [id_pelaksanaan, id_user],
    );

    return rows;
  },

  // =====================================================
  // RIWAYAT PELAKSANAAN RTL
  // =====================================================

  getRiwayatPelaksanaan: async (id_kegiatan, id_user) => {
    const [rows] = await db.execute(
      `
      SELECT

          pr.id_pelaksanaan,
          pr.id_kegiatan,

          pr.tanggal,

          DATE_FORMAT(
              pr.tanggal,
              '%d-%m-%Y'
          ) AS tanggal_format,

          pr.jam_mulai,
          pr.jam_selesai,
          pr.tempat,

          pr.kegiatan,
          pr.detail,
          pr.judul,
          pr.uraian,
          pr.hasil,

          COUNT(
              dr.id_dokumentasi
          ) AS jumlah_dokumentasi

      FROM pelaksanaan_rtl pr

      INNER JOIN kegiatan k
          ON pr.id_kegiatan =
             k.id_kegiatan

      LEFT JOIN dokumentasi_rtl dr
          ON pr.id_pelaksanaan =
             dr.id_pelaksanaan

      WHERE
          pr.id_kegiatan = ?
          AND k.id_user = ?

      GROUP BY

          pr.id_pelaksanaan,
          pr.id_kegiatan,

          pr.tanggal,

          pr.jam_mulai,
          pr.jam_selesai,
          pr.tempat,

          pr.kegiatan,
          pr.detail,
          pr.judul,
          pr.uraian,
          pr.hasil

      ORDER BY
          pr.tanggal DESC,
          pr.id_pelaksanaan DESC
      `,
      [id_kegiatan, id_user],
    );

    return rows;
  },
};

module.exports = tindakLanjutUserModel;
