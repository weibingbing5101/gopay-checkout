var expressHttpProxy = require('express-http-proxy');

var apiProxyMap = {};

var apiProxyConfig = [{
	path: '/api'
}, {
	path: '/mapi',
	allowRule: {
		host: 'm.ffan.com'
	}
}, {
	path: '/mapi/sit',
	allowRule: {
		host: 'm.sit.ffan.com'
	}
}];


function buildProxy(arg){
	var host = arg.host||'api.ffan.com',
		path = arg.path||'api';

	return expressHttpProxy(host, {
	  decorateRequest: function(req) {
	    var path = req.path;
	    path = path.replace(new RegExp('^\/'+path), '');
	    req.path = path;
	    return req;
	  }
	});
}

module.exports = function(app){

	apiProxyConfig.forEach(function(config){
		var proxy = buildProxy(config),
				allowRule = config.allowRule;
		app.use(config.path, function(req, res, next){
			var errorMsg = '';

			if(allowRule&&allowRule.host){
				res.header("Access-Control-Allow-Origin", 'http://' + allowRule.host);
		    res.header("Access-Control-Allow-Headers", "X-Requested-With");
		    res.header("Access-Control-Allow-Credentials", true);
		    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
			}
			
	    /*console.log(req.hostname)

			if(allowRule){

				if(allowRule.host&&allowRule.host !== req.hostname){
					errorMsg = '当前域名不允许访问';
				}else{
					
				}
			}*/
			if(errorMsg){
				res.header("Content-Type", "application/json;charset=utf-8");
				res.end( JSON.stringify({ 
					status: 407, 
					message: errorMsg 
				}) );
			}else{
				proxy(req, res);
			}
		});
	});


};