import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { HomePage } from './Pages/HomePage';
import { LoginPage } from './Pages/LoginPage';
import PrivateRoute from './Components/PrivateRoute'; // Asegúrate de importar PrivateRoute

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública de Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Ruta protegida de Home */}
        <Route
          path="/home"
          element={<PrivateRoute element={<HomePage />} />} // Protege la ruta de home con PrivateRoute
        />
      </Routes>
    </Router>
  );
}
