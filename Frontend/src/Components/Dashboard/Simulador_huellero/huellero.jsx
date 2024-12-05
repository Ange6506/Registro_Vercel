import React, { useState, useEffect } from "react";

export const Huellero = () => {
  const [asistencia, setAsistencia] = useState([]);
  const [registroActivo, setRegistroActivo] = useState(null);
  const [errorSalida, setErrorSalida] = useState(false);
  const id_huella = 1; // ID del estudiante simulado

  const handleRegistroAsistencia = async () => {
    try {
      let response;
      if (registroActivo) {
        // Si ya hay un registro activo, se registra la salida
        const nuevaAsistencia = {
          id_huella,
        };

        response = await fetch("http://localhost:5000/add_Asistencia", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevaAsistencia),
        });

        const data = await response.json();

        if (response.ok) {
          setAsistencia((prevAsistencia) => [
            ...prevAsistencia.filter((reg) => reg.id_asistencia !== data.id_asistencia),
            data,
          ]);
          setRegistroActivo(null);
          setErrorSalida(false); // Si sale correctamente, no hay error
        } else {
          console.error(data.message);
        }
      } else {
        // Si no hay un registro activo, se registra la entrada
        const nuevoRegistro = {
          id_huella,
        };

        response = await fetch("http://localhost:5000/add_Asistencia", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoRegistro),
        });

        const data = await response.json();

        if (response.ok) {
          setRegistroActivo(data);
          setAsistencia((prevAsistencia) => [...prevAsistencia, data]);

          // Calcular cuánto falta para la medianoche
          const ahora = new Date();
          const medianoche = new Date();
          medianoche.setHours(24, 0, 0, 0); // Establecer la hora a las 12 de la noche

          const tiempoHastaMedianoche = medianoche - ahora; // Milisegundos restantes hasta la medianoche

          // Establecer un temporizador que actúe cuando llegue la medianoche
          setTimeout(() => {
            // Registramos la salida a las 12 de la noche
            setErrorSalida(true); // Indicamos que no se registró la salida a tiempo (medianoche)
          }, tiempoHastaMedianoche); // Actuar cuando llegue la medianoche
        } else {
          console.error(data.message);
        }
      }
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
    }
  };

  return (
    <div className="huellero-container flex flex-col items-center justify-center space-y-6 p-8">
      <h2 className="text-2xl font-semibold text-indigo-700">Registro de Asistencia</h2>

      {/* Caja principal de asistencia */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* Área de huella digital */}
        <div className="flex flex-col items-center">
          <div
            className="huellero-area w-16 h-16 bg-indigo-100 border border-indigo-500 rounded-full flex items-center justify-center cursor-pointer transition-transform transform hover:scale-110"
            onClick={handleRegistroAsistencia}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-8 w-8 text-indigo-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <p className="text-sm text-gray-500 mt-3">
            {registroActivo
              ? "Haz clic nuevamente para registrar la salida."
              : "Haz clic en el huellero para registrar tu entrada."}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {registroActivo
              ? "Esperando registro de salida..."
              : "Esperando huella..."}
          </p>

          {errorSalida && (
            <p className="text-xs text-red-500 mt-2">
              No registraste la salida a tiempo.
            </p>
          )}
        </div>

        {/* Tabla de registros de asistencia */}
        <div className="asistencia-list w-full">
          <h3 className="font-semibold text-gray-700">Registros de Asistencia:</h3>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm text-gray-600 border-collapse">
              <thead>
                <tr className="bg-indigo-50 text-left">
                  <th className="py-2 px-3 text-indigo-600">Entrada</th>
                  <th className="py-2 px-3 text-indigo-600">Salida</th>
                </tr>
              </thead>
              <tbody>
                {asistencia.map((registro) => (
                  <tr key={registro.id_asistencia} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">
                      {new Date(registro.fecha_hora_entrada).toLocaleString()}
                    </td>
                    <td className="py-2 px-3">
                      {registro.fecha_hora_salida
                        ? new Date(registro.fecha_hora_salida).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
