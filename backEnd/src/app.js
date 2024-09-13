// app.js
const express = require('express');
const config = require('./config');
const clients = require('./modules/clients/routes');
const cors = require('cors');

const app = express();


app.use(express.json());


// Configuration
app.set('port', config.app.port);

// Rutes
app.use(cors()); 
app.use('/api/clients',clients)

module.exports = app;
