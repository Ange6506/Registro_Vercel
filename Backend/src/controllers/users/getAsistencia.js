const { Pool } = require("pg");
const { CONFIG_DB } = require("../../config/db");

const pool = new Pool(CONFIG_DB);

const getAsistencia = async (req, res) => {
  try {
    // Ejecutar la consulta para obtener todos los estudiantes y sus asistencias
    const result = await pool.query(`
   SELECT 
  e.nombre_completo || ' ' || e.primer_apellido || ' ' || e.segundo_apellido AS nombre_completo, 
  e.num_documento,
  p.programa,
  e.fecha_inicial,
  e.fecha_final,
  a.fecha_hora_entrada,
  a.fecha_hora_salida
FROM estudiantes AS e
JOIN programa AS p ON e.id_programa = p.id_programa
JOIN asistencia AS a ON e.id_estudiante = a.id_estudiante
ORDER BY a.fecha_hora_entrada;

    `);

    // Si se obtienen resultados, responder con los datos de los estudiantes y sus asistencias
    if (result.rows.length > 0) {
      return res.status(200).json(result.rows); // Enviar solo los datos (no el objeto completo)
    } else {
      return res
        .status(404)
        .json({ message: "No se encontraron estudiantes o asistencias" });
    }
  } catch (error) {
    console.error("Error al obtener los estudiantes:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { getAsistencia };
