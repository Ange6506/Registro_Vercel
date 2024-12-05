const { Pool } = require("pg");
const { CONFIG_DB } = require("../../config/db");

const pool = new Pool(CONFIG_DB);

const deleteEstudiante = async (req, res) => {
  const { num_documento } = req.params;  // El número de documento se recibe como parámetro en la URL

  try {
    // Verificamos si el estudiante existe y obtenemos el id_huella asociado
    const checkStudentQuery = "SELECT id_estudiante, id_huella FROM estudiantes WHERE num_documento = $1";
    const { rows } = await pool.query(checkStudentQuery, [num_documento]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Estudiante no encontrado." });
    }

    const { id_estudiante, id_huella } = rows[0];

    // Eliminar las entradas de asistencia relacionadas con el estudiante
    const deleteAsistenciaQuery = "DELETE FROM asistencia WHERE id_estudiante = $1";
    await pool.query(deleteAsistenciaQuery, [id_estudiante]);

    // Primero, eliminamos el estudiante
    const deleteStudentQuery = "DELETE FROM estudiantes WHERE num_documento = $1";
    await pool.query(deleteStudentQuery, [num_documento]);

    // Ahora eliminamos la huella si existe
    if (id_huella !== null) {
      const deleteHuellaQuery = "DELETE FROM huella WHERE id_huella = $1";
      await pool.query(deleteHuellaQuery, [id_huella]);
    }

    return res.status(200).json({ message: "Estudiante, su huella y asistencias eliminados correctamente." });
  } catch (err) {
    console.error("Error al eliminar estudiante:", err);
    return res.status(500).json({ message: "Error al eliminar estudiante." });
  }
};



module.exports = { deleteEstudiante };
