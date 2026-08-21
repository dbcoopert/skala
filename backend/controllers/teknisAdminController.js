// controllers/TeknisControllers.js
const Teknis = require("../models/Teknismodel");

// GET ALL DATA (getSemua)
exports.getSemua = async (req, res) => {
  try {
    const data = await Teknis.getAll();
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET DATA BY ID (getDetail)
exports.getDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Teknis.getById(id);

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan!" });
    }

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE DATA (tambah)
exports.tambah = async (req, res) => {
  try {
    const { teknis } = req.body;

    if (!teknis) {
      return res.status(400).json({
        success: false,
        message: "Field 'teknis' tidak boleh kosong!",
      });
    }

    const result = await Teknis.create(teknis);
    res.status(201).json({
      success: true,
      message: "Data berhasil ditambahkan!",
      insertId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE DATA (ubah)
exports.ubah = async (req, res) => {
  try {
    const { id } = req.params;
    const { teknis } = req.body;

    if (!teknis) {
      return res.status(400).json({
        success: false,
        message: "Field 'teknis' tidak boleh kosong!",
      });
    }

    const result = await Teknis.update(id, teknis);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan atau tidak ada perubahan!",
      });
    }

    res.status(200).json({ success: true, message: "Data berhasil diupdate!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE DATA (hapus)
exports.hapus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Teknis.delete(id);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan!" });
    }

    res.status(200).json({ success: true, message: "Data berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
