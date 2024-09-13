const sql = require('mssql');

function sqlserverConnection(config) {
  // Configuración de la conexión
  const connectionConfig = {
    user: config.user || 'sa',
    password: config.password || 'password',
    server: config.host || 'localhost',
    database: config.database || 'test',
    port: config.port || 1433,
    options: {
      encrypt: true, // Para conexiones seguras
      trustServerCertificate: true, // Para evitar problemas con certificados en desarrollo
    },
  };

  // Crear la conexión
  return sql.connect(connectionConfig)
    .then(pool => {
      if (pool.connecting) {
        console.log('Conectando a SQL Server...');
      }
      console.log('Conexión a SQL Server establecida.');
      return pool;
    })
    .catch(err => {
      console.error('Error al conectar a SQL Server:', err);
      throw err;
    });
}

function infodbsqlserver(dbconfig) {
  return sqlserverConnection(dbconfig)
    .then(pool => {
      return pool.request().query(`
        SELECT 
            TABLE_NAME,
            COLUMN_NAME,
            DATA_TYPE,
            CHARACTER_MAXIMUM_LENGTH,
            IS_NULLABLE,
            COLUMN_DEFAULT
        FROM 
            INFORMATION_SCHEMA.COLUMNS
        WHERE 
            TABLE_CATALOG = '${dbconfig.database}'
        ORDER BY 
            TABLE_NAME, 
            ORDINAL_POSITION;
      `);
    })
    .then(result => {
      return result.recordset; // Devolver los resultados de la consulta
    })
    .catch(err => {
      console.error('Error al realizar la consulta:', err);
      throw err;
    });
}

module.exports = {
  infodbsqlserver,
};
