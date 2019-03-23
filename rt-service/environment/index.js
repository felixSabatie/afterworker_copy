const env = process.env.NODE_ENV | 'dev';

if (env === 'production') {
  module.exports = require('./prod.env');
} else {
  module.exports = require('./dev.env');
}
