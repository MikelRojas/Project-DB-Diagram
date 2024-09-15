// postgresql.tsx
import { ConnectionState } from '../components/interfaces';

export const getGeneratedUrlPostgres = async (conState: ConnectionState): Promise<string | null> => {
  const params = new URLSearchParams({
    dbType: conState.databaseEngine,
    host: conState.host,
    user: conState.user,
    password: conState.password,
    database: conState.dbName || '',
    port: conState.port, 
  }).toString();

  const url = http://localhost:4050/api/clients?${params};
  console.log('URL de la petición:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error en la petición al servidor');
    }

    const data = await response.json();

    if (data.status === 200 && !data.error) {
      return data.body; // Retorna el URL generado por la API
    }

    throw new Error('Respuesta inválida del servidor');
  } catch (error) {
    console.error('Error realizando la petición:', error);
    return null;
  }
};
