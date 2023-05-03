require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const cors = require('cors');

const basicAuth = require('../api/@helpers/basic-auth');
const errorHandler = require('../api/@helpers/error-handler');

module.exports = () => {
    const app = express();

    app.use(cors());

    // use basic HTTP auth to secure the api
    app.use(basicAuth);

    // SETANDO VARIÁVEIS DA APLICAÇÃO
    app.set('port', process.env.PORT || config.get('server.port'));

    // MIDDLEWARES
    app.use(bodyParser.json());

    // END-POINTS
    require('../api/routes')(app);

    // global error handler
    app.use(errorHandler);

    return app;
};