/**
 * @file 登录
 * @author kw
 */

'use strict';

import React from 'react';
import classNames from 'classnames';
//电话输入框,密码输入框,按钮
import { PhoneInput, IDNumberInput } from '../../components/Form';
import CodeKeybord from '../../components/Keybord/code-keybord.jsx';
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

class ResetPasswordStepOne extends React.Component {
	constructor(props) {
		super(props);
		this.searchJson = LocationSearchToJson();
		let PrePageResetPasswordOne = '';
		if (props.location.state && props.location.state.resetPasswordOne) {
			// console.log(JSON.parse(props.location.state.resetPasswordOne));
			// PrePageResetPasswordOne = JSON.parse(props.location.state.resetPasswordOne);
			PrePageResetPasswordOne = props.location.state.resetPasswordOne;
		}

		this.state = {
			resetPasswordOne: PrePageResetPasswordOne,
			resetPasswordTwo: '',
			btnState: false,
			seconds: 3,
			isKeybordBoxShow: true,
			isSuccessBoxShow: false
		};
		this.successTimer = null;
	};

	componentDidMount() {
		this.unsubscribe = GYUserStore.listen(this.onStoreChanged.bind(this));
	};
	componentWillUnmount() {
		this.unsubscribe();
	};
	onStoreChanged(info) {
	};


	// 下一步
	btnClick(){
		let state = this.state;
		// this.context.history.pushState(null, '/add_bank_card');
		if(this.state.btnState){
			if(this.state.resetPasswordOne == this.state.resetPasswordTwo){
				GYUserInterface.setPayPassword({
					password: this.state.resetPasswordTwo
				}).then(function(data){
					if(data.status && data.status ==200){
						clearInterval(this.successTimer);
						this.successTimer = setInterval(()=>{
							if(this.state.seconds === 1){
								clearInterval(this.successTimer);
								if(this.searchJson.fromePage === 'buy_gop'){
									this.searchJson.fromePage='';
									// let locatoinSearchUrl = '/bug_gop?'+LocationSearchJsonToUrl(this.searchJson);
									this.context.history.pushState(null, '/is_pay_enough?'+LocationSearchJsonToUrl(this.searchJson));
								}else if(this.searchJson.fromePage === 'is_pay_enough'){
									this.searchJson.fromePage='';
									this.context.history.pushState(null, '/is_pay_enough?'+LocationSearchJsonToUrl(this.searchJson));
									// let locatoinSearchUrl = '/is_pay_enough?'+LocationSearchJsonToUrl(this.searchJson);
								}
							}else{
								let seconds = this.state.seconds;
								this.setState({
									seconds: seconds - 1
								});
							}
						},1000);
						this.setState({
							isSuccessBoxShow: true
						});
					}else{
						CommonAction.alert(data.msg);
					}
				}.bind(this)).fail(function(data){
					CommonAction.alert(data);
				}.bind(this));
			}else{
				CommonAction.alert('两次输入密码不一致');
			}		
		}else {
			return false;
			CommonAction.alert('请再次输入六位数字支付密码');
		}
	};

	// 键盘change事件  密码够6位隐藏键盘跳转页面传参
	keybordInputChange(value){
		let newData = {};
		_.extend(newData, this.state);
		newData.resetPasswordTwo = value;
		if(newData.resetPasswordTwo.length === 6){
			newData.btnState = true;
			newData.isKeybordBoxShow = false;
		}else{
			newData.btnState = false;
		}
		this.setState(newData);
	};

	// 键盘隐藏
	keybordShowOrClose(value){
		this.setState({
			isKeybordBoxShow: false
		});
	};

	// 密码框点击事件 
	passWordBoxClick(){
		this.setState({
			isKeybordBoxShow: true
		});
	};

	render() {
		let successBoxClassNames = classNames({
			'success-wrap': this.state.isSuccessBoxShow,
			'success-wrap-hide': !this.state.isSuccessBoxShow
		});
		let passWordBoxClassName = 'resetpasswordsteptwo-passwordbox lever' + this.state.resetPasswordTwo.length;
		return (
			<div>
				<form autoComplete="off">
					<ul>		
						<li className="resetpasswordsteptwo-title">
							请再次输入支付密码，并牢记
						</li>
						<li onClick={ this.passWordBoxClick.bind(this) }>
							<ul className={passWordBoxClassName}>
								<li><span></span></li>
								<li><span></span></li>
								<li><span></span></li>
								<li><span></span></li>
								<li><span></span></li>
								<li><span></span></li>
							</ul>
						</li>													
						<li className="resetpasswordsteptwo-btn-area">
							<Button onClick={ this.btnClick.bind(this) } title="完成" btnState={ this.state.btnState }/>
						</li>
					</ul>
					<CodeKeybord
						onPress={ function(value){ this.keybordInputChange(value) }.bind(this)}
						isKeybordBoxShow = { this.state.isKeybordBoxShow }
						keybordClose = { function(value){ this.keybordShowOrClose(value) }.bind(this) }
						maxLength = { 6 }
					>
					</CodeKeybord>
				</form>
				<div className={successBoxClassNames}>
					<div className="success-box">
						<div className="success-icon"></div>
						<div className="success-txt">
							支付密码修改成功，请牢记 <br/>
							{this.state.seconds}
							<span>s</span>
							后自动跳转
						</div>
					</div>
				</div>
			</div>
		);
	}
}

//默认属性
ResetPasswordStepOne.defaultProps = { 

};

/**
 * @desc context
 * @type {{history: *}}
 */
ResetPasswordStepOne.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

export default ResetPasswordStepOne;