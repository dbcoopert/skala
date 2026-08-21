const db = require("../config/db");

exports.getIndikatorAll = async () => {
    const rows = db.execute(` SELECT
                id_indikator,
                uraian_indikator
            FROM indikator_kinerja
            ORDER BY id_indikator
        `);
    return rows
}