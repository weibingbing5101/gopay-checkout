/**
* 代理api.ffan.com的请求
* Created by liubingi on 2016-3-18.
*/
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});

var path = require('path');
var fs = require('fs');
var express = require('express');
var app = express();

var CONF_SERVER = 'localhost';
// 端口起源：
// 'http://api.ffan.com代理http://v.ffan.com'.split('').map(function(a){ return a.charCodeAt(0) }).reduce(function(a,b){ return a+b}, 0)
var PORT = 53173;

function buildProxy(proxyPath, config){
	if(config.proxy_pass){
		app.get(proxyPath, function(req, res) {
	    proxy.web(req, res, { 
	    	target: 'http://api.ffan.com' 
	    });
	  });
	}else if(config.root){
		app.get(proxyPath, function(req, res) {
			var rootPath = path.join(__dirname, config.root)
	    res.sendFile(path.join(rootPath, req.path));
	  });
	}
}

Object.keys(locationObj).forEach(function(path){
	buildProxy(path, locationObj[path]);
})

app.listen(PORT, SERVER_NAME, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:'+ PORT);
});
