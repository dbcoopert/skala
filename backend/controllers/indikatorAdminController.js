const indikatorAdminModel = require("../models/indikatorAdminModel");

//==========================================
// GET ALL
//==========================================

const getAllIndikator = async (req, res) => {
  try {
    const data = await indikatorAdminModel.getAll();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//==========================================
// GET BY ID
//==========================================

const getIndikatorById = async (req, res) => {
  try {
    const data = await indikatorAdminModel.getById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//==========================================
// CREATE
//==========================================

const createIndikator = async (req, res) => {
  try {
    const {
      tujuan_id,
      sasaran_id,
      teknis_id,
      kode_indikator,
      uraian_indikator,
      status,
    } = req.body;

    if (
      !tujuan_id ||
      !sasaran_id ||
      !teknis_id ||
      !kode_indikator ||
      !uraian_indikator
    ) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi.",
      });
    }

    const result = await indikatorAdminModel.create({
      tujuan_id,
      sasaran_id,
      teknis_id,
      kode_indikator,
      uraian_indikator,
      status: status || "Aktif",
    });

    res.status(201).json({
      success: true,
      message: "Berhasil ditambahkan.",
      insertId: result.insertId,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//==========================================
// UPDATE
//==========================================

const updateIndikator = async (req, res) => {
  try {
    const result = await indikatorAdminModel.update(
      req.params.id,

      req.body,
    );

    if (result.affectedRows == 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Berhasil diupdate",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//==========================================
// DELETE
//==========================================

const deleteIndikator = async (req, res) => {
  try {
    const result = await indikatorAdminModel.delete(req.params.id);

    if (result.affectedRows == 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getAllIndikator,
  getIndikatorById,
  createIndikator,
  updateIndikator,
  deleteIndikator,
};
