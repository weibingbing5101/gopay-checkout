var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');

var app = express();
var compiler = webpack(config);
var PORT = 6221;

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('/view/*',function(request, response){
  response.sendFile(__dirname + request.originalUrl);
});

app.get('/m_ffan', function(req, res) {
  var code = req.query.code;
  var state = req.query.state;
  res.redirect('http://m.ffan.com/#/pay/chose?code='+code+'&state='+state);
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.dev.html'));
});



app.listen(6221, '0.0.0.0', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:'+6221);
});
