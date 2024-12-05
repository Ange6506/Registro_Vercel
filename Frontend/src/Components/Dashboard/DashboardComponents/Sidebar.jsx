import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

export const Sidebar = ({ contenido, setContenido }) => {
  const [username, setUsername] = useState("");  // Estado para el nombre de usuario
  const navigate = useNavigate(); // useNavigate para redirección

  useEffect(() => {
    // Recuperamos el nombre de usuario desde localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername); // Establecer el nombre de usuario
    } else {
      // Si no hay nombre de usuario en localStorage, redirigimos al login
      navigate("/");  // Asegúrate de tener configurada la ruta en React Router
    }
  }, [navigate]);

  // Función para cerrar sesión
  const handleLogout = () => {
    // Eliminar los datos de autenticación del localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");

    // Redirigir al usuario a la página de login
    navigate("/");  // Asegúrate de que esta ruta esté configurada correctamente
  };

  return (
    <>
      <ul className="flex flex-col gap-y-2">
        {/* Si el usuario es Administrador, mostramos estas opciones */}
        {username === "Administrador" && (
          <>
            <li>
              <button
                className="flex items-center px-4 py-2 text-violet transition hover:bg-gray-100 hover:text-Purple rounded-md w-full"
                onClick={() => setContenido("Registro")}
              >
                <span className="mx-4 text-md font-medium">Registrar Alumno</span>
              </button>
            </li>

            <li>
              <button
                className="flex items-center px-4 py-2 text-violet transition hover:bg-gray-100 hover:text-Purple rounded-md w-full"
                onClick={() => setContenido("Lista_Alumnos")}
              >
                <span className="mx-4 text-md font-medium">Lista de Alumnos</span>
              </button>
            </li>

            <li>
              <button
                className="flex items-center px-4 py-2 text-violet transition hover:bg-gray-100 hover:text-Purple rounded-md w-full"
                onClick={() => setContenido("Huellero")}
              >
                <span className="mx-4 text-md font-medium">Huellero</span>
              </button>
            </li>
          </>
        )}

        {/* Si el usuario es Usuario, mostramos estas opciones */}
        {username === "Usuario" && (
          <>
          <li>
              <button
                className="flex items-center px-4 py-2 text-violet transition hover:bg-gray-100 hover:text-Purple rounded-md w-full"
                onClick={() => setContenido("Lista_Asistencia")}
              >
                <span className="mx-4 text-md font-medium">Lista de Asistencia</span>
              </button>
            </li>
            
            <li>
              <button
                className="flex items-center px-4 py-2 text-violet transition hover:bg-gray-100 hover:text-Purple rounded-md w-full"
                onClick={() => setContenido("Lista_Alumnos")}
              >
                <span className="mx-4 text-md font-medium">Lista de Alumnos</span>
              </button>
            </li>

            
          </>
        )}
      </ul>

      <ul className="p-4">
        <div className="flex items-center gap-x-2">
          <div className="relative">
            <img
              className="object-cover w-8 h-8 rounded-full ring ring-gray-300"
              src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=880&h=880&q=100"
              alt="Perfil"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white"></span>
          </div>

          <div className="px-2 border-x border-gray-300">
            <h1 className="text-base text-gray-700 capitalize">
              Hola, <span className="text-Violet">{username}</span>
            </h1>
          </div>

          <button onClick={handleLogout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
              />
            </svg>
          </button>
        </div>
      </ul>
    </>
  );
};
