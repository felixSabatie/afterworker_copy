const express = require('express');
const app = express();
const DatabaseService = require('./services/database.service');

const http = require('http').createServer(app);

const port = process.env.PORT || 8080;

// CORS
app.use(function (req, res, next) {
    var allowedOrigins = ['http://localhost:4200', 'http://localhost:3000', 'https://afterworker.herokuapp.com'];
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

DatabaseService.connect(db => {
    require('./handlers/messages.handler')(http, db);
});

http.listen(port);