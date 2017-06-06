/**
 * @file 登录
 * @author kw
 */

'use strict';

import React from 'react';
//电话输入框,密码输入框,按钮
import { PhoneInput, VCodeTimerInput } from '../../components/Form';
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
import { LocationSearchToJson, LocationSearchJsonToUrl } from '../../modules/tools';

//本地存储
import store from 'store';
//全局配置
import { globalConfig } from '../../modules/config';

import _ from 'lodash';

import './index.less';

class SentPhoneCode extends React.Component {
	constructor(props) {
		super(props);
		this.searchJson = LocationSearchToJson();
		console.log(this.searchJson);

		this.state = {
			isSendCode: false, // 是否发送过验证码
			mobile: '',
			codeValue:'',
			btnState: false,
			codeNext: false,
		};
		GYUserAction.getUserInfo({});
		window.backObj&&window.backObj.physicsBack&&window.backObj.physicsBack(true);
	};

	componentDidMount() {
		this.unsubscribe = GYUserStore.listen(this.onStoreChanged.bind(this));
	};
	componentWillUnmount() {
		this.unsubscribe();
	};
	onStoreChanged(info) {
		this.info = info;
		let state = this.state;
		console.log(info);
		if(this.info.error){
			CommonAction.alert(this.info.error);
			return;
		}
		if(this.info.type === 'phoneIdentifyingCode'){  // 验证手机验证码 成功后跳转转实名认证页面
			if(this.searchJson.fromePage === 'buy_gop' || this.searchJson.fromePage === 'is_pay_enough'){
				this.context.history.pushState(null, '/authentication?'+ LocationSearchJsonToUrl(this.searchJson)); 
			}
		}
		if(this.info.type === 'getUserInfo'){	// 获取用户信息
			this.setState({
				mobile: this.info.info.data.phone,
				phoneNext: true
			});
		}
	};

	// 按钮状态
	updateValue(newState) {
		if(newState.codeNext && this.state.isSendCode){
			newState.btnState = true;
		}else{
			newState.btnState = false;
		}
		this.setState(newState);
	};

	// 下一步
	btnClick(){
		let state = this.state;
		// this.context.history.pushState(null, '/add_bank_card');
		if(this.state.codeNext && this.state.isSendCode){
			GYUserAction.phoneIdentifyingCode({
				identifyingCode: state.codeValue
			});
		}
	};

	// 获取验证码  cbfn定时器函数   s倒计时秒  接口与登录接口相同
	getVCodeFN(timercbfn) {
		let location = this.context.location;
		let getCodeData = {
			mobile: this.state.mobile,
			phoneNext: this.state.phoneNext,
		};
		if(getCodeData.phoneNext){
			timercbfn && timercbfn(function(cbfn){
				GYUserInterface.sentPhoneCode({
				}).then(function(){
					CommonAction.alert('发送成功，请查收');
					this.setState({
						isSendCode: true
					});
					cbfn && cbfn();
				}.bind(this)).fail(function(){
					CommonAction.alert('发送失败，请重试');
				}.bind(this));
			}.bind(this));
		}else{
			CommonAction.alert('请填写正确手机号');
		}
	};	


	// 验证码输入
	VCodeInputChange(newState){
		let state = {};
		_.extend(state, this.state, newState);
		state.codeValue = newState.value;
		console.log(newState);
		// 有错误
		if(state.error){
			state.codeNext = false;
		}else{
			state.codeNext = true;
		}
		this.setState(state);
		this.updateValue(state);
	};


	render() {
		return (
			<div>
				<form autoComplete="off">
					<ul>		
						<li className="sentphonecode-phone">
							<span>手机号</span>
							<span>{ this.state.mobile}</span>
						</li>
						<VCodeTimerInput 
							onChange={ function(state) { this.VCodeInputChange(state) }.bind(this) }
							s = '60'
							maxLength = { 6 }
							getVCodeFN={ function(cbfn , s){ this.getVCodeFN(cbfn , s) }.bind(this) }
						/>															
						<li className="sentphonecode-btn-area">
							<Button onClick={ this.btnClick.bind(this) } title="下一步" btnState={ this.state.btnState }/>
						</li>
					</ul>
				</form>
			</div>
		);
	}
}

//默认属性
SentPhoneCode.defaultProps = { 

};

/**
 * @desc context
 * @type {{history: *}}
 */
SentPhoneCode.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

export default SentPhoneCode;