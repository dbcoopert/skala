const db = require("../config/db");

const authModel = async (username) => {
  const rows = db.execute("SELECT * FROM users WHERE username=?", [username]);
  return rows;
};

module.exports = authModel;