/**
 * @file 登录
 * @author kw
 */

'use strict';

import React from 'react';
//电话输入框,密码输入框,按钮
import { RealNameInput, IDNumberInput } from '../../components/Form';
import { Button } from '../../components/Button';
// import Container from './login-register-container';
//react路由
import { PropTypes } from 'react-router';
//用户相关action
import GYUserAction from '../../actions/gy-user-action';
//用户相关store
import GYUserStore from '../../stores/gy-user-store';
//公共action
import CommonAction from '../../actions/common-action';
//request
import { userInterface, GYUserInterface } from '../../modules/data-interface';
//输入校验模块
import validate from '../../modules/validate';
//本地存储
import store from 'store';
//全局配置
import { globalConfig } from '../../modules/config';
// 步骤
import Step from '../../components/Step/step';

import { LocationSearchToJson, LocationSearchJsonToUrl } from '../../modules/tools';

import _ from 'lodash';

import './index.less';

/**
 * @class 登录页面
 */
class Authentication extends React.Component {
	constructor(props) {
		super(props);
		// 获取URL中订单参数
		this.searchJson = LocationSearchToJson();

		this.state = {
			realName: '',
			authenticationNum:'',
			btnState: false,
			realNameNext: false,
			authenticationNext: false
		};
		GYUserAction.isAuthentication({});
		window.backObj&&window.backObj.physicsBack&&window.backObj.physicsBack(true);
	};

	componentDidMount() {
		this.unsubscribe = GYUserStore.listen(this.onStoreChanged.bind(this));
	};
	componentWillUnmount() {
		this.unsubscribe();
	};
	onStoreChanged(info) {
		// 实名认证后  获取实名信息 setstore  给下一步用
		console.log(info);
		// 是否实名认证  回调  根据上个页面传参判断下个页面的跳转 this.goToPage   isCertification
		if(info && info.type === 'isAuthentication'){
			if(info.error ==='未实名认证'){
				
			}else{
				console.log(this.searchJson.fromePage);
				if(this.searchJson.fromePage === 'buy_gop' || this.searchJson.fromePage === 'is_pay_enough'){
					this.context.history.replaceState(null, '/write_authentication_info?'+ LocationSearchJsonToUrl(this.searchJson));
				}else if(this.searchJson.fromePage === 'buy_gop_add_bank_card'){
					this.context.history.replaceState(null, '/add_bank_card?'+ LocationSearchJsonToUrl(this.searchJson));
				}else{// 如果没有	fromePage 来源信息  返回首页登陆
					this.context.history.replaceState(null, '/home_login?'+ LocationSearchJsonToUrl(this.searchJson));
				}
			}
		}
		
		// 实名认证  回调
		if(info && info.type === 'authentication'){
			if(info && info.error){
				CommonAction.alert(info.error);
			}else{
				if(this.searchJson.fromePage === 'buy_gop' || this.searchJson.fromePage === 'is_pay_enough'){
					this.context.history.replaceState(null, '/write_authentication_info?'+ LocationSearchJsonToUrl(this.searchJson));
				}else if(this.searchJson.fromePage === 'buy_gop_add_bank_card'){
					this.context.history.replaceState(null, '/add_bank_card?'+ LocationSearchJsonToUrl(this.searchJson));
				}else{// 如果没有	fromePage 来源信息  返回首页登陆
					this.context.history.replaceState(null, '/home_login?'+ LocationSearchJsonToUrl(this.searchJson));
				}
			}
		}
	};

	updateValue(newState) {
		if(newState.realNameNext && newState.authenticationNext){
			newState.btnState = true;
		}else{
			newState.btnState = false;
		}
		this.setState(newState);
		console.log(this.state);
	};

	// 真实姓名
	realNameonChange(newState){
		let state = {};
		_.extend(state, this.state, newState);
		state.realName = newState.value;
		if(newState.error){		
			state.realNameNext = false;
		}else{
			state.realNameNext =  true;
		}
		this.setState(state);
		this.updateValue(state);
	};

	// 身份证输入
	IDNumberonChange(newState){
		console.log(newState);
		let state = {};
		_.extend(state, this.state, newState);
		state.authenticationNum = newState.value;
		if(state.error){
			state.authenticationNext = false;
		}else{
			state.authenticationNext = true;
		}
		this.setState(state);
		this.updateValue(state);
	};

	// 下一步
	btnClick(){
		let state = this.state;
		// this.context.history.pushState(null, '/add_bank_card');
		if( this.state.realNameNext && this.state.authenticationNext){
			GYUserAction.authentication({
					name: state.realName,
					IDcard: state.authenticationNum
				});
		}else if(!this.state.realNameNext){
			CommonAction.alert('请填写正确真实姓名');
		}else if(!this.state.authenticationNext){
			CommonAction.alert('请填写正确身份证号');
		}
	};
	// 只有添加银行卡流程过来的还会有step进度条提示
	getTitleStep(){
		if(this.searchJson.fromePage === 'buy_gop_add_bank_card'){
			return <Step step = '1'/>;
		}
	};

	render() {
		let titleStep = this.getTitleStep();
		return (
			<div>
				<form autoComplete="off">
					{titleStep}
					<ul>
						<p className="addbankcard-tips">请先完成身份认证信息</p>
						<RealNameInput
							onChange = { function(state) { this.realNameonChange(state) }.bind(this) }
						/>
						<IDNumberInput
							onChange={ function(state) { this.IDNumberonChange(state) }.bind(this) }
						/>					
						<li className="addbankcard-btn-area">
							<Button onClick={ this.btnClick.bind(this) } title="下一步" btnState={ this.state.btnState }/>
						</li>
					</ul>
				</form>
			</div>
		);
	}
}

//默认属性
Authentication.defaultProps = {  

};

/**
 * @desc context
 * @type {{history: *}}
 */
Authentication.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

export default Authentication;