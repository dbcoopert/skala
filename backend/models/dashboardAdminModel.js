const db = require("../config/db");

const dashboardAdminModel = {
  // =====================================================
  // REKAP DASHBOARD PER BULAN
  //
  // KEGIATAN
  // = jumlah laporan kegiatan
  //
  // TINDAK LANJUT
  // = jumlah kegiatan yang memiliki RTL
  //
  // Periode menggunakan tanggal kegiatan
  // =====================================================

  getRekapTahunan: async (tahun) => {
    const [rows] = await db.query(
      `
      SELECT
        bulan.bulan,

        COALESCE(k.kegiatan, 0) AS kegiatan,

        COALESCE(t.tl, 0) AS tl

      FROM
      (
        SELECT 1 AS bulan
        UNION SELECT 2
        UNION SELECT 3
        UNION SELECT 4
        UNION SELECT 5
        UNION SELECT 6
        UNION SELECT 7
        UNION SELECT 8
        UNION SELECT 9
        UNION SELECT 10
        UNION SELECT 11
        UNION SELECT 12
      ) AS bulan


      -- =================================================
      -- TOTAL KEGIATAN PER BULAN
      -- =================================================

      LEFT JOIN
      (
        SELECT
          MONTH(k.tanggal) AS bulan,

          COUNT(DISTINCT k.id_kegiatan) AS kegiatan

        FROM kegiatan k

        INNER JOIN users u
          ON u.id_user = k.id_user

        WHERE YEAR(k.tanggal) = ?

        AND LOWER(TRIM(u.role)) = 'user'

        GROUP BY
          MONTH(k.tanggal)

      ) k

      ON k.bulan = bulan.bulan


      -- =================================================
      -- TOTAL RTL PER BULAN
      --
      -- RTL DIAMBIL DARI:
      -- kegiatan.rtl
      --
      -- BUKAN dari deadline tindak_lanjut
      -- =================================================

      LEFT JOIN
      (
        SELECT
          MONTH(k.tanggal) AS bulan,

          COUNT(DISTINCT k.id_kegiatan) AS tl

        FROM kegiatan k

        INNER JOIN users u
          ON u.id_user = k.id_user

        WHERE YEAR(k.tanggal) = ?

        AND LOWER(TRIM(u.role)) = 'user'

        AND k.rtl IS NOT NULL

        AND TRIM(k.rtl) <> ''

        GROUP BY
          MONTH(k.tanggal)

      ) t

      ON t.bulan = bulan.bulan


      ORDER BY
        bulan.bulan ASC
      `,
      [tahun, tahun],
    );

    return rows;
  },

  // =====================================================
  // DETAIL DASHBOARD PER BULAN
  //
  // Menampilkan statistik setiap user
  // =====================================================

  getDetailBulanan: async (tahun, bulan) => {
    const [rows] = await db.query(
      `
      SELECT

        u.id_user,

        u.nama,

        u.role,


        -- =============================================
        -- TOTAL KEGIATAN
        -- =============================================

        COALESCE(k.kegiatan, 0) AS kegiatan,


        -- =============================================
        -- TOTAL RTL
        -- =============================================

        COALESCE(t.tl, 0) AS tl


      FROM users u


      -- =================================================
      -- KEGIATAN USER
      -- =================================================

      LEFT JOIN
      (
        SELECT

          k.id_user,

          COUNT(DISTINCT k.id_kegiatan) AS kegiatan

        FROM kegiatan k

        WHERE YEAR(k.tanggal) = ?

        AND MONTH(k.tanggal) = ?

        GROUP BY
          k.id_user

      ) k

      ON k.id_user = u.id_user


      -- =================================================
      -- RTL USER
      --
      -- RTL berasal dari kegiatan.rtl
      -- =================================================

      LEFT JOIN
      (
        SELECT

          k.id_user,

          COUNT(DISTINCT k.id_kegiatan) AS tl

        FROM kegiatan k

        WHERE YEAR(k.tanggal) = ?

        AND MONTH(k.tanggal) = ?

        AND k.rtl IS NOT NULL

        AND TRIM(k.rtl) <> ''

        GROUP BY
          k.id_user

      ) t

      ON t.id_user = u.id_user


      -- =================================================
      -- HANYA USER BIASA
      -- =================================================

      WHERE LOWER(TRIM(u.role)) = 'user'


      ORDER BY
        u.nama ASC
      `,
      [tahun, bulan, tahun, bulan],
    );

    return rows;
  },

  // =====================================================
  // TOTAL KEGIATAN
  //
  // Berdasarkan tanggal kegiatan
  // =====================================================

  getTotalKegiatan: async (tahun) => {
    const [rows] = await db.query(
      `
      SELECT

        COUNT(DISTINCT k.id_kegiatan) AS total

      FROM kegiatan k

      INNER JOIN users u
        ON u.id_user = k.id_user

      WHERE YEAR(k.tanggal) = ?

      AND LOWER(TRIM(u.role)) = 'user'
      `,
      [tahun],
    );

    return rows[0]?.total || 0;
  },

  // =====================================================
  // TOTAL TINDAK LANJUT
  //
  // RTL berasal dari kolom:
  // kegiatan.rtl
  //
  // Bukan berdasarkan:
  // tindak_lanjut.deadline
  // =====================================================

  getTotalTindakLanjut: async (tahun) => {
    const [rows] = await db.query(
      `
      SELECT

        COUNT(DISTINCT k.id_kegiatan) AS total

      FROM kegiatan k

      INNER JOIN users u
        ON u.id_user = k.id_user

      WHERE YEAR(k.tanggal) = ?

      AND LOWER(TRIM(u.role)) = 'user'

      AND k.rtl IS NOT NULL

      AND TRIM(k.rtl) <> ''
      `,
      [tahun],
    );

    return rows[0]?.total || 0;
  },

  // =====================================================
  // TOTAL PENGGUNA
  // =====================================================

  getTotalPengguna: async () => {
    const [rows] = await db.query(
      `
      SELECT

        COUNT(*) AS total

      FROM users

      WHERE LOWER(TRIM(role)) = 'user'
      `,
    );

    return rows[0]?.total || 0;
  },
};

module.exports = dashboardAdminModel;
