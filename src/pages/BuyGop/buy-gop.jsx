/**
 * @file 登录
 * @author kw
 */

'use strict';
import React from 'react';
//电话输入框,密码输入框,按钮
import { PhoneInput, VCodeInput, VCodeTimerInput, PasswordInput, KeybordCommonInput} from '../../components/Form';
import { SelectBank } from '../../components/Form/Select';
// dialog
import Dialog from '../../components/Dialog/dialog';
import { 
	OptionBankDesc,
	OptionBankAdd,
	OptionGopBalance
} from '../../components/Form/Option'
import { Button } from '../../components/Button';
// import Container from './login-register-container';
//react路由
import { PropTypes } from 'react-router';
import { Link } from 'react-router';
//用户相关action
import UserAction from '../../actions/user-action';
//用户相关store
import GYUserStore from '../../stores/gy-user-store';
//公共action
import CommonAction from '../../actions/common-action';
//request
import { userInterface, GYUserInterface  } from '../../modules/data-interface';
//输入校验模块
import validate from '../../modules/validate';
// 步骤
import Step from '../../components/Step/step';
//本地存储
import store from 'store';
//全局配置
import { globalConfig } from '../../modules/config';

import _ from 'lodash';
//用户相关action
import GYUserAction from '../../actions/gy-user-action';
import './index.less';

import $ from 'jquery';


// 价格 折扣  商家信息
import PayInfo from '../../components/PayInfo';
// GOP价格涨浮
import GopPrice from '../../components/GopPrice';
// 安全键盘
import CodeKeybord from '../../components/Keybord/code-keybord.jsx';
import Keybord from '../../components/Keybord/keybord.jsx';
import PasswordKeybord from '../../components/Keybord/password-keybord.jsx';
import { LocationSearchToJson, LocationSearchJsonToUrl } from '../../modules/tools';
import GopPayLoading from '../../components/GopPayLoading/loading.js';


/**
 * @class 登录页面
 */
class BuyGop extends React.Component {
	/**
	{
		"bankPhone":"182****1720",
		"createTime":"2016-03-23 18:09:17",
		"cardType":"SAVINGS_DEPOSIT_CARD",
		"bankName":"平安银行",
		"id":55,
		"cardNo":"6216 **** **** 8244",
		"withdrawCard":"NOT_WITHDRAW_CARD"
	}
	 */
	constructor(props) {
		super(props);
		this.searchJson = LocationSearchToJson();
		// 拉取订单数据
		let gopBuyInOrderInfoData = 'URL获取数据';
		if(!gopBuyInOrderInfoData){
			CommonAction.alert('缺少订单数据');
		}
		console.log(gopBuyInOrderInfoData);

		GYUserAction.commonStatic({});
		// 获取银行卡列表  判断是否绑卡
		//GYUserAction.getBankcardList({});
		
		let orderId = gopBuyInOrderInfoData && gopBuyInOrderInfoData.buyinOrder && gopBuyInOrderInfoData.buyinOrder.id ? gopBuyInOrderInfoData.buyinOrder.id : '';
		this.state = {
			isGyLoadingShow: false,			 // 加载组建显示隐藏
			isKeybordCommonInput:false,		 // 验证码输入框键盘
			isPasswordKeybordBoxShow: false, // 安全键盘显示隐藏
			passwordKeybordErr:'',
			inputValue:'',					 //支付密码
			passwordCount: 0,				 //支付密码输入次数	
			isPasswordDialogShow:false,		 //支付密码输错5次以后的弹窗
			passwordDialogContent:'',        //支付密码输错5次后的弹窗内容
			isDialogShow: false, 			 // dialog显示隐藏

			passwordNotSet:false,    //支付密码未设置
			passwordNotSetContent:'',  

			// 验证码
			codeValue: '',
			codeNext: false,
			codeGet:false,
			isCodeSended:false,              //验证码是否点击
			// 按钮状态
			btnState: false,
			// 订单号
			orderId: orderId,
			// 银行卡选项
			selectOptions: [],
			// 默认选项
			selectedItem: 	{
				'bankPhone':'',
				'createTime':'',
				'cardType':'',
				'bankName':'选择银行',
				'id':'',
				'cardNo':'',
				'withdrawCard':''
			},
			// gop价格 原价
			gopInfo: {
				type: 'page_buy',
				curprict: this.searchJson && this.searchJson.curprict,
				buynum: this.searchJson && this.searchJson.buynum
			},
			// 支付商家  价格 折扣
			payInfo: {
				type: 'buyin',
				price:this.searchJson && this.searchJson.price,
			},
			//渠道token
			chlToken : '',
			//支付结果查询次数
			payTime: 0,
			interval: '',
			bankInfoList:'', //  静态资源保存银行支付限额信息

			keybordLever: 1
		};

		this.gyLoadingTime = null; // 加载组建 定时器
	
		//dev环境下单
		// GYUserAction.AppHandle({
		// 	mercId:"2111234567890832",
		// 	appId:"GAPP_59F0609B61D0F63E",
		// 	ordrAmt:5000
		// });

		// qa环境下单
		// GYUserAction.AppHandle({
		// 	mercId:"2111234567890947",
		// 	appId:"GAPP_8E8A0F27CB24F984",
		// 	ordrAmt:2000
		// });

		// GYUserAction.AppHandle({
		// 	mercId:"2111234567890954",
		// 	appId:"GAPP_9F1998D556EBE97F",
		// 	ordrAmt:5000
		// });

		window.backObj&&window.backObj.physicsBack&&window.backObj.physicsBack(true);
	};

	componentDidMount() {
		this.unsubscribe = GYUserStore.listen(this.onStoreChanged.bind(this));
	};
	componentWillUnmount() {
		this.unsubscribe();
	};
	onStoreChanged(info) {
		if(info && info.error){
			if (this.timeOut) {
				clearTimeout(this.timeOut);
			}
			// 查询果仁宝合并付款结果 三次
			if (info.type && info.type=='GopCashieQueryPay') {
				this.stopQueryPayResult();
			}else if(info.type && info.type=='GopCashieCnfmPay'){
				// 提交果仁宝结果
				//this.stopQueryPayResult();
				// this.context.history.pushState(null, '/pay_unconnect');
				clearTimeout(this.gyLoadingTime);
				this.setState({isGyLoadingShow: false,passwordKeybordErr:info.error,keybordLever: 2});
			}else if (info.type && info.type=='checkPayPwd') {
				//支付密码输错5次后弹窗
				if (this.state.passwordCount==4) {
					clearTimeout(this.gyLoadingTime);
					this.setState({isGyLoadingShow: false,isPasswordKeybordBoxShow:false,isPasswordDialogShow:true,passwordDialogContent:'您的支付密码已累计错误5次，果仁宝将关闭支付功能3小时，请3小时后再试。如有疑问，请联系果仁宝客服400-184-9696'});
				}else if(this.state.passwordCount==9){
					clearTimeout(this.gyLoadingTime);
					this.setState({isGyLoadingShow: false,isPasswordKeybordBoxShow:false,isPasswordDialogShow:true,passwordDialogContent:'您的支付密码已累计错误10次，为了您的账户安全，您的账号已被果仁宝冻结。如有疑问，请联系果仁宝客服400-184-9696'});
				}else {
					clearTimeout(this.gyLoadingTime);
					this.state.passwordCount++;
					this.setState({ isGyLoadingShow: false,inputValue:'',passwordKeybordErr:info.error});
				}
				
			}else if (info.type && info.type=='checkPayPasswordStatus' && info.info && info.info.status=='311'){
				this.setState({passwordNotSet:true,passwordNotSetContent:info.info.msg});
			}else {
				CommonAction.alert(info.error);	
			}
			return false;	
		}
		
		//静态资源接口
		if(info && info.type == 'commonStatic' && info.info && info.info.data && info.info.data.BankInfo && info.info.data.BankInfo.bankInfoList){
			this.state.bankInfoList = info.info.data.BankInfo.bankInfoList;
			// 获取银行卡列表  判断是否绑卡
			GYUserAction.getBankcardList({});
		}

		// 获取银行卡列表
		if(info && info.type == 'bankcardList' && info.info && info.info.data && info.info.data.list){
			let options = [];
			if (info.info.data.list.length) {
				options = info.info.data.list;
			}
			for (let i = 0; i < options.length; i++) {
				for (let j = 0; j < this.state.bankInfoList.length; j++) {
					if(this.state.bankInfoList[j].name==options[i].bankName){
						options[i].limitNotify = this.state.bankInfoList[j].limitNotify;
						break;
					}
				}
			}
			this.setState({
				selectOptions: options,
				selectedItem: info.info.data.list.length ? info.info.data.list[0] : {id:'nobankcard',bankName:'添加银行卡'}
			});
		}

		// 检测支付密码状态
		if (info && info.type=='validateUser' && info.info) {
			GYUserAction.checkPayPasswordStatus({});
		}

		if (info && info.type ==='checkPayPasswordStatus' && info.info) {
			this.state.passwordCount = info.info.data.times;
			if (info.info.data &&info.info.data.times && info.info.data.times==5) {
				this.setState({isPasswordDialogShow:true,passwordDialogContent:'您的支付密码已累计错误5次，果仁宝将关闭支付功能3小时，请3小时后再试。如有疑问，请联系果仁宝客服400-184-9696'});
			}else if (info.info.data &&info.info.data.times && info.info.data.times==10) {
				this.setState({isPasswordDialogShow:true,passwordDialogContent:'您的支付密码已累计错误10次，为了您的账户安全，您的账号已被果仁宝冻结。如有疑问，请联系果仁宝客服400-184-9696'});
			}else{
				this.setState({
					isPasswordKeybordBoxShow: true
				});
			}
		}
		if (info && info.type==='checkPayPwd' && info.info) {
			
			GYUserAction.GopCashieCnfmPay({
				version:this.searchJson.version,
				mercOrdrNo:this.searchJson.mercOrdrNo,
				ordrAmt:this.searchJson.ordrAmt,
				curType:'GRB',
				payToolType:'gop',
				//marketTactics:'',
				consNo:this.searchJson.consNo,
				payPwd:this.state.inputValue,
				msgInfo:this.state.codeValue,
				action:'gopBuy',
				orderId:this.searchJson.orderId,
				orderCode:this.searchJson.orderCode,
				//bankCardId:this.state.selectedItem.id,
				chlToken:this.state.chlToken,
				gopPayType:this.searchJson.gopPayType

			});
		}
		// 密码长度够  提交果仁宝
		if (info && info.type === 'GopCashieCnfmPay' && info.info) {
			if (this.timeOut) {
				clearTimeout(this.timeOut);
			}
			this.gyLoadingTime = setTimeout(()=>{
				this.setState({ isGyLoadingShow: true });
			},300);
			this.setState({ isPasswordKeybordBoxShow: false});
			let that = this;			
			this.state.interval = setInterval(function(){
				let value = that.state.payTime+1;
				that.setState({payTime: value});
				// 查询果仁宝结果
				GYUserAction.GopCashieQueryPay({
					version:that.searchJson.version,
					consNo:that.searchJson.consNo,
					singleNo:that.searchJson.singleNo
				});
			},2000);
		}

		// 合并付款结果 
		if (info && info.type == 'GopCashieQueryPay' && info.info && info.info.data) {
			if (info.info.data.status === 2) {
				clearTimeout(this.gyLoadingTime);
				this.setState({ isGyLoadingShow: false });				
				clearInterval(this.state.interval);
				this.state.payTime = 0;
				let marketArticle = (info.info.data.marketArticle && JSON.parse(info.info.data.marketArticle)) || {};
				marketArticle.payAmount = info.info.data.payAmount;
				marketArticle.appName = info.info.data.appName;
				marketArticle.payTime = info.info.data.payTime;
				this.context.history.pushState({marketArticle:marketArticle}, '/pay_success?'+LocationSearchJsonToUrl(this.searchJson));
			}else if (info.info.data.status === 1) {				
				this.stopQueryPayResult();
			}else{
				clearTimeout(this.gyLoadingTime);
				this.setState({ isGyLoadingShow: false });					
				clearInterval(this.state.interval);
				this.context.history.pushState({reason:info.info.data.failReason},'/pay_fail?'+LocationSearchJsonToUrl(this.searchJson));
			}
		}
	};

	//支付结果停止查询，跳转到超时页面
	stopQueryPayResult(){
		if (this.state.payTime==3) {
			clearTimeout(this.gyLoadingTime);
			this.setState({ isGyLoadingShow: false });				
			clearInterval(this.state.interval);
			this.context.history.pushState(null,'/pay_overtime?'+LocationSearchJsonToUrl(this.searchJson));
		}
	}

	// 下一步按钮状态
	updateValue(newState) {
		if(newState.selectedItem && newState.selectedItem.id!='nobankcard' && newState.codeNext && newState.codeGet){
			newState.btnState = true;
		}else{
			newState.btnState = false;
		}
		this.setState(newState);
	};

	// 获取验证码  做为组件的回调函数使用
	getVCodeFN(timercbfn) {
		console.log(this.state.selectedItem);
		let data = {
			selectedItem: this.state.selectedItem,
			orderId : this.state.orderId
		};
		console.log(this.state.selectedItem);
		if(data.selectedItem && data.selectedItem.id){
			console.log(data.selectedItem);
			timercbfn && timercbfn(function(cbfn){
				this.setState({isCodeSended:true});
				GYUserInterface.sendBankPhoneCode({
					orderId:this.searchJson.orderId,
					bankCardId:data.selectedItem.id
				}).then(function(data){
					this.setState({isCodeSended:false,codeGet:true});
					if(data.status && data.status ==200){
						console.log(data.data);
						// this.state.codeGet = true;
						if (data.data&& data.data.token) {
							this.state.chlToken = data.data.token;
						}
						CommonAction.alert('发送成功，请查收');
						cbfn && cbfn();
					}else{
						CommonAction.alert(data.msg);
					}
				}.bind(this)).fail(function(data){
					this.setState({isCodeSended:false});
					CommonAction.alert(data);
				}.bind(this));
			}.bind(this));
		}else{
			CommonAction.alert('请选择银行卡');
		}
	};

	// slect change后回调
	payByBank(data){
		let state = {};
		console.log(data);
		_.extend(state, this.state);
		// 选中前后两卡不同
		if(data.cardNo && data.cardNo != this.state.selectedItem.cardNo){
			state.selectedItem = data;
			state.btnState = false;
			this.setState(state);
		}else{
			this.updateValue(state);
		}
	};
	getBankOptions(){
		let options = this.state.selectOptions.map( (child, index) => {
			return (
				<OptionBankDesc value={ 'bank'+index } data={child} key={ 'option-bank'+index }></OptionBankDesc>
			);
    	});
		// options.unshift(<OptionGopBalance value='gop' key='option-gop-balance'></OptionGopBalance>)
		options.push(<OptionBankAdd value='add' key='option-bank-add'></OptionBankAdd>)

		return options;
	};
	// 下拉框  change事件  判断选择前后的银行是否相同  不同重新获取验证码
	selectChange(value, data){
		switch(value){
			case 'gop':
				alert('调用果仁支付接口');
			break;
			case 'add':
				this.searchJson.fromePage = 'buy_gop_add_bank_card';
				this.context.history.pushState(null, '/authentication?'+LocationSearchJsonToUrl(this.searchJson));
			break;
			default:
				this.payByBank(data);
			break;
		}
	};

	// select click时候的事件
	selectOnClick(selectedItem){
		if(selectedItem.id === 'nobankcard'){
			this.searchJson.fromePage = 'buy_gop_add_bank_card';
			this.context.history.pushState(null, '/authentication?'+LocationSearchJsonToUrl(this.searchJson));
		}		
	};

	// 点击支付按钮事件
	gopOrderPay(){
		let queryDate = this.state;
		if (this.state.btnState) {
			GYUserAction.validateUser({});
		}else if(queryDate.selectedItem.id === 'nobankcard'){
			return false;
			CommonAction.alert('请添加银行卡');
		}else if(!queryDate.codeNext){
			return false;
			CommonAction.alert('请输入6位数字验证码');
		}
		// else{
		// 	GYUserAction.validateUser({});
		// }
	};

	// 验证码输入框onchange
	keybordInputChange(value){
		console.log(value);
		let state = {};
		_.extend(state, this.state);
		if (value.length==6) {
			state.isKeybordCommonInput = false;
		}
		let codeNext;
		if (value.length==4 || value.length==6) {
			codeNext = true;
		}else{
			codeNext = false;
		}
		state.codeValue = value;
		state.codeNext = codeNext;
		this.setState(state);
		this.updateValue(state);
	};
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
				
				$('.payfor-btn').css('margin-bottom', contentFixHeight  + 'px');
				$('#keyborad-content').css('bottom',  (-keyboardFixHeight)  + 'px');

				setTimeout(function(){
					document.body.scrollTop = 99999;
				})
				
			}else{

			}
			
			//document.body.style.overflow = 'hidden';
			//document.body.scrollTop = '150';
		}else{
			$('.payfor-btn').css('margin-bottom','0px');
			document.body.scrollTop = '0';
		}	
		

		this.setState({  isKeybordCommonInput: value });
	}

	// 密码键盘使用
	// 密码输入框关闭
	PasswordKeybordClose(){
		this.setState({ isPasswordKeybordBoxShow: false});
	};
	// 密码长度够 执行下一步请求
	PasswordKeybordOnchange(inputValue){
		if(inputValue.length===6){
			this.state.inputValue = inputValue;
			

			GYUserAction.checkPayPwd({
				payPwd:this.state.inputValue
			});

			//购买果仁接口挂掉没有反应，停止等待状态
			this.timeOut = setTimeout(function(){
				clearTimeout(this.gyLoadingTime);
				this.setState({isGyLoadingShow: false,passwordKeybordErr:'系统繁忙，请稍后再试'});
			}.bind(this),3000);

			/*
			this.setState({ isPasswordKeybordBoxShow: false});
			GYUserAction.GopCashieCnfmPay({
				version:this.searchJson.version,
				mercOrdrNo:this.searchJson.mercOrdrNo,
				ordrAmt:this.searchJson.ordrAmt,
				curType:'GRB',
				payToolType:'gop',
				//marketTactics:'',
				consNo:this.searchJson.consNo,
				payPwd:inputValue,
				msgInfo:this.state.codeValue,
				action:'gopBuy',
				orderId:this.searchJson.orderId,
				orderCode:this.searchJson.orderCode,
				//bankCardId:this.state.selectedItem.id,
				chlToken:this.state.chlToken,
				gopPayType:this.searchJson.gopPayType

			});
			*/
			
		}
	};

	// dialog
	dialogHide(){
		this.setState({
			isDialogShow: false
		});
	};	
	dialogShow(){
		this.setState({
			isDialogShow: true
		});
	};

	//跳转到重置密码页面
	changeToSetPassword(){
		this.searchJson.fromePage = 'buy_gop';
		this.context.history.pushState(null,'/sent_phone_code?'+LocationSearchJsonToUrl(this.searchJson));
	}

	render() {
		let bankOptions = this.getBankOptions();
		return (
			<div>
				<GopPrice gopInfo = { this.state.gopInfo }></GopPrice>
				<PayInfo payInfo={this.state.payInfo} dialogShow= {function(){ this.dialogShow() }.bind(this)}></PayInfo>
				<SelectBank
					selectOnClick = { this.selectOnClick.bind(this) }
					selectedItem= { this.state.selectedItem }
					onChange={ this.selectChange.bind(this) }
				>
					{ bankOptions }
				</SelectBank>
				<VCodeTimerInput 
					isCodeSended = {this.state.isCodeSended}
					isKeybordInput = 'true'
					keybordInputShowOrClose = {function(value) {this.keybordInputShowOrClose(value)}.bind(this)}
					inputValue = { this.state.codeValue}
					s = '60'
					getVCodeFN={ function(cbfn,s){ this.getVCodeFN(cbfn,s) }.bind(this) }
				>			
				</VCodeTimerInput>

				<div className="payfor-btn">
					<Button onClick={ function() { this.gopOrderPay() }.bind(this) } 
					title="确认支付" 
					btnState={ this.state.btnState }/>
				</div>

				<CodeKeybord 
					onPress={ function(value){ this.keybordInputChange(value) }.bind(this)}
					isKeybordBoxShow = { this.state.isKeybordCommonInput }
					keybordClose = { function(value){ this.keybordInputShowOrClose(value) }.bind(this) }
					maxLength = { 6 }
				>
				</CodeKeybord>

				<PasswordKeybord
					keybordClose = { function(){ this.PasswordKeybordClose() }.bind(this) }
					isKeybordBoxShow = { this.state.isPasswordKeybordBoxShow }
					onPress = { function(value){ this.PasswordKeybordOnchange(value) }.bind(this) }
					maxLength = { 6 }
					errMsg = {this.state.passwordKeybordErr}
					lever = {this.state.keybordLever}
					forgetPasswordFn={function(){this.changeToSetPassword()}.bind(this)}
				>
				</PasswordKeybord>
				<Dialog
					isDialogShow = { this.state.isDialogShow }
					dialogHide = { function(){ this.dialogHide() }.bind(this) }
				    btnCencle = "确认"
				    dialogContent = "11111111111111111"
				>
				    <p className="dialog-text-align-left dialog-tit">支付须知</p>
				    <p className="dialog-text-align-left dialog-con">
				        <span>因果仁价格为实时涨幅，您本次购买果仁数量自动增加</span>
				        <span className="dialog-red">2%</span>
				        <span>以保证交易正常进行！剩余果仁将自动转入您的帐户，为您带来果仁实时涨幅福利。</span>
				    </p>
				</Dialog>
				<Dialog 
					isDialogShow = { this.state.isPasswordDialogShow }
					dialogHide={function(){
						if(window.backObj && window.backObj.backMessage){
							window.backObj.backMessage()
						}else if(this.searchJson.mercId=='2111234567891039' && this.searchJson.appId=='GAPP_CF2ABE14E8CBBEAE'){
							window.location.href='https://active.clewm.net/Dh20qO';
						}else{
							this.context.history.pushState(null, '/create_order');
						}
					}.bind(this)}>
					<p className="dialog-text-align-left dialog-con">{this.state.passwordDialogContent}</p>
				</Dialog>
				<Dialog 
					isDialogShow = { this.state.passwordNotSet }
					dialogHide={function(){this.changeToSetPassword()}.bind(this)}>
					<p className="dialog-text-align-left dialog-con">{this.state.passwordNotSetContent}</p>
				</Dialog>

				<GopPayLoading
					isGyLoadingShow = { this.state.isGyLoadingShow }
					gyLoadingTxt = "正在支付..."
				>
				</GopPayLoading>		
			</div>
		);
	};
}

//默认属性
BuyGop.defaultProps = {
	
};

/**
 * @desc context
 * @type {{history: *}}
 */
BuyGop.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

export default BuyGop;
/*
				<Keybord
					isKeybordBoxShow = { this.state.isKeybordBoxShow }
					maxLength = {6}
					isHasKeywarp={false}
				></Keybord>



				<PasswordKeybord
					isKeybordBoxShow = { this.state.isKeybordBoxShow }
					nextStep = { function(){ this.nextStep() }.bind(this) }
					closeKeybord = { function(){ this.closeKeybord() }.bind(this) }
				>
				</PasswordKeybord>


 */
