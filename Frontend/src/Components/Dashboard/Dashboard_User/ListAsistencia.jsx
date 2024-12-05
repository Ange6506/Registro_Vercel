import React, { useState, useEffect } from "react";

export const ListAsistencia = () => {
  const [studentsData, setStudentsData] = useState([]); // Estado para los datos de los estudiantes
  const [searchTerm, setSearchTerm] = useState(""); // Estado para la búsqueda por nombre o cédula
  const [filteredStudents, setFilteredStudents] = useState([]); // Lista filtrada de estudiantes
  const [selectedDate, setSelectedDate] = useState(""); // Estado para la fecha seleccionada
  const [selectedProgram, setSelectedProgram] = useState(""); // Estado para el programa seleccionado

  // Fetch data when the component mounts
  useEffect(() => {
    fetch("http://localhost:5000/getAsistencia")
      .then((response) => response.json()) // Convierte la respuesta en JSON
      .then((data) => {
        setStudentsData(data); // Guarda los datos en el estado
        setFilteredStudents(data); // Inicializa la lista filtrada con todos los datos
      })
      .catch((error) => {
        console.error("Error al obtener los estudiantes:", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterStudents(value, selectedDate, selectedProgram);
  };

  const handleProgramChange = (event) => {
    const program = event.target.value;
    setSelectedProgram(program);
    filterStudents(searchTerm, selectedDate, program);
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date); // Establecer la fecha seleccionada
    filterStudents(searchTerm, date, selectedProgram); // Filtrar estudiantes según la nueva fecha seleccionada
  };

  const filterStudents = (nameOrCedula, date, program) => {
    const filtered = studentsData.filter((student) => {
      // Filtro por nombre o cédula
      const nameMatch =
        student.nombre_completo
          .toLowerCase()
          .includes(nameOrCedula.toLowerCase()) ||
        student.num_documento.includes(nameOrCedula);

      // Filtro por programa (comparación insensible a mayúsculas/minúsculas y eliminando espacios)
      const programMatch = program
        ? student.programa.trim().toLowerCase() === program.trim().toLowerCase()
        : true;

      // Filtro por fecha (si se seleccionó una fecha específica)
      const attendanceDateMatch = date
        ? formatDate(student.fecha_hora_entrada) === formatDate(date)
        : true;

      return nameMatch && programMatch && attendanceDateMatch;
    });

    setFilteredStudents(filtered);
  };

  // Función para formatear la fecha a 'YYYY-MM-DD'
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Devuelve la fecha en formato 'YYYY-MM-DD'
  };

  // Función para formatear la fecha y hora en el formato 'YYYY-MM-DD HH:MM'
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const printTable = () => {
    // Obtén el contenido de la tabla
    const tableContent = document.getElementById("table-to-print").outerHTML;

    // Crea un iframe oculto para manejar la impresión
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden'; // Asegura que el iframe sea invisible
    document.body.appendChild(iframe);

    // Obtén el documento dentro del iframe
    const iframeDoc = iframe.contentWindow.document;

    // Elimina cualquier contenido predeterminado y asegura que el documento sea completamente limpio
    iframeDoc.open();  // Abre un nuevo documento completamente vacío
    iframeDoc.write(`
      <html>
        <head>
          <style>
            /* Eliminar cualquier margen, borde, o estilo predeterminado */
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
              width: 100%;
              font-family: Arial, sans-serif;
              background-color: white;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 8px;
              text-align: left;
              border: 1px solid #ddd;
              font-size: 10px;
            }
            th {
              background-color: #f4f4f4;
            }
            h1 {
              font-size: 24px;
              text-align: center;
              margin-bottom: 20px;
            }
            .date {
              text-align: right;
              margin-top: 10px;
              font-size: 12px;
              color: #333;
            }
          </style>
        </head>
        <body>
          <h1>Lista de Asistencia</h1>
          ${tableContent}
          <div class="date">Fecha: ${new Date().toLocaleString()}</div>
        </body>
      </html>
    `);
    iframeDoc.close();

    // Llama al método print() en el iframe para imprimir su contenido
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // Elimina el iframe después de la impresión
    document.body.removeChild(iframe);
};



  
  return (
    <section
      className="container p-4 mx-auto flex flex-col"
      style={{ minHeight: "87vh" }}
    >
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto bg-white">
        <div>
          <div className="flex flex-col items-center gap-y-4 sm:flex-row sm:justify-between sm:items-start">
            <div className="flex flex-col justify-center items-start">
              <div className="flex flex-row items-center gap-x-3">
                <h2 className="font-medium py-2 text-xl font-medium font-serif font-bold text-blue">
                  Lista de Asistencia
                </h2>
              </div>
            </div>

            <div className="w-full md:w-80">
              <div className="flex items-center">
                <span className="absolute">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mx-3 text-blue"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Búsqueda por Nombre o Cédula"
                  className="w-full py-2.5 md:py-1 text-gray-700 placeholder-gray-400/70 bg-white border border-blue rounded-lg pl-11 pr-5 focus:border-DarkSlate focus:ring-emerald-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-4 mt-6 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-4">
            {/* Filtro por programa */}
            <div className="flex flex-col w-32 sm:w-auto">
              <label className="text-sm text-gray-700">Programa</label>
              <select
                value={selectedProgram}
                onChange={handleProgramChange}
                className="w-full py-2 px-2 text-gray-700 bg-white border border-blue rounded-lg focus:outline-none text-sm"
              >
                <option value="">Seleccionar Programa</option>
                <option value="Enfermería">Enfermería</option>
                <option value="Psicología">Psicología</option>
                <option value="Medicina">Medicina</option>
                <option value="Medicina - Internos">Medicina - Internos</option>
                <option value="Medicina - Residentes">
                  Medicina - Residentes
                </option>
              </select>
            </div>

            {/* Filtro por fecha */}
            <div className="flex flex-col w-32 sm:w-auto">
              <label className="text-sm text-gray-700">
                Fecha de Asistencia
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full py-2 px-2 text-gray-700 bg-white border border-blue rounded-lg focus:outline-none text-sm"
              />
            </div>
            <div className="flex w-full sm:w-auto  justify-end mt-6 ml-auto">
              <button
                onClick={printTable}
                className="px-6 py-2 text-gray-700 bg-white border border-blue rounded-lg focus:outline-none text-sm flex items-center"
              >
                Imprimir
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between flex-1 mt-6">
            <div className="flex flex-col">
              <div className="-mx-4 -my-2 overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle md:px-5 lg:px-4">
                  <div className="overflow-hidden border border-blue dark:border-blue md:rounded-lg bg-blue">
                    <table id="table-to-print" className="min-w-full divide-y divide-blue dark:divide-blue">
                      <thead className="bg-DarkSlate dark:bg-gray-800">
                        <tr>
                          <th className="px-3 py-3.5 text-sm font-normal text-left rtl:text-right text-white">
                            Nombre Completo
                          </th>
                          <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-white">
                            Nº Cédula
                          </th>
                          <th className="px-4 py-3.5 md:px-6 md:py-4 text-sm font-normal text-left rtl:text-right text-white">
                            Fecha y Hora Entrada
                          </th>
                          <th className="px-4 py-3.5 md:px-6 md:py-4 text-sm font-normal text-left rtl:text-right text-white">
                            Fecha y Hora Salida
                          </th>
                          <th className="px-6 py-4 text-sm font-normal text-left rtl:text-right text-white">
                            Programa
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-blue dark:divide-blue dark:bg-blue">
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student, index) => (
                            <tr key={index}>
                              <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                {student.nombre_completo}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                {student.num_documento}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                {formatDateTime(student.fecha_hora_entrada)}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                {student.fecha_hora_salida
                                  ? formatDateTime(student.fecha_hora_salida)
                                  : "No se registró Salida"}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                {student.programa}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="6"
                              className="text-center py-4 text-sm text-gray-500"
                            >
                              No se encontraron resultados
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
