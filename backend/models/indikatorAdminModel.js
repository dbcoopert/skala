const db = require("../config/db");

const indikatorAdminModel = {
  // ===============================
  // GET ALL
  // ===============================
  getAll: async () => {
    const [rows] = await db.query(`
            SELECT
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

            ORDER BY ik.id_indikator ASC
        `);

    return rows;
  },

  // ===============================
  // GET BY ID
  // ===============================
  getById: async (id) => {
    const [rows] = await db.query(
      `
            SELECT
                *
            FROM indikator_kinerja
            WHERE id_indikator = ?
        `,
      [id],
    );

    return rows[0];
  },

  // ===============================
  // CREATE
  // ===============================
  create: async (data) => {
    const {
      tujuan_id,
      sasaran_id,
      teknis_id,
      kode_indikator,
      uraian_indikator,
      status,
    } = data;

    const [result] = await db.query(
      `
            INSERT INTO indikator_kinerja
            (
                tujuan_id,
                sasaran_id,
                teknis_id,
                kode_indikator,
                uraian_indikator,
                status
            )
            VALUES(?,?,?,?,?,?)
        `,
      [
        tujuan_id,
        sasaran_id,
        teknis_id,
        kode_indikator,
        uraian_indikator,
        status,
      ],
    );

    return result;
  },

  // ===============================
  // UPDATE
  // ===============================
  update: async (id, data) => {
    const {
      tujuan_id,
      sasaran_id,
      teknis_id,
      kode_indikator,
      uraian_indikator,
      status,
    } = data;

    const [result] = await db.query(
      `
            UPDATE indikator_kinerja

            SET

                tujuan_id=?,
                sasaran_id=?,
                teknis_id=?,
                kode_indikator=?,
                uraian_indikator=?,
                status=?

            WHERE id_indikator=?
        `,
      [
        tujuan_id,
        sasaran_id,
        teknis_id,
        kode_indikator,
        uraian_indikator,
        status,
        id,
      ],
    );

    return result;
  },

  // ===============================
  // DELETE
  // ===============================
  delete: async (id) => {
    const [result] = await db.query(
      `
            DELETE FROM indikator_kinerja
            WHERE id_indikator=?
        `,
      [id],
    );

    return result;
  },
};

module.exports = indikatorAdminModel;
