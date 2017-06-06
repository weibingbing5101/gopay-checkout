/**
 * @file 用户信息store
 */

'use strict';

import Reflux from 'reflux';
//个人相关操作
import GYUserAction from '../actions/gy-user-action';

import store from 'store';

import cookieObj from '../modules/cookie';

const cookie = cookieObj.cookie;

import _ from 'lodash';


let storeData = {};

//个人信息的store
let GYUserStore = Reflux.createStore({

	//监听的action
	listenables: GYUserAction,
	/*
	login() {
		this.trigger({
			loading: true
		});
	},
	*/


	// 登录成功
	// {"data":{"gopToken":"d5610892684b4523a1c2547b59318e37"},"msg":"success","status":"200"}
	loginCompleted(info) {
		console.log(info);
		this.info = info;
		
		if(info.data && info.data.gopToken){
			// store.set('gopUser', info.data, true);
			let expireTime = new Date();
			expireTime.setMonth(expireTime.getMonth()+12);
			cookie('gopToken', info.data.gopToken,{'expires': expireTime});
		}
		this.trigger({
			info : this.info,
		});
	},
	
	// @desc 登录失败
	// {msg: "服务器异常", status: "304"}  服务器返回
	// {error: "服务器异常", info: {msg: "服务器异常", status: "304"}}
	loginFailed(error, result) {
		console.log({
			error : error,
			info: result
		});
		this.trigger({
			error : error,
			info: result
		});
	},
	
	// 图形验证码接口
	getCreateImageCompleted(info) {
		this.info = info;
		this.trigger({
			info : this.info,
			type:'getCreateImage'
		});	
	},
	getCreateImageFailed(error, result) {
		this.trigger({
			error : error,
			info: result
		});
	},

	// 发送验证码
	sendCaptchaCompleted(info) {
		this.info = info;
		this.trigger({
			info : this.info,
			type:'sendCaptcha'
		});	
	},
	sendCaptchaFailed(error, result) {
		this.trigger({
			error : error,
			info: result
		});
	},

	// 验证验证码是否正确
	identifyingCodeCompleted(info) {
		this.info = info;
		this.trigger({
			info : this.info,
			type:'identifyingCode'
		});	
	},
	identifyingCodeFailed(error, result) {
		this.trigger({
			error : error,
			info: result
		});
	},


	// 获取银行卡列表  是否绑定银行卡
	getBankcardListCompleted(info) {
		this.info = info;
		this.trigger({
			info : this.info,
			type:'bankcardList'
		});	
	},
	getBankcardListFailed(error, result) {
		this.trigger({
			error : error,
			info: result
		});
	},

	// 获取银行卡信息
	getBankInfoCompleted(info) {
		this.info = info;
		console.log(info);
		if(this.info){
			storeData.bankcardInfo =  {
				bankName: info.data.bankName,
				cardType: info.data.cardType,
				cardNo: info.data.cardNo
			};
			console.log(storeData.bankcardInfo);
			this.trigger({
				info : this.info,
				type: 'getBankInfo'
			});
		}
	},
	getBankInfoFailed(error, result) {
		this.trigger({
			error : error,
			info: result
		});
	},
	getBankInfoStore(){
		return storeData.bankcardInfo;
	},

	// 绑定银行卡
	bindBankcardCompleted(info) {
		this.info = info;
		this.trigger({
			info : this.info
		});	
	},
	bindBankcardFailed(error, result) {
		this.trigger({
			error : error,
			info: result
		});
	},


	// 是否实名认证	
	isAuthenticationCompleted(info) {
		this.info = info;
		console.log(info);
		if(this.info){
			this.trigger({
				info : this.info,
				type: 'isAuthentication'
			});			
		}
	},
	isAuthenticationFailed(error, result) {
		this.trigger({
			error : error,
			info: result
		});
	},

	// 实名认证	
	authenticationCompleted(info) {
		this.info = info;
		if(this.info){
			this.trigger({
				info : this.info,
				type: 'authentication'
			});			
		}
	},
	authenticationFailed(error, result) {
		this.trigger({
			error : error,
			info: result,
			type: 'authentication'
		});
	},

	// 获取实名认证信息
	getAuthenticationInfoCompleted(info) {
		this.info = info;
		console.log(info);
		if(this.info){
			this.trigger({
				info : this.info,
				type: 'authentication'
			});			
		}
	},
	getAuthenticationInfoFailed(error, result) {
		this.trigger({
			error : error,
			info: result
		});
	},


	// 果仁不够  创建买果仁订单
	creatGopBuyInOrderCompleted(info) {
		this.info = info;
		if(this.info){
			this.trigger({
				info : this.info,
				type: 'creatGopBuyInOrder'
			});			
		}
	},
	creatGopBuyInOrderFailed(error, result) {
		this.trigger({
			error : error,
			info: result
		});
	},

	// 买果仁或者账单付款 确认支付接口
	GopCashieCnfmPayCompleted(info) {
		this.info = info;
		if(this.info){
			this.trigger({
				info : this.info,
				type: 'GopCashieCnfmPay'
			});			
		}
	},
	GopCashieCnfmPayFailed(error, result) {
		this.trigger({
			error : error,
			info: result,
			type: 'GopCashieCnfmPay'
		});
	},
	GopCashieQueryPayCompleted(info) {
		this.info = info;
		if(this.info){
			this.trigger({
				info : this.info,
				type: 'GopCashieQueryPay'
			});			
		}
	},
	GopCashieQueryPayFailed(error, result) {
		this.trigger({
			error : error,
			info: result,
			type:'GopCashieQueryPay'
		});
	},

	//  预支付  接口
	prePayCompleted(info) {
		this.info = info;
		if(this.info){
			this.trigger({
				info : this.info,
				type: 'prePay'
			});			
		}
	},
	prePayFailed(error, result) {
		this.trigger({
			error : error,
			info: result,
			type: 'prePay'
		});
	},

	//支付限额接口
	validateUserCompleted(info){
		this.info = info;
		if (this.info) {
			this.trigger({
				info:this.info,
				type:'validateUser'
			});
		}
	},
	validateUserFailed(error,result){
		this.trigger({
			error:error,
			info:result
		});
	},

	//用户支付状态接口
	checkPayPasswordStatusCompleted(info){
		this.info = info;
		if (this.info) {
			this.trigger({
				info:this.info,
				type:'checkPayPasswordStatus'
			});
		}
	},
	checkPayPasswordStatusFailed(error,result){
		this.trigger({
			error:error,
			info:result,
			type:'checkPayPasswordStatus'
		});
	},

	//创建订单接口
	AppHandleCompleted(info){
		this.info = info;
		if (this.info) {
			this.trigger({
				info:this.info,
				type:'AppHandle'
			});
		}
	},
	AppHandleFailed(error,result){
		this.trigger({
			error:error,
			info:result
		});
	},

	//果仁牌价查询接口
	GopCashieGopPriceCompleted(info){
		this.info = info;
		if (this.info) {
			this.trigger({
				info:this.info,
				type:'GopCashieGopPrice'
			});
		}
	},

	GopCashieGopPriceFailed(error,result){
		this.trigger({
			error:error,
			info:result
		});
	},

	//果仁订单信息查询接口
	GopCashieGetOrderInfoCompleted(info){
		this.info = info;
		if (this.info) {
			this.trigger({
				info:this.info,
				type:'GopCashieGetOrderInfo'
			});
		}
	},

	GopCashieGetOrderInfoFailed(error,result){
		this.trigger({
			error:error,
			info:result
		});
	},


	//查询支付密码是否正确接口
	checkPayPwdCompleted(info){
		this.info = info;
		if (this.info) {
			this.trigger({
				info:this.info,
				type:'checkPayPwd'
			});
		}
	},
	checkPayPwdFailed(error,result){
		this.trigger({
			error:error,
			info:result,
			type:'checkPayPwd'
		});
	},

	//果仁宝静态资源接口
	commonStaticCompleted(info){
		this.info = info;
		if (this.info) {
			this.trigger({
				info:this.info,
				type:'commonStatic'
			});
		}
	},

	commonStaticFailed(error,result){
		this.trigger({
			error:error,
			info:result,
			type:'commonStatic'
		});
	},


	// 找回 设置密码  手机验证码校验
	phoneIdentifyingCodeCompleted(info){
		this.info = info;
		console.log(this.info);
		if (this.info) {
			this.trigger({
				info:this.info,
				type:'phoneIdentifyingCode'
			});
		}
	},
	phoneIdentifyingCodeFailed(error,result){
		this.trigger({
			error:error,
			info:result
		});
	},

	// 获取用户信息手机号 
	getUserInfoCompleted(info){
		this.info = info;
		if (this.info) {
			this.trigger({
				info:this.info,
				type:'getUserInfo'
			});
		}
	},
	getUserInfoFailed(error,result){
		this.trigger({
			error:error,
			info:result
		});
	},

	// 找回 设置密码  实名认证校验
	checkIDcardCompleted(info){
	this.info = info;
	if (this.info) {
		this.trigger({
			info:this.info,
			type:'checkIDcard'
		});
	}
	},
	checkIDcardFailed(error,result){
		this.trigger({
			error:error,
			info:result
		});
	},
});
// 获取银行卡相关方法
const bankCangory = {
	SAVINGS_DEPOSIT_CARD : '储蓄卡',
};
const getLastCardNo = function(num){
	return num.substring(num.lastIndexOf('*')+1,num.length);
}; 

export default GYUserStore;