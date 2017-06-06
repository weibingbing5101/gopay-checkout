/**
 * @file 修改密码
 */

'use strict';

import React from 'react';
import { PropTypes } from 'react-router';
import Header from '../../components/Header/header';
//用户相关action
import UserAction from '../../actions/user-action';
//用户相关store
import UserStore from '../../stores/user-store';

//request
import { userInterface } from '../../modules/data-interface';

//公共action
import CommonAction from '../../actions/common-action';
//输入校验模块
import validate from '../../modules/validate';
import store from 'store';

import { PasswordInput, PasswordLevel } from '../../components/Form';
import { Button } from '../../components/Button';
//全局配置
import { globalConfig } from '../../modules/config';

/**
 * @class 修改密码页面
 */
class PwdModify extends React.Component {

	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		let userInfo = UserStore.getUserInfo();
		this.state = {
			puid: userInfo.puid,
			pLoginToken: userInfo.pLoginToken,
			oldPwd: '',
			newPwd: '',
			newPwd2: '',
			pwdLevel: -1,
			btnState: true
		}
	}

	
	handleModify() {
		UserAction.changePwd(this.state);
	}

	componentDidMount() {
		this.unsubscribe = UserStore.listen(this.onStoreChanged.bind(this));
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	onStoreChanged(data) {
		CommonAction.loading('');
		if(data.error){
			CommonAction.alert(data.error);
		}else{

		}
	}

	updateValue(state) {
		console.log(state)
		this.setState(state);
		if(state.oldPwd && state.oldPwd!=""){
			this.setState({
				btnState: true
			})
		}
		if(state.oldPwd==""){
			this.setState({
				btnState: false
			})
		}
	}

	updateNewPwd(state) {
		//validate.calcPwdLevel(state.newPwd)
		state.pwdLevel = validate.calcPwdLevel(state.newPwd);
		this.setState(state);
	}

	/**
	 * @desc 修改密码方法
	 * @param event
	 */
	handleSubmit(e) {
		let state = this.state;

		validate.checkModifyInfo(this.state)
			.then(function(result) {
				
				CommonAction.loading(true, '密码修改中');

				userInterface.changePwd({
					puid: state.puid,
					pLoginToken: state.pLoginToken,
					oldPwd: state.oldPwd,
					newPwd: state.newPwd
				})
				.then(function(result) {
					CommonAction.loading(false);
					UserAction.logout(store.get("ffan_user"));
					this.context.history.pushState(null, '/me/login');
					//location.href = globalConfig.v1_HOST + '/me/set';
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
				<form autoComplete="off" className="ng-valid ng-dirty ng-valid-parse">
					<ul className='set-items'>
						<PasswordInput placeholder='请输入原密码' title='原密码' name='oldPwd'  onChange={ function(state) { this.updateValue(state) }.bind(this) } />
						<PasswordInput placeholder='请输入8-16位新密码' title='新密码' name='newPwd' onChange={ function(state) { this.updateNewPwd(state) }.bind(this) } pwdLevel={ this.state.pwdLevel } />
						<PasswordInput placeholder='再次输入8-16位新密码' title='再次输入' name='newPwd2' onChange={ function(state) { this.updateValue(state) }.bind(this) } />
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
PwdModify.contextTypes = {
	history: PropTypes.history
}

PwdModify.defaultProps = { title: '修改登录密码' };

export default PwdModify;