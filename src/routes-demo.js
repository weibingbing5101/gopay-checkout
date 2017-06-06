/**
 * @file 路由模块
 */

'use strict';

import React from 'react';
import { Router, Route, IndexRoute, Redirect } from 'react-router';
// hash router
//import createHistory from 'history/lib/createHashHistory';
// html model router 
import createBrowserHistory from 'history/lib/createBrowserHistory'

//闪购
import { userInterface } from './modules/data-interface';
import FlashBuy from './pages/FlashBuy/index';

//首页
import Home from './pages/Home/home';

import Common from './pages/Common/common';

import Register from './pages/Login_Register/register';
import Login from './pages/Login_Register/login';
import LoginOption from './pages/Login_Register/login-option';

//商品
import { Goods, GoodsOrder } from './pages/Goods';

//支付订单
import { PayOrder,PaySuccess } from './pages/Pay';

import {
	SetContainer,
	PwdModify,
	SetHome,
	UserOrder,
	PwdForget ,
	PwdReset,
	OrderTicket,
	OrderQueue,
  OrderDetail,
  MyMessage,
  MessageDetail,
	Account, About
} from './pages/Me_Set';
//门店详情
import { Merchant} from './pages/Merchant';
//门店乐付支付
import { Pay } from './pages/FlashPay';


//全局配置
import { globalConfig } from './modules/config';

//history的配置
const historyOptions = {
	queryKey : false
};

import store from 'store';


const authCheck = (nextState, replace) => {
	if(!store.get('ffan_user')){
		replace({
			redirectUrl: nextState.location.pathname
		} , '/me/login', {
			redirectUrl: nextState.location.pathname
		});
	}
}

const routes = (
	<Router history={createBrowserHistory(historyOptions)}>
		<Route path='/' component={ Common }>
			<IndexRoute component={ SetHome }/>

			<Route path="chooseLogin" component={ LoginOption } />

			<Route path='me' component={ SetContainer }>
				<IndexRoute component={ SetHome }/>
				<Route path='register' component={ Register } />
				<Route path="login" component={ Login } />
				<Route path='forgotPassword' component={ PwdForget } />
				<Route path='resetPassword' component={ PwdReset } />
			</Route>

			<Route path='me' component={ SetContainer } onEnter={ authCheck }>
				<Route path='order' component={ UserOrder } />
				<Route path='orderDetail/:orderId' component={ OrderDetail }/>
        <Route path='ticket' component={ OrderTicket } />
				<Route path='myMessage' >
				  <IndexRoute component={ MyMessage }/>
					<Route path=':mailId' component={ MessageDetail }/>
				</Route>
				<Route path='about' component={ About } />
				<Route path='account'>
					<IndexRoute component={ Account }/>
				  <Route path='pwd' component={ PwdModify }  />
				</Route>
			</Route>
			<Route path='merchant'>
				<Route path=':storeId' component={ Merchant } />
			</Route>
			<Route path="flashpay" onEnter={ authCheck }>
				<Route path=':storeId' component={ Pay } />
			</Route>

		  <Route path='flashbuy' component={FlashBuy}>
			  <Route path=':cid' component={FlashBuy} />
			  <Route path=':cid/:pid' component={FlashBuy} />
		  </Route>
		  <Route path='goods'>
				<Route path=':goodsCode' component={ Goods } />
				<Route path=':goodsCode/:adId' component={ Goods } />
			</Route>
			<Route path='createOrderFast'>
				<Route path=':id/:productId/:price/:buyNumber/:adId' component={ GoodsOrder } />
				<Route path=':id/:productId/:price/:buyNumber' component={ GoodsOrder } />
			</Route>
			<Route path="pay">
        <Route path='order' component={ PayOrder } />
        <Route path='order/:orderId' component={ PayOrder } />
        <Route path='success' component={ PaySuccess } />
      </Route>

			<Route path='*' component={ FlashBuy }/>
		</Route>
	</Router>
);

export default routes;
