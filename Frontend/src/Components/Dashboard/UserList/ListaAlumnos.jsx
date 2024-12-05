import React, { useState, useEffect } from "react";
import { InfoAlumnos } from "./InfoAlumnos";

export const ListaAlumnos = () => {
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [selectedStudent, setSelectedStudent] = useState(null); // Estado para almacenar el estudiante seleccionado
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [filteredStudents, setFilteredStudents] = useState([]); // Lista de estudiantes filtrados
  const [studentsData, setStudentsData] = useState([]); // Lista de todos los estudiantes
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Estado para controlar la ventana de confirmación

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/get_estudiante");
        const data = await response.json();
        setStudentsData(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []); // Solo se ejecuta una vez al montar el componente

  // Función para abrir el modal y seleccionar el estudiante
  const handleShowModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Manejar cambio de búsqueda
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filtrar los estudiantes por nombre o número de cédula
    const filtered = studentsData.filter(
      (student) =>
        student.nombre_completo.toLowerCase().includes(value.toLowerCase()) ||
        student.num_documento.includes(value)
    );

    setFilteredStudents(filtered); // Actualizar la lista filtrada
  };

  // Función para mostrar "Fecha no registrada" si la fecha está vacía o no es válida
  const formatFecha = (fecha) => {
    if (!fecha || fecha === "0000-00-00") {
      return "Fecha no registrada";
    }
    return new Date(fecha).toLocaleDateString("es-ES");
  };

  // Función para eliminar el estudiante
  const handleDeleteStudent = async (num_documento) => {
    try {
      const response = await fetch(`http://localhost:5000/deletestudent/${num_documento}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Si la eliminación fue exitosa, actualizamos la lista de estudiantes
        setFilteredStudents(filteredStudents.filter(student => student.num_documento !== num_documento));
        alert("Estudiante eliminado correctamente");
      } else {
        alert("Error al eliminar estudiante");
      }
    } catch (error) {
      console.error("Error al eliminar estudiante:", error);
      alert("Error al eliminar estudiante");
    }
  };

  // Función para abrir el modal de confirmación
  const openConfirmModal = (student) => {
    setSelectedStudent(student);
    setShowConfirmModal(true);
  };

  // Función para cerrar el modal de confirmación
  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedStudent(null);
  };

  // Función para confirmar la eliminación
  const confirmDelete = () => {
    if (selectedStudent) {
      handleDeleteStudent(selectedStudent.num_documento);
      closeConfirmModal(); // Cerrar el modal de confirmación después de eliminar
    }
  };

  return (
    <section className="container p-4 mx-auto flex flex-col" style={{ minHeight: "87vh" }}>
      <div className="p-8 rounded-lg shadow-lg w-full mx-auto bg-white">
        {/* ... */}
        <div className="flex flex-col justify-between flex-1">
          <div className="flex flex-col mt-6">
            <div className="-mx-4 -my-2 overflow-x-auto">
              <div className="inline-block min-w-full py-2 align-middle md:px-5 lg:px-4">
                <div className="overflow-hidden border border-blue dark:border-blue md:rounded-lg bg-blue">
                  <table className="min-w-full divide-y divide-blue dark:divide-blue">
                    <thead className="bg-DarkSlate dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-3 py-3.5 text-sm font-normal text-left rtl:text-right text-white">
                          <div className="flex justify-center items-center gap-x-3">
                            <button>
                              <span>Nombre Completo</span>
                            </button>
                          </div>
                        </th>
                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-white">
                          <div className="flex justify-center items-center gap-x-3">
                            <button>
                              <span> Nº Cédula</span>
                            </button>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-4 text-sm font-normal text-left rtl:text-right text-white">
                          <div className="flex justify-center items-center gap-x-2">
                            <button>
                              <span>Programas</span>
                            </button>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-4 text-sm font-normal text-left rtl:text-right text-white">
                          <div className="flex justify-center items-center gap-x-2">
                            <button>
                              <span>Fecha Inicio</span>
                            </button>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-4 text-sm font-normal text-left rtl:text-right text-white">
                          <div className="flex justify-center items-center gap-x-2">
                            <button>
                              <span>Fecha Final</span>
                            </button>
                          </div>
                        </th>
                        <th scope="col" className="px-4 py-4 text-sm font-normal text-left rtl:text-right text-white">
                          <div className="flex justify-center items-center gap-x-2">
                            <button>
                              <span>Acción</span>
                            </button>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-blue dark:divide-blue dark:bg-blue">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                          <tr key={index}>
                            <td className="px-3 py-3.5 text-sm text-black-600 dark:text-gray-300 whitespace-nowrap">
                              <div className="flex flex-col justify-center items-center gap-x-2">
                                <span>{student.nombre_completo} {student.primer_apellido} {student.segundo_apellido}</span>
                              </div>
                            </td>
                            <td className="px-3 py-3.5 text-sm text-black-600 dark:text-gray-200 whitespace-nowrap">
                              <div className="w-full inline-flex justify-center items-center gap-x-3">
                                <span>{student.num_documento}</span>
                              </div>
                            </td>
                            <td className="px-3 py-3.5 text-sm text-black-600 dark:text-gray-200 whitespace-nowrap">
                              <div className="w-full inline-flex justify-center items-center gap-x-3">
                                <span>{student.programa}</span>
                              </div>
                            </td>
                            <td className="px-3 py-3.5 text-sm text-black-600 dark:text-gray-200 whitespace-nowrap">
                              <div className="w-full inline-flex justify-center items-center gap-x-3">
                                <span>{formatFecha(student.fecha_inicial)}</span>
                              </div>
                            </td>
                            <td className="px-3 py-3.5 text-sm text-black-600 dark:text-gray-200 whitespace-nowrap">
                              <div className="w-full inline-flex justify-center items-center gap-x-3">
                                <span>{formatFecha(student.fecha_final)}</span>
                              </div>
                            </td>
                            <td className="px-3 py-3.5 text-sm text-black-600 dark:text-gray-200 whitespace-nowrap">
                              <div className="w-full inline-flex justify-center items-center gap-x-3">
                                <div className="flex justify-center items-center px-3 py-1 rounded-full gap-x-2">
                                  {/* Botón de Editar */}
                                  <button onClick={() => handleShowModal(student)}>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="size-5"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.862 4.487a2.6 2.6 0 1 0-3.673 3.673l-7.252 7.253a2.25 2.25 0 0 0-.57.92l-1.565 4.687a2.25 2.25 0 0 0 2.729 2.73l4.687-1.565a2.25 2.25 0 0 0 .92-.57l7.253-7.252a2.6 2.6 0 1 0-3.672-3.673l-4.687 4.688"
                                      />
                                    </svg>
                                  </button>
                                  {/* Botón de Eliminar con Confirmación */}
                                  <button onClick={() => openConfirmModal(student)}>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="size-5"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4">No se encontraron estudiantes.</td>
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

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">¿Estás seguro?</h2>
            <p>Estás a punto de eliminar a este estudiante. Esta acción es irreversible.</p>
            <div className="mt-4 flex gap-x-4 justify-center">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={confirmDelete}
              >
                Confirmar
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded"
                onClick={closeConfirmModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
       <InfoAlumnos
        showModal={showModal}
        onClose={handleCloseModal}
        student={selectedStudent} // Pasa los detalles del estudiante
      />
    </section>
     
  );
};
