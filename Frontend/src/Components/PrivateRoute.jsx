import React from 'react';
import { Navigate } from 'react-router-dom';

// Componente PrivateRoute que verifica si el usuario está autenticado
const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('authToken');  // Verificar si existe el token en localStorage

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, muestra el componente protegido
  return element;
};

export default PrivateRoute;
