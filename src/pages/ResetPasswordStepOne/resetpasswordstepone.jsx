/**
 * @file 登录
 * @author kw
 */

'use strict';

import React from 'react';
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

		this.state = {
			resetPasswordOne: '',
			btnState: false,
			isKeybordBoxShow: true
		};
		window.backObj&&window.backObj.physicsBack&&window.backObj.physicsBack(true);
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
			this.context.history.pushState(
				{resetPasswordOne: state.resetPasswordOne}, 
				'/reset_password_step_two?'+LocationSearchJsonToUrl(this.searchJson)
			);
		}else if(!this.state.codeNext){
			return false;
			CommonAction.alert('请输入六位数字支付密码');
		}
	};

	// 键盘change事件  密码够6位隐藏键盘跳转页面传参
	keybordInputChange(value){
		let newData = {};
		_.extend(newData, this.state);
		newData.resetPasswordOne = value;
		if(newData.resetPasswordOne.length === 6){
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
		let passWordBoxClassName = 'resetpasswordstepone-passwordbox lever' + this.state.resetPasswordOne.length;
		return (
			<div>
				<form autoComplete="off">
					<ul>		
						<li className="resetpasswordstepone-title">
							请设置支付密码
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
						<li className="resetpasswordstepone-btn-area">
							<Button onClick={ this.btnClick.bind(this) } title="下一步" btnState={ this.state.btnState }/>
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