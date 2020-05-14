'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const routeCreator = require('../service/route-creator');
const homeDoc = require('../service/home-doc');
const params = require('../config/params');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(params.publicFolder));

app.use( function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
})

routeCreator(app);

homeDoc(app);

module.exports = app;

