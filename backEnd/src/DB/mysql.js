const mysql = require('mysql2');
const plantUml = require('plantuml-encoder');

function mysqlconnection(dbconfig) {
  const conexion = mysql.createConnection(dbconfig);
  conexion.connect((err) => {
    if (err) {
      console.log(['db err'], err);
      return;
      // Aquí puedes agregar una lógica adicional para reconectar si es necesario
    } else {
      console.log('DB Connected');
      return conexion;
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

function generateUMLFromDbData(dbData) {
  let plantUMLString = `
  @startuml
  hide circle
  skinparam linetype ortho
  `;

  const entities = {};
  const relationships = new Set(); // Cambié a Set para evitar relaciones duplicadas

  dbData.forEach(row => {
    const { 
      TABLE_NAME, 
      COLUMN_NAME, 
      DATA_TYPE, 
      REFERENCED_TABLE_NAME, 
      REFERENCED_COLUMN_NAME 
    } = row;

    // Crear entidad si no existe
    if (!entities[TABLE_NAME]) {
      entities[TABLE_NAME] = [];
    }

    // Agregar columna a la entidad
    const columnDetails = `+${COLUMN_NAME} : ${DATA_TYPE}`;
    entities[TABLE_NAME].push(columnDetails);

    // Si existe una tabla referenciada, agregar relación con cardinalidad
    if (REFERENCED_TABLE_NAME) {
      const relationship = `${REFERENCED_TABLE_NAME} ||--o{ ${TABLE_NAME} : "${COLUMN_NAME} -> ${REFERENCED_COLUMN_NAME}"`;
      relationships.add(relationship); // Usamos Set para evitar duplicados
    }
  });

  // Generar entidades en PlantUML
  for (const [tableName, columns] of Object.entries(entities)) {
    plantUMLString += `\nentity "${tableName}" as ${tableName} {\n  ${columns.join('\n  ')}\n}`;
  }

  // Agregar relaciones con cardinalidad
  relationships.forEach(rel => {
    plantUMLString += `\n${rel}`;
  });

  plantUMLString += '\n@enduml';

  return plantUMLString;
}

function infodbmysql(dbconfig) {
  const conexion = mysqlconnection(dbconfig);

  const request = new Promise((resolve, reject) => {
    conexion.query(
      `SELECT 
          c.TABLE_NAME,
          c.COLUMN_NAME,
          c.DATA_TYPE,
          c.CHARACTER_MAXIMUM_LENGTH,
          c.IS_NULLABLE,
          c.COLUMN_KEY,
          c.COLUMN_DEFAULT,
          c.EXTRA,
          kcu.REFERENCED_TABLE_NAME, -- Nombre de la tabla referenciada
          kcu.REFERENCED_COLUMN_NAME -- Nombre de la columna referenciada
      FROM 
          INFORMATION_SCHEMA.COLUMNS c
      LEFT JOIN 
          INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
          ON c.TABLE_NAME = kcu.TABLE_NAME
          AND c.COLUMN_NAME = kcu.COLUMN_NAME
          AND c.TABLE_SCHEMA = kcu.TABLE_SCHEMA
          AND kcu.REFERENCED_TABLE_NAME IS NOT NULL 
      LEFT JOIN 
          INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
          ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
          AND kcu.TABLE_SCHEMA = rc.CONSTRAINT_SCHEMA
      WHERE 
          c.TABLE_SCHEMA = '${dbconfig.database}'
      ORDER BY 
          c.TABLE_NAME, 
          c.ORDINAL_POSITION;`,
      (error, result) => {
        if (error) reject(error);
        else {
          // Generar UML
          const plantUMLString = generateUMLFromDbData(result);

          // Codificar el string de PlantUML
          const encoded = plantUml.encode(plantUMLString);

          // Generar la URL del diagrama
          const plantUMLUrl = `http://www.plantuml.com/plantuml/png/${encoded}`;
          resolve(plantUMLUrl);
        }
        conexion.end(); // Mueve `conexion.end()` dentro del callback para asegurarte de que la conexión se cierra después de la consulta
      }
    );
  });

  return request;
}

module.exports = {
  infodbmysql,
};
