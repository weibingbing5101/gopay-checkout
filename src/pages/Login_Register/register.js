/**
 * @file 注册页面
 */

'use strict';

import React from 'react';
import { PropTypes } from 'react-router';
//电话输入框
import { NumberInput, PasswordInput, VCodeInput } from '../../components/Form';
import { Button } from '../../components/Button'
import Container from './login-register-container';
//request
import { userInterface } from '../../modules/data-interface';
//输入校验模块
import validate from '../../modules/validate';
//公共action
import CommonAction from '../../actions/common-action';

require('./register.less');

//绿色按钮的样式
const greenBtnStyle = {
	width: '100%',
	display: 'block',
	background: '#00c8b8'
}

/**
 * @class 注册页面
 */
class Register extends React.Component {

	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props){
		super(props);
		this.state = {
			mobile: '',
			password: '',
			vCode: '',
			agree: false,
			pwdLevel: -1,
			btnState: false
		}
	}

	/**
	 * @desc 更新login组件的state的值
	 */

	// 手机号输入
	updateValue(state) {
		this.setState(state);
		if(state.mobile && state.mobile!=""){
			this.setState({
				btnState: true
			})
		}
		if(state.mobile==""){
			this.setState({
				btnState: false
			})
		}
	}

	updatePwd(state) {
		state.pwdLevel = validate.calcPwdLevel(state.password);
		console.log(state)
		this.setState(state);
	}

	/**
	 * @desc 获得手机验证码
	 */
	getVCode() {
		validate.checkMobile(this.state.mobile)
			.then(function(result) {
				//TODO 输入合法
				userInterface.verifyCodes({
						mobile: this.state.mobile
					})
					.then(function(result) {
						//TODO 获得手机验证码成功
						console.log(result);
					}.bind(this))
					.fail(function(msg) {
						//TODO 获得手机验证码失败
						CommonAction.alert(msg);
					}.bind(this));
			}.bind(this))
			.fail(function(msg) {
				//TODO 手机输入不合法
				CommonAction.alert(msg);
			});
	}

	/**
	 * @desc 注册用户
	 */
	register() {
		validate.checkRegisterInfo(this.state)
			.then(function(result) {
				//TODO 注册信息合法
				CommonAction.loading(true);
				userInterface.register(this.state)
					.then(function(result) {
						//TODO 注册用户成功
						CommonAction.loading(false);
						this.context.history.pushState(null, '/me/login');
					})
					.fail(function(msg) {
						//TODO 注册用户出错
						CommonAction.loading(false);
						CommonAction.alert(msg);
					})
				}.bind(this))
			.fail(function(msg) {				
				//TODO 注册信息不合法
				CommonAction.alert(msg);
			}.bind(this));
	}

	/**
	 * @desc 渲染模版
	 * @returns {XML}
	 */
	render() {
		return (
			<Container>
				<form autoComplete="off" className="ng-valid ng-dirty ng-valid-parse">
					<ul>
						<NumberInput onChange={ function(state) { this.updateValue(state) }.bind(this) } title="手机号">
						</NumberInput>
						<VCodeInput 
							onChange={ function(state) { this.updateValue(state) }.bind(this) } 
							getVCode={ function() { this.getVCode() }.bind(this) } 
						/>
						<PasswordInput isToggle="true" onChange={ function(state) { this.updatePwd(state) }.bind(this) } pwdLevel={ this.state.pwdLevel } />
						<li className="register-tip">
							密码长度8-16位，至少包括数字，大写字母，小写字母及特殊符号中的两种
						</li>
						<li>
							<p className="register-i-agree">
								<label>
									<input onChange={ function(e) { this.updateValue({ agree: e.target.checked }) }.bind(this) } type="checkbox" defaultChecked={ this.props.agree } />
								<span>
									<i className="iconfont icon-checkbox"></i>
									<i className="iconfont icon-checkedbox"></i>
								</span>
									我已阅读并同意
								</label>
								<a href={ window.location.origin + '/view/agreement.html' } className="register-txt"> 《果仁支付会员协议》</a>
							</p>
						</li>
						<li className="register-btn-area">
							<Button onClick={ function() { this.register() }.bind(this) } style={ greenBtnStyle } title="注册" btnState={ this.state.btnState }/>
						</li>
					</ul>
				</form>
			</Container>
		);
	}
}

/**
 * @desc context
 * @type {{history: *}}
 */
Register.contextTypes = {
	history: PropTypes.history
}

/**
 * @desc 注册组件的默认属性
 * @type {{title: string, agree: boolean}}
 */
Register.defaultProps = {
	title: '注册',
	agree: false
};

export default Register;