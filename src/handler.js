const serverless = require('serverless-http');
const app = require('.');

module.exports.engine = serverless(app);