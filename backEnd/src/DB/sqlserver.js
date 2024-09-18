const sql = require('mssql');
const plantUml = require('plantuml-encoder');

function sqlserverConnection(config) {
  console.log('Intentando conectar con la siguiente configuración de base de datos:', config); 
  return sql.connect(config)
    .then(pool => {
      if (pool.connecting) {
      }
      return pool;
    })
    .catch(err => {
      throw err;
    });
}

function generateUMLFromDbData(dbData) {

  let plantUMLString = `
  @startuml
  hide circle
  skinparam linetype ortho
  `;

  const entities = {};
  const relationships = new Set(); 

  dbData.forEach(row => {
    const {
      TABLE_NAME,
      COLUMN_NAME,
      DATA_TYPE,
      CHARACTER_MAXIMUM_LENGTH,
      REFERENCED_TABLE_NAME,
      REFERENCED_COLUMN_NAME
    } = row;

    if (!entities[TABLE_NAME]) {
      entities[TABLE_NAME] = [];
    }

    const columnDetails = `+${COLUMN_NAME} : ${DATA_TYPE}`;
    entities[TABLE_NAME].push(columnDetails);

    if (REFERENCED_TABLE_NAME) {
      const relationship = `${REFERENCED_TABLE_NAME} ||--o{ ${TABLE_NAME} : "${COLUMN_NAME} -> ${REFERENCED_COLUMN_NAME}"`;
      relationships.add(relationship);
    }
  });

  for (const [tableName, columns] of Object.entries(entities)) {
    plantUMLString += `\nentity "${tableName}" as ${tableName} {\n  ${columns.join('\n  ')}\n}`;
  }

  relationships.forEach(rel => {
    plantUMLString += `\n${rel}`;
  });

  plantUMLString += '\n@enduml';

  return plantUMLString;
}

function infodbsqlserver(dbconfig) {
  console.log('Iniciando proceso para obtener información de la base de datos y generar UML...');

  return sqlserverConnection(dbconfig)
    .then(pool => {
      console.log('Realizando consulta a la base de datos...');
      return pool.request().query(`
        SELECT 
            c.TABLE_NAME,
            c.COLUMN_NAME,
            c.DATA_TYPE,
            c.CHARACTER_MAXIMUM_LENGTH,
            c.IS_NULLABLE,
            c.COLUMN_DEFAULT,
            fk.REFERENCED_TABLE_NAME,
            fk.REFERENCED_COLUMN_NAME
        FROM 
            INFORMATION_SCHEMA.COLUMNS c
        LEFT JOIN (
          SELECT 
            kcu1.TABLE_NAME AS FK_TABLE_NAME,
            kcu1.COLUMN_NAME AS FK_COLUMN_NAME,
            kcu2.TABLE_NAME AS REFERENCED_TABLE_NAME,
            kcu2.COLUMN_NAME AS REFERENCED_COLUMN_NAME
          FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
          JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu1
            ON rc.CONSTRAINT_NAME = kcu1.CONSTRAINT_NAME
          JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu2
            ON rc.UNIQUE_CONSTRAINT_NAME = kcu2.CONSTRAINT_NAME
        ) fk ON c.TABLE_NAME = fk.FK_TABLE_NAME AND c.COLUMN_NAME = fk.FK_COLUMN_NAME
        WHERE 
            c.TABLE_CATALOG = '${dbconfig.database}'
        ORDER BY 
            c.TABLE_NAME, 
            c.ORDINAL_POSITION;
      `);
    })
    .then(result => {
      const dbData = result.recordset;
      console.log('Datos obtenidos de la base de datos:', dbData);

      const plantUMLString = generateUMLFromDbData(dbData);

      const encoded = plantUml.encode(plantUMLString);

      const plantUMLUrl = `http://www.plantuml.com/plantuml/png/${encoded}`;

      return sql.close().then(() => {
        return plantUMLUrl; 
      });
    })
    .catch(err => {
      console.error('Error durante el proceso:', err);
      return sql.close().then(() => {
        console.log('Conexión a SQL Server cerrada tras el error.');
        throw err;
      });
    });
}

module.exports = {
  infodbsqlserver,
};