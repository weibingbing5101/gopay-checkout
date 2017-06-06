/**
 * @file 工具模块
 */

'use strict';

//加密解密模块
import JSEncrypt from './jsencrypt';
import md5 from 'md5';

/**
 * @desc 加密公钥 会经常变
 * @type {string}
 */
const pub = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAK9pW69CbvgnEWZXgSDIJdX5BrqzDzTt' +
	'y3n5O+bRSRiy3EQqb3qkGdXwpnHAWceqW0GO+k8R7z+Q+MgRFrhLBQcCAwEAAQ==';

/**
 * @desc 加密用的
 * @type {JSEncrypt|*}
 */
const en = new JSEncrypt();

export default {
	/**
	 * @desc 将json转为表单提交格式
	 * @param data
	 * @returns {string}
	 */
	formatData (data) {
		var str = [];
		for(var k in data) {
			str.push(k + '=' + data[k]);
		}
		return str.join('&');
	},

	/**
	 * @desc 对传入的密码进行加密
	 * @param password
	 */
	rsaPassword (password) {
		en.setPublicKey(pub);
		var ed = en.encrypt(md5(password));
		var s = window.atob(ed);
		var result = '';
		for(var i = 0; i < s.length; i++) {
			var c = s.charCodeAt(i).toString(16);
			if(c.length == 1) {
				result += '0';
			}
			result += c;
		}
		return result;
	}

}