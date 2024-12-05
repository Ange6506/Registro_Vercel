const { Pool } = require("pg");
const { CONFIG_DB } = require("../../config/db");

const pool = new Pool(CONFIG_DB);

// Mapeo de los programas a sus correspondientes ID numéricos
const programaMap = {
 "Enfermería": 1,
 "Psicología": 2,
  "Medicina": 3,
  "Medicina - Internos": 4,
  "Medicina - Residentes": 5,
  "No Definido": 6, // Añadido valor para "No Definido"
};

// Controlador para actualizar el estudiante
const updateEstudiante = async (req, res) => {
  const id_estudiante = req.params.id;  // Obtén el id del parámetro de la URL
  const {
    nombre_completo,
    primer_apellido,
    segundo_apellido,
    tipo_documento,
    num_documento,
    programa,
    fecha_inicial,
    fecha_final
  } = req.body;

  // Si no hay programa seleccionado, se asigna el ID 6 (No Definido)
  const id_programa = programa ? programaMap[programa] : programaMap["No Definido"];

  // Verificar que el id_programa sea válido
  if (!id_programa) {
    return res.status(400).json({ message: "Programa no válido." });
  }

  try {
    // Verificamos que el id_estudiante sea obligatorio
    if (!id_estudiante) {
      return res.status(400).json({ message: 'El id del estudiante es obligatorio' });
    }

    // Validamos que todos los campos requeridos estén presentes
    if (!nombre_completo || !primer_apellido || !segundo_apellido || !tipo_documento || !num_documento || !fecha_inicial || !fecha_final) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Aseguramos que las fechas estén en el formato correcto (ISO 8601)
    const fechaInicial = new Date(fecha_inicial);
    const fechaFinal = new Date(fecha_final);

    // Validar si las fechas son válidas
    if (isNaN(fechaInicial.getTime()) || isNaN(fechaFinal.getTime())) {
      return res.status(400).json({ message: 'Las fechas proporcionadas no son válidas' });
    }

    // Convertir las fechas a formato ISO 8601
    const fechaISOInicial = fechaInicial.toISOString();
    const fechaISOFinal = fechaFinal.toISOString();

    // Definimos la consulta SQL que actualizará al estudiante
    const query = `
      UPDATE estudiantes 
      SET 
        nombre_completo = $1,
        primer_apellido = $2,
        segundo_apellido = $3,
        tipo_documento = $4,
        num_documento = $5,
        id_programa = $6,   -- Se actualiza el campo id_programa con el id_programa correspondiente
        fecha_inicial = $7,
        fecha_final = $8
      WHERE id_estudiante = $9
      RETURNING *;  -- Devuelve el registro actualizado
    `;
    
    // Los valores a insertar en los parámetros de la consulta SQL
    const values = [
      nombre_completo, 
      primer_apellido, 
      segundo_apellido, 
      tipo_documento, 
      num_documento, 
      id_programa,   // Asignamos el valor correspondiente del programa
      fechaISOInicial, 
      fechaISOFinal, 
      id_estudiante   // Aseguramos que se pase el id_estudiante al WHERE
    ];

    // Ejecutamos la consulta en la base de datos
    const result = await pool.query(query, values);

    // Si no se encuentra un estudiante con ese id_estudiante
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    // Si la actualización fue exitosa, devolvemos el estudiante actualizado
    return res.status(200).json({ 
      message: 'Estudiante actualizado correctamente',
      data: result.rows[0] // El registro actualizado
    });

  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Exportamos el controlador para que pueda ser utilizado en otros archivos
module.exports = {
  updateEstudiante,
};
