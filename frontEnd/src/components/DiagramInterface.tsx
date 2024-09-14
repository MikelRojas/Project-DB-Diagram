import React, { useState } from 'react';
import {ConnectionState} from '../components/interfaces'
import {getGeneratedUrl} from '../DB/Mysql'


const DiagramInterface: React.FC = () => {
  const [connectionDetails, setConnectionDetails] = useState<ConnectionState[]>([{
    databaseEngine: '',
    user: '',
    host: '',
    password: '',
    port: '',
    dbName: '',
    serverType: 'Database Engine',
    serverName: ''
  }]);

  const [indexConexion, SetIndexConexion] = useState(0);
  const [diagram, setDiagram] = useState<string>('/');
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [details, setDetails] = useState<string[]>([]); // Para almacenar las tablas

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Crear una copia del array de conexiones
    const updatedConnections = [...connectionDetails];

    // Crear una copia del objeto que deseas modificar
    const updatedConnection = {
      ...updatedConnections[indexConexion],
      [name]: value, // Actualizar el valor del campo correspondiente
    };

    // Reemplazar la conexión modificada en la copia del array
    updatedConnections[indexConexion] = updatedConnection;

    // Actualizar el estado con el nuevo array
    setConnectionDetails(updatedConnections);
  };

  const handleConnect = async () => {
    const answer = await getGeneratedUrl(connectionDetails[indexConexion]);
    if (answer != null) {
      console.log(await answer);
      setConnectionStatus('Conexión exitosa');
      const detail: string[] = [
        `Host: ${connectionDetails[indexConexion].host}`,
        `Puerto: ${connectionDetails[indexConexion].port}`,
        `Usuario: ${connectionDetails[indexConexion].user}`
      ];
      setDetails(detail);
      setDiagram(answer);
    } else {
      setConnectionStatus('Error de conexión');
    }
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
              value={connectionDetails[indexConexion].databaseEngine}
              onChange={handleInputChange}
            >
              <option value="">Seleccione Motor</option>
              <option value="postgresql">Postgres</option>
              <option value="mysql">MySQL</option>
              <option value="sqlserver">SQL Server</option>
            </select>

            {connectionDetails[indexConexion].databaseEngine === 'SQLServer' ? (
              <>
                <input
                  type="text"
                  name="serverType"
                  placeholder="Server Type"
                  className="form-control mb-2"
                  value={connectionDetails[indexConexion].serverType}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="serverName"
                  placeholder="Server Name"
                  className="form-control mb-2"
                  value={connectionDetails[indexConexion].serverName}
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
                  value={connectionDetails[indexConexion].host}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="port"
                  placeholder="Port"
                  className="form-control mb-2"
                  value={connectionDetails[indexConexion].port}
                  onChange={handleInputChange}
                />
              </>
            )}

            <input
              type="text"
              name="user"
              placeholder="User"
              className="form-control mb-2"
              value={connectionDetails[indexConexion].user}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="dbName"
              placeholder="Database Name"
              className="form-control mb-2"
              value={connectionDetails[indexConexion].dbName}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control mb-2"
              value={connectionDetails[indexConexion].password}
              onChange={handleInputChange}
            />
            <button className="btn btn-success w-100" onClick={handleConnect}>Conectar</button>
            {connectionStatus && <p>{connectionStatus}</p>}
          </div>
        </div>

        <div className="content">
          <div className="fields-buttons-container">
            <div className="field-group">
              <label>Motor:</label>
              <input type="text" className="form-control" value={connectionDetails[indexConexion].databaseEngine} readOnly />
            </div>
            <div className="field-group">
              <label>Nombre Base:</label>
              <input type="text" className="form-control" value={connectionDetails[indexConexion].dbName} readOnly />
            </div>
            <div className="field-group">
              <label>Detalles:</label>
              <select className="form-select">
                {details.length === 0 ? (
                  <option>No hay detalles</option>
                ) : (
                  details.map((table, index) => (
                    <option key={index} value={table}>{table}</option>
                  ))
                )}
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
            {diagram === '/' ?(
              <h5>Diagrama</h5>
            ):(
              <img src = {diagram} alt="Diagrama imaginario" />
            )
            }
            
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