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
const cors = require('cors');
const swaggerSecurityHandlers = require('./utils/auth-gates');
module.exports = app; // for testing

const config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: swaggerSecurityHandlers
};
const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    urls: [
      {
        url: process.env.API_URL + '/swagger',
        name: 'Spec1',
      },
    ],
  },
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
app.use(cors());
SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) {
    throw err;
  }
  app.use(dbExpress.createDbConnection);
  swaggerExpress.register(app);
  app.use(dbExpress.closeDbConnection);

  const port = process.env.PORT || 8080;
  console.log(process.env.DB_NAME);
  app.listen(port);
});
