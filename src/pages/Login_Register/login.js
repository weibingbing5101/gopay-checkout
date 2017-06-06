/**
 * @file 登录
 */

'use strict';

import React from 'react';
//电话输入框,密码输入框,按钮
import { NumberInput, PasswordInput, VCodeImgInput } from '../../components/Form';
import { Button } from '../../components/Button';
import Container from './login-register-container';
//react路由
import { PropTypes } from 'react-router';
import { Link } from 'react-router';
//用户相关action
import UserAction from '../../actions/user-action';
//用户相关store
import UserStore from '../../stores/user-store';
//公共action
import CommonAction from '../../actions/common-action';
//request
import { userInterface } from '../../modules/data-interface';
//输入校验模块
import validate from '../../modules/validate';
//本地存储
import store from 'store';
//全局配置
import { globalConfig } from '../../modules/config';


require('./login.less')

/**
 * @class 登录页面
 */
class Login extends React.Component {

	/**
	 * @desc 构造函数
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.state = {
			mobile: '',
			password: '',
			vcodeUrl: '',
			vCode: '',
			btnState: false
		}
	}

	/**
	 * @desc 登录方法
	 * @param event
	 */
	login() {

		let loginData = {
			mobile: this.state.mobile,
			password: this.state.password
		};
		if(this.state.vcodeUrl){
			loginData.vcode = this.state.vCode;
		}
		validate.checkLoginInfo(loginData)
		.then(function(result) {
			UserAction.login(loginData);
		}.bind(this))
		.fail(function(msg) {
			CommonAction.alert(msg);
		});
	}

	updateVCode(info) {
		if(info.data&&info.data.vcodeUrl){
			this.setState({
				vcodeUrl: info.data.vcodeUrl
			});
		}
	}

	getVCode() {
		let loginData = {
			mobile: this.state.mobile,
			password: this.state.password,
		};
		if(this.state.vcodeUrl){
			loginData.vcode = '8888';
		}
		validate.checkLoginInfo(loginData)
		.then(function(result) {
			userInterface.login(loginData)
			.then(function(data){
				this.updateVCode(data);
			}.bind(this))
			.fail(function(msg, data){
				this.updateVCode(data);
			}.bind(this));
		}.bind(this))
		.fail(function(msg) {
			CommonAction.alert(msg);
		});
	}

	componentDidMount() {
		this.unsubscribe = UserStore.listen(this.onStoreChanged.bind(this));
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	onStoreChanged(info) {
		if(info.loading){
			CommonAction.loading(true, '账号登录中');
		}else{
			CommonAction.loading(false);
			if (!info.info) return;
			var loginInfo = info.info;
			var showVertify = loginInfo.status === 4200;//显示验证码
			var error = loginInfo.status !== 4200 && loginInfo.status !== 200; //密码错误或者其他问题

			CommonAction.loading(false);
			if(!loginInfo.data.pLoginToken){
				CommonAction.alert(loginInfo.message);
			}
			if (error) return;

			if(showVertify){
				// 连续输入两次要求输入图片验证码
				if(loginInfo.data&&loginInfo.data.vcodeUrl){
					if(this.state.vcodeUrl){
						CommonAction.alert('图片验证码不正确,请您重新输入');
					}else{
						CommonAction.alert('为了您的账户安全，请输入验证码');
					}
					this.setState({
						vcodeUrl: loginInfo.data.vcodeUrl
					});
				}else{
					if(this.state.vcodeUrl){
						this.getVCode();
					}
					CommonAction.alert(info.error);
				}

			}else{
				let location = this.context.location;
				let redirectUrl;

				// 新版的都会把redirectUrl写到state，优先读取state
				if(location.state&&location.state.redirectUrl){
					redirectUrl=location.state.redirectUrl;
				}
				// 读取url search
				else if(location.query.redirectUrl){
					let query = location.query;
					redirectUrl=query.redirectUrl;
				}
				// 读取本地存储，目前没有使用本次存储这个逻辑
				/*else if(store.get('redirectUrl')){
					redirectUrl = decodeURIComponent(store.get('redirectUrl'));

				}*/
				// 默认跳到个人中心
				else{
					redirectUrl = '/me';
				}

				// 将登录页面改为redirectUrl，后退时就不会后退到登录页面，而是redirectUrl的上一个页面了
				this.context.history.replaceState(null, redirectUrl);
			}
		}
	}


	/**
	 * @desc 更新login组件的state的值
	 *       更新按钮状态
	 */
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


	/**
	 * @desc 返回模版
	 * @returns {XML}
	 */
	render() {
		return (
			<Container>
				<form autoComplete="off">
					<ul>
						<NumberInput title="账号" onChange={ function(state) { this.updateValue(state) }.bind(this) } />
						<PasswordInput title="密码"  onChange={ function(state) { this.updateValue(state) }.bind(this) } />
						{(() => {
							switch(!!this.state.vcodeUrl){
								case true: return(
									<VCodeImgInput 
										vcodeUrl={ this.state.vcodeUrl } 
										onChange={ function(state) { this.updateValue(state) }.bind(this) } 
										changeVcode={ this.getVCode.bind(this) } 
									/>
								);
							}
						})()}
						<li className="login-btn-area">
							<Button onClick={ function() { this.login() }.bind(this) } title="登 录" btnState={ this.state.btnState }/>
						</li>
						<li className="other-operate">
							<Link to="/me/register"><span>立即注册</span></Link>
							<Link to="/me/forgotPassword"><span>忘记密码?</span></Link>
						</li>
					</ul>
				</form>
			</Container>
		);
	}
}

//默认属性
Login.defaultProps = { title: '登录' };

/**
 * @desc context
 * @type {{history: *}}
 */
Login.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

export default Login;