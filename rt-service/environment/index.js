const env = process.env.NODE_ENV | 'dev';
console.log('env: ' + env);
if (env === 'production') {
  module.exports = require('./prod.env');
} else {
  module.exports = require('./dev.env');
}
