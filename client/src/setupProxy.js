const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(createProxyMiddleware(['/auth', '/api'], { target: 'http://localhost:8080' }));
};
