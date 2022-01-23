const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express')
const database = require('./database');
const swaggerDocs = require('./swagger.json');
const app = express();


app.use(express.json());
routes(app);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.listen(3000, (req, res) => {
  console.log('App listening on port 3000');
})