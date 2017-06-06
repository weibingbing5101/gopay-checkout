/**
 * @file 修改密码
 */

'use strict';

import React from 'react';
import { PropTypes } from 'react-router';

//request
import { userInterface } from '../../modules/data-interface';
//用户相关store
import UserStore from '../../stores/user-store';
//公共action
import CommonAction from '../../actions/common-action';
//输入校验模块
import validate from '../../modules/validate';
import store from 'store';

import { PasswordInput, PasswordLevel } from '../../components/Form';
import { Button } from '../../components/Button';


/**
 * @class 重置密码页面
 */
class PwdReset extends React.Component {

	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.state = {
			newPwd: '',
			newPwd2: '',
			pwdLevel: -1,
			btnState: false
		}
	}

	updateValue(state) {
		console.log(state);
		this.setState(state);
	}

	updateNewPwd(state) {
		state.pwdLevel = validate.calcPwdLevel(state.newPwd);
		this.setState(state);
		console.log(state);
		if(state.newPwd && state.newPwd!=""){
			this.setState({
				btnState: true
			})
		}
		if(state.newPwd==""){
			this.setState({
				btnState: false
			})
		}
	}

	/**
	 * @desc 修改密码方法
	 * @param event
	 */
	handleSubmit(e) {
		let state = this.state;

		validate.checkResetInfo(this.state)
			.then(function(result) {
				

    		let userInfo = UserStore.getUserInfo();
    		let query = this.context.location.query;

    		if(!query){
    			CommonAction.alert('手机号和验证码为空');
    			return;
    		}else{
    			if(!query.verifyCode){
    				CommonAction.alert('验证码为空');
    				return;
    			}
    			if(!query.mobile){
    				CommonAction.alert('手机号为空');
    				return;
    			}
    		}



    		/*if(!userInfo||!userInfo.member||!userInfo.member.mobile){
    			CommonAction.alert('用户未登录，请重新登录');
    			window.setTimeout(function(){
    				this.context.history.pushState(null, '/me/login', {
    					redirectUrl: this.context.location.pathname
    				});
    			}.bind(this), 1000);
    			return;
    		}*/

				CommonAction.loading(true, '密码重置中');

				userInterface.setNewPwd({
					newPwd: this.state.newPwd,
					verifyCode: query.verifyCode,
    			userName: query.mobile
				})
				.then(function(result) {
					CommonAction.loading(false);
					this.context.history.pushState(null, '/me/login');
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
					<ul>
						<PasswordInput title="新密码" placeholder='请输入8-16位新密码' name='newPwd' onChange={ function(state) { this.updateNewPwd(state) }.bind(this) } pwdLevel={ this.state.pwdLevel } />
						<PasswordInput title="再次输入" placeholder='请再次输入8-16位新密码' name='newPwd2' onChange={ function(state) { this.updateValue(state) }.bind(this) } />
					</ul>
					<div className="form-btn-area">
						<Button onClick={this.handleSubmit.bind(this)} btnState={ this.state.btnState }>确认</Button>
					</div>
				</form>
			</div>
		);
	}
}

/**
 * @desc context
 * @type {{history: *}}
 */
PwdReset.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

PwdReset.defaultProps = { title: '重置密码' };

export default PwdReset;