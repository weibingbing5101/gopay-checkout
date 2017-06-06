/**
 * @file 用户信息store
 */

'use strict';

import Reflux from 'reflux';
//个人相关操作
import UserAction from '../actions/user-action';

import store from 'store';

import cookieObj from '../modules/cookie';

const cookie = cookieObj.cookie;

//个人信息的store
let UserStore = Reflux.createStore({

	//监听的action
	listenables: UserAction,

	/**
	 * @desc 初始化个人信息
	 */
	init() {
		this.info = {};
		this.myMessage = []
	},

	/**
	 * @desc 开始登录
	 */
	login() {
		this.trigger({
			loading: true
		});
	},

	/**
	 * 退出
	 */
	logout() {
	  this.trigger({
			loading:true
		})
	},

	/**
	 * 未读消息
	 */
	unreadMessage() {
		this.trigger({
			loading: false
		})
	},

	/**
	 * 我的消息列表
	 */
	myMessageList() {
		this.trigger({
			loading: true
		})
	},

	/**
	 * 站内信删除
	 */
	deleteMessage() {
		this.trigger({
			loading: true
		})
	},

	/**
	 * 站内信阅读
	 */
	readMessage() {
	  this.trigger({
			loading: true
		})
	},

	/**
	 * @desc 登录成功
	 * @param info {Object} 个人信息
	 */
	loginCompleted(info) {
		this.info = info;
		if(info.data.pLoginToken){
			store.set('ffan_user', info.data, true);
			// 目前服务器要求手动写入ploginToken
			cookie('ploginToken', info.data.ploginToken, {
				path: '/',
				domain: '.ffan.com'
			});
		}
		this.trigger({
			info : this.info,
			loading: false
		});
	},

	/**
	 * @desc 登录失败
	 * @param error {String} 错误信息
	 */
	loginFailed(error, result) {
		this.trigger({
			error : error,
			loading: false,
			info: result
		});
	},

	/**
	 * @desc 修改密码成功
	 * @param info {Object} 个人信息
	 */
	changePwdCompleted(info) {
		this.info = info;
		this.trigger({
			info : this.info,
		});
	},

	/**
	 * @desc 修改密码失败
	 * @param error {String} 错误信息
	 */
	changePwdFailed(error) {
		this.trigger({
			error : error,
		});
	},

	/**
	 * @desc 检测用户登录成功
	 * @param info {Object} 个人信息
	 */
	checkLoginCompleted(info) {
		let localData = store.get('ffan_user');
		let data = info.data;
		delete data.uids;
		localData.member = data;

		this.info = localData;
		store.set('ffan_user', localData, true);
		this.trigger({
			info : localData
		});
	},

	/**
	 * @desc 检测用户登录失败
	 * @param error {String} 错误信息
	 */
	checkLoginFailed(error) {
		this.trigger({
			error: error
		});
	},

   /**
	 * 登出成功
	 */
	logoutCompleted(info){
		 store.remove("ffan_user");
		 this.trigger({
			 loading: false
		 })
	 },

	getUserInfo(){
		let userInfo = store.get('ffan_user');
		if(userInfo){
			this.info = store.get('ffan_user');
		}
		/*if(!this.info.uid||!this.info.member){
			this.info = store.get('ffan_user');
		}*/
		return userInfo;
	},

	/**
	 * 获取未读消息条数
	 */
	unreadMessageCompleted(data){
		this.trigger({
			loading: false,
			data: data.data
		})
	},
	unreadMessageFailed(error){
		this.trigger({
			error: error
		})
	},

	/**
	 * 我的消息列表
	 */
	myMessageListCompleted(data){
		this.myMessage = data.data;
		this.trigger({
			loading: false,
			data: data.data
		})
	},
	myMessageListFailed(error){
		this.trigger({
			loading:false,
			error:error
		})
	},

	/**
	 * 站内信删除
	 * @param data
   */
	deleteMessageCompleted(data){
		this.trigger({
			loading: false,
			data: data
		})
	},
	deleteMessageFailed(error){
		this.trigger({
			loading: false,
			error: error
		})
	},

	/**
	 * 站内信阅读
	 */
	readMessageCompleted(data){
		this.trigger({
			loading: false,
			data: data
		})
	},
	readMessageFailed(error){
		this.trigger({
			loading: false,
			error: error
		})
	}
});

export default UserStore;