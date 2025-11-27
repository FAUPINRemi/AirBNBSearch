const cors = require('cors');

function configureCors() {
  const origin = process.env.CORS_ORIGIN || '*';
  const options = {
    origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 600
  };
  return cors(options);
}

module.exports = configureCors;
