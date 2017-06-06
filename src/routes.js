/**
 * @file 路由模块
 */

'use strict';

import React from 'react';
import store from 'store';
import { Router, Route, IndexRoute, Redirect } from 'react-router';
import cookieObj from './modules/cookie';
const cookie = cookieObj.cookie;
// hash router
//import createHashHistory from 'history/lib/createHashHistory';
// html5 router 
import createBrowserHistory from 'history/lib/createBrowserHistory'


import Common from './pages/Common/common';

import Login from './pages/Login/login.jsx';
import IsPayEnough from './pages/IsPayEnough/is-pay-enough.jsx';
import BuyGop from './pages/BuyGop/buy-gop.jsx';
import AddBankCard from './pages/AddBankCard/add-bank-card.jsx';
import AddBankCardStep from './pages/AddBankCard/add-bank-card-step.jsx';
import Authentication from './pages/Authentication/authentication.jsx';
import PayProcess from './pages/PayProcessing/PayProcessing.js';
import PayFail from './pages/PayFail/PayFail.js';
import PaySuccess from './pages/PaySuccess/PaySuccess.js';
import PayOvertime from './pages/PayOvertime/PayOvertime';
import SentPhoneCode from './pages/SentPhoneCode/sentphonecode';
import WriteAuthenticationInfo from './pages/WriteAuthenticationInfo/writeauthenticationinfo';
import ResetPasswordStepOne from './pages/ResetPasswordStepOne/resetpasswordstepone';
import ResetPasswordStepTwo from './pages/ResetPasswordStepTwo/resetpasswordsteptwo';

import PayUnconnect from './pages/PayUnconnect/PayUnconnect.js';
import Help from './pages/Help';
import GopPayHelp from './pages/GopPayHelp/GopPayHelp.js';
import CreateOrder from './pages/CreateOrder/CreateOrder';
import CreateInputOrder from './pages/CreateOrder/Input';
import SupportBankList from './pages/SupportBankList/SupportBankList';
import CreateOrderMarket from './pages/CreateOrderMarket/CreateOrderMarket';

//history的配置
const historyOptions = {
	queryKey : false
};


let needTokenPageJson = {
	'/is_pay_enough':true,
	'/buy_gop':true,
	'/add_bank_card':true,
	'/authentication':true
};

const authCheck = (nextState, replace) => {
	// console.log(cookie('gopToken'));
	//store.get('gopUser')   cookie('gopToken')
	
	// if(!cookie('gopToken') && needTokenPageJson[nextState.location.pathname]){
	// 	replace({
	// 		redirectUrl: nextState.location.pathname
	// 	} , '/', {});
	// }
	
}

const IsNeedLogin = (nextState,replace) =>{
	if (cookie('gopToken')) {
		replace({
			redirectUrl:nextState.location.pathname	
		},'/is_pay_enough'+nextState.location.search,{});
	}
}

const routes = (
	<Router history={createBrowserHistory(historyOptions)}>
		<Route path='/' onEnter={ authCheck }>
			<Route path="help">
				<IndexRoute component={Help} />
				<Route path="index" component={Help} />
				<Route path="gop_pay_help" component={GopPayHelp} />
			</Route>

			<Route component={ Common }>
				<IndexRoute component={Login} />
				<Route path="create_order" component={CreateOrder}/>
				<Route path="create_order_market" component={CreateOrderMarket} />
				<Route path="createOrder">
					<Route path="input" component={CreateInputOrder} />
				</Route>
				<Route path="home_login" component={ Login } onEnter={IsNeedLogin} />
				<Route path="is_pay_enough" component={ IsPayEnough } onEnter={ authCheck }/>
		  		<Route path="buy_gop" component={ BuyGop } onEnter={ authCheck }/>
		  		<Route path="add_bank_card" component={ AddBankCard } onEnter={ authCheck }/>
		  		<Route path="add_bank_card_step" component={ AddBankCardStep } onEnter={ authCheck }/>
		  		<Route path="support_bank_list" component={SupportBankList} onEnter={authCheck}/>
		  		<Route path="authentication" component={ Authentication } onEnter={ authCheck }/>
	      		<Route path="sent_phone_code" component={ SentPhoneCode } onEnter={ authCheck }/>
	      		<Route path="write_authentication_info" component={ WriteAuthenticationInfo } onEnter={ authCheck }/>
	      		<Route path="reset_password_step_one" component={ ResetPasswordStepOne } onEnter={ authCheck }/>
	      		<Route path="reset_password_step_two" component={ ResetPasswordStepTwo } onEnter={ authCheck }/>
				<Route path="pay_process" component={ PayProcess } onEnter={ authCheck }/>
		  		<Route path="pay_fail" component={ PayFail } onEnter={ authCheck }/>
		  		<Route path="pay_success" component={ PaySuccess } onEnter={ authCheck }/>
		  		<Route path="pay_overtime" component={ PayOvertime } onEnter={ authCheck }/>
		  		<Route path="pay_unconnect" component={PayUnconnect} onEnter={authCheck}/>
				<Route path="*" component={ Login }/>
			</Route>	

			
		</Route>
	</Router>
);

export default routes;
