/**
 * @file 用户中心相关
 */

'use strict';

import { getData, postData, putData, deleteData } from './get-data';
//工具模块
import tool from './tool';
import store from 'store';
import $ from 'jquery';
import cookieObj from '../../cookie';

import { globalConfig } from '../../config';

const cookie = cookieObj.cookie;

export default {
  checkLogin,
	login,
	register,
	logout,
	changePwd,
	setNewPwd,
	verifyCodes,
	checkVerifyCode,
  unreadMessage,
  myMessageList,
  deleteMessage,
  readMessage
}

/**
 * @method login
 * @desc 登录
 * @param data
 * @param data.type {String} 注册类型 手机为1
 * @param data.mobile {String} 手机号
 * @param data.password {String} 密码
 * @returns {*}
 */
function login(data) {
	return postData('ffan/v2/member/login', {
		data: tool.formatData( $.extend(data, {
      password: tool.rsaPassword(data.password),
      type: 1,
      userName: data.mobile
    }) )
	});
}

/**
 * @desc 发送短信验证码 同一个手机号1分钟内只能发送一次 5分钟内有效
 * @param data { Object } 请求数据
 * @param data.mobile { String } 手机号
 * @param data.type { Number } 验证码类型(VerifyCodeType枚举) 1 注册
 */
function verifyCodes(data) {
	return postData('ffan/v1/member/verifycodes', {
		data: tool.formatData({
			mobile: data.mobile,
			type: data.type|| globalConfig.VC_TYPE.REGISTER
		})
	});
}

/**
 * @desc 注册新用户
 * @param data 传入参数
 * @param data.mobile {String} 手机号
 * @param data.vCode {String} 验证码
 * @param data.password {String} 密码
 * @returns {*}
 */
function register(data) {
	return postData('ffan/v1/member/register', {
		data: tool.formatData({
			userNameType: 2,
			userName: data.mobile,
			mobile: data.mobile,
			verifyCode: data.vCode,
			channel: 1,
			password: tool.rsaPassword(data.password)
		})
	});
}

function logout(data) {
  return postData('ffan/v1/member/login',{
    data: tool.formatData({
			type: 3,
			puid: data.puid,
			pLoginToken: data.pLoginToken
		})
  });
};

/*修改密码
 @uid 必选 String 会员ID
 @loginToken 可选 String 万汇必选，需要验证token有效性
 @oldPwd 必选 String 旧密码
 @newPwd 必选 String 新密码*/
function changePwd(data) {
  return putData('ffan/v1/member/newpass', {
    data: tool.formatData({
			puid: data.puid,
			pLoginToken: data.pLoginToken,
			oldPwd: tool.rsaPassword(data.oldPwd),
			newPwd: tool.rsaPassword(data.newPwd)
    })
  });
}

/*找回密码
 @userName 必选 String 用户名
 @userNameType 必选 int 用户名类型（userNameType枚举)
 @verifyCode 必选 String 验证码（已经通过短信下行）
 @newPwd 可选 String 新登陆密码*/
function setNewPwd(data) {
  return putData('ffan/v1/member/resetpass', {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: tool.formatData({
    	verifyCode: data.verifyCode,
    	userName: data.userName,
    	userNameType: globalConfig.USER.TYPE.MOBILE,
    	newPwd: tool.rsaPassword(data.newPwd)
    })
  });
}

/*校验短信验证码
 @mobile 必选 String 手机号
 @type 必选 int 验证码类型(VerifyCodeType枚举)
 @verifyCode 必选 String 验证码
 @loginToken 可选 String 注册、登陆、重置登陆密码等不需要登陆的类型不传，其他登陆以后发验证码的类型必传
* */
function checkVerifyCode(data) {
  return getData('ffan/v1/member/verification', {
    params: {
      appid: globalConfig.APPID,
      channel: globalConfig.CHANNEL,
      mobile: data.mobile,
      type: globalConfig.VC_TYPE.GORGETPWD,
      userName: data.mobile,
      userNameType: globalConfig.USER.TYPE.MOBILE,
      verifyCode: data.verifyCode
    }
  });
};

function checkLogin(){
  let deferred = $.Deferred();
  let uid = cookie('puid');
  let pLoginToken = cookie('ploginToken');
  if(uid&&pLoginToken){
    let data = {
      keyword: uid,
      pLoginToken: pLoginToken,
      keywordType: 0,
      appid: 'feifan'
    }
    getData('userplatform/v1/users', {
      params: data
    })
    .then(function(info) {
      deferred.resolve(info);
    })
    .fail(function(msg) {
      deferred.reject('未登录');
    });
  }else{
    deferred.reject('未登录');
  }

  return deferred.promise();
}

/**
 * 未读消息条数
 * @returns {*}
 */
function unreadMessage(data){
  return getData('ffan/v1/message/unreadNum',{
    data: data
  })
}

/**
 * 我的消息列表
 */
function myMessageList(data){
  return getData('msgcenter/v1/mailInboxes/' + data.uid ,{
    data: data.params
  })
}

/**
 * 消息删除
 * @param data
 */
function deleteMessage(data){
  return deleteData('msgcenter/v1/mailInboxes/' + data.uid + '/'+ data.mailIds)
}

/**
 * 消息阅读
 * @param data
 */
function readMessage(data){
  return putData('msgcenter/v1/mailInboxes/' + data.uid + '/'+ data.mailId,{
    data: data.params
  })
}