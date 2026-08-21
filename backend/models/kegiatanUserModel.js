const db = require("../config/db");

const kegiatanUserModel = {
  // =====================================================
  // CARI TAHUN BERDASARKAN TANGGAL
  //
  // Contoh:
  //
  // tanggal = 2026-08-19
  //
  // tahun = 2026
  // bulan = 8
  // triwulan = 3
  //
  // Akan mencari:
  //
  // tahun = 2026
  // triwulan = 3
  // =====================================================

  getTahunByTanggal: async (tanggal) => {
    const date = new Date(tanggal);

    if (Number.isNaN(date.getTime())) {
      return [];
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

    const [rows] = await db.execute(
      `
      SELECT
        id_tahun,
        tahun,
        triwulan,
        keterangan
      FROM tahun
      WHERE
        tahun = ?
        AND triwulan = ?
      LIMIT 1
      `,
      [tahun, triwulan],
    );

    return rows;
  },

  // =====================================================
  // TAMBAH KEGIATAN
  // =====================================================

  tambahModel: async (data) => {
    const [result] = await db.execute(
      `
      INSERT INTO kegiatan
      (
        id_user,
        id_indikator,
        id_kegiatan_master,
        id_tahun,
        tanggal,
        jam_mulai,
        jam_selesai,
        tempat,
        kegiatan,
        detail_survei,
        judul,
        uraian,
        hasil,
        kendala,
        solusi,
        rtl,
        batas_rtl,
        pic_rtl
      )
      VALUES
      (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
      `,
      [
        data.id_user,
        data.id_indikator,
        data.id_kegiatan_master || null,
        data.id_tahun,
        data.tanggal,
        data.jam_mulai,
        data.jam_selesai,
        data.tempat,
        data.kegiatan,
        data.detail_survei || null,
        data.judul || null,
        data.uraian || null,
        data.hasil || null,
        data.kendala || null,
        data.solusi || null,
        data.rtl || null,
        data.batas_rtl || null,
        data.pic_rtl || null,
      ],
    );

    return result;
  },

  // =====================================================
  // DETAIL KEGIATAN
  //
  // HANYA MILIK USER YANG LOGIN
  // =====================================================

  detail: async (id, id_user) => {
    const [rows] = await db.execute(
      `
      SELECT
        k.id_kegiatan,
        k.id_user,
        k.id_indikator,
        k.id_kegiatan_master,
        k.id_tahun,

        k.tanggal,
        DATE_FORMAT(
          k.tanggal,
          '%d-%m-%Y'
        ) AS tanggal_format,

        k.jam_mulai,
        k.jam_selesai,
        k.tempat,

        k.kegiatan,
        k.detail_survei,
        k.judul,
        k.uraian,
        k.hasil,
        k.kendala,
        k.solusi,

        k.rtl,
        k.batas_rtl,

        DATE_FORMAT(
          k.batas_rtl,
          '%d-%m-%Y'
        ) AS batas_rtl_format,

        k.pic_rtl,

        t.tahun,
        t.triwulan,
        t.keterangan AS keterangan_tahun,

        u.nama,
        u.role,

        i.uraian_indikator AS indikator,

        ka.tambah_kegiatan AS kegiatan_master

      FROM kegiatan k

      INNER JOIN users u
        ON k.id_user = u.id_user

      INNER JOIN indikator_kinerja i
        ON k.id_indikator = i.id_indikator

      INNER JOIN tahun t
        ON k.id_tahun = t.id_tahun

      LEFT JOIN kegiatan_admin ka
        ON k.id_kegiatan_master = ka.id_kegiatan

      WHERE
        k.id_kegiatan = ?
        AND k.id_user = ?

      LIMIT 1
      `,
      [id, id_user],
    );

    return rows;
  },

  // =====================================================
  // DETAIL SUKSES KEGIATAN
  //
  // SEKALIGUS MENGHITUNG DOKUMENTASI
  // =====================================================

  succesKegiatan: async (id, id_user) => {
    const [rows] = await db.execute(
      `
      SELECT
        k.id_kegiatan,
        k.id_user,
        k.id_indikator,
        k.id_kegiatan_master,
        k.id_tahun,

        k.judul,
        k.kegiatan,

        k.tanggal,

        DATE_FORMAT(
          k.tanggal,
          '%d-%m-%Y'
        ) AS tanggal_format,

        k.jam_mulai,
        k.jam_selesai,
        k.tempat,

        k.uraian,
        k.hasil,
        k.kendala,
        k.solusi,

        k.rtl,
        k.batas_rtl,

        DATE_FORMAT(
          k.batas_rtl,
          '%d-%m-%Y'
        ) AS batas_rtl_format,

        k.pic_rtl,

        t.tahun,
        t.triwulan,
        t.keterangan AS keterangan_tahun,

        ik.uraian_indikator,

        ka.tambah_kegiatan AS kegiatan_master,

        u.nama,
        u.NIP,
        u.ttd,
        u.role,

        COUNT(
          dk.id_dokumentasi
        ) AS jumlah_foto

      FROM kegiatan k

      INNER JOIN indikator_kinerja ik
        ON k.id_indikator = ik.id_indikator

      INNER JOIN users u
        ON k.id_user = u.id_user

      INNER JOIN tahun t
        ON k.id_tahun = t.id_tahun

      LEFT JOIN kegiatan_admin ka
        ON k.id_kegiatan_master = ka.id_kegiatan

      LEFT JOIN dokumentasi_kegiatan dk
        ON k.id_kegiatan = dk.id_kegiatan

      WHERE
        k.id_kegiatan = ?
        AND k.id_user = ?

      GROUP BY
        k.id_kegiatan,
        k.id_user,
        k.id_indikator,
        k.id_kegiatan_master,
        k.id_tahun,

        k.judul,
        k.kegiatan,
        k.tanggal,

        k.jam_mulai,
        k.jam_selesai,
        k.tempat,

        k.uraian,
        k.hasil,
        k.kendala,
        k.solusi,

        k.rtl,
        k.batas_rtl,
        k.pic_rtl,

        t.tahun,
        t.triwulan,
        t.keterangan,

        ik.uraian_indikator,

        ka.tambah_kegiatan,

        u.nama,
        u.NIP,
        u.ttd,
        u.role

      LIMIT 1
      `,
      [id, id_user],
    );

    return rows;
  },
};

module.exports = kegiatanUserModel;
