import React, { useState, useEffect } from "react";

export const InfoAlumnos = ({ showModal, onClose, student }) => {
  const [formData, setFormData] = useState({
    nombre_completo: "",
    primer_apellido: "",
    segundo_apellido: "",
    tipo_documento: "",
    num_documento: "",
    programa: "",
    fecha_inicial: "",
    fecha_final: "",
  });

  const [error, setError] = useState("");

  // Actualizamos el estado de formData cuando cambia el estudiante
  useEffect(() => {
    if (student) {
      setFormData({
        nombre_completo: student.nombre_completo || "",
        primer_apellido: student.primer_apellido || "",
        segundo_apellido: student.segundo_apellido || "",
        tipo_documento: student.tipo_documento || "",
        num_documento: student.num_documento || "",
        programa: student.programa ? student.programa.trim() : "", // Usamos trim aquí
        fecha_inicial: student.fecha_inicial ? student.fecha_inicial.split('T')[0] : "",
        fecha_final: student.fecha_final ? student.fecha_final.split('T')[0] : "",
      });
    }
  }, [student]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanedValue = name === "programa" ? value.trim() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue,
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación de los campos requeridos
    if (!formData.nombre_completo || !formData.primer_apellido || !formData.segundo_apellido || !formData.tipo_documento || !formData.num_documento || !formData.fecha_inicial || !formData.fecha_final || !formData.programa) {
      setError("Todos los campos deben estar llenos.");
      return;
    }

    // Validación de fechas
    const fechaInicial = new Date(formData.fecha_inicial);
    const fechaFinal = new Date(formData.fecha_final);

    if (isNaN(fechaInicial.getTime()) || isNaN(fechaFinal.getTime())) {
      setError("Las fechas proporcionadas no son válidas.");
      return;
    }

    // Asegurarnos de que el id del estudiante esté presente antes de enviar
    if (!student.id_estudiante) {
      setError("ID del estudiante no disponible");
      return;
    }

    // Realizamos la solicitud PUT al backend
    fetch(`http://localhost:5000/updateEstudiantes/${student.id_estudiante}`, {
      method: "PUT",  // Enviamos los datos en una solicitud PUT
      headers: {
        "Content-Type": "application/json",  // Asegúrate de que el backend espera JSON
      },
      body: JSON.stringify(formData),  // Convierte el objeto formData en una cadena JSON
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al actualizar los datos.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Datos actualizados:", data);
        onClose();  // Cerramos el modal al recibir respuesta exitosa
      })
      .catch((error) => {
        setError(`Error al actualizar los datos: ${error.message}`);
      });
  };

  if (!student) return null;
  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center ${
          showModal ? "block" : "hidden"
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full mx-auto"
        >
          <div className="space-y-11">
            <div className="border-b border-gray-900/10 pb-11">
              <div className="flex flex-col items-center gap-y-4 sm:flex-row sm:justify-between sm:items-start">
                <div className="flex flex-col justify-center items-start">
                  <div className="flex flex-row items-center gap-x-3">
                    <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                      Editar Información
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 m-0 p-0">
                    Edita la información que deseas.
                  </p>
                </div>

                <div className="w-10">
                  <button onClick={onClose}>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              {/* Campos del formulario */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                {/* Campo de Nombres */}
                <div className="sm:col-span-1">
                  <label
                    htmlFor="nombre_completo"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Nombres
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="nombre_completo"
                      id="nombre_completo"
                      value={formData.nombre_completo}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 bg-transparent py-2 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      placeholder="Nombres completos"
                    />
                  </div>
                </div>

                {/* Primer Apellido */}
                <div className="sm:col-span-1">
                  <label
                    htmlFor="primer_apellido"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Primer Apellido
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="primer_apellido"
                      id="primer_apellido"
                      value={formData.primer_apellido}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 bg-transparent py-2 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      placeholder="Primer apellido"
                    />
                  </div>
                </div>

                {/* Segundo Apellido */}
                <div className="sm:col-span-1">
                  <label
                    htmlFor="segundo_apellido"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Segundo Apellido
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="segundo_apellido"
                      id="segundo_apellido"
                      value={formData.segundo_apellido}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 bg-transparent py-2 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      placeholder="Segundo apellido"
                    />
                  </div>
                </div>

                {/* Tipo de documento */}
                <div className="sm:col-span-1">
                  <label
                    htmlFor="tipo_documento"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Tipo de documento
                  </label>
                  <div className="mt-2">
                    <select
                      id="tipo_documento"
                      name="tipo_documento"
                      value={formData.tipo_documento}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 bg-transparent py-2 pl-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    >
                      <option value="" disabled>
                        Seleccione tipo de documento
                      </option>
                      <option value="cedula">Cédula de ciudadanía</option>
                      <option value="dni">DNI</option>
                      <option value="passport">Pasaporte</option>
                      <option value="carnet_extranjeria">
                        Carné de extranjería
                      </option>
                      <option value="licencia_conducir">
                        Licencia de conducir
                      </option>
                    </select>
                  </div>
                </div>

                {/* Número de documento */}
                <div className="sm:col-span-1">
                  <label
                    htmlFor="num_documento"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Número de documento
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="num_documento"
                      id="num_documento"
                      value={formData.num_documento}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 bg-transparent py-2 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      placeholder="Número de documento"
                    />
                  </div>
                </div>

                {/* Programa */}
                <div className="sm:col-span-1">
                  <label
                    htmlFor="programa"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Programa
                  </label>
                  <div className="mt-2">
                    <select
                      id="programa"
                      name="programa"
                      value={formData.programa}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 bg-transparent py-2 pl-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    >
                      <option value="Enfermería">Enfermería</option>
                      <option value="Psicología">Psicología</option>
                      <option value="Medicina">Medicina</option>
                      <option value="Medicina - Internos">
                        Medicina - Internos
                      </option>
                      <option value="Medicina - Residentes">
                        Medicina - Residentes
                      </option>
                      <option value="No Definido">No Definido</option>
                    </select>
                  </div>
                </div>

                {/* Fecha de Inicio */}
                <div className="sm:col-span-1">
                  <label
                    htmlFor="fecha_inicial"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Fecha de Inicio
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      name="fecha_inicial"
                      id="fecha_inicial"
                      value={formData.fecha_inicial}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 bg-transparent py-2 px-2 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Fecha Final */}
                <div className="sm:col-span-1">
                  <label
                    htmlFor="fecha_final"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Fecha Final
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      name="fecha_final"
                      id="fecha_final"
                      value={formData.fecha_final}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 bg-transparent py-2 px-2 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="flex justify-center items-center gap-x-2 bg-blue text-white text-sm py-2 px-4 rounded hover:bg-blue"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.4}
                  stroke="currentColor"
                  className="w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                <p>Actualizar Información</p>
              </button>
            </div>
          </div>
        </form>
      </div>
      
    </>
  );
};
