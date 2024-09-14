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
          c.table_schema AS SCHEMA_NAME,
          c.table_name AS TABLE_NAME,
          c.column_name AS COLUMN_NAME,
          c.data_type AS DATA_TYPE,
          c.character_maximum_length AS CHARACTER_MAXIMUM_LENGTH,
          c.is_nullable AS IS_NULLABLE,
          c.column_default AS COLUMN_DEFAULT
        FROM 
          information_schema.columns c
        WHERE 
          c.table_catalog = '${dbconfig.database}'  
          AND c.table_schema NOT IN ('pg_catalog', 'information_schema') 
        ORDER BY 
          c.table_schema, 
          c.table_name, 
          c.ordinal_position;
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
