/**
 * @file 用户功能action
 */

'use strict';

import Reflux from 'reflux';
//数据请求模块
import { userInterface } from '../modules/data-interface';

//跟用户相关的操作都放在这里
const UserAction = Reflux.createActions(
	[
		{
			'login': { children: ['completed', 'failed'] }
		},
		{
			'changePwd': { children: ['completed', 'failed'] }
		},
		{
			'checkLogin': {children: ['completed', 'failed']}
		},
		{
			'logout': { children: ['completed', 'failed'] }
		},
		{
			'unreadMessage': { children: ['completed', 'failed'] }
		},
		{
			'myMessageList': { children: ['completed', 'failed'] }
		},
		{
			'deleteMessage': { children: ['completed', 'failed'] }
		},
		{
			'readMessage': { children: ['completed', 'failed'] }
		}
	]
);

/**
 * @desc 登录操作
 */
UserAction.login.listen(function(data) {
	userInterface.login(data)
	.then(function(result) {
		this.completed(result);
	}.bind(this))
	.fail(function(msg, result) {
		this.failed(msg, result);
	}.bind(this))
});

/*修改密码
 @uid 必选 String 会员ID
 @loginToken 可选 String 万汇必选，需要验证token有效性
 @oldPwd 必选 String 旧密码
 @newPwd 必选 String 新密码*/
UserAction.changePwd.listen(function(data) {
	userInterface.changePwd(data).then(function(result) {
		this.completed(result);
	}.bind(this)).fail(function(msg) {
		this.failed(msg||'未知错误');
	}.bind(this))
});

/**
 * @desc 检测登录
 */
UserAction.checkLogin.listen(function() {
	userInterface.checkLogin().then(function (result) {
		this.completed(result);
	}.bind(this)).fail(function (msg) {
		this.failed(msg || '用户未登录');
	}.bind(this))
});

/**
 * 登出
 */
UserAction.logout.listen(function (data) {
	userInterface.logout(data)
	.then(function (result) {
		this.completed(result)
	}.bind(this))
	.fail(function (msg) {
	}.bind(this))
});

/**
 * 未读消息
 */
UserAction.unreadMessage.listen(function (data) {
  userInterface.unreadMessage(data)
		.then(function (result) {
			this.completed(result)
		}.bind(this))
		.fail(function (msg) {
		}.bind(this))
});

/**
 * 我的消息列表
 */
UserAction.myMessageList.listen(function (data) {
	userInterface.myMessageList(data)
		.then(function (result) {
			this.completed(result)
		}.bind(this))
		.fail(function (msg) {
		}.bind(this))
});

/**
 * 删除我的消息
 */
UserAction.deleteMessage.listen(function (data) {
	userInterface.deleteMessage(data)
		.then(function (result) {
			this.completed(result)
		}.bind(this))
		.fail(function (msg) {
		}.bind(this))
});

/**
 * 阅读我的消息
 */
UserAction.readMessage.listen(function (data) {
	userInterface.readMessage(data)
		.then(function (result) {
			this.completed(result)
		}.bind(this))
		.fail(function (msg) {
		}.bind(this))
})

export default UserAction;