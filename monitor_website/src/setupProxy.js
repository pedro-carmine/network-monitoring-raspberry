const { createProxyMiddleware } = require('http-proxy-middleware');
const version = require('./version');

module.exports = function(app) {
    app.use(
        createProxyMiddleware(
            `/${version}`,
            {
            target: 'http://localhost:8080',
            changeOrigin: true,
        })
    );
};