import React, { useState } from "react";
import backgroundImage from "../assets/Img/Fondo.jpeg";
import Logo from "../assets/Img/logo.png";

export const Login = () => {
  // Estado para los campos del formulario
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token en el localStorage
        localStorage.setItem("authToken", data.token); // Guardar el token

        // Decodificar el token JWT para obtener el nombre de usuario (esto puede hacerse en el cliente)
        const decoded = JSON.parse(atob(data.token.split('.')[1])); // Decodificar JWT para obtener el payload
        const userName = decoded.username; // Extraer el nombre de usuario del token

        // Guardar el nombre de usuario en el localStorage
        localStorage.setItem("username", userName);

        // Redirigir a la página de inicio o dashboard
        window.location.href = "/home"; // Asegúrate de que esta ruta esté configurada correctamente
      } else {
        setError(data.message || "Credenciales incorrectas.");
      }
    } catch (error) {
      setError("Error en la conexión con el servidor.");
    }
  };

  return (
    <>
      <div
        className="relative flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 p-6">
          <img alt="Your Company" src={Logo} className="mx-auto h-10 w-auto" />
          <h2 className="mt-10 text-center text-2xl font-medium	 tracking-tight text-gray-900">
            Iniciar Sesión
          </h2>

          {/* Mostrar mensaje de error si hay alguno */}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div>
              <label htmlFor="User" className="block text-sm font-medium text-gray-900">
                Usuario
              </label>
              <div className="mt-2">
                <input
                  id="User"
                  name="User"
                  type="text"
                  required
                  autoComplete="User"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Contraseña
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-blue hover:text-indigo-500">
                    Mayúscula inicial
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Iniciar sesión
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            ¿No sabes tu usuario o contraseña?{" "}
            <a href="#" className="font-semibold text-blue hover:text-blue">
              Pregunta al encargado
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
