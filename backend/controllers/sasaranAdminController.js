const sasaranAdminModel = require("../models/sasaranAdminModel");

const sasaranAdminController = {
  // 1. CREATE (Manual Input)
  createSasaran: async (req, res) => {
    try {
      // Tangkap id_tujuan, kode_sasaran, dan deskripsi_sasaran dari request admin
      const { id_tujuan, kode_sasaran, deskripsi_sasaran } = req.body;

      // Validasi: Pastikan ketiganya nggak ada yang kosong
      if (!id_tujuan || !kode_sasaran || !deskripsi_sasaran) {
        return res.status(400).json({
          message: "Tujuan, Kode Sasaran, dan Deskripsi wajib diisi!",
        });
      }

      // Langsung simpan ke database sesuai apa yang diketik admin
      const result = await sasaranAdminModel.create(
        id_tujuan,
        kode_sasaran,
        deskripsi_sasaran,
      );

      res.status(201).json({
        message: "Berhasil membuat sasaran baru",
        data: {
          id: result.insertId,
          id_tujuan,
          kode_sasaran, // Nilai ini akan sama persis dengan yang lo ketik
          deskripsi_sasaran,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  },

  // 2. READ ALL (Tetap sama)
  getAllSasaran: async (req, res) => {
    try {
      const sasaran = await sasaranAdminModel.getAll();
      res.status(200).json({ data: sasaran });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  },

  // 3. UPDATE (Tetap sama)
  updateSasaran: async (req, res) => {
    try {
      const { id } = req.params;
      const { deskripsi_sasaran } = req.body;

      if (!deskripsi_sasaran) {
        return res
          .status(400)
          .json({ message: "deskripsi_sasaran wajib diisi" });
      }

      const result = await sasaranAdminModel.update(id, deskripsi_sasaran);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Sasaran tidak ditemukan" });
      }

      res.status(200).json({ message: "Berhasil mengupdate sasaran" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  },

  // 4. DELETE (Tetap sama)
  deleteSasaran: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await sasaranAdminModel.delete(id);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Sasaran tidak ditemukan" });
      }

      res.status(200).json({ message: "Berhasil menghapus sasaran" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
  sdmin  }
  },
};

module.exports = sasaranAdminController;
