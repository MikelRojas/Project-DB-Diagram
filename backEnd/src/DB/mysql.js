const mysql = require('mysql2');

function mysqlconnection(dbconfig) {
  const conexion = mysql.createConnection(dbconfig);
  conexion.connect((err) => {
    if (err) {
      console.log(['db err'], err);
      // Aquí puedes agregar una lógica adicional para reconectar si es necesario
    } else {
      console.log('DB Connected');
    }
  });

  // Manejador de errores
  conexion.on('error', (err) => {
    console.log(['db err'], err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      mysqlconnection(dbconfig); // Llamada correcta con parámetro dbconfig
    } else {
      throw err;
    }
  });

  return conexion;
}

function infodbmysql(dbconfig) {
  const conexion = mysqlconnection(dbconfig);

  const request = new Promise((resolve, reject) => {
    conexion.query(
      `SELECT 
          TABLE_NAME,
          COLUMN_NAME,
          DATA_TYPE,
          CHARACTER_MAXIMUM_LENGTH,
          IS_NULLABLE,
          COLUMN_KEY,
          COLUMN_DEFAULT,
          EXTRA
       FROM 
          INFORMATION_SCHEMA.COLUMNS
       WHERE 
          TABLE_SCHEMA = '${dbconfig.database}'
       ORDER BY 
          TABLE_NAME, 
          ORDINAL_POSITION;`,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
        conexion.end(); // Mueve `conexion.end()` dentro del callback para asegurarte de que la conexión se cierra después de la consulta
      }
    );
  });

  return request;
}

module.exports = {
  infodbmysql,
};
