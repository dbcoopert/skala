// models/teknisModel.js
const db = require('../config/db');

const Teknis = {
    // Ambil semua data
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM teknis');
        return rows;
        //  ORDER BY id_teknis DESC
    },

    // Ambil satu data berdasarkan ID
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM teknis WHERE id_teknis = ?', [id]);
        return rows[0];
    },
    
    // Tambah data baru
    create: async (teknis) => {
        const [result] = await db.query('INSERT INTO teknis (teknis) VALUES (?)', [teknis]);
        return result;
    },

    // Update data berdasarkan ID
    update: async (id, teknis) => {
        const [result] = await db.query('UPDATE teknis SET teknis = ? WHERE id_teknis = ?', [teknis, id]);
        return result;
    },

    // Hapus data berdasarkan ID
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM teknis WHERE id_teknis = ?', [id]);
        return result;
    }
};

module.exports = Teknis;