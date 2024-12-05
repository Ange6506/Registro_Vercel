const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ methods: "GET, HEAD ,PUT ,PATCH ,POST ,DELETE" }));
app.use(bodyParser.json());

// Configuracion de rutas.
const userRoutes = require("./src/routes/user.routes");
app.use("/", userRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
