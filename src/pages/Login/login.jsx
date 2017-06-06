/**
 * @file 登录
 * @author kw
 */

'use strict';

import React from 'react';
//电话输入框,密码输入框,按钮
import { PhoneInput, VCodeTimerInput, BankNumberInput ,VCodeInput,VCodeImageInput} from '../../components/Form';
// dialog
import Dialog from '../../components/Dialog/dialog';
// Confirm
import Confirm from '../../components/Confirm/confirm';
// alert-tips
import AlertTips from '../../components/AlertTips/alert-tips';

import { LocationSearchToJson, LocationSearchJsonToUrl,setStrLength } from '../../modules/tools';

import { Button } from '../../components/Button';
// import Container from './login-register-container';
//react路由
import { PropTypes } from 'react-router';
import { Link } from 'react-router';
//用户相关action
import GYUserAction from '../../actions/gy-user-action';
//用户相关store
import GYUserStore from '../../stores/gy-user-store';
//公共action
import CommonAction from '../../actions/common-action';
//request
import { userInterface, GYUserInterface } from '../../modules/data-interface';

import cookieObj from '../../modules/cookie';

const cookie = cookieObj.cookie;

// 价格 折扣  商家信息
import PayInfo from '../../components/PayInfo';

//果仁支付头部
import GopPayTitle from '../../components/GopPayTitle';

// 安全键盘
import CodeKeybord from '../../components/Keybord/code-keybord.jsx';

import _ from 'lodash';

import './index.less';

import $ from 'jquery';

/**
 * @class 登录页面
 */
class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mobile: '',
			codeValue: '',
			isCodeSended:false,              //验证码是否点击
			isKeybordCommonInput:false,		 // 验证码输入框键盘
			btnState: false,
			codeNext: false,
			phoneNext: false,
			getCodeNext:false,
			codeTips: '获取验证码',
			isVCodeImageInputShow :false,
			VCodeImageInputErr:'',
		};
		this.payInfo = {
			type: 'payInfo',
			price: '',
			sale: '',
			imgsrc: '',
			merName: ''
		};				

		// GYUserAction.GopCashieGetOrderInfo({
		// 	merchantId: '2111234567890832',
		// 	appId: 'GAPP_59F0609B61D0F63E',
		// 	consNo: 'MN790428533470113793',			
		// });

		// 获取URL中订单参数
		this.searchJson = LocationSearchToJson();
		if(this.searchJson){
			this.payInfo = {
				type: 'payInfo',
				price: (this.searchJson.ordrAmt/100).toFixed(2),
				sale: this.searchJson.marketTactics,
				imgsrc: this.searchJson.appIconUrl,
				merName: setStrLength(this.searchJson.appName,20)
			};		
		}else{
			CommonAction.alert('缺少交易数据，请返回重新选择');
		}	

		window.backObj&&window.backObj.physicsBack&&window.backObj.physicsBack(false);
	};

	componentDidMount() {
		this.unsubscribe = GYUserStore.listen(this.onStoreChanged.bind(this));
	};

	componentWillUnmount() {
		this.unsubscribe();
	};

	onStoreChanged(info) {
		// Object {error: "服务器异常", loading: false, info: { msg:'服务器异常', status: 304}}
		// {info: { data: {gopToken: "d5610892684b4523a1c2547b59318e37"}}}
		this.info = info;
		// 如果有错误
		if(this.info.error){
			CommonAction.alert(this.info.error);
		}else if (this.info && this.info.type==='identifyingCode') {
			GYUserAction.login({
				phone:this.state.mobile,
				identifyingCode:this.state.codeValue
			});
		}else if (this.info && this.info.type==='getCreateImage') {
			console.log(this.info);
			if (this.info.info&&this.info.info.data && this.info.info.data.isNeed) {
				this.setState({
					isVCodeImageInputShow:true,
					vCodeImageUrl :this.info.info.data.result,
					VCodeImageInputErr:''
				});
			}else{
				this.getVCodeFN(this.cbfn,'');
			}
		}
		else{
			cookie('mobile', this.state.mobile);
			this.context.history.pushState(null, '/is_pay_enough?'+LocationSearchJsonToUrl(this.searchJson));			
		}
	};

	// 登录按钮状态
	updateValue(newState) {
		if(newState.codeNext && newState.phoneNext && newState.getCodeNext){
			newState.btnState = true;
		}else{
			newState.btnState = false;
		}
		this.setState(newState);
	};

	// 手机号输入
	phoneInputChange(newState){
		let state = {};
		_.extend(state, this.state, newState);
		state.mobile = newState.value;
		// 有错误
		if(state.error){
			state.phoneNext = false;
		}else{
			state.phoneNext = true;
		}
		this.setState(state);
		this.updateValue(state);
	};

	// 验证码输入
	VCodeInputChange(newState){
		let state = {};
		_.extend(state, this.state, newState);
		state.codeValue = newState.value;
		// 有错误
		if(state.error){
			state.codeNext = false;
		}else{
			state.codeNext = true;
		}
		this.setState(state);
		this.updateValue(state);
	};

	// 获取验证码  cbfn定时器函数   s倒计时秒
	getVCodeFN(timercbfn,imageCaptcha) {
		let location = this.context.location;
		let loginData = {
			mobile: this.state.mobile,
			phoneNext: this.state.phoneNext,
			codeTips: this.state.codeTips
		};
		if(loginData.phoneNext){
			timercbfn && timercbfn(function(cbfn){
				this.setState({isCodeSended:true});
				GYUserInterface.sendCaptcha({
					phone:loginData.mobile,
					imageCaptcha:imageCaptcha,
				}).then(function(){
					CommonAction.alert('发送成功，请查收');
					this.setState({isCodeSended:false,getCodeNext:true,isVCodeImageInputShow:false});
					this.updateValue(this.state);
					//this.state.getCodeNext = true;
					cbfn && cbfn();
				}.bind(this)).fail(function(data){
					this.setState({isCodeSended:false,VCodeImageInputErr:data});
					// CommonAction.alert(data);
				}.bind(this));
			}.bind(this));
		}else{
			
			CommonAction.alert('请填写正确手机号');
		}
	};	

	getImageCode(){
		GYUserAction.getCreateImage({
			phone:this.state.mobile
		});
	}

	// 验证码输入框onchange
	keybordInputChange(value){
		console.log(value);
		let state = {};
		_.extend(state, this.state);
		let codeNext;
		if (value.length==6) {
			codeNext = true;
			state.isKeybordCommonInput = false;
		}else{
			codeNext = false;
		}
		state.codeValue = value;
		state.codeNext = codeNext;
		this.setState(state);
		this.updateValue(state);
	};

	keybordToggle(value){
		setTimeout(function(){
			this.keybordInputShowOrClose(value)
		}.bind(this), 100)
	}

	keybordInputShowOrClose(value){
		let MIN_HEIGHT = 620;
		if (value) {
			
			// 设置数字键盘位置始终在最底部
			let docHeight = document.documentElement.clientHeight;
			let contentHeight = document.body.scrollHeight;
			if(contentHeight< MIN_HEIGHT){
				var contentFixHeight,
						keyboardFixHeight;
				if(docHeight < contentHeight){
					contentFixHeight = MIN_HEIGHT - contentHeight;
					keyboardFixHeight = (contentHeight - docHeight) + contentFixHeight; 
				}else{
					contentFixHeight = MIN_HEIGHT - contentHeight;
					keyboardFixHeight = contentFixHeight; 
				}
				
				$('.login-btn-area').css('margin-bottom', contentFixHeight  + 'px');
				$('#keyborad-content').css('bottom',  (-keyboardFixHeight)  + 'px');

				setTimeout(function(){
					document.body.scrollTop = 99999;
				})
				
			}else{

			}
			
			//document.body.style.overflow = 'hidden';
			//document.body.scrollTop = '150';
		}else{
			$('.login-btn-area').css('margin-bottom','0px');
			document.body.scrollTop = '0';
		}	
		this.setState({  isKeybordCommonInput: value });
	}
	
	login() {
		let loginData = {
			mobile: this.state.mobile,
			vCode:this.state.codeValue,
			codeNext: this.state.codeNext,
			phoneNext: this.state.phoneNext
		};

		if(loginData.codeNext && loginData.phoneNext && this.state.getCodeNext){
			GYUserAction.identifyingCode({
				phone:loginData.mobile,
				identifyingCode:loginData.vCode
			});
		}else if(!loginData.phoneNext){
			return false;
			CommonAction.alert('请填写正确手机号');
		}else if(!loginData.codeNext){
			return false;
			CommonAction.alert('请输入6位数字验证码');
		}
	};

	confirmCancel(){
		console.log('confirm_cancel');
	};
	confirmSubmit(){
		console.log('confirm_submit');
	};

	backMethod(){
		if(window.backObj && window.backObj.backMessage){
			window.backObj.backMessage()
		}else{
			this.context.history.pushState(null, '/create_order');
		}
	}

	handleCodeImageInput(value){
		console.log(value);
		if (value.length==4) {
			this.getVCodeFN(this.cbfn,value);
		}
	}

	//显示图形验证码
	showCodeImageInput(){
		if (this.state.isVCodeImageInputShow) {
			return <VCodeImageInput 
						vCodeImageUrl={this.state.vCodeImageUrl}
						handleCodeImageInput = {function(value){this.handleCodeImageInput(value)}.bind(this)}
						errInfo={this.state.VCodeImageInputErr}
						getImageCode = {function(){this.getImageCode()}.bind(this)}/>;
		}
	}

	render() {
		return (
			<div>
				<form autoComplete="off">
					<PayInfo payInfo={this.payInfo}></PayInfo>
					<ul>
						<p className="login-tips">登录果仁宝帐号付款</p>
						<PhoneInput
							onChange={ function(state) { this.phoneInputChange(state) }.bind(this) }
						/>

						<VCodeTimerInput 
							isCodeSended = {this.state.isCodeSended}
							isKeybordInput = 'true'
							keybordInputShowOrClose = {function(value) { this.keybordToggle(value)}.bind(this)}
							inputValue = { this.state.codeValue}
							s = '60'
							getVCodeFN={ function(cbfn,s){ this.getImageCode();this.cbfn = cbfn; }.bind(this) }
						>			
						</VCodeTimerInput>
						<li className="login-btn-area">
							<Button onClick={ function() { this.login() }.bind(this) } title="登 录" btnState={ this.state.btnState }/>
						</li>

						<CodeKeybord 
							onPress={ function(value){ this.keybordInputChange(value) }.bind(this)}
							isKeybordBoxShow = { this.state.isKeybordCommonInput }
							keybordClose = { function(value){ this.keybordToggle(value) }.bind(this) }
							maxLength = { 6 }
						>
						</CodeKeybord>


						</ul>
				</form>
				{this.showCodeImageInput()}
			</div>
		);
	};
};
/*
<VCodeInput 
	getVCodeFN={ function(cbfn){ this.getVCodeFN(cbfn) }.bind(this) }
	onChange={ function(state) { this.VCodeInputChange(state) }.bind(this) }
/>
*/
//默认属性
Login.defaultProps = {
	backMethod: function(){
		if(window.backObj && window.backObj.backMessage){
			window.backObj.backMessage()
		}
	}.bind(this)
};

/**
 * @desc context
 * @type {{history: *}}
 */
Login.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

export default Login;

/*
						// <VCodeTimerInput 
						// 	onChange={ function(state) { this.VCodeInputChange(state) }.bind(this) }
						// 	s = '60'
						// 	maxLength = { 6 }
						// 	getVCodeFN={ function(cbfn , s){ this.getVCodeFN(cbfn , s) }.bind(this) }
						// />
						*/