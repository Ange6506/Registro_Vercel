const { Pool } = require("pg");
const { CONFIG_DB } = require("../../config/db");
const jwt = require('jsonwebtoken');

const pool = new Pool(CONFIG_DB);

// Función para login con verificación de contraseña en texto plano
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar el usuario por su nombre de usuario
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Usuario o contraseña incorrectos." });
    }

    const user = result.rows[0];

    // Verificar la contraseña (comparando texto plano)
    if (password !== user.password) {
      return res.status(400).json({ message: "Usuario o contraseña incorrectos." });
    }

    // Si la autenticación es correcta, generar un token JWT con solo el nombre de usuario
    const jwtSecret = process.env.JWT_SECRET || 'defaultSecretKey'; // Usar variable de entorno para la clave secreta
    const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: '1h' });

    return res.status(200).json({ message: "Autenticación exitosa", token });

  } catch (error) {
    console.error("Error al autenticar al usuario:", error);
    res.status(500).json({ message: "Error interno del servidor. Intente nuevamente más tarde." });
  }
};

module.exports = {
  loginUser,
};
