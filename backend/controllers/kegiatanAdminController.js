const kegiatanAdmin = require("../models/kegiatanAdminModel");

const kegiatanAdminController = {
  getAll: async (req, res) => {
    try {
      const [data] = await kegiatanAdmin.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const [data] = await kegiatanAdmin.getById(req.params.id);
      if (data.length === 0)
        return res.status(404).json({ message: "Data tidak tersedia" });

      // Karena ID unik, kita ambil index ke-0 langsung
      res.status(200).json(data[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { tambah_kegiatan } = req.body;
      if (!tambah_kegiatan)
        return res.status(400).json({ message: "Nama kegiatan harus diisi!" });

      const [result] = await kegiatanAdmin.create(tambah_kegiatan);

      // Balikin respon sukses sekalian sama ID yang baru kebuat
      res.status(201).json({
        message: "Berhasil ditambah",
        data: { id: result.insertId, tambah_kegiatan },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { tambah_kegiatan } = req.body;
      const [result] = await kegiatanAdmin.update(req.params.id, tambah_kegiatan);

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Data tidak tersedia" });
      res.status(200).json({ message: "Berhasil diupdate" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const [result] = await kegiatanAdmin.delete(req.params.id);

      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Data tidak tersedia" });
      res.status(200).json({ message: "Berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = kegiatanAdminController;
