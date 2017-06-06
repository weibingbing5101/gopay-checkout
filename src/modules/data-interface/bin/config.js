/**
 * @file 配置
 */

//开发环境的host
export const devHost = 'http://gopendpoint.treespaper.com/';  //qa,开发的不好用
// export const devHost = 'http://goopal.xiaojian.me/';	// dev,果仁宝

//线下h5的host
// export const h5DevHost = 'http://115.28.74.240:9012/'; // qa,果付地址
export const h5DevHost = 'http://172.16.33.8:9012/'; // dev,果付地址

//sit的host
export const sitHost = 'http://gopendpoint.treespaper.com/';
//sit h5的host
// export const h5SitHost = 'http://115.28.74.240:9012/';
export const h5SitHost = 'http://172.16.33.8:9012/'; // dev,果付地址

//sandbox的host
export const sandboxHost = 'http://gopendpoint.sandbox.treespaper.com/';
//sandbox h5的host
export const sandboxH5Host = 'http://pay.sandbox.treespaper.com/'; 

//线上的host
export const onlineHost = 'https://endpoint.guorenbao.com/';
//线上h5的host
export const onlineH5Host = 'https://pay.guorenbao.com/';

//test环境的host
export const testHost = 'http://api.test.goopal.com/';
//test环境的h5的host
export const testH5Host = 'http://h5.test.goopal.com/';


export const host = {
	'prod': {
		host: onlineHost,
		h5Host: onlineH5Host
	},
	'sandbox': {
		host: sandboxHost,
		h5Host: sandboxH5Host
	},
	'test': {
		host: testHost,
		h5Host: testH5Host
	},
	'sit': {
		host: sitHost,
		h5Host: h5SitHost
	},
	'dev': {
		host: devHost,		  // 果仁宝地址
		h5Host: h5DevHost	 // 果付地址
	}
};

/**
 * 一些api path
 * @type {Object}
 */
export const apiSites = {
    /**
     * 获取微信签名
     * @type {String}
     */
	getSign :'pay/v3/payUrls',

	/**
	 * 获取微信open id
	 * @type {String}
	 */
    getOpid : 'ffan/v1/wechat/openId',


};
