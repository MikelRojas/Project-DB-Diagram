import React, { useEffect } from 'react';

const Mysql: React.FC = () => {
  useEffect(() => {
    // Realizar la petición al backend cuando el componente se monta
    const fetchData = async () => {
      // Construir la cadena de consulta
      const params = new URLSearchParams({
        dbType: 'mysql',
        host: 'localhost',
        user: 'root',
        password: 'marr5604',
        database: 'prueba',
        port: '3306', // Los parámetros deben ser strings
      }).toString();

      try {
        // Realizar la solicitud GET con parámetros de consulta
        const response = await fetch(`http://localhost:4050/api/clients?${params}`, {
          method: 'GET', // Usar 'GET'
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error en la petición al servidor');
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);
      } catch (error) {
        console.error('Error realizando la petición:', error);
      }
    };

    fetchData();
  }, []); // [] asegura que esto solo se ejecuta una vez cuando el componente se monta

  return (
    <div>
      <h1>Interfaz de Diagrama</h1>
    </div>
  );
};

export default Mysql;