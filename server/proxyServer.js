/**
* 反向代理
* Created by liubingi on 2016-3-10.
*/
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});

var path = require('path');
var fs = require('fs');
var express = require('express');
var app = express();

var CONF = JSON.parse(fs.readFileSync(path.join(__dirname, './ffan-nginx.conf')));
var CONF_SERVER = CONF.server[0];
var PORT = CONF_SERVER.listen;
var SERVER_NAME = CONF_SERVER.server_name;
var locationObj = CONF_SERVER.location;

function buildProxy(proxyPath, config){
	if(config.proxy_pass){
		app.get(proxyPath, function(req, res) {
	    proxy.web(req, res, { 
	    	target: config.proxy_pass 
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
