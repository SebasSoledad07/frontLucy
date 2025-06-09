import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="unauthorized-container">
      <h2>Acceso No Autorizado</h2>
      <p>No tienes permiso para acceder a esta página.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
};

export default UnauthorizedPage;