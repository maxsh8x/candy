"use strict";
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerTools = require('swagger-tools');

const token = require('./app/models/token');

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
const config = require('config');
const port = process.env.PORT || 8080;

const options = {
  server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
  replset: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
};

mongoose.connect(process.env.MONGODB_URI || config.MongodbURI, options);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const swaggerDefinition = {
  info: {
    title: 'Candy server API',
    version: '1.0.0',
    description: ''
  },
  host: 'localhost:8080',
  basePath: '/',
  securityDefinitions: {
    accessToken: {
      type: 'apiKey',
      in: 'query',
      name: 'apiKey'
    }
  }
};

const swaggerOptions = {
  swaggerDefinition: swaggerDefinition,
  apis: ['./app/routes/api/*.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
const swaggerSecurityDefinition = {
  accessToken: (req, def, scopes, callback) => {
    const authMethod = 'Token';
    const reqAuthHeader = req.get('Authorization');
    if (!reqAuthHeader) {
      return req.res.status(401).json({error: 'No auth headers'});
    }
    const [reqAuthMethod, reqAuthToken] = reqAuthHeader.split(' ');
    if (reqAuthMethod !== authMethod || !reqAuthToken) {
      return req.res.status(401).json({error: 'Invalid auth method or token'});
    }
    return token.findById(req.get('Authorization'))
      .then(dbToken => {
        if (dbToken) {
          req.user = dbToken;
          return callback();
        }
        req.res.status(401).json({error: 'Token not found'});
      });
  }
};

swaggerTools.initializeMiddleware(swaggerSpec, middleware => {
  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerSecurity(swaggerSecurityDefinition));
  app.use(middleware.swaggerValidator());
  app.use(middleware.swaggerRouter({controllers: './app/routes/api'}));
  app.use(middleware.swaggerUi());
  app.use((err, req, res, next) => {
    res.json({error: err.toString()});
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

app.listen(port);
console.log("Listening on port: " + port);

module.exports = app;
