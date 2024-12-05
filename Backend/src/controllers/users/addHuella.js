const { Pool } = require("pg");
const { CONFIG_DB } = require("../../config/db");

const pool = new Pool(CONFIG_DB);

// Función para registrar la huella digital
const addHuella = async (req, res) => {
  const { huella_estudiante } = req.body; // `huella_estudiante` es el ID del estudiante

  // Verifica que el `huella_estudiante` esté presente
  if (!huella_estudiante) {
    return res.status(400).json({ message: "Faltan datos requeridos." });
  }

  try {
    // Verifica si la huella ya está registrada para el estudiante
    const checkQuery = `SELECT * FROM huella WHERE huella_estudiante = $1 LIMIT 1;`;
    const checkValues = [huella_estudiante];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "La huella ya está registrada." });
    }

    // Inserta el `huella_estudiante` en la base de datos
    const insertQuery = `
      INSERT INTO huella (huella_estudiante)
      VALUES ($1)
      RETURNING id_huella;
    `;
    const insertValues = [huella_estudiante]; // Solo se inserta el ID del estudiante

    // Ejecuta la consulta para insertar la huella
    const result = await pool.query(insertQuery, insertValues);

    // Devuelve la respuesta con el ID de la huella registrada
    return res.status(201).json({
      message: "Huella registrada exitosamente.",
      huellaId: result.rows[0].id_huella,  // El ID de la huella registrada
    });
  } catch (err) {
    console.error("Error al registrar la huella:", err);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  addHuella,
};
