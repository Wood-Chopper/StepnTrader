const PROXY_CONFIG = {
  "/stepn": {
    "target": "https://api.stepn.com",
    "changeOrigin": true,
    "pathRewrite": {
      "^/stepn": "/"
    },
    "secure": false,
    "logLevel": "debug"
  },
  "/api": {
    "target": "http://localhost:3000",
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": "/"
    },
    "secure": false,
    "logLevel": "debug"
  }
};
module.exports = PROXY_CONFIG;
