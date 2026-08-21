const tujuanAdminModel = require("../models/tujuanAdminModel.js");

const TujuanAdminController = {
  getAll: async (req, res) => {
    try {
      const data = await tujuanAdminModel.findAll(); // Panggil findAll
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await tujuanAdminModel.findById(req.params.id); // Panggil findById
      if (!data)
        return res.status(404).json({ message: "Data tidak tersedia" });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { kode_tujuan, tujuan } = req.body;
      const result = await tujuanAdminModel.create({ kode_tujuan, tujuan }); // Panggil create
      res
        .status(201)
        .json({ message: "Berhasil ditambah", id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const result = await tujuanAdminModel.update(req.params.id, req.body); // Panggil update
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Data tidak tersedia" });
      res.status(200).json({ message: "Berhasil diupdate" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const result = await tujuanAdminModel.delete(req.params.id); // Panggil delete
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Data tidak tersedia" });
      res.status(200).json({ message: "Berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = TujuanAdminController;
