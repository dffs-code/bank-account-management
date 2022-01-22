const express = require('express');
const routes = require('./routes');
const database = require('./database');
const app = express();

app.use(express.json());
routes(app);

app.listen(3000, (req, res) => {
  console.log('App listening on port 3000');
})