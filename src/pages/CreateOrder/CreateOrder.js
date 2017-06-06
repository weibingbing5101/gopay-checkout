/**
 * @file 登录
 */

'use strict';

import React from 'react';
//电话输入框,密码输入框,按钮
import { NumberInput, VCodeImgInput, VCodeInput } from '../../components/Form';
import { Button } from '../../components/Button';
// import Container from './login-register-container';
//react路由
import { PropTypes } from 'react-router';
import { Link } from 'react-router';
//用户相关action
import GYUserAction from '../../actions/gy-user-action';
//用户相关store
import GYUserStore from '../../stores/gy-user-store';
//公共action
import CommonAction from '../../actions/common-action';
//request
import { userInterface } from '../../modules/data-interface';
//输入校验模块
import validate from '../../modules/validate';
//本地存储
import store from 'store';
//全局配置
import { globalConfig } from '../../modules/config';


import { LocationSearchToJson, LocationSearchJsonToUrl } from '../../modules/tools';



import _ from 'lodash';
import $ from 'jquery';

import './CreateOrder.less';


const mercIdArr ={
	'dev':'2111234567890832',
	'sit':'2111234567890947',
	'prod':'2111234567890943'
}
const appIdArr = {
	'dev':'GAPP_59F0609B61D0F63E',
	'sit': 'GAPP_8E8A0F27CB24F984',
	'prod':'GAPP_03F5B48849DA2587'
};

/**
 * @class 登录页面
 */
class CreateOrder extends React.Component {

	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.props = props;
		this.searchJson = LocationSearchToJson();
		this.state ={
			mercId:mercIdArr[process.env.NODE_ENV],	
			appId:appIdArr[process.env.NODE_ENV],
			ordrAmt:0.01,
			appName:'果仁支付测试应用',
			payWay:[true,false,false],
		};
		window.backObj&&window.backObj.physicsBack&&window.backObj.physicsBack(true);
	}


	componentDidMount() {
		this.unsubscribe = GYUserStore.listen(this.onStoreChanged.bind(this));
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	onStoreChanged(info) {
		if(info && info.error){
			CommonAction.alert(info.error);	
			return false;	
		}
		if(info && info.info && info.info.h5Url){

			let url = require('url');
			let location = window.location;
			let h5Url = info.info.h5Url;

			let h5UrlObj = url.parse(h5Url, true);
			let queryObj = h5UrlObj.query;
			/*_.extend(h5UrlObj, {
				host: location.host,
				hostname: location.hostname,
				port: location.port,
				protocol: location.protocol,
			})*/

			let queryStr = _.map(queryObj, function(value, key){
				return key + '=' + encodeURIComponent(value);
			}).join('&')

			//h5UrlObj.query =   queryObj;

			h5Url = [
				location.protocol ,
				'//'+location.hostname,
				location.port ? ':' + location.port : '',
				h5UrlObj.pathname,
				'?' + queryStr
			];
			h5Url = h5Url.join('');

			location.href=h5Url;
		}

	};

	closeHelp(){
		this.context.history.goBack();
	}

	createOrder(){
		if (this.state.payWay[0]) {
			GYUserAction.AppHandle({
				mercId:this.state.mercId,
				appId:this.state.appId,
				ordrAmt:this.state.ordrAmt*100,
				source:2,
				goodsNm:'text',
				goodsDesc:'text'
			});
		}
	}

	selectPayWay(value){
		let payWay= [false,false,false];
		payWay[value] = true;
		this.setState({payWay:payWay});
	}
	/**
	 * @desc 返回模版
	 * @returns {XML}
	 */
	render() {
		return (
			<div>
				<div className="order-name">
					<span>订单名称：</span>
					<span>{this.state.appName}</span>
				</div>
				<div className="order-name">
					<span>订单金额：</span>
					<span>{this.state.ordrAmt}元</span>
				</div>
				<div className="order-select-title">
					选择支付方式
				</div>
				<div className="order-select-way">
					<div className="select-way-guofu">
						<div className="guofu-img"></div>
						<div className="guofu-desc">
							<span className="desc-title">果仁支付</span>
							<span className="desc-content">全新支付体验，更快更安全</span>
						</div>
						<div className={this.state.payWay[0]?'selected-way-mark':'unselected-way-mark'}
							onClick={function(){this.selectPayWay(0)}.bind(this)}>
						</div>
					</div>
					<div className="select-way-other">
						<div className="other-img"></div>
						<div className="other-desc">
							<span className="desc-title">Logo</span>
							<span className="desc-content">支持xxx用户使用</span>
						</div>
						<div className={this.state.payWay[1]?'selected-way-mark':'unselected-way-mark'}
							onClick={function(){this.selectPayWay(1)}.bind(this)}>
						</div>
					</div>
					<div className="select-way-other">
						<div className="other-img"></div>
						<div className="other-desc">
							<span className="desc-title">Logo</span>
							<span className="desc-content">支持xxx用户使用</span>
						</div>
						<div className={this.state.payWay[2]?'selected-way-mark':'unselected-way-mark'}
							onClick={function(){this.selectPayWay(2)}.bind(this)}>
						</div>
					</div>
				</div>
				<div className="order-btn">
					<button className={this.state.payWay[0]?'':'btn-disabled'} onClick={ function() { this.createOrder() }.bind(this) } btnState={true}>立即支付</button>
				</div>
			</div>
		);
	}
}

//默认属性
CreateOrder.defaultProps = { 
	title:'商户收银台',
	headerTitle:'商户收银台',
};

/**
 * @desc context
 * @type {{history: *}}
 */
CreateOrder.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

export default CreateOrder;