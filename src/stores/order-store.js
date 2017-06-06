/**
 * @file 订单信息store
 */

'use strict';

import Reflux from 'reflux';
//个人相关操作
import OrderAction from '../actions/order-action';


let OrderStore = Reflux.createStore({

	//监听的action
	listenables: OrderAction,

	/**
	 * @desc 初始化
	 */
	init() {
		this.orderList = [];
		this.couponCode = {};
	},

	/**
	 * @desc 订单
	 */
	getOrderList() {
		this.trigger({
			loading: true
		});
	},
	getTicketList(){
		this.trigger({
			loading: true
		})
	},
	getOrderDetail(){
		this.trigger({
			loading: true
		})
	},
	getOrderMovieDetail(){
		this.trigger({
			loading: false
		})
	},
	getOrderCouponCode(){
		this.trigger({
			loading:false
		})
	},

	/**
	 * @desc 获取订单列表成功
	 * @param data {Object} 订单列表
	 */
	getOrderListCompleted(data) {
		this.orderList = data;
		this.trigger({
			data : this.orderList,
			loading: false
		});
	},

	/**
	 * @desc 获取订单列表失败
	 * @param error {String} 错误信息
	 */
	getOrderListFailed(error) {
		this.trigger({
			error : error,
			loading: false
		});
	},

	/**
	 * 获取我的票券成功
	 */
	getTicketListCompleted(data) {
		this.ticketList = data;
		this.trigger({
			data : this.ticketList,
			loading: false
		});
	},
	getTicketListFailed(error) {
    this.trigger({
			error: error,
			loading: false
		})
	},

	/**
	 * 获取订单详情成功
	 * @param data
   */
	getOrderDetailCompleted(data){
		this.trigger({
			data:data.orderInfo,
			loading:false
		})
	},
	getOrderDetailFailed(error){
		this.trigger({
			error:error,
			loading:false
		})
	},

	/**
	 * 订单详情-电影票订单取票码
	 * @param data
   */
	getOrderMovieDetailCompleted(data){
		this.trigger({
			data:data,
			loading:false
		})
	},
	getOrderMovieDetailFailed(error){
		this.trigger({
			error:error,
			loading:false
		})
	},

	/**
	 * 订单详情-券详情券码
	 * @param data
   */
	getOrderCouponCodeCompleted(data){
		this.couponCode = data;
		this.trigger({
			data:this.couponCode,
			loading:false
		})
	},
	getOrderCouponCodeFailed(error){
		this.trigger({
			error:error,
			loading:false
		})
	},

	/**
	 * 订单详情-实物取票码
	 * @param data
   */
	getOrderPickupCodeCompleted(data){
		this.trigger({
			data:data,
			loading:false
		})
	},
	getOrderPickupCodeFailed(error){
		this.trigger({
			error:error,
			loading:false
		})
	}



});

export default OrderStore;