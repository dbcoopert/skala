const indikatorUserModel = require("../models/indikatorUserModel")

exports.getAll = async (req, res) => {
  try {
    const [rows] = await indikatorUserModel.getIndikatorAll()
    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
