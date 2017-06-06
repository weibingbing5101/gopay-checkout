/**
 * @file 忘记密码
 */

'use strict';

import React from 'react';
import { PropTypes } from 'react-router';

//request
import { userInterface } from '../../modules/data-interface';

//公共action
import CommonAction from '../../actions/common-action';
//输入校验模块
import validate from '../../modules/validate';

import { NumberInput, VCodeInput} from '../../components/Form';

import { globalConfig } from '../../modules/config';
import { Button } from '../../components/Button';

/**
 * @class 忘记密码页面
 */
class PwdForget extends React.Component {

	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.state = {
			mobile: '',
			vCode: '',
			btnState: true
		}
	}

	
	stateUpdate(state) {
		this.setState(state);
	}

	handleGetVc(){
		validate.checkMobile(this.state.mobile)
		.then(function(result) {

			userInterface.verifyCodes({
				mobile: this.state.mobile,
				type: globalConfig.VC_TYPE.GORGETPWD
			})
			.then(function(result) {
				CommonAction.alert('验证码获取成功');
			}.bind(this))
			.fail(function(msg) {
				CommonAction.alert(msg);
			}.bind(this));

		}.bind(this))
		.fail(function(msg) {
			CommonAction.alert(msg);
		});
	}

	/**
	 * @desc 验证验证码方法
	 * @param event
	 */
	handleSubmit(e) {
		let state = this.state;

		validate.checkVerifyCodeInfo(this.state)
			.then(function(result) {
				
				CommonAction.loading(true, '验证码校验中');
				userInterface.checkVerifyCode({
					mobile: this.state.mobile,
					verifyCode: this.state.vCode
				})
				.then(function(result) {
					CommonAction.loading(false);
					this.context.history.pushState(null, '/me/resetPassword', {
						verifyCode: this.state.vCode,
						mobile: this.state.mobile
					});
				}.bind(this))
				.fail(function(msg) {
					CommonAction.loading(false);
					CommonAction.alert(msg);
				});

			}.bind(this))
			.fail(function(msg) {
				CommonAction.alert(msg);
			});
	}


	render() {
		return (
			<div className="form-content">
				<form autoComplete="off">
					<ul className='forget-items'>
						<NumberInput onChange={ this.stateUpdate.bind(this) } title="手机号"/>
						<VCodeInput onChange={ this.stateUpdate.bind(this) } getVCode={ this.handleGetVc.bind(this) }/>
					</ul>
					<div className="form-btn-area">
						<Button onClick={this.handleSubmit.bind(this)} btnState={ this.state.btnState }>确认</Button>
					</div>
				</form>
			</div>
		);
	}
}

/*
* <Button onClick={this.handleSubmit.bind(this)}>确认</Button>
* <VCodePlainInput getVCode={ this.handleGetVc.bind(this) } onChange={ this.stateUpdate.bind(this) } />

 * */
/**
 * @desc context
 * @type {{history: *}}
 */
PwdForget.contextTypes = {
	history: PropTypes.history
}

PwdForget.defaultProps = { title: '忘记密码' };

export default PwdForget;