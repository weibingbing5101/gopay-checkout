/**
* 静态服务器
* Created by liubingi on 2016-3-10.
*/
var path = require('path');
var express = require('express');
var app = express();



var console = require('./modules/log');
var apiProxy = require('./modules/apiProxy');

var port = 30785;
var rootDir = path.join(__dirname, '../');





var API_TIMEOUT = 3000;
var DEFAULT_PATH = '/flashbuy';

runServer();

function runServer(cb){
  // TODO:过滤、路径写死、接口错误监控、错误页跳转、对pm2监控

  apiProxy(app);

  // js、css、html静态资源
  app.use('/static', express.static(path.join(rootDir + '/static')));
  app.use('/view', express.static(path.join(rootDir + '/view')));
  app.use('/favicon.ico', express.static(path.join(rootDir + '/favicon.ico')));

  //app.all('*', checkAuth, checkSecute)

  app.get('*', function(req, res) {
    // 日志记录
    res.sendFile(path.join(rootDir, 'index.html'));
  });

  // 将所有请求全部转发到首页
  /*app.get('/goods/:id', function(req, res) {
    console.log(req.url);
    res.redirect('/#'+req.path);
  });*/

  app.listen(port, 'localhost', function(err) {
    if (err) {
      console.log(err);
      return;
    }
    cb&&cb();
    console.log('Listening at http://localhost:'+ port);
  });
}
