const { Client } = require('pg');

function postgreConnection(config) {
  const client = new Client({
    host: config.host || 'localhost',
    user: config.user || 'postgres',
    password: config.password || '',
    database: config.database || 'test',
    port: config.port || 5432
  });

  // Conectar al cliente
  return client.connect()
    .then(() => {
      console.log('Conexión a PostgreSQL establecida.');
      return client;
    })
    .catch(err => {
      console.error('Error al conectar a PostgreSQL:', err);
      throw err;
    });
}

function infodbpostgresql(dbconfig) {
  return postgreConnection(dbconfig)
    .then(client => {
      return client.query(`
        SELECT 
            table_name AS TABLE_NAME,
            column_name AS COLUMN_NAME,
            data_type AS DATA_TYPE,
            character_maximum_length AS CHARACTER_MAXIMUM_LENGTH,
            is_nullable AS IS_NULLABLE,
            column_default AS COLUMN_DEFAULT
        FROM 
            information_schema.columns
        WHERE 
            table_catalog = '${dbconfig.database}'
        ORDER BY 
            table_name, 
            ordinal_position;
      `)
      .then(result => {
        client.end(); // Cerrar la conexión después de la consulta
        return result.rows; // Devolver los resultados de la consulta
      })
      .catch(err => {
        console.error('Error al realizar la consulta:', err);
        client.end(); // Asegurarse de cerrar la conexión en caso de error
        throw err;
      });
    });
}

module.exports = {
  infodbpostgresql,
};
