/**
 * @file 用户功能action
 */

'use strict';

import Reflux from 'reflux';
//数据请求模块
import { orderInterface } from '../modules/data-interface';

const OrderAction = Reflux.createActions(
	[
		{
			'getOrderList': { children: ['completed', 'failed'] }
		},
		{
			'getTicketList': { children: ['completed', 'failed'] }
		},
		{
			'getOrderDetail': { children: ['completed', 'failed'] }
		},
		{
			'getOrderMovieDetail': { children: ['completed', 'failed'] }
		},
		{
			'getOrderCouponCode': { children: ['completed', 'failed'] }
		},
		{
			'getOrderPickupCode': { children: ['completed', 'failed'] }
		}
	]
);

//我的订单
OrderAction.getOrderList.listen(function(data) {
	orderInterface.orderList(data)
	.then(function(result) {
		this.completed(result);
	}.bind(this))
	.fail(function(msg) {
		this.failed(msg);
	}.bind(this))
});

//我的票券
OrderAction.getTicketList.listen(function (data) {
  orderInterface.ticketList(data)
	.then(function (result) {
		this.completed(result);
	}.bind(this))
	.fail(function (msg) {
		this.failed(msg);
	}.bind(this))
});

//订单详情
OrderAction.getOrderDetail.listen(function (data) {
	orderInterface.orderDetail(data)
	.then(function (result) {
		this.completed(result)
	}.bind(this))
	.fail(function (msg) {
		this.failed(msg)
	}.bind(this))
});

//订单详情-电影票
OrderAction.getOrderMovieDetail.listen(function (data) {
	orderInterface.orderMovieDetail(data)
		.then(function (result) {
			this.completed(result)
		}.bind(this))
		.fail(function (msg) {
			this.failed(msg)
		}.bind(this))
});

//订单详情-券订单的券码
OrderAction.getOrderCouponCode.listen(function (data) {
	orderInterface.orderCouponCode(data)
		.then(function (result) {
			this.completed(result)
		}.bind(this))
		.fail(function (msg) {
			this.failed(msg)
		}.bind(this))
});

//订单详情-实物提货吗
OrderAction.getOrderPickupCode.listen(function (data) {
	orderInterface.orderPickupCode(data)
		.then(function (result) {
			this.completed(result)
		}.bind(this))
		.fail(function (msg) {
			this.failed(msg)
		}.bind(this))
});


export default OrderAction;