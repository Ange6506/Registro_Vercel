const { Pool } = require("pg");
const { CONFIG_DB } = require("../../config/db");
const cron = require("node-cron"); // Importamos la librería para tareas programadas

const pool = new Pool(CONFIG_DB);

// Configuración del cron job para ejecutar la tarea cada minuto
cron.schedule('* * * * *', async () => {
  try {
    console.log('Verificando entradas activas...');


    // Buscamos todos los registros con entrada activa y que hayan pasado más de 1 minuto
    const query = `
      SELECT id_asistencia, id_estudiante, fecha_hora_entrada
      FROM asistencia
      WHERE estado = true AND fecha_hora_entrada < NOW() - INTERVAL '1 minute'
    `;
    const result = await pool.query(query);

    if (result.rows.length > 0) {
      result.rows.forEach(async (registro) => {
        const { id_asistencia, fecha_hora_entrada } = registro;
        
        // Actualizamos el estado a false y dejamos fecha_hora_salida como NULL
        const updateQuery = `
          UPDATE asistencia
          SET estado = false, fecha_hora_salida = NULL
          WHERE id_asistencia = $1
          RETURNING id_asistencia, fecha_hora_entrada, fecha_hora_salida
        `;
        const updateValues = [id_asistencia];
        const updatedRegistro = await pool.query(updateQuery, updateValues);
        console.log(`Actualizado: Registro de entrada marcado como false. ID: ${updatedRegistro.rows[0].id_asistencia}`);
      });
    } else {
      console.log('No hay registros para actualizar.');
    }

  } catch (error) {
    console.error('Error al verificar entradas activas:', error);
  }
});

// Función para registrar entrada o salida
const addAsistencia = async (req, res) => {
  const { id_huella } = req.body; // Recibimos el ID de huella del estudiante

  try {
    console.log("Solicitud recibida con datos:", req.body);

    // Primero, buscamos al estudiante por el ID de huella
    const resultEstudiante = await pool.query(
      "SELECT id_estudiante FROM estudiantes WHERE id_huella = $1",
      [id_huella]
    );

    if (resultEstudiante.rows.length === 0) {
      return res.status(400).json({ message: "Estudiante no encontrado." });
    }

    const idEstudiante = resultEstudiante.rows[0].id_estudiante;

    // Buscamos si hay un registro de entrada activo para este estudiante
    const resultEntradaActiva = await pool.query(
      "SELECT id_asistencia, estado, fecha_hora_entrada, fecha_hora_salida FROM asistencia WHERE id_estudiante = $1 AND estado = true ORDER BY fecha_hora_entrada DESC LIMIT 1",
      [idEstudiante]
    );

    if (resultEntradaActiva.rows.length > 0) {
      // Si ya existe un registro con estado=true, significa que el estudiante está en su entrada activa.
      const registro = resultEntradaActiva.rows[0];

      // Si el estudiante quiere registrar la salida y aún no ha pasado el minuto
      if (registro.fecha_hora_salida === null) {
        const fechaHoraSalida = new Date(); // Fecha y hora de salida

        // Actualizamos el registro de entrada con la fecha de salida
        const updateQuery = `
          UPDATE asistencia
          SET estado = false, fecha_hora_salida = $1
          WHERE id_asistencia = $2
          RETURNING id_asistencia, fecha_hora_entrada, fecha_hora_salida
        `;
        const updateValues = [fechaHoraSalida, registro.id_asistencia];
        const updatedRegistro = await pool.query(updateQuery, updateValues);

        return res.status(200).json({
          message: "Salida registrada exitosamente.",
          id_asistencia: updatedRegistro.rows[0].id_asistencia,
          fecha_hora_entrada: updatedRegistro.rows[0].fecha_hora_entrada,
          fecha_hora_salida: updatedRegistro.rows[0].fecha_hora_salida,
        });
      } else {
        // Si el estudiante ya registró la salida (no es null) o el cron job ya actualizó el estado
        return res.status(400).json({
          message: "Ya se registró la salida o no es posible registrar la salida a tiempo.",
        });
      }
    } else {
      // Si no hay un registro activo, significa que no hay una entrada registrada
      // Registramos una nueva entrada para este estudiante
      const fechaHoraEntrada = new Date(); // Fecha y hora de entrada

      const insertQuery = `
        INSERT INTO asistencia (fecha_hora_entrada, estado, id_estudiante)
        VALUES ($1, $2, $3)
        RETURNING id_asistencia, fecha_hora_entrada
      `;
      const insertValues = [fechaHoraEntrada, true, idEstudiante];
      const resultInsert = await pool.query(insertQuery, insertValues);

      return res.status(201).json({
        message: "Entrada registrada exitosamente.",
        id_asistencia: resultInsert.rows[0].id_asistencia,
        fecha_hora_entrada: resultInsert.rows[0].fecha_hora_entrada,
      });
    }
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: "Error en el servidor.", error: error.message });
  }
};

module.exports = {
  addAsistencia,
};
