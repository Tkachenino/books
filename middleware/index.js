const notFoundMiddleware = require('./not-found');
const loggerMiddleware = require('./logger');
const fileMiddleware = require('./file');
const counterMiddleware = require('./counter');

module.exports = {
  notFoundMiddleware,
  loggerMiddleware,
  fileMiddleware,
  counterMiddleware
}