const db = require("../config/db");

const dashboardUserModel = {
  // =========================================================
  // KEGIATAN MINGGU INI
  //
  // Berdasarkan tanggal kegiatan
  // =========================================================

  mingguModel: async (idUser) => {
    return await db.execute(
      `
      SELECT COUNT(*) AS total

      FROM kegiatan

      WHERE id_user = ?

      AND tanggal >=
        DATE_SUB(
          CURDATE(),
          INTERVAL WEEKDAY(CURDATE()) DAY
        )

      AND tanggal <
        DATE_ADD(
          DATE_SUB(
            CURDATE(),
            INTERVAL WEEKDAY(CURDATE()) DAY
          ),
          INTERVAL 7 DAY
        )
      `,
      [idUser],
    );
  },

  // =========================================================
  // KEGIATAN BULAN INI
  // =========================================================

  bulanModel: async (idUser) => {
    return await db.execute(
      `
      SELECT COUNT(*) AS total

      FROM kegiatan

      WHERE id_user = ?

      AND tanggal >=
        DATE_FORMAT(
          CURDATE(),
          '%Y-%m-01'
        )

      AND tanggal <
        DATE_ADD(
          DATE_FORMAT(
            CURDATE(),
            '%Y-%m-01'
          ),
          INTERVAL 1 MONTH
        )
      `,
      [idUser],
    );
  },

  // =========================================================
  // KEGIATAN TRIWULAN INI
  // =========================================================

  triwulanModel: async (idUser) => {
    return await db.execute(
      `
      SELECT COUNT(*) AS total

      FROM kegiatan

      WHERE id_user = ?

      AND YEAR(tanggal) = YEAR(CURDATE())

      AND QUARTER(tanggal) =
          QUARTER(CURDATE())
      `,
      [idUser],
    );
  },

  // =========================================================
  // KEGIATAN TAHUN INI
  // =========================================================

  tahunModel: async (idUser) => {
    return await db.execute(
      `
      SELECT COUNT(*) AS total

      FROM kegiatan

      WHERE id_user = ?

      AND YEAR(tanggal) =
          YEAR(CURDATE())
      `,
      [idUser],
    );
  },

  // =========================================================
  // RTL MINGGU INI
  //
  // BERDASARKAN PELAKSANAAN RTL
  // BUKAN kolom rtl pada kegiatan
  // =========================================================

  rtlMingguModel: async (idUser) => {
    return await db.execute(
      `
      SELECT COUNT(*) AS total

      FROM pelaksanaan_rtl pr

      INNER JOIN kegiatan k
        ON pr.id_kegiatan =
           k.id_kegiatan

      WHERE k.id_user = ?

      AND pr.tanggal >=
        DATE_SUB(
          CURDATE(),
          INTERVAL WEEKDAY(CURDATE()) DAY
        )

      AND pr.tanggal <
        DATE_ADD(
          DATE_SUB(
            CURDATE(),
            INTERVAL WEEKDAY(CURDATE()) DAY
          ),
          INTERVAL 7 DAY
        )
      `,
      [idUser],
    );
  },

  // =========================================================
  // RTL BULAN INI
  //
  // BERDASARKAN PELAKSANAAN RTL
  // =========================================================

  rtlBulanModel: async (idUser) => {
    return await db.execute(
      `
      SELECT COUNT(*) AS total

      FROM pelaksanaan_rtl pr

      INNER JOIN kegiatan k
        ON pr.id_kegiatan =
           k.id_kegiatan

      WHERE k.id_user = ?

      AND MONTH(pr.tanggal) =
          MONTH(CURDATE())

      AND YEAR(pr.tanggal) =
          YEAR(CURDATE())
      `,
      [idUser],
    );
  },

  // =========================================================
  // RTL TRIWULAN INI
  //
  // BERDASARKAN PELAKSANAAN RTL
  // =========================================================

  rtlTriwulanModel: async (idUser) => {
    return await db.execute(
      `
      SELECT COUNT(*) AS total

      FROM pelaksanaan_rtl pr

      INNER JOIN kegiatan k
        ON pr.id_kegiatan =
           k.id_kegiatan

      WHERE k.id_user = ?

      AND YEAR(pr.tanggal) =
          YEAR(CURDATE())

      AND QUARTER(pr.tanggal) =
          QUARTER(CURDATE())
      `,
      [idUser],
    );
  },

  // =========================================================
  // RTL TAHUN INI
  //
  // BERDASARKAN PELAKSANAAN RTL
  // =========================================================

  rtlTahunModel: async (idUser) => {
    return await db.execute(
      `
      SELECT COUNT(*) AS total

      FROM pelaksanaan_rtl pr

      INNER JOIN kegiatan k
        ON pr.id_kegiatan =
           k.id_kegiatan

      WHERE k.id_user = ?

      AND YEAR(pr.tanggal) =
          YEAR(CURDATE())
      `,
      [idUser],
    );
  },

  // =========================================================
  // PEMBANDING RTL TRIWULAN
  //
  // JUMLAH KEGIATAN YANG MEMILIKI RTL
  //
  // Contoh:
  //
  // 3 dari 5
  //
  // 3 = jumlah pelaksanaan RTL
  // 5 = jumlah kegiatan yang mempunyai RTL
  // =========================================================

  rtlTriwulanPembandingModel: async (idUser) => {
    return await db.execute(
      `
      SELECT COUNT(*) AS total

      FROM kegiatan k

      WHERE k.id_user = ?

      AND TRIM(
        COALESCE(k.rtl, '')
      ) <> ''

      AND k.batas_rtl IS NOT NULL

      AND TRIM(
        COALESCE(k.pic_rtl, '')
      ) <> ''

      AND YEAR(k.tanggal) =
          YEAR(CURDATE())

      AND QUARTER(k.tanggal) =
          QUARTER(CURDATE())
      `,
      [idUser],
    );
  },

  // =========================================================
  // DATA MENU / ARSIP
  // =========================================================

  sqlModel: `
    SELECT

      k.id_kegiatan,

      k.judul,

      k.kegiatan,

      DATE(k.tanggal) AS tanggal,

      i.uraian_indikator

    FROM kegiatan k

    LEFT JOIN indikator_kinerja i
      ON k.id_indikator =
         i.id_indikator

    WHERE k.id_user = ?

    AND YEAR(k.tanggal) = ?
  `,
};

module.exports = dashboardUserModel;
