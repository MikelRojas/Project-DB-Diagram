import { ConnectionState } from '../components/interfaces';

export const getGeneratedUrl2 = async (conState: ConnectionState): Promise<string | null> => {
  const params = new URLSearchParams({
    dbType: conState.databaseEngine,
    host: conState.host,
    user: conState.user,
    password: conState.password,
    database: conState.dbName || '',
    port: conState.port, 
  }).toString();

  const url = `http://localhost:4050/api/clients?${params}`;
  console.log('URL de la petición:', url);

  try {
    // Imprimir la promesa generada
    const promise = fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Promesa generada:', promise);

    const response = await promise;
    
    // Imprimir el estado de la respuesta
    console.log('Estado de la respuesta:', response.status);

    if (!response.ok) {
      throw new Error('Error en la petición al servidor');
    }

    const data = await response.json();
    
    // Imprimir los datos obtenidos de la respuesta
    console.log('Datos obtenidos de la respuesta:', data);

    // Verificar que el status sea 200 y que no haya errores
    if (data.status === 200 && !data.error) {
      return data.body; // Retorna el URL generado por la API
    }

    throw new Error('Respuesta inválida del servidor');
  } catch (error) {
    console.error('Error realizando la petición:', error);
    return null;
  }
};
