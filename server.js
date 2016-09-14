"use strict";
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');

const config = require('config');

const options = {
  server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
  replset: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
};

mongoose.connect(config.MongodbURI, options);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const swaggerDefinition = {
  info: {
    title: 'Candy server API',
    version: '1.0.0',
    description: ''
  },
  host: 'localhost:8080',
  basePath: '/'
};

const swaggerOptions = {
  swaggerDefinition: swaggerDefinition,
  apis: ['./app/routes/api/*/index.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// CORS for swagger
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.use(bodyParser.json({type: 'application/json'}));
app.use('/api', require('./app/routes/api'));

if (process.env.NODE_ENV) {
  console.log("Environment: " + process.env.NODE_ENV);
} else {
  console.log("Define suitable NODE_ENV in your system");
  process.exit();
}

app.listen(config.port);
console.log("Listening on port: " + config.port);

module.exports = app;
