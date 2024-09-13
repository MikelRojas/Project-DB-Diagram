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
        let dbconfig;

        if (dbType === 'mysql') {
            dbconfig = {
                host: host || 'localhost',
                user: user || 'root',
                password: password || '',
                database: database,
                port: port || 3306
            };
            const data = await controler.infodbmysql(dbconfig);
            answer.success(req, res, data, 200);
        } else if (dbType === 'sqlserver') {
            dbconfig = {
                server: host || 'localhost',
                database: database,
                user: user || 'sa',
                password: password || 'password',
                port: parseInt(port) || 1433,
                options: {
                    encrypt: true,
                    trustServerCertificate: true
                }
            };
            const data = await controler.infodbsqlserver(dbconfig);
            answer.success(req, res, data, 200);
        } else if (dbType === 'postgresql') {
            dbconfig = {
                host: host || 'localhost',
                user: user || 'postgres',
                password: password || '',
                database: database,
                port: parseInt(port) || 5432
            };
            const data = await controler.infodbpostgresql(dbconfig);
            answer.success(req, res, data, 200);
        } else {
            answer.error(req, res, 'Tipo de base de datos no soportado', 400);
        }
    } catch (error) {
        console.error('Error al realizar la operación:', error); // Log en la consola del servidor
        answer.error(req, res, `Error al obtener los datos: ${error.message}`, 500); // Respuesta detallada al cliente
    }
});

module.exports = router;
