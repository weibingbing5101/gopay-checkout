/**
 * @file 登录
 * @author kw
 */

'use strict';

import React from 'react';
import { Button } from '../../components/Button';
//react路由
import { PropTypes } from 'react-router';
import { Link } from 'react-router';
//用户相关action
import GYUserAction from '../../actions/gy-user-action';
//用户相关store
import GYUserStore from '../../stores/gy-user-store';
//公共action
import CommonAction from '../../actions/common-action';

import { userInterface, GYUserInterface } from '../../modules/data-interface';

import cookieObj from '../../modules/cookie';

const cookie = cookieObj.cookie;


//本地存储
import store from 'store';

// 价格 折扣  商家信息
import PayInfo from '../../components/PayInfo/';
// GOP价格涨浮
import GopPrice from '../../components/GopPrice/';
// 用户GOP 当前数量 以及订单支付数
import UserGopInfo from '../../components/UserGopInfo/';
// 底部提示
import BottomTips from '../../components/BottomTips/';
import { LocationSearchToJson, LocationSearchJsonToUrl,setStrLength } from '../../modules/tools';
import PasswordKeybord from '../../components/Keybord/password-keybord.jsx';
import GopPayLoading from '../../components/GopPayLoading/loading.js';
import Dialog from '../../components/Dialog/dialog';

import _ from 'lodash';
import $ from 'jquery';

import './index.less';

/**
 * @class 登录页面
 */
class IsPayEnough extends React.Component {
	constructor(props) {
		super(props);

		this.searchJson = LocationSearchToJson();

		this.state = {
			isGyLoadingShow: false,			 // 加载组建显示隐藏
			btnState:false,
			// 安全键盘显示隐藏
			isPasswordKeybordBoxShow: false,
			passwordKeybordErr:'',
			inputValue:'',					 //支付密码
			passwordCount: 0,				 //支付密码输入次数	
			isPasswordDialogShow:false,		 //支付密码输错5次以后的弹窗
			passwordDialogContent:'',        //支付密码输错5次后的弹窗内容
			isDialogShow: false, 			 // dialog显示隐藏

			passwordNotSet:false,    //支付密码未设置
			passwordNotSetContent:'',  
			
			// 商家信息 价格 折扣
			payInfo: {
				type: 'payInfo',
				price:  (0).toFixed(2),
				sale: '',
				imgsrc: '',
				merName: ''
			},
			// gop现价 原价
			gopInfo: {
				type: 'page_isenough',
				curprict: (0).toFixed(2),
				orderprice: (0).toFixed(3)
			},
			// 用户果仁数
			userGopInfo: {
				userGopNum:  (0).toFixed(3),
				userGopNumReal:0,
				payGopNum:  (0).toFixed(3),
				payGopNumReal:0
			},
			//果仁牌价查询接口数据
			gopPriceInfo :{
				curprict: '',
				buynum: '',
				price:''
			},
			//支付结果查询次数
			payTime: 0,
			interval: '',
			keybordLever: 1,
			prePayErrMsg:'',      //保存预支付接口返回的错误信息
			isHaveEnoughGopShow:false, //创建买果仁订单时，如果发现现有果仁足够支付，显示窗口
			haveEnoughGopContent:''

		};
		this.gyLoadingTime = null;			 // 加载组建 定时器
		// 底部提示标识
		this.bottomtips = 0;


		window.backObj&&window.backObj.physicsBack&&window.backObj.physicsBack(true);		
	};
	componentDidMount() {
		// 组件加载完成  预支付获取
		this.unsubscribe = GYUserStore.listen(this.onStoreChanged.bind(this));
		this.prePay();
	};

	componentWillUnmount() {
		this.unsubscribe();
	};

	onStoreChanged(info) {
		if(info && info.error){
			if (this.timeOut) {
				clearTimeout(this.timeOut);
			}
			if (info.type && info.type=='prePay') {
				this.state.prePayErrMsg=info.error;
				if (info.info && info.info.returnCode==='700311') {
					console.log(cookie('gopToken'));
					cookie('gopToken','');
					this.context.history.pushState(null, '/home_login?'+LocationSearchJsonToUrl(this.searchJson));
					return;
				}else{
					CommonAction.alert(info.error);
				}
			}else if (info.type && info.type=='GopCashieQueryPay') {
				this.stopQueryPayResult();
			}else if(info.type && info.type=='GopCashieCnfmPay'){
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
			clearTimeout(this.gyLoadingTime);
			this.setState({ isGyLoadingShow: false });
			return false;				
		}
			
		if(info.type ==='prePay' && info && info.info && info.info.data){
			this.setState({
				btnState:true,
				payInfo:{
					type: 'payInfo',
					price: (info.info.data.ordrAmt/100).toFixed(2),			// 实付金额
					sale: this.searchJson.marketTactics,
					imgsrc: this.searchJson.appIconUrl,
					merName:setStrLength(info.info.data.appName,20)		// 应用名称
				},
				// gop现价 原价
				gopInfo: {
					type:'page_isenough',
					curprict: info.info.data.gopPrice.toFixed(2),
					orderprice: info.info.data.gopCostPrice.toFixed(3)
				},
				// 用户果仁数
				userGopInfo: {
					// userGopNum: parseFloat(info.info.data.usrGopBal),
					// payGopNum: parseFloat(info.info.data.ordrGopNum)
					userGopNum: ((Math.floor(info.info.data.usrGopBal*1000))/1000).toFixed(3),
					userGopNumReal:info.info.data.usrGopBal,
					//payGopNum: info.info.data.ordrGopNum.toFixed(3)
					payGopNum: (Math.floor(info.info.data.ordrGopNum*1000)+1)/1000,
					payGopNumReal:info.info.data.ordrGopNum,
				}
			});
		}

		if (info && info.type=='GopCashieGopPrice' && info.info && info.info.data){
			if (this.timeOut) {
				clearTimeout(this.timeOut);
			}
			let amount = info.info.data.amount/100;
			if (info.info.data.amount==0) {
				this.setState({isHaveEnoughGopShow:true,haveEnoughGopContent:'恭喜您，账户果仁数可以直接支付该订单啦，快快去完成支付吧'});
			}else{
				this.setState({gopPriceInfo:{curprict: info.info.data.gopPrice.toFixed(2),buynum: info.info.data.gopNum.toFixed(3),price: amount.toFixed(2)}});
				GYUserAction.creatGopBuyInOrder({
					orderMoney: amount,
					payType: 'UNION_BANK_PAY',
					sourceType:'GOOPAL_PAY'
				});
			}	
		}

		if(info.type ==='creatGopBuyInOrder' && info && info.info){
			if (this.timeOut) {
				clearTimeout(this.timeOut);
			}

			let locationSearch ='curprict='+this.state.gopPriceInfo.curprict+'&buynum='+this.state.gopPriceInfo.buynum+'&price='+this.state.gopPriceInfo.price
								+'&orderId='+info.info.data.buyinOrder.id +'&orderCode='+info.info.data.buyinOrder.orderCode+'&gopPayType='+info.info.data.buyinOrder.payType+'&';
			this.context.history.pushState(null, '/buy_gop?'+ locationSearch +LocationSearchJsonToUrl(this.searchJson));	
		}

		if (info && info.type=='validateUser' && info.info) {
			GYUserAction.checkPayPasswordStatus({});
		}

		if (info && info.type=='checkPayPasswordStatus' && info.info) {

			if (this.timeOut) {
				clearTimeout(this.timeOut);
			}
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
				//msgInfo:'',
				action:'gopPay',
			});
		}

		if(info.type ==='GopCashieCnfmPay' && info && info.info){
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
				GYUserAction.GopCashieQueryPay({
					version:that.searchJson.version,
					consNo:that.searchJson.consNo,
					//singleNo:that.searchJson.singleNo
				});
			},1000);
		}

		if (info && info.type == 'GopCashieQueryPay' && info.info && info.info.data) {
			if (info.info.data.status==2) {
				clearInterval(this.state.interval);
				this.state.payTime = 0;

				let payResultInfo = info.info.data;

				let marketArticle = (info.info.data.marketArticle && JSON.parse(info.info.data.marketArticle)) || {};
				/*marketArticle.payAmount = info.info.data.payAmount;
				marketArticle.appName = info.info.data.appName;
				marketArticle.payTime = info.info.data.payTime;*/

				_.extend(marketArticle, payResultInfo);				


				this.context.history.pushState({marketArticle:marketArticle}, '/pay_success?'+LocationSearchJsonToUrl(this.searchJson));
			}else if (info.info.data.status==1) {
				if (this.state.payTime==3) {
					clearInterval(this.state.interval);
					this.context.history.pushState(null,'/pay_overtime?'+LocationSearchJsonToUrl(this.searchJson));
				}
			}else{
				clearInterval(this.state.interval);
				this.context.history.pushState({reason:info.info.data.failReason},'/pay_fail?'+LocationSearchJsonToUrl(this.searchJson));
			}
		};
	};

	pay(){
		//预支付接口返回错误信息
		//this.searchJson.ordrAmt = 0;
		if(this.searchJson.ordrAmt==0){
			GYUserAction.GopCashieCnfmPay({
				version:this.searchJson.version,
				mercOrdrNo:this.searchJson.mercOrdrNo,
				ordrAmt:this.searchJson.ordrAmt,
				curType:'GRB',
				payToolType:'gop',
				//marketTactics:'',
				consNo:this.searchJson.consNo,
				payPwd:this.state.inputValue,
				//msgInfo:'',
				action:'gopPay',
			});

			return;
		}
		
				

		if (this.state.prePayErrMsg) {
			CommonAction.alert(this.state.prePayErrMsg);	
		}else{
			// 果仁足够
			if(this.state.userGopInfo.payGopNumReal <= this.state.userGopInfo.userGopNumReal){
				/*
				GYUserAction.GopCashieCnfmPay({
					version:this.searchJson.version,
					mercOrdrNo:this.searchJson.mercOrdrNo,
					ordrAmt:this.searchJson.ordrAmt,
					curType:'GRB',
					payToolType:'gop',
					//marketTactics:'',
					consNo:this.searchJson.consNo,
					payPwd:this.state.inputValue,
					//msgInfo:'',
					action:'gopPay',
				});*/
				GYUserAction.validateUser({});
			}else{
				//最新果仁牌价
				GYUserAction.GopCashieGopPrice({
					ordrAmt:this.searchJson.ordrAmt
				});
			}
			//付款或者购买果仁时接口挂掉没有反应，重新调取预支付接口
			this.timeOut = setTimeout(function(){
				window.location.reload();
			}.bind(this),10000);

		}
	};

	getBtnDom(){
		if(this.state.userGopInfo.payGopNum <= this.state.userGopInfo.userGopNum){
			return  <span>付款</span>
		}else{
			return  <span>
					   <span>再去购买</span>
				   	   <i className="yellowG payenoughyellow">
				   	   		{(this.state.userGopInfo.payGopNum - this.state.userGopInfo.userGopNum).toFixed(3)}
				   	   	</i>
				       <span>完成支付</span>
				    </span>
		}
	};

	// 密码键盘使用
	// 密码输入框关闭
	PasswordKeybordClose(){
		this.setState({ isPasswordKeybordBoxShow: false});
		this.state.prePayErrMsg='';
		//关闭密码框时重新调取预支付接口
		this.prePay();
	};
	// 密码长度够 执行下一步请求
	PasswordKeybordOnchange(inputValue){
		if(inputValue.length === 6){

			this.state.inputValue = inputValue;
							
			GYUserAction.checkPayPwd({
				payPwd:this.state.inputValue
			});	

			//购买果仁接口挂掉没有反应，停止等待状态
			this.timeOut = setTimeout(function(){
				clearTimeout(this.gyLoadingTime);
				this.setState({isGyLoadingShow: false,passwordKeybordErr:'系统繁忙，请稍后再试'});
			}.bind(this),3000);
		}
	};
	//预支付接口
	prePay(){
		GYUserAction.prePay({
			version: this.searchJson.version,
			payType: this.searchJson.payType,
			mercId: this.searchJson.mercId,
			appId: this.searchJson.appId,
			mercOrdrNo: this.searchJson.mercOrdrNo,
			consNo: this.searchJson.consNo,
			ordrDate: this.searchJson.ordrDate,
			singleNo: this.searchJson.singleNo,
			remark: this.searchJson.remark
		});
	}
	//跳转到帮助页面
	changeToHelp(){
		this.context.history.pushState(null, '/help/gop_pay_help?'+LocationSearchJsonToUrl(this.searchJson));	
	}
	//跳转到重置密码页面
	changeToSetPassword(){
		this.searchJson.fromePage = 'is_pay_enough';
		this.context.history.pushState(null,'/sent_phone_code?'+LocationSearchJsonToUrl(this.searchJson));
	}

	render() {
		return (
			<div>
				<div className="help-btn" onClick={function(){this.changeToHelp()}.bind(this)}></div>
				<form autoComplete="off">
					<GopPrice gopInfo = { this.state.gopInfo }></GopPrice>
					<PayInfo payInfo={this.state.payInfo}></PayInfo>
					<UserGopInfo userGopInfo={this.state.userGopInfo}></UserGopInfo>
					<div className="btntop">
						<Button 
							onClick={ function() { this.pay() }.bind(this) } 
							btnState= {this.state.btnState} >
							{this.getBtnDom()}
						</Button>
					</div>
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
				</form>
				<BottomTips bottomtips={this.bottomtips}></BottomTips>
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
					isDialogShow = { this.state.isHaveEnoughGopShow }
					dialogHide={function(){this.setState({isHaveEnoughGopShow:false});this.prePay()}.bind(this)}>
					<p className="dialog-text-align-left dialog-con">{this.state.haveEnoughGopContent}</p>
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
	}
}

//默认属性
IsPayEnough.defaultProps = {
	appNeedTitle:true,
};

/**
 * @desc context
 * @type {{history: *}}
 */
IsPayEnough.contextTypes = {
	history: PropTypes.history,
	location: PropTypes.location
}

export default IsPayEnough;