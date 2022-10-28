import http from 'http';
import express, { Router } from 'express';
import bodyParser from 'body-parser';
import logging from './config/logging';
import config from './config/config';
import sampleRoute from './routes/sample';

const NAMESPACE = 'Server';
const app = express();

/** Logging the request */
app.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
    });
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** Rules of our API */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET POST PUT PATCH DELETE');
        return res.status(200).json({});
    }
    next();
});

/** Routes */
app.use('/sample', sampleRoute);
/** Error Handling */
app.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

/** Create the server */

app.listen(config.server.port, () => {
    logging.info(NAMESPACE, `server running on ${config.server.hostname}:${config.server.port}`);
});
