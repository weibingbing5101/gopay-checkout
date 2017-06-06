/**
 * @file 路由验证模块
 */

'use strict';

import store from 'store';

const authCheck = (nextState, replace) => {
	if(!store.get('ffan_user')){
		replace({
			redictUrl: nextState.location.pathname
		} , '/me/login', {
			redictUrl: nextState.location.pathname
		});
	}
}

const v2Paths = [
	'/',
	'/me/login', 
  '/me/register', 
  '/me/set/pwd', 
  '/me/forgotPassword', 
  '/me/resetPassword'
]

export default {
	checkMobile,
	checkRegisterInfo,
	checkLoginInfo,
	checkModifyInfo,
	checkVerifyCodeInfo,
	checkResetInfo,
	calcPwdLevel
}