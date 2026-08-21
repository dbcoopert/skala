const db = require('../config/db');

const tujuanAdminModel = {
    create: async (data) => {
        const query = "INSERT INTO tujuan_admin (kode_tujuan, tujuan) VALUES (?, ?)";
        const values = [data.kode_tujuan, data.tujuan];
        const [result] = await db.execute(query, values);
        return result;
    },

    findAll: async () => {
        const query = "SELECT * FROM tujuan_admin";
        const [rows] = await db.execute(query);
        return rows;
    },

    findById: async (id_tujuan) => {
        const query = "SELECT * FROM tujuan_admin WHERE id_tujuan = ?";
        const [rows] = await db.execute(query, [id_tujuan]);
        return rows[0];
    },

    update: async (id_tujuan, data) => {
        const query =
          "UPDATE tujuan_admin SET kode_tujuan = ?, tujuan = ? WHERE id_tujuan = ?";
        const values = [data.kode_tujuan, data.tujuan, id_tujuan];
        const [result] = await db.execute(query, values);
        return result;
    },

    delete: async (id_tujuan) => {
        const query = "DELETE FROM tujuan_admin WHERE id_tujuan = ?";
        const [result] = await db.execute(query, [id_tujuan]);
        return result;
    }
};

module.exports = tujuanAdminModel;