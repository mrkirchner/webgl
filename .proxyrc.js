const {
  createProxyMiddleware,
  responseInterceptor,
} = require('http-proxy-middleware');

module.exports = function (app) {
  // Redirect Api
  app.use(
    createProxyMiddleware('/api', {
      target: 'https://cd-static.bamgrid.com/dp-117731241344/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
      selfHandleResponse: true,
      onProxyRes: responseInterceptor(
        async (responseBuffer, proxyRes, req, res) => {
          // detect json responses
          if (proxyRes.headers['content-type'] === 'application/json') {
            let utf8String = responseBuffer.toString('utf8');

            utf8String = utf8String.replace(
              /https:\/\/prod-ripcut-delivery.disney-plus.net/g,
              '/images'
            );

            utf8String = utf8String.replace(
              /https:\/\/global.edge.bamgrid.com/g,
              '/videos'
            );
            return utf8String;
          }

          // return other content-types as-is
          return responseBuffer;
        }
      ),
    })
  );

  // Redirect Images
  app.use(
    createProxyMiddleware('/images', {
      target: 'https://prod-ripcut-delivery.disney-plus.net/',
      changeOrigin: true,
      pathRewrite: {
        '^/images': '',
      },
    })
  );
};
