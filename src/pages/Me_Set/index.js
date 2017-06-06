/**
 * @file 个人中心
 */

'use strict';

//引入个人中心的样式
require('./index.less');

import SetContainer from './set-container';
//密码修改
import PwdModify from './modify';
//个人中心首页
import SetHome from './home';
//订单列表-券
import OrderTicket from './order-ticket';
//订单列表-我的排队
import OrderQueue from './order-queue';
//我的订单列表
import UserOrder from './order';
//忘记密码
import PwdForget from './pwd-forget';
//重置密码
import PwdReset from './pwd-reset';
//账户管理
import Account from './account';
//关于
import About from './about';
//订单详情
import OrderDetail from './order-detail';
//消息
import MyMessage from './message';
//消息详情
import MessageDetail from './message-detail';

export { PwdModify }
export { SetHome }
export { SetContainer }
export { UserOrder }
export { OrderTicket }
export { OrderQueue }
export { PwdForget }
export { PwdReset }
export { Account }
export { About }
export { OrderDetail }
export { MyMessage }
export { MessageDetail }

export default {
	PwdModify,
	SetHome,
	SetContainer,
	UserOrder,
	OrderTicket,
	OrderQueue,
	PwdForget,
	PwdReset,
	Account,
	About,
	OrderDetail,
	MyMessage,
	MessageDetail
}