const { Pool } = require("pg");
const { CONFIG_DB } = require("../../config/db");

const pool = new Pool(CONFIG_DB);

const getEstudiantes = async (req, res) => {
  try {
    // Ejecutar la consulta para obtener todos los estudiantes con los datos relacionados
    const result = await pool.query(`
      SELECT 
      e.id_estudiante,
        e.nombre_completo,
        e.num_documento,
        e.primer_apellido,
        e.segundo_apellido,
        p.programa,
        e.tipo_documento,
        e.fecha_inicial,
        e.fecha_final
      FROM estudiantes AS e
      JOIN programa AS p ON e.id_programa = p.id_programa
    `);

    // Si se obtienen resultados, responder con los datos de los estudiantes
    if (result.rows.length > 0) {
      return res.status(200).json(result.rows); // Enviar solo los datos (no el objeto completo)
    } else {
      return res.status(404).json({ message: "No se encontraron estudiantes" });
    }
  } catch (error) {
    console.error("Error al obtener los estudiantes:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { getEstudiantes, };
 