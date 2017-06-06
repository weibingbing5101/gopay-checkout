/**
 * @file 校验模块
 */

'use strict';

import $ from 'jquery';

/**
 * @desc 错误信息
 * @type {{}}
 */
const msg = {
	regex: {
		mobile: {
			msg: '请输入正确的手机号码',
			num: -1
		},
		agreement: {
			msg: '您需要同意注册协议',
			num: -1
		},
		password: {
			msg: '密码长度8-16位，至少包括数字，大写字母，小写字母及特殊符号中的两种',
			num: -1
		}
	},
	empty: {
		mobile: {
			msg: '手机号输入为空',
			num: -1
		},
		password: {
			msg: '密码输入为空',
			num: -1
		},
		vCode: {
			msg: '验证码输入为空',
			num: -1
		},
		oldPassword: {
			msg: '原密码输入为空',
			num: -1
		},
		newPassword: {
			msg: '新密码输入为空',
			num: -1
		},
		confirmPassword: {
			msg: '确认密码输入为空',
			num: -1
		}
	},
	equal: {
		newPassword: {
			msg: '新密码和确认密码不一致',
			num: -1
		}
	},
	passwordLevel: {
		invalid: {
			msg: '密码中包含非法字符',
			num: -1
		},
		minLimit: {
			msg: '密码至少包含8位',
			num: -1
		},
		single: {
			msg: '密码长度8-16位，至少包括数字，大写字母，小写字母及特殊符号中的两种',
			num: -1
		}
	}
};

// 密码允许的特殊字符
const PWD_RULES = {
	SPECIAL: /[\~|\`|\@|\#|\$|\%|\^|\&|\*|\-|\_|\=|\+|\||\|\?|\/|\(|\)|\<|\>|\[|\]|\{|\}|\"|\,|\.|\;|\'|\!]/,
	LOWER: /[a-z]/,
	UPPER: /[A-Z]/,
	NUMBER: /[0-9]/
};
const PWD_INVALID_CHARS =  /[^\~|\`|\@|\#|\$|\%|\^|\&|\*|\-|\_|\=|\+|\||\|\?|\/|\(|\)|\<|\>|\[|\]|\{|\}|\"|\,|\.|\;|\'|\!|a-z|A-Z|0-9]/;

/**
 * @desc 判断输入是否为空
 * @param type
 * @param value
 * @returns {string}
 */

/**
 * @desc 判断是否同意协议
 * @param checked
 * @returns {string}
 */
function checkAgreement(checked) {
	return checked ? 'pass' : msg['regex']['agreement'];
}

function checkEqual(type, val1, val2){
	return val1 === val2 ? 'pass' : msg['equal'][type];
}

/**
 * @desc 检测密码有效性
 * @param password
 * @returns {*}
 */
function checkPasswordLevel(password){
	let levelObj = getPwdLevelObj(password)
	return levelObj.level<1 ? levelObj.error : 'pass';
}

/**
 * @desc 短路检查校验结果，只要有一个错误马上终止并返回错误
 * @param ars
 * @returns {*}
 */
function shortCalcResult(...ars) {
	var deferred = $.Deferred();
	let hasError = ars.some(function(item) {
		let result = item ? item[0].apply(this, item.slice(1)) : 'pass';
		if(result !== 'pass') {
			deferred.reject(result.msg || '未知错误');
			return true;
		}
	});
	if(!hasError){
		deferred.resolve(true);
	}
	return deferred.promise();
}

/**
 * @desc 检查手机号是否合法
 * @param mobile 手机号
 * @returns {*}
 */
function checkMobile(mobile) {
	return shortCalcResult(
		[checkPhoneNumber, mobile]
	)
}

/**
 * @desc 检查用户注册信息是否合法
 * @param info
 * @param info.mobile 手机号
 * @param info.password 密码
 * @param info.vCode 手机验证码
 * @param info.agree 是否同意用户注册协议
 */
function checkRegisterInfo(info) {
	return shortCalcResult(
		[checkEmpty, 'mobile', info.mobile || ''],
		[checkPhoneNumber, info.mobile || ''],
		[checkEmpty, 'vCode', info.vCode || ''],
		[checkPasswordLevel, info.password || ''],
		[checkAgreement, info.agree]
	);
}

function checkLoginInfo(info) {
	return shortCalcResult(
		[checkEmpty, 'mobile', info.mobile || ''],
		[checkPhoneNumber, info.mobile || ''],
		(info.hasOwnProperty('vcode') ? [checkEmpty, 'vCode', info.vcode || ''] : ''),
		[checkEmpty, 'password', info.password || '']
	)
}

function checkModifyInfo(info) {
	return shortCalcResult(
		[checkEmpty, 'oldPassword', info.oldPwd || ''],
		[checkEmpty, 'newPassword', info.newPwd || ''],
		[checkPasswordLevel, info.newPwd||''],
		[checkEmpty, 'confirmPassword', info.newPwd2 || ''],
		[checkEqual, 'newPassword', info.newPwd, info.newPwd2]
	);
}

function checkResetInfo(info) {
	return shortCalcResult(
		[checkEmpty, 'newPassword', info.newPwd || ''],
		[checkPasswordLevel, info.newPwd||''],
		[checkEmpty, 'confirmPassword', info.newPwd2 || ''],
		[checkEqual, 'newPassword', info.newPwd, info.newPwd2]
	);
}

function checkVerifyCodeInfo(info){
	return shortCalcResult(
		[checkEmpty, 'mobile', info.mobile || ''],
		[checkPhoneNumber, info.mobile || ''],
		[checkEmpty, 'vCode', info.vCode || '']
	);
}


/**
 * @desc 只检测密码强度， 不检测是否合法
 * @param password
 * @returns {*}
 */
function getPwdLevelObj(val){

	if(!val){
		return { 
			level: -1,
			error: msg.empty.password
		}
	}

	let errorMsg = msg.passwordLevel;
	let levelData = { level: 0 };
	let len = val.length;

	// 无效密码
	if(len < 8 || len > 16 || PWD_INVALID_CHARS.test(val)){
		levelData.error = msg['regex']['password'];
	}else{
		let typeNum = 0;
		let rulesUse = [];
		Object.keys(PWD_RULES).forEach(function(key){
			let reg = PWD_RULES[key];
			if(reg.test(val)){
				typeNum++;
				rulesUse[key] = true;
			}
		});


		switch(typeNum){
			case 0: 
			case 1:
				levelData.error = msg['regex']['password'];
				levelData.level = 0;
			break;
			case 2:
				levelData.level = len > (rulesUse.NUMBER ? 12 : 11)  ? 2 : 1;
			break;
			case 3:
				levelData.level = len > 10  ? 2 : 1;
			break;
			case 4:
				levelData.level = len > 9  ? 2 : 1;
			break;
		}
	}
	return levelData;
}

function calcPwdLevel(val){
	return getPwdLevelObj(val).level;
}


// 手机号验证
function mobileUnValidate(mobile) {
	return !/^1[34578][0-9]{9}$/.test(mobile);
};
// 是否为空
function isEmpty(value) {
	return value===null||value===undefined||$.trim(value) === '';
};
// 银行卡号长度是否够
function limitLength(min,max,value){
	if(min && max && value && value.length){
		return (value.length >=parseFloat(min) && value.length<= parseFloat(max)) ? false : true; 
	}
};
// 判断是否为真实姓名 
function isRealName(value){
	return /^[\u2E80-\u9FFF]{2,4}$/.test(value) ? false : true;
};
// 判断是否为真实身份证号
function isRealIDNumber(value){
	return /(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value) ? false : true;
};

function isMoney(val){
	return !isNaN(val)&& parseFloat(val) >= 0.01 && val.search(/^0{2,}\./) < 0 && val.search(/^0{1,}\d/) < 0;
}

export {isMoney}

export default {
	mobileUnValidate,
	isEmpty,
	limitLength,
	isRealName,
	isRealIDNumber,
	isMoney
}