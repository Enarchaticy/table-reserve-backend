'use strict';
/*
* @TODO Rewrite this whole swagger-express-mw
*   Full of vulnerability and can't migrate up.
* */
require('./utils/hack');
const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const swaggerUi = require('swagger-ui-express');
const dbExpress = require('./utils/db');
module.exports = app; // for testing

const config = {
  appRoot: __dirname // required config
};
const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    urls: [
      {
        url: 'http://127.0.0.1:8080/swagger',
        name: 'Spec1'
      }
    ],
  }
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, swaggerUiOptions));

app.use((req, res, next) => {
  res.oJson = res.json;
  res.oSend = res.send;
  res.json = function() {
    req.dbClient.close();
    this.oJson(...arguments);
  };
  res.send = function() {
    req.dbClient.close();
    this.oSend(...arguments);
  };
  next();
});

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }
  app.use(dbExpress.createDbConnection);
  swaggerExpress.register(app);
  app.use(dbExpress.closeDbConnection);

  const port = process.env.PORT || 8080;
  app.listen(port);
});
