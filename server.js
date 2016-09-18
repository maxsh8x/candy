"use strict";
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerTools = require('swagger-tools');

const config = require('config');
const port = process.env.PORT || 8080;

const options = {
  server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
  replset: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
};

mongoose.connect(config.MongodbURI || process.env.MONGODB_URI, options);
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
  apis: ['./app/routes/api/*.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

swaggerTools.initializeMiddleware(swaggerSpec, middleware => {
  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerValidator());
  app.use(middleware.swaggerRouter({controllers: './app/routes/api'}));
  app.use(middleware.swaggerUi());
  app.use((err, req, res, next) => {
    res.json({
      successful: false,
      message: err.toString()
    });
    next();
  });
});

// CORS for swagger
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

if (process.env.NODE_ENV) {
  console.log("Environment: " + process.env.NODE_ENV);
} else {
  console.log("Define suitable NODE_ENV in your system");
  process.exit();
}

app.listen(port);
console.log("Listening on port: " + port);

module.exports = app;
