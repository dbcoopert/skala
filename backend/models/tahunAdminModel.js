const db = require("../config/db");

const tahunAdminModel = {
  // =====================================================
  // GET ALL TAHUN
  // =====================================================
  getAll: async () => {
    const query = `
      SELECT 
        id_tahun,
        tahun,
        triwulan,
        keterangan,
        created_at,
        updated_at
      FROM tahun
      ORDER BY tahun DESC, triwulan ASC
    `;

    const [rows] = await db.execute(query);

    return rows;
  },

  // =====================================================
  // GET TAHUN BY ID
  // =====================================================
  getById: async (id_tahun) => {
    const query = `
      SELECT 
        id_tahun,
        tahun,
        triwulan,
        keterangan,
        created_at,
        updated_at
      FROM tahun
      WHERE id_tahun = ?
    `;

    const [rows] = await db.execute(query, [id_tahun]);

    return rows[0];
  },

  // =====================================================
  // CEK TAHUN
  // =====================================================
  checkTahun: async (tahun) => {
    const query = `
      SELECT 
        id_tahun,
        tahun
      FROM tahun
      WHERE tahun = ?
      LIMIT 1
    `;

    const [rows] = await db.execute(query, [tahun]);

    return rows[0];
  },

  // =====================================================
  // CREATE TAHUN + 4 TRIWULAN
  // =====================================================
  create: async (tahun) => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [existing] = await connection.execute(
        `
          SELECT id_tahun
          FROM tahun
          WHERE tahun = ?
          LIMIT 1
        `,
        [tahun],
      );

      if (existing.length > 0) {
        const error = new Error(`Tahun ${tahun} sudah tersedia`);
        error.code = "DUPLICATE_YEAR";

        throw error;
      }

      const triwulanData = [
        {
          nomor: 1,
          nama: "Triwulan I",
        },
        {
          nomor: 2,
          nama: "Triwulan II",
        },
        {
          nomor: 3,
          nama: "Triwulan III",
        },
        {
          nomor: 4,
          nama: "Triwulan IV",
        },
      ];

      for (const item of triwulanData) {
        const keterangan = `
Terbentuk Folder ${tahun}, sub folder ${item.nama}
        `.trim();

        await connection.execute(
          `
            INSERT INTO tahun (
              tahun,
              triwulan,
              keterangan
            )
            VALUES (?, ?, ?)
          `,
          [tahun, item.nomor, keterangan],
        );
      }

      await connection.commit();

      const [rows] = await connection.execute(
        `
          SELECT 
            id_tahun,
            tahun,
            triwulan,
            keterangan,
            created_at,
            updated_at
          FROM tahun
          WHERE tahun = ?
          ORDER BY triwulan ASC
        `,
        [tahun],
      );

      return rows;
    } catch (error) {
      await connection.rollback();

      throw error;
    } finally {
      connection.release();
    }
  },

  // =====================================================
  // UPDATE TAHUN
  // =====================================================
  updateByTahun: async (tahunLama, tahunBaru) => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [existing] = await connection.execute(
        `
          SELECT 
            id_tahun,
            triwulan
          FROM tahun
          WHERE tahun = ?
          ORDER BY triwulan ASC
        `,
        [tahunLama],
      );

      if (existing.length === 0) {
        const error = new Error(`Tahun ${tahunLama} tidak ditemukan`);

        error.code = "YEAR_NOT_FOUND";

        throw error;
      }

      const [duplicate] = await connection.execute(
        `
          SELECT id_tahun
          FROM tahun
          WHERE tahun = ?
          LIMIT 1
        `,
        [tahunBaru],
      );

      if (duplicate.length > 0) {
        const error = new Error(`Tahun ${tahunBaru} sudah tersedia`);

        error.code = "DUPLICATE_YEAR";

        throw error;
      }

      const namaTriwulan = {
        1: "Triwulan I",
        2: "Triwulan II",
        3: "Triwulan III",
        4: "Triwulan IV",
      };

      for (const item of existing) {
        const nama = namaTriwulan[item.triwulan] || `Triwulan ${item.triwulan}`;

        const keterangan = `Terbentuk Folder ${tahunBaru}, sub folder ${nama}`;

        await connection.execute(
          `
            UPDATE tahun
            SET
              tahun = ?,
              keterangan = ?
            WHERE id_tahun = ?
          `,
          [tahunBaru, keterangan, item.id_tahun],
        );
      }

      await connection.commit();

      const [rows] = await connection.execute(
        `
          SELECT 
            id_tahun,
            tahun,
            triwulan,
            keterangan,
            created_at,
            updated_at
          FROM tahun
          WHERE tahun = ?
          ORDER BY triwulan ASC
        `,
        [tahunBaru],
      );

      return rows;
    } catch (error) {
      await connection.rollback();

      throw error;
    } finally {
      connection.release();
    }
  },

  // =====================================================
  // AMBIL FILE DOKUMENTASI BERDASARKAN ID TAHUN
  //
  // Mengambil:
  // 1. Dokumentasi kegiatan
  // 2. Dokumentasi RTL
  // =====================================================
  getDokumentasiByIdTahun: async (id_tahun) => {
    const [dokumentasiKegiatan] = await db.execute(
      `
        SELECT 
          dk.nama_file
        FROM dokumentasi_kegiatan dk
        INNER JOIN kegiatan k
          ON dk.id_kegiatan = k.id_kegiatan
        WHERE k.id_tahun = ?
      `,
      [id_tahun],
    );

    const [dokumentasiRTL] = await db.execute(
      `
        SELECT 
          dr.nama_file
        FROM dokumentasi_rtl dr
        INNER JOIN pelaksanaan_rtl pr
          ON dr.id_pelaksanaan = pr.id_pelaksanaan
        INNER JOIN kegiatan k
          ON pr.id_kegiatan = k.id_kegiatan
        WHERE k.id_tahun = ?
      `,
      [id_tahun],
    );

    return {
      dokumentasiKegiatan,
      dokumentasiRTL,
    };
  },

  // =====================================================
  // AMBIL FILE DOKUMENTASI BERDASARKAN TAHUN
  //
  // Contoh: tahun 2026
  // =====================================================
  getDokumentasiByTahun: async (tahun) => {
    const [dokumentasiKegiatan] = await db.execute(
      `
        SELECT DISTINCT
          dk.nama_file
        FROM dokumentasi_kegiatan dk
        INNER JOIN kegiatan k
          ON dk.id_kegiatan = k.id_kegiatan
        INNER JOIN tahun t
          ON k.id_tahun = t.id_tahun
        WHERE t.tahun = ?
      `,
      [tahun],
    );

    const [dokumentasiRTL] = await db.execute(
      `
        SELECT DISTINCT
          dr.nama_file
        FROM dokumentasi_rtl dr
        INNER JOIN pelaksanaan_rtl pr
          ON dr.id_pelaksanaan = pr.id_pelaksanaan
        INNER JOIN kegiatan k
          ON pr.id_kegiatan = k.id_kegiatan
        INNER JOIN tahun t
          ON k.id_tahun = t.id_tahun
        WHERE t.tahun = ?
      `,
      [tahun],
    );

    return {
      dokumentasiKegiatan,
      dokumentasiRTL,
    };
  },

  // =====================================================
  // DELETE SATU DATA TRIWULAN BERDASARKAN ID
  //
  // Foreign Key CASCADE akan menghapus:
  // tahun
  //   └── kegiatan
  //         └── dokumentasi_kegiatan
  //         └── pelaksanaan_rtl
  //                └── dokumentasi_rtl
  // =====================================================
  delete: async (id_tahun) => {
    const query = `
      DELETE FROM tahun
      WHERE id_tahun = ?
    `;

    const [result] = await db.execute(query, [id_tahun]);

    return result;
  },

  // =====================================================
  // DELETE SEMUA TRIWULAN BERDASARKAN TAHUN
  // =====================================================
  deleteByTahun: async (tahun) => {
    const query = `
      DELETE FROM tahun
      WHERE tahun = ?
    `;

    const [result] = await db.execute(query, [tahun]);

    return result;
  },
};

module.exports = tahunAdminModel;
