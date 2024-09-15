const { Client } = require('pg');
const plantUml = require('plantuml-encoder'); // Asegúrate de tener plantuml-encoder instalado

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

function generateUMLFromDbData(dbData) {
  console.log('Generando UML a partir de los datos de la base de datos...');
  let plantUMLString = `
  @startuml
  hide circle
  skinparam linetype ortho
  `;

  const entities = {};
  const relationships = new Set(); // Usar un Set para evitar relaciones duplicadas

  dbData.forEach(row => {
    const { 
      table_name, 
      column_name, 
      data_type, 
      character_maximum_length, 
      referenced_table_name, 
      referenced_column_name 
    } = row;

    if (!entities[table_name]) {
      entities[table_name] = [];
    }

    const columnDetails = +${column_name} : ${data_type};
    entities[table_name].push(columnDetails);

    if (referenced_table_name) {
      const relationship = ${referenced_table_name} ||--o{ ${table_name} : "${column_name} -> ${referenced_column_name}";
      relationships.add(relationship);
    }
  });

  // Crear las entidades en PlantUML
  for (const [tableName, columns] of Object.entries(entities)) {
    plantUMLString += \nentity "${tableName}" as ${tableName} {\n  ${columns.join('\n  ')}\n};
  }

  // Agregar relaciones
  relationships.forEach(rel => {
    plantUMLString += \n${rel};
  });

  plantUMLString += '\n@enduml';

  console.log('Cadena PlantUML generada:', plantUMLString);

  return plantUMLString;
}

function infodbpostgresql(dbconfig) {
  return postgreConnection(dbconfig)
    .then(client => {
      return client.query(`
        SELECT 
          c.table_schema AS schema_name,
          c.table_name AS table_name,
          c.column_name AS column_name,
          c.data_type AS data_type,
          c.character_maximum_length AS character_maximum_length,
          c.is_nullable AS is_nullable,
          c.column_default AS column_default,
          kcu_ref.table_name AS referenced_table_name,
          kcu_ref.column_name AS referenced_column_name
        FROM 
          information_schema.columns c
        LEFT JOIN 
          information_schema.key_column_usage kcu
          ON c.table_schema = kcu.table_schema
          AND c.table_name = kcu.table_name
          AND c.column_name = kcu.column_name
        LEFT JOIN 
          information_schema.referential_constraints rc
          ON kcu.constraint_name = rc.constraint_name
          AND kcu.constraint_schema = rc.constraint_schema
        LEFT JOIN 
          information_schema.key_column_usage kcu_ref
          ON rc.unique_constraint_name = kcu_ref.constraint_name
          AND rc.unique_constraint_schema = kcu_ref.constraint_schema
          AND kcu_ref.ordinal_position = kcu.ordinal_position
        WHERE 
          c.table_catalog = '${dbconfig.database}'  
          AND c.table_schema NOT IN ('pg_catalog', 'information_schema') 
        ORDER BY 
          c.table_schema, 
          c.table_name, 
          c.ordinal_position;
      `)
      .then(result => {
        // Verifica el resultado
        console.log('Resultado de la consulta:', result.rows);

        // Generar UML
        const plantUMLString = generateUMLFromDbData(result.rows); // Asegúrate de usar result.rows

        // Codificar el string de PlantUML
        const encoded = plantUml.encode(plantUMLString);

        // Generar la URL del diagrama
        const plantUMLUrl = http://www.plantuml.com/plantuml/png/${encoded};

        // Cerrar la conexión
        client.end();

        return plantUMLUrl;
      })
      .catch(error => {
        console.error('Error en la consulta:', error);
        client.end(); // Asegúrate de cerrar la conexión en caso de error
        throw error;
      });
    });
}

module.exports = {
  infodbpostgresql,
};
