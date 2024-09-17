import React, { useState, useEffect } from 'react';
import { ConnectionState } from '../components/interfaces';
import { getGeneratedUrl } from '../DB/ConectionsDBs';

const DiagramInterface: React.FC = () => {
  const [connectionDetails, setConnectionDetails] = useState<ConnectionState[]>(() => {
    const storedConnections = localStorage.getItem('connectionDetails');
    return storedConnections ? JSON.parse(storedConnections) : [{
      databaseEngine: '',
      user: '',
      host: '',
      password: '',
      port: '',
      dbName: '',
      serverType: 'Database Engine',
      serverName: ''
    }];
  });

  const [indexConexion, setIndexConexion] = useState<number>(() => {
    const storedIndex = localStorage.getItem('indexConexion');
    return storedIndex ? Number(storedIndex) : 0;
  });

  const [diagram, setDiagram] = useState<string>('/');
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [details, setDetails] = useState<string[][]>(() => {
    const storedDetails = localStorage.getItem('details');
    return storedDetails ? JSON.parse(storedDetails) : [[]];
  });

  // Guardar los datos de conexión en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('connectionDetails', JSON.stringify(connectionDetails));
  }, [connectionDetails]);

  // Guardar el índice de conexión seleccionado en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('indexConexion', indexConexion.toString());
  }, [indexConexion]);

  // Guardar los detalles en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('details', JSON.stringify(details));
  }, [details]);

  // Función para agregar conexión
  const addConnection = (newConnection: ConnectionState) => {
    setConnectionDetails(prevDetails => [...prevDetails, newConnection]);
  };

  // Función para agregar detalles
  const addetails = (newDetail: string[]) => {
    setDetails(prevDetails => [...prevDetails, newDetail]);
  };

  // Verifica si una conexión ya existe
  const connectionExists = (newConnection: ConnectionState) => {
    return connectionDetails.some((connection) =>
      connection.host === newConnection.host &&
      connection.port === newConnection.port &&
      connection.dbName === newConnection.dbName
    );
  };

  // Maneja el proceso de conexión
  const handleConnect = async () => {
    const form = document.querySelector('form');
    const formData = new FormData(form as HTMLFormElement);

    const newConnection: ConnectionState = {
      databaseEngine: formData.get('databaseEngine') as string || '',
      user: formData.get('user') as string || '',
      host: formData.get('host') as string || '',
      password: formData.get('password') as string || '',
      port: formData.get('port') as string || '',
      dbName: formData.get('dbName') as string || '',
      serverType: 'Database Engine',
      serverName: ''
    };

    const updatedConnectionDetails = [...connectionDetails];
    updatedConnectionDetails[indexConexion] = newConnection;
    setConnectionDetails(updatedConnectionDetails);

    if (connectionExists(newConnection) && connectionDetails.length !== 1) {
      console.log("La conexión ya existe.");
      setConnectionStatus('Conexión ya existente');
      const upconect = [...connectionDetails];
      upconect[indexConexion] = {
        databaseEngine: '',
        user: '',
        host: '',
        password: '',
        port: '',
        dbName: '',
        serverType: 'Database Engine',
        serverName: ''
      };
      setConnectionDetails(upconect);
      return;
    }

    const answer = await getGeneratedUrl(newConnection);

    if (answer != null) {
      console.log(await answer);
      setConnectionStatus('Conexión exitosa');
      const detail: string[] = [
        `Host: ${newConnection.host}`,
        `Puerto: ${newConnection.port}`,
        `Usuario: ${newConnection.user}`
      ];
      const updatedDetails = [...details];
      updatedDetails[indexConexion] = detail;
      setDetails(updatedDetails);
      setDiagram(answer);

      const nConnection: ConnectionState = {
        databaseEngine: '',
        user: '',
        host: '',
        password: '',
        port: '',
        dbName: '',
        serverType: 'Database Engine',
        serverName: ''
      };

      addConnection(nConnection);
      addetails([]);
      formData.set('databaseEngine','');
      formData.set('user','');
      formData.set('host','');
      formData.set('password','');
      formData.set('port','');
      formData.set('dbName','');
    } else {
      setConnectionStatus('Error de conexión');
    }
  };

  const deleteConnection = () => {
    if (connectionDetails.length > 1) {
      // Verificar si la conexión eliminada es la actual
      const isCurrentConnection = connectionDetails.length > 0 && connectionDetails[indexConexion];
  
      const updatedConnectionDetails = connectionDetails.filter((_, index) => index !== indexConexion);
      
      setConnectionDetails(updatedConnectionDetails);
      
      // Si la conexión eliminada era la actual, limpiar el diagrama
      if (isCurrentConnection) {
        setDiagram('/');
      }
  
      // Actualizar el índice de conexión
      const newIndex = Math.max(0, indexConexion - 1);
      setIndexConexion(newIndex);
      setConnectionStatus('Conexión eliminada');
    } else {
      setConnectionStatus('No se puede eliminar la última conexión');
    }
  };
  
  

  const editConnect = async () => {
    const form = document.querySelector('form');
    const formData = new FormData(form as HTMLFormElement);

    const newConnection: ConnectionState = {
      databaseEngine: formData.get('databaseEngine') as string || '',
      user: formData.get('user') as string || '',
      host: formData.get('host') as string || '',
      password: formData.get('password') as string || '',
      port: formData.get('port') as string || '',
      dbName: formData.get('dbName') as string || '',
      serverType: 'Database Engine',
      serverName: ''
    };

    const updatedConnectionDetails = [...connectionDetails];
    updatedConnectionDetails[indexConexion] = newConnection;
    setConnectionDetails(updatedConnectionDetails);

    if (connectionExists(newConnection) && connectionDetails.length !== 1) {
      console.log("La conexión ya existe.");
      setConnectionStatus('Conexión ya existente');
    }

    const answer = await getGeneratedUrl(newConnection);

    if (answer != null) {
      console.log(await answer);
      setConnectionStatus('Conexión exitosa');
      const detail: string[] = [
        `Host: ${newConnection.host}`,
        `Puerto: ${newConnection.port}`,
        `Usuario: ${newConnection.user}`
      ];
      const updatedDetails = [...details];
      updatedDetails[indexConexion] = detail;
      setDetails(updatedDetails);
      setDiagram(answer);

      formData.set('databaseEngine','');
      formData.set('user','');
      formData.set('host','');
      formData.set('password','');
      formData.set('port','');
      formData.set('dbName','');
    } else {
      setConnectionStatus('Error de conexión');
    }
  };

  // Función para refrescar el diagrama
  const refreshDiagram = async () => {
    const currentDetails = connectionDetails[indexConexion];
    if (
      !currentDetails.databaseEngine || 
      !currentDetails.host || 
      !currentDetails.port || 
      !currentDetails.user || 
      !currentDetails.password || 
      !currentDetails.dbName
    ) {
      setDiagram('/');
      return;
    }

    const answer = await getGeneratedUrl(currentDetails);

    if (answer != null) {
      setDiagram(answer);
      setConnectionStatus('Conexión exitosa');
    } else {
      setConnectionStatus('Error de conexión');
    }
  };

  // useEffect para refrescar diagrama cuando cambia la conexión seleccionada
  useEffect(() => {
    refreshDiagram();
  }, [indexConexion]); // Se ejecuta cuando cambia `indexConexion`

  // Maneja el cambio en la selección de conexión
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIndexConexion(Number(event.target.value));
  };

  const handleDownload = () => {
    if (diagram === '/' || !diagram) {
      setConnectionStatus('No hay diagrama para descargar');
      return;
    }
  
    const link = document.createElement('a');
    link.href = diagram;
    link.download = 'diagrama.png'; // O el nombre que desees para el archivo
    link.click();
  };

  const clearAllConnections = () => {
    // Limpiar el localStorage
    localStorage.removeItem('connectionDetails');
    localStorage.removeItem('indexConexion');
    localStorage.removeItem('details');

    // Restablecer el estado
    setConnectionDetails([{
      databaseEngine: '',
      user: '',
      host: '',
      password: '',
      port: '',
      dbName: '',
      serverType: 'Database Engine',
      serverName: ''
    }]);
    setIndexConexion(0);
    setDiagram('/');
    setDetails([[]]);
    setConnectionStatus('Todas las conexiones han sido eliminadas y la aplicación se ha restablecido.');
  };

  return (
    <div>
      <header>
        <h1>Bienvenido a DB Diagrams</h1>
      </header>
      <button className="btn btn-primary w-20" style={{margin: '10px'}} onClick={clearAllConnections}>Limpiar todas las conexiones</button>
      <div className="main-container">
        <div className="sidebar">
          <h5>Conexiones</h5>
          <div className="mb-3">
            <select className="form-select" value={indexConexion} onChange={handleSelectChange}>
              {connectionDetails.map((_, index) => (
                <option key={index} value={index}>
                  {"Conexion " + index}
                </option>
              ))}
            </select>
          </div>
          {diagram=='/'?(
            <div className="card p-3">
            <h6>Agregar Nueva Conexión</h6>

            <form>
              <select className="form-select mb-2" name="databaseEngine">
                <option value="">Seleccione Motor</option>
                <option value="postgresql">Postgres</option>
                <option value="mysql">MySQL</option>
                <option value="sqlserver">SQL Server</option>
              </select>

              <input
                type="text"
                name="host"
                placeholder="Host"
                className="form-control mb-2"
              />
              <input
                type="text"
                name="port"
                placeholder="Port"
                className="form-control mb-2"
              />
              <input
                type="text"
                name="user"
                placeholder="User"
                className="form-control mb-2"
              />
              <input
                type="text"
                name="dbName"
                placeholder="Database Name"
                className="form-control mb-2"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-control mb-2"
              />
              <button type="button" className="btn btn-success w-100" onClick={handleConnect}>
                Conectar
              </button>
            </form>
            {connectionStatus && <p>{connectionStatus}</p>}
          </div>
          ):(
            <div className="card p-3">
            <h6>Editar Conexión</h6>

            <form>
              <select className="form-select mb-2" name="databaseEngine">
                <option value="">Seleccione Motor</option>
                <option value="postgresql">Postgres</option>
                <option value="mysql">MySQL</option>
                <option value="sqlserver">SQL Server</option>
              </select>

              <input
                type="text"
                name="host"
                placeholder="Host"
                className="form-control mb-2"
              />
              <input
                type="text"
                name="port"
                placeholder="Port"
                className="form-control mb-2"
              />
              <input
                type="text"
                name="user"
                placeholder="User"
                className="form-control mb-2"
              />
              <input
                type="text"
                name="dbName"
                placeholder="Database Name"
                className="form-control mb-2"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-control mb-2"
              />
              <button type="button" className="btn btn-success w-100" onClick={editConnect}>
                Conectar
              </button>
            </form>
            {connectionStatus && <p>{connectionStatus}</p>}
          </div>
          )}
          
        </div>

        <div className="content">
          <div className="fields-buttons-container">
            <div className="field-group">
              <label>Motor:</label>
              <input
                type="text"
                className="form-control"
                value={connectionDetails[indexConexion]?.databaseEngine || ''}
                readOnly
              />
            </div>
            <div className="field-group">
              <label>Nombre Base:</label>
              <input
                type="text"
                className="form-control"
                value={connectionDetails[indexConexion]?.dbName || ''}
                readOnly
              />
            </div>
            <div className="field-group">
              <label>Detalles:</label>
              <select className="form-select">
                {details[indexConexion]?.length === 0 ? (
                  <option>No hay detalles</option>
                ) : (
                  details[indexConexion].map((detail, index) => (
                    <option key={index} value={detail}>
                      {detail}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="button-group">
              <button className="btn btn-primary w-100" onClick={refreshDiagram}>Refrescar</button>
            </div>
            <div className="button-group">
              <button className="btn btn-primary w-100" onClick={deleteConnection}>Eliminar Conexion</button>
            </div>
          </div>

          <div className="border p-4 text-center" style={{ height: "400px" }}>
            {diagram === '/' ? (
              <h5>Diagrama</h5>
            ) : (
              <img src={diagram} alt="Diagrama imaginario" />
            )}
          </div>

          <div className="text-center mt-3">
            <button className="btn btn-primary w-50" onClick={handleDownload}>Descargar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagramInterface;
