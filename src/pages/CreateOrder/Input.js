/**
 * @file 线下扫码支付
 */

'use strict';

import React from 'react';
import _ from 'lodash';
import $ from 'jquery';

//电话输入框,密码输入框,按钮
import { NumberInput, VCodeImgInput, VCodeInput,PhoneInput,SimulateInput } from '../../components/Form';
import { Button } from '../../components/Button';
import { MerSnap } from '../../components/Merchant';
import MoneyKeybord from '../../components/Keybord/money-keybord';
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
///import validate from '../../modules/validate';
//本地存储

import { LocationSearchToJson } from '../../modules/tools';
import {isMoney} from '../../modules/validate';

import './CreateOrder.less';


/**
 * @class 线下扫码支付
 */
class CreateInputOrder extends React.Component {

	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);

		this.state = {
			moneyIsValid: false,
			showKeyboard: true,
			money: null
		}
	}


	componentDidMount() {
		this.unsubscribe = GYUserStore.listen(this.onStoreChanged.bind(this));
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	onStoreChanged(info) {

		if(info && info.info && info.info.h5Url){

			let url = require('url');
			let location = window.location;
			let h5Url = info.info.h5Url;

			let h5UrlObj = url.parse(h5Url, true);
			let queryObj = h5UrlObj.query;
			queryObj.isScan = true;
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
		}else{
			CommonAction.alert(info['error']);	
		}

	};

	_createOrder=()=>{
		let money = this.state.money;
		let searchObj = LocationSearchToJson();
		if (isMoney(money)) {
			GYUserAction.AppHandle({
				mercId: searchObj.mercId,
				appId: searchObj.appId,
				ordrAmt: money*100,
				source: 2,
				goodsNm:'text',
				goodsDesc:'text'
			});
		}
	}

	_showKeyboard=()=>{
		this.setState({
			showKeyboard: true
		})
	}

	_hideKeyboard=()=>{
		this.setState({
			showKeyboard: false
		})
	}

	_keyboardChange=(val)=>{
		/*let splitNum = val.split('.');
		console.log(splitNum)
		if(splitNum.length>2){
			val = splitNum.filter((num, index)=>{
				return index < 2;
			}).join('.')
			console.log(222222, val)
		}*/
		let dotNum = val.split('.')
		this.setState({
			money: val,
			moneyIsValid: isMoney(val)
			///\d{1,6}/.test(val)&&dotNum.length<3&& parseFloat(val) > 0.01
		})
	}

	_getShowValue=()=>{
		return (
			<span>
				<span className="corder-input-title">消费金额（元）</span>
				<span>{(this.state.money ?  this.state.money : '')}</span>
			</span>
		)
	}

	/**
	 * @desc 返回模版
	 * @returns {XML}
	 */
	render() {
		return (
			<div>
				<MerSnap />
				<SimulateInput 
						placeholder="输入消费金额" 
						value={ this._getShowValue() } 
						onClick={this._showKeyboard}>
				</SimulateInput>
				<MoneyKeybord 
					onPress={  this._keyboardChange }
					isKeybordBoxShow = { this.state.showKeyboard }
					keybordClose={ ()=>this._hideKeyboard() }
					hideModal={ true }
					maxLength = { 7 } />
				<Button className="corder-input-submit" onClick={ this._createOrder } title="支付" btnState={ this.state.moneyIsValid }/>
			</div>
		);
	}
}

//默认属性
CreateInputOrder.defaultProps = { 
	title:'商户收银台',
	headerTitle:'商户收银台',
};

/**
 * @desc context
 * @type {{history: *}}
 */
CreateInputOrder.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

export default CreateInputOrder;