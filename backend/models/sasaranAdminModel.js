const db = require('../config/db'); // Sesuaikan path dengan koneksi database lo

const sasaranAdminModel = {
    // Ambil data tujuan untuk mendapatkan base code-nya (Asumsi ada tabel tujuan)
    getTujuanById: async (id_tujuan) => {
        const [rows] = await db.query('SELECT * FROM tujuan_admin WHERE id_tujuan = ?', [id_tujuan]);
        return rows[0];
    },

    // Hitung jumlah sasaran berdasarkan id_tujuan untuk auto-increment kode
    countByTujuanId: async (id_tujuan) => {
        const [rows] = await db.query('SELECT COUNT(*) as total FROM sasaran_admin WHERE id_tujuan = ?', [id_tujuan]);
        return rows[0].total;
    },

    // Create Sasaran baru
    create: async (id_tujuan, kode_sasaran, deskripsi_sasaran) => {
        const [result] = await db.query(
            'INSERT INTO sasaran_admin (id_tujuan, kode_sasaran, deskripsi_sasaran) VALUES (?, ?, ?)',
            [id_tujuan, kode_sasaran, deskripsi_sasaran]
        );
        return result;
    },

    // Read semua Sasaran
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM sasaran_admin');
        return rows;
    },

    // Update Sasaran (Biasanya kode_sasaran tidak diupdate, hanya deskripsi/id_tujuan)
    update: async (id_sasaran, deskripsi_sasaran) => {
        const [result] = await db.query(
            'UPDATE sasaran_admin SET deskripsi_sasaran = ? WHERE id_sasaran = ?',
            [deskripsi_sasaran, id_sasaran]
        );
        return result;
    },

    // Delete Sasaran
    delete: async (id_sasaran) => {
        const [result] = await db.query('DELETE FROM sasaran_admin WHERE id_sasaran = ?', [id_sasaran]);
        return result;
    }
};

module.exports = sasaranAdminModel;