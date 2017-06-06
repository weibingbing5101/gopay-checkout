var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('../webpack.config.dev');

var expressHttpProxy = require('express-http-proxy');

var app = express();
var compiler = webpack(config);


var PORT = 6221;

var apiProxy = expressHttpProxy('api.sit.ffan.com', {
  decorateRequest: function(req) {
    var path = req.path;
    path = path.replace(/^\/api/, '');
    req.path = path;
    return req;
  }
});

var rootDir = path.join(__dirname, '../');

// 代理api的接口
app.use('/api', function(req, res){
  apiProxy(req, res);
});

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

// 所有静态页面
app.get('/view/*', function(req, res) {
	res.sendFile(path.join(rootDir, req.path));
});

// js、css、html静态资源
  app.use('/static', express.static(path.join(rootDir + '/static')));
  app.use('/view', express.static(path.join(rootDir + '/view')));
  app.use('/favicon.ico', express.static(path.join(rootDir + '/favicon.ico')));

app.get('*', function(req, res) {
  console.log(111)
  res.sendFile(path.join(rootDir, 'index.html'));
});


app.listen(PORT, '0.0.0.0', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:'+PORT);
});
