/**
 * @file 登录
 * @author kw
 */

'use strict';

import React from 'react';
//电话输入框,密码输入框,按钮
import { PhoneInput, IDNumberInput } from '../../components/Form';
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

class WriteAuthenticationInfo extends React.Component {
	constructor(props) {
		super(props);
		this.searchJson = LocationSearchToJson();

		this.state = {
			realName: '',
			IDcardNum:'',
			btnState: false,
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
		console.log(this.state.fromePage);
		console.log(info);
		if(this.info.error){
			CommonAction.alert(this.info.error);
		}else if(this.info.type === 'checkIDcard'){  // 身份证验证
			console.log(this.state.fromePage);
			if(this.searchJson.fromePage === 'buy_gop' || this.searchJson.fromePage === 'is_pay_enough'){
				this.context.history.pushState(null, '/reset_password_step_one?'+LocationSearchJsonToUrl(this.searchJson)); 
			}
		}else if(this.info.type === 'getUserInfo'){	// 获取用户信息
			this.setState({
				realName: this.info.info.data.realname,
			});
		}
	};

	// 身份证输入
	IDNumberonChange(newState){
		console.log(newState);
		let state = {};
		_.extend(state, this.state, newState);
		state.IDcardNum = newState.value;
		if(state.error){
			state.btnState = false;
		}else{
			state.btnState = true;
		}
		this.setState(state);
	};

	// 下一步
	btnClick(){
		let state = this.state;
		// this.context.history.pushState(null, '/add_bank_card');
		if(this.state.btnState){
			GYUserAction.checkIDcard({
				IDcard: state.IDcardNum
			});
		}else if(!this.state.codeNext){
			CommonAction.alert('请填写正确身份证号码');
		}
	};




	render() {
		return (
			<div>
				<form autoComplete="off">
					<ul>		
						<li className="writeauthenticationinfo-realname">
							<span>姓名</span>
							<span>{ this.state.realName}</span>
						</li>
						<IDNumberInput
							onChange={ function(state) { this.IDNumberonChange(state) }.bind(this) }
						/>														
						<li className="writeauthenticationinfo-btn-area">
							<Button onClick={ this.btnClick.bind(this) } title="下一步" btnState={ this.state.btnState }/>
						</li>
					</ul>
				</form>
			</div>
		);
	}
}

//默认属性
WriteAuthenticationInfo.defaultProps = { 

};

/**
 * @desc context
 * @type {{history: *}}
 */
WriteAuthenticationInfo.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

export default WriteAuthenticationInfo;