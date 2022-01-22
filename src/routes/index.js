const account = require('./accountRouter');
const transfer = require('./transferRouter');

module.exports = (app) => {
  app.use(
    account,
    transfer
  );
};