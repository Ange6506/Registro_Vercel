import React, { useState } from "react";

export const RegisterUser = () => {
  const [formData, setFormData] = useState({
    nombre: "", // Nombres
    primerApellido: "", // Primer apellido
    segundoApellido: "", // Segundo apellido
    tipoDocumento: "", // Tipo de documento
    numeroDocumento: "", // Número de documento
    programa: "", // Programa
    fechaInicio: "", // Fecha de inicio
    fechaFin: "", // Fecha final
    huella: "", // Huella digital
  });

  const [fieldAlerts, setFieldAlerts] = useState({
    nombre: "",
    primerApellido: "",
    segundoApellido: "",
    tipoDocumento: "",
    numeroDocumento: "",
    fechaInicio: "",
    fechaFin: "",
    huella: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para actualizar los valores del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Limpiar la alerta correspondiente cuando el usuario empieza a corregir el campo
    setFieldAlerts((prevState) => ({
      ...prevState,
      [name]: "",
    }));
  };

  // Función de validación de campos
  const validateForm = () => {
    const newAlerts = {};

    // Validaciones de campos requeridos
    if (!formData.nombre) {
      newAlerts.nombre = "El campo 'Nombres' es obligatorio.";
    }
    if (!formData.primerApellido) {
      newAlerts.primerApellido = "El campo 'Primer Apellido' es obligatorio.";
    }
    if (!formData.segundoApellido) {
      newAlerts.segundoApellido = "El campo 'Segundo Apellido' es obligatorio.";
    }
    if (!formData.tipoDocumento) {
      newAlerts.tipoDocumento = "El campo 'Tipo de Documento' es obligatorio.";
    }
    if (!formData.numeroDocumento) {
      newAlerts.numeroDocumento =
        "El campo 'Número de Documento' es obligatorio.";
    }

    // Validación de que nombres y apellidos no contengan números o símbolos
    const nombreApellidoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Permite letras (mayúsculas y minúsculas) y espacios
    if (formData.nombre && !nombreApellidoRegex.test(formData.nombre)) {
      newAlerts.nombre =
        "El campo 'Nombres' no puede contener números ni símbolos.";
    }
    if (
      formData.primerApellido &&
      !nombreApellidoRegex.test(formData.primerApellido)
    ) {
      newAlerts.primerApellido =
        "El campo 'Primer Apellido' no puede contener números ni símbolos.";
    }
    if (
      formData.segundoApellido &&
      !nombreApellidoRegex.test(formData.segundoApellido)
    ) {
      newAlerts.segundoApellido =
        "El campo 'Segundo Apellido' no puede contener números ni símbolos.";
    }

    // Validación de que el número de documento contenga solo números
    const numeroDocumentoRegex = /^\d+$/; // Solo dígitos
    if (
      formData.numeroDocumento &&
      !numeroDocumentoRegex.test(formData.numeroDocumento)
    ) {
      newAlerts.numeroDocumento =
        "El campo 'Número de Documento' solo puede contener números.";
    }

    // Validación de fechas si se proporcionan ambas
    if (formData.fechaInicio && formData.fechaFin) {
      const fechaInicio = new Date(formData.fechaInicio);
      const fechaFin = new Date(formData.fechaFin);

      // Verificar que la fecha de inicio no sea posterior a la fecha de fin
      if (fechaInicio > fechaFin) {
        newAlerts.fechaInicio =
          "La fecha de inicio no puede ser posterior a la fecha de fin.";
      }

      // Verificar que la fecha de fin no sea anterior a la fecha de inicio
      if (fechaFin < fechaInicio) {
        newAlerts.fechaFin =
          "La fecha de fin no puede ser anterior a la fecha de inicio.";
      }
    }

    return newAlerts;
  };

  // Función para manejar el envío del formulario con validaciones
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar los campos
    const newAlerts = validateForm();

    // Si hay alertas, no se envía el formulario
    if (Object.keys(newAlerts).length > 0) {
      setFieldAlerts(newAlerts);
      return;
    }

    // Prevenir múltiples envíos (deshabilitar el botón)
    setIsSubmitting(true);

    // Formateamos los datos para enviarlos al servidor
    const formDataToSend = {
      nombre_completo: formData.nombre,
      primer_apellido: formData.primerApellido,
      segundo_apellido: formData.segundoApellido,
      tipo_documento: formData.tipoDocumento,
      num_documento: formData.numeroDocumento,
      fecha_inicial: formData.fechaInicio || null, // Fecha de inicio opcional
      fecha_final: formData.fechaFin || null, // Fecha de fin opcional
      programa: formData.programa || null, // Programa opcional
      huella: formData.huella,
      };
      console.log("Datos a enviar al servidor:", formDataToSend);
    try {
      const response = await fetch("http://localhost:5000/registerEstudiante", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Registro exitoso!");
        // Limpiar el formulario
        setFormData({
          nombre: "",
          primerApellido: "",
          segundoApellido: "",
          tipoDocumento: "",
          numeroDocumento: "",
          programa: "",
          fechaInicio: "",
          fechaFin: "",
          huella: "",
        });
        setFieldAlerts({});
      } else {
        alert(data.message || "Error al registrar estudiante.");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error en el servidor");
    } finally {
      // Habilitar el botón después de enviar
      setIsSubmitting(false);
    }
  };


  const registerFingerprint = () => {
    // Verifica si ya existe un valor para la huella antes de enviarlo
    const huella_estudiante = "123e4567-e89b-12h3-a456-426655440006";  // Aquí deberías obtener la huella del dispositivo
  
    if (!huella_estudiante) {
      alert("Debe registrar una huella primero.");
      return;
    }
  
    fetch("http://localhost:5000/add_Huella", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ huella_estudiante }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Huella registrada exitosamente.") {
          alert("Huella registrada correctamente.");
          // Asigna la huella al estado del formulario
          setFormData((prevState) => ({
            ...prevState,
            huella: huella_estudiante,
          }));
        } else {
          alert("Error al registrar huella.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error al registrar huella.");
      });
  };
  
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-lg w-full mx-auto"
    >
      <div className="space-y-11">
        <div className="border-b border-gray-900/10 pb-11">
          <h2 className="text-base font-semibold text-gray-900">
            Registro de Estudiantes
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Asegúrate de que la información sea precisa
          </p>

          {/* Grid para los campos */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
            {/* Campo de Nombres */}
            <div className="sm:col-span-1">
              <label
                htmlFor="nombres"
                className="block text-sm font-medium text-gray-900"
              >
                Nombres
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  autoComplete="nombre"
                  className="block w-full rounded-md border border-gray-300 bg-transparent py-2 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  placeholder="Nombres completos"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
              {/* Alerta debajo del campo */}
              {fieldAlerts.nombre && (
                <p className="text-sm text-red-500 mt-1">
                  {fieldAlerts.nombre}
                </p>
              )}
            </div>

            {/* Primer Apellido */}
            <div className="sm:col-span-1">
              <label
                htmlFor="primerApellido"
                className="block text-sm font-medium text-gray-900"
              >
                Primer Apellido
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="primerApellido"
                  id="primerApellido"
                  autoComplete="primerApellido"
                  className="block w-full rounded-md border border-gray-300 bg-transparent py-2 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  placeholder="Primer apellido"
                  value={formData.primerApellido}
                  onChange={handleChange}
                />
              </div>
              {/* Alerta debajo del campo */}
              {fieldAlerts.primerApellido && (
                <p className="text-sm text-red-500 mt-1">
                  {fieldAlerts.primerApellido}
                </p>
              )}
            </div>

            {/* Segundo Apellido */}
            <div className="sm:col-span-1">
              <label
                htmlFor="segundoApellido"
                className="block text-sm font-medium text-gray-900"
              >
                Segundo Apellido
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="segundoApellido"
                  id="segundoApellido"
                  autoComplete="segundoApellido"
                  className="block w-full rounded-md border border-gray-300 bg-transparent py-2 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  placeholder="Segundo apellido"
                  value={formData.segundoApellido}
                  onChange={handleChange}
                />
              </div>
              {/* Alerta debajo del campo */}
              {fieldAlerts.segundoApellido && (
                <p className="text-sm text-red-500 mt-1">
                  {fieldAlerts.segundoApellido}
                </p>
              )}
            </div>

            {/* Tipo de documento */}
            <div className="sm:col-span-1">
              <label
                htmlFor="tipoDocumento"
                className="block text-sm font-medium text-gray-900"
              >
                Tipo de Documento
              </label>
              <div className="mt-2">
                <select
                  id="tipoDocumento"
                  name="tipoDocumento"
                  className="block w-full rounded-md border border-gray-300 bg-transparent py-2 pl-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Seleccione tipo de documento
                  </option>
                  <option value="cedula">Cédula de ciudadanía</option>
                  <option value="dni">DNI</option>
                  <option value="pasaporte">Pasaporte</option>
                  <option value="carnetExtranjeria">
                    Carné de extranjería
                  </option>
                  <option value="licenciaConducir">Licencia de conducir</option>
                </select>
              </div>
              {/* Alerta debajo del campo */}
              {fieldAlerts.tipoDocumento && (
                <p className="text-sm text-red-500 mt-1">
                  {fieldAlerts.tipoDocumento}
                </p>
              )}
            </div>

            {/* Número de documento */}
            <div className="sm:col-span-1">
              <label
                htmlFor="numeroDocumento"
                className="block text-sm font-medium text-gray-900"
              >
                Número de Documento
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="numeroDocumento"
                  id="numeroDocumento"
                  className="block w-full rounded-md border border-gray-300 bg-transparent py-2 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  placeholder="Número de documento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                />
              </div>
              {/* Alerta debajo del campo */}
              {fieldAlerts.numeroDocumento && (
                <p className="text-sm text-red-500 mt-1">
                  {fieldAlerts.numeroDocumento}
                </p>
              )}
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
                  className="block w-full rounded-md border border-gray-300 bg-transparent py-2 pl-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  value={formData.programa}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Seleccione un programa
                  </option>
                  <option value="Enfermería">Enfermería</option>
                  <option value="Psicología">Psicología</option>
                  <option value="Medicina">Medicina</option>
                  <option value="Medicina - Internos">Medicina - Internos</option>
                  <option value="Medicina - Residentes">Medicina - Residentes</option>
                  <option value="No Definido">No Definido</option>{" "}
                  {/* Nueva opción */}
                </select>
              </div>
            </div>

            {/* Fecha de Inicio */}
            <div className="sm:col-span-1">
              <label
                htmlFor="fechaInicio"
                className="block text-sm font-medium text-gray-900"
              >
                Fecha de Inicio
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="fechaInicio"
                  id="fechaInicio"
                  className="block w-full rounded-md border border-gray-300 bg-transparent py-2 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                />
              </div>
              {/* Alerta debajo del campo */}
              {fieldAlerts.fechaInicio && (
                <p className="text-sm text-red-500 mt-1">
                  {fieldAlerts.fechaInicio}
                </p>
              )}
            </div>

            {/* Fecha Final */}
            <div className="sm:col-span-1">
              <label
                htmlFor="fechaFin"
                className="block text-sm font-medium text-gray-900"
              >
                Fecha Final
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="fechaFin"
                  id="fechaFin"
                  className="block w-full rounded-md border border-gray-300 bg-transparent py-2 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  value={formData.fechaFin}
                  onChange={handleChange}
                />
              </div>
              {/* Alerta debajo del campo */}
              {fieldAlerts.fechaFin && (
                <p className="text-sm text-red-500 mt-1">
                  {fieldAlerts.fechaFin}
                </p>
              )}
            </div>

            {/* Campo de huella digital */}
            <div className="col-span-full">
              <label
              htmlFor="huella"
                className="block text-sm font-medium text-gray-900"
              >
                Registro de Huella Digital
              </label>
              <div className="mt-4 flex flex-col items-center">
                <div
                  className="w-full bg-gray-100 border-2 border-gray-300 rounded-md p-4 flex flex-col items-center justify-center text-gray-600"
                  id="huella"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-12 w-12 text-indigo-600 mb-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-sm text-gray-700 mb-2">
                    Por favor coloca tu dedo en el escáner.
                  </p>
                  <p className="text-xs text-gray-500">Esperando huella...</p>
                </div>

                {/* Botón para registrar huella */}
                <button
                  type="button"
                  id="registrar-huella"
                  className="mt-4 py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={registerFingerprint}
                >
                  Registrar Huella
                </button>

                <p className="mt-2 text-xs text-gray-500">
                  Presiona el botón para registrar tu huella.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de enviar */}
        <button
          type="submit"
          className="mt-8 w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          disabled={isSubmitting} // Deshabilitar el botón si se está enviando
        >
          {isSubmitting ? "Registrando..." : "Registrar Estudiante"}
        </button>
      </div>
    </form>
  );
};
