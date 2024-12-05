const { Pool } = require("pg");
const { CONFIG_DB } = require("../../config/db");

const pool = new Pool(CONFIG_DB);

const addUser = async (req, res) => {
  const { id_rol, username, password } = req.body;

  try {
    const insertQuery =
      "INSERT INTO usuarios (id_rol, username, password) values ($1, $2, $3)";

    const insertValues = [id_rol, username, password];

    const result = await pool.query(insertQuery, insertValues);

    return res.status(201).json({ message: "Registro de usuario exitoso." });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  addUser,
};
