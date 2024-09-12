import React, { useState } from 'react';

interface ConnectionState {
  databaseEngine: string;
  user: string;
  host: string;
  password: string;
  port: string;
  dbName?: string;
  serverType?: string;
  serverName?: string;
}

const DiagramInterface: React.FC = () => {
  const [connectionDetails, setConnectionDetails] = useState<ConnectionState>({
    databaseEngine: '',
    user: '',
    host: '',
    password: '',
    port: '',
    dbName: '',
    serverType: 'Database Engine',
    serverName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConnectionDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <header>
        <h1>Bienvenido a DB Diagrams</h1>
      </header>

      <div className="main-container">
        <div className="sidebar">
          <h5>Conexiones</h5>
          <div className="mb-3">
            <select className="form-select">
              <option>Conexión 1</option>
              <option>Conexión 2</option>
            </select>
            
          </div>
          <div className="card p-3">
            <h6>Agregar Nueva Conexión</h6>

            <select
              className="form-select mb-2"
              name="databaseEngine"
              value={connectionDetails.databaseEngine}
              onChange={handleInputChange}
            >
              <option value="">Seleccione Motor</option>
              <option value="Postgres">Postgres</option>
              <option value="MySQL">MySQL</option>
              <option value="SQLServer">SQL Server</option>
            </select>

            {connectionDetails.databaseEngine === 'SQLServer' ? (
              <>
                <input
                  type="text"
                  name="serverType"
                  placeholder="Server Type"
                  className="form-control mb-2"
                  value={connectionDetails.serverType}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="serverName"
                  placeholder="Server Name"
                  className="form-control mb-2"
                  value={connectionDetails.serverName}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="host"
                  placeholder="Host"
                  className="form-control mb-2"
                  value={connectionDetails.host}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="port"
                  placeholder="Port"
                  className="form-control mb-2"
                  value={connectionDetails.port}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="dbName"
                  placeholder="Database Name"
                  className="form-control mb-2"
                  value={connectionDetails.dbName}
                  onChange={handleInputChange}
                />
              </>
            )}

            <input
              type="text"
              name="user"
              placeholder="User"
              className="form-control mb-2"
              value={connectionDetails.user}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control mb-2"
              value={connectionDetails.password}
              onChange={handleInputChange}
            />
            <button className="btn btn-success w-100">Conectar</button>
          </div>
        </div>

        <div className="content">
          <div className="fields-buttons-container">
            <div className="field-group">
              <label>Motor:</label>
              <input type="text" className="form-control" value={connectionDetails.databaseEngine} readOnly />
            </div>
            <div className="field-group">
              <label>Nombre Base:</label>
              <input type="text" className="form-control" value={connectionDetails.dbName} readOnly />
            </div>
            <div className="field-group">
              <label>Tablas: </label>
              <select className="form-select">
                <option>Seleccione</option>
                <option>Tabla 1</option>
                <option>Tabla 2</option>
                <option>Tabla 3</option>
                <option>Tabla 4</option>
              </select>
            </div>
            <div className="button-group">
              <button className="btn btn-warning w-100">Generar Diagramas</button>
            </div>
            <div className="button-group">
              <button className="btn btn-primary w-100">Refrescar</button>
            </div>
          </div>

          <div className="border p-4 text-center" style={{ height: "400px" }}>
            <h5>Diagrama</h5>
          </div>

          <div className="text-center mt-3">
            <button className="btn btn-primary w-50">Descargar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagramInterface;








