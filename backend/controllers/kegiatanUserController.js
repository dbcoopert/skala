const kegiatanUserModel = require("../models/kegiatanUserModel");

function getPeriodeFromTanggal(tanggal) {
  const date = new Date(`${tanggal}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const tahun = date.getFullYear();
  const bulan = date.getMonth() + 1;
  let triwulan;

  if (bulan >= 1 && bulan <= 3) {
    triwulan = 1;
  } else if (bulan >= 4 && bulan <= 6) {
    triwulan = 2;
  } else if (bulan >= 7 && bulan <= 9) {
    triwulan = 3;
  } else {
    triwulan = 4;
  }

  return {
    tahun,
    triwulan,
  };
}

exports.tambah = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Silakan login terlebih dahulu.",
      });
    }

    const id_user = req.session.user.id;

    const data = {
      ...req.body,
      id_user,
    };

    if (!data.id_indikator) {
      return res.status(400).json({
        success: false,
        message: "Indikator kinerja wajib dipilih.",
      });
    }

    if (!data.id_kegiatan_master) {
      return res.status(400).json({
        success: false,
        message: "Kegiatan master wajib dipilih.",
      });
    }

    if (!data.tanggal) {
      return res.status(400).json({
        success: false,
        message: "Tanggal kegiatan wajib diisi.",
      });
    }

    const periode = getPeriodeFromTanggal(data.tanggal);

    if (!periode) {
      return res.status(400).json({
        success: false,
        message: "Format tanggal tidak valid.",
      });
    }

    const tahunRows = await kegiatanUserModel.getTahunByTanggal(data.tanggal);

    if (tahunRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Periode Tahun ${periode.tahun} Triwulan ${periode.triwulan} belum dibuat oleh admin.`,
      });
    }

    data.id_tahun = tahunRows[0].id_tahun;

    if (!data.jam_mulai) {
      return res.status(400).json({
        success: false,
        message: "Jam mulai wajib diisi.",
      });
    }

    if (!data.jam_selesai) {
      return res.status(400).json({
        success: false,
        message: "Jam selesai wajib diisi.",
      });
    }

    if (data.jam_selesai <= data.jam_mulai) {
      return res.status(400).json({
        success: false,
        message: "Jam selesai harus lebih besar dari jam mulai.",
      });
    }

    if (!data.tempat || String(data.tempat).trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Tempat kegiatan wajib diisi.",
      });
    }

    if (!data.kegiatan || String(data.kegiatan).trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Kegiatan wajib dipilih.",
      });
    }

    const adaRTL = data.rtl && String(data.rtl).trim() !== "";

    if (adaRTL) {
      if (!data.batas_rtl) {
        return res.status(400).json({
          success: false,
          message: "Batas waktu RTL wajib diisi.",
        });
      }

      if (!data.pic_rtl || String(data.pic_rtl).trim() === "") {
        return res.status(400).json({
          success: false,
          message: "PIC RTL wajib diisi.",
        });
      }
    } else {
      data.rtl = null;
      data.batas_rtl = null;
      data.pic_rtl = null;
    }

    const result = await kegiatanUserModel.tambahModel(data);

    return res.status(201).json({
      success: true,
      message: "Kegiatan berhasil disimpan.",
      id_kegiatan: result.insertId,
      periode: {
        id_tahun: data.id_tahun,
        tahun: tahunRows[0].tahun,
        triwulan: tahunRows[0].triwulan,
      },
    });
  } catch (err) {
    console.error("ERROR TAMBAH KEGIATAN:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.detail = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Silakan login terlebih dahulu.",
      });
    }

    const id = req.params.id;
    const id_user = req.session.user.id;

    const rows = await kegiatanUserModel.detail(id, id_user);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data kegiatan tidak ditemukan atau bukan milik Anda.",
      });
    }

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("ERROR DETAIL KEGIATAN:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getSuccessKegiatan = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Silakan login terlebih dahulu.",
      });
    }

    const id = req.params.id;
    const id_user = req.session.user.id;

    const rows = await kegiatanUserModel.succesKegiatan(id, id_user);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data kegiatan tidak ditemukan atau bukan milik Anda.",
      });
    }

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("ERROR SUCCESS KEGIATAN:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
