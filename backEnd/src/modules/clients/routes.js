const express = require('express');
const router = express.Router();
const answer = require('../../red/answers');
const controler = require('./controler');

router.get('/', async (req, res) => {
    // Obtener los parámetros de la consulta
    const { dbType, host, user, password, database, port } = req.query;

    // Validar el tipo de base de datos y conectar en consecuencia
    if (!dbType || !database) {
        return answer.error(req, res, 'Faltan parámetros necesarios', 400);
    }

    try {
        let dbconfig = {
            host: host || 'localhost',
            user: user || 'sa',
            password: password || 'password',
            database: database,
            port: port || 1433
        };

        if (dbType === 'mysql') {
            const data = await controler.infodbmysql(dbconfig);
            answer.success(req, res, data, 200);
        } else if (dbType === 'sqlserver') {
            const data = await controler.infodbsqlserver(dbconfig);
            answer.success(req, res, data, 200);
        } else if (dbType === 'postgresql') {
            // Lógica para conexión a PostgreSQL u otra base de datos
            /*
            const { Client } = require('pg');
            const client = new Client({
                host: host || 'localhost',
                user: user || 'postgres',
                password: password || '',
                database: database || 'prueba',
                port: port || 5432
            });

            await client.connect();
            console.log('PostgreSQL DB Connected!');
            answer.success(req, res, 'Conexión exitosa a la base de datos PostgreSQL', 200);
            await client.end();
            */
        } else {
            answer.error(req, res, 'Tipo de base de datos no soportado', 400);
        }
    } catch (error) {
        answer.error(req, res, 'Error al obtener los datos', 500);
    }
});

module.exports = router;
