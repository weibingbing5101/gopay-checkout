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

// import './CreateOrderMarket.less';



/**
 * @class 登录页面
 */
class CreateOrderMarket extends React.Component {

	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.props = props;
		this.searchJson = LocationSearchToJson();
		//alert(this.searchJson.mercId);
		this.state ={
			mercId:this.searchJson.mercId,        //qa
			appId:this.searchJson.appId,
			// mercId:'2111234567890943',		  //production	
			// appId:'GAPP_03F5B48849DA2587',
			ordrAmt:this.searchJson.ordrAmt,
			appName:'果仁支付测试应用',
			payWay:[true,false,false],
		};
		this.createOrder();
		// window.backObj&&window.backObj.physicsBack&&window.backObj.physicsBack(true);
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

	createOrder(){
		if (this.state.payWay[0]) {
			GYUserAction.AppHandle({
				mercId:this.state.mercId,
				appId:this.state.appId,
				ordrAmt:this.state.ordrAmt*100,
				source:2,
				goodsNm:this.searchJson.goodsNm,
				goodsDesc:this.searchJson.goodsDesc
			});
		}
	}

	/**
	 * @desc 返回模版
	 * @returns {XML}
	 */
	render() {
		return (
			<div>
			</div>
		);
	}
}

//默认属性
CreateOrderMarket.defaultProps = { 
	noHeader: true 
};

/**
 * @desc context
 * @type {{history: *}}
 */
CreateOrderMarket.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

export default CreateOrderMarket;